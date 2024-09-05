import frappe
from frappe.model.document import Document


class PurchaseOrderTemplate(Document):
    @frappe.whitelist()
    def get_raw_material(self, branch):
        print("inside python")
        sql = """
          SELECT rawmat.item, rawmat.unit, rawmat.price, rawmat.opening_stock
        FROM `tabRaw Material Only`  rawmat
        """
        print(sql)
        item_data = frappe.db.sql(sql, as_dict=0)
        res_length = len(item_data)
        print(res_length)
        print(item_data)
        return item_data

