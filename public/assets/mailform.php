<?php

//Note: need to test the security regarding cross domain atacks

// define variables and set to empty values
$theirEmail = $subject = $message = "";
$headers = "From: JLC@juicylemoncreative.com" . "\r\n";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $theirEmail = test_input($_POST["theiremail"]);
  $subject = test_input($_POST["subject"]);
  $message = test_input($_POST["message"]);
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

$message = $message . ' | THEIR EMAIL: ' . $theirEmail;

mail('liamjlewis@gmail.com',$subject,$message,$headers);

echo 'received';
?>