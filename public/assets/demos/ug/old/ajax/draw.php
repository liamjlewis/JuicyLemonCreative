<?php
	include 'connect/Db.php';
	$db = new Db();

	//Vars
	date_default_timezone_set('UTC');
	$date = date("Y-m-d");
	$time = date("H:i:s");
	$timeInMins = (substr($time, 0, 2)*60)+substr($time, 3, 5);
	$config = $db -> select("SELECT window, windowDate FROM `config`;");
	//$window	= 30;
	if($config[0]['windowDate']!=$date){
		$db -> query("UPDATE config SET window=30;");
		$window = 500;
	}else{
		$window = $config[0]['window'];// the window of time where prizes can be won
	}
	echo '<hr> timeInMins: '.$timeInMins;
	//Functions

	function rangeGen($avoid){
		$result;
		if($avoid != null){
			global $db, $timeInMins, $window, $date;
			$buffer = $timeInMins+5;
			$soRand = rand($buffer, (1440-$window));
			$gotToEnd = false;
			$whileMax;
			while($gotToEnd == false){
				if($whileMax == 1000){
					echo '<br>Exceeded max tries of '.$whileMax.', reducing Window.';
					//call a function that wipes the DB
					$result = 'nospace';
					break;
				}
				for ($i=0; $i < count($avoid); $i++) {
					//echo $soRand.'<-Rand - '.$avoid[$i]['rangeLo'].'<-rangeLo - '.$soRand.'<-Rand - '.$avoid[$i]['rangeHi'].'<-rangeHi - '.($soRand+$window).'<-rand+30 - '.$avoid[$i]['rangeLo'] .'<-rangeLo - '.($soRand+$window).'rand+30 - '.$avoid[$i]['rangeHi'].'<-rangeHi - <br />';
					if(($soRand >= $avoid[$i]['rangeLo'] && $soRand <= $avoid[$i]['rangeHi']) || ($soRand+$window >= $avoid[$i]['rangeLo'] && $soRand+$window <= $avoid[$i]['rangeHi'])){
						$soRand = rand($buffer, (1440-$window));
						//echo '<br> - i want to see loads of these - <br>';
						//---- IF THIS IS LOOPING BEYOND A MASSIVE NUMBER, START THE WHOLE FUNC AGAIN.
						break;//break and start again
					}elseif(($i+1) == count($avoid)){
						$gotToEnd = true;
						$result = $soRand;
					}
				}
				$whileMax++;
			}
			echo "AAAA while count: ".$whileMax;
		}else{
			global $timeInMins;
			$buffer = $timeInMins+5;
			echo "BBBB First time running.";
			$result = rand($buffer, (1440-$window));
		}
		if ($result == 'nospace') {
			//wipe db
			echo '<br>••••WIPING DB••••';
			$db -> query("DELETE FROM draw WHERE won <> 1 AND tStamp LIKE '".$date." %';");
			//change window
			echo '<br>••••CHANGING WINDOW VAL••••';
			($window <= 10 ? $newWind = 5 : $newWind = $window-10);
			echo $newWind;
			$window = $newWind;
			$db -> query("UPDATE config SET window=".$newWind.", windowDate='".$date."';");
			//start func again
			echo '<br>••••RESTARTING MASTER••••';
			master();
			//exit to stop the rest of the current func.
			echo '<br>••••EXITING••••';
			exit();
			echo '<br>••••SHOULDNT SEE THIS••••';
		}else{
			return $result;
		}
	}

	function master(){
		global $db, $window, $date, $time, $timeInMins, $dailyNumbers, $pRefs;
		$dailyNumbers = array('top'=>1, 'mBlow'=>1, 'mGift'=>2, 'mMouse'=>13);
		$pRefs;
		foreach ($dailyNumbers as $key => $value) {
			for ($i=0; $i < $value; $i++) { 
				$pRefs[$key.($i+1)] = 'none';
			}
		}

		//1. Check we're not exceeding absolute max for the campaign. ----

		//1.1 & 2. Check for existing, if none create, if yes check value and possibly re-alocate.
		$tiers = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
		echo "<hr />";
		if(isset($tiers[0])){
			//is there a prizeRef matching our pRef list:
			foreach ($pRefs as $key => $value) {
				for($i=0; $i<count($tiers); $i++){
					if($tiers[$i]['prizeRef'] == $key && $tiers[$i]['won'] != 1 && $tiers[$i]['rangeHi'] <= $timeInMins){
						//check range hasn't passed, if it has give new range.
						echo '<br><span style="color:orange;">below range - </span> '.$tiers[$i]['prizeRef'].' ';
						$newRange = rangeGen($tiers);
						$db -> query("UPDATE draw SET rangeLo=".$newRange.", rangeHi=".($newRange+$window)." WHERE prizeRef='".$tiers[$i]['prizeRef']."' AND tStamp LIKE '".$date." %';");
						//---- CAN $tiers BE UPDATES WITH No SQL needed? just push();
						$tiers = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
						$pRefs[$key] = 'set';
					}elseif($tiers[$i]['prizeRef'] == $key){
						$pRefs[$key] = 'set';
					}
				}
			}
		}

		//Create a row and give range for unreprisented items in our list.
		foreach ($pRefs as $key => $value) {
			if($value == 'none'){
				$tiersUpdated = $db -> select("SELECT rangeLo, rangeHi FROM `draw` WHERE tStamp LIKE '".$date." %';");
				(isset($tiersUpdated[0]) ? $newRange = rangeGen($tiersUpdated) : $newRange = rangeGen());
				echo '<br><span style="color:red;">No match for</span> '.$key.', creating one. '.$newRange;
				$result = $db -> query("INSERT INTO `draw` (`prizeRef`,`rangeLo`, `rangeHi`) VALUES ('".$key."',".$newRange.",".($newRange+$window).");");
			}
		}

		//Now that we've configured/reconfigured the winner time periods let's check if this current user has fallen within any of the time periods.
		$ranges = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
		for($i=0; $i < count($ranges); $i++){
			if(($timeInMins >= $ranges[$i]['rangeLo'] && $timeInMins <= $ranges[$i]['rangeHi']) && $ranges[$i]['won'] != 1){
				//echo "<hr color='yellow'>Winner! You won ".$ranges[$i]['prizeRef'].".<hr color='yellow'>";
				$db -> query("UPDATE draw SET won=1 WHERE prizeRef='".$ranges[$i]['prizeRef']."' AND tStamp LIKE '".$date." %';");
				$weGotAWinner = $ranges[$i]['prizeRef'];
			}
		}

		switch (substr($weGotAWinner, 0, 3)) {
		case 'top':
		    echo json_encode("top");
		    break;
		case 'mMo':
		    echo json_encode("mMo");
		    break;
		case 'mBl':
		    echo json_encode("mBl");
		    break;
		case 'mGi':
		    echo json_encode("mGi");
		    break;
		case '':
		    echo json_encode("vou");
		    break;
		}

		//VISUALLY SHOW RANGES FOR TESTING.
		echo '<div style="font-size:8px;">';
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
		echo '</div>';
	}
	master();
?>