frappe.ui.form.on("Breakages Report", {
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

					//-----------------------------
					console.log("getting user role ");
					let systemmanager_user_role_avail = frappe.user.has_role("System Manager");
					let chef_user_role_avail = frappe.user.has_role("Rom_Chef_Role");
					let dm_user_role_avail = frappe.user.has_role("Rom_DM_Role");

					let allroles = frappe.user_roles;
					console.log('allroles-- > ', allroles);

					console.log('systemmanager_user_role_avail - ',systemmanager_user_role_avail);
					console.log('chef_user_role_avail - ',chef_user_role_avail);
					console.log('dm_user_role_avail - ',dm_user_role_avail);

					if (chef_user_role_avail){
						console.log('chef role entered');
						// Kitchen - 2 - hard coded
						frm.set_value('category_name', 'Kitchen');
						frm.set_value('category_id', 2);
						category_param = 2;
					}
					else if (dm_user_role_avail){
						console.log('dining role entered');
						// Dining - 1 - hard coded
						frm.set_value('category_name', 'Dining');
						frm.set_value('category_id', 1);
						category_param = 1;
					}

					console.log('===============================')
					console.log('branch__id=', branch__id)
					console.log('category_param', category_param)

					frm.set_query("item", function(){
						return {
							"filters": [
								["Asset Master", "branch", "=", branch__id],
								["Asset Master", "category", "=",category_param]
							]
						}
				    });

				}
			});
		}
    },

	item: function(frm) {
		console.log(' item selected ');
		calculate_total_breakage_cost(frm);
	},

	quantity: function(frm) {
		calculate_total_breakage_cost(frm);
	},

});

function calculate_total_breakage_cost(frm) {
	let item_price = frm.doc.item_price;
	let quantity = frm.doc.quantity;
	if(item_price && quantity){
		let total_cost = item_price * quantity;
		console.log('total_cost=',total_cost);
		frm.set_value('cost', total_cost);
	}
}


