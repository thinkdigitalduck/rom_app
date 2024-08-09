frappe.pages['test-page'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Test Page',
		single_column: true
	});

	page.set_title('My Page');
}
