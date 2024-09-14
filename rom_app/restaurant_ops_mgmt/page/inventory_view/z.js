
// --------------------  inventory_po chart  ---------------------------
	let inventory_wastage  = function(time_of_invoke){
		console.log('inventory_wastage')
		let filters = "";
		if(time_of_invoke == 'on-load'){
			console.log('on-load');
		    filters = global_get_filters();
		} else {
			console.log('on-submit');
			filters = global_get_filters_on_submit();
		}
		console.log(filters);
		frappe.call({
			method: "rom_app.restaurant_ops_mgmt.page.inventory_view.inventory_view_sql.inventory_wastage",
			args: {
				'filters':filters
			},
			callback: function(data) {
				console.log(data);
				inventory_wastage_chart(data);
			}
		})
	}

	let inventory_wastage_chart  = function(data){
		console.log("-- inventory_wastage_chart -------------- ");
		// http://rom_site:8000/app/query-report/Chef%20Production%20Register
		// ?from_date_filter=2024-07-29&to_date_filter=2024-08-12&
		//category_filter=Briyani&item_filter=Mandi+Briyani
		let category_filter = "Total Amount";
		let report_name = "Inventory Wastage by Date";

		console.log(data);
		let date = [];
		let inv_wastage = [];

		inv_wastage.push("item");

		let message = data.message;
		message.forEach((item) => {
			console.log(item);
				date.push(item.date);
				inv_wastage.push(item.inv_wastage);
		});
		console.log('date', date);
		console.log('inv_wastage', inv_wastage);

		var chart = bb.generate({
			title: {text: "Inventory Wastage by Date"},
			data: {
			type: "bar",
			onclick: function(arg1){
				console.log(arg1);
				console.log(arg1.x);

				let item_filter=date[arg1.x];
				console.log(item_filter); // Mutton briyani
				console.log(arg1.value);
				//opening_new_tab(report_name, filters, "category_filter", category_filter, "item_filter", item_filter);
			},
			columns: [inv_wastage,],
		},
		axis: {
			x: {type: "category",categories: date,},
		},
		bindto: "#inventory_wastage",
		});
	}
