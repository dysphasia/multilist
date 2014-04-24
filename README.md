# multilist

----------

### Introduction

multilist is a jquery plugin multiple/single select dropdown list with search / filtering functionality, similar to what you might call a "combobox"

### License

[MIT License (MIT) Copyright (c) 2014 Nicholas Ortenzio and Jason Duncan] (/LICENSE.txt)

### Demo

http://rawgit.com/functionreturnfunction/multilist/master/release/demo.html

### Tests

http://rawgit.com/functionreturnfunction/multilist/master/test/test.html

### Usage

1. Include release/multilist-&lt;version&gt;.min.js & release/multilist-&lt;version&gt;.min.css onto your webpage. jQuery & jQuery templates are also required, as well as any images in the release/ directory.

2. Init the plugin by calling 'multilist' on a jquery object:

<code>$('#element').multilist(options);</code>

----------

### Options

#####canRemove

> **type:** Boolean

> **Default:** false

> If set to true, droplist control will be initiated with a remove button. Using the close button will trigger the onRemove callback  option, if provided

#####closeOnMax

> **type:** Boolean

> **Default:** false

> if true, will trigger the plugin to close when the number of selected items is equal to the value of the maxSelected option

#####datalist
> **type:** Object Array (optional)
>
> **Default:** *null*
>
> If provided, the droplist will generate options for each of the items in the array. An Array object should have the following properties

> 	{
> 		value: (string),
> 		text: (string),
> 		selected:(true|false)[optional],
> 		fields:([string,...])[optional]
>	}


#####enableSearch
> **type:** boolean (optional)
>
> **Default:** true
>
> controls whether the text input search field will be available
>


#####initWithCallback
> **type:** boolean (optional)
>
> **Default:** true
>
> controls whether the onChange callback function will be called immediately after initialization
>


#####labelText
> **type:** string (optional)
>
> **Default:**
>
> Text label for the dropdown selector


#####maxSelected
> **type:** number (optional)
>
> **Default:** 10
>
> Limit the amount of items that may be selected at once.  Set to '0' for no limit


#####onChange

> **type:** function

> **Default:** none

> Callback function for the dropdown onchange event. Returns the *value* attribute and text content of the element selected.



#####onRemove

> **type:** function

> **Default:** none

> Callback function for the dropdown remove event. Returns the jQuery object for the removed droplist element.



#####transitionSpeed

> **type:** number or string (optional)
>
> **Default:** 'fast'
>
> A string or number determining how long the animation will run. string options are 'slow', 'fast' & 'normal'
>

#####single

> **type:** boolean (optional)
>
> **Default:** false
>
> If truthy, init in single selection mode, acting more like a dropdown list. Will override 'closeOnMax' to true, and 'maxSelected' to 1
>


-------

### Methods

droplist makes a number of methods publicly accessible without breaking jQuery object chaining.

`$('#element').multilist('methodname', [arguments...])`


#####close

> **parameters:** none
>
> **returns:** jQuery object
>
> closes the options list of a droplist


#####deselect

> **parameters:** *string* Value of the option to deselect
>
> **returns:** jQuery object
>
> deselect the option with the passed in value


#####disable

> **parameters:** none
>
> **returns:** jQuery object
>
> disables the control



#####enable

> **parameters:** none
>
> **returns:** jQuery object
>
> enables the control



#####filter

> **parameters:** *string* Value to filter against
>
> **returns:** jQuery object
>
> filters list items to those that contain the value of the string parameter


#####getSelected

> **parameters:** none
>
> **returns:** Array
>
> returns an array of all currently selected values


#####init

> **parameters:** *object* options
>
> **returns:** jQuery object
>
> inits the multilist plugin, same as <code>$("#elm").multilist(options);</code>



#####open

> **parameters:** none
>
> **returns:** jQuery object
>
> programatically opens the options list of a droplist


#####remove

> **parameters:** none
>
> **returns:** jQuery object
>
> destroys the ui plugin element


#####serialize

> **parameters:**
>
> **returns:** string
>
> returns a string in the format of a pipe separated series of values representing all the selected items


#####setValue

> **parameters:** *string*
>
> **returns:** jQuery object
>
> sets one or more items as selected using a pipe separated series of values (i.e. the result of serialization)

