import frappe
from datetime import datetime
from frappe.model.document import Document


class ChefIndent(Document):
    def before_insert(self):
        branch_id = self.branch_id
        user_name = self.user_name
        current_date = datetime.today().date()
        rec_count = self.get_the_record_count(branch_id, user_name, current_date)
        if (rec_count > 0):
            frappe.throw("You are limited to adding just one record per day.")

    def on_update(self):
        current_date = datetime.today().date()
        doc_save_date = datetime.strptime(self.date, '%Y-%m-%d').date()
        if (current_date > doc_save_date):
            frappe.throw("Editing records from the past is not permitted")
        user_roles = frappe.get_roles(frappe.session.user)
        user_has_rm_role = user_roles.count('Rom_RM_Role')
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

    def get_the_record_count(self, branch_id, user_name, date_obj):
        rec_count = frappe.db.count('Chef Indent', filters={
            'user_name': user_name,
            'branch_id': branch_id,
            'date': date_obj
        })
        return rec_count

    def listToString(s):
        str1 = " "
        return (str1.join(s))
