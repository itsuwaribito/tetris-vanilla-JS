import {
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    BOARD_WIDTH,
    BOARD_HEIGHT,
    DETALLES
} from './constants.js';

function getNewBoard() {
    return new Array(BOARD_HEIGHT).fill().map(() => new Array(BOARD_WIDTH).fill().map(() => ({state:0,color:''})));
}

export default {
    BOARD: getNewBoard(),
    draw(ctx) {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                
                if(this.BOARD[y][x].state == 1) {
                    ctx.fillStyle = this.BOARD[y][x].color;
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.rect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.fillRect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.stroke();
                }
                else if(DETALLES) {
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.rect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    // ctx.fillRect(x*BLOCK_WIDTH,y*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    if(x == 0)
                    ctx.fillText(y , x*BLOCK_WIDTH+15,y*BLOCK_HEIGHT+20);
                    if(y == 0)
                    ctx.fillText(x , x*BLOCK_WIDTH+15,y*BLOCK_HEIGHT+20);
                    ctx.stroke();
                }
            }
        }
    },
    completedLines() {
        let lineas = 0;
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            let sum = this.BOARD[y].reduce((a, b) => {
                return {
                   state: a.state + b.state
                }
            });
            if(sum.state === BOARD_WIDTH) {
                lineas++;
                this.BOARD.splice(y,1);
                this.BOARD.unshift(new Array(BOARD_WIDTH).fill().map(() => ({state:0,color:''})));
            }
        }
        
        return lineas;
    },
    boundaries(piece) {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[0].length; x++) {
                if(piece.shape[y][x].state === 1 && this.BOARD[piece.y + y]?.[piece.x + x]?.state !== 0) {
                    piece.back();
                    return true;
                }
            }
        }
        // console.log('boundaries',lineas)
        return false;
    },
    setToBoard(piece) {
        let lineas = 0;
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[0].length; x++) {
                if(piece.shape[y][x].state !== 1) {
                    continue;
                }
                let yy = piece.y + y;
                let xx = piece.x + x;
                this.BOARD[yy][xx].state = 1;
                this.BOARD[yy][xx].color = piece.color;
            }
        }
        piece.reset();
        lineas = this.completedLines();
        
        return lineas;
    },
    activateSquare(x,y,color) {
        this.BOARD[y][x].state = 1;
        this.BOARD[y][x].color = color;
    },
    shadow(ctx, {x,y,shape,color}) {
    
        let shadow = JSON.parse(JSON.stringify({x,y,shape,color}));
        let bajar = false;
        do {
            bajar = false;
            for (let Y = 0; Y < shadow.shape.length; Y++) {
                for (let X = 0; X < shadow.shape[0].length; X++) {
                    if(shadow.shape[Y][X].state === 1 && this.BOARD[shadow.y + Y]?.[shadow.x + X].state !== 0) {
                        bajar = true;
                    }
                }
            }
            if(!bajar) {
                shadow.y += 1;
            }
        } while (!bajar);
    
        shadow.y -= 1;
        ctx.globalAlpha = 0.3;
        for (let Y = 0; Y < shadow.shape.length; Y++) {
            for (let X = 0; X < shadow.shape[0].length; X++) {
                if(shadow.shape[Y][X].state === 1) {
                    ctx.beginPath();
                    ctx.strokeStyle = "black";
                    ctx.fillStyle = shadow.color;
                    ctx.fillRect((shadow.x + X) * BLOCK_WIDTH, (shadow.y + Y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.rect((shadow.x + X) * BLOCK_WIDTH, (shadow.y + Y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
    },
    reset() {
        this.BOARD = getNewBoard();
    }
};