<?php

if ($handle = opendir('./../')) {
    echo "Directory handle: $handle\n";
    echo "Entries:<br />";

    /* This is the correct way to loop over the directory. */
    while (false !== ($entry = readdir($handle))) {
        echo "$entry<br />";
    }

    closedir($handle);
}
?>
