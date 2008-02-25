/*
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 *
 * The Original Code is the Bugzilla Testopia System.
 *
 * The Initial Developer of the Original Code is Greg Hendricks.
 * Portions created by Greg Hendricks are Copyright (C) 2006
 * Novell. All Rights Reserved.
 *
 * Contributor(s): Greg Hendricks <ghendricks@novell.com>
 *                 Ryan Hamilton <rhamilton@novell.com>
 *                 Daniel Parker <dparker1@novell.com>
 */

SearchPopup = function(tab, params){
    var win = new Ext.Window({
        id: 'search_win',
        closable: true,
        width: Ext.getBody().getViewSize().width - 150,
        height: Ext.getBody().getViewSize().height - 150,
        plain: true,
        shadow: false,
        layout: 'fit',
        items: [new SearchPanel(tab, params)]
    });
    win.show();
};

SearchPanel = function(tab, params){
    params = params || {};

    SearchPanel.superclass.constructor.call(this,{
        title: 'Create a Search',
        id: 'search_panel',
        autoScroll: true,
        activeTab: tab + '_search_panel',
        defaults: {
        // applied to each contained panel
            bodyStyle:'padding:10px',
            autoScroll: true
        },
        items:[
            new PlanSearch(params),
            new CaseSearch(params),
            new RunSearch(params),
            new CaseRunSearch(params)
        ]
    });
};
Ext.extend(SearchPanel, Ext.TabPanel);

PlanSearch = function(params){
    this.params = params;
    PlanSearch.superclass.constructor.call(this,{
        title: 'Plan Search',
        id: 'plan_search_panel',
        layout:'fit',
        buttons:[{
            text: 'Submit',
            handler: function(){
                var form = new Ext.form.BasicForm('plan_search_form');
                var searchnum = Math.round(Math.random()*100);
                try {
                    // EXT BUG - Closing always causes an error: 
                    // http://extjs.com/forum/showthread.php?t=20930
                    Ext.getCmp('search_win').close();
                }
                catch(err){}
                if (params.report){
                    Ext.getCmp('object_panel').add(new Ext.Panel({
                        id: 'plan_search' + searchnum, 
                        closable: true,
                        title: 'Plan Report',
                        autoScroll: true,
                        listeners: { 'render': function(){
                            this.load({
                                url: 'tr_plan_reports.cgi',
                                params: form.getValues()
                            });
                        }},
                        tbar:[new Ext.Toolbar.Fill(),
                        {
                            xtype: 'button',
                            id: 'save_plan_report_btn',
                            icon: 'testopia/img/save.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Save this report',
                            handler: function(b,e){
                                saveSearch('plan', form.getValues());
                            }
                        },{
                            xtype: 'button',
                            id: 'link_plan_report_btn',
                            icon: 'testopia/img/link.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Create a link to this report',
                            handler: function(b,e){
                                linkPopup(form.getValues());
                            }
                        }]
                    }));
                    Ext.getCmp('object_panel').activate('plan_search' + searchnum);
                }
                else{
                    Ext.getCmp('object_panel').add(new PlanGrid(form.getValues(),{
                        id: 'plan_search' + searchnum, 
                        closable: true,
                        title: 'Plan Search'
                    }));
                    Ext.getCmp('object_panel').activate('plan_search' + searchnum);
                }
            }
        }]
    });

    this.on('activate', this.onActivate, this);
};
Ext.extend(PlanSearch, Ext.Panel,{
    onActivate: function(event){
        this.params.current_tab = 'plan';
        this.load({
            url: 'tr_query.cgi',
            params: this.params,
            scripts: true,
            text: 'Loading search form...'
        });
    }
});

