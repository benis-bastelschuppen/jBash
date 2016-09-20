<?php

$dir="./../../index/";

if ($handle = opendir($dir)) {
    echo "<br /><table border='0'><tr><td><h1>File list:</h1><hr></td></tr>";

    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))) 
    {
	if($entry!="." && $entry!="..")
        	echo "<tr><td><a href='#' onclick='jBash.instance.DoLine(\"load $entry\")';>$entry</a></td></tr>";
    }
echo("<tr><td><hr /></td></tr></table>");
    closedir($handle);
}
?>
