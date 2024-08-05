import frappe
from datetime import datetime
from frappe.model.document import Document


class CutleryInventoryCount(Document):
    def before_insert(self):
        branch_id = self.branch_id
        user_name = self.user_name
        current_date = datetime.today().date()
        category_name = ''
        roles = frappe.get_roles(frappe.session.user)
        print(roles)
        if "Rom_DM_Role" in roles:
            category_name = 'Dining'

        if "Rom_Chef_Role" in roles:
            category_name = 'Kitchen'

        print('-------------------------------------------')
        print(f" {branch_id} {user_name} {current_date} {category_name} " )

        rec_count = self.get_the_record_count(branch_id, user_name, current_date, category_name)
        print(f" rec_count {rec_count}  " )
        if (rec_count > 0):
            frappe.throw("You are limited to adding just one record per day.")

    def on_update(self):
        current_date = datetime.today().date()
        doc_save_date = datetime.strptime(self.date, '%Y-%m-%d').date()
        if (current_date > doc_save_date):
            frappe.throw("Editing records from the past is not permitted")

    def get_the_record_count(self, branch_id, user_name, date_obj, category_name):
        rec_count = frappe.db.count('Cutlery Inventory Count', filters={
            'user_name': user_name,
            'branch_id': branch_id,
            'date': date_obj,
            'category_name': category_name
        })
        return rec_count
