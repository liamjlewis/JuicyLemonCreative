<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json; charset=UTF-8");


	$name1 = $_POST["frName1"];
	$email1 = $_POST["frEmail1"];

	$name2 = $_POST["frName2"];
	$email2 = $_POST["frEmail2"];

	$name3 = $_POST["frName3"];
	$email3 = $_POST["frEmail3"];

	require('mailchimp.php');

	include 'connect/Db.php';
	$db = new Db();
	
	$db -> query("INSERT INTO friends (theName, email) VALUES ('".$name1."','".$email1."');");
		$MailChimp = new \Drewm\MailChimp('271fc77a968a85fa04433b1783c85edd-us5');
		$result = $MailChimp->call('lists/subscribe', array(
	        'id'                => '5d9db9ba03',
	        'email'             => array('email'=>$email1),
	        'merge_vars'        => array('FNAME'=>$name1, 'LNAME'=>''),
	        'double_optin'      => false,
	        'update_existing'   => true,
	        'replace_interests' => false,
	        'send_welcome'      => false,
	    ));
	if($name2 && $email2){
		$db -> query("INSERT INTO friends (theName, email) VALUES ('".$name2."','".$email2."');");
			$MailChimp2 = new \Drewm\MailChimp('271fc77a968a85fa04433b1783c85edd-us5');
			$result = $MailChimp->call('lists/subscribe', array(
		        'id'                => '5d9db9ba03',
		        'email'             => array('email'=>$email2),
		        'merge_vars'        => array('FNAME'=>$name2, 'LNAME'=>''),
		        'double_optin'      => false,
		        'update_existing'   => true,
		        'replace_interests' => false,
		        'send_welcome'      => false,
		    ));
		    //print_r($result);
	}
	if($name3 && $email3){
		$db -> query("INSERT INTO friends (theName, email) VALUES ('".$name3."','".$email3."');");
			$MailChimp3 = new \Drewm\MailChimp('271fc77a968a85fa04433b1783c85edd-us5');
			$result = $MailChimp->call('lists/subscribe', array(
		        'id'                => '5d9db9ba03',
		        'email'             => array('email'=>$email3),
		        'merge_vars'        => array('FNAME'=>$name3, 'LNAME'=>''),
		        'double_optin'      => false,
		        'update_existing'   => true,
		        'replace_interests' => false,
		        'send_welcome'      => false,
		    ));
		    //print_r($result);
	}

	echo json_encode('successwo0o0o');
?>