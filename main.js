
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

//create a bew ball
function createBall(x, y, radius, vx, vy, color){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.vx = vx;
	this.vy = vy;
	this.mass = 10;
	this.lastBall = -1;
}

function createPaddle(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.up = false;
	this.down = false;
  this.left = false;
  this.right = false;
}

function createItem(x,y,radius){
	this.x = x;
	this.y = y;
	this.radius = radius; 
	this.isExist = true;
}

function particle(x,y,angle,v,a,color){
this.x = x;
this.y = y;
this.lastLocs = [ 
  {x:x, y:y},
  {x:x, y:y},
  {x:x, y:y}, 
  ];
this.v = v; // the v
this.a = a; // the deacceleration
this.vx = 0;
this.vy = 0;
this.radius = 3;// the radius of the balls
this.color=color;
this.angle = angle;// explode angle of each balls
this.originalAngle = angle;
this.isFinished = false;
}

var speedup = 3;
var date = new Date();
var time = date.getTime();
var isExit = false;
var isExplode = false;
var leftBalls = 0;
var rightBalls = 0;
var topBalls = 0;
var bottomBalls = 0;
	var ballgroup = [];
	var letters = '0123456789ABCDEF';
	var numBalls = 10;
	var speed = 3;
	var timeoutID;
var G = 100;
	var explodeSpeed = 0.55;
var isPause = true;
var isCollide = true;
var isGravity = false;
var isPhoto = false;
var isFirework = false;
var isCreate = false;
var pos={x:9999,y:9999};
var particlesGroup = [];
var status = "start";
var mode = "";
var number = 0;
var opa = 1;
	// var BLACK = "#000000";
