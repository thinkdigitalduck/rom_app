frappe.pages['inventory-view'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Inventory Board',
		single_column: true
	});


	var filters = {};
	var from_date;
	var to_date;
	var branch;
	var all_value;

	var global_get_to_date = function (){
		var from_date_temp = frappe.datetime.now_date();
		return from_date_temp;
	}

	var global_get_from_date = function (){
		var from_date_temp = global_get_to_date();
		var from_date_minus_one = new Date(frappe.datetime.str_to_obj(from_date_temp));
		from_date_minus_one.setDate(from_date_minus_one.getDate() - 1);

		let date_only = from_date_minus_one.getDate();
		let month_only = from_date_minus_one.getMonth() + 1;
		if (month_only.toString().length == 1) {
            month_only = "0" + month_only;
        }
		let year_only = from_date_minus_one.getFullYear();

		var from_date_minus_one_opt = year_only + "-" + month_only + "-" + date_only;

		console.log("^^^^^^^^^^^^^^^^^^^^^^^");
		console.log(" date_only=",date_only);
		console.log(" month_only=",month_only);
		console.log(" year_only=",year_only);

		console.log("from_date_minus_one_opt", from_date_minus_one_opt);
		return from_date_minus_one_opt;
	}

	var global_get_filters = function (){
		from_date = global_get_from_date();
		to_date = global_get_to_date();
		filters = {"from_date_filter":from_date,"to_date_filter":to_date};
		console.log("global_get_filters *****");
		console.log(filters);
		return filters;
	};

	var global_get_filters_on_submit = function (){
		branch = branch_field.get_value();
		from_date = from_date_field.get_value();
		to_date = to_date_field.get_value();
		all_value = branch + " - " + from_date  + " - " + to_date;

		filters = {"from_date_filter":from_date,"to_date_filter":to_date}
		if(branch){
			filters = Object.assign({}, filters, {branch_filter:branch});
		}
		console.log('on-submit - filters');
		console.log(filters);
		return filters;
	};

	var branch_field = page.add_field({
		label: 'Branch',
		fieldtype: 'Link',
		fieldname: 'branch_name',
		options: 'Branch',
	});

	var from_date_field = page.add_field({
		label: 'From Date',
		fieldtype: 'Date',
		fieldname: 'from_date',
		default: global_get_from_date(),
	});

	var to_date_field = page.add_field({
		label: 'To Date',
		fieldtype: 'Date',
		fieldname: 'to_date',
		default: global_get_to_date(),
	});

	var submit_field = page.add_field({
		label: 'Submit',
		fieldtype: 'Button',
		fieldname: 'submit_button',
		click: function ()  {
			//expense_report_register_by_amount('on-submit');
		}
	});

	const itemCounter = (value, index) => {
		return value.filter((x) => x == index).length;
	};

	 // ---------- NEW TAB START ------------
	let opening_new_tab = function (report_name, filters,
									report_cond,     report_cond_result,
									 report_cond2='', report_cond_result2='',
									// report_cond3='', report_cond_result3=''
									){

		console.log('opening_new_tab');
		// http://rom_site:8000/app/query-report/Chef%20Production%20Register
		// ?from_date_filter=2024-07-29&to_date_filter=2024-08-12
		// &category_filter=Briyani
		// &item_filter=Mandi+Briyani

		let report_cond2_path = "&{report_cond2}={report_cond_result2}";
//		let report_cond3_path = "&{report_cond3}={report_cond_result3}";

		let protocol_host = window.location.protocol + '//' + window.location.host;

		let from_date = filters.from_date_filter;
		let to_date = filters.to_date_filter;

		console.log("*****************************");
		console.log("from_date-",from_date);
		console.log("to_date-",to_date);

		let path_report_name = "/app/query-report/{report_name}?";
		let path_cond ="from_date_filter={from_date_filter}&to_date_filter={to_date_filter}"+
		"&{report_cond}={report_cond_result}";
		let path_branch="&branch_filter={branch_filter}";

		path_report_name = path_report_name.replace("{report_name}", report_name);

		path_cond = path_cond.replace("{from_date_filter}", from_date);
		path_cond = path_cond.replace("{to_date_filter}", to_date);
		path_cond = path_cond.replace("{report_cond}", report_cond);
		path_cond = path_cond.replace("{report_cond_result}", report_cond_result);

		let report_url = protocol_host + path_report_name + path_cond;

		console.log('filters', filters);
		if (filters.hasOwnProperty("branch_filter")) {
			console.log("branch_filter exists");
			let branch_id = filters.branch_filter;
			path_branch = path_branch.replace("{branch_filter}", branch_id);
			console.log(branch_id, path_branch);
			report_url = report_url + path_branch;
		}

		if(report_cond2.length>0){
			report_cond2_path = report_cond2_path.replace("{report_cond2}", report_cond2);
			report_cond2_path = report_cond2_path.replace("{report_cond_result2}", report_cond_result2);
			report_url = report_url + report_cond2_path;
		}
  //
		// if(report_cond3.length>0){
		// 	report_cond3_path = report_cond3_path.replace("{report_cond3}", report_cond3);
		// 	report_cond3_path = report_cond3_path.replace("{report_cond_result3}", report_cond_result3);
		// 	report_url = report_url + report_cond3_path;
		// }

		console.log("report_url");
		console.log(report_url);
		window.open(report_url,'_blank', 'noopener,noreferrer');
	}
	// ---------- NEW TAB END ------------


