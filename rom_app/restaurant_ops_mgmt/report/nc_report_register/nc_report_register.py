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
            'nc': d.nc,
            'date_time': d.date_time,
            'responsible_person': d.responsible_person,
            'reported_by': d.reported_by,
            'employee': d.employee,
            'remarks': d.remarks
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'NC Report',
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
            'fieldname': 'department_name',
            'label': 'Department',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'nc',
            'label': 'NC Desc',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'date_time',
            'label': 'Time',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'responsible_person',
            'label': 'Res. person',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'reported_by',
            'label': 'Reported By',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'employee',
            'label': 'Employee',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'remarks',
            'label': 'Remarks',
            'fieldtype': 'Data',
        },
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    nc.name,
    nc.date,
    nc.user_name,
    nc.branch_name,
    dep.department_name,
    nc.nc,
    nc.date_time,
    nc.responsible_person,
    nc.reported_by,
    nc.employee,
    nc.remarks
    FROM
    `tabNC Report` nc
     INNER JOIN
    `tabDepartment` dep
    ON
    nc.department = dep.name
        """
    where_cond = f" WHERE nc.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND nc.branch_id = '{conditions['branch_filter']}' "
    if "department_filter" in conditions:
        where_cond = where_cond + f" AND nc.department = '{conditions['department_filter']}' "
    if "nc_filter" in conditions:
        where_cond = where_cond + f" AND nc.nc LIKE '%{conditions['nc_filter']}%' "
    if "employee_filter" in conditions:
        where_cond = where_cond + f" AND nc.employee LIKE '%{conditions['employee_filter']}%' "
    if "responsible_person_filter" in conditions:
        where_cond = where_cond + f" AND nc.responsible_person LIKE '%{conditions['responsible_person_filter']}%' "
    if "reported_by_filter" in conditions:
        where_cond = where_cond + f" AND nc.reported_by LIKE '%{conditions['reported_by_filter']}%' "

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
    nc.date as date,
    count(nc.name) as count
    FROM
    `tabNC Report` nc
     INNER JOIN
    `tabDepartment` dep
    ON
    nc.department = dep.name
        """
    where_cond = f" WHERE nc.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND nc.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By date "
    order_by = " ORDER BY date DESC "
    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"

    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data