CaseSearch = function(params){
    this.params = params;
    CaseSearch.superclass.constructor.call(this,{
        title: 'Case Search',
        id: 'case_search_panel',
        layout:'fit',
        buttons:[{
            text: 'Submit',
            handler: function(){
                var form = new Ext.form.BasicForm('case_search_form');
                var searchnum = Math.round(Math.random()*100);
                try {
                    // EXT BUG - Closing always causes an error: 
                    // http://extjs.com/forum/showthread.php?t=20930
                    Ext.getCmp('search_win').close();
                }
                catch(err){}
                if (params.report){
                    Ext.getCmp('object_panel').add(new Ext.Panel({
                        id: 'case_search' + searchnum, 
                        closable: true,
                        title: 'Case Report',
                        autoScroll: true,
                        listeners: { 'render': function(){
                            this.load({
                                url: 'tr_case_reports.cgi',
                                params: form.getValues()
                            });
                        }},
                        tbar:[new Ext.Toolbar.Fill(),
                        {
                            xtype: 'button',
                            id: 'save_case_report_btn',
                            icon: 'testopia/img/save.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Save this report',
                            handler: function(b,e){
                                saveSearch('case', form.getValues());
                            }
                        },{
                            xtype: 'button',
                            id: 'link_case_report_btn',
                            icon: 'testopia/img/link.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Create a link to this report',
                            handler: function(b,e){
                                linkPopup(form.getValues());
                            }
                        }]
                    }));
                    Ext.getCmp('object_panel').activate('plan_search' + searchnum);
                }
                else{
                    Ext.getCmp('object_panel').add(new CaseGrid(form.getValues(),{
                        id: 'case_search' + searchnum, 
                        closable: true,
                        title: 'Case Search'
                    }));
                }
                Ext.getCmp('object_panel').activate('case_search' + searchnum);
            }
        }]
    });

    this.on('activate', this.onActivate, this);
};
Ext.extend(CaseSearch, Ext.Panel,{
    onActivate: function(event){
        this.params.current_tab = 'case';
        this.load({
            url: 'tr_query.cgi',
            params: this.params,
            scripts: true,
            text: 'Loading search form...'
        });
    }
});

RunSearch = function(params){
    this.params = params;
    RunSearch.superclass.constructor.call(this,{
        title: 'Run Search',
        id: 'run_search_panel',
        layout:'fit',
        buttons:[{
            text: 'Submit',
            handler: function(){
                var form = new Ext.form.BasicForm('run_search_form');
                var searchnum = Math.round(Math.random()*100);
                try {
                    // EXT BUG - Closing always causes an error: 
                    // http://extjs.com/forum/showthread.php?t=20930
                    Ext.getCmp('search_win').close();
                }
                catch(err){}
                if (params.report){
                    Ext.getCmp('object_panel').add(new Ext.Panel({
                        id: 'run_search' + searchnum, 
                        closable: true,
                        title: 'Run Report',
                        autoScroll: true,
                        listeners: { 'render': function(){
                            this.load({
                                url: 'tr_run_reports.cgi',
                                params: form.getValues()
                            });
                        }},
                        tbar:[new Ext.Toolbar.Fill(),
                        {
                            xtype: 'button',
                            id: 'save_run_report_btn',
                            icon: 'testopia/img/save.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Save this report',
                            handler: function(b,e){
                                saveSearch('run', form.getValues());
                            }
                        },{
                            xtype: 'button',
                            id: 'link_run_report_btn',
                            icon: 'testopia/img/link.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Create a link to this report',
                            handler: function(b,e){
                                linkPopup(form.getValues());
                            }
                        }]
                    }));
                    Ext.getCmp('object_panel').activate('run_search' + searchnum);
                }
                else{
                    Ext.getCmp('object_panel').add(new RunGrid(form.getValues(),{
                        id: 'run_search' + searchnum, 
                        closable: true,
                        title: 'Run Search'
                    }));
                }
                Ext.getCmp('object_panel').activate('run_search' + searchnum);
            }
        }]
    });

    this.on('activate', this.onActivate, this);
};
Ext.extend(RunSearch, Ext.Panel,{
    onActivate: function(event){
        this.params.current_tab = 'run';
        this.load({
            url: 'tr_query.cgi',
            params: this.params,
            scripts: true,
            text: 'Loading search form...'
        });
    }
});

