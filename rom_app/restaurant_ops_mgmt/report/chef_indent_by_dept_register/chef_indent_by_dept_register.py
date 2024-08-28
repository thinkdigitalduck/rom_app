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
            'department_name': d.department_name,
            'raw_material': d.raw_material,
            'unit': d.unit,
            'req_qty': d.req_qty,
            'issued_qty': d.issued_qty,
            'rm_approval': d.rm_approval,
            'remarks':  d.remarks,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'width': '80',
            'options': 'Chef Indent By Dept',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Date',
            'width': '120'
        },
        {
            'fieldname': 'user_name',
            'label': 'User Name',
            'fieldtype': 'Data',
            'width': '140'
        },
        {
            'fieldname': 'branch_name',
            'label': 'Branch Name',
            'fieldtype': 'Data',
            'width': '140'
        },
        {
            'fieldname': 'department_name',
            'label': 'Department',
            'fieldtype': 'Data',
            'width': '140'
        },
        {
            'fieldname': 'raw_material',
            'label': 'Raw Material',
            'fieldtype': 'Data',
            'width': '180'
        },
        {
            'fieldname': 'unit',
            'label': 'Unit',
            'fieldtype': 'Data',
            'width': '90'
        },
        {
            'fieldname': 'req_qty',
            'label': 'Req Qty',
            'fieldtype': 'Data',
            'width': '80'
        },
        {
            'fieldname': 'issued_qty',
            'label': 'Issue Qty',
            'fieldtype': 'Data',
            'width': '80'
        },
        {
            'fieldname': 'rm_approval',
            'label': 'RM Appr',
            'fieldtype': 'Data',
            'width': '80'
        },
        {
            'fieldname': 'remarks',
            'label': 'Remarks',
            'fieldtype': 'Data',
            'width': '160',
            "align": 'left',
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- chef indent register - get data ------------")
    print(conditions)
    build_sql_1 = """
    SELECT
    ci.`name`, ci.`date`, ci.user_name,	ci.branch_name,	d.department_name, ci.rm_approval,
    cic.raw_material, cic.unit,	cic.req_qty, cic.issued_qty, cic.remarks
    FROM
    `tabChef Indent By Dept` ci
    INNER JOIN `tabChef Indent By Dept Child` cic on
    ci.name = cic.parent
    INNER JOIN `tabDepartment` d on
    ci.department = d.name
        """
    where_cond_1 = f" WHERE ci.`date` between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond_1 = where_cond_1 + f" AND ci.branch_id = '{conditions['branch_filter']}' "
    if "department_filter" in conditions:
        where_cond_1 = where_cond_1 + f" AND ci.department = '{conditions['department_filter']}' "
    if "raw_material_filter" in conditions:
        where_cond_1 = where_cond_1 + f" AND cic.raw_material LIKE '%{conditions['raw_material_filter']}%' "

    build_sql_2 = """
    SELECT
    ci.`name`, ci.`date`, ci.user_name,	ci.branch_name,	d.department_name,	ci.rm_approval,
    cic.raw_material, cic.unit, cic.req_qty, cic.issued_qty, cic.remarks
    FROM
    `tabChef Indent By Dept` ci
    INNER JOIN `tabChef Indent By Dept Child Additional` cic on
    ci.name = cic.parent
    INNER JOIN `tabDepartment` d on
    ci.department = d.name
        """
    where_cond_2 = f" WHERE ci.`date` between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond_2 = where_cond_2 + f" AND ci.branch_id = '{conditions['branch_filter']}' "
    if "department_filter" in conditions:
        where_cond_2 = where_cond_2 + f" AND ci.department = '{conditions['department_filter']}' "
    if "raw_material_filter" in conditions:
        where_cond_2 = where_cond_2 + f" AND cic.raw_material LIKE '%{conditions['raw_material_filter']}%' "

    build_sql = f"{build_sql_1}  {where_cond_1}   UNION ALL  {build_sql_2}  {where_cond_2}"
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

    build_sql_1 = """
    SELECT ci.`date`, cic.req_qty, cic.issued_qty
    FROM `tabChef Indent By Dept` ci
    INNER JOIN `tabChef Indent By Dept Child` cic on ci.name = cic.parent
    INNER JOIN `tabDepartment` d on ci.department = d.name
    """
    where_cond_1 = f" WHERE ci.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond_1 = where_cond_1 + f" AND ci.branch_id = '{conditions['branch_filter']}' "
    build_sql_1 = f"{build_sql_1}  {where_cond_1}"
    print("-------- build_sql_1 ------------")
    print(build_sql_1)

    build_sql_2 = """
    SELECT ci.`date`, cic.req_qty, cic.issued_qty
    FROM `tabChef Indent By Dept` ci
    INNER JOIN `tabChef Indent By Dept Child Additional` cic on ci.name = cic.parent
    INNER JOIN `tabDepartment` d on ci.department = d.name
    """
    where_cond_2 = f" WHERE ci.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond_2 = where_cond_2 + f" AND ci.branch_id = '{conditions['branch_filter']}' "
    build_sql_2 = f"{build_sql_2}  {where_cond_2}"

    print("-------- build_sql_2 ------------")
    print(build_sql_2)

    build_sql_top = "SELECT  tmp.date AS date, sum(req_qty) AS req_qty , sum(issued_qty) AS issued_qty FROM ("
    build_sql_bottom = " ) AS tmp "
    group_by = " GROUP By tmp.date "
    order_by = " ORDER BY tmp.date DESC "

    build_sql = f"{build_sql_top} {build_sql_1} UNION {build_sql_2} {build_sql_bottom} {group_by} {order_by}"

    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data