// var BLUE = "#0066ff";
// var GREEN = "#66ff33";
// var YELLOW = "#ffff00";


	function randomColor(){
		var color = '#';
	for (var j = 0; j < 6; j++) {
			color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
	}

	function slowformGroup1(){//classical mode
  leftPaddle = new createPaddle(20,150,20,200);
  rightPaddle = new createPaddle(960,150,20,200);
		for(var i=0; i < 2; i++){
		timeoutID = window.setTimeout(formBall,100*i);   			
		}
	}
function slowformGroup2(){//extreme mode
  speed = 2;
  leftPaddle = new createPaddle(20,150,20,200);
  rightPaddle = new createPaddle(960,150,20,200);
  topPaddle = new createPaddle(400,20,200,20);
  bottomPaddle = new createPaddle(400,460,200,20);
  for(var i=0; i < 2; i++){
  timeoutID = window.setTimeout(formBall,100*i);         
  }
}
function slowformGroup3(){//fun mode
  leftPaddle = new createPaddle(20,150,20,200);
  rightPaddle = new createPaddle(960,150,20,200);
  topPaddle = new createPaddle(400,20,200,20);
  bottomPaddle = new createPaddle(400,460,200,20);
  for(var i=0; i < numBalls; i++){
  timeoutID = window.setTimeout(formBall,100*i);         
  }
}

	function formBall(){
		ballgroup.push(new createBall(500+(Math.random()-0.5)*0.1, 250, 10, (1-Math.random()*2)*speed, (1-Math.random()*2)*speed, randomColor()));
	}

	acc = new createItem(60+Math.random()*900, 60+Math.random()*400, 50);
	big = new createItem(60+Math.random()*900, 60+Math.random()*400, 50);
	small = new createItem(60+Math.random()*900, 60+Math.random()*400, 50);
dec = new createItem(60+Math.random()*900, 60+Math.random()*400, 50);

var canvas = document.getElementById("Canvas");    	
var context = canvas.getContext("2d");
	var img1 = new Image();
img1.src = "img/acc.png";
	var img2 = new Image();
img2.src = "img/big.png";
	var img3 = new Image();
img3.src = "img/small.png";
var img4 = new Image();
img4.src = "img/dec.png";
var img5 = new Image();
img5.src = "img/Kai.png";

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  return {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function refresh(ball){
	ball.x += ball.vx;
	ball.y += ball.vy;
}

function refreshPaddle(paddle){
	  if((paddle.up == true)&&(paddle.y >= 5))
		{
			paddle.y -= 2;
   	}
   	if((paddle.down == true)&&(paddle.y <= canvas.height-5-paddle.height))
		{
			paddle.y += 2;
   	}
    if((paddle.left == true)&&(paddle.x >= 5))
    {
      paddle.x -= 2;
    }
    if((paddle.right == true)&&(paddle.x <= canvas.width-5-paddle.height))
    {
      paddle.x += 2;
    }
}

function accelerate(){
	for(var i=0; i<=ballgroup.length;i++){
		ballgroup[i].vx = ballgroup[i].vx * 2;
		ballgroup[i].vy = ballgroup[i].vy * 2;
	}
}

function decelerate(){
  for(var i=0; i<ballgroup.length;i++){
    ballgroup[i].vx = ballgroup[i].vx / 2;
    ballgroup[i].vy = ballgroup[i].vy / 2;
  }
}

function pause(){
  isPause = !isPause;
  speedup = 3;
  if(isPause) animate(canvas,time);
}

function paintPaddle(context,paddle,color){
  context.beginPath();
  context.rect(paddle.x,paddle.y,paddle.width,paddle.height);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

function paintBall(ball){
  context.beginPath();
  context.arc(ball.x , ball.y , ball.radius , 0 , 2* Math.PI);
  context.fillStyle = ball.color;
  context.fill();
}

function bounce(ball, paddle){
 	if((ball.x-ball.radius <= paddle.x+paddle.width)&&(ball.x+ball.radius >= paddle.x)&&(ball.y+ball.radius>=paddle.y)&&(ball.y+ball.radius<=paddle.y +5)){//top
      ball.vy = Math.abs(ball.vy) *-1;
      ball.y = paddle.y-ball.radius-1;
      ball.lastBall = -1;
  }
  if((ball.x-ball.radius <= paddle.x+paddle.width)&&(ball.x+ball.radius >= paddle.x)&&(ball.y-ball.radius<=paddle.y+paddle.height)&&(ball.y-ball.radius>=paddle.y+paddle.height -5)){//bottom
      ball.vy = Math.abs(ball.vy);
      ball.y = paddle.y+paddle.height+ball.radius+1;
      ball.lastBall = -1;
  }
  if((ball.y-ball.radius <= paddle.y+paddle.height)&&(ball.y+ball.radius >= paddle.y)&&(ball.x+ball.radius>=paddle.x)&&(ball.x+ball.radius<=paddle.x +5)){//left
      ball.vx = Math.abs(ball.vx) * -1;
      ball.x = paddle.x-ball.radius-1;
      ball.lastBall = -1;
  }
  if((ball.y-ball.radius <= paddle.y+paddle.height)&&(ball.y+ball.radius >= paddle.y)&&(ball.x-ball.radius<=paddle.x+paddle.width)&&(ball.x-ball.radius>=paddle.x+paddle.width -5)){//right
      ball.vx = Math.abs(ball.vx);
      ball.x = paddle.x+paddle.width+ball.radius+1;
      ball.lastBall = -1;
  }
  // if((ball.x < paddle.x+paddle.width)&&(ball.x > paddle.x)&&(ball.y < paddle.y+paddle.height)&&(ball.y > paddle.y))
  // {
  //   console.log(Math.sqrt(ball.vx**2+ball.vy**2));
  //   //eject!
  //   // ball.x+=ball.vx*5;
  //   // ball.y+=ball.vy*5;
    
  //   //pause();
  //   //bounce(ball,paddle);
  // }
}

function collide(ball1, ball2){
	var a = (2*ball2.mass)*((ball1.vx-ball2.vx)*(ball1.x-ball2.x)+(ball1.vy-ball2.vy)*(ball1.y-ball2.y))/((ball1.mass+ball2.mass)*((ball1.x-ball2.x)**2+(ball1.y-ball2.y)**2));
	var b = (2*ball1.mass)*((ball2.vx-ball1.vx)*(ball2.x-ball1.x)+(ball2.vy-ball1.vy)*(ball2.y-ball1.y))/((ball1.mass+ball2.mass)*((ball1.x-ball2.x)**2+(ball1.y-ball2.y)**2));
	ball1.vx = ball1.vx-a*(ball1.x-ball2.x);
	ball1.vy = ball1.vy-a*(ball1.y-ball2.y);
	ball2.vx = ball2.vx-b*(ball2.x-ball1.x);
	ball2.vy = ball2.vy-b*(ball2.y-ball1.y);
}

function exit(){
	for (var i = 0; i<ballgroup.length; i++){
		ballgroup[i].vx = 0;
		ballgroup[i].vy = 1;
	}
	isExit = true;
  isCollide = false;
}

function explode(){
	let num = ballgroup.length;
	window.isExplode = true;
	//console.log(isExplode + " from explode func")
	for (var i = 0; i<num; i++){
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, explodeSpeed, explodeSpeed, ballgroup[i].color));
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, -explodeSpeed, -explodeSpeed, ballgroup[i].color));
			ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, 0, explodeSpeed, ballgroup[i].color));
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, 0, -explodeSpeed, ballgroup[i].color));
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, explodeSpeed, 0, ballgroup[i].color));
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, -explodeSpeed, 0, ballgroup[i].color));
			ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, explodeSpeed, -explodeSpeed, ballgroup[i].color));
		ballgroup.push(new createBall(ballgroup[i].x+Math.random(), ballgroup[i].y, ballgroup[i].radius/2, -explodeSpeed, explodeSpeed, ballgroup[i].color));
		
	}
	ballgroup.splice(0,num);
  isCollide = false;
}

