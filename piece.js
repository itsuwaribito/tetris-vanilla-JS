import {
    SHAPES,
    BLOCK_WIDTH,
    BLOCK_HEIGHT,
    BOARD_WIDTH,
    DETALLES
} from './constants.js';

function getNewShape() {
    let index = Math.floor(Math.random() * SHAPES.length );
    return SHAPES[index];
}

function getRandomColor() {
    const colors = ['red','pink','yellow','purple','orange','blue'];
    return  colors[Math.floor(Math.random() * colors.length)];
}


export default {
    x: Math.floor(BOARD_WIDTH/2) - 1,
    y: 1,
    dir: '',
    color: getRandomColor(),
    shape: getNewShape(),
    draw(ctx) {
        ctx.fillStyle = this.color;
        for (let y = 0; y < this.shape.length; y++) {
            for (let x = 0; x < this.shape[0].length; x++) {
                ctx.beginPath();
                ctx.strokeStyle = DETALLES ? "red":"black";
                ctx.fillStyle = this.color;
                if(this.shape[y][x].state === 1) {
                    ctx.fillRect((this.x + x) * BLOCK_WIDTH, (this.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                    ctx.rect((this.x + x) * BLOCK_WIDTH, (this.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                } else if(DETALLES) {
                    ctx.rect((this.x + x) * BLOCK_WIDTH, (this.y + y) * BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
                }
                ctx.stroke();
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
        
        this.shape = getNewShape();
        this.color = getRandomColor();
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
};
