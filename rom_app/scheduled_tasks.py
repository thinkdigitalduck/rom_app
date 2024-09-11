from datetime import datetime
import frappe
import pandas as pd
from datetime import timedelta


@frappe.whitelist()
def inventory_summary():
    pd.set_option('display.max_columns', None)
    print("================ inventory_summary START >>>>>>>>>>>>>>>>>")
    df_raw_materials = pd.DataFrame.from_records(get_raw_materials())
    df_pur_orders = pd.DataFrame.from_records(get_purchase_orders())
    df_indnets = pd.DataFrame.from_records(get_indents())
    df_wastages = pd.DataFrame.from_records(get_wastages())
    df_inv_counting = pd.DataFrame.from_records(get_inv_counting())
    df_inventory = create_inventory_summary_empty_data_frame()
    yesterday_date = get_yesterday_date()
    # print('yesterday_date')
    print(yesterday_date)
    dict_inv_by_date = get_inventory_summary_for_specific_date(yesterday_date)
    # print('dict_inv_by_date')
    print(dict_inv_by_date)
    df_inv_by_date = pd.DataFrame.from_records(dict_inv_by_date)
    # print('df_inv_by_date')
    print(df_inv_by_date)
    print("*************** - - *******************")
    print(df_inventory.dtypes)
    df_inventory = df_inventory.astype({"branch_id": int, "raw_material": int})
    print(df_inventory.dtypes)
    print('raw materials \n', df_raw_materials)
    print('purchase orders  \n', df_pur_orders)
    print('indents  \n', df_indnets)
    print('wastages  \n', df_wastages)
    print('df_inv_counting  \n', df_inv_counting)
    print('inventory  \n', df_inventory)
    print('df_inv_by_date  \n', df_inv_by_date)
    print("************** = = = ********************")
    print("------ 1 transfer raw_materials to inventory_summary -------")
    df_inventory = transfer_raw_materials_to_inventory_summary(df_inventory, df_raw_materials)
    print('inventory after raw_mat transformation +++[] \n', df_inventory)
    print("------ 2 process purchase order --------------")
    df_inventory = process_purchase_orders(df_inventory, df_pur_orders)
    print("inventory after purchase order input ===[]  \n  ", df_inventory)
    print("------ 3 process indent ----------------")
    df_inventory = process_indents(df_inventory, df_indnets)
    print("inventory after indents input  \n", df_inventory)
    print("------  4 process wastage ----------------")
    df_inventory = process_wastages(df_inventory, df_wastages)
    print("inventory after wastages  \n", df_inventory)
    print("------- 5 inventory counting ---------------")
    print(df_inventory)
    df_inventory = process_inv_counting(df_inventory, df_inv_counting)
    print("inventory after inv counting input  \n", df_inventory)
    print("------- 6 delete today records ---------------")
    delete_inventory_summary_of_today_data()
    print("------- 7 process cumulative data in inv summary ---")
    df_inventory = process_cumulative_data(df_inventory, df_inv_by_date, df_raw_materials)
    print('  process cumulative data in inv summary ++++ \n',df_inventory)
    print("------- 8 bulk insert --------------------")
    bulk_insert_inventory_summary(df_inventory)
    print("------- 9 update raw material table ----------")
    update_raw_material_table_closing_stock(df_inventory)
    print("================ inventory_summary END >>>>>>>>>>>")


#  -------- 1 transfer raw material to inventory summary ------------
def transfer_raw_materials_to_inventory_summary(
        df_inventory, df_raw_materials):
    # df_raw_materials => name, branch, `date`, item,
    # unit, price, opening_stock
    # df_inventory => branch_id, date, raw_material, quantity,
    # closing_quantity, price, unit
    for i in range(0, len(df_raw_materials)):
        print("-------- for loop ---------")
        branch_id = df_raw_materials.iloc[i]['branch_id']
        date = get_today_date()
        raw_material = df_raw_materials.iloc[i]['raw_material']
        item = df_raw_materials.iloc[i]['item']
        unit = df_raw_materials.iloc[i]['unit']
        price = df_raw_materials.iloc[i]['price']
        opening_stock = df_raw_materials.iloc[i]['opening_stock']
        print(item, ' -- ',  branch_id, ' -- ', date, ' -- ',
              raw_material, ' -- ', unit, ' -- ', price, ' -- ', opening_stock)

        df_inventory.loc[len(df_inventory.index)] = [branch_id, date,
                                                     raw_material,
                                                     0, 0,
                                                     price, unit, item]
    return df_inventory


