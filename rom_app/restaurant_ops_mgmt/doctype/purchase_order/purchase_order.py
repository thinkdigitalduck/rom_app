import frappe
from frappe.model.document import Document


class PurchaseOrder(Document):
    @frappe.whitelist()
    def get_raw_material(self, branch, po_template):
        print("inside python")
        print("branch")
        print(branch)
        print("po_template")
        print(po_template)
        sql = """
        SELECT chi.raw_material, chi.unit, chi.price
        FROM `tabPurchase Order Template` par
        INNER JOIN `tabPurchase Order Template Child` chi
        ON par.name = chi.parent
        WHERE par.branch_id = {} AND par.po_template = {}
        """
        sql = sql.format(branch, po_template)
        print(sql)
        item_data = frappe.db.sql(sql, as_dict=0)
        res_length = len(item_data)
        print(res_length)
        print(item_data)
        return item_data

