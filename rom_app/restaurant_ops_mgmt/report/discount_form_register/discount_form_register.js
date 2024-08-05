frappe.query_reports["Discount Form Register"] = {
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
			"fieldname": "known_to_filter",
			"label": "Known To",
			"fieldtype": "Data"
		},
		{
			"fieldname": "customer_name_filter",
			"label": "Customer",
			"fieldtype": "Data"
		}
	]
};
