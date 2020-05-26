

/**
	By dev-abir(https://github.com/dev-abir)
*/

/////////////////////GLOBAL VARS/////////////////////
var canvas = document.getElementById("main_draw_area");
var ctx = canvas.getContext('2d');


/////////////////////SETTINGS/////////////////////
const CELL_WIDTH = 10;					// I may think about makeing it responsive later...
const CELL_HEIGHT = 10;					// I may think about makeing it responsive later...

const CANVAS_WIDTH = canvas.width;		// I may think about makeing it responsive later...
const CANVAS_HEIGHT = canvas.height;	// I may think about makeing it responsive later...

const N_ROWS = CANVAS_WIDTH / CELL_WIDTH;
const N_COLUMNS = CANVAS_HEIGHT / CELL_HEIGHT;

const DEFAULT_FPS = 60;


/////////////////////CELL CLASS/////////////////////
class Cell {
	constructor(alive, arrIndexX, arrIndexY) {
		this._alive = alive;
		this._arrIndexX = arrIndexX;
		this._arrIndexY = arrIndexY;
	}

	get alive() { return this._alive; }
	set alive(alive) {
		this._alive = alive;
		this.draw();
	}

	get arrIndexX() { return this._arrIndexX; }
	get arrIndexY() { return this._arrIndexY; }

	draw() {
		if (this._alive == true) {
			ctx.fillStyle = "red";
		} else {
			ctx.fillStyle = "black";
		}
		ctx.fillRect((this._arrIndexX * CELL_WIDTH), (this._arrIndexY * CELL_HEIGHT), CELL_WIDTH, CELL_HEIGHT);
	}
}


/////////////////////GLOBAL VARS/////////////////////
var previousCells = generateDiedCells();
var currentCells = generateDiedCells();

var mousedown = false;
var animate = false;

var FPS = document.getElementById("input_FPS").value ? document.getElementById("input_FPS").value : DEFAULT_FPS;


/////////////////////GLOBAL FUNCS/////////////////////
function clearCanvas() {
	previousCells = generateDiedCells();
	currentCells = generateDiedCells();

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function aliveCells(clickPosX, clickPosY) {
	var canvasLeftEdge = canvas.offsetLeft + canvas.clientLeft;
	var canvasTopEdge = canvas.offsetTop + canvas.clientTop;

	clickCanvasPosX = clickPosX - canvasLeftEdge;
	clickCanvasPosY = clickPosY - canvasTopEdge;

	if (((clickCanvasPosX >= 0) && (clickCanvasPosX < CANVAS_WIDTH)) && (clickCanvasPosY >= 0) && (clickCanvasPosY < CANVAS_HEIGHT)) {

		var indexOfCellClicked_x = Math.trunc(clickCanvasPosX / CELL_WIDTH);
		var indexOfCellClicked_y = Math.trunc(clickCanvasPosY / CELL_HEIGHT);

		currentCells[indexOfCellClicked_x][indexOfCellClicked_y].alive = true;
	}
}

function generateDiedCells() {
	var cells = new Array(N_COLUMNS); // create a single dimensional array with no.of rows...
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(N_ROWS); // create a single dimensional array with no.of columns, and assign it to each
		// each element of the SDA, created above, to create a DDA, in which cells[i][j] represents cell at row 'i' and column 'j'
	}

	for (var i = 0; i < N_COLUMNS; i++) {
		for (var j = 0; j < N_ROWS; j++) {
			cells[i][j] = new Cell(false, i, j);
		}
	}
	return cells;
}

function getNumberOfAliveNeighbours(cell) {
	var result = 0;
	for (var i = (cell.arrIndexX - 1); i <= (cell.arrIndexX + 1); i++) {
		for (var j = (cell.arrIndexY - 1); j <= (cell.arrIndexY + 1); j++) {
			var x = i,  y = j;

			/*wrap around*/
			if (i == -1) x = N_ROWS - 1;
			if (i == N_ROWS) x = 0;
			if (j == -1) y = N_COLUMNS - 1;
			if (j == N_COLUMNS) y = 0;
			/**/

			if (currentCells[x][y].alive) result += 1;
		}
	}
	return result;
}

function update() {
	if (animate) {
		// I am ignoring all possible fatal errors...
		deepCopyDDA(currentCells, previousCells);	// want a much more efficient way...

		for (var i = 0; i < previousCells.length; i++) {
			for (var j = 0; j < previousCells[0].length; j++) {
				var nAlive = getNumberOfAliveNeighbours(previousCells[i][j]);
				if (previousCells[i][j].alive) {
					if (nAlive < 2) currentCells[i][j].alive = false;
					else if (nAlive <= 3) currentCells[i][j].alive = true;
					else currentCells[i][j].alive = false;
				} else {
					if (nAlive == 3) currentCells[i][j].alive = true;
					else currentCells[i][j].alive = false;
				}
				currentCells[i][j].draw();
			}
		}
	}
}

function startAnimation() {
	animate = true;
	window.setInterval(update, 1000/FPS);
}

function deepCopyDDA(DDA_source, DDA_dest) {
	// I am ignoring all possible fatal errors...
	for (var i = 0; i < DDA_source.length; i++) {
		for (var j = 0; j < DDA_source[0].length; j++) {
			DDA_dest[i][j] = DDA_source[i][j];
		}
	}
}





/////////////////////<SUGGEST A LABEL HERE...>/////////////////////
clearCanvas();

var btn_start = document.getElementById('button_start');
var btn_stop = document.getElementById('button_stop');
var btn_clear_reset = document.getElementById('button_clear_reset');

canvas.addEventListener('mouseout', function(event) { mousedown = false; }, false);
canvas.addEventListener('mousedown', function(event) { mousedown = true; aliveCells(event.pageX, event.pageY); }, false);
canvas.addEventListener('mousemove', function(event) { if (mousedown) aliveCells(event.pageX, event.pageY); }, false);
canvas.addEventListener('mouseup', function(event) { mousedown = false }, false);

// works for both mobile and pc
btn_start.addEventListener('click', function(event) { startAnimation(); }, false);
btn_stop.addEventListener('click', function(event) { animate = false; }, false);
btn_clear_reset.addEventListener('click', function(event) { clearCanvas(); }, false);

// for mobile devices
canvas.addEventListener('touchcancel', function(event) { mousedown = false; }, false);
canvas.addEventListener('touchstart', function(event) { mousedown = true; aliveCells(event.touches[0].pageX, event.touches[0].pageY); }, false);
canvas.addEventListener('touchmove', function(event) { if (mousedown) aliveCells(event.touches[0].pageX, event.touches[0].pageY); }, false);
canvas.addEventListener('touchend', function(event) { mousedown = false; }, false);
