<?php

function generateHash($count) {
  $hash = '';
  $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for ($i = 0; $i<$count; $i++) {
      $hash .= $characters[rand(0, strlen($characters) - 1)];
  }
  return $hash;
}

if (@$_POST['d']!='') {
  require('lib/DBI.php');
  require('lib/credentials.php');
  $db = new DBI(DB_HOST,DB_NAME,DB_USER,DB_PASS);

	do {
    $hash = generateHash(8);
  } while($db->count('entries',array('hash'=>$hash))>0);

	$json = $_POST['d'];
	$v = @$_POST['v']!='' ? $_POST['v'] : 'master';
	$db->insert('entries',array('json'=>base64_encode(serialize($json)),'hash'=>$hash,'version'=>$v));
	header('location: ?i='.$hash);
	exit();
}

if (@$_GET['i']!='') {
	require('lib/DBI.php');
  require('lib/credentials.php');
  $db = new DBI(DB_HOST,DB_NAME,DB_USER,DB_PASS);
	$result = $db->query('SELECT version,json FROM entries WHERE hash="'.$db->clean($_GET['i']).'" LIMIT 1');
	if ($result) {
		$row = mysqli_fetch_assoc($result);
		$v = $row['version'];
		$json = unserialize(base64_decode($row['json']));
	}
}

if (!isset($v)) $v = @$_GET['v']!='' ? $_GET['v'] : 'master';

?>
<!doctype html>
<html>
<head>
  <title> Bodymovin </title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <link rel="icon" href="/assets/images/favicon.ico" type="image/x-icon">
  <meta name="description" content="">
  <link rel="stylesheet" type="text/css" href="main.css">
  <script type="text/javascript" src="bundle.js"></script>
  <script type="text/javascript" src="proxy.php?v=<?php echo $v; ?>"></script>
  <?php if (isset($json)) echo '<script type="text/javascript">window.deep = true; window.animData='.$json.';</script>'; ?>
</head>
  <body>
  	<div id="anim"></div>
  	<div id="control">
  		<form id="save" method="POST">
  			<input type="hidden" name="v" id="v" value="<?php echo $v; ?>" />
  			<input type="hidden" name="d" id="d" value="" />
  		</form>
  		<a href="#" id="version">VERSION</a>
  		<a href="#" id="share">SHARE</a>
  	</div>
  </body>
</html>
