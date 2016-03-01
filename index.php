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
  <style type="text/css">
  	html,body {
  		background-color: #999999;
  		font-family: sans-serif;
  		width: 100%;
  		height: 100%;
  		margin: 0;
  		padding: 0;
      overflow: hidden;
  	}
  	#anim {
  		width: 100%;
  		height: 100%;
  	}
  	#control {
  		position: absolute;
  		top: 20px;
  		right: 20px;
  		z-index: 1;
  	}
  	#control a {
  		display: inline-block;
  		background-color: black;
  		color: #ffffff;
  		padding: 10px;
      text-decoration: none;
      font-size: 10px;
  	}
  </style>
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
    <script type="text/javascript">
    function createAnim() {
    	bodymovin.loadAnimation({
        wrapper: document.getElementById('anim'),
        animType: 'svg',
        loop: true,
        autoplay: true,
        animationData: JSON.parse(JSON.stringify(animData))
      });
    }

    document.body.addEventListener('drop',function(e) {
      e.preventDefault();
    	document.body.style.backgroundColor = '#999999';
    	var file = e.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        window.animData = JSON.parse(e.target.result);
        if (window.animData) {
          window.deep = false;
          createAnim();
        }
      }
      reader.readAsText(file);
    });
    document.body.addEventListener('dragover',function(e) {
    	e.preventDefault();
    	document.body.style.backgroundColor = '#eeeeee';
    });
    document.body.addEventListener('dragout',function(e) {
    	e.preventDefault();
    	document.body.style.backgroundColor = '#999999';
    });
    document.getElementById('share').addEventListener('click',function(e) {
    	e.preventDefault();
      if (!window.deep && window.animData) {
      	document.getElementById('d').value = JSON.stringify(window.animData);
      	document.getElementById('save').submit();
      }
    });
    document.getElementById('version').addEventListener('click',function(e) {
    	e.preventDefault();
    	version = prompt("Please enter the github hash for bodymovin:",document.getElementById('v').value || 'master');
    	if (version) window.location.href = "?v="+version;
    });
    if (window.animData) createAnim();
    </script>
  </body>
</html>