CaseRunSearch = function(params){
    this.params = params;
    CaseRunSearch.superclass.constructor.call(this,{
        title: 'Case-Run Search',
        id: 'case_run_search_panel',
        layout:'fit',
        buttons:[{
            text: 'Submit',
            handler: function(){
                var form = new Ext.form.BasicForm('case_run_search_form');
                var searchnum = Math.round(Math.random()*100);
                try {
                    // EXT BUG - Closing always causes an error: 
                    // http://extjs.com/forum/showthread.php?t=20930
                    Ext.getCmp('search_win').close();
                }
                catch(err){}
                if (params.report){
                    Ext.getCmp('object_panel').add(new Ext.Panel({
                        id: 'case_run_search' + searchnum, 
                        closable: true,
                        title: 'Case-Run Report',
                        autoScroll: true,
                        listeners: { 'render': function(){
                            this.load({
                                url: 'tr_caserun_reports.cgi',
                                params: form.getValues()
                            });
                        }},
                        tbar:[new Ext.Toolbar.Fill(),
                        {
                            xtype: 'button',
                            id: 'save_caserun_report_btn',
                            icon: 'testopia/img/save.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Save this report',
                            handler: function(b,e){
                                saveSearch('caserun', form.getValues());
                            }
                        },{
                            xtype: 'button',
                            id: 'link_plan_list_btn',
                            icon: 'testopia/img/link.png',
                            iconCls: 'img_button_16x',
                            tooltip: 'Create a link to this report',
                            handler: function(b,e){
                                linkPopup(form.getValues());
                            }
                        }]
                    }));
                    Ext.getCmp('object_panel').activate('case_run_search' + searchnum);
                }
                else{
                    Ext.getCmp('object_panel').add(new CaseRunListGrid(form.getValues(),{
                        id: 'case_run_search' + searchnum, 
                        closable: true,
                        title: 'Case-Run Search'
                    }));
                }
                Ext.getCmp('object_panel').activate('case_run_search' + searchnum);
            }
        }]
    });

    this.on('activate', this.onActivate, this);
};
Ext.extend(CaseRunSearch, Ext.Panel,{
    onActivate: function(event){
        this.params.current_tab = 'case_run';
        this.load({
            url: 'tr_query.cgi',
            params: this.params,
            scripts: true,
            text: 'Loading search form...'
        });
    }
});

ReportGrid = function(cfg){
    
    this.store = new Ext.data.JsonStore({
        url: 'tr_query.cgi',
        baseParams: {action: 'get_saved_searches', type: cfg.type},
        root: 'searches',
        fields: ["name","query","author","type"]
    });
    var ds = this.store;
    var current_col = 'dashboard_leftcol';
    
    this.columns = [
        {header: "Name", width: 30, dataindex: "name", sortable: true}
    ];
    
    ReportGrid.superclass.constructor.call(this, {
        id: cfg.id || "reports_grid",
        loadMask: {msg: "Loading ..."},
        autoScroll: true,
        sm: new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {'rowselect': function(sm, i, r){
                var name = r.get('name');
                if(r.get('type') == 1){
                    Ext.getCmp('object_panel').setActiveTab('dashboardpanel');
                    if(Ext.getCmp(name)){
                        return;
                    }
                    var newPortlet = new Ext.ux.Portlet({
                        title: name,
                        id: name,
                        closable: true,
                        autoScroll: true,
                        tools: PortalTools,
                        url: r.get('query')
                    });
                    
                    Ext.getCmp(current_col).add(newPortlet);
                    Ext.getCmp(current_col).doLayout();
            		newPortlet.load({
                        url: r.get('query')
                    });
                    current_col = current_col == 'dashboard_leftcol' ? 'dashboard_rightcol' : 'dashboard_leftcol';
                }
                else{
                    sm.grid.loadPanel(r);
                }
            }}
        }),
        viewConfig: {
            forceFit:true
        }
    });
    Ext.apply(this,cfg);
    this.on('rowcontextmenu', this.onContextClick, this);
    this.on('activate', this.onActivate, this);
};