function newParticle(x,y){
  var particleGroup = [];
  var color = 'hsl('+360*Math.random()+', 100%, 70%)';
  for(var i=0; i<18; i++){
    particleGroup.push(new particle(x, y, i*10, 1*Math.random() + 2, 0.02 ,color));
    var radian = (particleGroup[i].angle-90)/180*(2*Math.PI);
    particleGroup[i].vx = particleGroup[i].v*Math.sin(radian);
    particleGroup[i].vy = particleGroup[i].v*Math.cos(radian);
  }
  particlesGroup.push(particleGroup);
}

function update(particleGroup){
  for(var i=0; i<particleGroup.length; i++){
    var radian = (particleGroup[i].angle-90)/180*(2*Math.PI);
    particleGroup[i].vx = particleGroup[i].v*Math.sin(radian);
    particleGroup[i].vy = particleGroup[i].v*Math.cos(radian);
    particleGroup[i].lastLocs[2].x = particleGroup[i].lastLocs[1].x;
    particleGroup[i].lastLocs[2].y = particleGroup[i].lastLocs[1].y;
    particleGroup[i].lastLocs[1].x = particleGroup[i].lastLocs[0].x;
    particleGroup[i].lastLocs[1].y = particleGroup[i].lastLocs[0].y;
    particleGroup[i].lastLocs[0].x = particleGroup[i].x;
    particleGroup[i].lastLocs[0].y = particleGroup[i].y;
    particleGroup[i].x += particleGroup[i].vx;
    particleGroup[i].y += particleGroup[i].vy;
    if(particleGroup[i].angle > 90 ) particleGroup[i].angle -= 0.2;
    else particleGroup[i].angle += 0.2;
    particleGroup[i].v -= particleGroup[i].a;
    if((particleGroup[i].angle- particleGroup[i].originalAngle >= 20)||(particleGroup[i].v <= 0)) particleGroup.splice(i,1);
  }
}

function drawParticle(particleGroup){
  for(var i=0; i<particleGroup.length; i++){
    context.beginPath();
    context.arc(particleGroup[i].x , particleGroup[i].y , particleGroup[i].radius , 0 , 2* Math.PI);
    context.fillStyle = particleGroup[i].color;
    context.fill();
    context.closePath();
    context.beginPath();
    context.moveTo(particleGroup[i].x,particleGroup[i].y);
    context.lineWidth = 6;
    context.lineTo(particleGroup[i].lastLocs[2].x,particleGroup[i].lastLocs[2].y);
    context.strokeStyle = particleGroup[i].color;
   //    context.stroke();
   //    context.moveTo(particleGroup[i].lastLocs[0].x,particleGroup[i].lastLocs[0].y);
    // context.lineWidth = 6;
   //    context.lineTo(particleGroup[i].lastLocs[1].x,particleGroup[i].lastLocs[1].y);
   //    context.strokeStyle = particleGroup[i].color;
   //    context.stroke();
   //    context.moveTo(particleGroup[i].lastLocs[1].x,particleGroup[i].lastLocs[1].y);
    // context.lineWidth = 4;
   //    context.lineTo(particleGroup[i].lastLocs[2].x,particleGroup[i].lastLocs[2].y);
   //    context.strokeStyle = particleGroup[i].color;
   //    context.stroke();
      context.closePath();
  }
}

function gravity(x,y,ball){
  var r =  Math.sqrt((ball.x-x)**2 +(ball.y-y)**2);
  var ax = G*(ball.x-x)*ball.mass/(r**3);
  var ay = G*(ball.y-y)*ball.mass/(r**3);
  //console.log(ax,ay);
  ball.vx -= ax;
  ball.vy -= ay;
}

