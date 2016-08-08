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
  	<div class="control">
  		<form id="save" method="POST">
  			<input type="hidden" name="v" id="v" value="<?php echo $v; ?>" />
  			<input type="hidden" name="d" id="d" value="" />
        <input type="file" id="file-input" style="display: none; opacity: 0;"/>
  		</form>
      <div class="left-pane">
      <div class="hamburger opened">
        <div class="top"></div>
        <div class="middle"></div>
        <div class="bottom"></div>
      </div>
      <div class="file-controls pane-section">
        <button href="#" id="version">VERSION</button>
        <button href="#" id="share">SHARE</button>
        <button href="#" id="browse">BROWSE</button>
        <button href="#" id="remove">REMOVE</button>
      </div>
      <div class="animation-controls pane-section">
        <button href="#" id="play-pause" class="disable">
          <span id="play-spn" class="disable">PLAY</span>
          <span id="pause-spn" class="out-left">PAUSE</span>
        </button>
        <button href="#" id="stop" class="disable">STOP</button>
        <div class="inpt-block">
          <label for="reverse" class="inpt-span">Reverse</label>
          <div class="inpt-box chk-inpt-box"><input type="checkbox" id="reverse" class="disable" name="reverse" /></div>
        </div>
        <div class="inpt-block">
          <span class="inpt-span">Play Speed</span>
          <input type="number" id="speed" class="inpt-box disable" name="speed" min="1" value="1"/>
        </div>
        <div class="inpt-block">
          <span class="inpt-span">Step Frames</span>
          <input type="number" id="frames" class="inpt-box disable" name="frames" min="1" value="1"/>
        </div>
        <button href="#" id="step-bwd"  class="disable">StepBWD</button>
        <button href="#" id="step-fwd" class="disable">StepFWD</button>
        <div class="progress-block">
          <input type="range" id="progress-bar" class="progress-bar disable" value="0" min="0" step="1"/>
          <div class="inpt-block">
            <span class="inpt-span">Frame</span>
            <input type="text" id="progress-frames" class="inpt-box long-inpt-box disable" name="progress-frames" min="0" value="0"/>
          </div>
          <div class="inpt-block">
            <span class="inpt-span">Time</span>
            <input type="text" id="progress-time" class="inpt-box long-inpt-box disable" name="progress-time" maxlength="10" min="0" value="0"/>
          </div>
        </div>
      </div>
      <div class="color-controls pane-section">
        <div id="color"></div>
        <div class="inpt-block">
          <span class="inpt-span">Hexa</span>
          <input type="text" id="color-hex" class="inpt-box long-inpt-box" value="1"/>
        </div>
        <div class="inpt-block">
          <span class="inpt-span">RGB</span>
          <input type="text" id="color-r" class="inpt-box" value="1"/>
          <input type="text" id="color-g" class="inpt-box" value="1"/>
          <input type="text" id="color-b" class="inpt-box" value="1"/>
        </div>
      </div>
    </div>
    <div id="anim-wrap" class="animation-wrapper">
      <div id="anim" class="animation"></div>
    </div>
  	</div>
  </body>
</html>
