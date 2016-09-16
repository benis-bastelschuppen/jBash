/*
	jBash
	a little console thingy for JavaScript.
	needs jQuery.
*/

jBashObject = function(name, desc, func)
{
	var _name = name;
	var _func = func;
	var _desc = desc;
	this.Name = function() {return _name;};
	this.Description = function() {return _desc;};
	this.Func = function(params) {return _func(params);};
};

jBash = function()
{
	var _outerScreen = null;
	var _screen = null;
	var _input = null;
	var _downloader = null;
	var _startpage = null;
	var _commands = Array();

	this.initialize = function(screenID, startpage)
	{
		var shellWidth = jBash.ShellText.length * jBash.ShellCharacterWidth;
		_outerScreen = $(screenID);
		_outerScreen.html("<a download id='jBashHiddenDownloadItem' style='display:none;'></a><div id='jBashInnerScreen'></div><table border='0' style='width: 100%;'><tr><td style='width:"+shellWidth+"px;'>"+jBash.ShellText+"</td><td style='width:*;'><input id='jBashInnerInput' type='text' /></td></tr></table>");		
		_screen = $('#jBashInnerScreen');
		_input = $('#jBashInnerInput');

		// load the start page if one is given.
		if(startpage != null && startpage !="")
		{
			_startpage = startpage;
			_loadPage(startpage);
		}

		// catch enter and parse command.
		_input.keypress(function(e)
		{
			if(e.keyCode == 13)
			{
				var text = _input.val();
				_input.val("");
				if(text!="")
					_doLine(text);
				else
					_addLine(jBash.ShellText);
				_input.focus();
			}
		});

		// prevent input from loosing the focus, but only if the console covers the whole page.
		_input.focusout(function(){if(jBash.ScrollWithBody==true){_input.focus();}});
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

	// get a string with the combined parameters.
	this.CP = function(p)
	{
		var txt="";
		if(p.length>=2)
		{
			for(var i=1;i<p.length;i++)
			{
			    txt+=" "+p[i];
			}
		}
		txt=txt.trim();
		return txt;
	}

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
		text=text.trim();
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
		_screen.html(_screen.html()+text+"<br />");
		_bottom();
	};

	// try to download a file.
	this.downloadURL=function(url) 
	{
		if(url==null || url=="")
		{
			_addLine("No page given for download.");
			return;
		}

		_addLine("Trying to download {"+url+"}..");
	        $('#jBashHiddenDownloadItem').attr('href',url);
	        $('#jBashHiddenDownloadItem').html(url);
		$("a#jBashHiddenDownloadItem")[0].click();
	};

	// load a local page.
	var _loadPage = function(pagename)
	{
		if(_screen==null)
			return;

		pagename=pagename.trim();
		// remove / at begin.
		if(pagename[0]=="/")
			pagename=pagename.replace("/","");
		// remove ../ requests.
		var oldpagename = pagename;
		if(pagename != null) pagename=pagename.replace(/\.\.\//g,"");
		if(oldpagename!=pagename)
			_addLine("Load: Using {../} is not allowed and thereby removed.");
		
		var oldpagename = pagename;
		if(pagename!=null) pagename=pagename.replace(/\.\./g,"");
		if(oldpagename!=pagename)
		{
			_addLine("Load: Using {..} is not allowed.");
			return;
		}

		// check again for null.
		if(pagename=="" || pagename==null || pagename == ".")
		{
			_addLine("No page given for loading.");
			return;
		}

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
	this.registerCommand = function(name, description, func)
	{
		name=name.replace(/</g, "&lt;");
		name=name.replace(/>/g, "&gt;");
		var cmd = new jBashObject(name, description, func);
		_commands.push(cmd);
	};

	// show a list with all commands.
	this.showCommandList = function()
	{
		var txt="<br />";
		txt+="<table border='0'>";
		txt+="<tr><td colspan='3'>Registered jBash commands:<hr></td></tr>";
		for(var i=0;i<_commands.length;i++)
		{
			txt+="<tr><td class='jBashCmd'>";
			txt+=_commands[i].Name();
			txt+="</td><td>";
			txt+=": ";
			txt+="</td><td>";
			txt+=_commands[i].Description();
			txt+="</td></tr>";
		};
		txt+="<tr><td colspan='3'><hr></td></tr>";
		txt+="</table>";
		_addLine(txt);
	};

	$(document).ready(function() 
	{
		// set the focus for the input.
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
jBash.registerCommand = function(name, description, func) {jBash.instance.registerCommand(name, description, func);};
jBash.Parse = function(text) {jBash.instance.Parse(text);};
jBash.CP = function(p) {return jBash.instance.CP(p);}

// register some commands.
jBash.registerCommand("cmd", "Show registered jBash commands.", function(params) {jBash.instance.showCommandList();});
jBash.registerCommand("cls", "Clear the screen.", function(params) {jBash.instance.cls();});
jBash.registerCommand("dir", "Show file list.", function(params) {jBash.instance.loadPage('jBash/server_php/filelist.php');});
jBash.registerCommand("l", "Short for {load}.",function(params) {jBash.instance.loadPage(jBash.CP(params));});
jBash.registerCommand("load","Load a file. E.g. {load myfile.txt}", function(params) {jBash.instance.loadPage(jBash.CP(params));});
jBash.registerCommand("download", "Download a file to your computer.", function(params){jBash.instance.downloadURL(jBash.CP(params));});

