# multilist

----------

### Introduction

multilist is a jquery plugin multiple select dropdown lists with search / filtering functionality


### License

The MIT License (MIT) Copyright (c) 2014 Nicholas Ortenzio


### Demo

http://rawgit.com/functionreturnfunction/multilist/testing/demo/multilist.html

### Tests

http://rawgit.com/functionreturnfunction/multilist/testing/test/test.html

### Usage

Include droplist.js & droplist.css onto your webpage. jQuery & jQuery templates are also required.

init the plugin by calling 'multilist' on a jquery object

<code>$('#element').multilist(options);</code>

----------


### Options

#####canRemove

> **type:** Boolean

> **Default:** false

> If set to true, droplist control will be initiated with a remove button. Using the close button will trigger the onRemove callback  option, if provided


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
>		}


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
> Limit the amount of items that maybe selected at once


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


-------

### Methods

droplist makes a number of methods publicly accessible without breaking jQuery object chaining.

<code>$('#element').multilist('methodname', [arguments...])</code>





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

