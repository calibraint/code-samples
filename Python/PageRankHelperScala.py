#!/usr/bin/python

import sys
import traceback


def main():
    try:
        file = sys.argv[2]

        rows = []
        with open(file) as f:
            for line in f:
                for id in line.split(' '):
                    rows.append(id.strip())

        # Remove duplicate rows
        users = list(set(rows))
        # Followers relationship
        followers = []
        with open(file) as f:
            for line in f:
                row = line.split(' ')
                followers.append(str(users.index(row[0].strip())) + ' ' + str(users.index(row[1].strip())))

        followers_file = open(sys.argv[3] + "_followers_" + sys.argv[1] + ".txt", "w")
        for item in followers:
            followers_file.write("%s\n" % item)

        # User records with id
        people = []
        for i, v in enumerate(users):
            people.append(str(i) + ',' + v)

        users_file = open(sys.argv[3] + "_users_" + sys.argv[1] + ".txt", "w")
        for item in people:
            users_file.write("%s\n" % item)
    except:
        print('>>> traceback <<<')
        traceback.print_exc()
        print('>>> end of traceback <<<')
        sys.exit(1)


if __name__ == '__main__':
    main()
