frappe.ui.form.on("Chef Indent By Dept", {
	refresh(frm) {
		// frm.set_df_property('raw_materials', 'cannot_add_rows', true);
  //       frm.set_df_property('raw_materials', 'cannot_delete_rows', true);
  //       frm.set_df_property('raw_materials', 'cannot_delete_all_rows', true);
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

// Chef Indent By Dept Child  raw_materials
// branch_name department user_name date branch_id total_price raw_materials
// raw_material unit req_qty issued_qty price  amount closing_qty remarks
 frappe.ui.form.on('Chef Indent By Dept Child', {
    form_render: function(frm,cdt,cdn) {
		console.log(' child row added event form_render');
    },
	issued_qty: function(frm,cdt,cdn) {
		// ord_qty_temp   unit_price_temp  amount_temp    total_price_temp
        var d = locals[cdt][cdn];
		let issued_qty = 0;
		let amount = 0;
		let cal_val = 0;

		if(parseFloat(d.issued_qty)>=0)
			issued_qty = d.issued_qty;

		if(parseFloat(d.price)>=0)
			price = d.price;

		cal_val = issued_qty * price;

		console.log('issued_qty->', issued_qty);
		console.log('price->',price);
		console.log('cal_val->', cal_val);

		frappe.model.set_value(cdt, cdn, 'amount', cal_val);

		console.log('locals->', locals);
		console.log('cdt->', cdt);
		console.log('cdn->', cdn);
		console.log('d->', d);

		//total_price_temp
		console.log('total_price');
		var total_price = 0;
		frm.doc.raw_materials.forEach(function(d) { total_price += d.amount; });
		console.log('total_price', total_price);
		frm.set_value("total_price", total_price);
        refresh_field('raw_materials');
    },
});


function disable_drag_drop(frm) {
		frm.page.body.find('[data-fieldname="raw_materials"] [data-idx] .data-row  .sortable-handle').removeClass('sortable-handle');
	}
