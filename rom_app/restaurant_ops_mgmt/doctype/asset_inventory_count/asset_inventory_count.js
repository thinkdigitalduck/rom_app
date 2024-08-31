
frappe.ui.form.on("Asset Inventory Count", {
	refresh(frm) {
		frm.set_df_property('items', 'cannot_add_rows', true);
        frm.set_df_property('items', 'cannot_delete_rows', true);
        frm.set_df_property('items', 'cannot_delete_all_rows', true);
		disable_drag_drop(frm);

		//frm.set_df_property('category', 'read_only', 1)

	},
	onload(frm) {

			//frm.set_value('category', '1');
			//frm.set_value('category', 'Kitchen');
			//frm.set_value('category', '2');
			//frm.set_value('category', 'Dining');


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
					let category_param;
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
					//frm.set_value('category', '1');

					//frm.set_value('category', '1');
					//frm.set_value('category', 'Kitchen');


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


					// -----------------------------
					frappe.call({
					method: "rom_app.restaurant_ops_mgmt.api.get_asset_master_singltable_child_based_on_branch_category",
					args: {branch_param: branch__id, category_param: category_param},
					callback: function(res_items) {
						frm.doc.items = []
						console.log('items');
						console.log(res_items);
						$.each(res_items.message, function(_i, e){
							console.log('_i',_i);
							console.log('e',e);
							//let category = e[2];
							let item = e[2];
							let standard_stock = e[3];
							//let category_name = e[5];

							console.log(item, standard_stock);

							let entry = frm.add_child("items");
							//entry.category = category_name;
							entry.item = item;
							entry.standard_stock = standard_stock;
						});
						refresh_field("items");
						}
					});
						//console.log('*************************');
					//-----------------------------

					}
				});
			};
			disable_drag_drop(frm);
	},


});


frappe.ui.form.on("Asset Inventory Count Child2", {
    current_stock:function(frm,cdt,cdn) {
		var d = locals[cdt][cdn];

		let standard_stock_temp = 0;
		let current_stock_temp = 0;
		let cal_val = 0;

		if(parseInt(d.standard_stock)>=0)
			standard_stock_temp = d.standard_stock;

		if(parseInt(d.current_stock)>=0)
			current_stock_temp = d.current_stock;

		cal_val = standard_stock_temp - current_stock_temp;

		console.log('standard_stock_temp->', standard_stock_temp);
		console.log('current_stock_temp->',current_stock_temp);
		console.log('cal_val->', cal_val);
		if(cal_val==0)
		{
			frappe.model.set_value(cdt, cdn, 'difference', '0');
			refresh_field("items");
		}
		else
		{
			frappe.model.set_value(cdt, cdn, 'difference', cal_val);
		}
		//
    }
});

function disable_drag_drop(frm) {
		frm.page.body.find('[data-fieldname="items"] [data-idx] .data-row  .sortable-handle').removeClass('sortable-handle');
	}
