frappe.pages['single-page-chart'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Chart View',
		single_column: true
	});

	// page.set_title('My Page')
 //
	// page.set_indicator('Done', 'red')
 //
	// let $btn = page.set_primary_action('New', () =>frappe.msgprint("Clicked New"), 'octicon octicon-plus')
 //
	// let $btnOne = page.set_secondary_action('Refresh', () => frappe.msgprint("Clicked Refresh"), 'octicon octicon-sync')
 //
	// page.add_menu_item('Send Email', () => frappe.msgprint("Clicked Send Email"))
 //
	// page.add_action_item('Delete', () => frappe.msgprint("Clicked Delete"))

	// let field = page.add_field({
	// 	label: 'Status',
	// 	fieldtype: 'Select',
	// 	fieldname: 'status',
	// 	options: [
	// 		'Open',
	// 		'Closed',
	// 		'Cancelled'
	// 	],
	// 	change() {
	// 		frappe.msgprint(field.get_value());
	// 	}
	// });

	let branch_field = page.add_field({
		label: 'Branch',
		fieldtype: 'Link',
		fieldname: 'branch_name',
		options: 'Branch',
		// change() {
		// 	//frappe.msgprint(branch_field.get_value());
		// }
	});

	let from_date_field = page.add_field({
		label: 'From Date',
		fieldtype: 'Date',
		fieldname: 'from_date',
		// change() {
		// 	//frappe.msgprint(from_date_field.get_value());
		// }
	});

	let to_date_field = page.add_field({
		label: 'To Date',
		fieldtype: 'Date',
		fieldname: 'to_date',
		// change() {
		// 	//frappe.msgprint(to_date_field.get_value());
		// }
	});

	let submit_field = page.add_field({
		label: 'Submit',
		fieldtype: 'Button',
		fieldname: 'submit_button',
		click: function ()  {
			let branch = branch_field.get_value();
			let from_date = from_date_field.get_value();
			let to_date = to_date_field.get_value();
			let all_value = branch + " - " + from_date  + " - " + to_date
			frappe.msgprint(all_value);
		}
	});


	// $(frappe.render_template("programing_page", {})).appendTo(page.body);

	let page_chart = function(){
			let chart = new frappe.Chart( "#frost-chart", {
			data: {
			labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
				"12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

			datasets: [
				{
					name: "Some Data", chartType: 'bar',
					values: [25, 40, 30, 35, 8, 52, 17, -4]
				},
				{
					name: "Another Set", chartType: 'bar',
					values: [25, 50, -10, 15, 18, 32, 27, 14]
				},
				{
					name: "Yet Another", chartType: 'bar',
					values: [15, 20, -3, -15, 58, 12, -17, 37]
				}
			],

			yMarkers: [{ label: "Marker", value: 70,
				options: { labelPos: 'left' }}],
			yRegions: [{ label: "Region", start: -10, end: 50,
				options: { labelPos: 'right' }}]
			},

			title: "Estate Price Chart",
			type: 'axis-mixed', // or 'bar', 'line', 'pie', 'percentage'
			height: 300,
			colors: ['red', 'blue', 'green'],

			tooltipOptions: {
				formatTooltipX: d => (d + '').toUpperCase(),
				formatTooltipY: d => d + ' pts',
			}
		  });
	}


	$(frappe.render_template("single_page_chart", {
		data:"Hi Frappe"
	})).appendTo(page.body);

	page_chart();


}