# ----------- 2 process purchase order --------------------------
def process_purchase_orders(df_inventory, df_pur_orders):
    # branch_id, date, raw_material, quantity, closing_quantity, price, unit
    print(" $$$$ process_purchase_orders $$$$$  ")
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
        df_filter = df_inventory.loc[(df_inventory['branch_id'] == branch_id)
                                     & (df_inventory['raw_material'] == int(raw_material))]

        print('df_filter', df_filter)
        index_val = df_filter.index[0]
        print('index_val', index_val)
        quantity = df_filter.loc[index_val, 'quantity']
        print('quantity', quantity)
        total_quantity = quantity + ord_qty
        df_inventory.loc[index_val, 'quantity'] = total_quantity

    return df_inventory


# ------------3 process indents --------------------------
def process_indents(df_inventory, df_indnets):
    # name  branch_id  raw_material  req_qty  issued_qty  date
    print("update_inventory_summary_for_indents")
    for i in range(0, len(df_indnets)):
        # print("-------- for loop ---------")
        branch_id = df_indnets.iloc[i]['branch_id']
        raw_material = df_indnets.iloc[i]['raw_material']
        unit = df_indnets.iloc[i]['unit']
        req_qty = df_indnets.iloc[i]['req_qty']
        issued_qty = df_indnets.iloc[i]['issued_qty']
        date = df_indnets.iloc[i]['date']
        print('****************', i)
        print(branch_id, '-', raw_material, '-', req_qty, '-',
              issued_qty, '-', date, '-', unit)
        print("**********************************")
        print(df_inventory.dtypes)
        df_inventory = df_inventory.astype({"branch_id": int, "raw_material": int})
        print(df_inventory.dtypes)
        print("**********************************")
        df_filter = df_inventory.loc[
            (df_inventory['branch_id'] == int(branch_id))
            & (df_inventory['raw_material'] == int(raw_material))]
        print('df_filter', df_filter)
        index_val = df_filter.index[0]
        print('index_val', index_val)
        quantity = df_filter.loc[index_val, 'quantity']
        print('quantity', quantity)
        total_quantity = quantity - issued_qty
        df_inventory.loc[index_val, 'quantity'] = total_quantity

    return df_inventory


# ----------4 process wastages ----------------------------
def process_wastages(df_inventory, df_wastages):
    # branch_id	date	raw_material	unit	price	wastage_qty
    for i in range(0, len(df_wastages)):
        # print("-------- for loop ---------")
        branch_id = df_wastages.iloc[i]['branch_id']
        date = df_wastages.iloc[i]['date']
        raw_material = df_wastages.iloc[i]['raw_material']
        unit = df_wastages.iloc[i]['unit']
        price = df_wastages.iloc[i]['price']
        wastage_qty = df_wastages.iloc[i]['wastage_qty']

        print('****************', i)
        print(branch_id, '-', raw_material, '-', price, '-', wastage_qty,
              '-', date, '-', unit)
        print("update_inventory_summary_for_wastages")
        # print("branch_id ", branch_id)
        # print("raw_material", raw_material)
        # print("wastage_qty", wastage_qty)
        print("df_inventory ==== == ++ === ")
        print(df_inventory)
        print("**********************************")
        print(df_inventory.dtypes)
        df_inventory = df_inventory.astype({"branch_id": int, "raw_material": int})
        print("**********************************")
        print(df_inventory.dtypes)
        print("**********************************")
        df_filter = df_inventory.loc[
                                 (df_inventory['branch_id'] == int(branch_id)) &
                                 (df_inventory['raw_material'] == int(raw_material))
                                 ]
        index_val = df_filter.index[0]
        quantity = df_filter.loc[index_val, 'quantity']
        total_quantity = quantity - wastage_qty
        df_inventory.loc[index_val, 'quantity'] = total_quantity

    return df_inventory


