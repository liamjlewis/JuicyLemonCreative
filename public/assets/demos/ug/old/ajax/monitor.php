<?php
echo '<h1>blah</h1>';
	include 'connect/Db.php';
	
	$date = date("Y-m-d");

	$db = new Db();
	//Now that we've configured/reconfigured the winner time periods let's check if this current user has fallen within any of the time periods.
	$ranges = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");

	$time = date("H:i:s");
	$timeInMins = (substr($time, 0, 2)*60)+substr($time, 3, 5);
	echo 'Time in mins: '.$timeInMins.'<br>';

	//VISUALLY SHOW RANGES FOR TESTING.
	//echo '<div style="font-size:8px;">';
	for ($i=0; $i < 1440; $i++) {
		$inAny = false;
		for($x=0; $x < count($ranges); $x++){
			if($i >= $ranges[$x]['rangeLo'] && $i <= $ranges[$x]['rangeHi']){
				$inAny = true;
				//break;
			}
		}
		($i == $timeInMins ? $cur=' <--------' : $cur='');
		if($inAny){
			echo '<span style="color:red; class="abc">'.$i.$cur.'</span><br>';
		}else{
			echo $i.$cur.'<br>';
		}
	}
	//echo '</div>';
?>