jBash.js
JavaScript Text Console
needs jQuery
by Beni Yager @ 2016

Version 1.0alpha

Just make a div and load jQuery and jBash.

You just need the jBash.js file. All the other files are nice-to-haves
and not really important. All the overhead code is commented out and only
te most important commands are registered.

Then call 
	jBash.initialize("#mydivid");

Add commands with
	jBash.registerCommand("mycommandname", myfunction);

myfunction is a JS-function provided by you, with one parameter.
The parameter is an array with the given line text, split by space.
param[0] = command name
param[1] = first "parameter"
...

Use {cmd} to view all registered commands.
	cmd

Clear the screen with {cls}:
	cls

newest: all the "more" functionality taken out (commented out) for
extendable basic functionality.

v1.0 brings even more functionality: 
+ uploading files: {put} and {uploads}
+ manual pages: {man mycommand}
+ json configuration file with all the paths. 
	(public pages for {l}, uploaded files, manual pages, php directory.)
	(maybe you need to change the path in jBash/server_php/configurationLoader.php, too)

Have fun!

v1.0: 
	Loading json configuration file on JS and PHP side.
	Uploading files with {put} and {uploads}.
before v1.0:
	All the other stuff.
