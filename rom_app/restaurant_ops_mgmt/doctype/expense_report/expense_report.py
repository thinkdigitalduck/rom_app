import frappe
from frappe.model.document import Document
from datetime import datetime


class ExpenseReport(Document):
    def on_update(self):
        current_date = datetime.today().date()
        doc_save_date = datetime.strptime(self.date, '%Y-%m-%d').date()
        if (current_date == doc_save_date):
            pass
        else:
            frappe.throw("Editing records from the past is not permitted")

    def get_the_record_count(self, branch_id, user_name, date_obj):
        rec_count = frappe.db.count('Expense Report', filters={
            'user_name': user_name,
            'branch_id': branch_id,
            'date': date_obj
        })
        return rec_count
