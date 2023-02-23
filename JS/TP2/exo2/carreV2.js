document.addEventListener("DOMContentLoaded",startGame);


const event = new Event('bang');

class Carre {
    constructor(squareWidth, squareX, squareY, speedX, delay){
        this.squareWidth = squareWidth;
        this.squareX = squareX;
        this.squareY = squareY;
        this.speedX = speedX;
        this.delay = delay;
    }

    clearSquare() {
        context.clearRect(this.squareX-1, this.squareY-1, this.squareWidth+2, this.squareWidth+2);
    }

    updateSquare(){
        if(this.squareX + this.squareWidth >= canvasWidth){
            endGame();
        } else {
            this.squareX = this.squareX + this.speedX;
        }
    }

    drawSquare(){
        context.fillStyle ='#F00';
        context.fillRect(this.squareX, this.squareY, this.squareWidth, this.squareWidth);
    }
}

let intervalId; 

let canvas;
let context; 
const canvasWidth = 500;

const fps = 40; // frame per seconds
const speedInPxPs = 100; // in px  per seconds
let speedX = speedInPxPs / fps; //100px per seconds and 30fps => 3px per frame (approx)

const carre = new Carre(50,0,0,speedX,100);
let time = 0;



function startGame(){
    canvas = document.getElementById("monCanvas");
    context = canvas.getContext("2d");
    intervalId = window.setInterval(update,1000/fps); // 30fps
}

function endGame(){
    window.clearInterval(intervalId);	
}

function gameLoop(carre){
    if (time > carre.delay) {
        carre.clearSquare();
        carre.updateSquare();
        carre.drawSquare();
    } else {
        carre.clearSquare();
        carre.drawSquare();
    }
}

function update(){
    time ++;
    gameLoop(carre);
}