<?php
function loadConfiguration()
{
	// change this path if the config file is somewhere else.
	// seen from the php files folder.
	$configPath = "./../../jBash_config.json";	

	$string = file_get_contents($configPath);
	$json_a = json_decode($string, true);
	return $json_a;
}

// get the variables like this:
//$json=loadConfiguration();
//echo("FullUploadPath: ".$json["REAL_UPLOAD_DIR"]);
//echo("RootPath: ".$json["relative_dir_from_php_dir"]);
