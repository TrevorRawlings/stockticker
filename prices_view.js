// Renders a slickgrid containing the most recent prices

if (!window.StockTicker) { window.StockTicker = {}; }


StockTicker.PricesView = Backbone.Slickgrid.View.extend({

  options: {
      autoHeight: true
  },

  columns: {
      symbol:         { },
      AskRealtime:    { },
      PercentChange:  { },
      PercentChange2: { title: '%', formatter: 'percentChangeFormatter', readOnly: true }
  },

  initialize: function(options) {
      Backbone.Slickgrid.View.prototype.initialize.apply(this, arguments);
      _.bindAll(this, 'on_grid_OrderBy_changed')
  },

  createGrid: function() {
    var grid = Backbone.Slickgrid.View.prototype.createGrid.apply(this, arguments);
    grid.onSort.subscribe( this.on_grid_OrderBy_changed );
    this.update_orderby_indicator();
  },

  // =========================================================================
  // == order by

  columnSupportsOrderBy: function (column) {  return true; },

  // on_grid_OrderBy_changed()
  // -------------------------
  //
  // Callback from slickgrid when user clicks on a column heading
  on_grid_OrderBy_changed: function(e, args) {
    var field = (args.sortCol.field == 'PercentChange2') ? 'PercentChange' : args.sortCol.field;
    this.collection.set_sort_by(field, args.sortAsc);
  },

  update_orderby_indicator: function() {
      if (this.grid) {
         var sort_by = this.collection.get_sort_by();
         this.grid.setSortColumns( [{ columnId: sort_by.field, sortAsc: sort_by.sortAsc }] )
      }
  },

  // =========================================================================
  // == Highlight companies with the largest price change

  // override for method in slickgrid_view.js.coffee
  on_metadata: function(row, model, metadata) {
      Backbone.Slickgrid.View.prototype.on_metadata.apply(this, arguments);
      if (model) {
        var value = model.PercentChange_as_float()
        if (value == this.collection.min_PercentChange) {
            metadata.cssClasses += " min_PercentChange";
        }
        if (value == this.collection.max_PercentChange) {
            metadata.cssClasses += " max_PercentChange";
        }
      }
  }


})

Backbone.Slickgrid.FormatterBase.extend = Backbone.View.extend;
Backbone.Slickgrid.formatter = Backbone.Slickgrid.FormatterBase.extend({

    // copied from assets/slick.formatters.js
    percentChangeFormatter: function(row,cell,value,col,data) {
        var value = data.PercentChange_as_float()
        var color = "green";
        if (value == null || value === "") {
            return "";
        }
        if (value < 0) { color =  "red"; value = value * -1; }
        return "<span class='percent-complete-bar' style='display: inline-block;height: 6px;margin-top: 7px;background:" + color + ";width:" + value + "%'></span>";
    }

})

