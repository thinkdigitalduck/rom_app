frappe.ui.form.on("Chef Indent By Dept", {
	refresh(frm) {
		frm.set_df_property('raw_materials', 'cannot_add_rows', true);
        frm.set_df_property('raw_materials', 'cannot_delete_rows', true);
        frm.set_df_property('raw_materials', 'cannot_delete_all_rows', true);
		disable_drag_drop(frm);

		// if(frm.doc.department){
		// 	let dept_sel = frm.doc.department;
		// 	console.log(dept_sel);
		// } else {
		// 	console.log("no value in department ");
		// }

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
				//console.log('branch_id-', branch__id, '=== branch_name-', branch__name);
			}
			});
		}
	},

	department: function(frm) {
		console.log("frm",frm);
		console.log("frm.doc.department=",frm.doc.department);
		if(frm.doc.department) {
			let branch_selected = frm.doc.branch_id;
			let dept_selected = frm.doc.department;
			console.log('branch_selected=',branch_selected);
			console.log('dept_selected=',dept_selected);

			//-- frappe call start --

			frm.call({
				doc: frm.doc,
				method: 'get_raw_material_with_id',
				args: {
					branch: branch_selected,
					department: dept_selected
				},
				freeze:true,
				freeze_message: "Processing",
				callback: function(r){
					if (r.message) {
						let msg = r.message;

						console.log(msg);
						console.log('lenght',msg.length);
						frm.doc.raw_materials = []
						if (msg.length == 0){
							frappe.show_alert("The template records for the department could not be found.");
						}
						else
						{
							// ---- load start ------
							$.each(msg, function(_i, e){
								let entry = frm.add_child("raw_materials");
								entry.raw_material = e[0];
								entry.unit = e[1];
							});
							// ------ load end --------
						}
						refresh_field("raw_materials");
					}
				}
			});


			//-- frappe call end --
		} else {
			console.log("no value in department ");
		}
	}
});
function disable_drag_drop(frm) {
		frm.page.body.find('[data-fieldname="raw_materials"] [data-idx] .data-row  .sortable-handle').removeClass('sortable-handle');
	}
