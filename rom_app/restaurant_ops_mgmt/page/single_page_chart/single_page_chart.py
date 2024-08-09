from __future__ import unicode_literals
import frappe
from frappe import _


def get_context(context):
    users_result = frappe.get_list("User", fields=["first_name", "last_name"])
    print(users_result)
    context.users = users_result
