var umbertoControllers = angular.module('umbertoControllers', ['ngAnimate']);

umbertoControllers.controller('pullController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
  window.winCode = 'vou';
  $scope.deetsSubmit = function(){
    if($scope.name && $scope.email && $scope.email.indexOf("@") >= 0 && $scope.email.indexOf(".") >= 0){

      deets = {name:$scope.name, email:$scope.email};
      //---- I don't think it's good to have AJAX in AJAX, google it.
      //---- Do something proper when errors shows
      $.ajax({
          type : 'POST',
          url : 'ajax/capture1.php',
          dataType: 'json',
          data: deets,
          success : function(data){
            if(data == 'email-taken'){
              $('.error p').text("Email already taken.").slideDown();
              $('.error p').slideDown();
            }else{
              var theID = data;
              //remove error messages
              $('.error p').slideUp();
              $('.reqEmail').css('opacity','1');
              $('.block').remove();
              //remove capture area - this is dirty but it seems to stop the background jumping
              var fooMa = ($('.capture1').height() + parseInt($('.footer').css('margin-top')));
              $('.capture1, .blurb, .error').animate({opacity:0,height:0}, 300, function(){
                $('.capture1, .blurb, .error').remove();
              });
              //$('.crackerPreHouse, .crackerPostHouse').animate({marginTop:-30}, 300);
              $('.footer').animate({marginTop:fooMa}, 300);
              $('html, body').animate({
                  //scrollTop: $(".crackerPre").offset().top
                  scrollTop: $("body").offset().top
              }, 300);
              //$('.pullIt').text('Now use this nifty slider to pull the cracker.');

              //make the prize draw
              console.log('The email list ID: '+theID);
              theID = {theIDx:theID};
              console.log(theID.theIDx+'<----');
              $.ajax({
                  type : 'POST',
                  url : 'ajax/drawx.php',
                  dataType: 'json',
                  data: theID,
                  success : function(data){
                    console.log('Success, win code: '+data);
                    window.winCode = data;
                  },
                  error : function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('Draw '+XMLHttpRequest+' | '+textStatus+' | '+errorThrown);
                    $('.error p').text("There has been an error, please alert admin.").slideDown();
                    $('.error p').slideDown();
                  }
              });
            }
          },
          error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest+' | '+textStatus+' | '+errorThrown +' XXXX '+data);
            $('.error p').text("There has been an error, please alert admin.").slideDown();
            $('.error p').slideDown();
          }
      });
    }else{
      $('.error p').text("Please make sure you've filled in the form correctly.");
      $('.error p').slideDown();
    };
  };

  angular.element(document).ready(function () {
    //Direct the user to the capture area.
    $('.block').on( "mousedown touchstart", function(){
      $('html, body').animate({
            scrollTop: $("h1").offset().top
        }, 300);
        $('.i1').css('box-shadow','0px 0px 10px #C4F9FF');
        $('.i1').click(function(){$('.i1').css('box-shadow','none')});
        $('input.i1').focus();
    });

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      sliderControlMob();
      $('.sparkleHouse').remove();
    }else{
      sliderControl();
    }

  });
}]);

umbertoControllers.controller('congratsController', ['$scope', '$http', function($scope, $rootScope, $http) {
  if(window.winCode == undefined){
    var winCodeNoNum = 'none';
  }else{
    var winCodeNoNum = window.winCode.replace(/[0-9]/g, '');
  }
  $scope.isVou = 0;
  switch(winCodeNoNum){
    case 'vou':
      $scope.whatWon = '£2 off any Umberto Giannini product on Boots.com';
      $scope.whatWonSRC = "../images/voucher.jpg";
      $scope.isVou = 1;
      break;
    case 'none':
      $scope.whatWon = 0;
      //---- Will they actually be able to redeem?
      break;
    case 'top':
      $scope.whatWon = 'A Complimentary Luxury Cut & Blow Dry';
      $scope.whatWonSRC = "../images/cutandblowdry.jpg";
      break;
    case 'mBlow':
      $scope.whatWon = 'A Complimentary Luxury Blow Dry';
      $scope.whatWonSRC = "../images/blowdry.jpg";
      break;
    case 'mGiftBeaG':
      $scope.whatWon = 'A Beautilicious Gift Set';
      $scope.whatWonSRC = "../images/glambox.jpg";
      break;
    case 'mGiftCurl':
      $scope.whatWon = 'A Curl Story Gift Set';
      $scope.whatWonSRC = "../images/curlstory.jpg";
      break;
    case 'mGiftBeaB':
      $scope.whatWon = 'A Beauty Box Gift Set';
      $scope.whatWonSRC = "../images/beautybox.jpg";
      break;
    case 'mGiftGlaB':
      $scope.whatWon = 'A Glambox Gift Set';
      $scope.whatWonSRC = "../images/beautilicious.jpg";
      break;
    case 'mGiftGlaV':
      $scope.whatWon = 'A Glamvoyage Gift Set';
      $scope.whatWonSRC = "../images/glamvoyage.jpg";
      break;
    case 'mMousse':
      $scope.whatWon = 'A Glam Hair Elevate Massive Mousse 30ml';
      $scope.whatWonSRC = "../images/mousse.jpg";
      break;
  }

  $scope.frDeetsSubmit = function(){
    function spitDummy(){
      $(".frError p").text("Please make sure you've filled in the form correctly.");
      $(".frError p").slideDown();
      $(".frButton").animate({marginTop:0});
    };
    if($scope.frName1 && $scope.frEmail1 && $scope.frEmail1.indexOf("@") >= 0 && $scope.frEmail1.indexOf(".") >= 0){
      if(($scope.frName2 && $scope.frEmail2 == undefined) || ($scope.frName2 && ($scope.frEmail2.indexOf("@") <= 0 || $scope.frEmail2.indexOf(".") <= 0))){
        spitDummy();
      }else if(($scope.frName3 && $scope.frEmail3 == undefined) || ($scope.frName3 && ($scope.frEmail3.indexOf("@") <= 0 || $scope.frEmail3.indexOf(".") <= 0))){
        spitDummy();
      }else{
        frDeets = {frName1:$scope.frName1, frEmail1:$scope.frEmail1, frName2:$scope.frName2, frEmail2:$scope.frEmail2, frName3:$scope.frName3, frEmail3:$scope.frEmail3};
        $.ajax({
            type : 'POST',
            url : 'ajax/capture2.php',
            dataType: 'json',
            data: frDeets,
            success : function(data){
              console.log('successsss '+data)
              $('.sendToFriend input').val('');
              $('.frError p').text('Thank you');
              $(".frError p").slideDown();
              $(".frButton").animate({marginTop:0});
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
              console.log('ERROR: '+XMLHttpRequest+' | '+textStatus+' | '+errorThrown);
            }
        });
      }
    }else{
      spitDummy();
    }
  }

  angular.element(document).ready(function () {
    $('.footer').css('margin-top','0px');
    $('body').css('background-image','none');
    $('body').css('background-image','url("../images/bg2.jpg")');
  });

  // Prevent to use the back button.
  $scope.$on('$locationChangeStart', function(event) {
   if (!$scope.isAuthenticated) {
     event.preventDefault();
   }
  });

}]);
