### For Version 1:

1. Add a hidden input to support posting values in a form
2. Ajax support for loading data items and searching/filtering

### General/Issues:

1. Calling .val(obj) with a value not present in the listed items should fail somehow (either silently or with an error)
2. Calling .val(obj) with a valid value in single selection mode should update the displayed text


### Build System

1. Add support for test coverage when running tests from the command line
2. Add a build/compress task
3. Maybe use templates instead of raw source files to support things like changing css classes globally

