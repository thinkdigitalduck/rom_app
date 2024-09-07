import datetime
import frappe
import pandas as pd


@frappe.whitelist()
def inventory_summary():
    print("================ inventory_summary START >>>>>>>>>>>>>>>>>")

    df_raw_materials = pd.DataFrame.from_records(get_raw_materials())
    df_pur_orders = pd.DataFrame.from_records(get_purchase_orders())
    df_indnets = pd.DataFrame.from_records(get_indents())
    df_inventory = create_inventory_summary_empty_data_frame()

    print('raw materials \n', df_raw_materials)
    print('purchase orders  \n', df_pur_orders)
    print('indents  \n', df_indnets)
    print('inventory  \n', df_inventory)

    print("---------- process purchase order -------------")
    df_inventory = process_purchase_orders(df_inventory,
                                           df_raw_materials, df_pur_orders)
    print("inventory after purchase order input  \n", df_inventory)

    print("================ inventory_summary END >>>>>>>>>>>>>>>>>")


def process_purchase_orders(df_inventory, df_raw_materials, df_pur_orders):
    # branch_id, date, raw_material, quantity, closing_quantity, price, unit
    for i in range(0, len(df_pur_orders)):
        # print("-------- for loop ---------")
        par_name = df_pur_orders.iloc[i]['par_name']
        chi_name = df_pur_orders.iloc[i]['chi_name']
        branch_id = df_pur_orders.iloc[i]['branch_id']
        date = df_pur_orders.iloc[i]['date']
        raw_material = df_pur_orders.iloc[i]['raw_material']
        unit = df_pur_orders.iloc[i]['unit']
        price = df_pur_orders.iloc[i]['price']
        ord_qty = df_pur_orders.iloc[i]['ord_qty']

        print(par_name, chi_name, branch_id, ' -- ', raw_material, ' -- ',
              unit, ' -- ', price, ' -- ', ord_qty, '-- ', date)

        if i == 0:
            df_inventory = append_raw_material(df_inventory,
                                               branch_id, date,
                                               raw_material, unit,
                                               price, ord_qty)
        else:
            df_available = check_if_raw_material_exists_in_inventory_summary(
                df_inventory, branch_id, raw_material)
            if df_available.empty:
                print('df_available.empty')
                df_inventory = append_raw_material(df_inventory,
                                                   branch_id, date,
                                                   raw_material, unit,
                                                   price, ord_qty)
            else:
                print('df_available.empty - else')
                print(df_available)
                df_inventory = update_inventory_summary(df_inventory,
                                                        branch_id,
                                                        raw_material, ord_qty,
                                                        df_available)

    print('=============== final ==========')
    print(df_inventory)
    return df_inventory


def check_if_raw_material_exists_in_inventory_summary(df_inventory,
                                                      branch_id, raw_material):
    df = df_inventory.loc[(df_inventory['branch_id'] == branch_id)
                          & (df_inventory['raw_material'] == raw_material)]
    print('^^^^^^^^ inside check ^^^^^^^')
    print(df)
    if df.empty:
        print('empty')
    else:
        print('not empty')
    return df


def append_raw_material(df_inventory,
                        branch_id, date,
                        raw_material, unit, price, quantity):
    df_inventory.loc[len(df_inventory.index)] = [branch_id, date, raw_material,
                                                 quantity, 0,
                                                 price, unit]
    return df_inventory


def update_inventory_summary(df_inventory, branch_id,
                             raw_material, ord_qty,
                             df_available):

    index_val = df_available.index[0]
    print('index_val =====> ', index_val)
    quantity = df_available.loc[index_val, 'quantity']
    total_quantity = quantity + ord_qty

    df_inventory.loc[index_val, 'quantity'] = total_quantity
    # df_inventory.loc[(df_inventory['branch_id'] == branch_id)
    #                  & (df_inventory['raw_material'] == raw_material),
    #                  'quantity'] = total_quantity

    return df_inventory


def process_indents(df_inventory, df_raw_materials, df_indnets):
    for row in df_indnets:
        print(row)


def get_raw_materials():
    sql = """
    SELECT name, branch, `date`, item, unit, price, opening_stock
    FROM `tabRaw Material Only`
    ORDER BY branch, item
    """
    table = select_db_data(sql)
    return table


def get_purchase_orders():
    sql = """
    SELECT par.name AS par_name, chi.name AS chi_name,
    par.branch_id, chi.raw_material, chi.unit, chi.price, chi.ord_qty, par.date
    FROM `tabPurchase Order` par
    INNER JOIN `tabPurchase Order Child2` chi
    ON par.name = chi.parent
    WHERE date = DATE(NOW())
    ORDER BY par.branch_id, chi.raw_material
    """
    table = select_db_data(sql)
    return table


def get_indents():
    sql = """
    SELECT par.name, chi.name,
    par.branch_id, chi.raw_material, chi.req_qty, chi.issued_qty, par.date
    FROM `tabChef Indent By Dept` par
    INNER JOIN `tabChef Indent By Dept Child` chi
    ON par.name = chi.parent
    WHERE date = DATE(NOW())
    ORDER BY par.branch_id, chi.raw_material
    """
    table = select_db_data(sql)
    return table


def get_inventory_summary_table_schema():
    sql = """
    SELECT branch_id, `date`, raw_material, closing_quantity, price, unit
    FROM `tabInventory Summary`
    WHERE 1!=1
    """
    table = select_db_data(sql)
    return table


def select_db_data(sql):
    table = frappe.db.sql(sql, as_dict=True)
    return table


def create_inventory_summary_empty_data_frame():
    df = pd.DataFrame()
    columns_add = ['branch_id', 'date',
                   'raw_material', 'quantity', 'closing_quantity',
                   'price', 'unit']
    for col in columns_add:
        df[col] = None
    return df
