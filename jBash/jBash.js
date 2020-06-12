/*
	jBash
	a little console thingy for JavaScript.
	needs jQuery.
	
	v2 with help and ? commands.
*/

// the directory to the manuals seen from the loading page.
const JBASH_MANUAL_DIR = "extern/jbash_manuals/";

jBashObject = function(name, desc, func, isHidden = false)
{
	var _name = name;
	var _func = func;
	var _desc = desc;
	var _hidden = isHidden;
	this.Name = function() {return _name;};
	this.Description = function() {return _desc;};
	this.Func = function(params) {return _func(params);};
	this.isHidden = function() {return _hidden;};
};

jBash = function()
{
	var me = this;
	var _outerScreen = null;
	var _screen = null;
	var _input = null;
	var _downloader = null;
	var _startpage = null;
	var _commands = Array();

	// directories
	this.initialize = function(screenID, startpage)
	{
		var shellWidth = jBash.ShellText.length * jBash.ShellCharacterWidth;
		_outerScreen = $(screenID);
		_outerScreen.html("<a download id='jBashHiddenDownloadItem' style='display:none;'></a><div id='jBashInnerScreen'></div><table border='0' style='width: 100%;'><tr onclick='jBash.instance.focus();'><td style='width:"+shellWidth+"px;'>"+jBash.ShellText+"</td><td style='width:*;'><input id='jBashInnerInput' type='text' /></td></tr></table>");		
		_screen = $('#jBashInnerScreen');
		_input = $('#jBashInnerInput');

		// load configuration
/*		$.getJSON( jBash.configFile, function( data ) 
		{
			$.each( data, function( key, val ) 
			{
				switch(key)
				{
					case "relative_uploaded_files_dir": _dir_uploads = val; break;
					case "relative_public_pages_dir": jBash._dir_pages = val; break;
					case "relative_php_directory": jBash._dir_php = val; break;
					case "relative_manual_pages_dir": jBash._dir_manuals = val; break;
					default:
						break;
				}
  			});
    			console.log("jBash configuration loaded.");
			_finishInitialize(startpage);
		}).fail(function(e)
		{
			console.log("jBash: Failed to load configuration file "+jBash.configFile+".");
			_finishInitialize(startpage);
		});
*/
_finishInitialize(startpage);

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
		
		// focus on the input line.
		_screen.click(function(e)
		{
			me.focus();
		});
	};

	// finish the initialization after json loading.
	var _finishInitialize = function(startpage)
	{
		// load the start page if one is given.
		/*if(startpage != null && startpage !="")
		{
			_startpage = startpage;
			_loadPage("",startpage,true);
		}*/
	};

	// set focus on the input.
	this.focus = function() {if(_input!=null) _input.focus();};

	// scroll to the bottom of an element.
	var _bottom=function()
	{
		if(_outerScreen==null)
			return;
		
		if(jBash.ScrollWithBody == true)
		{
			window.scrollTo(0,document.body.scrollHeight);
		// [does not work with firefox] 	$("body").scrollTop($("body")[0].scrollHeight);
		}else{		
			_outerScreen.scrollTop(_outerScreen[0].scrollHeight);
		}
		_input.focus();
	};
	this.Bottom = function() {_bottom();};

	// get an array with the parameters, removed spaces at begin and end.
	this.getParams = function(p)
	{
		// the first parameter is the command name. we remove it.
		var txt="";
		if(p.length>=2)
		{
			for(var i=1;i<p.length;i++)
			{
				if(p[i] != "" && p[i]!=null)
			    		txt+=" "+p[i];
			}
		}
		// remove spaces at begin and end.
		txt=txt.trim();
		// now we split the text again.
		var pr = txt.split(" ");
		return pr;
	}

	// "execute" a line
	var _doLine = function(text)
	{
		text=text.replace(/</g, "&lt;");
		text=text.replace(/>/g, "&gt;");
		_addLine(jBash.ShellText+'&nbsp;<span class="jBashCmd">'+text+'</span>');
		_parseLine(text);
	};
	this.DoLine = function(text) {_doLine(text);};

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

	// add a text without br to the output screen.
	var _addText = function(text)
	{
		if(_screen==null)
			return;
		_screen.html(_screen.html()+text);
		_bottom();	
	}
	this.AddText = function(text) {_addText(text);};

	// add a text line to the output screen.
	var _addLine = function(text)
	{
		_addText(text+"<br />");
	};
	this.AddLine = function(text) {_addLine(text);};

	// get filename without ../
/*	var _parseFileName = function(pagename)
	{
		pagename=pagename.trim();
		// remove / at begin.
		if(pagename[0]=="/")
			pagename=pagename.replace("/","");
		// remove ../ requests.
		var oldpagename = pagename;
		if(pagename != null) pagename=pagename.replace(/\.\.\//g,"");
		if(oldpagename!=pagename)
			_addLine("Load/Download: Using {../} is not allowed and thereby removed.");
		
		var oldpagename = pagename;
		if(pagename!=null) pagename=pagename.replace(/\.\./g,"");
		if(oldpagename!=pagename)
		{
			_addLine("Load/Download: Using {..} is not allowed.");
			return -1;
		}

		// check again for null.
		if(pagename=="" || pagename==null || pagename == ".")
		{
			_addLine("No page given for loading.");
			return -1;
		}
		return pagename;
	}
*/
/*	var _download = function(url)
	{
	        $('#jBashHiddenDownloadItem').attr('href',url);
	        $('#jBashHiddenDownloadItem').html(url);
		$("a#jBashHiddenDownloadItem")[0].click();
	};

	// try to download a file.
	this.downloadURL=function(url) 
	{
		url=_parseFileName(url);
		if(url == -1)
			return;

		_addLine("Trying to download {"+url+"}..");
		_download(jBash._dir_pages+url);
	};

	// ..from the UPLOADS dir.
	this.downloadFile=function(url) 
	{
		url=_parseFileName(url);
		if(url == -1)
			return;

		_addLine("Trying to download {"+url+"}..");
		_download(_dir_uploads+url);
	};
*/
	// same as loadpage but it will show a short command description if the manual was not found.
	this.loadManual = function(pagename)
	{
		pagename = pagename.toLowerCase();
		if(_screen==null)
			return;

		if(pagename=="" || pagename==null)
			pagename=jBash._man_command_name;

		var path = jBash._dir_manuals + pagename + ".html";
		// load the page.
		$.ajax({
			mimeType: 'text/plain; charset=x-user-defined',
			url: path,
			type: "GET",
			dataType: "text",
			cache: false,
			success: function(data) {_addLine(data);},
			error: function(data) {
				// check if there is a command with this name and print out its description.
				var found = null;
				for(var i=0;i<_commands.length;i++)
				{
					if(pagename==_commands[i].Name().toLowerCase())
					{
						found = _commands[i];
					}
				};
			
				if(found==null)
				{
					_addLine("The command {<span class='jBashCmd'>"+pagename+"</span>} does not exist.");
					return;
				}
			
				_addLine("<br /><span class='jBashCmd'>"+pagename+"</span>: "+found.Description());
				_addLine("<small>No manual file was found, this is the short description.</small><br />");				
			}
		});
	};

	// load a local page.
	/*var _loadPage = function(directory,pagename, force, endfunction)
	{
		if(_screen==null)
			return;

		if(!force)		
			pagename = _parseFileName(pagename);
		
		if(pagename == -1)
			return;

		var path=directory+pagename;

		// load the page.
		jQuery.get(path, function(data) 
		{
		    //alert(data);
			_addText(data);
			if(endfunction!=null)
				endfunction();
			else
				_addLine(""); // "closing" br
		})
		.fail(function() 
		{
			_addLine("Could not load {"+pagename+"}. I am very sorry.");
			if(endfunction!=null)
				endfunction();
		});
	};
	this.loadPage = function(directory,pagename, force) {_loadPage(directory, pagename, force, null);};
	this.loadPageExtended = function(directory, pagename, force, endfunction) {_loadPage(directory,pagename, force, endfunction);};
*/
	// enable or disable input
	this.enableMe = function(enabled)
	{
		if(_input==null || _screen==null)
			return;

		if(enabled==true)
		{
			_input.removeAttr('disabled');
			$("#jBashInnerScreen").removeClass('jBash_disabled');
			$("#jBashInnerScreen *").removeClass('jBash_disabled');
		}else{
			_input.attr('disabled', 'disabled');
			$("#jBashInnerScreen").addClass('jBash_disabled');
			$("#jBashInnerScreen *").addClass('jBash_disabled');
		}
	};

	// clear the screen
	this.cls = function()
	{
		if(_screen==null)
			return;
		_screen.html("");
	};

	// register a command.
	this.registerCommand = function(name, description, func, isHidden = false)
	{
		name=name.replace(/</g, "&lt;");
		name=name.replace(/>/g, "&gt;");
		var cmd = new jBashObject(name, description, func, isHidden);
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
			if(_commands[i].isHidden()==false)
			{
				txt+="<tr><td class='jBashCmd' valign='top'>";
				txt+=_commands[i].Name();
				txt+="</td><td valign='top'>";
				txt+=": ";
				txt+="</td><td valign='top'>";
				txt+=_commands[i].Description();
				txt+="</td></tr>";
			}
		};
		txt+="<tr><td colspan='3'><hr></td></tr>";
		txt+="</table>";
		_addLine(txt);
	};

