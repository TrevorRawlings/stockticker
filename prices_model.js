// Backbone model & collection to store the most recent stockPrices

if (!window.StockTicker)             { window.StockTicker = {}; }
if (!window.StockTicker.Models)      { StockTicker.Models = {}; }
if (!window.StockTicker.Collections) { StockTicker.Collections = {}; }


StockTicker.Models.Price = Backbone.Model.extend({

  schema: {
    symbol:         { dataType: 'Text', readOnly: true   },
    AskRealtime:    { dataType: 'Decimal',  title: 'Price', readOnly: true },
    PercentChange:  { dataType: 'PercentChange', title: 'Percent Change', readOnly: true }
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.on('change:AskRealtime',   function() { this.this._AskRealtime_as_float = null; } );
    this.on('change:PercentChange', function() { this.this._PercentChange_as_float = null; } );
  },

  // ----------------------------------------------------------------------------
  // Speed up access to the numeric values
  //

  AskRealtime_as_float: function() {
    if (!this._AskRealtime_as_float) { this._AskRealtime_as_float = this.convert("AskRealtime", "Float");  }
    return this._AskRealtime_as_float;
  },

  PercentChange_as_float: function() {
    if (!this._PercentChange_as_float) { this._PercentChange_as_float = this.convert("PercentChange", "Float");  }
    return this._PercentChange_as_float;
  }
})
Backbone.Edit.ConverterMixin.add_to(StockTicker.Models.Price);


StockTicker.Collections.Price = Backbone.Collection.extend({
  model: StockTicker.Models.Price,

  options: {
    default_sort: { field: 'symbol', sortAsc: true }
  },

  initialize: function(models, options) {
    Backbone.Collection.prototype.initialize.apply(this, arguments);

    this.set_sort_by( this.options.default_sort.field, this.options.default_sort.sortAsc );
    this.on('add remove reset change:PercentChange', this.update_max_min, this );
  },

  // -------------------------------------------------------------------
  // Find the Max / min

  update_max_min: function() {
    this.max_PercentChange = null;
    this.min_PercentChange = null;

    this.each(function(element, index, list) {
      var value = element.PercentChange_as_float();
      if (_.isNull(this.max_PercentChange) || value > this.max_PercentChange) { this.max_PercentChange = value; }
      if (_.isNull(this.min_PercentChange) || value < this.min_PercentChange) { this.min_PercentChange = value; }
    }, this)
  },

  // -------------------------------------------------------------------
  // Collection sorting
  //

  set_sort_by: function(field, sortAsc) {
    if (!_.include(['symbol', 'AskRealtime', 'PercentChange'], field) || !_.isBoolean(sortAsc)) { throw 'invalid argument'; }

    if (!this.sort_by || (this.sort_by.field != field) || (this.sort_by.sortAsc != sortAsc))
    {
        this.sort_by = { field: field, sortAsc: sortAsc };
        this.comparator = this['sort_by_' + this.sort_by.field]
        this.sort()  // Forces the collection to re-sort itself (http://backbonejs.org/#Collection-sort).
    }
  },
  get_sort_by: function() { return this.sort_by },


  // "sort" comparator functions take two models, and return
  // -1 if the first model should come before the second,
  //  0 if they are of the same rank and
  //  1 if the first model should come after.
  sort_by_symbol: function(price1, price2) {
    var value1 = price1.get("symbol");
    var value2 = price2.get("symbol");
    return value1.localeCompare(value2) * (this.sort_by.sortAsc ? 1 : -1);
  },

  sort_by_AskRealtime: function(price1, price2) {
    return this.compare_floats(price1.AskRealtime_as_float(), price2.AskRealtime_as_float(), this.sort_by.sortAsc);
  },

  sort_by_PercentChange: function(price1, price2) {
    return this.compare_floats(price1.PercentChange_as_float(), price2.PercentChange_as_float(), this.sort_by.sortAsc);
  },

  compare_floats: function(value1, value2, sortAsc) {
      var compare = 0;
      if (value1 > value2) { compare = 1; }
      if (value1 < value2) { compare = -1; }
      return (sortAsc) ? compare : (compare * -1);
  }
})


// -----------------------------------------------
// Convert PercentChange to a float
//

Backbone.Edit.percentChangeConverter = function() { }
_.extend(Backbone.Edit.percentChangeConverter.prototype, {
    string_check: /^[-+]?\d*\.?\d*%$/,   // from http://www.bitspace.in/2012/03/decimal-floating-point-number.html
                                        //# [-+]?[0-9]*\.?[0-9]

    fromServerString_ToFloat: function(string) {
        if (_.isNull(string)) { return null ; }
        if (!_.isString(string) || !this.string_check.test(string)) { throw "decimalConverter.fromServerString() expected a string but got" + string; }
        return parseFloat(string)
    }
})
Backbone.Edit.converters.percentChange = new Backbone.Edit.percentChangeConverter()


