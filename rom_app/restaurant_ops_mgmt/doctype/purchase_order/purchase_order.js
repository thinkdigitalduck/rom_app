 frappe.ui.form.on("Purchase Order", {
refresh(frm) {
		  //  frm.set_df_property('raw_material_list', 'cannot_add_rows', true);
  //       frm.set_df_property('raw_material_list', 'cannot_delete_rows', true);
  //       frm.set_df_property('raw_material_list', 'cannot_delete_all_rows', true);
		disable_drag_drop(frm);
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


					frm.set_query("po_template", function() {
					return {
						"filters": {
							"branch": branch__id
						}
					};
				});

					// =======
					// let entry = frm.add_child("raw_material_from_template");
					// entry.raw_material =  2;
					// 	entry.item =  2;
					// entry.unit = 'Kg';
					// entry.price = 78;
					// frm.refresh_field("raw_material_from_template");
					//frm.fields_dict[<fieldname>].disp_area.innerText = "Text to Display".
					// =========

				}
			});
			//------------------------------------
		};
		disable_drag_drop(frm);
	},


	po_template: function(frm) {
		if(frm.doc.po_template) {
			console.log('po_template - succeeded ');
			console.log(frm.doc.po_template);
			let po_template = frm.doc.po_template;
			let branch__id = frm.doc.branch_id;

			//-- frappe call start --
			frm.call({
				doc: frm.doc,
				method: 'get_raw_material',
				args: {
					po_template: po_template,
					branch: branch__id
				},
				freeze:true,
				freeze_message: "Processing",
				callback: function(r){
					if (r.message) {
						let msg = r.message;

						console.log(msg);
						console.log('lenght',msg.length);
						frm.doc.raw_material_from_template = [];
						if (msg.length == 0){
							frappe.show_alert("Raw materials are unavailable.");
						}
						else
						{
							$.each(msg, function(_i, e){
								let entry = frm.add_child("raw_material_from_template");
								//entry.raw_material = e[0];
								console.log('before',entry);
								console.log('***********************************');
								console.log(e);
								let raw_material_number =  Number(e[0]);
								//entry.raw_material =  raw_material_number;
								console.log(raw_material_number);
								//entry.raw_material =  e[0];
								entry.raw_material =  raw_material_number;
								entry.unit = e[1];
								entry.price = e[2];
								console.log('after',entry);
							});
							//frm.refresh_field("raw_material_from_template");
							frm.refresh_field("raw_material_from_template");
							frm.save();
							frm.refresh();

						}

					}
				}
		    });
			//-- frappe call end --
		}
		else {
			console.log('po_template - failed ');
			frm.doc.raw_material_from_template = [];
			//refresh_field("raw_material_from_template");
		}
	},

});

function disable_drag_drop(frm) {
		frm.page.body.find('[data-fieldname="raw_material_list"] [data-idx] .data-row  .sortable-handle').removeClass('sortable-handle');
	}

