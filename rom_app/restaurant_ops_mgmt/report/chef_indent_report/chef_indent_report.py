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
            'branch_name': d.branch_name,
            'department_name': d.department_name,
            'item': d.item,
            'uom': d.uom,
            'required_qty': d.required_qty,
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
            'options': 'Chef Indent',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Date',
            'width': '120'
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
            'fieldname': 'item',
            'label': 'Raw Material',
            'fieldtype': 'Data',
            'width': '180'
        },
        {
            'fieldname': 'uom',
            'label': 'UOM',
            'fieldtype': 'Data',
            'width': '90'
        },
        {
            'fieldname': 'required_qty',
            'label': 'Req Qty',
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
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
        SELECT ci.`name`, ci.`date`, ci.branch_name,
        d.department_name, rm.item,
        cic.uom, cic.required_qty,
        CASE WHEN ci.rm_approval = 0 THEN 'No' ELSE 'Yes' END rm_approval,
        cic.remarks
        FROM `tabChef Indent` ci
        INNER JOIN `tabChef Indent Child` cic on ci.name = cic.parent
        INNER JOIN `tabDepartment` d on cic.department = d.name
        INNER JOIN `tabRaw Material` rm on cic.raw_material = rm.name
        """
    where_cond = f" WHERE ci.`date` between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND ci.branch_id = '{conditions['branch_filter']}' "
    if "department_filter" in conditions:
        where_cond = where_cond + f" AND cic.department = '{conditions['department_filter']}' "
    if "raw_material_filter" in conditions:
        where_cond = where_cond + f" AND cic.raw_material = '{conditions['raw_material_filter']}' "

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