function speedControl(ball){
    if (ball.vx**2 + ball.vy**2 >= 25) {
      var t = (ball.vx**2 + ball.vy**2);
      ball.vx =Math.sqrt(25/t)*ball.vx;
      ball.vy =Math.sqrt(25/t)*ball.vy;
    }
}

function keyboard(){
  document.body.onkeydown = function(e){
  if(e.keyCode == 32){ //space
          explode();
    }
  if(e.keyCode == 13){ //return
          exit();
    }
  if(e.keyCode == 187){ //+
          accelerate();
    }
  if(e.keyCode == 189){ //-
          decelerate();
    }
  if(e.keyCode == 49){ //1
          formBall();     
    }
  if(e.keyCode == 80){ //p
          pause();
    }
  if(e.keyCode == 70){ //f
          isFirework = true;
  }
  if(e.keyCode == 84){ //t
          isPhoto = !isPhoto;
    }
  if(e.keyCode == 81){ //q
        leftPaddle.up = true;
    }   
  if(e.keyCode == 65){ //a
        leftPaddle.down = true;
    }
  if(e.keyCode == 90){ //z
        topPaddle.left = true;
    }
  if(e.keyCode == 88){ //x
        topPaddle.right = true;
    }
  if(e.keyCode == 79){ //o
        rightPaddle.up = true;
    }   
  if(e.keyCode == 76){ //l
        rightPaddle.down = true;
    } 
  if(e.keyCode == 37){ //left
        bottomPaddle.left = true;
    }
  if(e.keyCode == 39){ //right
        bottomPaddle.right = true;
    }
  }
  document.body.onkeyup = function(e){
  if(e.keyCode == 81){ //q
        leftPaddle.up = false;
    }   
  if(e.keyCode == 65){ //a
        leftPaddle.down = false;
    }
  if(e.keyCode == 90){ //z
        topPaddle.left = false;
    }
  if(e.keyCode == 88){ //z
        topPaddle.right = false;
    }
  if(e.keyCode == 79){ //o
        rightPaddle.up = false;
    }   
  if(e.keyCode == 76){ //l
        rightPaddle.down = false;
    } 
  if(e.keyCode == 37){ //left
        bottomPaddle.left = false;
    }
  if(e.keyCode == 39){ //right
        bottomPaddle.right = false;
    }
  }
}

function startClassical(){
  status = "main";
  mode = "classical";
  var selectmenu = document.getElementById('menu');
  selectmenu.parentNode.removeChild(selectmenu);
  slowformGroup1();
}

function startExtreme(){
  status = "main";
  mode = "extreme";
  var selectmenu = document.getElementById('menu');
  selectmenu.parentNode.removeChild(selectmenu);
  slowformGroup2();
}

function startFun(){
  status = "main";
  mode = "fun";
  var selectmenu = document.getElementById('menu');
  selectmenu.parentNode.removeChild(selectmenu);
  slowformGroup3();
}

