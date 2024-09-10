from __future__ import unicode_literals
import frappe
from frappe import _
from datetime import datetime, timedelta


def get_context(context):
    context.from_date_py = datetime.today().date()
    context.to_date_py = datetime.today().date() - datetime.timedelta(days=1)
