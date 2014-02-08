Ext.Loader.setPath({
    'Ext': '../lib/touch-2.2.1/src',
    'Ext.ux':   './ux',
    'PushUpGame': 'app'
});

Ext.application({
    views: [
        'Viewport',
        'visits',
        'doctorsName',
        'currentVisit',
        'addDrug',
        'addDiagnosis',
        'addInvestigation',
        'addImage',
        'addText',
        'doctorSearchShare',
        'profileDoctorShare',
        'doctorInvite',
        'friendAccess',
        'editDetails',
        'accountSettings',
        'notifications',
        'alarms',
        'help',
        'questionListPanel',
        'questionForm'
    ],
    controllers: [
        'session',
        'records'
    ],
    stores: [
        'Encounters',
        'Concepts',
        'VisitItems',
        'Drugs',
        'PrescriptionFrequencies',
        'Providers',
        'AccessPersons',
        'Observations',
        'Myquestions'
    ],
    models:[
        'Encounter',
        'Observation',
        'drugOrder',
        'Concept',
        'VisitItem',
        'Image',
        'Myquestion'
    ],
    
    name: 'PushUpGame',

    launch: function() {
        // Initialize the main view
        Ext.Viewport.add(Ext.create('PushUpGame.view.Viewport'));
        Ext.Viewport.setHidden(true);
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
        jasmine.getEnv().execute();
    }

});
