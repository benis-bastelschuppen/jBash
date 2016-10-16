<?php
require('configurationLoader.php');
$json=loadConfiguration();
$dir=$json["REAL_UPLOAD_DIR"];

function upload($fulldir)
{
	$formid = $_GET['formid'];
	$inputname="thefile_$formid";
	// set this directory, no slash at end.!
	//$fulldir = "/var/www/html/UPLOADS";
	$text = "@!err!@File upload failed.";

	if(isset($_FILES[$inputname]['tmp_name']))
	{
		$fname=$_FILES[$inputname]['name'];
		// check if empty filename
		if($fname!="")
		{
			// forbidden files 1 (php)
			$fileend=substr(strtolower($fname),strlen($fname)-4,4);
			if($fileend!=".php")
			{
				// forbidden files 2 - images
				if($fileend!=".jpg" && $fileend!="jpeg" && $fileend!=".png" && $fileend!=".gif" && $fileend!=".svg")
				{		
					//formular gesendet
					if(!move_uploaded_file($_FILES[$inputname]['tmp_name'],"$fulldir".$_FILES[$inputname]['name']))
					{
			  			$text="@!err!@<span class='error'>Error while moving ".$_FILES[$inputname]['name']." to the upload directory.</span>";
					}else{
						$text="File ".$_FILES[$inputname]['name']. " uploaded.";
					}
				}else{
					$text="@!err!@<span class='error'>Please upload IMAGE files to the <a href=\"../PLOG/index.php\">PLOG</a>.</span>";
				}	
			}else{
				$text="@!err!@<span class='error'>Uploading of PHP-files not allowed.</span>";
			}
		}else{
			$text="@!err!@<span class='error'>Please select a file first.</span>";
		}
	}else{
		$text = "@!err!@No File given for uploading.";
	}

	echo($text);
	return $text;
}

// upload the file
upload($dir);

?>
