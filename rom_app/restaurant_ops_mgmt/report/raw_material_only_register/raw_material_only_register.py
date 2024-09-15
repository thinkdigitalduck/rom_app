import frappe
import yaml
import json


def execute(filters=None):
    print("=========================")
    print(yaml.dump(filters))
    data, columns = [], []
    columns = get_columns()
    cs_data = get_data(filters)
    # branch - item -unit -price -date - opening_stock  -
    # opening_amount - closing_stock - min_stock -
    data = []
    for d in cs_data:
        row = frappe._dict({
            'name': d.name,
            'date': d.date,
            'branch': d.branch,
            'item': d.item,
            'unit': d.unit,
            'price': d.price,
            'opening_stock': d.opening_stock,
            'opening_amount': d.opening_amount,
            'closing_stock': d.closing_stock,
            'min_stock': d.min_stock
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'branch',
            'label': 'Branch',
            "fieldtype": "Link",
            "options": "Branch",
        },
        {
            'fieldname': 'user_name',
            'label': 'User Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'item',
            'label': 'Item',
            'fieldtype': 'Data',
            'width': 350
        },
        {
            'fieldname': 'unit',
            'label': 'Unit',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'price',
            'label': 'Price',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'opening_stock',
            'label': 'Open. Stock',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'opening_amount',
            'label': 'Open. Amount',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'closing_stock',
            'label': 'Close. Stock',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'min_stock',
            'label': 'Min Stock',
            'fieldtype': 'Data',
        }
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    sql = build_sql(conditions)
    print("-------- full sql ------------")
    print(sql)
    data = frappe.db.sql(sql, as_dict=True)
    return data


def build_sql(conditions):
    sql = """
    SELECT name,   branch,  item, unit, price,
    opening_stock, opening_amount, closing_stock,
    min_stock, `date` FROM `tabRaw Material Only`;
    """
    # full_sql = get_where_filter(sql, conditions)
    return sql


# def get_where_filter(sql, conditions):
#     where_cond = f" WHERE par.`date` between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
#     if "branch_filter" in conditions:
#         where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "
#     if "raw_material_filter" in conditions:
#         where_cond = where_cond + f" AND raw_material = '{conditions['raw_material_filter']}' "
#     sql = f"{sql}  {where_cond}"
#     return sql


def get_conditions(filters):
    conditions = {}
    if (type(filters) is str):
        filters = json.loads(filters)

    for key, value in filters.items():
        if filters.get(key):
            conditions[key] = value
    return conditions
