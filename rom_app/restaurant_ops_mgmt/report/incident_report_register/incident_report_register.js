frappe.query_reports["Incident Report Register"] = {
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
			"fieldname": "customer_name_filter",
			"label": "Customer Name",
			"fieldtype": "Data"
		},
		{
			"fieldname": "captain_name_filter",
			"label": "Captain Name",
			"fieldtype": "Data"
		},
		{
			"fieldname": "handled_by_filter",
			"label": "Handled By",
			"fieldtype": "Data"
		},
		{
			"fieldname": "type_of_complaint_filter",
			"label": "Type of Complaint",
			"fieldtype": "Select",
			"options": "\nFood\nKitchen Staff\nCaptain\nReception\nOthers"
		},
		{
			"fieldname": "action_for_complaint_filter",
			"label": "Action for Complaint",
			"fieldtype": "Select",
			"options": "\nApologized\nReplaced\nNo Response"
		},
		{
			"fieldname": "result_of_action_filter",
			"label": "Result of Action",
			"fieldtype": "Select",
			"options": "\nHappy\nAccepted\nAngry\nRejected"
		},
		{
			"fieldname": "department_filter",
			"label": "Department",
			"fieldtype": "Link",
			"options": "Department",
		}
	]
};
