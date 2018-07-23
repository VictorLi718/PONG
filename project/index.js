//Globals
  //GLOBAL CONSTS
	var BLUE = '#3A5BCD';
	var RED = '#EF2B36';
	var YELLOW = '#FFC636';
	var GREEN = '#02A817';
	var BLACK = '#000000';
	var SPACE = 32;
	var P = 80;
	var L = 76;
	var Q = 81;
	var ESC = 27;
	var A = 65;


//game specific VARS
		var started  = false;
		var ballRadius = 10;
		var paddleWidth = 30;
		var paddleHeight = 200;
		var paddleSpeed = 3;
		var numballs = 2;
		var ballspeed = 1;
		var ballSpeedLimit = 5;
		var lifespan = 900;
		var spawn = true;

        var animspeedup = 10;

        var bounceMultiplier = 1.2;
        var paddleMaxSpeed = 60;


//Server setup

var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var fs = require('fs');
var server = app.listen(port, function(){
	console.log('listening on port',port);
});


app.use(express.static('client'));

//Routing

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});


//Socket Setup
var io = require('socket.io')(server);
var sockets = {};
var gameBox = {width: 800, height : 600}
var scores = [];
scores.push( {name: 'left', score: 0} );
scores.push( {name: 'right', score: 0} );


io.on('connection', function(socket){
	console.log(socket.id, "made socket connection")
	sockets[socket.id] = socket;

	startAnim();
	if(paddles.numRight > paddles.numLeft)	{
		paddles[socket.id] = new Paddle(gameBox.width-0-paddleWidth, (gameBox.height-paddleHeight)/2, paddleWidth, paddleHeight, 'blue', 'left')
		paddles.numLeft++;
	}
	else{
  		paddles[socket.id] = new Paddle(0, (gameBox.height-paddleHeight)/2, paddleWidth, paddleHeight, 'blue', 'right');
  		paddles.numRight++;
	}

  	socket.on('keydown', function(data){

  		if(data.kc === upKey) paddles[socket.id].up = 1;
  		else if(data.kc === downKey) paddles[socket.id].down = 1;
  	})
  	socket.on('keyup', function(data){
  		if(data.kc === upKey) paddles[socket.id].up = 0;
  		else if(data.kc === downKey) paddles[socket.id].down = 0;
  	})



  	socket.on('disconnect', function(){
  		if(paddles[socket.id].position === 'left') paddles.numLeft--;
  		else paddles.numRight--;
  		delete sockets[socket.id];
  		delete paddles[socket.id];
  		if(countProperties(paddles) === 0) endGame();
  	})


})


 function Ball(x, y, vx, vy, color, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.origX = x;
    this.origY = y;
    this.radius = ballRadius;
    this.life = life || Infinity;
  }

  Ball.prototype.speed = function(){
    return Math.sqrt((this.vx*this.vx) + (this.vy*this.vy));
  }

  Ball.prototype.setSpeed = function(speed){
    let curspd = this.speed();
    this.vx = this.vx/curspd*speed;
    this.vy = this.vy/curspd*speed;
  }

function Paddle(x, y, width, height, color, position){
      this.x = x;
      this.y = y;
      this.color = color;
      this.width = width;
      this.height = height;
      this.position = position;
      this.up = 0;
      this.down = 0;
      this.speed = paddleSpeed;

      this.moveUp = function(){
        this.up = 1;
      }
      this.stopMoveUp = function(){
        this.up = 0;
      }
      this.moveDown = function(){
        this.down = 1;
      }
      this.stopMoveDown = function(){
        this.down = 0;
      }
  }



var QKey = 81;
var AKey = 65;
var upKey = 38;
var downKey = 40;
var paddles = {};
paddles.numLeft = 0;
paddles.numRight = 0;
var balls = [];
balls.push(new Ball(gameBox.width/2, gameBox.height/2, Math.random()*8-4, Math.random()-0.5, 'blue'));




