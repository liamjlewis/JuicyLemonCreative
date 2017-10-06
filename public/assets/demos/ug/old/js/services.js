/*umberto.service('helloWorldFromService', function() {
    this.sayHello = function() {
        return "Hello, World!"
    };
});*/

function makeSparkles(){
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	//width = canvas.width = $('.crackerPostHouse').width()+(parseInt($('.crackerPostHouse').css('padding-left'))*2);
	width = canvas.width = $(window).width();
	height = canvas.height = ($('.crackerPostHouse').height()*3);
	//$('#canvas').css('background','green');
	$('#canvas').css('margin-top','-'+($('#canvas').height()/2)+'px');
	$('#canvas').offset({left:0});


	// création d'un tableau
	particle = [];
	particleCount = 0,
	  gravity = 1,
	  colors = [
	    '#000', '#000', '#FFF', '#CCC', '#92724f'
	  ];
	particle2 = [];
	particle2Count = 0;

	for (var i = 0; i < 600; i++) {

	  particle.push({
	    x: width / 2,
	    y: height / 1.4,
	    boxW: randomRange(5, 20),
	    boxH: randomRange(5, 20),
	    size: randomRange(2, 8),

	    spikeran: randomRange(3, 5),

	    velX: randomRange(-30, 30),
	    velY: randomRange(-50, -10),

	    angle: convertToRadians(randomRange(0, 360)),
	    color: colors[Math.floor(Math.random() * colors.length)],
	    anglespin: randomRange(-0.2, 0.2),

	    draw: function() {

	      context.save();
	      context.translate(this.x, this.y);
	      context.rotate(this.angle);
	      context.fillStyle = this.color;
	      context.beginPath();
	      // drawStar(0, 0, 5, this.boxW, this.boxH);
	      context.arc(0,0,(Math.random()*4),0,2*Math.PI);
	      	/*random = Math.random,
			PI = Math.PI
			DEG_TO_RAD = PI / 180;
	      	this.rotationSpeed = (random() * 600 + 800);
		    this.angle = DEG_TO_RAD * random() * 360;
		    this.rotation = DEG_TO_RAD * random() * 360;*/
	      context.fill();
	      context.closePath();
	      context.restore();
	      //this.angle += this.anglespin;
	      this.velY *= 0.999;
	      this.velY += 0.9;

	      this.x += this.velX;
	      this.y += this.velY;
	      /*if (this.y < 0) {
	        this.velY *= -0.2;
	        this.velX *= 0.9;
	      };
	      if (this.y > height) {
	        this.anglespin = 0;
	        this.y = height;
	        this.velY *= -0.2;
	        this.velX *= 0.9;
	      };
	      if (this.x > width || this.x < 0) {

	        this.velX *= -0.5;
	      };*/

	    },

	  });

	}
	for (var i = 0; i < 600; i++) {
	  particle2.push({
	    x: width / 2,
	    y: height / (1.4-(Math.random()*0.2)),
	    boxW: randomRange(5, 20),
	    boxH: randomRange(5, 20),
	    size: randomRange(2, 8),
	    spikeran: randomRange(3, 5),
	    velX: randomRange(-30, 30),
	    velY: randomRange(-50, -10),
	    angle: convertToRadians(randomRange(0, 360)),
	    color: colors[Math.floor(Math.random() * colors.length)],
	    anglespin: randomRange(-0.2, 0.2),
	    draw: function() {
	      context.save();
	      context.translate(this.x, this.y);
	      context.rotate(this.angle);
	      context.fillStyle = this.color;
	      context.strokeStyle = this.color;
	      context.beginPath();
	      var randSq = Math.round(Math.random()*10);
	      //context.fillRect(0,0,randSq,randSq); 
	      //context.fill();
// Set rectangle and corner values
var cornerRadius = randSq*0.5;;
// Set faux rounded corners
context.lineJoin = "round";
context.lineWidth = cornerRadius;
// Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
context.strokeRect(0+(cornerRadius/2), 0+(cornerRadius/2), randSq-cornerRadius, randSq-cornerRadius);
context.fillRect(0+(cornerRadius/2), 0+(cornerRadius/2), randSq-cornerRadius, randSq-cornerRadius);

	      context.closePath();
	      context.restore();
	      this.velY *= 0.975;
	      this.velY += 0.6;
	      this.x += this.velX;
	      this.y += this.velY;
	    },
	  });
	}
	console.log(particle.length);

	function drawScreen() {
	  size = 50;
	  pFontName = "Lucida Sans Unicode";
	  context.font = size + "pt " + pFontName;

	  context.globalAlpha = 1;
	  for (var i = 0; i < particle.length; i++) {
	    particle[i].draw();
	    particle2[i].draw();
	    //console.log(particle.length);
	  }
	}

	function update() {

	  context.clearRect(0, 0, width, height);

	  drawScreen();

	  	if (typeof requestAnimationFrame == 'function') { 
	  	  //Decent browsers
		  requestAnimationFrame(update);
		}else{
		  //Old crappy Safari 
		  webkitRequestAnimationFrame(update);
		}
	}

	function randomRange(min, max) {
	  return min + Math.random() * (max - min);
	}

	function randomInt(min, max) {
	  return Math.floor(min + Math.random() * (max - min + 1));
	}

	function convertToRadians(degree) {
	  return degree * (Math.PI / 180);
	}

	function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
	  var rot = Math.PI / 2 * 3;
	  var x = cx;
	  var y = cy;
	  var step = Math.PI / spikes;

	  context.strokeSyle = "#000";
	  context.beginPath();
	  context.moveTo(cx, cy - outerRadius)
	  for (i = 0; i < spikes; i++) {
	    x = cx + Math.cos(rot) * outerRadius;
	    y = cy + Math.sin(rot) * outerRadius;
	    context.lineTo(x, y)
	    rot += step

	    x = cx + Math.cos(rot) * innerRadius;
	    y = cy + Math.sin(rot) * innerRadius;
	    context.lineTo(x, y)
	    rot += step
	  }
	  context.lineTo(cx, cy - outerRadius)
	  context.closePath();
	  context.fillStyle = color;
	  context.fill();
	}

	update();
};

