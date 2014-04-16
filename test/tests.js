(function (T, $) {
  var $doc, $body, $target;

  T.testStart(function () {
    $doc = $(document);
    $body = $(document.body).append('<div id="target" />');
    $target = $('div#target');
    $.fx.off = true;
  });

  T.testDone(function () {
    $target.remove();
    $.fx.off = false;
  });

  /*** INIT ***/

  T.module('init');

  T.test('adds proper attributes to the target', function() {
    $target.multilist();

    T.equal($target.attr('role'), 'listbox');
    T.equal($target.attr('aria-multiselectable'), 'true');
  });

  T.test('shows target', function() {
    $target.hide();

    $target.multilist();

    T.ok($target.is(':visible'), 'Target should be made visible');
  });

  /*** CLICK WHEN OPEN ***/

  T.module('click when closed', {
    setup: function() {
      $target.multilist();
    }
  });

  T.test('shows and focuses search', function() {
    // focus never happens unless this is called manually
    $.fn.multilist.call($target, 'open');

    var $searchHolder = $('div.search', $target);
    var $search = $('input[role="search"]', $searchHolder);

    T.ok($searchHolder.length == 1, 'Search element holder should be created');
    T.ok($searchHolder.is(':visible'), 'Search element holder should be made visible');
    T.ok($search.length == 1, 'Search element should be created');
    T.ok($search.is(':focus'), 'Search element should have focus');
  });

  T.test('shows items', function() {
    $target.click();

    var $items = $('div.items', $target);

    T.ok($items.length == 1, 'Items holder element should be created');
    T.ok($items.is(':visible'), 'Items holder element should be made visible');
  });

  T.test('adds `opened\' css class', function() {
    // have to call manually for whatever reason
    $.fn.multilist.call($target, 'open');

    T.ok($target.hasClass('opened'), 'Target should have `opened\' css class');
  });

  /*** CLICK WHEN CLOSED ***/

  T.module('click when open', {
    setup: function() {
      $target.multilist();
      $.fn.multilist.call($target, 'open');
    }
  });

  T.test('clears the search', function() {
    var $searchHolder = $('div.search', $target);
    var $search = $('input[role="search"]', $searchHolder);
    var $items = $('div.items', $target);
    $search.val('foo');
    $items.addClass('filtered');

    // have to call manually for whatever reason
    $.fn.multilist.call($target, 'close');

    T.ok(!$searchHolder.is(':visible'), 'Search element holder should be hidden');
    T.equal($search.val(), '');
    T.ok(!$items.hasClass('filtered'), 'Items holder element should no longer have `filtered\' css class');
  });
} (QUnit, jQuery));
