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
        if(this.squareX + this.squareWidth < canvasWidth){
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

const carre1 = new Carre(50,0,0,speedX,0);      // immédiat
const carre2 = new Carre(50,0,51,speedX,50);    // 1 sec
const carre3 = new Carre(50,0,102,speedX,200);  // 4 sec

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
    gameLoop(carre1);
    gameLoop(carre2);
    gameLoop(carre3);

    if(carre3.squareX + carre3.squareWidth >= canvasWidth){
        endGame();
    }
}