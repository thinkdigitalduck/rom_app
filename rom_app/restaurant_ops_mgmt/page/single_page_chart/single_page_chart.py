from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime, timedelta


def get_context(context):
    context.from_date_py = datetime.today().date()
    context.to_date_py = datetime.today().date() - datetime.timedelta(days=1)
#
# @frappe.whitelist()
# def get_property_price_by_status():
#     price = frappe.db.sql(
#         """
#         SELECT status, SUM(grand_total) FROM `tabProperty`
#         GROUP BY status ORDER BY status ASC;
#         """, as_dict=0)
#
#     return price
