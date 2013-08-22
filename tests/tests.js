(function() {
  describe("stockticker", function() {
    var $container, collection, view;
    view = null;
    collection = null;
    $container = null;
    beforeEach(function() {
      $container = $('div.TestDiv');
      collection = new StockTicker.Collections.Price();
      collection.reset(stockPrices.query.results.quote);
      view = new StockTicker.PricesView({
        collection: collection
      });
      $container.append(view.render().el);
      return view.show();
    });
    afterEach(function() {
      return view.close();
    });
    it("should render", function() {
      var $rows;
      $rows = $('.slick-row');
      expect($rows.length).toEqual(25);
      return expect($rows.length).toEqual(stockPrices.query.results.quote.length);
    });
    it("should render the correct titles", function() {
      var $headers, expected, i, _i, _len, _ref, _results;
      $headers = $('.slick-header-column');
      expect($headers.length).toEqual(4);
      _ref = ['Symbol', 'Price', 'Percent Change', '%'];
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        expected = _ref[i];
        _results.push(expect($headers.eq(i).text()).toEqual(expected));
      }
      return _results;
    });
    it("should highlight the max and min values", function() {
      var $rows;
      $rows = $('.slick-row');
      expect($rows.eq(9).hasClass('min_PercentChange')).toEqual(true);
      expect($rows.eq(18).hasClass('max_PercentChange')).toEqual(true);
      expect($('.slick-row.min_PercentChange').length).toEqual(1);
      return expect($('.slick-row.max_PercentChange').length).toEqual(1);
    });
    it("by default should order by symbol", function() {
      expect(collection.sort_by).toEqual({
        field: "symbol",
        sortAsc: true
      });
      expect($('.slick-row:first .slick-cell:first').text()).toEqual("ABH.L");
      expect($('.slick-row:last .slick-cell:first').text()).toEqual("VOD.L");
      return expect($('.slick-header-column').eq(0).hasClass('slick-header-column-sorted')).toEqual(true);
    });
    it("should format the values correctly", function() {
      var $cells, expected, i, _i, _len, _ref, _results;
      $cells = $('.slick-row:first .slick-cell');
      expect($cells.length).toEqual(4);
      _ref = ["ABH.L", "0.11", "-4.73%", '<span class="percent-complete-bar" style="display: inline-block;height: 6px;margin-top: 7px;background:red;width:4.73%"></span>'];
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        expected = _ref[i];
        _results.push(expect($cells.eq(i).html()).toEqual(expected));
      }
      return _results;
    });
    return describe("sort by", function() {
      var $headers, check_first_and_last;
      $headers = null;
      beforeEach(function() {
        return $headers = $('.slick-header-column');
      });
      check_first_and_last = function(first, last) {
        expect($('.slick-row:first .slick-cell:first').text()).toEqual(first);
        return expect($('.slick-row:last .slick-cell:first').text()).toEqual(last);
      };
      describe("AskRealtime", function() {
        describe("asc", function() {
          beforeEach(function() {
            return $headers.eq(1).click();
          });
          return it("should have the correct order", function() {
            expect(collection.sort_by).toEqual({
              field: "AskRealtime",
              sortAsc: true
            });
            return check_first_and_last('ABH.L', 'HSBA.L');
          });
        });
        return describe("desc", function() {
          beforeEach(function() {
            $headers.eq(1).click();
            return $headers.eq(1).click();
          });
          return it("should have the correct order", function() {
            expect(collection.sort_by).toEqual({
              field: "AskRealtime",
              sortAsc: false
            });
            return check_first_and_last('HSBA.L', 'ABH.L');
          });
        });
      });
      describe("PercentChange", function() {
        describe("asc", function() {
          beforeEach(function() {
            return $headers.eq(2).click();
          });
          return it("should have the correct order", function() {
            expect(collection.sort_by).toEqual({
              field: "PercentChange",
              sortAsc: true
            });
            check_first_and_last("ESO.L", "OXS.L");
            expect($('.slick-row:first').hasClass('min_PercentChange')).toEqual(true);
            return expect($('.slick-row:last').hasClass('max_PercentChange')).toEqual(true);
          });
        });
        return describe("desc", function() {
          beforeEach(function() {
            $headers.eq(2).click();
            return $headers.eq(2).click();
          });
          return it("should have the correct order", function() {
            expect(collection.sort_by).toEqual({
              field: "PercentChange",
              sortAsc: false
            });
            return check_first_and_last("OXS.L", "ESO.L");
          });
        });
      });
      return describe("PercentChange2", function() {
        describe("asc", function() {
          beforeEach(function() {
            return $headers.eq(3).click();
          });
          return it("should have the correct order", function() {
            return expect(collection.sort_by).toEqual({
              field: "PercentChange",
              sortAsc: true
            });
          });
        });
        return describe("desc", function() {
          beforeEach(function() {
            $headers.eq(3).click();
            return $headers.eq(3).click();
          });
          return it("should have the correct order", function() {
            return expect(collection.sort_by).toEqual({
              field: "PercentChange",
              sortAsc: false
            });
          });
        });
      });
    });
  });

}).call(this);
