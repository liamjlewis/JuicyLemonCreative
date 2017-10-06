<?php
	include 'connect/Db.php';
	$db = new Db();

	$window	= 30; // the window of time where prizes can be won ----THIS NEEDS TO BE STORED IN THE SQL

	function master(){

		global $window;

		//Vars
		date_default_timezone_set('UTC');
		$date = date("Y-m-d");
		$time = date("H:i:s");
		$timeInMins = 1000;
		$dailyNumbers = array('top'=>1, 'mBlow'=>1, 'mGift'=>2, 'mMouse'=>13);
		$pRefs;
		foreach ($dailyNumbers as $key => $value) {
			for ($i=0; $i < $value; $i++) { 
				$pRefs[$key.($i+1)] = 'none';
			}
		}
		echo '<hr> timeInMins: '.$timeInMins;
		
		//Functions
		function rangeGen($avoid){
			$result;
			if($avoid != null){
				global $timeInMins;
				global $window;
				$buffer = $timeInMins+5;
				$soRand = rand($buffer, (1440-$window));
				$gotToEnd = false;
				$whileMax;
				while($gotToEnd == false){
					for ($i=0; $i < count($avoid); $i++) {
						echo $soRand.'<-Rand - '.$avoid[$i]['rangeLo'].'<-rangeLo - '.$soRand.'<-Rand - '.$avoid[$i]['rangeHi'].'<-rangeHi - '.($soRand+$window).'<-rand+30 - '.$avoid[$i]['rangeLo'] .'<-rangeLo - '.($soRand+$window).'rand+30 - '.$avoid[$i]['rangeHi'].'<-rangeHi - <br />';
						if(($soRand >= $avoid[$i]['rangeLo'] && $soRand <= $avoid[$i]['rangeHi']) || ($soRand+$window >= $avoid[$i]['rangeLo'] && $soRand+$window <= $avoid[$i]['rangeHi'])){
							$soRand = rand($buffer, (1440-$window));
							echo '<br> - i want to see loads of these - <br>';
							//---- IF THIS IS LOOPING BEYOND A MASSIVE NUMBER, START THE WHOLE FUNC AGAIN.
							break;//break and start again
						}elseif(($i+1) == count($avoid)){
							$gotToEnd = true;
							$result = $soRand;
						}
					}
					$whileMax++;
					if($whileMax == 1000 && $gotToEnd == false){
						echo '<br>Exceeded max tries of '.$whileMax.', reducing Window.';
						//call a function that wipes the DB
						$result = 'nospace';
						break;
					}
				}
				echo "AAAA There are other ranges.";
			}else{
				echo "BBBB First time running.";
				global $timeInMins;
				$buffer = $timeInMins+5;
				$result = rand($buffer, (1440-$window));
			}
			if ($result == 'nospace') {
				//empty ranges & $pRef
				$db -> query("DELETE FROM draw WHERE tStamp LIKE '".$date." %';");
				//redefine window
				if($window > 10){
					$window -= 10;
				}
				//restart master
				master();
			}else{
				return $result;
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
						//---- $tiers NEEDS TO BE REDEFINED AT THIS POINT. No SQL needed, just push();
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
				echo "<hr color='yellow'>Winner! You won ".$ranges[$i]['prizeRef'].".<hr color='yellow'>";
				$db -> query("UPDATE draw SET won=1 WHERE prizeRef='".$ranges[$i]['prizeRef']."' AND tStamp LIKE '".$date." %';");
			}
		}
		$test = 'top1';
		switch (substr($test, 0, 3)) {
		case 'top':
		    echo "Top prize.";
		    break;
		case 'mMo':
		    echo "You won some mouse.";
		    break;
		case 'mBl':
		    echo "You won a blow dry.";
		    break;
		case 'mGi':
		    echo "You won a gift set.";
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
			if($inAny){
				echo '<span style="color:red; class="abc">'.$i.'</span><br>';
			}else{
				echo $i.'<br>';
			}
		}
		echo '</div>';
	}

?>