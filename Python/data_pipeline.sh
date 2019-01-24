#!/usr/bin/env bash

# Verifying the environment
# sh data_pipeline.sh qa
if [ "$1" = "prod" ]
then
    echo "Environment: Prod"
elif [ "$1" = "qa" ]
then
    echo "Environment: QA"
else
    echo "Environment should be qa or prod"
    exit
fi

# Project directory
directoryName="Test-Spark"

# Assigning the environment
appenv=$1
# S3 bucket
bucket="nis-spark"
# tolerance level
tol="0.0001"
# Reset probability
resetProb="0.15"
# Jar path for Apache Spark
jar="/home/hadoop/${directoryName}/NIS-Score-Scala/target/scala-2.11/nis-score-scala_2.11-0.1.jar"
# Required packages for Hadoop
packages="com.amazonaws:aws-java-sdk-pom:1.10.34,org.apache.hadoop:hadoop-aws:2.7.2"
# Class name for PageRank
class="NISPageRank"
# Application config file
config="/home/hadoop/${directoryName}/config.ini"
# setting the AWS profile with the application's environment
export AWS_PROFILE=$1

# date is dynamically determined
mydate=`date '+%Y-%m-%d_%H_%M_%S'`

# Clean job logs
remove_logs() {
    # Remove cron job log
    rm /tmp/"nis_score_log_${appenv}.log"
    hdfs dfs -rm -skipTrash /var/log/spark/apps/local*
}

# Email recipients
MAILLIST="aruljothi@calibraint.com"
# Handle sys exit
handle_exit() {
    ret=$?
    if [ $ret -ne 0 ]; then
        echo "Something went wrong: $mydate"
        mail -s"NIS Job Failed: $mydate" -a /tmp/"nis_score_log_${appenv}.log" $MAILLIST < /dev/null
        remove_logs
        exit
    fi
}

# score file input
connector="${appenv}/connector_${mydate}.txt"
skill="${appenv}/skill_${mydate}.txt"

# Run R code (Alex code)
# Eg: /bin/Rscript ./R/nis-spark-input.r qa nis-spark qa/connector_2017-10-20_07_51_07.txt qa/skill_2017-10-20_07_51_07.txt ./config.ini
/bin/Rscript ./R/nis-spark-input.r $appenv $bucket $connector $skill $config

handle_exit

# Run AWS to cp from local to S3 ()
aws s3 cp $connector s3://$bucket/$connector
# Run AWS to cp from local to S3
aws s3 cp $skill s3://$bucket/$skill

# Generate Graphx support relationship files
# Since the Grapx input requires long format as input type hence we are forced to
# uniquely index the user ids with number, this enables Graphx
# to match the numbers in finding the relationship for each user ids.
# Input format
# 044ce330-a167-11e6-b491-adb02b5e7c83 335d3290-9f98-11e6-8899-75e15b794898
# fbd03dc0-9f99-11e6-8899-75e15b794898 335d3290-9f98-11e6-8899-75e15b794898
# 221c3170-7896-11e7-93a2-f3dceb884ec6 5260c6d0-d831-11e6-9dbf-67df99f2a8c2
# fbd03dc0-9f99-11e6-8899-75e15b794898 335d3290-9f98-11e6-8899-75e15b794898
# 335d3290-9f98-11e6-8899-75e15b794898 fbd03dc0-9f99-11e6-8899-75e15b794898
# 335d3290-9f98-11e6-8899-75e15b794898 8d174de0-6fe8-11e7-b93b-39e0c76e57a8
# Output format #1 followers.txt
# 1 2
# 1 3
# 2 3
# 3 4
# 4 3
# Output format #2 users.txt
# 1,044ce330-a167-11e6-b491-adb02b5e7c83
# 2,fbd03dc0-9f99-11e6-8899-75e15b794898
# 3,221c3170-7896-11e7-93a2-f3dceb884ec6
# 4,335d3290-9f98-11e6-8899-75e15b794898
# 5,8d174de0-6fe8-11e7-b93b-39e0c76e57a8

# Eg: python PageRankHelperScala.py 2017-10-20_07_51_07 qa/connector_2017-10-20_07_51_07.txt qa/connector
# Eg: python PageRankHelperScala.py 2017-10-20_07_51_07 qa/skill_2017-10-20_07_51_07.txt qa/skill
/home/hadoop/anaconda3/envs/py34/bin/python PageRankHelperScala.py $mydate $connector "${appenv}/connector"

handle_exit

/home/hadoop/anaconda3/envs/py34/bin/python PageRankHelperScala.py $mydate $skill "${appenv}/skill"

handle_exit

connector_followers="connector_followers_${mydate}.txt"
connector_users="connector_users_${mydate}.txt"
skill_followers="skill_followers_${mydate}.txt"
skill_users="skill_users_${mydate}.txt"

# Run AWS to cp from local to S3 ()
aws s3 cp $appenv/$connector_followers s3://$bucket/$appenv/$connector_followers
aws s3 cp $appenv/$connector_users s3://$bucket/$appenv/$connector_users
aws s3 cp $appenv/$skill_followers s3://$bucket/$appenv/$skill_followers
aws s3 cp $appenv/$skill_users s3://$bucket/$appenv/$skill_users

# Remove the local files
rm $connector $skill $appenv/$connector_followers $appenv/$connector_users $appenv/$skill_followers $appenv/$skill_users

connector_score="${appenv}/connector_score_${mydate}"
skill_score="${appenv}/skill_score_${mydate}"

# Run PageRank
# local[2], 2 indicates no of cores
# lscpu | egrep '^Thread|^Core|^Socket|^CPU\('
# Eg: spark-submit --class "NISPageRank" --packages com.amazonaws:aws-java-sdk-pom:1.10.34,org.apache.hadoop:hadoop-aws:2.7.2 --master local[2] nis-score-scala_2.11-0.1.jar followers.txt users.txt 0.15 0.0001
/usr/bin/spark-submit --class $class --packages $packages --master local[2] $jar s3n://$bucket/$appenv/$connector_followers s3n://$bucket/$appenv/$connector_users $connector_score $resetProb $tol

handle_exit

/usr/bin/spark-submit --class $class --packages $packages --master local[2] $jar s3n://$bucket/$appenv/$skill_followers s3n://$bucket/$appenv/$skill_users $skill_score $resetProb $tol

handle_exit

# Group partion files
hdfs dfs -cat /user/hadoop/$connector_score/part-* > /home/hadoop/$directoryName/"${connector_score}.csv"
hdfs dfs -cat /user/hadoop/$skill_score/part-* > /home/hadoop/$directoryName/"${skill_score}.csv"

# Run AWS to cp from local to S3 ()
aws s3 cp "${connector_score}.csv" s3://$bucket/"${connector_score}.csv"
aws s3 cp "${skill_score}.csv" s3://$bucket/"${skill_score}.csv"

# Remove partion directories
rm -rf "${connector_score}.csv"
rm -rf "${skill_score}.csv"

# Remove partition files
hdfs dfs -rm -r -f /user/hadoop/$connector_score
hdfs dfs -rm -r -f /user/hadoop/$skill_score

# Update NIS Score
/home/hadoop/anaconda3/envs/py34/bin/python ./Spark/UpdateNISScore.py --env $appenv --bucket $bucket --date $mydate --config $config

handle_exit

# Run AWS to cp from local to S3 ()
aws s3 cp /tmp/"nis_score_log_${appenv}.log" s3://$bucket/$appenv/logs/"nis_score_${mydate}.log"

# Remove spark job logs
hdfs dfs -rm -skipTrash /var/log/spark/apps/local*

remove_logs