//  ^^^^^^^^^^^^^^^^^^   NEW TAB simple START   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

let opening_new_tab_simple = function (report_name, filters, date_clicked){

		console.log('opening_new_tab_simple');
		// http://rom_site:8000/app/query-report/Sales Report Register?
		// from_date_filter=2024-08-13&to_date_filter=2024-08-13

		let protocol_host = window.location.protocol + '//' + window.location.host;

		let from_date = filters.from_date_filter;
		let to_date = filters.to_date_filter;


		let path_report_name = "/app/query-report/{report_name}?";
		let path_cond ="from_date_filter={from_date_filter}&to_date_filter={to_date_filter}";
		let path_branch="&branch_filter={branch_filter}";



		path_report_name = path_report_name.replace("{report_name}", report_name);

		path_cond = path_cond.replace("{from_date_filter}", date_clicked);
		path_cond = path_cond.replace("{to_date_filter}", date_clicked);

		let report_url = protocol_host + path_report_name + path_cond;

		console.log('============');
		console.log('path_report_name',path_report_name);
		console.log('path_cond',path_cond);
		console.log('report_url',report_url);


		console.log('filters', filters);
		if (filters.hasOwnProperty("branch_filter")) {
			console.log("branch_filter exists");
			let branch_id = filters.branch_filter;
			path_branch = path_branch.replace("{branch_filter}", branch_id);
			console.log(branch_id, path_branch);
			report_url = report_url + path_branch;
		}


		console.log("report_url");
		console.log(report_url);
		window.open(report_url,'_blank', 'noopener,noreferrer');
	}

	// ^^^^^^^^^^^^^^^^   NEW TAB simple end   ^^^^^^^^^^^^^^^^^^

		let inventory_transaction_by_amount  = function(time_of_invoke){

		console.log('inventory_transaction_by_amount')

		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- Inventory Transaction by Amount ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.page.inventory_view.inventory_view_sql.inventory_transaction_by_amount_data",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log(data);
				inventory_transaction_by_amount_chart(data);

			}
		})
	}

	let inventory_transaction_by_amount_chart  = function(data){
		console.log("-------------- chef_production_register_briyani -------------- ");

		// http://rom_site:8000/app/query-report/Chef%20Production%20Register
		// ?from_date_filter=2024-07-29&to_date_filter=2024-08-12&
		//category_filter=Briyani&item_filter=Mandi+Briyani
		let category_filter = "Total Amount";
		let report_name = "Inventory Transaction by Amount";
		console.log(' +++ inventory_transaction_by_amount_chart +++ ')
		console.log(data);
		let inventory_transaction = [];
		let total_amount = [];

		total_amount.push("item");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
				inventory_transaction.push(item.inventory_transaction);
				total_amount.push(item.total_amount);
		});
		console.log('inventory_transaction', inventory_transaction);
		console.log('total_amount', total_amount);

		var chart = bb.generate({
			title: {text: "Inventory Transaction by Total Amount"},
			data: {
			type: "bar",
			onclick: function(arg1){
				console.log(arg1);
				console.log(arg1.x);

				let item_filter=inventory_transaction[arg1.x];
				console.log(item_filter); // Mutton briyani
				console.log(arg1.value);
				//opening_new_tab(report_name, filters, "category_filter", category_filter, "item_filter", item_filter);
			},
			columns: [total_amount,],
		},
		axis: {
			x: {type: "category",categories: inventory_transaction,},
		},
		bindto: "#inventory_transaction_by_amount_chart",
		});
	}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$(frappe.render_template("inventory_view", {})).appendTo(page.body);
    inventory_transaction_by_amount('on-load');

}
