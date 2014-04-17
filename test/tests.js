(function (T, $) {
  var $target, $toggle, datalist, $items, $search;

  T.testStart(function () {
    $.fx.off = true;
    datalist = [
      {value: 1, text: 'foo'},
      {value: 2, text: 'bar'},
      {value: 3, text: 'baz'},
      {value: 4, text: 'qux'},
      {value: 5, text: 'quux'},
      {value: 6, text: 'corge'},
      {value: 7, text: 'grault'},
      {value: 8, text: 'garply'},
      {value: 9, text: 'waldo'},
      {value: 10, text: 'fred'},
      {value: 11, text: 'plugh'},
      {value: 12, text: 'xyzzy'},
      {value: 13, text: 'thud'},
      {value: 14, text: 'foobar'},
    ];
  });

  T.testDone(function () {
    destroyMultilist();
    $.fx.off = false;
  });

  var destroyMultilist = function() {
    if ($target) {
      $target.remove();
      $target = null;
    }
  };

  var initMultilist = function(options) {
    destroyMultilist();
    $(document.body).append('<div id="target" style="display: none;" />');
    $target = $('div#target');
    $target.multilist(options || {
      datalist: datalist
    });
    $toggle = $('a.label', $target);
    $items = $('.holder.items a', $target);
    $search = $('.holder.search input[role="search"]', $target);
  };

  Array.prototype.map = Array.prototype.map || function(fn) {
    var ret = [];

    for (var i = 0; i < this.length; ++i) {
      ret.push(fn(this[i]));
    }

    return ret;
  };

  /*** INIT ***/

  T.module('init');

  T.test('adds proper attributes to and shows the target', function() {
    initMultilist();

    T.equal($target.attr('role'), 'listbox', '`role\' attribute should be set to `listbox\'');
    T.equal($target.attr('aria-multiselectable'), 'true', '`aria-multiselectable\' attribute should be set to `true\'');
    T.ok($target.is(':visible'), 'Target should be made visible');
  });

  T.test('renders datalist items as list items', function() {
    initMultilist();

    T.equal($items.length, datalist.length, 'Should render all the items from the datalist (and no more)');
    $items.each(function(i, e) {
      var item = datalist[i];
      var $e = $(e);

      T.equal($e.attr('value'), item.value, '`value\' attribute of item should be set to datalist item value');
      T.equal($e.text().trim(), item.text, 'Text of item should contain datalist item text');
    });
  });

  T.test('renders selected items as selected', function() {
    datalist[0].selected = datalist[1].selected = true;

    initMultilist();

    T.equal($('.holder.items a.selected', $target).length, 2, 'Number of items with `selected\' css class should equal number of items selected');
  });

  /*** CLICK WHEN CLOSED ***/

  T.module('label click when closed', {
    setup: function() {
      initMultilist();
    }
  });

  T.test('shows and focuses search', function() {
    var $searchHolder = $('div.search', $target);

    $toggle.trigger('click');

    T.ok($searchHolder.is(':visible'), 'Search element holder should be made visible');
    T.ok($search.is(':focus'), 'Search element should have focus');
  });

  T.test('shows items', function() {
    $toggle.trigger('click');

    var $itemsHolder = $('div.items', $target);

    T.ok($itemsHolder.length == 1, 'Items holder element should be created');
    T.ok($itemsHolder.is(':visible'), 'Items holder element should be made visible');
  });

  T.test('adds `opened\' css class', function() {
    $toggle.trigger('click');

    T.ok($target.hasClass('opened'), 'Target should have `opened\' css class');
  });

  /*** CLICK WHEN OPEN ***/

  T.module('label click when open', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
    }
  });

  T.test('clears the search and filters', function() {
    var $searchHolder = $('div.search', $target);
    $search.val('foo');
    $items.addClass('filtered');

    $toggle.trigger('click');

    T.ok(!$searchHolder.is(':visible'), 'Search element holder should be hidden');
    T.equal($search.val(), '', 'Search string should be cleared');
    $items.each(function(i, e) {
      T.ok(!$(e).hasClass('filtered'), 'Item should not be filtered');
    });
  });

  T.test('removes `opened\' css class', function() {
    $toggle.trigger('click');

    T.ok(!$target.hasClass('opened'), 'Should remove `opened\' class');
  });

  /*** SEARCH BOX KEYUP ***/

  T.module('search box keyup', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
    }
  });

  T.test('does nothing when less than 3 characters entered', function() {
    var item = datalist[0];

    $search.val(item.text.substring(0, 1));
    $search.trigger('keyup');

    T.ok(!$('.holder.items a', $target).hasClass('filtered'), 'Should not filter after only 1 character');

    $search.val(item.text.substring(0, 2));
    $search.trigger('keyup');

    T.ok(!$('.holder.items a', $target).hasClass('filtered'), 'Should not filter after only 2 characters');

    $search.val(item.text.substring(0, 3));
    $search.trigger('keyup');

    T.ok($('.holder.items a', $target).hasClass('filtered'), 'Should have some items filtered');
  });

  T.test('filters items which don\'t match the entered text', function() {
    var searchStr = 'foo';

    $search.val(searchStr);
    $search.trigger('keyup');

    $('a.filtered', $target).each(function(i, e) {
      var text = $(e).text();
      T.equal(text.indexOf(searchStr), -1, 'Item with text `' + text.trim() + '\' which does not match search string `' + searchStr + '\' should be filtered');
    });

    $($items.filter(function(i) {return $(this).text().indexOf(searchStr) > -1})).each(function(i, e) {
      T.ok(true, 'Item with text `' + $(e).text() + '\' should be found to match search string `' + searchStr + '\'');
    });
  });

  T.module('list item click when unselected', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
    }
  });

  T.test('selects the clicked item', function() {
    var $firstItem = $('.holder.items a', $target).first().trigger('click');

    T.ok($firstItem.hasClass('selected'), 'Should be selected after clicking');
  });

  T.test('calls onChange if set', function() {
    var called = false;
    initMultilist({datalist: datalist, onChange: function() {
      called = true;
    }});

    $('.holder.items a', $target).first().trigger('click');

    T.ok(called, 'Should call the onChange callback');
  });

  T.test('does not select item when default maxSelected of 10 already reached', function() {
    var $tenth = $($items[10]);
    $($items.slice(0, 10)).trigger('click');

    $tenth.trigger('click');

    T.ok(!$tenth.hasClass('selected'), 'Should not select item and exceed maxSelected');
  });

  T.test('allows for a maxSelected of 1', function() {
    initMultilist({datalist: datalist, maxSelected: 1});
    var $second = $($items[1]);
    $items.first().trigger('click');

    $second.trigger('click');

    T.ok(!$second.hasClass('selected'), 'Should not select item and exceed maxSelected');
  });

  T.test('serializes the chosen values', function() {
    for (var i = 1; i < datalist.length; ++i) {
      initMultilist({datalist: datalist, maxSelected: i});

      $($items.slice(0, i)).trigger('click');

      T.equal($target.val(), datalist.slice(0, i).map(function(x) {return x.value;}).join('|'), 'All chosen values should be serialized');
    }
  });

  T.module('list item click when selected', {
    setup: function() {
      initMultilist();
      $toggle.trigger('click');
      $items.first().trigger('click');
    }
  });

  T.test('deselects the item', function() {
    $items.first().trigger('click');

    T.ok(!$items.first().hasClass('selected'), 'Should not be selected after selecting and deselecting');
  });

} (QUnit, jQuery));
