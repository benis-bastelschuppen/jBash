<?php
// CONFIGURATION
// allowed file types without . and separated by space. "" for all files allowed.
$allowedfiletypes="";
// true for bigger font
$bigfont=false;
//ENDOF CONFIGURATION

function filelist($directory, $deletelink)
{
	$alledateien = scandir($directory);
	$count=0;
	echo('<style>
		.tbl {width:100%;}
		.tbl_bit
		{
			width: 30%;
			text-align:right;
			position:relative;
			right:20px;
		}
		.tbl_txt {width: 30%;text-align:left;}
		</style>
		');
	echo("<h1>Uploads:</h1><hr />");
	echo('<table class="tbl"  border="0">');
	foreach ($alledateien as $datei)
	{

		if(filetypeallowed($datei)==true)
		{
			$count++;
			echo '<tr><td class="tbl_txt">';

			// show delete link
			if($deletelink==1)
			{
				echo '<a href="index.php?deletefile='.$datei.'">[delete]</a>';
			}
			// get filesize in a readable form
			$f=filesize("$directory/$datei");
			$fe="bytes";
			if($f/1024 > 1)
			{
				$f/=1024;
				$fe="kb";
				if($f/1024 > 1)
				{
					$f/=1024;
					$fe="Mb";
				}
			}
			$f=intval($f*10);
			$f/=10;
			// filename/link
			echo "<a href=\"$directory/$datei\" download>$datei</a>";
			echo "</td>";
			// spacer
			echo '<td></td>';
			// filesize
			echo "<td class=\"tbl_bit\">";
			echo "$f $fe";
			echo"</td>";
			echo "</tr>";
		}
	};
	echo('</table>');
	if($count<=0)
		echo "There are no files now.";
	echo('<hr />');
}

function deletefile($directory,$file)
{
	// directory without slash at end!
	if(!unlink("$directory/$file"))
		echo("Could not delete ".$file." | ");
	else
		echo($file." deleted! | ");
}

function filetypeallowed($d)
{
	global $allowedfiletypes;
// check for directory stuff
	if($d=='.' || $d=='..')
		return false;

// allowed
	if($allowedfiletypes=="" || $allowedfiletypes==null)
		return true;

	$fp=pathinfo($d);
	$a=explode(" ",$allowedfiletypes);
	foreach($a as $b)
	{
		if(strtolower($b)==strtolower($fp["extension"]))
		{
			return true;
		}
	}

// not allowed
	return false;
}


filelist("./../../UPLOADS/",false);
?>
