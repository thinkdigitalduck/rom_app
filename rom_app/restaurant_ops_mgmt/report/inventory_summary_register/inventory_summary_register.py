import frappe
import yaml
import json


def execute(filters=None):
    print("=========================")
    print(yaml.dump(filters))
    data, columns = [], []
    columns = get_columns()
    cs_data = get_data(filters)
    # branch_id date raw_material quantity price unit closing_quantity
    data = []
    for d in cs_data:
        row = frappe._dict({
            'name': d.name,
            'date': d.date,
            'branch_name': d.branch_name,
            'raw_material': d.raw_material,
            'quantity': d.quantity,
            'unit': d.unit,
            'price': d.price,
            'closing_quantity': d.closing_quantity,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Inventory Summary',
        },
        {
            'fieldname': 'date',
            'label': 'Date',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'branch_name',
            'label': 'Branch Name',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'raw_material',
            'label': 'Raw Material',
            'fieldtype': 'Data',
            'width': 400
        },
        {
            'fieldname': 'quantity',
            'label': 'Today Qty',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'unit',
            'label': 'Unit',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'price',
            'label': 'Price',
            'fieldtype': 'Data',
        },
        {
            'fieldname': 'closing_quantity',
            'label': 'Closing Stock',
            'fieldtype': 'Data',
        }
    ]


def get_data(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    inv.name,
    inv.date,
    raw.item as raw_material,
    bra.branch_name,
    inv.quantity,
    inv.price,
    inv.unit,
    inv.closing_quantity
    FROM `tabInventory Summary` inv
    INNER JOIN `tabRaw Material Only` raw ON inv.raw_material = raw.name
    INNER JOIN `tabBranch` bra ON inv.branch_id = bra.name
        """
    where_cond = f" WHERE inv.date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "

    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND inv.branch_id = '{conditions['branch_filter']}' "
    if "raw_material_filter" in conditions:
        where_cond = where_cond + f" AND inv.raw_material = '{conditions['raw_material_filter']}' "

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
