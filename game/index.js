const colors = [null, 'coral', 'yellowgreen', 'red', 'pink', 'purple', 'whitesmoke', 'saddlebrown'];
// Variables
const canvas = document.querySelector('.playArea');
const context = canvas.getContext('2d')
context.scale(20, 20);



const player = {
    position: { x: 0, y: 0 },
    matrix: null,
    score: 0,
}
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

document.querySelector('.releaseBtn').style.display = "none";

document.querySelector('.pauseBtn').onclick = () => {
    dropInterval = 10000000;
    document.querySelector('.pauseBtn').style.display = "none";
    document.querySelector('.releaseBtn').style.display = "inline-block";

}

document.querySelector('.releaseBtn').onclick = () => {
    dropInterval = 1000
    document.querySelector('.releaseBtn').style.display = "none";
    document.querySelector('.pauseBtn').style.display = "inline-block";


}


// events

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1)
        // player.position.x--;
    }
    else if (event.keyCode === 39) {
        playerMove(1)
        // player.position.x++;
    }
    else if (event.keyCode === 40) {
        playerDrop();
    }
    else if (event.keyCode === 81) {
        playerRotate(-1)
    }
    else if (event.keyCode === 87) {
        playerRotate(1)

    }
}


);



// Function Calls

const arena = createMatrix(12, 20);

console.log(arena);
console.table(arena);


// function definitions

const resetBtnFn = () => location.reload();


function playerMove(dir) {
    player.position.x += dir;
    if (collide(arena, player)) {
        player.position.x -= dir
    }

}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function updateScore() {
    document.querySelector('.score').innerText = player.score;
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                    matrix[y][x],
                    matrix[x][y],
                ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerRotate(dir) {
    const pos = player.position.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1))

        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.position.x = pos;
            return;
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.position];

    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {

            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true
            }
        }

    }
    return false

}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix
}

function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    }

    else if (type === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    }

    else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    }

    else if (type === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    }

    else if (type === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    }
    else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }

    else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }

}



function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.position.y = 0;
    player.position.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }

}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.position.y][x + player.position.x] = value;
            }
        }

        )
    }

    )
}

function playerDrop() {
    player.position.y++;
    if (collide(arena, player)) {
        player.position.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    // console.log(deltaTime);

    draw();
    requestAnimationFrame(update);
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();

    }

}

function draw() {
    context.fillStyle = '#263238';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                // context.fillStyle = 'red';
                context.fillStyle = colors[val];
                context.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        });
    });
}



// to know which keyCode is pressed.
// document.querySelector('body').onkeypress = (e) => {console.log(e);}


playerReset();
updateScore();
update();
