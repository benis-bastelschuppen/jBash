<?php

$dir="./../../index/";

if ($handle = opendir($dir)) {
    echo "<br /><table border='0'><tr><td>B.O.S.S. root directory:<br><hr></td></tr>";

    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))) {
        echo "<tr><td>$entry</td></tr>";
    }
echo("<tr><td><hr /></td></tr></table>");
    closedir($handle);
}
?>
