var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 570;
document.body.appendChild(canvas);

var lives = 9;
var over = false;
var score = 0;
var span = document.createElement("span");
span.innerHTML = `Score: ${score}`;
document.body.appendChild(span);

var background = new Image();
background.src = 'images/underwater.png';

var jellyImage = new Image();
jellyImage.src = "images/jelly-sprite.png";

var bubbleImage = new Image();
bubbleImage.src = "images/bubble.png";

var sharkImage = new Image();
sharkImage.src = "images/shark.png";

var text = document.createElement("p");
text.innerHTML = `GAME OVER`;
document.body.appendChild(text);
text.classList.add("gameOver");
var help = document.createElement("p");
help.innerHTML = `press -space- to continue`;
document.body.appendChild(help);
help.classList.add("help");
var restartButton = document.createElement("button");
restartButton.innerHTML = "-restart-";
document.body.appendChild(restartButton);
restartButton.classList.add("restartButton");

var firstLifePos = 650;
var secondLifePos = 680;
var thirdLifePos = 710;
var outOfScreenPos = 1000;
var heartPosDefault = 0;
var heartPosInjured = 100;
var heartPosAlmostKilled = 200;
var firstHeartPos;
var secondHeartPos;
var thirdHeartPos;

var firstLife = new Image();
var secondLife = new Image();
var thirdLife = new Image();
firstLife.src = secondLife.src = thirdLife.src = "images/hearts.png";
firstHeartPos = secondHeartPos = thirdHeartPos = heartPosDefault;

var mainTheme = new Audio("music/track1.wav");
mainTheme.volume = .10;
var bubbleSound = new Audio("music/bubble.wav");
bubbleSound.volume = .20;
var biteSound = new Audio("music/bite.wav");
biteSound.volume = .20;
var gameOverSound = new Audio("music/gameOverSound.wav");
gameOverSound.volume = .20;

function removeLife() {
	lives--;

	if(lives === 8) {
		firstHeartPos = heartPosInjured;
	} else if (lives === 7) {
		firstHeartPos = heartPosAlmostKilled;
	} else if (lives === 6) {
		firstLifePos = outOfScreenPos;
	} else if (lives === 5) {
		secondHeartPos = heartPosInjured;
	} else if (lives === 4) {
		secondHeartPos = heartPosAlmostKilled;
	} else if (lives === 3) {
		secondLifePos = outOfScreenPos;
	} else if (lives === 2) {
		thirdHeartPos = heartPosInjured;
	} else if (lives === 1) {
		thirdHeartPos = heartPosAlmostKilled;
	} else if (lives === 0) {
		thirdLifePos = outOfScreenPos;
	}
}

var bubbles = [];
var bubbleStartPosY = canvas.height;
var bubbleAddTime = 1500;
var bubbleSpeed = 1.5;
var lastAddBubble = -1;

var xPos = 100;
var yPos = 250;
var spritePosx = 20;
var spritePosy = 65;
var count = 0;

var shark;
var sharkStartPosX = 0;
var sharkAddTime = 5000;
var sharkSpeed = 7;
var lastAddShark = Date.now();

var animation, paused = false;
var sharkPosX, sharkPosY;

window.onload = function() {
	ctx.drawImage(background, 0, 0);
	ctx.drawImage(jellyImage, spritePosx, spritePosy, 70, 70, xPos, yPos, 60, 60);
	ctx.drawImage(firstLife, firstHeartPos, 0, 100, 100, firstLifePos, 20, 25, 25);
	ctx.drawImage(secondLife, secondHeartPos, 0, 100, 100, secondLifePos, 20, 25, 25);
	ctx.drawImage(thirdLife, thirdHeartPos, 0, 100, 100, thirdLifePos, 20, 25, 25);
	animateAll();
	bubbleSound.load();
	mainTheme.load();
	biteSound.load();
}

function restart() {
	text.style.display = "";
	restartButton.style.display = "";
	lives = 9;
	score = 0;
	span.innerHTML = `Score: ${score}`;
	firstLifePos = 650;
	secondLifePos = 680;
	thirdLifePos = 710;
	firstHeartPos = 0;
	secondHeartPos = 0;
	thirdHeartPos = 0;
	bubbles.length = 0;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	update();
	createNewBubble();
	requestAnimationFrame(animateAll);
	bubbleStartPosY = canvas.height;
	over = false;
	mainTheme.volume = .10;
	gameOverSound.volume = .0;
	
}

