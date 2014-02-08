Ext.define('PushUpGame.view.deckView', {
    extend: 'Ext.Container',
    id: 'deckView',
    config: {
        width: '100%',
        height: '100%',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [
        {
            id: 'theDeck',
            layout: 'card',
            height: 350,
            width: 250,

            items: [{
                html: '<div style="margin:2% 10%"> <img src="resources/images/cardBack.png" /></div>'
            }, {
                html: '<div style="margin:2% 10%"> <img src="resources/images/jackDiamonds.png" /></div>',
                showAnimation: 'flip'
            }]
        },{
            id: 'pushupsLeft',
            xtype: 'label',
            hidden: true
        }]
    }
});