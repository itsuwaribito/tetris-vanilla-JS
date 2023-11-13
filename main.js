import {
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    BOARD_WIDTH,
    BOARD_HEIGHT
} from './constants.js';

import Piece from './piece.js';
import Board from './board.js';

const $canvas = document.querySelector('canvas');
const $inicio = document.querySelector('#inicio span');
const audio = new Audio("./Tetris.ogg");
let timer = 0;
let puntaje = 0;
let playing = false;

let lastUserMove = '';

function draw() {
    if(!playing) {
        return;
    }
    $canvas.width = BLOCK_WIDTH * BOARD_WIDTH;
    $canvas.height = BLOCK_HEIGHT * BOARD_HEIGHT;
    const ctx = $canvas.getContext('2d');

    Board.draw(ctx);
    Board.shadow(ctx, Piece);
    Piece.draw(ctx);
    
    if(timer > 50) {
        Piece.move('ArrowDown');
        
        if(Board.boundaries(Piece)) {
            if(Piece.y === 0) {
                gameOver();
                return;
            }
            if(Piece.dir === 'ArrowDown') {
                setPuntaje(Board.setToBoard(Piece));
            }
        }
        timer = 0;
    }
    timer++;

    window.requestAnimationFrame(draw);
}

function setPuntaje(lineas) {
    lineas = (lineas === undefined) ? 0 : lineas;

    if(lineas == 0)
    return;

    const scores = [0,100,200,400,800];

    puntaje += scores[lineas];
    console.log('puntaje Acutal', puntaje)
}

function gameOver() {
    document.querySelector('#inicio').style.display = 'grid';
    $canvas.style.display = 'none';
    audio.currentTime = 0;
    audio.pause();
    $inicio.innerHTML = 'Game Over <br> ¿reiniciar?';
    Piece.reset();
    playing = false;
    Board.reset();
}

document.addEventListener('keydown', (event) => {
    lastUserMove = event.code;
    Piece.move(event.code)
    if(Board.boundaries(Piece)) {
        if(Piece.y === 0) {
            gameOver();
            return;
        }
        setPuntaje(Board.setToBoard(Piece));
    }
});

$inicio.addEventListener('click', (event) => {
    document.querySelector('#inicio').style.display = 'none';
    $canvas.style.display = 'block';
    audio.loop = true;
    audio.play();
    playing = true;
    draw();
});


