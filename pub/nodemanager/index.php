<!DOCTYPE html>
<html>
<head>
  <link rel="icon" href="http://localhost/r3/pub/skins/pmwiki/logo.png" type="image/x-icon" />
   <link rel='stylesheet' href='http://localhost/r3/pub/skins/pmwiki/pmwiki.css' type='text/css' />
  <title>rtnF NodeManager</title>
  <style>
    a {
    	text-decoration: none;
    	color:black;
    }
    ul {
    	list-style: none inside;
    	width: 44%;
    }
    .nodetext{
    	padding: 5px 0px;
      padding-left: 14px;
    }
    li:hover{
    	background-color: #e5f3ff;
    	cursor: pointer;
    }
    body {
    	font-family: helvetica;
    }
    .container {
    margin-top: 33px;
    margin-left: 112px;
    }
    .sidebar {
    	top: 69px;
      margin-left: 0px;
      height: 100%;
      position: fixed;
      border-right: 1px solid #068db9;
      z-index: 30;
      width: 170px;
    }
  </style>
  <script>



//Convert string to title case
//Example: if input is ababa
//         then, output is Ababa
function titleCaser(item) {
  var theFirst = item.charAt(0);
  theFirst = theFirst.toUpperCase();
  var theRest = item.slice(1);
  var combined = theFirst + theRest;
  return combined
}

//Shortcut Functionality
document.onkeyup = function(e) {
  
  //Ctrl+. : Create New Node
  if (e.ctrlKey && e.which == 190) {
    var baseURL = "http://localhost/r3/"
    var splitBaseURL = baseURL.split("/")
    var filtered = splitBaseURL.filter(function(el){
      return el != ""
    })
    
    if (filtered.length == 3){
      baseURL += "Main/"
    }

    var a = prompt("Node name");
    if (a != null){
      var split_a = a.split(" ");
      console.log(split_a);
      var i = 0;
      for (var i=0; i <split_a.length; i++){
        split_a[i] = titleCaser(split_a[i])
      }
      a = ""
      for (var i=0; i <split_a.length; i++){
        a = a + split_a[i]
      }
      var URL = baseURL + a + "?action=edit";
      console.log(URL);
      window.location = URL;
      //window.location = baseURL + a + "?action=edit";
    }
  }

  else if (e.ctrlKey && e.which == 191){
    var baseURL = "http://localhost/r3/"
    var splitBaseURL = baseURL.split("/")
    var filtered = splitBaseURL.filter(function(el){
      return el != ""
    })
    
    if (filtered.length == 3){
      baseURL += "Main/"
    }

    var a = prompt("Node name");
    if (a != null){
      var split_a = a.split(" ");
      console.log(split_a);
      var i = 0;
      for (var i=0; i <split_a.length; i++){
        split_a[i] = titleCaser(split_a[i])
      }
      a = ""
      for (var i=0; i <split_a.length; i++){
        a = a + split_a[i]
      }
      var URL = baseURL + a;
      console.log(URL);
      window.location = URL;
      //window.location = baseURL + a + "?action=edit";
    }

  }
}
  </script>
</head>
<body>

<div id="wikilogo">
    <a href="http://localhost/r3">
      <img src="http://localhost/r3/pub/logo.png" alt="rtnF" style="width: 37px;margin-left: 99px;" border="0">
    </a>
  </div>


<?php

//Change CamelCase to Title Case
function camelToTitle($camelStr)
{
    $intermediate = preg_replace('/(?!^)([[:upper:]][[:lower:]]+)/',
                          ' $0',
                          $camelStr);
    $titleStr = preg_replace('/(?!^)([[:lower:]])([[:upper:]])/',
                          '$1 $2',
                          $intermediate);
    return $titleStr;
}

function scan_dir($dir) {
    $ignored = array('.', '..', '.svn', '.htaccess');
    $files = array();    
    foreach (scandir($dir) as $file) {
        if (in_array($file, $ignored)) continue;
        $files[$file] = filemtime($dir . '/' . $file);
    }
    arsort($files);
    $files = array_keys($files);
    return ($files) ? $files : false;
}

//Access all files in wiki.d folder
$files = array_slice(@scan_dir('../../wiki.d'),2);

echo "<div class='container'>";



$log = fopen("../../log","r");
$pos = -2;
$lines = array();
$currentLine = '';
while(-1 !== fseek($log,$pos,SEEK_END)) {
  $char = fgetc($log);
  if (PHP_EOL == $char) {
    $lines[] = $currentLine;
    $currentLine = '';
  }
  else {
    $currentLine = $char . $currentLine;
  }
  $pos--;
}

//$lines[] = $currentLine;

foreach($lines as $x) {
  echo $x . "<br>";
}




/*
echo "<ul>";

//Iterate each file
foreach ($files as $a) {
	$pieces = explode(".",$a);
	if ($pieces[0]){
			$namespace = $pieces[0];
	$nodeKey = camelToTitle($pieces[1]);
	echo "<li>";
	echo "<a href='http://localhost/r3/".$namespace."/".$pieces[1]."'>";
	echo "<div class='nodetext'>".$namespace." : ".$nodeKey."</div></a>";
	echo "</li>";
	}
}

echo "</ul>";


*/
echo "</div>";

?>

</body>
</html>