Ext.extend(ReportGrid, Ext.grid.GridPanel, {
    onContextClick: function(grid, index, e){
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id:'run-ctx-menu',
                items: [{
                    text: 'Open in a new tab', 
                    handler: function(){
                        var r = grid.store.getAt(index);
                        if (r.get('type') == 0){
                            grid.loadPanel(r);
                        }
                        else{
                            var newTab = new Ext.Panel({
                                title: r.get('name'),
                                closable: true,
                                id: 'search' + r.get('name'),
                                autoScroll: true
                            });
                            Ext.getCmp('object_panel').add(newTab);
                            Ext.getCmp('object_panel').activate('search' + r.get('name'));
                    		newTab.load({
                                url: r.get('query')
                            });
                        }
                        
                    }
                },{
                    text: 'Delete Saved Search', 
                    handler: this.deleteSearch.createDelegate(this)
                },{
                    text: 'Refresh List', 
                    handler: function(){
                        grid.store.reload();
                    }
                }]
            });
        }
        e.stopEvent();
        this.menu.showAt(e.getXY());
    },
    deleteSearch: function(){
        var grid = this;
        var form = new Ext.form.BasicForm('testopia_helper_frm',{});
        Ext.Msg.show({
            msg: 'Are you sure you want to delete this search?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text){
                if (btn == 'yes'){
                    var r = grid.getSelectionModel().getSelected();
                    form.submit({
                        url: 'tr_query.cgi',
                        params: {action: 'delete_query', query_name: r.get('name')},
                        success: function(){
                            if (grid){
                                grid.store.load();
                            }
                        },
                        failure: testopiaError
                    });
                }
            }
        });
    },
    onActivate: function(event){
        if (!this.store.getCount()){
            this.store.load();
        }
    },
    loadPanel: function(r){
        var cfg = {
            id: 'search' + r.get('name'), 
            closable: true,
            title: r.get('name')
        };
        var params = searchToJson(r.get('query'));
        var tab = params.current_tab;
        switch(tab){
            case 'plan':
                Ext.getCmp('object_panel').add(new PlanGrid(params,cfg));
                break;
            case 'run':
                Ext.getCmp('object_panel').add(new RunGrid(params,cfg));
                break;
            case 'case':
                Ext.getCmp('object_panel').add(new CaseGrid(params,cfg));
                break;
            default:
                Ext.Msg.show({
                    title:'No Type Found',
                    msg: 'There must have been a problem saving this search. I can\'t find a type',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                });
                return;
        }
        Ext.getCmp('object_panel').activate('search' + r.get('name'));
    }
});

PortalTools = [{
    id:'gear',
    handler: function(e,target,panel){
        var form = new Ext.form.BasicForm('testopia_helper_frm',{});
        if(!this.menu){ // create context menu on first right click
            this.menu = new Ext.menu.Menu({
                id: 'portal_tools_menu',
                items: [
                {
                    text: 'Save',
                    handler: function(){
                         Ext.Msg.prompt('Save Report As', '', function(btn, text){
                            if (btn == 'ok'){
                                form.submit({
                                    url: 'tr_query.cgi',
                                    params: {action: 'save_query', query_name: text, query_part: panel.url, type: 1},
                                    success: function(){
                                        Ext.getCmp('reports_grid').store.load();
                                        panel.title = text;
                                    },
                                    failure: testopiaError
                                });
                            }
                        });
                    }
                },{
                    text: 'Link to this report',
                    handler: function(){
                        var path;
                        if (panel.url.match(/^http/)){
                            path = panel.url;
                            path = path.replace(/\&noheader=1/gi, '');
                        }
                        else{
                            var l = window.location;
                            var pathprefix = l.pathname.match(/(.*)[\/\\]([^\/\\]+\.\w+)$/);
                            pathprefix = pathprefix[1];
                            path = l.protocol + '//' + l.host + pathprefix + '/' + panel.url;
                        }
                        var win = new Ext.Window({
                            width: 300,
                            plain: true,
                            shadow: false,
                            items: [new Ext.form.TextField({
                                value: path,
                                width: 287
                            })]
                        });
                        win.show();
                    }
                },{
                    text: 'Delete',
                    handler: function(){
                         Ext.Msg.show({
                            title:'Confirm Delete?',
                            icon: Ext.MessageBox.QUESTION,
                            msg: 'Are you sure you want to delete this report?',
                            buttons: Ext.Msg.YESNO,
                            fn: function(btn, text){
                                if (btn == 'yes'){
                                    form.submit({
                                        url: 'tr_query.cgi',
                                        params: {action: 'delete_query', query_name: panel.title},
                                        success: function(){
                                            Ext.getCmp('reports_grid').store.load();
                                            panel.ownerCt.remove(panel, true);
                                        },
                                        failure: testopiaError
                                    });
                                }
                            }
                        });
                    }
                }]
            });
        }
        e.stopEvent();
        this.menu.showAt(e.getXY());
    }
},{
    id:'close',
    handler: function(e, target, panel){
        panel.ownerCt.remove(panel, true);
    }
}];