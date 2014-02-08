Ext.define('PushUpGame.view.helpCarousel', {
    extend: 'Ext.Container',
    id: 'helpCarousel',
    requires : ['PushUpGame.view.login'],
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
                xtype: 'panel',
                id: 'helpCarouselHeader',
                hidden: true,
                padding: '1% 5% 0 5%',
                docked: 'top',
                width: '100%',
//                maxWidth: '600px',
                layout: {
                    type: 'hbox',
                    align: 'start',
                    pack: 'center',
                },
                items: [{
                    xtype: 'label',
                    html: ' ',
                    maxWidth: '460px',
                    flex:.83,
                 }, {
                    xtype: 'button',
                    id: 'btnCloseHelp',
                    flex:.17,
                    baseCls: 'none',
                    text: '<span style="font-size: 1.4em">X</span>',
//                    text: '<img width="auto" height="5%" src="resources/images/close.png" />Close',
                    handler: function(){
                        console.log('clicked Close Help');
                        if(!Ext.getCmp('mainMenu')){
                            Ext.Viewport.add(Ext.create('PushUpGame.view.menu'));
                        }
                        Ext.getCmp('helpCarousel').hide();
                        Ext.getCmp('mainMenu').show();
                    }
                }]
            },{
                xtype: 'carousel',
                id: 'helpCarouselBody',
                fullscreen: false,
                width: '100%',
                height: '100%',
                maxWidth: '600px',
                maxHeight: '760px',
                items:[
                    {
                        html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/help/screen1.png" /></div>'
                    },
                    {
                        html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/help/screen2.png" /></div>'
                    },
                    {
                        html: '<div style="margin:2% 10%"> <img width="100%" height="90%" src="resources/images/help/screen3.png" /></div>'
                    }
                ]
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
                    id: 'btnCreateAccount',
                    ui: 'accountCreate',
                    styleHtmlContent: true,
                    maxWidth: '180px',
                    flex:.45,
                    text: 'Create Account',
                    handler: function(){
                        console.log('clicked CreateAccount');
                        if(!Ext.getCmp('createAccount')){
                            Ext.Viewport.add(Ext.create('PushUpGame.view.createAccount'));
                        }
                        Ext.getCmp('createAccount').show();
                    }
                }, {
                    xtype: 'label',
                    html: ' ',
                    maxWidth: '40px',
                    flex:.10,
                }, {
                    xtype: 'button',
                    id: 'btnSignIn',
                    ui: 'loginConfirm',
                    styleHtmlContent: true,
                    maxWidth: '180px',
                    flex:.45,
                    text: 'Sign In',
                    handler: function(){
                        console.log('clicked SignIn');
                        if(!Ext.getCmp('login')){
                            Ext.Viewport.add(Ext.create('PushUpGame.view.login'));
                        }
                        Ext.getCmp('login').show();
                        Ext.getCmp('helpCarousel').hide();
                    }
                }]
            }]
        }
});