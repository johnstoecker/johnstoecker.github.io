//Check Read me file for License Details
var LOGIN_CSS_CONSTANTS = {
      PAGE_FONT: ' color:#2d7cb8; font-family: "Helvetica Neue", HelveticaNeue, "Helvetica-Neue", Helvetica, "BBAlpha Sans", sans-serif;',
     FSIZE_DESC: 'font-size:1.1em;',
    FSIZE_LABEL: 'font-size:1em;',
   FIELD_BORDER: 'border:1px solid #2d7cb8;',
   MARGIN_LABEL: '1% 0 0 3%',
   MARGIN_TEXTF: '1% 3% 1% 3%',
   BGCOLOR_PAGE: 'background: #FEFEFE',
}

Ext.define('PushUpGame.view.login', {
    extend: 'Ext.Container',
    id: 'login',
    config: {
        style: LOGIN_CSS_CONSTANTS.BGCOLOR_PAGE,
        scrollable: true,
        items: [
        {
            xtype: 'titlebar',
            title: 'Raxa Doctor',
            docked: 'top',
            padding: '0 0 0 2%',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'center'
            },
            items: [{
                html: '<div style="width:40px"><img width="100%" height="auto" src="resources/images/raxaTop.png"/></div>',
                baseCls: 'none',
            }, 
            {
                xtype: 'button',
                id: 'createAccountButton',
                ui: 'accountCreate',
                text: 'Sign Up',
                width: '75px',
                height: '30px',
                align: 'right',
            }
            ]

        },{
            html: '<div align="center" >Sign in with your Raxa Doctor Account</div>',
            style: LOGIN_CSS_CONSTANTS.FSIZE_DESC + LOGIN_CSS_CONSTANTS.PAGE_FONT,            
            margin: '2% 0',
            width: '100%'
        },{
            xtype: 'label',
            html: 'Username',
            style: LOGIN_CSS_CONSTANTS.FSIZE_LABEL + LOGIN_CSS_CONSTANTS.PAGE_FONT,
            margin: LOGIN_CSS_CONSTANTS.MARGIN_LABEL,
        },{
            xtype: 'textfield',
            id: 'userName',
            style: LOGIN_CSS_CONSTANTS.FIELD_BORDER,
            margin: LOGIN_CSS_CONSTANTS.MARGIN_TEXTF,
            placeHolder: 'Username'
        },{
            xtype: 'label',
            html: 'Password',
            style: LOGIN_CSS_CONSTANTS.FSIZE_LABEL + LOGIN_CSS_CONSTANTS.PAGE_FONT,            
            margin: LOGIN_CSS_CONSTANTS.MARGIN_LABEL,
        },{
            xtype: 'passwordfield',
            id: 'passwordID',
            style: LOGIN_CSS_CONSTANTS.FIELD_BORDER,
            margin: LOGIN_CSS_CONSTANTS.MARGIN_TEXTF,
            placeHolder: 'Password'
        },{
            xtype: 'button',
            id: 'signInButton',
            text: 'Sign In',
            ui: 'loginConfirm',
            margin: '6% 2% 1% 2%',
        },
        ]
    }
});