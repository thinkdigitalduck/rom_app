frappe.ui.form.on("Task", {
    refresh(frm) {
        frm.add_custom_button(__('Add Task'), function(){
			frappe.call({
				method: "rom_app.scheduled_tasks.inventory_closing",
				callback: function(msg) {
				console.log("frappe call");
			}
		});
    });
},
});
