jBash.js
JavaScript Text Console
needs jQuery
by Beni Yager @ 2016

Version 1.0alpha

Just make a div and load jQuery and jBash.

Then call 
	jBash.initialize("#mydivid", "index/mystartpage.html");

Add commands with
	jBash.registerCommand("mycommandname", myfunction);

myfunction is a JS-function provided by you, with one parameter.
The parameter is an array with the given line text, split by space.
param[0] = command name
param[1] = first "parameter"
...

Use {cmd} to view all registered commands.
	cmd

You can load local files into the console with {l}:
	l myfile.html
This works only on the server (also localhost), not with file:/// !
You can also load websites, but mostly they deny loading into iframes/objects.

Clear the screen with {cls}:
	cls

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
