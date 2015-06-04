(function($) {

  /*** SHIMS ***/

  if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function () {},
      fBound = function () {
        return fToBind.apply(
          this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

  /*** CONFIGURATION ***/

  var pluginName = 'multilist';
  var dataItem = 'multilistitem';

  /*** DEFAULTS ***/

  var defaults = {
    canRemove: false,
    datalist: null,
    enableSearch: true,
    initWithCallback: true,
    labelText: '',
    maxSelected: 10,
    closeOnMax: false,
    onChange: function () {},
    onRemove: function () {},
    transitionSpeed: 'fast',
    single: false
  };

  /*** CLASSES ***/

  var selectedClass = 'selected';
  var disabledClass = 'disabled';
  var filteredClass = 'filtered';
  var hiddenClass = 'hidden';
  var openClass = 'opened';
  var labelClass = 'label';
  var multiClass = 'multi';
  var searchClass = 'search';
  var shellClass = 'multilist-shell';

  /*** EVENTS ***/

  var shellEvents = [
    {
      type: 'keyup',
      selector: 'input[role="search"]',
      callback: function ($this, $target, e) {
        var value = $target.val().toLowerCase();
        $this[pluginName]('filter', value);
      }
    },
    {
      type: 'click',
      selector: '.items a',
      callback: function ($this, $target, e) {
        e.preventDefault();

        if ($target.is('div')) {
          $target = $target.parent();
        }

        var attr = $this.data(pluginName);
        var value = $target.attr('value');
        var text = $target.text();

        if (attr.single) {
          attr.$items.removeClass(selectedClass);
          $('span.labeltext', attr.$label).text(text);
        }

        if ($target.hasClass(disabledClass) ||
            (!$target.hasClass(selectedClass) && attr.maxSelected > 0 && getNumSelected($this) >= attr.maxSelected)) {
          return;
        }

        $target.toggleClass(selectedClass);
        attr.onChange(value, text, $target.hasClass(selectedClass), $this);

        if (attr.maxSelected == getNumSelected($this) && attr.closeOnMax) {
          $this[pluginName]('close');
        }

        $this[pluginName]('serialize');
      }
    }
  ];

  var events = [
    {
      type: 'click',
      selector: 'a.label',
      callback: function ($this, $target, e) {
        e.preventDefault();
        if ($this.hasClass(disabledClass)) {
          return;
        }

        $this[pluginName]($this.hasClass(openClass) ? 'close' : 'open');
      }
    },
    {
      type: 'click',
      selector: 'a.remove',
      callback: function ($this, $target, e) {
        e.preventDefault();

        $this[pluginName]('remove', true);
      }
    },
    {
      type: 'click',
      selector: 'div.label span.add',
      callback: function ($this, $target, e) {
        $('a.label', $target.parent()).trigger('click');
      }
    }
  ];

  /*** TEMPLATES ***/

  var templates = {
    base: [
      '<div class="inner">',
      '  <div class="multilist-holder label {{if canRemove}}removable{{/if}}">',
      '    <span class="ui-sprite add">+</span>',
      '    <a href="#" class="label">',
      '      <span class="labeltext">${labelText}</span>',
      '    </a>',
      '    {{if canRemove}}<a href="#" class="remove">x</a>{{/if}}',
      '  </div>',
      '  <div class="multilist-shell">',
      '    {{if enableSearch}}',
      '    <div class="multilist-holder search">',
      '      <input role="search" placeholder="Search" spellcheck="false" autocorrect="false" type="text" />',
      '    </div>',
      '    {{/if}}',
      '    <div class="multilist-holder items">',
      '      <ul role="listbox"></ul>',
      '    </div>',
      '  </div>',
      '</div>',
      '<input type="hidden" name="${name}" />'
    ].join(''),
    items: [
      '<li>',
      '  <a href="#" role="option" value="${value}" class="item {{if selected}}selected{{/if}}" title="${description}" >',
      '    {{if $item.renderCheckbox}}<div class="ui-sprite checkbox"></div>{{/if}}',
      '    ${text}',
      '  </a>',
      '</li>'
    ].join(''),
  };

  $.each(templates, function (k,v ) {
    $.template(k, v);
  });


  /*** API ***/

  var methods = {

    init: function(options) {
      return this.each(function () {
        var attr = $.extend({}, defaults, options);

        var $this = $(this).addClass(pluginName).attr('role', 'listbox').attr('aria-multiselectable', 'true').show();
        var t = this;
        var name = $this.attr('name');

        $.tmpl('base', $.extend({}, attr, {name: name})).appendTo($this);

        attr.$this = $this;
        attr.$label = $this.find('.multilist-holder.label');
        attr.$shold = $this.find('.multilist-holder.search');
        attr.$search = $this.find('input');
        attr.$holder = $this.find('.multilist-holder.items');
        attr.$list = attr.$holder.find('ul');
        attr.$hidden = $this.find('input[name="' + name + '"]');
        attr.$shell = $this.find('.'+shellClass);

        $.each(events, function (i, n) {
          $this.on(n.type, n.selector, eventCurry.bind(t, n.callback));
        });

        $.each(shellEvents, function (i, n) {
          attr.$shell.on(n.type, n.selector, eventCurry.bind(t, n.callback));
        });

        $.each($this.prop('attributes'), function() {
          if (this.name.indexOf('data-') > -1) {
            attr.$hidden.attr(this.name, this.value);
          }
        });

        if (attr.datalist) {
          attr.datalist = $.map(attr.datalist, function(item) {
            return {
              text: caseInsensitiveAttr(item, 'text'),
              value: caseInsensitiveAttr(item, 'value'),
              selected: caseInsensitiveAttr(item, 'selected')
            };
          });
          var html = $.tmpl('items', attr.datalist, {
            renderCheckbox: !attr.single
          });
          attr.$list.empty().append(html);
        }

        if (attr.single) {
          attr.closeOnMax = true;
          attr.maxSelected = 1;
        }

        attr.$items  = attr.$list.find('a');
        $this.removeAttr('name');

        $this.data(pluginName, attr);

        if (attr.single) {
          $(attr.$items.selector + '.' + selectedClass).trigger('click');
        }
      });
    },

    clear: function ($this, attr) {
      var $selected = attr.$items.filter('.' + selectedClass);
      // removed the selected styles
      $selected.removeClass(selectedClass).attr('aria-selected', 'false');
      // remove the selected values
      $this.attr('value', '').attr('aria-valuetext', '');
      // this resets the selected text
      $('span.labeltext', attr.$label).text(attr.labelText);
    },

    close: function ($this, attr) {
      var isOpen = $this.hasClass(openClass);

      if (!isOpen) {
        return;
      }

      if (attr.enableSearch) {
        attr.$search.val('');
        attr.$items.removeClass(filteredClass);
      }

      attr.$shell.slideUp(attr.transitionSpeed, function () {
        $this.removeClass(openClass);
        attr.$shold.hide();
        attr.$shell.appendTo($this);
        attr.$shell.hide();
      });
    },

    deselect: function ($this, attr, value, shouldCallback) {
      var $elm = attr.$items.filter('[value="' + value + '"]');

      if ($elm.length===0) {
        return;
      }

      $elm.removeClass(selectedClass).attr('aria-selected', 'false');

      var ser = $this.find('.'+selectedClass).map(function() { return $(this).attr('value'); }).splice(0).join("|");

      $this.attr('value', ser).attr('aria-valuetext', ser);

      if (shouldCallback) {
        attr.onChange([], $this);
      }
    },

    disable: function ($this, attr) {
      $this.addClass(disabledClass);
    },

    enable: function ($this, attr) {
      $this.removeClass(disabledClass);
    },

    filter: function ($this, attr, value) {
      var $items = attr.$items;

      if (value.length<3) {
        $items.removeClass(filteredClass);
        return;
      }

      $.each($items, filterFilters.bind(this, value));
    },

    getSelected: function ($this, attr) {
      var $selected = attr.$items.filter('.'+selectedClass);

      var arr = $.map($selected, function (n,i) {
        return $(n).attr('value');
      });

      return arr;
    },

    open: function ($this, attr) {
      attr.$shell.appendTo($('body'));

      var $thisPosition = attr.$this.offset();

      attr.$shell.css({
        top: $thisPosition.top + attr.$this.height(),
        left: $thisPosition.left,
        width: attr.$this.width()
      });
      attr.$holder.show();

      if (attr.enableSearch) {
        attr.$shold.show();
      }
      attr.$shell.slideDown(attr.transitionSpeed, function() {
        $this.addClass(openClass);
        attr.$search.focus();
      });
    },

    remove: function ($this, attr, shouldCallback) {
      if (shouldCallback) {
        attr.onRemove($this);
      }

      attr.$shell.appendTo($this);
      $this.remove();
    },

    serialize: function ($this, attr) {
      var $selected = attr.$items.filter('.'+selectedClass);
      var serial = $.map($selected, function(n,i) { return $(n).attr('value'); }).join("|");

      $this.attr('value', serial).attr('aria-valuetext', serial);
      attr.$hidden.val(serial);
      return serial;
    },

    setValue: function ($this, attr, value, shouldCallback) {
      var vals = value.split("|");

      for (var i in vals) {
        attr
          .$items
          .filter('[value="' + vals[i] + '"]')
          .addClass(selectedClass)
          .attr('aria-selected', 'true');
      }

      var serial = $this[pluginName]('serialize');

      if (shouldCallback) {
        attr.onChange(serial, $this);
      }
    },

    updateItems: function ($this, attr) {
      attr.$items = $this.find("> ul > li > a");
      methods.setLabel(data);
    }

  };


  /*** PRIVATE METHODS ***/

  var filterFilters = function (value, i, elm) {
    var $elm = $(elm);
    var name = $elm.attr('value').toLowerCase();
    var text = $elm.text().toLowerCase();
    var data = $elm.data(dataItem);

    if (name.indexOf(value) > -1) {
      $elm.removeClass(filteredClass);
      return;
    }

    if (text.indexOf(value) > -1 ) {
      $elm.removeClass(filteredClass);
      return;
    }

    if (data && data.fields) {
      for (var x=0; x<data.fields.length; x+=1) {
        var field = data.fields[x].toLowerCase();
        if (field.indexOf(value) > -1) {
          $elm.removeClass(filteredClass);
          return;
        }
      }
    }

    $elm.addClass(filteredClass);
  };

  var getNumSelected = function ($this) {
    var attr = $this.data(pluginName);
    return attr.$holder.find('.' + selectedClass).length;
  };

  var caseInsensitiveAttr = function(obj, attr) {
    var val = obj[attr];
    return val == undefined ?
      obj[attr.charAt(0).toUpperCase() + attr.slice(1)] : val;
  };

  /*** COURIERS ***/

  var eventCurry = function (callback, e) {
    var $this = $(this);
    var $target = $(e.target);
    callback($this, $target, e);
  };


  /*** MODULE DEFINITION ***/

  $.fn[pluginName] = function (method) {
    if ( methods[method] ) {
      var $this = $(this);
      var attr = $this.data(pluginName);
      var args = [$this, attr].concat(Array.prototype.slice.call(arguments, 1));
      return methods[method].apply(this, ($this, attr, args));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this,arguments);
    } else {
      $.error('Method ' + method + ' does not exist');
    }
  };


})(jQuery);
