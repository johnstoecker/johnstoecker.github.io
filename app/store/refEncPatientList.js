Ext.define('PushUpGame.store.refEncfriendList', {
    requires: ['PushUpGame.model.friends'],
    extend: 'Ext.data.Store',
    config: {
        model: 'PushUpGame.model.friends',
        proxy: {
            type: 'ajax',
            reader: {
                type: 'json',
                rootProperty: 'friends'
            }
        }
    }
});
