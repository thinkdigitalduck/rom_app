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
            'category': d.category,
            'item': d.item,
            'production_qty': d.production_qty,
            'wastage_qty': d.wastage_qty,
            'wastage_uom': d.wastage_uom,
            'rate': d.rate,
            'wastage_amount': d.wastage_amount,
        })
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            'fieldname': 'name',
            'label': 'Id',
            'fieldtype': 'Link',
            'options': 'Chef Production',
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
        # {
        #     'fieldname': 'branch_id',
        #     'label': 'Branch Id',
        #     'fieldtype': 'Data',
        #     'width': '90'
        # },
        {
            'fieldname': 'category',
            'label': 'Category',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'item',
            'label': 'Item',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'production_qty',
            'label': 'Prod. Qty',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'wastage_qty',
            'label': 'Waste. Qty',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'wastage_uom',
            'label': 'Waste. UOM',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'rate',
            'label': 'Rate',
            'fieldtype': 'Data',

        },
        {
            'fieldname': 'wastage_amount',
            'label': 'Waste. Amt',
            'fieldtype': 'Data',
        }
    ]


@frappe.whitelist(allow_guest=True)
def get_data(filters):

    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
        SELECT * FROM
        (
        (
        SELECT
            parent1.`name`,
            parent1.`date`,
            parent1.`user_name`,
            parent1.`branch_name`,
            parent1.`branch_id`,
            'Briyani' as category,
            child1.`briyani_category` as item,
            child1.`product_qtykg` as production_qty,
            child1.`balance_portion` as wastage_qty,
            child1.`portion` as wastage_uom,
            child1.`rateportion` as rate,
            child1.`wastage_amount` as wastage_amount
        FROM
            `tabChef Production` parent1
        JOIN `tabChef Prod Child Briyani` child1
        ON
            parent1.`name` = child1.`parent`
        )
        UNION
        (
        SELECT
            parent2.`name`,
            parent2.`date`,
            parent2.`user_name`,
            parent2.`branch_name`,
            parent2.`branch_id`,
            'Chicken' as category,
            child2.`chicken_category` as item,
            child2.`production_qty` as production_qty,
            child2.`wastage_pcs` as wastage_qty,
            child2.`uom` as wastage_uom,
            child2.`rate` as rate,
            child2.`wastage_amt` as wastage_amount
        FROM
            `tabChef Production` parent2
        JOIN `tabChef Prod Child Chicken` child2
        ON
            parent2.`name` = child2.`parent`
        )
        )
            AS prod

        """
    where_cond = f" WHERE date between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "
    if "category_filter" in conditions:
        where_cond = where_cond + f" AND category = '{conditions['category_filter']}' "
    if "item_filter" in conditions:
        where_cond = where_cond + f" AND item = '{conditions['item_filter']}' "

    order_by = "ORDER BY prod.name ASC, prod.category ASC"

    build_sql = f"{build_sql}  {where_cond} {order_by}"
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
def get_data_groupby_briyani(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    child1.`briyani_category` as item,
    sum(child1.`wastage_amount`) as wastage_amount
    FROM
    `tabChef Production` parent1
    JOIN `tabChef Prod Child Briyani` child1
    ON
    parent1.`name` = child1.`parent`
    """

    where_cond = f" WHERE parent1.date between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND parent1.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By child1.briyani_category "

    order_by = " ORDER BY item ASC "

    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data


@frappe.whitelist(allow_guest=True)
def get_data_groupby_chicken(filters):
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    child2.chicken_category as item, sum(child2.`wastage_amt`) as wastage_amount
    FROM
    `tabChef Production` parent2
    JOIN `tabChef Prod Child Chicken` child2
    ON
    parent2.`name` = child2.`parent`
    """

    where_cond = f" WHERE parent2.date between '{conditions['from_date_filter']}' AND  '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND parent2.branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By child2.chicken_category "

    order_by = " ORDER BY item ASC "

    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data
