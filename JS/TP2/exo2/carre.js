document.addEventListener("DOMContentLoaded",startGame);


const event = new Event('bang');


let intervalId; 



let canvas;
let context; 
const canvasWidth = 500;
//const canvasHeight = 100;

const fps = 40; // frame per seconds
const speedInPxPs = 100; // in px  per seconds

const squareWidth = 50;
let squareX = 0;
let squareY = 0; 
let speedX = 0; 


function startGame(){
    canvas = document.getElementById("monCanvas");
//    canvas.setAttribute("width",canvasWidth);
//    canvas.setAttribute("height",canvasHeight);
    context = canvas.getContext("2d");
    speedX = speedInPxPs / fps; //100px per seconds and 30fps => 3px per frame (approx)
    intervalId = window.setInterval(gameLoop,1000/fps); // 30fps
}

function endGame(){
    window.clearInterval(intervalId);	
}

function gameLoop(){
    clearSquare();
    updateSquare();
    drawSquare();
}

function clearSquare(){
    context.clearRect(squareX-1, squareY-1, squareWidth+2, squareWidth+2);
}

function updateSquare(){
    if(squareX + squareWidth >= canvasWidth){
        endGame();
    } else {
        squareX = squareX + speedX;
    }
}

function drawSquare(){
    context.fillStyle ='#F00';
    context.fillRect(squareX, squareY, squareWidth, squareWidth);
}