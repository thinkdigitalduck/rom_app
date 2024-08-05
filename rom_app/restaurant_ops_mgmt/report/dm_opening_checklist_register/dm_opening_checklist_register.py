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
            'date': d.dm_open_date,
            'user_name': d.user_name,
            'branch_name': d.branch_name,
            'dm_open_child_yes': d.dm_open_child_yes,
            'rm_audit': d.rm_audit,
            'dm_open_child_question': d.dm_open_child_question,
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
            'options': 'Dm Opening Checklist',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Data',
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
            'fieldname': 'dm_open_child_yes',
            'label': 'DM Audit',
            'fieldtype': 'Data',
            'width': '110'
        },
        {
            'fieldname': 'rm_audit',
            'label': 'RM Audit',
            'fieldtype': 'Data',
            'width': '110'
        },
        {
            'fieldname': 'dm_open_child_question',
            'label': 'Question',
            'fieldtype': 'Data',
            'width': '220',
            "align": 'left',
        }
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
        SELECT coc.name, coc.dm_open_date, coc.user_name, coc.branch_name,
        CASE WHEN cocc.dm_open_child_yes =0 THEN 'No' ELSE 'Yes' END dm_open_child_yes,
        CASE WHEN cocc.rm_audit = 0 THEN 'No' ELSE 'Yes' END rm_audit,
        cocc.dm_open_child_question
        FROM `tabDm Opening Checklist` coc
        JOIN `tabDm Opening Checklist Child` cocc
        ON coc.name= cocc.parent
        """
    where_cond = f" WHERE coc.dm_open_date between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND coc.branch_id = '{conditions['branch_filter']}' "

    if "dm_open_child_yes" in conditions:
        selection_result = conditions['dm_open_child_yes']
        print(selection_result)
        if selection_result == 'Yes':
            where_cond = where_cond + " AND cocc.dm_open_child_yes = 1 "
        elif (selection_result == 'No'):
            where_cond = where_cond + " AND cocc.dm_open_child_yes = 0 "

    if "rm_audit_filter" in conditions:
        selection_result = conditions['rm_audit_filter']
        print(selection_result)
        if selection_result == 'Yes':
            where_cond = where_cond + " AND cocc.rm_audit = 1 "
        elif (selection_result == 'No'):
            where_cond = where_cond + " AND cocc.rm_audit = 0 "

    if "question_filter" in conditions:
        where_cond = where_cond + f" AND cocc.dm_open_child_question LIKE '%{conditions['question_filter']}%' "

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

