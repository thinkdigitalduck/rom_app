frappe.ui.form.on("Inventory Counting", {
	refresh(frm) {

	},
	onload(frm) {
		if (frm.is_new()) {
			console.log('is_new');
			let useremail = frappe.user.get_emails();
			let email = useremail[0];
			console.log('email ',email);
			let api_url = "rom_app.restaurant_ops_mgmt.api.get_the_branch_name_for_the_user"
			//------------------------------------
			frappe.call({
			method: api_url,
			args: {emailid: email},
			callback: function(res) {
				let branch__id = res.message.branch_id;
				let branch__name = res.message.branch_name;
				frm.set_value('branch_id', branch__id);
				frm.set_value('branch_name', branch__name);
				frm.set_df_property('branch_name', 'read_only', 1);
				console.log('branch_id-', branch__id, '=== branch_name-', branch__name);
				}
			});
		}
    },
});


frappe.ui.form.on("Inventory Counting Child", {
    // raw_material  unit  price  clos_stock  quantity diff
    quantity:function(frm,cdt,cdn) {
		console.log("----clos_stock---");
		var d = locals[cdt][cdn];

		let clos_stock = 0;
		let counted_quantity = 0;
		let cal_val = 0;

		// if(parseInt(d.clos_stock)>=0)
		clos_stock_temp = parseFloat(d.clos_stock);

		// if(parseInt(d.quantity)>=0)
		counted_quantity_temp = parseFloat(d.quantity);

		cal_val =  counted_quantity_temp - clos_stock_temp;

		console.log('clos_stock_temp->', clos_stock_temp);
		console.log('counted_quantity_temp->',counted_quantity_temp);
		console.log('cal_val->', cal_val);

		frappe.model.set_value(cdt, cdn, 'diff', cal_val);
		refresh_field("items");
    }
});
