<?php
require('configurationLoader.php');
$json=loadConfiguration();
$rootpath=$json["relative_dir_from_php_dir"];
$uploadpath=$json["relative_uploaded_files_dir"];
$relativephpdir= $json["relative_php_directory"];

$dir = $rootpath.$uploadpath;

// maybe get delete link.
$delete = false;
$var = strtolower($_GET['var']);
if($var=="delete")
	$delete = true;

// CONFIGURATION
// allowed file types without . and separated by space. "" for all files allowed.
$allowedfiletypes="";
//ENDOF CONFIGURATION

function filelist($directory, $deletelink, $relphpdir)
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

	echo ("<hr><table border='0' class='tbl'>");

	foreach ($alledateien as $datei)
	{

		if(filetypeallowed($datei)==true)
		{
			$count++;
			echo '<tr><td class="tbl_txt">';

			// show delete link
			if($deletelink==1)
			{
				echo '<a href="'.$relphpdir.'delete_file.php?deletefile='.$datei.'">[delete]</a>';
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
	echo('<hr>');
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

// show the file list.
filelist($dir,$delete, $relativephpdir);
?>
