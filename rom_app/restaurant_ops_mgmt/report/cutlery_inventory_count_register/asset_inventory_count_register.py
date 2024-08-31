import frappe
import yaml
import json


def execute(filters=None):
    print("=========================")
    print(yaml.dump(filters))
    data, columns = [], []
    columns = get_columns()
    cs_data = get_data(filters)

    data = []
    for d in cs_data:
        row = frappe._dict({
            'name': d.name,
            'date': d.date,
            'user_name': d.user_name,
            'branch_name': d.branch_name,
            'category_name': d.category_name,
            'item': d.item,
            'standard_stock': d.standard_stock,
            'current_stock': d.current_stock,
            'difference':  d.difference,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Asset Inventory Count',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Date',
        },
        {
            'fieldname': 'user_name',
            'label': 'User Name',
            'fieldtype': 'Date',
        },
        {
            'fieldname': 'branch_name',
            'label': 'Branch Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'category_name',
            'label': 'Category Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'item',
            'label': 'Item',
            'fieldtype': 'Data',
            'width': '160',
        },
        {
            'fieldname': 'standard_stock',
            'label': 'Std. Stock',
            'fieldtype': 'Int',
        },
        {
            'fieldname': 'current_stock',
            'label': 'Curr. Stock',
            'fieldtype': 'Int',
        },
        {
            'fieldname': 'difference',
            'label': 'Difference',
            'fieldtype': 'Int',
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    ic.name,
    ic.date,
    ic.user_name,
    ic.branch_name,
    ic.category_name,
    icc.item,
    icc.standard_stock,
    icc.current_stock,
    icc.difference
    FROM
    `tabAsset Inventory Count` ic
    INNER JOIN
    `tabAsset Inventory Count Child2` icc
    ON ic.name = icc.parent
        """
    where_cond = f" WHERE ic.`date` between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND ic.branch_id = '{conditions['branch_filter']}' "
    if "category_filter" in conditions:
        where_cond = where_cond + f" AND ic.category_id = '{conditions['category_filter']}' "
    if "item_filter" in conditions:
        where_cond = where_cond + f" AND icc.item LIKE '%{conditions['item_filter']}%' "

    build_sql = f"{build_sql}  {where_cond}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    return data


def get_conditions(filters):
    conditions = {}
    if (type(filters) is str):
        filters = json.loads(filters)

    for key, value in filters.items():
        if filters.get(key):
            conditions[key] = value
    return conditions


@frappe.whitelist()
def get_data_by_difference(filters):
    conditions = get_conditions(filters)
    print("--------  get_data_by_difference ------------")
    print(conditions)
    build_sql = """
    SELECT
    ic.date,
    sum(icc.difference) as difference
    FROM
    `tabAsset Inventory Count` ic
    INNER JOIN
    `tabAsset Inventory Count Child2` icc
    ON ic.name = icc.parent
        """
    where_cond = f" WHERE ic.`date` between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND ic.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By ic.date "
    order_by = " ORDER BY ic.date DESC "

    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    return data


