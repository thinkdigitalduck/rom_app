frappe.ui.form.on("Discount Form", {
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
	discount_type: function(frm) {
		calculate_discounted_price(frm);
	},
	bill_value: function(frm) {
		calculate_discounted_price(frm);
	},
});
function calculate_discounted_price(frm) {
	let discount_type = frm.doc.discount_type;
	if(discount_type){
		console.log('discount_type=',discount_type);
		let arrStr = discount_type.split(/[-%]/);
		let withoutspace_discount = arrStr[1].replace(/\s/g, "");
		frm.set_value('discount_percentage', withoutspace_discount);

		let bill_value = frm.doc.bill_value;
		let discounted_price = bill_value -( (withoutspace_discount/100 ) * bill_value);
		frm.set_value('discounted_price', discounted_price);

	}
	// let	result = discount_type.split("-");
	// let number_and_sign = result[1];
	// let number = number_and_sign.split("%");
	// number = number
 //
 //    document.write(result[0]);

	// if(item_price && quantity){
	// 	let total_cost = item_price * quantity;
	// 	console.log('total_cost=',total_cost);
	// 	frm.set_value('cost', total_cost);
	// }
}
