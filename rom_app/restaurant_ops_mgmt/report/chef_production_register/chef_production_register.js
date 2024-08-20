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
		console.log('onload');
		var select_item  = $("select[data-fieldname='item_filter']");

		let urlParams = new URLSearchParams(window.location.search);
		let item_filter_value = urlParams.get('item_filter');

		if(item_filter_value){
			console.log('item_filter_value', item_filter_value);
			select_item.append('<option value="" ></option>');
		}
		else
		{
			select_item.append('<option value="" selected="selected"></option>');
		}
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

				var option;

				let urlParams = new URLSearchParams(window.location.search);
				let item_filter_value = urlParams.get('item_filter');

				if(item_filter_value == each_item){
					console.log('item_filter_value', item_filter_value);
					option = $('<option selected="selected" />');
				}
				else
				{
					console.log('else item_filter_value');
					option = $('<option />');
				}

				option.html(each_item);
				option.val(each_item);
				ddlItems.append(option);
			});
		}
	});
};


/*
function PopulateDropDownList() {
	console.log("PopulateDropDownList");
	var ddlItems  = $("select[data-fieldname='item_filter']");
	let api_url = "rom_app.restaurant_ops_mgmt.api.get_production_items"

	frappe.call({
		method: api_url,
		callback: function(items) {
			if(items){



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

				//check if the url has any paramter and then set it as default
				// let urlParams = new URLSearchParams(window.location.search);
				// let item_filter_value = urlParams.get('item_filter');
    //
				// if(item_filter_value){
				// 	console.log('item_filter_value', item_filter_value);

					let alloptions = Array.from(ddlItems.options);
					console.log('alloptions', alloptions);
					const optionToSelect = alloptions.find(item => item.text ===item_filter_value);
					console.log('optionToSelect', optionToSelect);
					optionToSelect.selected = true;

					//ddlItems.value = item_filter_value;
				}
				else{
					console.log('else item_filter_value');
				}
			}
		}
	});
};

*/
