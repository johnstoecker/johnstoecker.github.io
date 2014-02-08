Ext.define('PushUpGame.view.friendList', {
    extend: 'Ext.Container',
    id: 'friendList',
    nextPageCounter: 0,
    show: function(){
        console.log('showing!');
    },
    
    config: {
        layout: 'vbox',
        height: '100%',
        items: [{
            docked: 'top',
            xtype: 'titlebar',
            height: 44,
            title: 'Friends',
            items: [{
                xtype: 'button',
                id: 'friendButton',
                icon: 'resources/images/icons/add_new_friend.png',
                iconMask: true,
                align: 'right',
                ui: 'myRaxaFlat',
                listeners: {
                    tap: function(){
                        Ext.getCmp('friendsListToDisplay').setHtml('');
                        if(!Ext.getCmp('friendDetailsForm')){
                            Ext.Viewport.add(Ext.create('PushUpGame.view.friend.friendDetailsForm'));
                        }
                        Ext.getCmp('mainMenu').hide();
                        Ext.getCmp('friendDetailsForm').setfriendDetailsForNewfriend();
                        Ext.getCmp('friendDetailsForm').show();                           
                    }
                }
            }]
        },
        {
            xtype: 'searchfield',
            id: 'searchfriendfield',
            docked: 'top',
            placeHolder: 'Search friends',
            style: 'border-color: #333333; border-width: 1px; border-style : solid;',
            listeners: {
                focus: function(){
                    window.scrollTo(0,0);
                }
            }
        },{
            layout: 'hbox',
            style: 'background: #2d5789;',
            docked: 'top',
            width: '100%',
            //height: 30,
            hidden: true,
            items: [{
                xtype: 'button',
                id: 'incarefriendsButton',
                // style: 'font-size: "80%"',
                text: 'Incare friends',
                styleHtmlContent: true,
                labelCls: 'visitsButtonLabel',
                cls: 'visitsButton',
                style: 'color: #2d7cb8',
                width: '50%',
                margin: '1 1 1 1',
                icon: 'resources/images/icons/Share.png',
                iconAlign: 'center',
                handler: function(button, e, options) {
                    //Ext.getCmp('viewport').setActiveItem(DoctorPhone_PAGES.VIEWPORT.DOCTOR_SEARCH);
                    console.log('show incarefriendsList');
                    Ext.getCmp('friendList').nextPageCounter=0;
                    //Ext.getCmp('visits').loadIncarefriendsListQueue();
                }
            },
            {
                id: 'allfriendsButton',
                margin: '1 1 1 1',
                xtype: 'button',
                icon: 'resources/images/icons/Record.png',
                iconMask: true,
                labelCls: 'visitsButtonLabel',
                cls: 'visitsButton',
                iconAlign: 'center',
                style: 'font-size: "80%"',
                text: 'All friends',
                styleHtmlContent: true,
                width: '50%',
                handler: function(button, e, options) {
                    console.log('show outfriends');
                    Ext.getCmp('friendList').nextPageCounter=0;
                    Ext.getCmp('friendsListToDisplay').getStore().removeAll();
                }
            }]
        },
        {
            xtype: 'list',
            id: 'friendsListToDisplay',
            //IMP: for no loading mask
            loadingText: null, 
            //128px is the height of the items above the list
            height: '100%',
            // docked: 'top',
            //store: 'PushUpGame.store.incarefriendsList',
            // store: Ext.create('PushUpGame.store.Friends', {
            //     storeId: 'friends',
            // }),
            itemTpl: new Ext.XTemplate(
            '<div class="headshot" style="background-image:url(resources/images/headshots/pic.gif);"></div>', 
            '<div style="float:left;width:60%">', '{display}', '</div>', 
            '<div style="float:left;width:100;">', 
            '<div>{age} / {gender}</div></div>',
            '<div style="float:left;width:20%;">', 
            '<div>{[this.display(values)]} </div><div>',
            '</div>',
            {
                date: function(str){
                    return str.encounters[0].encounterDatetime.split("T")[0];
                },
                gender: function(str){
                    if(str == 'M'){
                        return 'Male';
                    }else if(str == 'F'){
                        return 'Female';
                    }
                    else{
                        return str;
                    }
                },
                display: function(str) {
                    if(str.encounters!==undefined){
                        if(str.encounters[0].encounterType === localStorage.referUuidencountertype) {
                            return "Referred"
                        }
                    }else{
                        return "";
                    }
                }  
            } 
        )
        }
        ]
    }
});