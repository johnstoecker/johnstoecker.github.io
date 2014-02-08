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

        
    });
    
  }
    },

    config: {

        refs: {
            passwordID: '#passwordID',
            userName: '#userName',
            signInButton: '#signInButton',
            createAccountButton: '#createAccountButton',
            newPassword: '#newPassword',
            confirmPassword: '#confirmPassword',
            newAccountNext: '#newAccountNext',
            termsOfServiceBack: '#termsOfServiceBack',
            saveAccountButton:'#saveAccountButton'
        },

        control: {
            passwordID: {
                action: 'doLogin'
            },
            userName: {
                action: 'doLogin'
            },
            signInButton: {
                tap: 'doLogin'
            },
            createAccountButton: {
                tap: 'newAccount'
            },
            saveAccountButton: {
                tap: 'saveNewAccount'
            },
            newPassword: {
                change: 'validatePassword'
            },
            confirmPassword: {
                change: 'validateConfirmPassword'
            },
            newAccountNext: {
                tap: 'showTermsOfService'
            },
            termsOfServiceBack: {
                tap: 'showCreateAccount'
            }
        }
    },
    
    /**
     *Stores information about the user who is logged in
     */
    // TODO: Store entire user state into the localStorage (or a cookie); verify it in database
    storeUserInfo: function () {
        Ext.Ajax.setTimeout(Util.getTimeoutLimit());
        Ext.Ajax.request({
            scope: this,
            url: HOST + '/ws/rest/v1/raxacore/login',
            method: 'GET',
            withCredentials: true,
            useDefaultXhrHeader: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                var userInfoJson = Ext.decode(response.responseText);
                console.log(userInfoJson);

                //only adding necessary fields for localStorage
                 if(userInfoJson.isfriend){
                     Ext.Msg.alert('Are you a friend?','Please use myRaxa app', function() {
                         Util.logoutUser();
                     });
                 }
                var privilegesArray = [];
                var i=0;
                if(userInfoJson.privileges){
                    for (i = 0; i < userInfoJson.privileges.length; i++) {
                        privilegesArray[i] = {
                            'name': userInfoJson.privileges[i].name,
                            'description': userInfoJson.privileges[i].description
                        };
                    }
                }
                for (j = 0; j < userInfoJson.roles.length; j++) {
                    if(userInfoJson.roles[j].role === 'System Developer' || userInfoJson.roles[j].role === 'Provider'){
                        privilegesArray[i] = {
                            'name': 'all privileges',
                            'description': 'allprivileges'
                        };
                    }
                }
                localStorage.setItem('firstName', userInfoJson.firstName);
                localStorage.setItem('lastName', userInfoJson.lastName);
               localStorage.setItem('providerAttributes', Ext.encode(userInfoJson.providerAttributes));
               var providerAttributes= JSON.parse(localStorage.providerAttributes);
               if(providerAttributes !==null){
                   for(var i=0; i<providerAttributes.length; i++) {
                       var attributeName = providerAttributes[i].attributeType.replace(/\s+/g, '');
                       localStorage.setItem("provider"+attributeName , providerAttributes[i].value );
                   }
               }
                localStorage.setItem('personAttributes', Ext.encode(userInfoJson.personAttributes));
                var personAttributes= JSON.parse(localStorage.personAttributes)
                if(personAttributes !==null){
                    for(var i=0; i<personAttributes.length; i++) {
                        var attributeName = personAttributes[i].attributeType.replace(/\s+/g, '');
                        localStorage.setItem("person"+attributeName , personAttributes[i].value );
                    }
                }

                localStorage.setItem('session', JSON.stringify({
                    person: userInfoJson.personUuid,
                    display: userInfoJson.display
                }));
                localStorage.setItem("privileges", Ext.encode(privilegesArray));
                localStorage.setItem('loggedInProvider',userInfoJson.providerUuid);
                var myLocation = userInfoJson.location;
                localStorage.setItem('location', myLocation);
                this.loginSuccess();
            },
            failure: function () {
                Ext.Viewport.setMasked(false);
                Ext.Msg.alert('Invalid username or password');
            }
        });
    },


    // doLogin functions populates the views in the background while transferring
    // the view to dashboard
    doLogin: function () {
        var username = Ext.getCmp('userName').getValue();
        localStorage.setItem("username", username);

        if (username === "") {
            Ext.Msg.alert('Please Enter Username');
            // Ext.Msg.alert(Ext.i18n.appBundle.getMsg('RaxaEmr.controller.session.blankusername'));
            return;
        }

        var password = Ext.getCmp('passwordID').getValue();
        if (password === "") {
            Ext.Msg.alert('Please Enter Password');
            // Ext.Msg.alert(Ext.i18n.appBundle.getMsg('RaxaEmr.controller.session.blankpassword'));
            return;
        }
        Ext.getCmp('passwordID').setValue("");

        //passing username & password to saveBasicAuthHeader which saves Authentication
        //header as Base64 encoded string of user:pass in localStore
        Util.saveBasicAuthHeader(username, password);

        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Logging in',
            modal: true
        });
        this.storeUserInfo();

    },

    /**
     * Called when login is successful for the given user
     */
    loginSuccess: function () {
        if(Ext.getCmp('mainMenu')==null){
            Ext.Viewport.add(Ext.create('PushUpGame.view.menu'));
        }
        Ext.Viewport.remove(Ext.getCmp('login'));
        Ext.Viewport.setMasked(false);
        //load friends after login
        Ext.getCmp('mainMenuTitle').setTitle("Dr. " + localStorage.firstName + " " + localStorage.lastName);
        Ext.getCmp('mainMenu').show();
        Ext.Ajax.setDefaultHeaders(Util.getBasicAuthHeaders());
        $('#appLoadingIndicator').remove();
    },


    //This function determines the login state
    //If already logged in, it redirects to the dashboard
    getLoginState: function () {
        if (localStorage.getItem('basicAuthHeader') && localStorage.getItem('loggedInProvider')) {
            this.loginSuccess();
            return true;
        } else {
            return false;
        }
    },

    newAccount: function() {
        if(Ext.getCmp('createAccount')==null){
            Ext.Viewport.add(Ext.create('PushUpGame.view.createAccount'));
        }
        Ext.getCmp('createAccount').show();
    },

    validatePassword : function() {
        var newPassword = Ext.getCmp('newPassword').getValue();
        var minPasswordLength = 4;
        if(newPassword.length > 0) {
            if(newPassword.length < minPasswordLength) {
                Ext.getCmp('newPassword').reset();
                Ext.Msg.alert('Error', 'Password must be 4 characters long');
            }
        }
    },

    validateConfirmPassword : function(){
        var newPassword = Ext.getCmp('newPassword').getValue();
        var confirmPassword = Ext.getCmp('confirmPassword').getValue();
        if(confirmPassword.length > 0 && newPassword.length > 0) {
            if( newPassword !== confirmPassword) {
                Ext.getCmp('confirmPassword').reset();
                Ext.Msg.alert('Error', 'Confirm password is not same as new Password');
            }
            if( newPassword === Ext.getCmp('newUserName').getValue()){
                Ext.Msg.alert('Error', 'Username cannot be the same as password');
                Ext.getCmp('confirmPassword').reset();
                Ext.getCmp('newPassword').reset();
            }
        }
    },
    
    showCreateAccount: function(){
        console.log('hide termsOfService');
        Ext.getCmp('termsOfService').hide();
        //Ext.getCmp('viewport').setActiveItem(DoctorPhone_PAGES.VIEWPORT.CREATE_ACCOUNT);
    },
    
    showTermsOfService: function() {
        
    },
    
    saveNewAccount: function() {
        console.log('Saving New Account');
        var newUser ={
            email: Ext.getCmp('email').getValue(),
            userName: Ext.getCmp('newUserName').getValue(),
            password: Ext.getCmp('newPassword').getValue(),
            firstName: Ext.getCmp('givenName').getValue(),
            lastName: Ext.getCmp('familyName').getValue(),
            type: 'provider',
            gender : Ext.getCmp('providerSexSelectField').getValue(),
            //dob: Util.Datetime(01-01-1970),
            //dob: Util.Datetime(Ext.getCmp('dateOfBirth').getValue()),
        }
        localStorage.setItem('newUser', Ext.encode(newUser));
        if(newUser.email && newUser.userName && newUser.password && newUser.firstName && newUser.lastName && newUser.gender!==""){
        }
        else{
            Ext.Msg.alert('Error', 'Please fill in all the Fields!');
            return 1;
        }
        //saving now
        if(Ext.getCmp('agreementChecked').isChecked()){
            Ext.getCmp('createAccount').setMasked({
                xtype: 'loadmask',
                message: 'Creating Account',
                modal: true
            });


            var locAddress = {
                name : 'Practice of Dr. '+Ext.getCmp('givenName').getValue()+' '+Ext.getCmp('familyName').getValue(),
                // address1 : formDetails.address,
                // cityVillage : formDetails.city,
                // stateProvince : formDetails.state,
                // country : formDetails.country,
                tags : [{name: "providerLocation"}]
            }

            // var getPosition = function(position) {
            //     locAddress.latitude = position.coords.latitude;
            //     locAddress.longitude = position.coords.longitude;
            //     myScope = this;
            //     this.sendProviderLocation(Ext.encode(locAddress));
            // };

            // if (navigator.geolocation)
            // {
            //     navigator.geolocation.getCurrentPosition(getPosition);
            // }
            // else{
                this.sendProviderLocation(Ext.encode(locAddress));
            // }
        }
        else {
            Ext.Msg.alert("","Please Agree to the Terms of Service");
        }
    },

    sendProviderLocation: function(location) {
        Ext.Ajax.request({
            scope:this,
            url: HOST + '/ws/rest/v1/raxacore/location',
            method: 'POST',
            params: location,
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                this.sendNewProvider(JSON.parse(response.responseText).uuid);
            },
            failure: function (response) {
                Ext.getCmp('createAccount').setMasked(false);
                console.log("inside failure");
                Ext.Msg.alert("","Error -- check network connection");
            }
        });
    },

    sendNewProvider: function(location) {
        var newUser = JSON.parse(localStorage.newUser);
        newUser.location = location;
        var newUserParam = Ext.encode(newUser);
        localStorage.removeItem('newUser');
        Ext.Ajax.request({
            scope:this,
            url: HOST + '/ws/rest/v1/raxacore/user',
            method: 'POST',
            params: newUserParam,
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                var responseJson = Ext.decode(response.responseText);
                console.log(responseJson);
                Ext.Msg.alert("Account Created", "Please Login to Continue");
                if(Ext.getCmp('login')==null){
                    Ext.Viewport.add(Ext.create('PushUpGame.view.login'));
                }
                Ext.getCmp('login').show();
                Ext.getCmp('createAccount').destroy();
                if(Ext.getCmp('helpCarousel')){
                    Ext.getCmp('helpCarousel').destroy();
                }
                Ext.getCmp('userName').setValue(responseJson.userName);
            },
            failure: function (response) {
                Ext.getCmp('createAccount').setMasked(false);
                console.log("inside failure");
                Ext.Msg.alert("","Error -- check network connection");
            }
        });
    }
});