// UPLOAD STUFF
	/*var _uploadCounter = 1;
	var _uploadFormId = 0;

	// handle progress of uploading by putting dots to the console.
	this.UploadProgressHandlingFunction = function(e)
	{
		if(!e.lengthComputable)
			return;
		
		var percent = 0.0+((100.0 / e.total)*e.loaded);
		if(percent >= _uploadCounter*10)
		{
			_addText(".");
			_uploadCounter+=1;
		}
	};

	// called on click on the upload function.
	this.upload_button_function = function(uploadFormId)
	{
 		var formData = new FormData($('#upload_form_'+uploadFormId)[0]);
    		$.ajax({
        		url: jBash._dir_php+'upload_file.php?formid='+uploadFormId,  //Server script to process data
        		type: 'POST',
        		xhr: function() // Custom XMLHttpRequest
			{
	         		var myXhr = $.ajaxSettings.xhr();
			        if(myXhr.upload)
				{
					_addText('Uploading');
			                myXhr.upload.addEventListener('progress',jBash.instance.UploadProgressHandlingFunction, false);
			        }
		         	return myXhr;
			},
		        //Ajax events
		        beforeSend: function() 
			{
				jBash.instance.enableMe(false);
			},
			success: function(data) {
				for(var i=0;i<10-_uploadCounter;i++)
					_addText('.');

				var result = data.replace("@!err!@","");
				if(result!=data)
				{	
					_addLine('<span class="error">failed</span>.<br />'+result);
				}else{				
					$('#upload_form_'+uploadFormId).remove();
					_addLine('done.<br />'+result);
				}
				_uploadCounter=1;
				jBash.instance.enableMe(true);
				_bottom();
				},
		        error: function() {jBash.instance.enableMe(true);},
		        // Form data
			data: formData,
        		//Options to tell jQuery not to process data or worry about content-type.
        		cache: false,
        		contentType: false,
        		processData: false
    		});
	};

	// set the label of the appropriate input label.
	this.upload_changed = function(uFormId,fileName)
	{
		console.log("Upload changed for "+uFormId+" -->file: "+fileName);
		var lbl=$('#upload_label_'+uFormId);
		fileName=fileName.split("\\").pop();

		if( fileName )
			lbl.html(fileName);
		else
			lbl = "Select a file..";
	};

	// show a new upload form.
	this.PutFileCmd = function()
	{
		// add input field.
		var txt='<form id="upload_form_'+_uploadFormId+'" enctype="multipart/form-data" action="" method="post">';
		txt+='<input type="hidden" id="max_file_size" name="max_file_size" value="1000000000" />';
		
		txt+='Your File:<input id="thefile_'+_uploadFormId+'" name="thefile_'+_uploadFormId+'" type="file" class="inputfile" onchange="jBash.instance.upload_changed('+_uploadFormId+',$(this).val());" />';

		txt+='<label for="thefile_'+_uploadFormId+'" class="btn" id="upload_label_'+_uploadFormId+'">Select a file..</label>';
		txt+='<input onclick="jBash.instance.upload_button_function('+_uploadFormId+');" type="button" value="Upload" class="btn" />';
		txt+='</form>';
		_addText(txt);

		_uploadFormId += 1;
	};
// ENDOF UPLOAD STUFF
*/
	$(document).ready(function() 
	{
		// set the focus for the input.
		if(_input!=null)
			_input.focus();
	});
};

