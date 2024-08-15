frappe.pages['single-page-chart'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Chart View',
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
	};

	var global_get_from_date = function (){
		var from_date_temp = global_get_to_date();
		var from_date_minus_one = new Date(frappe.datetime.str_to_obj(from_date_temp));
		from_date_minus_one.setDate(from_date_minus_one.getDate() - 1);

		var from_date_minus_one_opt = from_date_minus_one.getFullYear() + "-" +
									(from_date_minus_one.getMonth()+1)+ "-" +
									from_date_minus_one.getDate();
		return from_date_minus_one_opt;
	};

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
			chef_opening_checklist_audit('on-submit');
			chef_closing_checklist_audit('on-submit');
			dm_opening_checklist_audit('on-submit');
			dm_closing_checklist_audit('on-submit');
			chef_production_register('on-submit');
			sales_report_register('on-submit');
			sales_by_payment_mode('on-submit');
			breakages_report_register('on-submit');

			nc_report_register_by_count('on-submit');
			incident_report_register_by_count('on-submit');
			cutlery_inventory_count_register_by_difference('on-submit');
			discount_form_by_percentage('on-submit');

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
		//"&{report_cond}={report_cond_result}";
		let path_branch="&branch_filter={branch_filter}";

		path_report_name = path_report_name.replace("{report_name}", report_name);

		path_cond = path_cond.replace("{from_date_filter}", date_clicked);
		path_cond = path_cond.replace("{to_date_filter}", date_clicked);

		let report_url = protocol_host + path_report_name + path_cond;

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



	// $$$$$$$$$$$$$$$$$$$- chef opening checklist audit - start - $$$$$$$$$$$$$

	let chef_opening_checklist_audit  = function(time_of_invoke){

		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- chef_opening_checklist_chef_audit ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.chef_opening_checklist_register.chef_opening_checklist_register.get_data",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log(filters);
				chef_opening_checklist_chef_audit_chart(data, filters);
				chef_opening_checklist_rm_audit_chart(data, filters);
			}
		})
	}


	let chef_opening_checklist_chef_audit_chart  = function(data, filters){

		console.log("-------------- chef_opening_checklist_chef_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.chef_open_child_yes);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);


		var chart = bb.generate({
		title: {
			text: "Chef Audit"
		},
		bindto: "#chef_opening_checklist_chef_audit_chart",
		data: {
			type: "pie",
			columns: [
				["Yes", audit_yes],
				["No", audit_no]
			],
			 onclick: function(d, element) {
				console.log('audit_yes',audit_yes);
				console.log('audit_no',audit_no);
				console.log(' chef_opening_checklist_chef_audit_chart ',d, element);
				let report_name = "Chef Opening Checklist Register";
				let report_cond = "chef_audit_filter";
				opening_new_tab(report_name, filters, report_cond, d.id);
			}
		}
		});
	}



	let chef_opening_checklist_rm_audit_chart  = function(data, filters){
		console.log("-------------- chef_opening_checklist_rm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.rm_audit);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
		title: {
			text: "RM Audit"
		},
		bindto: "#chef_opening_checklist_rm_audit_chart",
		data: {
			type: "pie",
			columns: [
				["Yes", audit_yes],
				["No", audit_no]
			],
			 onclick: function(d, element) {
				console.log('audit_yes',audit_yes);
				console.log('audit_no',audit_no);
				console.log(' chef_opening_checklist_rm_audit_chart',d, element);
				let report_name = "Chef Opening Checklist Register";
				let report_cond = "rm_audit_filter";
				opening_new_tab(report_name, filters, report_cond, d.id);
			},
			colors: {
				Yes: "green",
				No: "red"
			}
		}
		});
	}

	// $$$$$$$$$$$$$$$$$$$- chef opening checklist audit - end- $$$$$$$$$$$$$


   // #################chef closing checklist audit - start########################################

	let chef_closing_checklist_audit  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- chef_closing_checklist_chef_audit ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.chef_closing_checklist_register.chef_closing_checklist_register.get_data",
			args: {
				'filters':filters
			},
			callback: function(data) {
				chef_closing_checklist_chef_audit_chart(data, filters);
				chef_closing_checklist_rm_audit_chart(data, filters);
			}
		})
	}

	let chef_closing_checklist_chef_audit_chart  = function(data, filters){
	console.log("-------------- chef_closing_checklist_chef_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.chef_close_child_yes);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
			title: {
			text: "Chef Audit"
			},
			bindto: "#chef_closing_checklist_chef_audit_chart",
			data: {
				type: "pie",
				columns: [
					["Yes", audit_yes],
					["No", audit_no]
				],
				onclick: function(d, element) {
					console.log('audit_yes',audit_yes);
					console.log('audit_no',audit_no);
					console.log(' chef_closing_checklist_chef_audit_chart',d, element);
					let report_name = "Chef Closing Checklist Register";
					let report_cond = "chef_audit_filter";
					opening_new_tab(report_name, filters, report_cond, d.id);
				}
			}
		});
	}

	let chef_closing_checklist_rm_audit_chart  = function(data, filters){
		console.log("-------------- chef_closing_checklist_rm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.rm_audit);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
			title: {
			text: "RM Audit"
			},
			bindto: "#chef_closing_checklist_rm_audit_chart",
			data: {
				type: "pie",
				columns: [
					["Yes", audit_yes],
					["No", audit_no]
				],
				onclick: function(d, element) {
					console.log('audit_yes',audit_yes);
					console.log('audit_no',audit_no);
					console.log(' chef_closing_checklist_rm_audit_chart',d, element);
					let report_name = "Chef Closing Checklist Register";
					let report_cond = "rm_audit_filter";
					opening_new_tab(report_name, filters, report_cond, d.id);
				},
				colors: {
					Yes: "green",
					No: "red"
				}
			}
		});
	}


   // ################# chef closing checklist audit - end ########################################




