import frappe
import yaml
import json


@frappe.whitelist()
def inventory_transaction_by_amount_data(filters):
    print("inventory_transaction_by_amount_data")
    conditions = get_conditions(filters)
    print("-------- get data ------------")
    print(conditions)
    build_sql = """
    SELECT
    date,
    sum(target) as target,
    sum(actual_sales) as actual_sales,
    sum(cash_sales) as cash_sales,
    sum(card_sales) as card_sales,
    sum(online_pay) as online_pay,
    sum(swiggy) as swiggy,
    sum(zomato_sales) as zomato_sales
    FROM
    `tabSales Report`
        """
    where_cond = f" WHERE date between '{conditions['from_date_filter']}' AND '{conditions['to_date_filter']}' "
    if "branch_filter" in conditions:
        where_cond = where_cond + f" AND branch_id = '{conditions['branch_filter']}' "

    group_by = " GROUP By date "
    order_by = " ORDER BY date DESC "

    build_sql = f"{build_sql}  {where_cond} {group_by} {order_by}"
    print("-------- full sql ------------")
    print(build_sql)
    data = frappe.db.sql(build_sql, as_dict=True)
    print(data)
    return data


def get_conditions(filters):
    conditions = {}
    if (type(filters) is str):
        filters = json.loads(filters)

    for key, value in filters.items():
        if filters.get(key):
            conditions[key] = value
    return conditions
