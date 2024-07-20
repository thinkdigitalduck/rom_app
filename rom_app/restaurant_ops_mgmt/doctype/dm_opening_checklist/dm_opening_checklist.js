// Copyright (c) 2024, Pubs and contributors
// For license information, please see license.txt

frappe.ui.form.on("Dm Opening Checklist", {
    refresh(frm) {

    },
		onload(frm) {
		frm.set_df_property('dm_open_questions', 'cannot_delete_rows', true);
		frm.set_df_property('dm_open_questions', 'cannot_add_rows', true);
		frm.fields_dict['dm_open_questions'].grid.wrapper.find('.btn-open-row').hide();
		refresh_field('dm_open_questions');
    },

	dm_open_branch: function(frm){
			console.log('brnach fn called');
			let branch_selected = frm.doc.dm_open_branch;
			console.log('branch_selected');
			console.log(branch_selected);

			if(!branch_selected){
				console.log('branch_selected failed');
				return;
			}

			 frappe.call({
			 	method: "rom_app.restaurant_ops_mgmt.api.get_dm_opening_checklist_child",
			 	args: {branch_param: branch_selected},
			 	callback: function(res_questions) {
			 		frm.doc.dm_open_questions = []
			 		console.log('callback-dm start');
			 		console.log(res_questions);
			 		console.log('callback-dm end');

			 		$.each(res_questions.message, function(_i, e){
			 			console.log('-----');
			 			console.log(e[2]);
			 			console.log(_i);
			 			let entry = frm.add_child("dm_open_questions");

			 			entry.dm_open_child_question = e[2];
			 		})

			 		refresh_field("dm_open_questions");
			 		}
		     });

	}

});
