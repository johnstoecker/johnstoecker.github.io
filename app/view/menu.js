Ext.define('PushUpGame.view.menu', {
    extend: 'Ext.ux.slidenavigation.View',
    // requires: ['PushUpGame.view.friendList', 'PushUpGame.view.friend.friendDashboard', 'PushUpGame.view.helpCarousel'],
    id: 'mainMenu',
    config: {
        /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */
        slideSelector: 'x-titlebar',
        
        /**
         *  Container must be dragged 10 pixels horizontally before allowing
         *  the underlying container to actually be dragged.
         *
         *  @since 0.2.2
         */
        containerSlideDelay: 10,
        
        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 200,

        /**
         *  Enable content masking when container is open.
         *
         *  @since 0.2.0
         */
        itemMask: true,

        /**
         *  Define the default slide button config.  Any item that has
         *  a `slideButton` value that is either `true` or a button config
         *  will use these values at the default.
         */
        slideButtonDefaults: {
            selector: 'toolbar'
        },

        /**
         *  This allows us to configure how the actual list container
         *  looks.  Here we've added a custom search field and have
         *  modified the width.
         */
        list: {
            id: 'slideNavigationList',
            items: [{
                xtype: 'toolbar',
                id: 'mainMenuTitle',
                title: 'Doctor Name',
                style: 'background: #333333',
                centered: false,
                docked: 'top',
                height: 40,
                styeHtmlContent: true,
                width: '100%',
            }]
            
        },
        
        groups: {
            'Group 1': 1,
            'Group 2': 2,
            'Group 3': 3
        },

        listPosition: 'left',
        
        height: '100%',
        items: [
        {
            title: '<div style="margin: -31px 0 0 40px;">friends</div>',
            //add friend logo here
            icon: 'resources/images/icons/Visits.png',
            html: 'yes',
            slideButton: true,
            items:[
            {
                xclass: 'PushUpGame.view.friendList',
            },
            ]
        // },
        // {
        //     title: 'Notifications',
        //     icon: 'resources/images/icons/notification.png',
        //     slideButton: true,
        //     addDynamically: true,
        //     items:[
        //     {
        //         xclass: 'PushUpGame.view.notifications',
        //     }
        //     ]
        },
        {
            //group: 'Settings',
            title: '<div style="margin: -31px 0 0 40px;">Help</div>',
            icon: 'resources/images/icons/Help.png',
            handler: function(){
                if(Ext.getCmp('helpCarousel')==null){
                    Ext.Viewport.add(Ext.create('PushUpGame.view.helpCarousel'));
                }
                Ext.getCmp('mainMenu').list.deselectAll();
                Ext.getCmp('mainMenu').hide();
                Ext.getCmp('helpCarousel').show();
                Ext.getCmp('helpCarouselHeader').show();
                Ext.getCmp('helpCarouselFooter').hide();            
            }
        },
        {
            //group: 'Settings',
            title: '<div style="margin: -31px 0 0 40px;">Edit Profile</div>',
            icon: 'resources/images/icons/Edit_profile.png',
            handler: function() {
                if(Ext.getCmp('dynamicMainMenuPanel')){
                    console.log('destroying');
                    Ext.getCmp('mainMenu').container.remove(Ext.getCmp('dynamicMainMenuPanel'), true);
                }
                var dynamicMainMenuPanel = Ext.create('Ext.Container', {
                    id: 'dynamicMainMenuPanel',
                    items:[{
                        xclass: 'PushUpGame.view.editDetails'
                    }]
                });
                Ext.getCmp('mainMenu').container.add(dynamicMainMenuPanel);
                Ext.getCmp('mainMenu').createSlideButton(Ext.getCmp('editDetails'));

                // Ext.getCmp('userEmail').setValue(localStorage.personEmail);
                // Ext.getCmp('userGivenName').setValue(localStorage.firstName);
                // Ext.getCmp('userFamilyName').setValue(localStorage.lastName);
                Ext.getCmp('mainMenu').container.setActiveItem(Ext.getCmp('dynamicMainMenuPanel'));
                Ext.getCmp('mainMenu').moveContainer(Ext.getCmp('mainMenu'), 0);
            }
        },
        {
            //group: 'Settings',
            title: '<div style="margin: -31px 0 0 40px;">Change Password</div>',
            icon: 'resources/images/icons/Change_password.png',
            handler: function() {
                if(Ext.getCmp('dynamicMainMenuPanel')){
                    console.log('destroying');
                    Ext.getCmp('mainMenu').container.remove(Ext.getCmp('dynamicMainMenuPanel'), true);
                }
                var dynamicMainMenuPanel = Ext.create('Ext.Container', {
                    id: 'dynamicMainMenuPanel',
                    items:[{
                        xclass: 'PushUpGame.view.accountSettings'
                    }]
                });
                Ext.getCmp('mainMenu').container.add(dynamicMainMenuPanel);
                Ext.getCmp('mainMenu').createSlideButton(Ext.getCmp('accountSettings'));

                Ext.getCmp('mainMenu').container.setActiveItem(Ext.getCmp('dynamicMainMenuPanel'));
                Ext.getCmp('mainMenu').moveContainer(Ext.getCmp('mainMenu'), 0);
            }
        },
        {
            //group: 'Settings',
            title: '<div style="margin: -31px 0 0 40px;">Logout</div>',
            icon: 'resources/images/icons/Logout.png',
            handler: function() {
                Util.logoutUser();
            }
        }
        ]
    }

});