// relative dir to the php files, loaded with json.
//jBash._dir_php = "";
// relative dir to the public non-upload pages, loaded with json.
//jBash_dir_pages = "";
// relative dir to the manual pages, loaded with json.
jBash._dir_manuals = JBASH_MANUAL_DIR;

jBash.instance = new jBash();

// relative path to the config file, seen from index.html."
//jBash.configFile ="jBash_config.json";

// If this is true, it scrolls the whole body, else it scrolls the div. Div must have specific height then.
// Div can NOT have specific height when scrolling with the body.
jBash.ScrollWithBody = false;

// This is the text before anything, to emulate a user-like experience.
jBash.ShellText = ">";

// How wide in pixels is a single character? Used to get the width of the ShellText-cell in the table.
jBash.ShellCharacterWidth = 10;

jBash.initialize = function(screenID, inputID) {jBash.instance.initialize(screenID,inputID);};
jBash.registerCommand = function(name, description, func, isHidden) {jBash.instance.registerCommand(name, description, func, isHidden);};
jBash.Parse = function(text) {jBash.instance.Parse(text);};
jBash.GP = function(p) {return jBash.instance.getParams(p);}

// jump to an external link.
jBash.LINK = function(params)
{
	p = jBash.GP(params);
	var target = "";
	var mydir = "";
	if(p.length>0)
	{
		target = p[0];
		mydir = p[1];
		if(p[0].toLowerCase()=="to" && p.length>1)
		{
			target = p[1];
		}
	}
	window.location.href = target;
}

