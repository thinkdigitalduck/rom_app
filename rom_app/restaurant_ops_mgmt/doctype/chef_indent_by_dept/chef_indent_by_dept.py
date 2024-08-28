import frappe
from frappe.model.document import Document
from datetime import datetime


class ChefIndentByDept(Document):
    def before_insert(self):
        branch_id = self.branch_id
        user_name = self.user_name
        current_date = datetime.today().date()
        rec_count = self.get_the_record_count(branch_id, user_name, current_date)
        if (rec_count > 0):
            frappe.throw("You are limited to adding just one record per day.")

    def get_the_record_count(self, branch_id, user_name, date_obj):
        rec_count = frappe.db.count('Chef Indent By Dept', filters={
            'user_name': user_name,
            'branch_id': branch_id,
            'date': date_obj
        })
        return rec_count

    def listToString(s):
        str1 = " "
        return (str1.join(s))

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
        user_roles = frappe.get_roles(frappe.session.user)
        # user_has_rm_role = user_roles.count('Rom_RM_Role')
        user_has_chef_role = user_roles.count('Rom_Chef_Role')
        print('============================')
        print(user_roles)
        print(user_has_chef_role)
        print('self.rm_approval')
        print(self.rm_approval)
        print(type(self.rm_approval))
        if (user_has_chef_role >= 1):
            print('user_has_chef_role >= 1')
            if (self.rm_approval == 1):
                print('self.rm_approval == 1')
                frappe.throw("Editing approved record is not permitted")

