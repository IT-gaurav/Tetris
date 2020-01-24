// Variables
const canvas = document.querySelector('.playArea');
const context = canvas.getContext('2d')
context.scale(20, 20);


const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

const player = {
    position: { x: 2, y: 2 },
    matrix: matrix,
}
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;





// events

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.position.x--;
    }
    else if (event.keyCode === 39) {
        player.position.x++;
    }
    else if (event.keyCode === 40) {
        playerDrop();
    }
}


);



// Function Calls

update();




// function definitions

function playerDrop() {
    player.position.y++;
    dropCounter = 0;
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    // console.log(deltaTime);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    draw();
    requestAnimationFrame(update);
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();

    }

}

function draw() {
    drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((val, x) => {
            if (val !== 0) {
                context.fillStyle = 'yellow';
                context.fillRect(x + offset.x,
                    y + offset.y,
                    1, 1);
            }
        });
    });
}

// to know which keyCode is pressed.
// document.querySelector('body').onkeypress = (e) => {console.log(e);}

