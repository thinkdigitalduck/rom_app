frappe.query_reports["Inventory Transaction Register"] = {
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
			"fieldname": "raw_material_filter",
			"label": "Raw Material",
			"fieldtype": "Link",
			"options": "Raw Material Only",
		},
		{
			"fieldname": "trans_type_filter",
			"label": "Transaction Type",
			"fieldtype": "Select",
			"options": "\nPO\nIndent\nWaste\nInvCount"
		},
	]
};
