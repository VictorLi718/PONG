//socket connection
var socket = io.connect(window.location.href);

socket.on('render', function(data){
	render(data);
})
socket.on('won', function(data){
	alert(data.winner + ' won!\nRefresh to restart (ya it sucks haha)')
})

//DOM
var canvas = document.getElementById('myCanvas');

var render = function(data){
	var context  = canvas.getContext('2d');

    // clear
    context.fillStyle = "rgba(0,0,0,0.2)"; //transparency creates fade effect
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill()

	for(var i in data.paddlesSent){
		let paddle = data.paddlesSent[i];
		context.beginPath();
		context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
		context.fillStyle = 'red';
		context.fill();	
	}
	//balls
	for(let ball of data.ballsSent){
          context.beginPath();
          context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
          context.fillStyle = ball.color;
          context.fill();
	}
	//score
	renderScores(context, data.scoresSent);


}

function renderScores(context, scores){
  	for(var n = 0; n < scores.length; n++){
  		var score = scores[n];
  		context.fillStyle = 'white';
  		context.font = "20px Arial";
  		context.fillText("Player " + score.name + ": \t", 10, (20*(1+n)) );
  		context.fillText(score.score, 150, (20*(1+n)));
  	}
  }

var QKey = 81;
var AKey = 65;
var upKey = 38;
var downKey = 40;

window.addEventListener('keydown', function(evt){
	evt.preventDefault();
	var kc = (evt.keyCode || evt.which);
	if(kc === downKey || kc === upKey) 
		socket.emit('keydown', {kc : kc})
})

window.addEventListener('keyup', function(evt){
	evt.preventDefault();
	var kc = (evt.keyCode || evt.which);
	if(kc === downKey || kc === upKey) 
		socket.emit('keyup', {kc : kc})
})