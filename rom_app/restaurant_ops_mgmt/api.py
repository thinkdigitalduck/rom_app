import frappe


@frappe.whitelist(allow_guest=True)
def testapi():
    return "test api returned"


@frappe.whitelist(allow_guest=True)
def get_chef_opening_checklist_child(branch_param):
    parent = frappe.qb.DocType("Chef Opening Checklist Template")
    child = frappe.qb.DocType("Chef Opening Checklist Template Child")

    query = (
        frappe.qb.from_(parent)
        .inner_join(child)
        .on(parent.name == child.parent)
        .select(parent.name, parent.chef_open_template_branch, child.template_question)
        .where(parent.chef_open_template_branch == branch_param)
    )

    result = query.run()
    return result


@frappe.whitelist(allow_guest=True)
def testapi2():
    result = frappe.db.get_list(
        "Chef Opening Checklist Template",
        filters={"chef_open_template_branch": 1},
        fields=["name", "chef_open_template_branch"],
        as_list=True,
    )
    return result


@frappe.whitelist(allow_guest=True)
def get_dm_opening_checklist_child(branch_param):
    parent = frappe.qb.DocType("Dm Opening Checklist Template")
    child = frappe.qb.DocType("Dm Opening Checklist Template Child")

    query = (
        frappe.qb.from_(parent)
        .inner_join(child)
        .on(parent.name == child.parent)
        .select(parent.name, parent.dm_open_template_branch, child.template_question)
        .where(parent.dm_open_template_branch == branch_param)
    )

    result = query.run()
    return result
