frappe.listview_settings['Chef Opening Checklist'] = {
        onload(listview) {
			console.log("listview_settings");
			let systemmanager_user_role_avail = frappe.user.has_role("System Manager");
			let chef_user_role_avail = frappe.user.has_role("Rom_Chef_Role");
			let rm_user_role_avail = frappe.user.has_role("ROM_RM_Role");

			if (systemmanager_user_role_avail)
			{

			}
			else
			{
				if (rm_user_role_avail)
				{
					// $(".btn-primary").hide()
				}
			}

        },
    };