function update() {
	ctx.drawImage(background, 0, 0);
	ctx.drawImage(jellyImage, spritePosx, spritePosy, 70, 70, xPos, yPos, 60, 60);
	ctx.drawImage(firstLife, firstHeartPos, 0, 100, 100, firstLifePos, 20, 25, 25);
	ctx.drawImage(secondLife, secondHeartPos, 0, 100, 100, secondLifePos, 20, 25, 25);
	ctx.drawImage(thirdLife, thirdHeartPos, 0, 100, 100, thirdLifePos, 20, 25, 25);
}

function move(e) {
	count = 0;
	var stepHorizontal, stepVertical;
	if(e.keyCode === 38 && !paused && !over) {
		stepVertical = setInterval(function() {
			if(yPos < 10) {
				clearInterval(stepVertical);
				return;
			}
			if(count > 40) {
				clearInterval(stepVertical);
			}
			yPos -= 2;
			count++;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			update();
			spritePosy = 0;
		}, 5);

	} else if(e.keyCode === 39 && !paused && !over) {
		stepHorizontal = setInterval(function() {
			if(xPos > canvas.width - 70) {
				clearInterval(stepHorizontal);
				return;
			}
			if(count > 40) {
				clearInterval(stepHorizontal);
			}
			xPos += 2;
			count++;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			update();
			spritePosy = 133;
		}, 5);

	} else if(e.keyCode === 37 && !paused && !over) {
		stepHorizontal = setInterval(function() {
			if(xPos < 10) {
				clearInterval(stepHorizontal);
				return;
			}
			if(count > 40) {
				clearInterval(stepHorizontal);
			}
			xPos -= 2;
			count++;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			update();
			spritePosy = 200;
		}, 5);

	} else if(e.keyCode === 40 && !paused && !over) {
		stepVertical = setInterval(function() {
			if(yPos > canvas.height - 70) {
				clearInterval(stepVertical);
				return;
			}
			if(count > 40) {
				clearInterval(stepVertical);
			}
			yPos += 2;
			count++;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			update();
			spritePosy = 69;
		}, 5);

	}
	else if (e.keyCode === 32 && !over) {
		if(paused){
			text.style.display = "";
			help.style.display = "";
			animateAll();
			paused = false;
		} else {
			pauseGame();
			paused = true;
		}
	} 
}

document.body.onkeydown = move;

function createNewShark() {
	var sharkObject = {
		x: sharkStartPosX - 400,
		y: Math.random() * (canvas.height - 200),
	}
	shark = sharkObject;
}


function createNewBubble() {
	var object = {
		x: Math.random() * (canvas.width - 50) + 15,
		y: bubbleStartPosY,
	}

	bubbles.push(object);
}

function animateAll() {
	
	var time = Date.now();

	if(time > lastAddBubble + bubbleAddTime) {
		lastAddBubble = time;
		createNewBubble();
	}

	if(time > lastAddShark + sharkAddTime) {
		lastAddShark = time;
		createNewShark();
		sharkPosX = shark.x;
		sharkPosY = shark.y;
	}	

	if (lives > 0) {
		mainTheme.play();
		animation = requestAnimationFrame(animateAll);

	} else {
		mainTheme.volume = .0;
		gameOverSound.volume = 0.20;
		gameOverSound.play();
		over = true;
		text.style.display = "block";
		restartButton.style.display = "block";
		text.innerHTML = "GAME OVER";
		yPos = 500;
		xPos = 380;
		spritePosy = 65;
		restartButton.onclick = restart;
	}
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	update();
	

	for (var i = 0; i < bubbles.length; i++) {
        var object = bubbles[i];
        object.y -= bubbleSpeed;
        ctx.drawImage(bubbleImage, object.x, object.y, 35, 35);
        if(xPos < object.x + 35 && xPos > object.x - 35 && 
        	yPos < object.y + 35 && yPos > object.y - 35) {
        	bubbleSound.play();
     		bubbles.splice(i, 1);
     		score += 1;
     		span.innerHTML = `Score: ${score}`;
        }
    }

    sharkPosX += sharkSpeed;
    ctx.drawImage(sharkImage, sharkPosX, sharkPosY, 390, 150);

    
    if(xPos < sharkPosX + 400 && xPos > sharkPosX && 
        yPos < sharkPosY + 100 && yPos > sharkPosY - 50) {
    	biteSound.play();
    	if(sharkPosY > 300) {
    		xPos = 380;
    		yPos = 0;
    	}
    	if(sharkPosY < 300) {
    		xPos = 380;
    		yPos = 500;
    	}
     	removeLife();
    }
}

function pauseGame() {
	text.style.display = "block";
	text.innerHTML = "PAUSED";
	help.style.display = "block";
	cancelAnimationFrame(animation);
}