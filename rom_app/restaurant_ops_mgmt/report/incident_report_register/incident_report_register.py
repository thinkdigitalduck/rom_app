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
            'customer_name': d.customer_name,
            'table_no': d.table_no,
            'incident_date_time': d.incident_date_time,
            'captain_name': d.captain_name,
            'amount': d.amount,
            'handled_by': d.handled_by,
            'type_of_complaint': d.type_of_complaint,
            'action_for_complaint': d.action_for_complaint,
            'result_of_action': d.result_of_action,
            'department_name': d.department_name,
            'remarks': d.remarks,
            'informed_to_authority': d.informed_to_authority,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Incident Report',
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
            'fieldname': 'customer_name',
            'label': 'Customer Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'table_no',
            'label': 'Table No',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'incident_date_time',
            'label': 'Incident Date',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'captain_name',
            'label': 'Captain Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'amount',
            'label': 'Amount',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'handled_by',
            'label': 'Handled By',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'type_of_complaint',
            'label': 'Type of Complaint',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'action_for_complaint',
            'label': 'Action for Complaint',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'result_of_action',
            'label': 'Result of Action',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'department_name',
            'label': 'Department Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'remarks',
            'label': 'Remarks',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'informed_to_authority',
            'label': 'Informed to Authority',
            'fieldtype': 'Data',
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    ir.name,
    ir.date,
    ir.user_name,
    ir.branch_name,
    ir.customer_name,
    ir.table_no,
    ir.incident_date_time,
    ir.captain_name,
    ir.amount,
    ir.handled_by,
    ir.type_of_complaint,
    ir.action_for_complaint,
    ir.result_of_action,
    td.department_name,
    ir.remarks,
    ir.informed_to_authority
    FROM
    `tabIncident Report` ir
    INNER JOIN
    tabDepartment td
    ON
    ir.responsible_department  = td.name
        """
    where_cond = f" WHERE ir.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND ir.branch_id = '{conditions['branch_filter']}' "

    if "customer_name_filter" in conditions:
        where_cond = where_cond + f" AND ir.customer_name LIKE '%{conditions['customer_name_filter']}%' "
    if "captain_name_filter" in conditions:
        where_cond = where_cond + f" AND ir.captain_name LIKE '%{conditions['captain_name_filter']}%' "
    if "handled_by_filter" in conditions:
        where_cond = where_cond + f" AND ir.handled_by LIKE '%{conditions['handled_by_filter']}%' "

    if "type_of_complaint_filter" in conditions:
        where_cond = where_cond + f" AND ir.type_of_complaint = '{conditions['type_of_complaint_filter']}' "
    if "action_for_complaint_filter" in conditions:
        where_cond = where_cond + f" AND ir.action_for_complaint = '{conditions['action_for_complaint_filter']}' "
    if "result_of_action_filter" in conditions:
        where_cond = where_cond + f" AND ir.result_of_action = '{conditions['result_of_action_filter']}' "

    if "department_filter" in conditions:
        where_cond = where_cond + f" AND td.name = '{conditions['department_filter']}' "


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


@frappe.whitelist(allow_guest=True)
def get_data_by_count(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    ir.date as date,
    count(ir.name) as count
    FROM
    `tabIncident Report` ir
    INNER JOIN
    tabDepartment td
    ON
    ir.responsible_department  = td.name
        """
    where_cond = f" WHERE ir.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND ir.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By date "
    order_by = " ORDER BY date DESC "
    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"

    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data
