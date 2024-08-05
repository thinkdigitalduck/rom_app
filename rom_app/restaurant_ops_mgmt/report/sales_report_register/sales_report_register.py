import frappe
import yaml


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
            'target': d.target,
            'actual_sales': d.actual_sales,
            'no_of_bills': d.no_of_bills,
            'cash_sales': d.cash_sales,
            'card_sales': d.card_sales,
            'online_pay': d.online_pay,
            'swiggy': d.swiggy,
            'zomato_sales': d.zomato_sales,
            'opening_cash': d.opening_cash,
            'expenses': d.expenses,
            'closing_cash': d.closing_cash,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Sales Report',
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
            'fieldname': 'target',
            'label': 'Target',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'actual_sales',
            'label': 'Act Sales',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'no_of_bills',
            'label': 'Total',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'cash_sales',
            'label': 'Cash Sal',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'online_pay',
            'label': 'Online',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'swiggy',
            'label': 'Swiggy',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'zomato_sales',
            'label': 'Zomato',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'opening_cash',
            'label': 'Open Cash',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'expenses',
            'label': 'Expenses',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'closing_cash',
            'label': 'Close Cash',
            'fieldtype': 'Data',
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    name,
    date,
    user_name,
    branch_name,
    target,
    actual_sales,
    no_of_bills,
    cash_sales,
    card_sales,
    online_pay,
    swiggy,
    zomato_sales,
    opening_cash,
    expenses,
    closing_cash
    FROM
    `tabSales Report`
        """
    where_cond = f" WHERE date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "

    build_sql = f"{build_sql}  {where_cond}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    return data


def get_conditions(filters):
    conditions = {}
    for key, value in filters.items():
        if filters.get(key):
            conditions[key] = value
    return conditions

