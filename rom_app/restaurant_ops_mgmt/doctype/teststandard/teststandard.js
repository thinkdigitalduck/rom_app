
frappe.ui.form.on("teststandard", {
	refresh(frm) {
		frappe.prompt([
			{'fieldname': 'birth', 'fieldtype': 'Date', 'label': 'Birth Date', 'reqd': 1}
		],
		function(values){
			show_alert(values, 3);
		},
		'Age verification',
		'Subscribe me'
		)

	},
});
