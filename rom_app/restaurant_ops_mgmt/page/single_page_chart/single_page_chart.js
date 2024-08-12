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
		}
	});

	const itemCounter = (value, index) => {
		return value.filter((x) => x == index).length;
	};

	 // ---------- NEW TAB START ------------
	let opening_new_tab = function (report_name, filters, report_cond, report_cond_result){

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

		console.log("report_url");
		console.log(report_url);
		window.open(report_url,'_blank', 'noopener,noreferrer');
	}
	// ---------- NEW TAB END ------------




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
			text: "Chef Opening Checklist - Chef Audit"
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
			text: "Chef Opening Checklist - RM Audit"
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
			text: "Chef Closing Checklist - Chef Audit"
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
			text: "Chef Closing Checklist - RM Audit"
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
			text: "DM Opening Checklist - DM Audit"
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
			text: "DM Opening Checklist - RM Audit"
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
			text: "DM Closing Checklist - DM Audit"
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
		text: "DM Closing Checklist - RM Audit"
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
			}
		}
		});
	}



   //  ***********************  dm closing checklist audit - end   **************************************

	//


	$(frappe.render_template("single_page_chart", {})).appendTo(page.body);
	chef_opening_checklist_audit('on-load');
	chef_closing_checklist_audit('on-load');
	dm_opening_checklist_audit('on-load');
	dm_closing_checklist_audit('on-load');

 }



