<?php
require('configurationLoader.php');
$json=loadConfiguration();
$rootpath=$json["relative_dir_from_php_dir"];
$indexpath=$json["relative_public_pages_dir"];

$dir=$rootpath.$indexpath;

if ($handle = opendir($dir)) {
    echo "<table border='0'><tr><td><h1>File list:</h1><hr></td></tr>";

	$e=0;
    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))) 
    {
	if($entry!="." && $entry!="..")
	{
		$e++;
        	echo "<tr><td><a href='#' onclick='jBash.instance.DoLine(\"load $entry\")';>$entry</a></td></tr>";
	}
    }
echo("<tr><td><hr /></td></tr></table>");
    closedir($handle);
}
?>
