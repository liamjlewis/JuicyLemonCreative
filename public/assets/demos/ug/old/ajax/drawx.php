<?php
// I have made notes for improvements, search for '----'
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json; charset=UTF-8");

	$theID = $_POST["theIDx"];

	include 'connect/Db.php';
	$db = new Db();

//••••Vars
	date_default_timezone_set('UTC');
	$date = date("Y-m-d");
	$time = date("H:i:s");
	$timeInMins = (substr($time, 0, 2)*60)+substr($time, 3, 5);
	$config = $db -> select("SELECT window, windowDate, BeaG, Curl, BeaB, GlaB, GlaV FROM `config`;");
	//$window	= 30;
	if($config[0]['windowDate']!=$date){
		$db -> query("UPDATE config SET window=30, windowDate='".$date."';");
		$window = 30;
	}else{
		$window = $config[0]['window'];// the window of time where prizes can be won
	}
	//echo '<hr> timeInMins: '.$timeInMins;
	
//•••• Find an unused time range in the day where a prize can be won
	function rangeGen($avoid=array()){
		$result;
		if(!empty($avoid)){
			global $db, $timeInMins, $window, $date;
			$buffer = $timeInMins+5;
			$soRand = rand($buffer, (1440-$window));
			$gotToEnd = false;
			$whileMax;
			while($gotToEnd == false){
				if($whileMax == 1000){
					//echo '<br>Exceeded max tries of '.$whileMax.', reducing Window.';
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
			//echo "AAAA while count: ".$whileMax;
		}else{
			global $timeInMins;
			$buffer = $timeInMins+5;
			//echo "BBBB First time running.";
			$result = rand($buffer, (1440-$window));
		}
		if ($result == 'nospace') {
			//wipe db
			//echo '<br>••••WIPING DB••••';
			$db -> query("DELETE FROM draw WHERE won <> 1 AND tStamp LIKE '".$date." %';");
			//change window
			//echo '<br>••••CHANGING WINDOW VAL••••';
			($window <= 10 ? $newWind = 5 : $newWind = $window-10);
			//echo $newWind;
			$window = $newWind;
			$db -> query("UPDATE config SET window=".$newWind.", windowDate='".$date."';");
			//start func again
			//echo '<br>••••RESTARTING MASTER••••';
			master();
			//exit to stop the rest of the current func.
			//echo '<br>••••EXITING••••';
			exit();
			//echo '<br>••••SHOULDNT SEE THIS••••';
		}else{
			return $result;
		}
	}

	function master(){
		global $db, $window, $date, $time, $timeInMins, $dailyNumbers, $theID, $config;

	//••••1. Check we're not exceeding absolute max for the campaign.
		//Assure the config has the correct number of wins, the below should probably be merged with the confic var above, but I don't have time.
		$winCount = $db -> select("SELECT top, mBl, mGi, mMo FROM (SELECT COUNT(prizeRef) as top FROM draw WHERE prizeRef LIKE 'top%' AND won=1) a CROSS JOIN (SELECT COUNT(prizeRef) as mBl FROM draw WHERE prizeRef LIKE 'mBl%' AND won=1) b CROSS JOIN (SELECT COUNT(prizeRef) as mGi FROM draw WHERE prizeRef LIKE 'mGi%' AND won=1) c CROSS JOIN (SELECT COUNT(prizeRef) as mMo FROM draw WHERE prizeRef LIKE 'mMo%' AND won=1) d");
		$db -> query("UPDATE config SET TOTtop=".$winCount[0][top].", TOTmBl=".$winCount[0][mBl].", TOTmGi=".$winCount[0][mGi].", TOTmMo=".$winCount[0][mMo]." WHERE id = 1;"); //---- this should run again at the end of the function
		$maxs = $db -> select("SELECT MAXtop, MAXmBl, MAXmGi, MAXmMo FROM `config` WHERE id = 1;");
		
		//Set the number of prizes to be given away each day
		$dailyNumbers = [];
		if($winCount[0][top] < $maxs[0]['MAXtop']){
			$dailyNumbers["top"] = 1;
		}else{
			$db -> query("DELETE FROM draw WHERE won <> 1 AND prizeRef LIKE 'top%' AND tStamp LIKE '".$date." %';");
		}
		if($winCount[0][mBl] < $maxs[0]['MAXmBl']){
			$dailyNumbers["mBlow"] = 1;
		}else{
			$db -> query("DELETE FROM draw WHERE won <> 1 AND prizeRef LIKE 'nBlow%' AND tStamp LIKE '".$date." %';");
		}
		if($winCount[0][mGi] < $maxs[0]['MAXmGi']){
			$dailyNumbers["mGift"] = 1;
		}else{
			$db -> query("DELETE FROM draw WHERE won <> 1 AND prizeRef LIKE 'mGift%' AND tStamp LIKE '".$date." %';");
		}
		if($winCount[0][mMo] < $maxs[0]['MAXmMo']){
			$dailyNumbers["mMousse"] = 11;
		}else{
			$db -> query("DELETE FROM draw WHERE won <> 1 AND prizeRef LIKE 'mMousse%' AND tStamp LIKE '".$date." %';");
		}
		//$dailyNumbers = array('top'=>1, 'mBlow'=>1, 'mGift'=>2, 'mMousse'=>13);
		$pRefs = [];
		foreach ($dailyNumbers as $key => $value) {
			for ($i=0; $i < $value; $i++) {
				//This if is to compensate for the 5 different types of gift, not needed for a standard competition 
				if($key == 'mGift'){
					if($config[0][BeaG] < 6){
						$pRefs[$key.'BeaG'] = 'none';
					}elseif($config[0][Curl] < 6){
						$pRefs[$key.'Curl'] = 'none';
					}elseif($config[0][BeaB] < 6){
						$pRefs[$key.'BeaB'] = 'none';
					}elseif($config[0][GlaB] < 6){
						$pRefs[$key.'GlaB'] = 'none';
					}elseif($config[0][GlaV] < 6){
						$pRefs[$key.'GlaV'] = 'none';
					}else{
						$pRefs[$key.($i+1)] = 'none';
					}
				}else{
					$pRefs[$key.($i+1)] = 'none';
				}
			}
		}

		//Failsafe for a situation where there aren't enough prizes to fit the window ----I should make the min window 2 min
		if(($window*count($pRefs)) > (1440-$timeInMins)){
			$limitNum = floor((1440-$timeInMins)/$window);
			$limitNum = floor($limitNum*0.75);
			$pRefs = array_slice($pRefs, 0, $limitNum);
		}

	//••••1.1 & 2. Check for existing, if none create, if yes check value and possibly re-alocate.
		$tiers = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
		//echo "<hr />";
		if(isset($tiers[0])){
			//is there a prizeRef matching our pRef list:
			foreach ($pRefs as $key => $value) {
				for($i=0; $i<count($tiers); $i++){
					if($tiers[$i]['prizeRef'] == $key && $tiers[$i]['won'] != 1 && $tiers[$i]['rangeHi'] <= $timeInMins){
						//check range hasn't passed, if it has give new range.
						//echo '<br><span style="color:orange;">below range - </span> '.$tiers[$i]['prizeRef'].' ';
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

	//••••Create a row and give range for unreprisented items in our list.
		foreach ($pRefs as $key => $value) {
			if($value == 'none'){
				$tiersUpdated = $db -> select("SELECT rangeLo, rangeHi FROM `draw` WHERE tStamp LIKE '".$date." %';");
				(isset($tiersUpdated[0]) ? $newRange = rangeGen($tiersUpdated) : $newRange = rangeGen());
				//echo '<br><span style="color:red;">No match for</span> '.$key.', creating one. '.$newRange;
				$result = $db -> query("INSERT INTO `draw` (`prizeRef`,`rangeLo`, `rangeHi`) VALUES ('".$key."',".$newRange.",".($newRange+$window).");");
			}
		}

	//••••Now that we've configured/reconfigured the winner time periods let's check if this current user has fallen within any of the time periods.
		$ranges = $db -> select("SELECT prizeRef, rangeLo, rangeHi, won FROM `draw` WHERE tStamp LIKE '".$date." %';");
		for($i=0; $i < count($ranges); $i++){
			if(($timeInMins >= $ranges[$i]['rangeLo'] && $timeInMins <= $ranges[$i]['rangeHi']) && $ranges[$i]['won'] != 1){
				//echo "<hr color='yellow'>Winner! You won ".$ranges[$i]['prizeRef'].".<hr color='yellow'>";
				$db -> query("UPDATE draw SET won=1 WHERE prizeRef='".$ranges[$i]['prizeRef']."' AND tStamp LIKE '".$date." %';");
				$weGotAWinner = $ranges[$i]['prizeRef'];
			}
		}

		if($weGotAWinner == ''){
			$weGotAWinner = 'vou';
		}elseif($weGotAWinner == 'mGiftBeaG'){ // These else ifs are an afterthought since the client needed to divide 1 prize into 8 types. This DB update should be made the same way as the others, by doing an SQLCount and updating based on that. 
			$db -> query("UPDATE config SET BeaG=BeaG+1 WHERE id=1;");
		}elseif($weGotAWinner == 'mGiftCurl'){
			$db -> query("UPDATE config SET Curl=Curl+1 WHERE id=1;");
		}elseif($weGotAWinner == 'mGiftBeaB'){
			$db -> query("UPDATE config SET BeaB=BeaB+1 WHERE id=1;");
		}elseif($weGotAWinner == 'mGiftGlaB'){
			$db -> query("UPDATE config SET GlaB=GlaB+1 WHERE id=1;");
		}elseif($weGotAWinner == 'mGiftGlaV'){
			$db -> query("UPDATE config SET GlaV=GlaV+1 WHERE id=1;");
		}

		/*
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
		case 'vou':
		    echo json_encode("vou");
		    break;
		}
		*/
		echo json_encode($weGotAWinner);
		$db -> query("UPDATE users SET prize='".$weGotAWinner."' WHERE id=".$theID.";");

	}
	master();
?>