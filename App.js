Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [
        {html:'Select a checkbox to filter the grid'},
        {
            xtype: 'container',
            itemId: 'StateFilter'
        },
        {
            xtype: 'container',
            itemId: 'ReleaseFilter'
        }
        ],
    launch: function() {
        this._createFilterBox('State');
        this._createFilterBox('Release');
    },
    _createFilterBox: function(property){
        this.down('#'+ property + 'Filter').add({
            xtype: 'checkbox',
            cls: 'filter',
            boxLabel: 'Filter grid by '+ property,
            id: property +'Checkbox',
            handler: this._getFilter,
            scope: this
        });
        this.down('#'+property+'Filter').add({
            xtype: 'rallyfieldvaluecombobox',
            id: property +'Combobox',
            model: 'Defect',
            multiSelect: true,
            field: property,
            listeners: {
                select: this._getFilter,
                ready: this._getFilter,
                scope: this
            }
        });
    },
    
    _getFilter: function() {
        var filter = Ext.create('Rally.data.wsapi.Filter',{property: 'Requirement', operator: '=', value: 'null'});
        filter=this._checkFilterStatus('State',filter);
        filter=this._checkFilterStatus('Release',filter);
            if (this._myGrid === undefined) {
                this._makeGrid(filter);
            }
            else{
                this._myGrid.store.clearFilter(true);
                this._myGrid.store.filter(filter);
               
            }
    },
        
    _checkFilterStatus: function(property,filter){
        if (Ext.getCmp(property+'Checkbox').getValue()) {
            var filterString=Ext.getCmp(property +'Combobox').getValue() +'';
            var filterArr=filterString.split(',');
            var propertyFilter=Ext.create('Rally.data.wsapi.Filter',{property: property, operator: '=', value: filterArr[0]});
            var i=1;
            while (i < filterArr.length){
                propertyFilter=propertyFilter.or({
                    property: property,
                operator: '=',
                value: filterArr[i]
            });
            i++;
        }
        filter=filter.and(propertyFilter);
        }
        return filter;
    },
    _makeGrid:function(filter){
       this._myGrid = Ext.create('Rally.ui.grid.Grid', {
            itemId:'defects-grid',
            columnCfgs: [
                'FormattedID',
                'Name',
                'State',
                'Release'
            ],
            context: this.getContext(),
            storeConfig: {
                model: 'defect',
                context: this.context.getDataContext(),
                filters: filter
            }
        });
       this.add(this._myGrid);
    }
});
