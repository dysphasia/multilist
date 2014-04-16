(function (T, $) {

  var doc = $(document),
    context = $('#input').multilist();

  T.test('Test Toggle', function () {
    expect(2);
    var firstTab = $('li:first', context),
        firstTabLink = $('a:first', firstTab),
        firstTabUl = $('ul:first', firstTab);

    // First click.
    firstTabLink.click();
    T.equals(firstTabUl.css('display'), 'block');

    // Second click.
    firstTabLink.click();
    T.equals(firstTabUl.css('display'), 'none');
  });
} (QUnit, jQuery));