//  ===================== dm opening checklist audit - start ===================================


	let dm_opening_checklist_audit  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- dm_opening_checklist_dm_audit ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.dm_opening_checklist_register.dm_opening_checklist_register.get_data",
			args: {
				'filters':filters
			},
			callback: function(data) {
				dm_opening_checklist_dm_audit_chart(data);
				dm_opening_checklist_rm_audit_chart(data);
			}
		})
	}


		let dm_opening_checklist_dm_audit_chart  = function(data){
		console.log("-------------- dm_opening_checklist_dm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.dm_open_child_yes);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
			title: {
			text: "DM Audit"
			},
			bindto: "#dm_opening_checklist_dm_audit_chart",
			data: {
				type: "pie",
				columns: [
					["Yes", audit_yes],
					["No", audit_no]
				],
				onclick: function(d, element) {
					console.log('audit_yes',audit_yes);
					console.log('audit_no',audit_no);
					console.log(' dm_opening_checklist_dm_audit_chart  ',d, element);
					let report_name = "Dm Opening Checklist Register";
					let report_cond = "dm_open_child_yes";
					opening_new_tab(report_name, filters, report_cond, d.id);
				}
			}
		});
	}




	let dm_opening_checklist_rm_audit_chart  = function(data){
		console.log("-------------- dm_opening_checklist_rm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.rm_audit);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);
		console.log('audit_yes',audit_yes);
		console.log('audit_no',audit_no);
		var chart = bb.generate({
			title: {
			text: "RM Audit"
			},
			bindto: "#dm_opening_checklist_rm_audit_chart",
			data: {
				type: "pie",
				columns: [
					["Yes", audit_yes],
					["No", audit_no]
				],
				onclick: function(d, element) {
					console.log('audit_yes',audit_yes);
					console.log('audit_no',audit_no);
					console.log(' dm_opening_checklist_rm_audit_chart ',d, element);
					let report_name = "Dm Opening Checklist Register";
					let report_cond = "rm_audit_filter";
					opening_new_tab(report_name, filters, report_cond, d.id);
				},
			colors: {
				Yes: "green",
				No: "red"
			}
			}
		});
	}



	//  ====================  dm opening checklist audit - end ===================================

	//  *****************  dm closing checklist audit - start  ***********************************

	let dm_closing_checklist_audit  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- dm_closing_checklist_dm_audit ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.dm_closing_checklist_register.dm_closing_checklist_register.get_data",
			args: {
				'filters':filters
			},
			callback: function(data) {
				dm_closing_checklist_dm_audit_chart(data);
				dm_closing_checklist_rm_audit_chart(data);
			}
		})
	}


	let dm_closing_checklist_dm_audit_chart  = function(data){
		console.log("-------------- dm_closing_checklist_dm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.dm_close_child_yes);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
			title: {
			text: "DM Audit"
			},
			bindto: "#dm_closing_checklist_dm_audit_chart",
			data: {
				type: "pie",
				columns: [
					["Yes", audit_yes],
					["No", audit_no]
				],
				onclick: function(d, element) {
					console.log('audit_yes',audit_yes);
					console.log('audit_no',audit_no);
					console.log(' dm_closing_checklist_dm_audit_chart ',d, element);
					let report_name = "Dm Closing Checklist Register";
					let report_cond = "dm_close_child_yes";
					opening_new_tab(report_name, filters, report_cond, d.id);
				}
			}
		});
	}


	let dm_closing_checklist_rm_audit_chart  = function(data){
		console.log("-------------- dm_closing_checklist_rm_audit_chart -------------- ");
		console.log(data);
		let audit = [];
		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			audit.push(item.rm_audit);
		});
		console.log(audit);
		let audit_yes = itemCounter(audit, 1);
		let audit_no = itemCounter(audit, 0);

		var chart = bb.generate({
		title: {
		text: "RM Audit"
		},
		bindto: "#dm_closing_checklist_rm_audit_chart",
		data: {
			type: "pie",
			columns: [
				["Yes", audit_yes],
				["No", audit_no]
			],
			onclick: function(d, element) {
				console.log('audit_yes',audit_yes);
				console.log('audit_no',audit_no);
				console.log(' dm_closing_checklist_rm_audit_chart ',d, element);
				let report_name = "Dm Closing Checklist Register";
				let report_cond = "rm_audit_filter";
				opening_new_tab(report_name, filters, report_cond, d.id);
			},
			colors: {
				Yes: "green",
				No: "red"
			}
		}
		});
	}
   //  ***********************  dm closing checklist audit - end   **************************************


	// !!!!!!!!!!!!!!!!!!Chef Production Register START !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	let chef_production_register  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- chef_production_register ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.chef_production_register.chef_production_register.get_data_groupby_briyani",
			args: {
				'filters':filters
			},
			callback: function(data) {
				chef_production_register_briyani(data);
			}
		});


		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.chef_production_register.chef_production_register.get_data_groupby_chicken",
			args: {
				'filters':filters
			},
			callback: function(data) {
				chef_production_register_chicken(data);
			}
		});


	}

	let chef_production_register_briyani  = function(data){
		console.log("-------------- chef_production_register_briyani -------------- ");

		// http://rom_site:8000/app/query-report/Chef%20Production%20Register
		// ?from_date_filter=2024-07-29&to_date_filter=2024-08-12&
		//category_filter=Briyani&item_filter=Mandi+Briyani
		let category_filter = "Briyani";
		let report_name = "Chef Production Register";
		console.log(data);
		let briyani_items = [];
		let briyani_waste = [];

		briyani_waste.push("item");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
				briyani_items.push(item.item);
				briyani_waste.push(item.wastage_amount);
		});
		console.log('briyani_items', briyani_items);
		console.log('briyani_waste', briyani_waste);

		var chart = bb.generate({
			title: {text: "Briyani Category"},
			data: {
			type: "bar",
			onclick: function(arg1){
				console.log(arg1);
				console.log(arg1.x);

				let item_filter=briyani_items[arg1.x];
				console.log(item_filter); // Mutton briyani
				console.log(arg1.value);
				opening_new_tab(report_name, filters, "category_filter", category_filter, "item_filter", item_filter);
			},
			columns: [briyani_waste,],
		},
		axis: {
			x: {type: "category",categories: briyani_items,},
		},
		bindto: "#chef_production_register_briyani",
		});
	}


	let chef_production_register_chicken  = function(data){
		console.log("-------------- chef_production_register_chicken -------------- ");

		// http://rom_site:8000/app/query-report/Chef%20Production%20Register
		// ?from_date_filter=2024-07-29&to_date_filter=2024-08-12&
		//category_filter=Briyani&item_filter=Mandi+Briyani

		let category_filter = "Chicken";
		let report_name = "Chef Production Register";
		console.log(data);
		let chicken_items = [];
		let chicken_waste = [];

		chicken_waste.push("item");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			chicken_items.push(item.item);
			chicken_waste.push(item.wastage_amount);
		});

		console.log('chicken_items', chicken_items);
		console.log('chicken_waste', chicken_waste);

		var chart = bb.generate({
			title: {text: "Chicken Category"},
			data: {
			type: "bar",
			onclick: function(arg1){
				console.log(arg1);
				console.log(arg1.x);

				let item_filter=chicken_items[arg1.x];
				console.log(chicken_items[arg1.x]); // Mutton briyani
				console.log(arg1.value);
				opening_new_tab(report_name, filters, "category_filter", category_filter, "item_filter", item_filter);
			},
			columns: [chicken_waste,],
		},
		axis: {
			x: {type: "category",categories: chicken_items,},
		},
		bindto: "#chef_production_register_chicken",
		});
	}

	// !!!!!!!!!!!!!!!!!!Chef Production Register END !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


	// @@@@@@@@@@@  Sales Report Register START  @@@@@@@@@@@@@@@@@@@@@@@@@@@@

	let sales_report_register  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- sales_report_register ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.sales_report_register.sales_report_register.get_data_group_by_date",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				sales_report_register_draw(data);
			}
		});
	}

	let sales_report_register_draw  = function(data){
		console.log("-------------- sales_report_register_draw -------------- ");


		let report_name = "Sales Report Register";
		console.log(data);
		let date = [];
		let actual_sales = [];
		let target = [];

		actual_sales.push("Actual Sales");
		target.push("Target");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			actual_sales.push(item.actual_sales);
			target.push(item.target);
		});

		console.log('date', date);
		console.log('actual_sales', actual_sales);
		console.log('target', target);

		var chart = bb.generate({
			title: {text: "Sales Target Vs Actual Sales"},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date

					opening_new_tab_simple(report_name, filters, date_clicked);
				 },
				columns: [
					target,
					actual_sales
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#sales_report_register",
		});
	}
	// @@@@@@@@@@@  Sales Report Register END  @@@@@@@@@@@@@@@@@@@@@@@@@@@@




	// @@@@@@@@@@@  SALES BY TYPE - START  @@@@@@@@@@@@@@@@@@@@@@@@@@@@
	let sales_by_payment_mode  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- sales_by_payment_mode ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.sales_report_register.sales_report_register.get_data_group_by_date",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				sales_by_payment_mode_draw(data);
			}
		});
	}

	let sales_by_payment_mode_draw  = function(data){
		console.log("-------------- sales_by_payment_mode_draw -------------- ");


		let report_name = "Sales Report Register";
		console.log(data);
		let date = [];

		let cash_sales = [];
		let card_sales = [];
		let online_pay = [];
		let swiggy = [];
		let zomato_sales = [];


		cash_sales.push("Cash");
		card_sales.push("Card");
		online_pay.push("Online");
		swiggy.push("Swiggy");
		zomato_sales.push("Zomato");


		let message = data.message;
		message.forEach((item) => {
			console.log(item);

			date.push(item.date);
			cash_sales.push(item.cash_sales);
			card_sales.push(item.card_sales);
			online_pay.push(item.online_pay);
			swiggy.push(item.swiggy);
			zomato_sales.push(item.zomato_sales);

		});

		console.log('date', date);
		console.log('cash_sales', cash_sales);
		console.log('card_sales', card_sales);
		console.log('online_pay', online_pay);
		console.log('swiggy', swiggy);
		console.log('zomato_sales', zomato_sales);


		var chart = bb.generate({
			title: {text: "Sales by Payment Mode"},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date

					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					cash_sales,
					card_sales,
					online_pay,
					swiggy,
					zomato_sales
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#sales_by_payment_mode",
		});
	}



	// @@@@@@@@@@@  SALES BY TYPE -  END  @@@@@@@@@@@@@@@@@@@@@@@@@@@@




	// ^^^^^^^^^^^^^^^^^  Breakages report - START  ^^^^^^^^^^^^^^^^^^^^^^
	let breakages_report_register  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- breakages_report_register ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.breakages_report_register.breakages_report_register.get_data_by_group_by_date",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				breakages_report_register_draw(data);
			}
		});
	}


	let breakages_report_register_draw  = function(data){
		console.log("-------------- breakages_report_register_draw -------------- ");
		let report_name = "Breakages Report Register";
		console.log(data);
		let date = [];
		let cost = [];
		cost.push("Cost");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			cost.push(item.cost);
		});

		console.log('date', date);
		console.log('cost', cost);

		var chart = bb.generate({
			title: {text: "Breakages Report by Cost "},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date

					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					cost,
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#breakages_report_register",
		});
	}
	// ^^^^^^^^^^^^^^^^^  Breakages report - END  ^^^^^^^^^^^^^^^^^^^^^^



	// ^^^^^^^^^^^^^^^^^ nc_report_register- START  ^^^^^^^^^^^^^^^^^^^^^^
