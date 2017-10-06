<?php
echo '<h1>Prize allocation info for UG</h1>';
	include 'connect/Db.php';
	
	$date = date("Y-m-d");

	$db = new Db();
	//Now that we've configured/reconfigured the winner time periods let's check if this current user has fallen within any of the time periods.
	$ranges = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
	$config = $db -> select("SELECT window, MAXtop, TOTtop, MAXmBl, TOTmBl, MAXmGi, TOTmGi, MAXmMo, TOTmMo, BeaG, Curl, BeaB, GlaB, GlaV FROM `config` WHERE id=1;");

	$time = date("H:i:s");
	$timeInMins = (substr($time, 0, 2)*60)+substr($time, 3, 5);
	
echo '<hr />';
	echo '<br />Winning window size <b>'. $config[0][window].'</b>';
echo '<br />------<br />';
	echo '<br />Campaign max Cut & Blow Dry <b>'. $config[0][MAXtop].'</b>';
	echo '<br />Currently given Cut & Blow Dry <b>'. $config[0][TOTtop].'</b>';
echo '<br />------<br />';
	echo '<br />Campaign max blow dry <b>'. $config[0][MAXmBl].'</b>';
	echo '<br />Currently given blow dry <b>'. $config[0][TOTmBl].'</b>';
echo '<br />------<br />';
	echo '<br />Campaign max mousses <b>'. $config[0][MAXmMo].'</b>';
	echo '<br />Currently given mousses <b>'. $config[0][TOTmMo].'</b>';
echo '<br />------<br />';
	echo '<br />Campaign max gift sets(of all kinds) <b>'. $config[0][MAXmGi].'</b>';
	echo '<br />Currently given gift sets <b>'. $config[0][TOTmGi].'</b>';
echo '<br />------<br />';
	echo '<br />Curent total Beautlicious Gift set <b>'. $config[0][BeaG].'</b>';
	echo '<br />Curent total Curl Story Gift set <b>'. $config[0][Curl].'</b>';
	echo '<br />Curent total Beauty Box Gift set <b>'. $config[0][BeaB].'</b>';
	echo '<br />Curent total Glambox Gift set <b>'. $config[0][GlaB].'</b>';
	echo '<br />Curent total Glamvoyage Gift set <b>'. $config[0][GlaV].'</b>';
echo '<hr />';

	echo 'Current time in mins: '.$timeInMins.'<br>';
	echo 'Prize winning times shown in red:<br>';

	//VISUALLY SHOW RANGES FOR TESTING.
	//echo '<div style="font-size:8px;">';
	for ($i=0; $i < 1440; $i++) {
		$inAny = false;
		for($x=0; $x < count($ranges); $x++){
			if($i >= $ranges[$x]['rangeLo'] && $i <= $ranges[$x]['rangeHi']){
				$inAny = true;
				$thePRef = $ranges[$x][prizeRef];
				//break;
			}
		}
		($i == $timeInMins ? $cur=' <--------' : $cur='');
		if($inAny){
			echo '<span style="color:red; class="abc">'.$i.$cur.'</span><span style="color:lightgray";> '.$thePRef.'</span><br>';
		}else{
			echo $i.$cur.'<br>';
		}
	}
	//echo '</div>';
?>