# StringMinifier

A tool to help keep compact revision history for text in javascript.

How to use it
-----------------


```
var before = "This was before";
var after = "This is after";
var minifier = new StringMinifier(before, after);

var data = minifier.condense(); // 1is after
// Store data...

// ...Later
var minifier = new StringMinifier();
var back = minifier.uncondense(data, before); // "This is after"
```

Is it done?
------

Hell naw. Don't use this for anything important -- yet.

Building it
-------

Just run make.sh. Sorry windows folks, you'll have to look at make.sh and make your own bat file.



For The Future
------------

There will be string compression as well. zipString(str) and unzipString(str) are currently in development (in pack.js).