let nc_report_register_by_count  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- nc_report_register_by_count ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.nc_report_register.nc_report_register.get_data_by_count",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				nc_report_register_by_count_draw(data);
			}
		});
	}

	let nc_report_register_by_count_draw  = function(data){
		console.log("-------------- nc_report_register_by_count_draw -------------- ");
		let report_name = "NC Report Register";
		console.log(data);
		let date = [];
		let count = [];
		let completed = [];
		count.push("Count");
		completed.push("Completed");


		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			count.push(item.count);
			completed.push(item.completed);
		});

		console.log('date', date);
		console.log('count', count);
		console.log('completed', completed);

		var chart = bb.generate({
			title: {text: "NC Report by Count "},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date
					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					count, completed
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#nc_report_register_by_count",
		});
	}



	// ^^^^^^^^^^^^^^^^^ nc_report_register- END  ^^^^^^^^^^^^^^^^^^^^^^


	// ^^^^^^^^^^^^^^^^^ incident_report_register   START  ^^^^^^^^^^^^^^^^^
let incident_report_register_by_count  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- incident_report_register_by_count ')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.incident_report_register.incident_report_register.get_data_by_count",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				incident_report_register_by_count_draw(data);
			}
		});
	}

	let incident_report_register_by_count_draw  = function(data){
		console.log("-------------- incident_report_register_by_count_draw -------------- ");
		let report_name = "Incident Report Register";
		console.log(data);
		let date = [];
		let count = [];
		count.push("Count");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			count.push(item.count);
		});

		console.log('date', date);
		console.log('count', count);

		var chart = bb.generate({
			title: {text: "Incident Report by Count "},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date
					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					count
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#incident_report_register_by_count",
		});
	}



	// ^^^^^^^^^^^^^^^^^ incident_report_register  - END  ^^^^^^^^^^^^^^^^^^^




	// ~~~~~~~~~~~~~~~~~~ Cutlery Inventory Count Register ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let cutlery_inventory_count_register_by_difference  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- cutlery_inventory_count_register_by_difference')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.cutlery_inventory_count_register.cutlery_inventory_count_register.get_data_by_difference",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				cutlery_inventory_count_register_by_difference_draw(data);
			}
		});
	}


	let cutlery_inventory_count_register_by_difference_draw  = function(data){
		console.log("-------------- cutlery_inventory_count_register_by_difference_draw -------------- ");
		let report_name = "Cutlery Inventory Count Register";
		console.log(data);
		let date = [];
		let difference = [];
		difference.push("Difference");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			difference.push(item.difference);
		});

		console.log('date', date);
		console.log('difference', difference);

		var chart = bb.generate({
			title: {text: "Cutlery Inventory Count by Difference "},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date
					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					difference
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#cutlery_inventory_count_register_by_difference",
		});
	}


	// ~~~~~~~~~~~~~~~~~~ discount_form_by_percentage start ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let discount_form_by_percentage  = function(time_of_invoke){
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}

		console.log('-----filters----- discount_form_by_percentage')
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.report.discount_form_register.discount_form_register.get_data_by_percentage",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log('data', data);
				discount_form_by_percentage_draw(data);
			}
		});
	}