// register some commands.
jBash.registerCommand("donate", "Please donate my work. Thank you.", function(params) {jBash.Parse("man donate");});
jBash.registerCommand("cmd", "Show registered jBash commands.", function(params) 
	{jBash.instance.showCommandList();});
jBash.registerCommand("help", "Show registered jBash commands.", function(params) 
	{jBash.instance.showCommandList();});
jBash.registerCommand("?", "Show registered jBash commands.", function(params) 
	{jBash.instance.showCommandList();});
jBash.registerCommand("man", "Show manual for a command. E.g. {<span class='jBashCmd'>man cmd</span>}", function(params)
	{
		var jp = jBash.GP(params);
		if(jp=="")
		{
			jBash.instance.loadManual("man");
			return;
		}
		jBash.instance.loadManual(jp[0]);
	});
jBash.registerCommand("cls", "Clear the screen.", function(params)
	{jBash.instance.cls();});
jBash.registerCommand("link", "A link to an external website.<br />E.g. {<span class='jBashCmd'>link to https://github.com</span>}", jBash.LINK);
jBash.registerCommand("l", "Short for the <span class='jBashCmd'>link</span> command.", jBash.LINK,true);

//jBash.registerCommand("dir", "Show public file list.", function(params) 
//	{jBash.instance.loadPage(jBash._dir_php,'filelist.php', false);});
//jBash.registerCommand("l", "Short for {<span class='jBashCmd'>load</span>}.",function(params)
//	{jBash.instance.loadPage(jBash._dir_pages, jBash.GP(params)[0],false);});
//jBash.registerCommand("load","Load a file into the console.<br />E.g. {<span class='jBashCmd'>load myfile.txt</span>}", function(params)
//	{jBash.instance.loadPage(jBash._dir_pages, jBash.GP(params)[0],false);});
//jBash.registerCommand("download", "Download a file from the public directory to your computer.", function(params)
//	{jBash.instance.downloadURL(jBash.GP(params)[0]);});

//jBash.registerCommand("get", "Download a file from the upload directory to your computer.", function(params)
//	{jBash.instance.downloadFile(jBash.GP(params)[0]);});

// show a form to upload a file.
//jBash.registerCommand("put", "Upload a file.<br />Creates a file selector and upload button.", function(params)
//	{jBash.instance.PutFileCmd();});

// show uploaded file list (and an upload file form.)
/*jBash.registerCommand("uploads", "Show uploaded files.", function(params) 
{
	var p= jBash.GP(params)[0];
	jBash.instance.AddText("<h1>Uploads:</h1>");
	jBash.instance.loadPageExtended(jBash._dir_php,"uploaded_files_list.php?var="+p,false, jBash.instance.PutFileCmd);
});
*/