function countProperties(obj) {
    return Object.keys(obj).length;
}


var collisionDamper = 0;
//update
var update = function(){

	//balls
	for(let i = 0; i < balls.length; i++){
		let ball = balls[i];
			speed = ball.speed();
			if(speed < 2){
				ball.setSpeed(2);
			}
			if(speed > ballSpeedLimit){
				ball.setSpeed((ballSpeedLimit+speed)/2);
			}
			ball.vy+=(Math.random()-0.5)/2;
			// floor condition
	          if(ball.y > (gameBox.height - ball.radius)) {
	            ball.y = gameBox.height - ball.radius - 2;
	            ball.vy *= -1;
	            ball.vy *= (1 - collisionDamper);
	          }

	          // ceiling condition
	          if(ball.y < (ball.radius)) {
	            ball.y = ball.radius + 2;
	            ball.vy *= -1;
	            ball.vy *= (1 - collisionDamper);
	          }

	          // right wall condition
	          if(ball.x > (gameBox.width - ball.radius)) {
	            ball.x = gameBox.width - ball.radius - 2;
	            ball.vx *= -1;
	            ball.vx *= (1 - collisionDamper);
	        //    removeBall();
	            scores[0].score++;
	            for(let id in paddles){
	            	if(paddles[id].position === 'right') {
	            		if(paddles[id].speed > 30) paddles[id].color = 'green';
	            		(paddles[id].speed*=2);
	            		paddles[id].speed = (paddles[id].speed>paddleMaxSpeed)?paddleMaxSpeed:paddles[id].speed;
	            	}
	            }
	         //   continue;
	          //  endRound();
	          }

	          // left wall condition
	          if(ball.x < (ball.radius)) {
	            ball.x = ball.radius + 2;
	            ball.vx *= -1;
	            ball.vx *= (1 - collisionDamper);
	      //      removeBall();
	            scores[1].score++;
	            for(let id in paddles){
	            	if(paddles[id].position === 'left') {
	            		if(paddles[id].speed > 30) paddles[id].color = 'green';
	            		paddles[id].speed*=2;
	            		paddles[id].speed = (paddles[id].speed>paddleMaxSpeed)?paddleMaxSpeed:paddles[id].speed;
	            	}
	            }
	        //    continue;
	          //  endRound()
	          }

			ball.x += ball.vx*2;
			ball.y += ball.vy*2;


		for(let id in paddles){
				let paddle = paddles[id];
				
					if(ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width
	          		 && ball.y < paddle.y + paddle.height + ball.radius && ball.y > paddle.y-ball.radius ){
	          		//	ball.x = paddle.x - ball.radius - 1;
	          			ball.x+=(paddle.x < ball.x)?1:-1;
		          		ball.vx *= -1 *bounceMultiplier;
	               		ball.vy *= bounceMultiplier;
					}


			}

		for(let j in sockets){
			var socket = sockets[j];
			let paddle = paddles[j];

			var amount = paddle.down - paddle.up;
	  		if(amount != 0){
	  			var y = paddle.y + paddle.speed*amount//(amount*timeDiff*speed);
	          	paddle.y = y;
	         }

			socket.emit('render', {paddlesSent: paddles, ballsSent: balls, scoresSent : scores})
		}

		for(let j in scores){
			if(scores[j].score > 10){
			 endGame();
			 io.sockets.emit('won', {winner : scores[j].name})
			}
		}


	}
}
var animationID;
var started = false;
function startAnim(){
	if(!started){
		started =true;
		animationID = setInterval(update,1000/45)
	}
}

function endGame(){
	clearInterval(animationID);
	started = false;
	scores = [];
	scores.push( {name: 'left', score: 0} );
	scores.push( {name: 'right', score: 0} );  
	balls = [];
	balls.push(new Ball(gameBox.width/2, gameBox.height/2, Math.random()*8-4, Math.random()-0.5, 'blue'));

}