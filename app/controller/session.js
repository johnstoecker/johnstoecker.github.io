//Check Read me file for License Details

Ext.define('PushUpGame.controller.session', {
    extend: 'Ext.app.Controller',

    launch: function() {
        // Startup.getResourceUuid();
        // if (! this.getLoginState()) {
        //     //Load helpCarousel Page
        //     Ext.Viewport.add(Ext.create('PushUpGame.view.helpCarousel'));
        // }
        Ext.Viewport.add(Ext.create('PushUpGame.view.start'));

        
    },

    config: {

        refs: {
            startButton: '#startButton'
        },

        control: {
            startButton: {
                tap: 'start'
            }
        }
    },
    
    start: function() {
        console.log('clicked start');
        // if(!Ext.getCmp('login')){
        //     Ext.Viewport.add(Ext.create('PushUpGame.view.login'));
        // }
        // Ext.getCmp('login').show();
        Ext.getCmp('start').hide();

        FB.Event.subscribe('auth.authResponseChange', function(response) {
            console.log(response);
            if (response.status === 'connected') {
                this.getFriends;
            } else if (response.status === 'not_authorized') {
                FB.login();
            } else {
                FB.login();
            }
        });
        this.getFriends();
    },

    getFriends: function(){
        
        FB.api('/me/friends', function(response) {
            console.log(response);
        });
        var socket = io.connect('http://localhost:8001');
            socket.on('gameContinue', function (data) {
                console.log(data);
                socket.emit('score', { num: 30 });
        });
        if(!Ext.getCmp('deckView')){
            Ext.Viewport.add(Ext.create('PushUpGame.view.deckView'));
            Ext.getCmp('theDeck').element.on('tap', this.drawCard, this);
        }
        Ext.getCmp('deckView').show();
    },

    drawCard: function() {
        Ext.getCmp('theDeck').setActiveItem(1);
        setTimeout(this.startPushing(11));
    },

    startPushing: function(numPushUps) {
        Ext.getCmp('pushupsLeft').setHtml('You have 11 pushups left');
        Ext.getCmp('pushupsLeft').show();
    }
});
