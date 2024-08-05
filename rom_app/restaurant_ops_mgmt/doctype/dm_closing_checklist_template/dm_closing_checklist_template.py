import frappe
from frappe.model.document import Document


class DmClosingChecklistTemplate(Document):
    def before_insert(self):
        branch_selected = self.dm_close_template_branch
        all_recs = self.check_branch_already_exists(branch_selected)
        if len(all_recs) > 0:
            frappe.throw("The branch already exists. Please add questions within the existing branch.")

    def on_update(self):
        branch_selected = self.dm_close_template_branch
        all_recs = self.check_branch_already_exists(branch_selected)
        if len(all_recs) > 1:
            frappe.throw("The branch already exists. Please do not update here.")

    def check_branch_already_exists(self, branch_id):
        result = frappe.db.get_list(
            "Dm Closing Checklist Template",
            filters={"dm_close_template_branch": branch_id},
            fields=["name", "dm_close_template_branch"],
            as_list=True,
        )
        return result
