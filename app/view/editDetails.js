/**
 * This panel will overlay when the settings button is
 * pressed. Used for editing name/username/password/etc
 */
Ext.define("PushUpGame.view.editDetails", {
    extend: 'Ext.form.Panel',
    id: 'editDetails',
    config: {
        listeners: {
            painted: function() {
                Ext.getCmp('providerSpecialty').setValue(localStorage.providerSpecialty);
                Ext.getCmp('providerDegree').setValue(localStorage.providerDegree);
                Ext.getCmp('providerRegistrationNumber').setValue(localStorage.providerRegistrationNumber);
                Ext.getCmp('providerTimingsLine1').setValue(localStorage.providerTimingsLine1);
                Ext.getCmp('providerTimingsLine2').setValue(localStorage.providerTimingsLine2);
                Ext.getCmp('providerContactNumber').setValue(localStorage.personPrimaryContact);
                Ext.getCmp('providerSecondaryContactNumber').setValue(localStorage.personSecondaryContact);
                Ext.getCmp('providerGivenName').setValue(localStorage.firstName);
                Ext.getCmp('providerFamilyName').setValue(localStorage.lastName);
                Ext.getCmp('providerEmail').setValue(localStorage.personEmail);
            }
        },
        height: '100%',
        items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            height: 44,
            width: '100%',
            title: 'Edit Details',
            items: [
                {
                    xtype: 'button',
                    align: 'right',
                    ui: 'confirm',
                    iconMask: true,
                    id: 'updateProviderDetails',
                    text: 'Save',
                    handler: function() {
                        // Ext.getCmp('editDetails').hide();
                        var providerAttributes= [{
                            value: Ext.getCmp('providerSpecialty').getValue(),
                            attributeType: localStorage.specialtyUuidproviderattributetype,
                            attributeName: "Specialty"
                        }, {
                            value: Ext.getCmp('providerDegree').getValue(),
                            attributeType: localStorage.degreeUuidproviderattributetype,
                            attributeName: "Degree"
                        }, {
                            value: Ext.getCmp('providerRegistrationNumber').getValue(),
                            attributeType: localStorage.regnumberUuidproviderattributetype,
                            attributeName: "Registration Number"
                        }, {
                            value: Ext.getCmp('providerTimingsLine1').getValue(),
                            attributeType: localStorage.timings1Uuidproviderattributetype,
                            attributeName: "TimingsLine1"
                        }, {
                            value: Ext.getCmp('providerTimingsLine2').getValue(),
                            attributeType: localStorage.timings2Uuidproviderattributetype,
                            attributeName: "TimingsLine2"
                        }
                        ];

                        var providerParams = Ext.getCmp('editDetails').removeBlankAttributes(providerAttributes);

                        var personAttributes = [{
                            value: Ext.getCmp('providerContactNumber').getValue(),
                            attributeType: localStorage.primaryContactUuidpersonattributetype,
                            attributeName: "Primary Contact"
                        }, {
                            value: Ext.getCmp('providerSecondaryContactNumber').getValue(),
                            attributeType: localStorage.secondaryContactUuidpersonattributetype,
                            attributeName: "Secondary Contact"
                        }, {
                            value: Ext.getCmp('providerEmail').getValue(),
                            attributeType: localStorage.emailUuidpersonattributetype,
                            attributeName: "Email"
                        }];

                        var personParams = Ext.getCmp('editDetails').removeBlankAttributes(personAttributes);

                        var attributeParams = {
                            providerAttributes: providerParams,
                            personAttributes: personParams,
                            firstName: Ext.getCmp('providerGivenName').getValue(),
                            lastName: Ext.getCmp('providerFamilyName').getValue(),
                            // email: Ext.getCmp('providerEmail').getValue()
                            // userName: Ext.getCmp('providerEmail').getValue()
                        };
                        Ext.getCmp('editDetails').addAttributesToStorage(attributeParams);

                        var session = Util.getSession();
                        session.display = "Dr. " + Ext.getCmp('providerGivenName').getValue()+" "+Ext.getCmp('providerFamilyName').getValue();
                        localStorage.setItem('session', Ext.encode(session));
                        localStorage.setItem('firstName', Ext.getCmp('providerGivenName').getValue());
                        localStorage.setItem('lastName', Ext.getCmp('providerFamilyName').getValue());
                        Ext.getCmp('mainMenuTitle').setTitle(Util.getSession().display);

                        var qItem = new Ext.OfflineQueueObject({
                                    path :  HOST + '/ws/rest/v1/raxacore/provider/'+localStorage.loggedInProvider,
                                    method: 'POST',
                                    param : attributeParams,
                                    needBasicAuth: true
                        });
                        Ext.OfflineQueue.enqueue(qItem);
                        // Ext.Viewport.remove(Ext.getCmp('editDetails'));
                    }
                }
            ]
        },
        {
            xtype: 'textfield',
            id: 'providerGivenName',
            placeHolder: 'Given Name',
            name: 'givenName'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerFamilyName',
            placeHolder: 'Family Name',
            name: 'familyName'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerContactNumber',
            placeHolder: 'Contact Number',
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerSecondaryContactNumber',
            placeHolder: 'Secondary Contact Number',
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerEmail',
            placeHolder: 'Email',
            name: 'email',
            // listeners: {
            //     change: function(textField, newValue) {
            //         if(newValue !== localStorage.personEmail){
            //             Ext.getCmp('updateProviderDetails').hide();
            //             if(Ext.getCmp('updateEmailProviderResponse')._html.length===0){
            //                 Ext.getCmp('updateEmailProviderResponse').hide();
            //                 Ext.getCmp('updateEmailProviderResponse').setHtml('Checking Email...');
            //             }
            //             Ext.getCmp('updateEmailProviderResponse').show();
                        
            //             Ext.Ajax.request({
            //                 scope: this,
            //                 url: HOST + '/ws/rest/v1/raxacore/user?checkUsername='+newValue,
            //                 method: 'GET',
            //                 headers: Util.getBasicAuthHeaders(),
            //                 success: function (response) {
            //                     var usernameResponse = Ext.decode(response.responseText);
            //                     if(usernameResponse.userExists === "true"){
            //                         Ext.getCmp('updateEmailProviderResponse').setHtml('Error: Email Already Registered');
            //                     }else{
            //                         //Ext.getCmp('usernameResponseShow').hide();
            //                         if(Ext.getCmp('updateEmailProviderResponse')._html.length!=0){
            //                             Ext.getCmp('updateEmailProviderResponse').setHtml('');
            //                         }
            //                         Ext.getCmp('updateProviderDetails').show();
                                    
                                    
            //                     }
            //                 },
            //                 failure: function () {
            //                     Ext.getCmp('updateEmailProviderResponse').setHtml('Error: Internet Required to check email');
            //                 }
            //             });
            //         } else{
            //             Ext.getCmp('updateEmailProviderResponse').hide();
            //             Ext.getCmp('updateProviderDetails').show();
            //         }

            //     }
            // }
        }, {
            html: '',
            hidden: true,
            margin: '1% 2% 1% 2%',
            id: 'updateEmailProviderResponse',
            width: '100%'
        }, {
           xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerSpecialty',
            placeHolder: 'Specialty',
            name: 'specialty'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerDegree',
            placeHolder: 'Degree',
            name: 'degree'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerRegistrationNumber',
            placeHolder: 'Registration Number',
            name: 'registrationNumber'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerTimingsLine1',
            placeHolder: 'Office Timings',
            name: 'timingsLine1'
        }, {
            xtype: 'textfield',
            margin: '2% 0 0 0',
            id: 'providerTimingsLine2',
            placeHolder: 'Office Timings cont.',
            name: 'timingsLine2'
        }]
    },
    
    /**
     * takes an array of attributes, strips out those with blank values
     */
    removeBlankAttributes: function(attributes) {
        var newAttributes = [];
        for(var i=0; i<attributes.length; i++){
            var attribute = attributes[i];
            if(attribute.value !== ""){
                newAttributes.push(attribute);
            }
        }
        return newAttributes;
    },
    
    addAttributesToStorage: function(attributes) {
        console.log(attributes);
        for(var i =0; i< attributes.personAttributes.length; i++){
            var attribute = attributes.personAttributes[i];
            var attributeName = "person"+attribute.attributeName;
            attributeName = attributeName.replace(/\s+/g, '');
            localStorage.setItem(attributeName, attribute.value);
        }
        for(var i =0; i< attributes.providerAttributes.length; i++){
            var attribute = attributes.providerAttributes[i];
            var attributeName = "provider"+attribute.attributeName;
            attributeName = attributeName.replace(/\s+/g, '');
            localStorage.setItem(attributeName, attribute.value);
        }
    },
});
