(function() {
    openerp.web.WebClient.include({
        declare_bus_channel: function() {
            this._super();
            var self = this,
                channel = "auto_refresh_kanban_list";
            this.bus_on(channel, function(message) {            // generic auto referesh
                var active_view = this.action_manager.inner_widget.active_view
                if (typeof(active_view) != 'undefined'){   // in mail inbox page, no active view defined
                    var controller = this.action_manager.inner_widget.views[active_view].controller
                    var action = this.action_manager.inner_widget.action
                    var id = message[1];
                    message = message[0];
                    if ( action.auto_refresh>0 && active_view == "kanban" || active_view == "list"  &&
                        controller.model == message  && ! controller.$buttons.hasClass('oe_editing') ||
                        active_view == "form" && controller.model == message && controller.dataset.ids.indexOf(id) != -1){
                        if (active_view == "kanban"){
                            controller.do_reload();    // kanban view has do_reload
                        }
                        else if (active_view == "form") {
                            controller.reload();     // form view only has reload
                        }
                        else if (active_view == "list") {
                            controller.reload();     // list view only has reload
                        }
                    }
                }
            });
            this.add_bus_channel(channel);
            channel = "mail.notification";
            this.bus_on(channel, function(message) {
                var model  = this.action_manager.inner_action.res_model
                var textarea = $('textarea.field_text')[0]  //check whether in mail compose mode
                if (model === 'mail.message' && typeof(textarea)==='undefined'){
                    if (this.session.uid === message){     // message actually the uid
                        this.action_manager.inner_widget.do_searchview_search()
                    }
                }
            });
            this.add_bus_channel(channel);
        },
    });
})();
