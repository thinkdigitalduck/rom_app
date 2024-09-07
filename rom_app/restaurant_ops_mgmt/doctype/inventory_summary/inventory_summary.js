
frappe.ui.form.on("Inventory Summary", {
	refresh(frm) {
		frm.add_custom_button('Count Inventory', function(){

			// ------------------Inventory Counting---------------------------

			let api_url = "rom_app.scheduled_tasks.inventory_summary"
			frappe.call({
				method: api_url,
				callback: function(res) {
					console.log(res);
				}
			});

			// ------------------Inventory Counting---------------------------

    }, );

	},
});