# ------------- 5 process inventory counting  ------------------------
def process_inv_counting(df_inventory, df_inv_counting):
    # branch_id	 date	raw_material	unit	price	quantity
    #   raw_material  unit  price  clos_stock  quantity diff
    print('process_inv_counting')
    print('=== df_inventory === ')
    print(df_inventory)
    print('=== df_inv_counting === ')
    print(df_inv_counting)

    for i in range(0, len(df_inv_counting)):
        # print("-------- for loop ---------")
        branch_id = df_inv_counting.iloc[i]['branch_id']
        date = df_inv_counting.iloc[i]['date']
        raw_material = df_inv_counting.iloc[i]['raw_material']
        clos_stock = df_inv_counting.iloc[i]['clos_stock']
        counted_quantity = df_inv_counting.iloc[i]['quantity']
        diff = df_inv_counting.iloc[i]['diff']
        unit = df_inv_counting.iloc[i]['unit']
        price = df_inv_counting.iloc[i]['price']
        print('****************', i)
        print(branch_id, '-', raw_material, '-', 'clos_stock', clos_stock,
              counted_quantity, '-', counted_quantity, '-', date, '-',
              unit, '-', price, 'diff', diff)
        print("**********************************")
        print(df_inventory.dtypes)
        df_inventory = df_inventory.astype({"branch_id": int, "raw_material": int})
        print("**********************************")
        print(df_inventory.dtypes)
        print("**********************************")
        df_filter = df_inventory.loc[(df_inventory['branch_id'] == branch_id)
                                     & (df_inventory['raw_material'] ==
                                     int(raw_material))]
        print('df_filter', df_filter)
        index_val = df_filter.index[0]
        filtered_quantity = df_filter.loc[index_val, 'quantity']
        new_quantity = 0
        if diff >= 0:
            new_quantity = filtered_quantity + diff
        else:
            new_quantity = filtered_quantity - abs(diff)

        df_inventory.loc[index_val, 'quantity'] = new_quantity
    return df_inventory


# -----------6 delete inventory summary of today data --------------
def delete_inventory_summary_of_today_data():
    sql = """
    DELETE FROM `tabInventory Summary` WHERE date = DATE(NOW())
    """
    print(sql)
    table = select_db_data(sql)
    return table


# ---------7 process cumulative data in inv summary -------------
def process_cumulative_data(df_inventory, df_inv_by_date, df_raw_materials):
    print('df_inv_by_date  \n', df_inv_by_date)
    print('df_raw_materials \n', df_raw_materials)
    for i in range(0, len(df_inventory)):

        branch_id = df_inventory.iloc[i]['branch_id']
        raw_material = df_inventory.iloc[i]['raw_material']
        quantity = df_inventory.iloc[i]['quantity']
        print('branch_id', branch_id, 'raw_material', raw_material, 'quantity', quantity)
        closing_quantity = 0
        total_quantity = 0
        index_val = 0

        if not df_inv_by_date.empty:
            print('df_inv_by_date NOT EMPTY')
            df_inv_by_date = df_inv_by_date.astype({"branch_id": int, "raw_material": int})
            df_filter = df_inv_by_date.loc[
                                 (df_inv_by_date['branch_id'] == int(branch_id)) &
                                 (df_inv_by_date['raw_material'] == int(raw_material))
                                 ]
            if not df_filter.empty:
                index_val = df_filter.index[0]
                closing_quantity = df_filter.loc[index_val, 'closing_quantity']
                # print('df_filter', df_filter)
                # print('index_val', index_val)
                # print('closing_quantity', closing_quantity)
                if closing_quantity > 0:
                    print("closing_quantity > 0")
                    total_quantity = quantity + closing_quantity
                    df_inventory.loc[i, 'closing_quantity'] = total_quantity

        if closing_quantity == 0:
            print("closing_quantity == 0")
            df_raw_materials = df_raw_materials.astype({"branch_id": int, "raw_material": int})
            df_filter_raw = df_raw_materials.loc[
                                 (df_raw_materials['branch_id'] == int(branch_id))
                                 &
                                 (df_raw_materials['raw_material'] == int(raw_material))
                                 ]
            index_val_raw = df_filter_raw.index[0]
            opening_stock = df_filter_raw.loc[index_val_raw, 'opening_stock']
            total_quantity = quantity + opening_stock
            # print('index_val_raw -> ', index_val_raw)
            # print('opening_stock -> ', opening_stock)
            # print('total_quantity -> ', total_quantity)
            df_inventory.loc[i, 'closing_quantity'] = total_quantity

    return df_inventory