let discount_form_by_percentage_draw  = function(data){
		console.log("-------------- discount_form_by_percentage_draw -------------- ");
		let report_name = "Discount Form Register";
		console.log(data);
		let date = [];
		let percentage = [];
		let bill_value = [];


		percentage.push("Percentage");
		bill_value.push("Bill Value");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
			date.push(item.date);
			percentage.push(item.percentage);
			bill_value.push(item.bill_value);

		});

		console.log('date', date);
		console.log('percentage', percentage);
		console.log('bill_value', bill_value);


		var chart = bb.generate({
			title: {text: "Discount Form by Percentage"},
			data: {
				type: "bar",
				onclick: function(arg1){
					console.log(arg1);
					let date_clicked = date[arg1.index];
					console.log(date_clicked); // date
					opening_new_tab_simple(report_name, filters, date_clicked);
				},
				columns: [
					bill_value, percentage
				]
			},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#discount_form_by_percentage",
		});
	}

	// ~~~~~~~~~~~~~~~~~~ discount_form_by_percentage end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$(frappe.render_template("single_page_chart", {})).appendTo(page.body);
	chef_opening_checklist_audit('on-load');
	chef_closing_checklist_audit('on-load');
	dm_opening_checklist_audit('on-load');
	dm_closing_checklist_audit('on-load');

	chef_production_register('on-load');
	sales_report_register('on-load');
	sales_by_payment_mode('on-load');
	breakages_report_register('on-load');

	nc_report_register_by_count('on-load');
	incident_report_register_by_count('on-load');

	cutlery_inventory_count_register_by_difference('on-load');
	discount_form_by_percentage('on-load');

 }



