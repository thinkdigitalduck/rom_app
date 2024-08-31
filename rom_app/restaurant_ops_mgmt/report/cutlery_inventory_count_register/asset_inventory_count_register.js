frappe.query_reports["Asset Inventory Count Register"] = {
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
			"fieldname": "category_filter",
			"label": "Category",
			"fieldtype": "Link",
			"options": "Category",
		},
		{
			"fieldname": "item_filter",
			"label": "Item",
			"fieldtype": "Data",
		},
	]
};
