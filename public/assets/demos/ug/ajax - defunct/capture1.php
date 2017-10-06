<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Content-Type");
	header("Content-Type: application/json; charset=UTF-8");


	$name = $_POST["name"];
	$email = $_POST["email"];

	require('mailchimp.php');
	$MailChimp = new \Drewm\MailChimp('271fc77a968a85fa04433b1783c85edd-us5');
	$result = $MailChimp->call('lists/subscribe', array(
        'id'                => '81c937bc89',
        'email'             => array('email'=>$email),
        'merge_vars'        => array('FNAME'=>$name, 'LNAME'=>''),
        'double_optin'      => false,
        'update_existing'   => true,
        'replace_interests' => false,
        'send_welcome'      => false,
    ));
    //print_r($result);

	include 'connect/Db.php';
	$db = new Db();
	
	$exists = $db -> select("SELECT COUNT(email) FROM users WHERE email='".$email."';");
	
	if($exists[0]['COUNT(email)'] == 0){
		$db -> query("INSERT INTO users (theName, email) VALUES ('".$name."','".$email."');");
		$theID = $db -> select("SELECT id FROM users WHERE theName='".$name."' AND email='".$email."';");
		echo json_encode($theID[0]['id']);
	}else{
		echo json_encode('email-taken');
	}
?>