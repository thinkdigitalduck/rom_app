import datetime
import frappe


@frappe.whitelist()
def inventory_closing():
    # current_time = datetime.datetime.now()
    print("================ inventory_closing >>>>>>>>>>>>>>>>>")
    # print(current_time)
    # doc = frappe.get_doc({
    #     'doctype': 'Task',
    #     'title': current_time
    # })
    # doc.insert()
    # frappe.db.commit()
    sql = """
    SELECT par.`date` , chi.raw_material, chi.unit, chi.price, par.raw_materials_closed, par.additional_items_closed
    FROM `tabPurchase Order` par
    INNER JOIN `tabPurchase Order Child2` chi
    ON par.name = chi.parent
    WHERE par.raw_materials_closed = 0
    """
    results = frappe.db.sql(sql, as_dict=True)

    for result in results:
        print(result)

    print("================ inventory_closing >>>>>>>>>>>>>>>>>")
    print(results)
    return result
