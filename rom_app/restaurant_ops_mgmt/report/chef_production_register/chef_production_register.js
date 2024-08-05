// Copyright (c) 2024, Pubs and contributors
// For license information, please see license.txt

frappe.query_reports["Chef Production Register"] = {
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
			"fieldtype": "Select",
			"options": "\nBriyani\nChicken"
		},
		{
			"fieldname": "item_filter",
			"label": "Item",
			"fieldtype": "Select",
		},
	],
	onload:function(){
		var select_item  = $("select[data-fieldname='item_filter']");
		select_item.append('<option value="" selected="selected"></option>');
		PopulateDropDownList();
	},

};

function PopulateDropDownList() {
	var ddlItems  = $("select[data-fieldname='item_filter']");
	let api_url = "rom_app.restaurant_ops_mgmt.api.get_production_items"

	frappe.call({
		method: api_url,
		callback: function(items) {

			console.log('get_production_items');
			console.log(items);
			$.each(items.message, function(_i, e){
				console.log('_i',_i);
				console.log('e',e);
				let each_item = e[0];
				console.log('=======> ',each_item);
				var option = $("<option />");
				option.html(each_item);
				option.val(each_item);
				ddlItems.append(option);
			});
		}
	});
};


