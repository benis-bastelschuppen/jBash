/*
	jBash
	a little console thingy for JavaScript.
	needs jQuery.
*/

jBashObject = function(name, func)
{
	var _name = name;
	var _func = func;
	this.Name = function() {return _name;};
	this.Func = function(params) {return _func(params);};
};

jBash = function()
{
	var _outerScreen = null;
	var _screen = null;
	var _input = null;
	var _commands = Array();

	this.initialize = function(screenID)
	{
		var shellWidth = jBash.ShellText.length * jBash.ShellCharacterWidth;
		_outerScreen = $(screenID);
		_outerScreen.html("<div id='jBashInnerScreen'></div><table border='0' style='width: 100%;'><tr><td style='width:"+shellWidth+"px;'>"+jBash.ShellText+"</td><td style='width:*;'><input id='jBashInnerInput' type='text' /></td></tr></table>");
		_screen = $('#jBashInnerScreen');
		_input = $('#jBashInnerInput');

		_input.keypress(function(e)
		{
			if(e.keyCode == 13)
			{
				var text = _input.val();
				_input.val("");
				if(text!="")
					_doLine(text);
				_input.focus();
			}
		});
	};


	// scroll to the bottom of an element.
	var _bottom=function()
	{
		if(_outerScreen==null)
			return;

		if(jBash.ScrollWithBody == true)
			$("body").scrollTop($("body")[0].scrollHeight);
		else		
			_outerScreen.scrollTop(_outerScreen[0].scrollHeight);
	};

	// "execute" a line
	var _doLine = function(text)
	{
		text=text.replace(/</g, "&lt;");
		text=text.replace(/>/g, "&gt;");
		_addLine(jBash.ShellText+'&nbsp;<span class="jBashCmd">'+text+'</span>');
		_parseLine(text);
	};

	// parse a text line and call the appropiate function.
	var _parseLine = function(text)
	{
		var s = text.split(" ");
		for(var i=0;i<_commands.length;i++)
		{
			if(s[0].toLowerCase() == _commands[i].Name().toLowerCase())
			{
				return _commands[i].Func(s);
			}
		};
		_addLine("Command {"+s[0]+"} does not exist.");
	};

	// parse a line (without adding it to the console.)
	this.Parse = function(text)
	{
		text=text.replace(/</g, "&lt;");
		text=text.replace(/>/g, "&gt;");
		_parseLine(text);	
	};

	// add a text line to the output screen.
	var _addLine = function(text)
	{
		if(_screen==null)
			return;
		_screen.html(_screen.html()+"<br />"+text);
		_bottom();
	};

	// load a local page.
	var _loadPage = function(pagename)
	{
		if(_screen==null)
			return;

		if(pagename=="" || pagename==null)
		{
			_addLine("No page given for loading.");
			return;
		};

		// load the page.
		jQuery.get(pagename, function(data) 
		{
		    //alert(data);
			_addLine(data);
		})
		.fail(function() {_addLine("Could not load {"+pagename+"}. I am very sorry.");});
	};
	this.loadPage = function(pagename) {_loadPage(pagename);};

	// clear the screen
	this.cls = function()
	{
		if(_screen==null)
			return;
		_screen.html("");
	};

	// register a command.
	this.registerCommand = function(name, func)
	{
		name=name.replace(/</g, "&lt;");
		name=name.replace(/>/g, "&gt;");
		var cmd = new jBashObject(name, func);
		_commands.push(cmd);
	};

	// set the focus for the input.
	$(document).ready(function() 
	{
		if(_input!=null)
			_input.focus();
	});
};

jBash.instance = new jBash();

// If this is true, it scrolls the whole body, else it scrolls the div. Div must have specific height then.
// Div can NOT have specific height when scrolling with the body.
jBash.ScrollWithBody = true;

// This is the text before anything, to emulate a user-like experience.
jBash.ShellText = "root@trtf_server:";

// How wide in pixels is a single character? Used to get the width of the ShellText-cell in the table.
jBash.ShellCharacterWidth = 10;

jBash.initialize = function(screenID, inputID) {jBash.instance.initialize(screenID,inputID);};
jBash.registerCommand = function(name, func) {jBash.instance.registerCommand(name,func);};
jBash.Parse = function(text) {jBash.instance.Parse(text);};

// register some commands.
jBash.registerCommand("l", function(params) {jBash.instance.loadPage(params[1]);});
jBash.registerCommand("load", function(params) {jBash.instance.loadPage(params[1]);});
jBash.registerCommand("cls", function(params) {jBash.instance.cls();});
