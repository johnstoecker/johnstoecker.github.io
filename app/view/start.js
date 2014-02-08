Ext.define('PushUpGame.view.start', {
    extend: 'Ext.Container',
    id: 'start',
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
                // xtype: 'carousel',
                // id: 'helpCarouselBody',
                // fullscreen: false,
                // width: '100%',
                // height: '100%',
                // maxWidth: '600px',
                // maxHeight: '760px',
                // items:[
                //     {
                        html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/pushups.png" /></div>'
                //     },
                //     {
                //         html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/help/screen2.png" /></div>'
                //     },
                //     {
                //         html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/help/screen3.png" /></div>'
                //     }
                // ]
            },{
                xtype: 'panel',
                id: 'helpCarouselFooter',
                width: '100%',
                padding: '1% 5%',
                docked: 'bottom',
                layout: {
                    align: 'end',
                    pack: 'center',
                    type: 'hbox',
                },
                items: [{
                    xtype: 'button',
                    id: 'startButton',
                    docked: 'bottom',
                    ui: 'loginConfirm',
                    styleHtmlContent: true,
                    // width: 180,
                    // maxWidth: '180px',
                    // flex:.45,
                    text: 'Start'
                }]
            }]
        }
});