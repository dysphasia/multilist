(function (T, $) {
  var $doc, $body, $target;

  T.testStart(function () {
    $doc = $(document);
    $body = $(document.body).append('<div id="target" />');
    $target = $('div#target');
  });

  T.testDone(function () {
    $target.remove();
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

  /*** OPEN ***/

  T.module('open');

  T.test('shows search', function() {
    $target.multilist();

    $target.click();

    var $search = $('div.search', $target);

    T.ok($search.length == 1, 'Search element should be created');
    T.ok($search.is(':visible'), 'Search element should be made visible');
  });

  T.test('shows items', function() {
    $target.multilist();

    $target.click();

    var $items = $('div.items', $target);

    T.ok($items.length == 1, 'Items holder element should be created');
    T.ok($items.is(':visible'), 'Items holder element should be made visible');
  });
} (QUnit, jQuery));
