frappe.query_reports["Ticket Report Register"] = {
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
			"fieldname": "ticket_desc_filter",
			"label": "Ticket Desc",
			"fieldtype": "Data"
		},
		{
			"fieldname": "responsible_person_filter",
			"label": "Responsible Person",
			"fieldtype": "Data"
		},
		{
			"fieldname": "reported_by_filter",
			"label": "Reported By",
			"fieldtype": "Data"
		}
	]
};


