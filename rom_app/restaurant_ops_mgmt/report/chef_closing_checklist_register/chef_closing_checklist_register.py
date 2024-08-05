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
            'date': d.chef_close_date,
            'user_name': d.user_name,
            'branch_name': d.branch_name,
            'chef_close_child_yes': d.chef_close_child_yes,
            'rm_audit': d.rm_audit,
            'chef_close_child_question': d.chef_close_child_question,
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
            'options': 'Chef Closing Checklist',
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
            'fieldname': 'chef_close_child_yes',
            'label': 'Chef Audit',
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
            'fieldname': 'chef_close_child_question',
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
        SELECT coc.name, coc.chef_close_date, coc.user_name, coc.branch_name,
        CASE WHEN cocc.rm_audit = 0 THEN 'No' ELSE 'Yes' END rm_audit,
        CASE WHEN cocc.chef_close_child_yes =0 THEN 'No' ELSE 'Yes' END chef_close_child_yes,
        cocc.chef_close_child_question
        FROM `tabChef Closing Checklist` coc
        JOIN `tabChef Closing Checklist Child` cocc
        ON coc.name= cocc.parent
        """
    where_cond = f" WHERE coc.chef_close_date between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND coc.branch_id = '{conditions['branch_filter']}' "

    if "chef_audit_filter" in conditions:
        selection_result = conditions['chef_audit_filter']
        print(selection_result)
        if selection_result == 'Yes':
            where_cond = where_cond + " AND cocc.chef_close_child_yes = 1 "
        elif (selection_result == 'No'):
            where_cond = where_cond + " AND cocc.chef_close_child_yes = 0 "

    if "rm_audit_filter" in conditions:
        selection_result = conditions['rm_audit_filter']
        print(selection_result)
        if selection_result == 'Yes':
            where_cond = where_cond + " AND cocc.rm_audit = 1 "
        elif (selection_result == 'No'):
            where_cond = where_cond + " AND cocc.rm_audit = 0 "

    if "question_filter" in conditions:
        where_cond = where_cond + f" AND cocc.chef_close_child_question LIKE '%{conditions['question_filter']}%' "

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
