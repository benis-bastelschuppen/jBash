jBash.js
JavaScript Text Console
needs jQuery
by Beni Yager @ 2016

Just make a div and load jQuery and jBash.

Then call 
	jBash.initialize("#mydivid");

Add commands with
	jBash.registerCommand("mycommandname", myfunction);

myfunction is a JS-function provided by you, with one parameter.
The parameter is an array with the given line text, split by space.
param[0] = command name
param[1] = first "parameter"
...

You can load local files into the console with {l}:
	l myfile.html

Clear the screen with {cls}:
	cls

This works only on the server (also localhost), not with file:/// !

Have fun!
