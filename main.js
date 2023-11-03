import {
    SHAPES,
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    BOARD_WIDTH,
    BOARD_HEIGHT
} from './constants.js';

const $canvas = document.querySelector('canvas');
let timer = 0;
let BOARD = getNewBoard();
var lastUserMove = '';

let piece = {
    x: Math.floor(BOARD_WIDTH/2) - 1,
    y: 1,
    dir: '',
    color: 'red',
    shape: getNewShape(),
    draw(ctx) {
        ctx.fillStyle = piece.color;
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[0].length; x++) {
                if(this.shape[y][x] === 1) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.fillRect((this.x + x) * BLOCK_WIDTH, (this.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.fillStyle = piece.color;
                    ctx.rect((this.x + x) * BLOCK_WIDTH, (this.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.stroke();
                }
            }
        }
    },
    move(dir) {
        switch (dir) {
            case 'ArrowUp':
                this.rotate()
                break;
            case 'ArrowDown': // Accelerate
                this.y += 1;
                this.dir = dir;
            break;
            case 'ArrowLeft': // Move left
                this.x -= 1;
                this.dir = dir;
            break;
            case 'ArrowRight': // Move right
                this.x += 1;
                this.dir = dir;
            break;
        }
        lastUserMove = '';
    },
    back() {
        switch (this.dir) {
            case 'ArrowDown': // Accelerate
                this.y -= 1;
            break;
            case 'ArrowLeft': // Move left
                this.x += 1;
            break;
            case 'ArrowRight': // Move right
                this.x -= 1;
            break;
        }
    },
    reset() {
        this.x = Math.floor(BOARD_WIDTH/2) - 1;
        this.y = 0;
        const i = Math.floor(Math.random() * SHAPES.length);
        this.shape = getNewShape();
    },
    rotate() {
        let newRow = [];
        let shape = [];
        for (let x = 0; x < this.shape[0].length; x++) {
            for (let y = 0; y < this.shape.length; y++) {
                newRow.unshift(this.shape[y][x])
            }
            shape.push(newRow)
            newRow = [];
        }
        this.shape = shape;
    }
}

function boundaries() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[0].length; x++) {
            if(piece.shape[y][x] === 1 && BOARD[piece.y + y]?.[piece.x + x] !== 0) {
                piece.back()
                if(piece.dir === 'ArrowDown') {
                    setToBoard();
                }
                return;
            }
        }
    }
}

function setToBoard() {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[0].length; x++) {
            if(piece.shape[y][x] === 1) {
                BOARD[piece.y + y][piece.x + x] = piece.shape[y][x];
            }
        }
    }
    piece.reset();
    completedLines();
}

function completedLines() {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        let sum = BOARD[y].reduce((a, b) => a + b);
        if(sum === BOARD_WIDTH) {
            BOARD.splice(y,1);
            BOARD.unshift(new Array(BOARD_WIDTH).fill(0));
        }
    }
}

function draw() {
    $canvas.width = BLOCK_WIDTH * BOARD_WIDTH;
    $canvas.height = BLOCK_HEIGHT * BOARD_HEIGHT;
    const ctx = $canvas.getContext('2d');

    drawBoard(ctx);
    if(lastUserMove) {
        piece.move(lastUserMove);
    }
    drawShadow(ctx, piece);
    piece.draw(ctx);
    if(timer > 50) {
        piece.move('ArrowDown');
        boundaries();
        timer = 0;
    }
    timer++;

    window.requestAnimationFrame(draw);
}

function getNewShape() {
    let index = Math.floor(Math.random() * SHAPES.length );
    return SHAPES[index];
}

function drawBoard(ctx) {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            ctx.fillStyle = 'white';
            
            if(BOARD[y][x] == 1) {
                ctx.beginPath();
                ctx.fillStyle = 'white';
                ctx.strokeStyle = "black";
                ctx.rect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                ctx.fillRect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                ctx.stroke();
            }
        }
    }
}

function drawShadow(ctx) {
    let shadow = JSON.parse(JSON.stringify(piece));
    let bajar = false;
    do {
        bajar = false;
        for (let y = 0; y < shadow.shape.length; y++) {
            for (let x = 0; x < shadow.shape[0].length; x++) {
                if(shadow.shape[y][x] === 1 && BOARD[shadow.y + y]?.[shadow.x + x] !== 0) {
                    bajar = true;
                }
            }
        }
        if(!bajar) {
            shadow.y += 1;
        }
    } while (!bajar);

    shadow.y -= 1;
    for (let y = 0; y < shadow.shape.length; y++) {
        for (let x = 0; x < shadow.shape[0].length; x++) {
            if(shadow.shape[y][x] === 1) {
                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.fillStyle = 'pink';
                ctx.fillRect((shadow.x + x) * BLOCK_WIDTH, (shadow.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                ctx.rect((shadow.x + x) * BLOCK_WIDTH, (shadow.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                ctx.stroke();
            }
        }
    }
}

function getNewBoard() {
    return new Array(BOARD_HEIGHT).fill().map(() => new Array(BOARD_WIDTH).fill(0));
    /* return [
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,1,1,1,1,1],
        [1,1,1,1,1,0,0,1,1,1,1,1],
    ]; */
}

document.addEventListener('keydown', (event) => {
    lastUserMove = event.code;
    piece.move(event.code)
    boundaries();
});

draw();
