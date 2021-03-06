Ext.define('PushUpGame.store.Concepts', {
    requires: ['PushUpGame.model.Concept'],
    extend: 'Ext.data.Store',

    config: {
        model: 'PushUpGame.model.Concept',
        proxy: {
            type: 'rest',
            url: 'http://23.21.75.27:4000/diagnosis/fever/',
            useDefaultXhrHeader: false,
            reader: {
                type: 'json'
            }
        }
    }
});