# ---------- 8 bulk insert inventory summary ------------------------
def bulk_insert_inventory_summary(df_inventory):
    # branch_id', 'date', 'raw_material', 'quantity', 'closing_quantity', 'price', 'unit', 'item'
    # branch_name, branch_id, user_name, `date`, raw_material, closing_quantity, price, unit, quantity
    print('bulk_insert_inventory_summary')
    for i in range(0, len(df_inventory)):
        # print("-------- for loop ---------")
        branch_id = df_inventory.iloc[i]['branch_id']
        date = df_inventory.iloc[i]['date']
        raw_material = df_inventory.iloc[i]['raw_material']
        quantity = df_inventory.iloc[i]['quantity']
        closing_quantity = df_inventory.iloc[i]['closing_quantity']
        price = df_inventory.iloc[i]['price']
        unit = df_inventory.iloc[i]['unit']

        # print('#####################', i)
        print('  branch_id -', branch_id, '  date -', date, '  raw_material -',
              raw_material, '  quantity -', quantity, '  closing_quantity -',
              closing_quantity,  'price -', price, ' unit-', unit)
        doc = frappe.get_doc({
            'doctype': 'Inventory Summary',
            'branch_id': branch_id,
            'date': date,
            'raw_material': int(raw_material),
            'quantity': quantity,
            'closing_quantity': closing_quantity,
            'price': price,
            'unit': unit
        })
        doc.insert()


# -----------9 update raw material table closing stock -------------
def update_raw_material_table_closing_stock(df_inventory):
    print('update raw material table closing stock')
    for i in range(0, len(df_inventory)):
        # print("-------- for loop ---------")
        branch_id = df_inventory.iloc[i]['branch_id']
        date = df_inventory.iloc[i]['date']
        raw_material = df_inventory.iloc[i]['raw_material']
        quantity = df_inventory.iloc[i]['quantity']
        closing_quantity = df_inventory.iloc[i]['closing_quantity']
        price = df_inventory.iloc[i]['price']
        unit = df_inventory.iloc[i]['unit']
        print('#####################', i)
        print('  branch_id -', branch_id, '  date -', date, '  raw_material -',
              raw_material, '  quantity -', quantity, '  closing_quantity -',
              closing_quantity,  'price -', price, '  unit-', unit)
        frappe.db.set_value('Raw Material Only', int(raw_material),
                            'closing_stock', closing_quantity)


#  --------------------SQL-----------------------
def get_raw_materials():
    sql = """
    SELECT name as raw_material, branch as branch_id,
    date, item, unit, price, opening_stock
    FROM `tabRaw Material Only`
    ORDER BY branch, raw_material
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
    par.branch_id, chi.raw_material, chi.req_qty,
    chi.issued_qty, par.date, chi.unit
    FROM `tabChef Indent By Dept` par
    INNER JOIN `tabChef Indent By Dept Child` chi
    ON par.name = chi.parent
    WHERE date = DATE(NOW())
    ORDER BY par.branch_id, chi.raw_material
    """
    table = select_db_data(sql)
    return table


def get_wastages():
    sql = """
    SELECT par.branch_id, par.date, chi.raw_material,
    chi.unit, chi.price,  chi.wastage_qty
    FROM `tabInventory Wastage` par
    INNER JOIN `tabInventory Wastage Child` chi
    ON par.name = chi.parent
    WHERE date = DATE(NOW())
    ORDER BY par.branch_id, par.name, chi.name
    """
    table = select_db_data(sql)
    return table


def get_inv_counting():
    sql = """
    SELECT par.branch_id, par.date, chi.raw_material,
    chi.unit, chi.price,  chi.clos_stock, chi.quantity, chi.diff
    FROM `tabInventory Counting` par
    INNER JOIN `tabInventory Counting Child` chi
    ON par.name = chi.parent
    WHERE date = DATE(NOW())
    ORDER BY par.branch_id, par.name, chi.name
    """
    table = select_db_data(sql)
    return table


def get_inventory_summary_for_specific_date(specific_date):
    sql = """
    SELECT branch_id, `date`, raw_material, closing_quantity, price, unit
    FROM `tabInventory Summary`
    WHERE date = '{}'
    """
    sql = sql.format(specific_date)
    print(sql)
    table = select_db_data(sql)
    return table


def select_db_data(sql):
    table = frappe.db.sql(sql, as_dict=True)
    return table


def create_inventory_summary_empty_data_frame():
    df = pd.DataFrame()
    columns_add = ['branch_id', 'date',
                   'raw_material', 'quantity', 'closing_quantity',
                   'price', 'unit', 'item']
    for col in columns_add:
        df[col] = None
    return df


#  -------------------Utility--------------------
def get_today_date():
    current_date = datetime.today().date()
    return current_date


def get_yesterday_date():
    today = get_today_date()
    yesterday = today - timedelta(days=1)
    return yesterday