function medusa(targ){
	var kidCount = 0;
	var posStore = {};
	$(targ).children().each(function(){
		if($(this).attr('id') != 'canvas'){
			posStore[kidCount+'t'] = $(this).position().top;
			posStore[kidCount+'l'] = $(this).position().left;
			kidCount++;
		};
	});
	var kidCount = 0;
	$(targ).css({'position':'relative','height':$(targ).height()+'px'});
	$(targ).children().each(function(){
		if($(this).attr('id') != 'canvas'){
			$(this).css({'position':'absolute', 'top':posStore[kidCount+'t'], 'left':posStore[kidCount+'l'], 'width':$(this).width()+'px'});
			kidCount++;
		};
	});
};

function crack(){
	$('.flasher').addClass('flash');
	$('.crackerPreHouse').hide();
	$('.crackerPostHouse').show();
	medusa('.crackerPostHouse');
	//$('.crackerPostHouse').prepend('<div class="crackerNote">Please click here for prizes and that.</div>');
	$('.crackerPostHouse').children('.crackerPostL, .crackerPostR').addClass('startCrack');
	makeSparkles();
	setInterval(function(){
		window.location.href = '#/congrats';
	}, 4000);
};

//jQuery slider control   
function sliderControl(){
  $('.crackerPre').load(function(){
    curW = parseInt($('.crackerPre').css('width'));
    curH = $('.crackerPre').css('height');
    console.log(curW+' - '+curH);
  });
  
  $('.pullerCont').mousemove(function(e){
    window.thePageX = e.pageX;
  });

  $('#grab').on( "touchstart", function(e) {
  	//if touched on a mobile, update the slider
  	
  });

  $('#grab').on( "mousedown touchstart", function(e) {
  	$('*').addClass('noSel');
  	curW = parseInt($('.crackerPre').css('width'));
    curH = $('.crackerPre').css('height');
      var mouseX = 0, limitX = 15;
      // cache the selector
      var follower = null; 
      var xp = 0;
      var $elem = $(this).parent();

      window.loop = setInterval(function() {

        var bordW = parseInt($('.pullerCont').css("border-left-width"));
        var minS = $('#grab').position().left - bordW;
        var maxS = $('.pullerCont').width()-$('#grab').width();
        var perc = Math.round((minS/maxS)*100);
        console.log('* '+perc);

        if(perc >= 98){
            //$('#grab').offset().left = (($elem.offset().left+$elem.width())-$('#grab').width());
            //make sure the 'follower' draggable button is in the ending position.
            $('.follower').css('left',(($('.pullerCont').width()*0.98)-$('.follower').width())+'px');
            clearInterval(window.loop);
            $('#grab').removeAttr('id');
            crack();
            return;
        };

        //stretch the cracker depending on slider position - changes it by 10%
        $('.crackerPre').css({'height':curH, 'width':curW*(1+((perc/1000)))+'px'});
        console.log(1+((perc/1000)/2));

        var offset = $elem.offset();
        mouseX = Math.min(window.thePageX - offset.left, $elem.width() - limitX);
        if (mouseX < 0) mouseX = 0;
        // change 12 to alter damping higher is slower
        xp += (mouseX - xp) / 6;
        $elem.find('.follower').css({left:xp});
      }, 75);
  });

  $('*').on( "mouseup touchend", function(e) {
      clearInterval(window.loop);
      $('#grab').css('left','0px');
      $('.crackerPre').css({'height':curH, 'width':curW+'px'});
      $('*').removeClass('noSel');
  });
};
/*
$(document).ready(function(){
	//make an abject/class that can be repeated
	function sparkle(theY){
	  var x = Math.random()*100;
	  if(theY != undefined){
	  	var y = theY;
	  }else{
	  	var y = Math.random()*100
	  };
	  var size = Math.random()*10;
	  var runTime = 5+(Math.random()*10);
	  var colours = ['#d0d0ce','#b8b8b8','#999999'];
	  var colour = colours[Math.round(Math.random()*2)];
	  this.makeSparkle = function(ID){
	    $('.sparkleHouse').prepend('<div class="sparkle" id="'+ID+'"></div>');
	    $('#'+ID).css({'left':x+'%','top':y+'%','box-shadow': '0px 0px '+size+'px '+size+'px '+colour,'animation-duration':runTime+'s', 'animation-delay':(Math.random()*6)+'s', 'background':colour});
	  };
	};
	var sparkles = [];
	for (var i = 0; i < 600; i++) {
	  sparkles[i] = new sparkle();
	  sparkles[i].makeSparkle('sp'+i);
	}
	//make it more intense at the bottom
	var botSparkles = [];
	for (var i = 0; i < 200; i++) {
	  botSparkles[i] = new sparkle((Math.random()*40)+60);
	  botSparkles[i].makeSparkle('bsp'+i);
	}
});*/