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
            'known_to': d.known_to,
            'customer_name': d.customer_name,
            'bill_value': d.bill_value,
            'discount_percentage': d.discount_percentage
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Discount Form',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'user_name',
            'label': 'User Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'branch_name',
            'label': 'Branch Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'known_to',
            'label': 'Known To',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'customer_name',
            'label': 'Customer_name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'bill_value',
            'label': 'Bill Value',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'discount_percentage',
            'label': 'Discount %',
            'fieldtype': 'Data',
        }
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
        SELECT
        name,
        branch_name,
        user_name,
        `date`,
        known_to,
        customer_name,
        bill_value,
        discount_percentage
        FROM
        `tabDiscount Form`
        """
    where_cond = f" WHERE date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "
    if "known_to_filter" in conditions:
        where_cond = where_cond + f" AND known_to LIKE '%{conditions['known_to_filter']}%' "
    if "customer_name_filter" in conditions:
        where_cond = where_cond + f" AND customer_name LIKE '%{conditions['customer_name_filter']}%' "

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
def get_data_by_percentage(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
        SELECT
        `date`,
        sum(bill_value) as bill_value,
        sum(discount_percentage) as percentage
        FROM
        `tabDiscount Form`
        """
    where_cond = f" WHERE date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By date "
    order_by = " ORDER BY date DESC "
    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    return data
