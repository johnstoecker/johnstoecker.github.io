Ext.define('PushUpGame.model.Attribute', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'uuid',
            type: 'string'
        }, {
            name: 'value',
            type: 'string'
        }, {
            name: 'attributeTypeUuid',
            type: 'string',
            mapping: 'attributeType.uuid'
        }, {
            name: 'attributeTypeDisplay',
            type: 'string',
            mapping: 'attributeType.display'
        }]
    }
});

