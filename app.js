Ext.Loader.setPath({
    'Ext': 'touch-2.3.0/src',
    'Ext.ux':   './ux',
    'PushUpGame': 'app'
});

Ext.application({
    views: [
        'menu',
        'notifications',
        'helpCarousel',
        'friendList'
    ],
    controllers: [
        'session'
    ],
    stores: [
    ],
    models:[
    ],
    
    name: 'PushUpGame',

    launch: function() {
    }

});
