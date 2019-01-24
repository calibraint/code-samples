import argparse
import configparser
import glob
import os

import boto3
from graphframes import *
from pyspark import SparkContext
from pyspark.sql import SQLContext

parser = argparse.ArgumentParser(description='Process NIS Score')
parser.add_argument('--profile', type=str, default='default', help='aws profile name')
parser.add_argument('--bucket', type=str, default='nis-spark', help='s3 bucket name')
parser.add_argument('--probability', type=float, default=0.15,
                    help='Probability of resetting to a random vertex.')
parser.add_argument('--tol', type=float, default=0.01,
                    help='If set, the algorithm is run until the given tolerance.')
parser.add_argument('--file', type=str, help='connector or skill score file', choices=['connector', 'skill'],
                    required=True)
parser.add_argument('--date', type=str, help='file date', required=True)
args = parser.parse_args()

#
# Reading environment variables from aws credential file
#
config = configparser.ConfigParser()
config.read(os.path.expanduser('~/.aws/credentials'))

try:
    access_id = config.get(args.profile, 'aws_access_key_id')
    access_key = config.get(args.profile, 'aws_secret_access_key')
except Exception:
    print('Oops! Please verify aws credentials configured ~/.aws/credentials')
    exit()


#
# App Constants
#
BUCKET = args.bucket
TMP_PATH = '/tmp/' + BUCKET
SCORE_PATH = TMP_PATH + '/scores/'


#
# Configuring pyspark
#
sc = SparkContext()
sqlContext = SQLContext(sc)

hadoop_conf = sc._jsc.hadoopConfiguration()
hadoop_conf.set('fs.s3n.awsAccessKeyId', access_id)
hadoop_conf.set('fs.s3n.awsSecretAccessKey', access_key)


def main():
    init_job()


def init_job():
    ctx = read_file_from_s3(args.file + '-' + args.date + '.txt')
    data, id = parse_file(ctx)
    v, e = create_spark_data_frames(id, data)
    g = create_graph_frame(v, e)
    find_pagerank(g)


def read_file_from_s3(file):
    return sc.textFile('s3n://' + BUCKET + '/rscript/' + file)


def parse_file(ctx):
    data = ctx.map(lambda r: r.split(' '))
    uids = data.reduce(lambda x, y: x + y)
    id = list(set(uids))

    return data, id


def create_spark_data_frames(vdata, edata):
    v = sqlContext.createDataFrame([(value,) for value in vdata], ['id'])
    e = sqlContext.createDataFrame(edata, ['src', 'dst'])

    return v, e


def create_graph_frame(v, e):
    return GraphFrame(v, e)


def find_pagerank(g):
    res = g.pageRank(resetProbability=args.probability, tol=args.tol)
    res.vertices.select('id', 'pagerank').orderBy('pagerank').write.mode('overwrite').format('csv').save(
        SCORE_PATH + args.file)
    group_files_into_single()
    move_to_s3()
    sc.stop()
    exit()


def group_files_into_single():
    read_files = glob.glob(SCORE_PATH + args.file + '/*.csv')
    with open(SCORE_PATH + args.file + '/' + args.file + '.csv', 'wb') as outfile:
        for f in read_files:
            with open(f, 'rb') as infile:
                outfile.write(infile.read())


def move_to_s3():
    s3 = boto3.resource('s3')
    obj = s3.Object(BUCKET, 'pagerank/' + args.file + '-' + args.date + '.csv')
    obj.put(Body=open(SCORE_PATH + '/' + args.file + '/' + args.file + '.csv', 'rb'))


if __name__ == '__main__':
    main()