function animate(canvas, time){
	let date = new Date();
	var interval = date.getTime() - time;
	time = date.getTime();
	if(status == "start"){
    document.getElementById("mainPlay").style.display = 'none';
    document.getElementById("menu").style.display = 'none';
    document.body.onkeydown = function(e){
    if(e.keyCode == 32){ //space
            var startmenu = document.getElementById('start');
            startmenu.parentNode.removeChild(startmenu);
            status ="menu";
      }
    }
  }
  else if(status == "menu"){
    document.getElementById("mainPlay").style.display = 'none';
    document.getElementById("menu").style.display = 'block';
  }
  else if(status == "main"){
    if(mode == "classical"){
      document.getElementById("mainPlay").style.display = 'block';
      keyboard();
      context = canvas.getContext("2d");
      context.fillStyle = "rgba(255,255,255,"+opa+")"
      context.fillRect(0, 0, canvas.width, canvas.height);

      document.getElementById("output").textContent = "left: " + leftBalls+"\t\t   right: " + rightBalls;
    
      canvas.addEventListener('mousedown', function(evt) {
        pos = getMousePos(canvas, evt);
        isGravity = true;
        isCollide = false;
      });
      canvas.addEventListener('mousemove', function(evt) {pos = getMousePos(canvas, evt);});
      canvas.addEventListener('mouseup', function(evt) {isGravity = false;});
      if(isFirework == true){
          if(isCreate == false){
            number = ballgroup.length;
            while(ballgroup.length > 0){
              newParticle(ballgroup[0].x,ballgroup[0].y);
              ballgroup.splice(0,1);
            }
            isCreate = true;
          }
          opa = 0.05;
          for(var i=0; i<number; i++){
              update(particlesGroup[i]);
              drawParticle(particlesGroup[i]);
          }
      }
      for(var i=0; i<ballgroup.length; i++){//ball
        paintBall(ballgroup[i]);
        if(isGravity) gravity(pos.x,pos.y,ballgroup[i]);
        if((isExit == false)&&(isExplode == false)){
          if(ballgroup[i].x >= (canvas.width-ballgroup[i].radius)) {//right wall
            ballgroup[i].color = randomColor();
            rightBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\t\tright: " + rightBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
            
          }
          else if(ballgroup[i].x <= ballgroup[i].radius) {//left wall
            ballgroup[i].color = randomColor();
            leftBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\t\tright: " + rightBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
            
          }
          else if(ballgroup[i].y >= (canvas.height-ballgroup[i].radius)) {//bottom wall
            ballgroup[i].vy = Math.abs(ballgroup[i].vy)*-1;
            ballgroup[i].y = canvas.height-ballgroup[i].radius-5;
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1; 
           
          }
          else if(ballgroup[i].y <= ballgroup[i].radius) {//top wall
            ballgroup[i].vy = Math.abs(ballgroup[i].vy);
            ballgroup[i].y = ballgroup[i].radius+1;
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1; 
          }
          bounce(ballgroup[i], leftPaddle);
          bounce(ballgroup[i], rightPaddle);
          }
          if(isCollide){
            for (var k = 0; k<ballgroup.length; k++)
              {
                for (var j = k+1; j<ballgroup.length; j++){
                  var dist = ((ballgroup[k].x-ballgroup[j].x)**2 + (ballgroup[k].y-ballgroup[j].y)**2);
                  if ((ballgroup[k].radius+ballgroup[j].radius)**2 >= dist) {
                    if((ballgroup[k].lastBall !== j)&&(ballgroup[j].lastBall !== k)) {
                      collide(ballgroup[k],ballgroup[j]);
                     ballgroup[k].lastBall = j;
                     ballgroup[j].lastBall = k;
                    }
                  }
                }
              }
            if((ballgroup[i].x <= acc.x + acc.radius)&&(ballgroup[i].x >= acc.x - acc.radius)&&(ballgroup[i].y >= acc.y - acc.radius)&&(ballgroup[i].y <= acc.y + acc.radius)){
            ballgroup[i].vx = ballgroup[i].vx *1.5;
            ballgroup[i].vy = ballgroup[i].vy *1.5;
            acc = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

            if((ballgroup[i].x <= dec.x + dec.radius)&&(ballgroup[i].x >= dec.x - dec.radius)&&(ballgroup[i].y >= dec.y - dec.radius)&&(ballgroup[i].y <= dec.y + dec.radius)){
            ballgroup[i].vx = ballgroup[i].vx *0.7;
            ballgroup[i].vy = ballgroup[i].vy *0.7;
            dec = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

           if((ballgroup[i].x <= big.x + big.radius)&&(ballgroup[i].x >= big.x - big.radius)&&(ballgroup[i].y >= big.y - big.radius)&&(ballgroup[i].y <= big.y + big.radius)){
            if(ballgroup[i].radius<=50){
              ballgroup[i].radius = ballgroup[i].radius *1.2;
              ballgroup[i].mass = ballgroup[i].mass * 1.44;
            }
            big = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }
           if((ballgroup[i].x <= small.x + small.radius)&&(ballgroup[i].x >= small.x - small.radius)&&(ballgroup[i].y >= small.y - small.radius)&&(ballgroup[i].y <= small.y + small.radius)){
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].mass = ballgroup[i].mass * 0.81;
            small = new createItem(100+Math.random()*800, Math.random()*500, 20);
            }
          }
          speedControl(ballgroup[i]);

      
      paintPaddle(context,leftPaddle,"red");
      paintPaddle(context,rightPaddle,"blue");

      context.drawImage(img1, acc.x, acc.y, 20, 20);
      context.drawImage(img2, big.x, big.y, 20, 20);
      context.drawImage(img3, small.x, small.y, 20, 20);
      context.drawImage(img4, dec.x, dec.y, 20, 20);
      refresh(ballgroup[i]);
      
      }
      refreshPaddle(leftPaddle);
      refreshPaddle(rightPaddle);
    }
    else if(mode == "extreme"){
      document.getElementById("mainPlay").style.display = 'block';
      keyboard();
      context = canvas.getContext("2d");
      context.fillStyle = "rgba(255,255,255,"+opa+")"
      context.fillRect(0, 0, canvas.width, canvas.height);

      document.getElementById("output").textContent = "left: " + leftBalls+"\tright: " + rightBalls +"\ttop: " + topBalls+"\tbottom: " + bottomBalls;
    
      canvas.addEventListener('mousedown', function(evt) {
        pos = getMousePos(canvas, evt);
        isGravity = true;
        isCollide = false;
      });
      canvas.addEventListener('mousemove', function(evt) {pos = getMousePos(canvas, evt);});
      canvas.addEventListener('mouseup', function(evt) {isGravity = false;});

      if(isFirework == true){
          if(isCreate == false){
            number = ballgroup.length;
            while(ballgroup.length > 0){
              newParticle(ballgroup[0].x,ballgroup[0].y);
              ballgroup.splice(0,1);
            }
            isCreate = true;
          }
          opa = 0.05;
          for(var i=0; i<number; i++){
              update(particlesGroup[i]);
              drawParticle(particlesGroup[i]);
          }
      }
      for(var i=0; i<ballgroup.length; i++){
        paintBall(ballgroup[i]);
        if(isGravity) gravity(pos.x,pos.y,ballgroup[i]);
        if((isExit == false)&&(isExplode == false)){
          if(ballgroup[i].x >= (canvas.width-ballgroup[i].radius)) {//right wall
            ballgroup[i].color = randomColor();
            rightBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\tright: " + rightBalls +"\ttop: " + topBalls+"\tbottom: " + bottomBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
            
          }
          else if(ballgroup[i].x <= ballgroup[i].radius) {//left wall
            ballgroup[i].color = randomColor();
            leftBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\tright: " + rightBalls +"\ttop: " + topBalls+"\tbottom: " + bottomBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
            
          }
          else if(ballgroup[i].y >= (canvas.height-ballgroup[i].radius)) {//bottom wall
            ballgroup[i].color = randomColor();
            bottomBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\tright: " + rightBalls +"\ttop: " + topBalls+"\tbottom: " + bottomBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
           
          }
          else if(ballgroup[i].y <= ballgroup[i].radius) {//top wall
            ballgroup[i].color = randomColor();
            topBalls++;
            document.getElementById("output").textContent = "left: " + leftBalls+"\tright: " + rightBalls +"\ttop: " + topBalls+"\tbottom: " + bottomBalls;
            ballgroup[i] = new createBall(500, 250, 10, (1-Math.random()*2)*speed, (2-Math.random()*2)*speed, randomColor());
            ballgroup[i].lastBall = -1; 
            
          }
          bounce(ballgroup[i], leftPaddle);
          bounce(ballgroup[i], rightPaddle);
          bounce(ballgroup[i], topPaddle);
          bounce(ballgroup[i], bottomPaddle);
          }

          if(isCollide){
            for (var k = 0; k<ballgroup.length; k++)
              {
                for (var j = k+1; j<ballgroup.length; j++){
                  var dist = ((ballgroup[k].x-ballgroup[j].x)**2 + (ballgroup[k].y-ballgroup[j].y)**2);
                  if ((ballgroup[k].radius+ballgroup[j].radius)**2 >= dist) {
                    if(ballgroup[k].lastBall !== j) {
                      collide(ballgroup[k],ballgroup[j]);
                     ballgroup[k].lastBall = j;
                     ballgroup[j].lastBall = k;
                    }
                  }
                }
              }
            if((ballgroup[i].x <= acc.x + acc.radius)&&(ballgroup[i].x >= acc.x - acc.radius)&&(ballgroup[i].y >= acc.y - acc.radius)&&(ballgroup[i].y <= acc.y + acc.radius)){
            ballgroup[i].vx = ballgroup[i].vx *1.5;
            ballgroup[i].vy = ballgroup[i].vy *1.5;
            acc = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

            if((ballgroup[i].x <= dec.x + dec.radius)&&(ballgroup[i].x >= dec.x - dec.radius)&&(ballgroup[i].y >= dec.y - dec.radius)&&(ballgroup[i].y <= dec.y + dec.radius)){
            ballgroup[i].vx = ballgroup[i].vx *0.7;
            ballgroup[i].vy = ballgroup[i].vy *0.7;
            dec = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

           if((ballgroup[i].x <= big.x + big.radius)&&(ballgroup[i].x >= big.x - big.radius)&&(ballgroup[i].y >= big.y - big.radius)&&(ballgroup[i].y <= big.y + big.radius)){
            if(ballgroup[i].radius<=50){
              ballgroup[i].radius = ballgroup[i].radius *1.2;
              ballgroup[i].mass = ballgroup[i].mass * 1.44;
            }
            big = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }
           if((ballgroup[i].x <= small.x + small.radius)&&(ballgroup[i].x >= small.x - small.radius)&&(ballgroup[i].y >= small.y - small.radius)&&(ballgroup[i].y <= small.y + small.radius)){
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].mass = ballgroup[i].mass * 0.81;
            small = new createItem(100+Math.random()*800, Math.random()*500, 20);
            }
          }              
          speedControl(ballgroup[i]);

      
      paintPaddle(context,leftPaddle,"red");
      paintPaddle(context,rightPaddle,"blue");
      paintPaddle(context,topPaddle,"yellow");
      paintPaddle(context,bottomPaddle,"green");

      context.drawImage(img1, acc.x, acc.y, 20, 20);
      context.drawImage(img2, big.x, big.y, 20, 20);
      context.drawImage(img3, small.x, small.y, 20, 20);
      context.drawImage(img4, dec.x, dec.y, 20, 20);
      refresh(ballgroup[i]);
      
      }
      refreshPaddle(leftPaddle);
      refreshPaddle(rightPaddle);
      refreshPaddle(topPaddle);
      refreshPaddle(bottomPaddle);
    }
    else if(mode == "fun"){
      document.getElementById("mainPlay").style.display = 'block';
      keyboard();
      context = canvas.getContext("2d");
      context.fillStyle = "rgba(255,255,255,"+opa+")"
      context.fillRect(0, 0, canvas.width, canvas.height);
    
      canvas.addEventListener('mousedown', function(evt) {
        pos = getMousePos(canvas, evt);
        isGravity = true;
        isCollide = false;
      });
      canvas.addEventListener('mousemove', function(evt) {pos = getMousePos(canvas, evt);});
      canvas.addEventListener('mouseup', function(evt) {isGravity = false;});
      if(isFirework == true){
          if(isCreate == false){
            number = ballgroup.length;
            while(ballgroup.length > 0){
              newParticle(ballgroup[0].x,ballgroup[0].y);
              ballgroup.splice(0,1);
            }
            isCreate = true;
          }
          opa = 0.05;
          for(var i=0; i<number; i++){
              update(particlesGroup[i]);
              drawParticle(particlesGroup[i]);
          }
      }
      for(var i=0; i<ballgroup.length; i++){//ball
        if(isPhoto == false) paintBall(ballgroup[i]);
        else {context.drawImage(img5, ballgroup[i].x-1*ballgroup[i].radius, ballgroup[i].y-1*ballgroup[i].radius,2*ballgroup[i].radius, 2*ballgroup[i].radius);}
        if(isGravity) gravity(pos.x,pos.y,ballgroup[i]);
        if((isExit == false)&&(isExplode == false)){
          if(ballgroup[i].x >= (canvas.width-ballgroup[i].radius)) {//right wall
            ballgroup[i].vx = Math.abs(ballgroup[i].vx)*-1;
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1; 
          }
          else if(ballgroup[i].x <= ballgroup[i].radius) {//left wall
            ballgroup[i].vx = Math.abs(ballgroup[i].vx);
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1; 
          }
          else if(ballgroup[i].y >= (canvas.height-ballgroup[i].radius)) {//bottom wall
            ballgroup[i].vy = Math.abs(ballgroup[i].vy)*-1;
            ballgroup[i].y = canvas.height-ballgroup[i].radius-5;
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1;            
          }
          else if(ballgroup[i].y <= ballgroup[i].radius) {//top wall
            ballgroup[i].vy = Math.abs(ballgroup[i].vy);
            ballgroup[i].y = ballgroup[i].radius+1;
            ballgroup[i].color = randomColor();
            ballgroup[i].lastBall = -1; 
          }
          bounce(ballgroup[i], leftPaddle);
          bounce(ballgroup[i], rightPaddle);
          bounce(ballgroup[i], topPaddle);
          bounce(ballgroup[i], bottomPaddle);
          }
          if(isCollide){
            for (var k = 0; k<ballgroup.length; k++)
              {
                for (var j = k+1; j<ballgroup.length; j++){
                  var dist = ((ballgroup[k].x-ballgroup[j].x)**2 + (ballgroup[k].y-ballgroup[j].y)**2);
                  if ((ballgroup[k].radius+ballgroup[j].radius)**2 >= dist) {
                    if(ballgroup[k].lastBall !== j) {
                      collide(ballgroup[k],ballgroup[j]);
                     ballgroup[k].lastBall = j;
                     ballgroup[j].lastBall = k;
                    }
                  }
                }
              }
            if((ballgroup[i].x <= acc.x + acc.radius)&&(ballgroup[i].x >= acc.x - acc.radius)&&(ballgroup[i].y >= acc.y - acc.radius)&&(ballgroup[i].y <= acc.y + acc.radius)){
            ballgroup[i].vx = ballgroup[i].vx *1.5;
            ballgroup[i].vy = ballgroup[i].vy *1.5;
            acc = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

            if((ballgroup[i].x <= dec.x + dec.radius)&&(ballgroup[i].x >= dec.x - dec.radius)&&(ballgroup[i].y >= dec.y - dec.radius)&&(ballgroup[i].y <= dec.y + dec.radius)){
            ballgroup[i].vx = ballgroup[i].vx *0.5;
            ballgroup[i].vy = ballgroup[i].vy *0.5;
            dec = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }

           if((ballgroup[i].x <= big.x + big.radius)&&(ballgroup[i].x >= big.x - big.radius)&&(ballgroup[i].y >= big.y - big.radius)&&(ballgroup[i].y <= big.y + big.radius)){
            if(ballgroup[i].radius<=50){
              ballgroup[i].radius = ballgroup[i].radius *1.2;
              ballgroup[i].mass = ballgroup[i].mass * 1.44;
            }
            big = new createItem(40+Math.random()*920, 40+Math.random()*420, 50);
            }
           if((ballgroup[i].x <= small.x + small.radius)&&(ballgroup[i].x >= small.x - small.radius)&&(ballgroup[i].y >= small.y - small.radius)&&(ballgroup[i].y <= small.y + small.radius)){
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].radius = ballgroup[i].radius *0.9;
            ballgroup[i].mass = ballgroup[i].mass * 0.81;
            small = new createItem(100+Math.random()*800, Math.random()*500, 20);
            }
          }
          speedControl(ballgroup[i]);

      
      paintPaddle(context,leftPaddle,"red");
      paintPaddle(context,rightPaddle,"blue");
      paintPaddle(context,topPaddle,"yellow");
      paintPaddle(context,bottomPaddle,"green");

      context.drawImage(img1, acc.x, acc.y, 20, 20);
      context.drawImage(img2, big.x, big.y, 20, 20);
      context.drawImage(img3, small.x, small.y, 20, 20);
      context.drawImage(img4, dec.x, dec.y, 20, 20);
      refresh(ballgroup[i]);
      
      }
      refreshPaddle(leftPaddle);
      refreshPaddle(rightPaddle)
      refreshPaddle(topPaddle);
      refreshPaddle(bottomPaddle);;
    }
    }
  

if(isPause)requestAnimFrame(function() {
    while(speedup){
		  animate(canvas, time);
      speedup--;
    }
    animate(canvas, time);
	});
}

animate(canvas, time);


    /*if(ballgroup[i].x >= (canvas.width-ballgroup[i].radius)) {
      if (ballgroup[i].lastWall == "right") {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].vy = 0 - ballgroup[i].vy;
      }
      else {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].lastWall == "right";
        ballgroup[i].color = randomColor();
      }
    }

    if(ballgroup[i].x <= ballgroup[i].radius) {
      if (ballgroup[i].lastWall == "left") {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].vy = 0 - ballgroup[i].vy;
      }
      else {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].lastWall == "left";
        ballgroup[i].color = randomColor();
      }
    }
    if(ballgroup[i].y >= (canvas.height-ballgroup[i].radius)) {
      if (ballgroup[i].lastWall == "top") {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].vy = 0 - ballgroup[i].vy;
      }
      else {
        ballgroup[i].vy = 0 - ballgroup[i].vy;
        ballgroup[i].lastWall == "bottom";
        ballgroup[i].color = randomColor();
      }
    }
    if(ballgroup[i].y <= ballgroup[i].radius){
      if (ballgroup[i].lastWall == "up") {
        ballgroup[i].vx = 0 - ballgroup[i].vx;
        ballgroup[i].vy = 0 - ballgroup[i].vy;
      }
      else {
        ballgroup[i].vy = 0 - ballgroup[i].vy;
        ballgroup[i].lastWall == "up";
        ballgroup[i].color = randomColor();
      }
    }*/
