import argparse
import configparser
import math
import time
import sys
import traceback

import boto3
import pandas as pd
from pymongo import MongoClient

parser = argparse.ArgumentParser(description='Update NIS Score')
parser.add_argument('--date', type=str, help='file date', required=True)
parser.add_argument('--bucket', type=str, default='nis-spark', help='s3 bucket name')
parser.add_argument('--env', type=str, default='qa', choices=['qa', 'prod'], help='app environment')
parser.add_argument('--config', type=str, required=True, help='config file')
args = parser.parse_args()

#
# App Constants
#
BUCKET = args.bucket
PERCENTILE = .99
ROUND = 2
RANK = 'average'

# Read app config
config = configparser.ConfigParser()
config.read(args.config)

session = boto3.Session(profile_name=args.env)

mongo_url = 'mongodb://' + \
            config[args.env]['mdb_username'] + ':' + \
            config[args.env]['mdb_pw'] + '@' + \
            config[args.env]['mdb_address'] + ':' + \
            config[args.env]['mdb_port'] + '/' + \
            config[args.env]['mdb_db']

client = MongoClient(mongo_url)
db = client[config[args.env]['mdb_db']]
collection = db['profiles']


def unordered_bulk_write(data):
    # Initialize bulk operation
    bulk_op = collection.initialize_unordered_bulk_op()
    # Getting current unix epoc time in milliseconds
    t = int(round(time.time() * 1000))

    for row in data.itertuples():
        skill_score = 0 if math.isnan(row.skillscore) else row.skillscore
        connector_score = 0 if math.isnan(row.connectorscore) else row.connectorscore
        bulk_op.find({'userId': row.id}).update({'$set': {'score': {
            'connectorscore': str(connector_score),
            'lastupdated': str(t),
            'skillscore': str(skill_score)
        }}})

    try:
        bulk_op.execute()
    except:
        print('>>> traceback <<<')
        traceback.print_exc()
        print('>>> end of traceback <<<')
        sys.exit(1)


def main():
    try:
        # Read page rank report of Connector score from S3
        c = pd.read_csv(read_file_from_s3('connector'), header=None)
        # Read page rank report of Skill score from S3
        s = pd.read_csv(read_file_from_s3('skill'), header=None)

        # Assing column name for user id and page rank for Connector score
        c.columns = ['id', 'cscore']
        # Assing column name for user id and page rank for Skill score
        s.columns = ['id', 'sscore']

        # Apply average rank method for the Connector score
        c['crank'] = c['cscore'].rank(method=RANK)
        # Find inverse ordinal rank and calculate the percentile of Connector score
        c['connectorscore'] = round(c['crank'] / len(c.index) * PERCENTILE, ROUND)

        # Apply average rank method for the Skill score
        s['srank'] = s['sscore'].rank(method=RANK)
        # Find inverse ordinal rank and calculate the percentile of Skill score
        s['skillscore'] = round(s['srank'] / len(s.index) * PERCENTILE, ROUND)

        # The final output of both connector & skill score
        """
            ------------------------------------------------------------------------
            | User | cscore | crank | connectorscore | sscore | srank | skillscore |
            ------------------------------------------------------------------------
            | A    | 0.25   | 2     | 0.66           | None   | None  | None       |
            | B    | 0.20   | 1     | 0.33           | 0.45   | 1     | 0.50       |
            | C    | 0.55   | 3     | 0.99           | None   | None  | None       |
            | D    | None   | None  | None           | 0.55   | 2     | 0.99       |
            ------------------------------------------------------------------------
        """
        res = pd.merge(c, s, how='outer')

        unordered_bulk_write(res)
    except:
        print('>>> traceback <<<')
        traceback.print_exc()
        print('>>> end of traceback <<<')
        sys.exit(1)


def read_file_from_s3(file):
    try:
        s3 = session.client('s3')
        obj = s3.get_object(Bucket=BUCKET, Key= args.env + '/' + file + '_score_' + args.date + '.csv')
        return obj['Body']
    except:
        print('>>> traceback <<<')
        traceback.print_exc()
        print('>>> end of traceback <<<')
        sys.exit(1)


if __name__ == '__main__':
    main()
