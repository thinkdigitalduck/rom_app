frappe.ui.form.on("Purchase Order Template", {
	refresh(frm) {

	},

		onload(frm) {
		if (frm.is_new()) {

			console.log('is_new');

			let useremail = frappe.user.get_emails();
			let email = useremail[0];
			//console.log('email ',email);
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
				console.log('branch_id-', branch__name, '=== branch_name-', branch__name);

				frm.set_query("po_template", function() {
					return {
						"filters": {
							"branch": branch__id
						}
					};
				});


			//-- frappe call start --
			// frm.call({
			// 	doc: frm.doc,
			// 	method: 'get_raw_material',
			// 	args: {
			// 		branch: branch__id
			// 	},
			// 	freeze:true,
			// 	freeze_message: "Processing",
			// 	callback: function(r){
			// 		if (r.message) {
			// 			let msg = r.message;
   //
			// 			console.log(msg);
			// 			console.log('lenght',msg.length);
			// 			frm.doc.raw_material_list = []
			// 			if (msg.length == 0){
			// 				frappe.show_alert("The template records for the department could not be found.");
			// 			}
			// 			else
			// 			{
			// 				// ---- load start ------
			// 				$.each(msg, function(_i, e){
			// 					let entry = frm.add_child("raw_material_list");
			// 					console.log(e);
			// 					entry.raw_material = e[0];
			// 					entry.unit = e[1];
			// 				});
			// 				// ------ load end --------
			// 			}
			// 			refresh_field("raw_material_list");
			// 		}
			// 	}
			// });
			//-- frappe call end --

	 		}
	 		});

			//------------------------------------

	 	}
	 }
});



