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
            'quantity': d.quantity,
            'employee': d.employee,
            'cost': d.cost,
            'remarks': d.remarks,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Breakages Report',
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
            'fieldname': 'category_name',
            'label': 'Category Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'item',
            'label': 'Item',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'quantity',
            'label': 'Quantity',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'employee',
            'label': 'Employee',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'cost',
            'label': 'Cost',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'remarks',
            'label': 'Remarks',
            'fieldtype': 'Data',
        },
    ]

@frappe.whitelist()
def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    br.name,
    br.`date`,
    br.user_name,
    br.branch_name,
    br.date_time,
    br.branch_id,
    cm.item ,
    br.quantity,
    br.employee,
    br.cost,
    br.remarks,
    br.category_name,
    br.category_id
    FROM
    `tabBreakages Report` br
    INNER JOIN
    `tabCutlery Master` cm
    ON
    br.item = cm.name
        """
    where_cond = f" WHERE br.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND br.branch_id = '{conditions['branch_filter']}' "
    if "cutlery_master__filter" in conditions:
        where_cond = where_cond + f" AND cm.name = '{conditions['cutlery_master__filter']}' "
    if "employee_filter" in conditions:
        where_cond = where_cond + f" AND br.employee LIKE '%{conditions['employee_filter']}%' "


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
def get_data_by_group_by_date(filters):
    conditions = get_conditions(filters)
    print("--------  get_data_by_group_by_date ------------")
    print(conditions)
    build_sql = """
    SELECT
    br.`date` as date,
   sum(br.cost) as cost
    FROM
    `tabBreakages Report` br
    INNER JOIN
    `tabCutlery Master` cm
    ON
    br.item = cm.name
        """
    where_cond = f" WHERE br.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND br.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By date "
    order_by = " ORDER BY date DESC "
    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"

    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data
