import frappe
import yaml


def execute(filters=None):
    columns, data = [], []
    print("=========================")
    print(yaml.dump(filters))
    if not filters:
        print("no filters")
    else:
        print("filters avail")

    str1 = str(filters)
    dict2 = eval(str1)
    print(dict2)
    return columns, data
