Ext.define('PushUpGame.view.notifications', {
    extend: 'Ext.Container',
    id: 'notifications',
    config: {
        height: '100%',
        scrollable: false,
        showAnimation: {
            type: 'slide',
            direction: 'left'
        },
        hideAnimation: {
            type: 'slideOut',
            direction: 'left'
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            height: 44,
            width: '100%',
            title: 'Notifications',
        },
        {
                html: '(No notifications to show)'
        }
        //pages for what to do with notifications come here
        ]
    }
});