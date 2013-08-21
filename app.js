$(document).ready(new function(){
  var view, collection;
  var $container = $('div.slickgrid');

  collection = new StockTicker.Collections.Price();
  collection.reset(stockPrices.query.results.quote);
  view = new StockTicker.PricesView({ collection: collection });
  $container.append(view.render().el);
  view.show(); // notify the view that it is now visible so that it renders the slickgrid

  var template = Backbone.Edit.helpers.createTemplate('Showing {{results}} results, last updated {{updated}}.');
  $('.lastUpdate').html(template({ results: collection.length, updated: stockPrices.query.created }))
})
