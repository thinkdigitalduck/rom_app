frappe.ui.form.on("teststandard", "validate", function(frm) {

	var current_date =  frappe.datetime.now_date();
	var current_month = frappe.datetime.str_to_obj(current_date).getMonth()+1;  // JavaScript months are 0-11
	var current_date_part = frappe.datetime.str_to_obj(current_date).getDate();


	var posting_date = frappe.datetime.str_to_obj(frm.doc.posting_date);
    var posting_date_month = posting_date.getMonth()+1;// JavaScript months are 0-11
	var posting_date_date_part = new Date(posting_date).getDate();

	console.log('current_date ',current_date);
	console.log('current_month',current_month);
	console.log('current_date_part',current_date_part);
	console.log('posting_date',posting_date);
	console.log('posting_date_month',posting_date_month);
	console.log('posting_date_date_part',posting_date_date_part);

   if (posting_date_month < current_month) {
        msgprint("Cannot select a date in the previous month.");
        validated = false;
    }
});


/*
frappe.ui.form.on("teststandard", {
	refresh(frm) {
		// frappe.prompt([
		// 	{'fieldname': 'birth', 'fieldtype': 'Date', 'label': 'Birth Date', 'reqd': 1}
		// ],
		// function(values){
		// 	show_alert(values, 3);
		// },
		// 'Age verification',
		// 'Subscribe me'
		// )

	},


});*/
