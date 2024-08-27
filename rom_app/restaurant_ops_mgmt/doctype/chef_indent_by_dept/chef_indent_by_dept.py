import frappe
from frappe.model.document import Document
from datetime import datetime


class ChefIndentByDept(Document):

    @frappe.whitelist()
    def get_raw_material(self, branch, department):
        print("inside python")
        sql = """
        SELECT rawmat.item, child.indent_unit
        FROM `tabRaw Material For Indent` parent
        JOIN `tabRaw Material For Indent Child` child
        ON	parent.name = child.parent
        JOIN `tabRaw Material Only` rawmat
        ON	rawmat.name = child.raw_material
        WHERE parent.branch = {}
        AND parent.department = {};
        """
        sql = sql.format(branch, department)
        print(sql)
        item_data = frappe.db.sql(sql, as_dict=0)
        res_length = len(item_data)
        print(res_length)
        print(item_data)
        return item_data

    @frappe.whitelist()
    def test(self):
        print('item_data')
        return 'item_data'

    def on_update(self):
        current_date = datetime.today().date()
        doc_save_date = datetime.strptime(self.date, '%Y-%m-%d').date()
        if (current_date > doc_save_date):
            frappe.throw("Editing records from the past is not permitted")

