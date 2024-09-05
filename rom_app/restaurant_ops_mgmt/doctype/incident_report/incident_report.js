
frappe.ui.form.on("Incident Report", {
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

				frm.set_query("menu_item", function() {
					return {
						"filters": {
							"branch_id": branch__id
						}
					};
				});

				}
			});
		}
	},

});

// 	production_category: function(frm) {
// 		if(frm.doc.production_category) {
// 			console.log('production_category - succeeded ');
// 			console.log(frm.doc.production_category);
// 			let prod_category_selected = frm.doc.production_category;
//
// 			if(prod_category_selected == 1){
// 				console.log('production_category - 1 ');
// 				let get_val = frm.doc.Item;
//
// //				frm.set_df_property('briyani_item', 'hidden', 0);
// //				frm.set_df_property('chicken_item', 'hidden', 1);
// //				frm.set_df_property('other_item', 'hidden', 1);
// 				if(get_val){}
// 				else{
// 				 frm.set_query("item", function() {
// 					return {
// 						query: "rom_app.restaurant_ops_mgmt.api.get_production_item_query_briyani",
// 					}
// 				});
// 			}
// 			} else if(prod_category_selected == 2){
// //				frm.set_df_property('briyani_item', 'hidden', 1);
// //				frm.set_df_property('chicken_item', 'hidden', 0);
// //				frm.set_df_property('other_item', 'hidden', 1);
//
// 					frm.set_query("item", function() {
// 					return {
// 						query: "rom_app.restaurant_ops_mgmt.api.get_production_item_query_chicken",
// 					}
// 				});
// 				console.log('production_category - 2 or 3 ');
// 			}
// 			else if(prod_category_selected == 3){
// //				frm.set_df_property('briyani_item', 'hidden', 1);
// //				frm.set_df_property('chicken_item', 'hidden', 1);
// //				frm.set_df_property('other_item', 'hidden', 0);
// 			}
//
// 		}
// 		else {
// 			console.log('production_category - failed ');
// 		}
// 	},

