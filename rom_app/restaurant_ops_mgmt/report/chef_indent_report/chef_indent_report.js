// Copyright (c) 2024, Pubs and contributors
// For license information, please see license.txt

frappe.query_reports["Chef Indent Report"] = {
	"filters": [
		{
			"fieldname": "from_date_filter",
			"label": "From Date *",
			"fieldtype": "Date",
			"default": frappe.datetime.add_days(frappe.datetime.get_today(), -1),
			"mandatory": 1,
		},
		{
			"fieldname": "to_date_filter",
			"label": "To Date *",
			"fieldtype": "Date",
			"default": frappe.datetime.now_date(),
			"mandatory": 1,
		},
			{
			"fieldname": "branch_filter",
			"label": "Branch",
			"fieldtype": "Link",
			"options": "Branch",
		},
		{
			"fieldname": "department_filter",
			"label": "Department",
			"fieldtype": "Link",
			"options": "Department",
		},
		{
			"fieldname": "raw_material_filter",
			"label": "Raw Material",
			"fieldtype": "Link",
			"options": "Raw Material",
		},
	]
};
