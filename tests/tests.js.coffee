describe "stockticker", ->
  view = null
  collection = null
  $container = null

  beforeEach ->
    $container = $('div.TestDiv');

    collection = new StockTicker.Collections.Price();
    collection.reset(stockPrices.query.results.quote);
    view = new StockTicker.PricesView({ collection: collection });
    $container.append(view.render().el);
    view.show();

  afterEach ->
    view.close()

  it "should render", ->
    $rows = $('.slick-row')
    expect( $rows.length ).toEqual(25)
    expect( $rows.length ).toEqual(stockPrices.query.results.quote.length)

  it "should render the correct titles", ->
    $headers = $('.slick-header-column')
    expect( $headers.length ).toEqual(4)
    for expected, i in ['Symbol', 'Price', 'Percent Change', '%']
      expect( $headers.eq(i).text()).toEqual(expected)

  it "should highlight the max and min values", ->
    $rows = $('.slick-row')
    expect( $rows.eq(9).hasClass('min_PercentChange') ).toEqual(true)
    expect( $rows.eq(18).hasClass('max_PercentChange') ).toEqual(true)

    expect( $('.slick-row.min_PercentChange').length ).toEqual(1)
    expect( $('.slick-row.max_PercentChange').length ).toEqual(1)

  it "by default should order by symbol", ->
    expect( collection.sort_by ).toEqual({field: "symbol", sortAsc: true})

    expect( $('.slick-row:first .slick-cell:first').text() ).toEqual("ABH.L")
    expect( $('.slick-row:last .slick-cell:first').text() ).toEqual("VOD.L")

    expect( $('.slick-header-column').eq(0).hasClass('slick-header-column-sorted') ).toEqual(true)

  it "should format the values correctly", ->
    $cells = $('.slick-row:first .slick-cell')
    expect( $cells.length ).toEqual(4)

    for expected, i in ["ABH.L", "0.11", "-4.73%", '<span class="percent-complete-bar" style="display: inline-block;height: 6px;margin-top: 7px;background:red;width:4.73%"></span>']
      expect( $cells.eq(i).html()).toEqual(expected)

  describe "sort by", ->
    $headers = null

    beforeEach ->
      $headers = $('.slick-header-column')

    check_first_and_last = (first, last) ->
      expect( $('.slick-row:first .slick-cell:first').text() ).toEqual(first)
      expect( $('.slick-row:last .slick-cell:first').text() ).toEqual(last)

    describe "AskRealtime", ->
      describe "asc", ->
        beforeEach ->
          $headers.eq(1).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "AskRealtime", sortAsc: true})
          check_first_and_last('ABH.L', 'HSBA.L')

      describe "desc", ->
        beforeEach ->
          $headers.eq(1).click()
          $headers.eq(1).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "AskRealtime", sortAsc: false})
          check_first_and_last('HSBA.L', 'ABH.L')


    describe "PercentChange", ->
      describe "asc", ->
        beforeEach ->
          $headers.eq(2).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "PercentChange", sortAsc: true})
          check_first_and_last("ESO.L", "OXS.L")

          expect( $('.slick-row:first').hasClass('min_PercentChange') ).toEqual(true)
          expect( $('.slick-row:last').hasClass('max_PercentChange') ).toEqual(true)

      describe "desc", ->
        beforeEach ->
          $headers.eq(2).click()
          $headers.eq(2).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "PercentChange", sortAsc: false})
          check_first_and_last("OXS.L", "ESO.L")

    describe "PercentChange2", ->
      describe "asc", ->
        beforeEach ->
          $headers.eq(3).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "PercentChange", sortAsc: true})

      describe "desc", ->
        beforeEach ->
          $headers.eq(3).click()
          $headers.eq(3).click()

        it "should have the correct order", ->
          expect( collection.sort_by ).toEqual({field: "PercentChange", sortAsc: false})

