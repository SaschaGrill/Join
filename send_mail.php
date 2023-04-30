<?php

########### CONFIG ###############

$recipient = 'your@mail.com';
# $redirect = 'success.html';

########### CONFIG END ###########



########### Intruction ###########   
#
#   This script has been created to send an email to the $recipient
#   
#  1) Upload this file to your FTP Server
#  2) Send a POST rewquest to this file, including
#     [name] The name of the sender (Absender)
#     [message] Message that should be send to you
#
##################################



###############################
#
#        DON'T CHANGE ANYTHING FROM HERE!
#
#        Ab hier nichts mehr ändern!
#
###############################

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $email = $_POST['email'];

        $message = "Hello JOIN-User, \n".
        "\nWe're sorry to hear that you've forgotten your JOIN password for your " . $email . " ".
        "\nBut don't worry, we can help you reset it quickly and easily.".
        "\nTo reset your password, simply click on the following link:\n".
        "\nhttps://gruppe-544.developerakademie.net/Join/reset_password.html?email=" . $email . "\n".
        "\nYou'll be asked to create a new password. Please enter your new password twice to confirm.".
        "\nOnce you've created your new password, you'll be able to log in to your account immediately.\n".
        "\nIf you have any issues or questions, please feel free to contact us. We're always here to help.\n".
        "\nBest regards,".
        "\nYour JOIN-TEAM";

        $recipient = $email;
        $subject = "Reset your password for JOIN App";
        $headers = "From:  noreply@join-reset-password.com";

        $result = mail($recipient, $subject, $message, $headers);
        print($result);
        # header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
