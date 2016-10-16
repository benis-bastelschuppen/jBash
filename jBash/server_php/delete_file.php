<?php
require('configurationLoader.php');
$json=loadConfiguration();
$uploadpath=$json["REAL_UPLOAD_DIR"];

function deletefile($directory,$file)
{
	// directory without slash at end!
	if(!unlink("$directory/$file"))
		echo("Could not delete ".$file);
	else
		echo($file." deleted!");
}

$f = $_GET['deletefile'];

deletefile($uploadpath,$f);
?>
