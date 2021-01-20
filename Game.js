//force document body to fill the screen
document.body.width = window.innerWidth;
document.body.height = window.innerHeight;

//inital game variables

var N = 3
var X = 'X'
var O = 'O'
var E = 'E'
var player = 'X';
var board_size = 0;
function delete_board() //this clears the board
{
    var e = document.getElementById('GameContainer');
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }
}


//visual dynamically create the game grid
function game_set() {
    input_type = false;
    //set game size to be dynamic
    do {
        board_size = parseInt(prompt("Please enter a number 1 or 3", "3"), 10);
    } while (isNaN(board_size) || board_size > 3 || board_size == 2 || board_size < 1);

    delete_board();
    //reset players
    player = 'X';
    document.getElementById("LBLplayerTurn").innerHTML = "Player ( X ) turn";
    /* need to check if board size is not empty and is number first */
    var Board_Container = document.getElementById('GameContainer');
    var TableId = 1;
    for (PIndex = 0; PIndex < board_size; PIndex++) {
        var TBL_P = document.createElement('span');
        Board_Container.appendChild(TBL_P);
        for (TBLIndex = 0; TBLIndex < board_size; TBLIndex++) {   //loop creates dynamic number of tables
            var TBL = document.createElement('table');
            TBL.setAttribute("value", TableId);
            TBL.setAttribute("id", "Table" + TableId++);
            var CellIndex = 1;
            TBL_P.appendChild(TBL);
            for (var j = 0; j < 3; j++) {   //loop creates 3 rows 
                var tbl_row = document.createElement('tr');
                TBL.appendChild(tbl_row);
                for (var i = 0; i < 3; i++) {   //loop creates 3 cells
                    var TData = document.createElement('td');
                    TData.setAttribute("onclick", "cell_click(this);");
                    TData.setAttribute("id", CellIndex++);
                    // var TypeHolder = document.createElement('span');
                    // TData.appendChild(TypeHolder);
                    tbl_row.appendChild(TData);
                }
            }
        }
    }
}


//visual
function cell_click(mycell) //on cell click insert X or O
{
    if (mycell.textContent == "") {
        playerNextMove(mycell);
    }
}

//visual
function playerNextMove(cell) 
{
    var label1 = document.getElementById("LBLplayerTurn");
    if (player === 'X') {
        //fill cell with current player
        cell.textContent = 'X';
        cell.style.color = '#E94F37';

        //set next player
        player = 'O';
        label1.innerHTML = "Player ( O ) turn";
    }
    else {
        cell.textContent = 'O';
        cell.style.color = '#F6F7EB';

        player = 'X';
        label1.innerHTML = "Player ( X ) turn";
    }
}



//*-------Algoritham start-------*//
var counter = 0;
var count = 0;

function assignSmallGameBoard() //take the Small XO board from Website  and create array
{
    smallBoard = new SmallBoard;
    var tableindex = 1;
    var current_Grid = document.getElementById('Table1');
    for (var i = 0; i < N; i++) 
    {
        for (var j = 0; j < N; j++) 
        {
            if (current_Grid.rows[i].cells[j].innerHTML == "")
                smallBoard.localBoard[i][j] = E;
            else
                smallBoard.localBoard[i][j] = current_Grid.rows[i].cells[j].innerHTML;
        }
    }
}
function assignGameBoard()  //take the Small XO board from Website  and create array
{
    globalBoard = [];

    for (var i = 0; i < 3; i++) {
        globalBoard[i] = [];
        for (var j = 0; j < 3; j++) {
            globalBoard[i][j] = new GlobalBoard;
        }
    }
    var tableindex = 1;
    for (var k = 0; k < N; k++) {
        for (var f = 0; f < N; f++) {
            var current_Grid = document.getElementById('Table' + tableindex++);
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    if (current_Grid.rows[i].cells[j].innerHTML == "")
                        globalBoard[k][f].localBoard[i][j] = E;
                    else
                        globalBoard[k][f].localBoard[i][j] = current_Grid.rows[i].cells[j].innerHTML;
                }
            }
        }
    }

    for (var i = 0; i < N; i++) //check for existing winners
    {
        for (var j = 0; j < N; j++) 
        {
             globalBoard[i][j].checkWin();
         }
    }
}

// function startGame() {
//     count = 0;
//     assignGameBoard(); //fill globalBoard values from the visual grids

//     for (var i = 0; i < N; i++) //check for existing winners
//     {
//         for (var j = 0; j < N; j++) {
//             globalBoard[i][j].checkWin();
//         }
//     }

//     solveUTTT(0, 0, false); //find all solutions
//     console.log(count); //log the count
// }

class GlobalBoard {
    constructor() {
        this.winner = E; // Winner is 'E'mpty;
        this.localBoard =
            [[X, O, X],
            [O, E, O],
            [X, O, X]];
    }

    checkWin() {  //check win locally
        if (this.winner != E) {
            return;
        }
        if ((((this.localBoard[0][0] == this.localBoard[1][1]) && (this.localBoard[1][1] == this.localBoard[2][2]))
            || ((this.localBoard[0][2] == this.localBoard[1][1]) && (this.localBoard[1][1] == this.localBoard[2][0])))
            && (this.localBoard[1][1] != E)
        ) {
            this.winner = this.localBoard[1][1];
            return;
        }
        var i;
        for (i = 0; i < N; i++) {
            if ((this.localBoard[i][0] == this.localBoard[i][1]) && (this.localBoard[i][1] == this.localBoard[i][2]) && (this.localBoard[i][1] != E)) {

                this.winner = this.localBoard[i][1];
                return;
            }
        }
        for (i = 0; i < N; i++) {
            if ((this.localBoard[0][i] == this.localBoard[1][i]) && (this.localBoard[1][i] == this.localBoard[2][i]) && (this.localBoard[1][i] != E)) {

                this.winner = this.localBoard[1][i];
                return;
            }
        }
        this.winner = E;
        return;
    }
}
var globalBoard = [];

class SmallBoard {
    constructor() {
        this.winner = E; // Winner is 'E'mpty;
        this.localBoard =
            [[X, O, X],
            [O, E, O],
            [X, O, X]];
    }

    checkWin() {  //check win locally
        // if (this.winner != E) {
        //     return;
        // }
        if ((((this.localBoard[0][0] == this.localBoard[1][1]) && (this.localBoard[1][1] == this.localBoard[2][2]))
            || ((this.localBoard[0][2] == this.localBoard[1][1]) && (this.localBoard[1][1] == this.localBoard[2][0])))
            && (this.localBoard[1][1] != E)
        ) {
            this.winner = this.localBoard[1][1];
            return;
        }
        var i;
        for (i = 0; i < N; i++) {
            if ((this.localBoard[i][0] == this.localBoard[i][1]) && (this.localBoard[i][1] == this.localBoard[i][2]) && (this.localBoard[i][1] != E)) {

                this.winner = this.localBoard[i][1];
                return;
            }
        }
        for (i = 0; i < N; i++) {
            if ((this.localBoard[0][i] == this.localBoard[1][i]) && (this.localBoard[1][i] == this.localBoard[2][i]) && (this.localBoard[1][i] != E)) {

                this.winner = this.localBoard[1][i];
                return;
            }
        }
        this.winner = E;
        return;
    }
}
var smallBoard;

function checkGlobalWinner() {
    if ((((globalBoard[0][0].winner == globalBoard[1][1].winner) && (globalBoard[1][1].winner == globalBoard[2][2].winner)) ||
        ((globalBoard[0][2].winner == globalBoard[1][1].winner) && (globalBoard[1][1].winner == globalBoard[2][0].winner)))) {
        if (globalBoard[1][1].winner != E) {
            count++;
            return globalBoard[1][1].winner;
        }
    }
    var i;
    for (i = 0; i < N; i++) {
        if ((globalBoard[i][0].winner == globalBoard[i][1].winner) &&
            (globalBoard[i][1].winner == globalBoard[i][2].winner)) {
            if (globalBoard[i][1].winner != E) {
                count++;
                return globalBoard[i][1].winner;
            }
        }
    }
    for (i = 0; i < N; i++) {
        if ((globalBoard[0][i].winner == globalBoard[1][i].winner) &&
            (globalBoard[1][i].winner == globalBoard[2][i].winner)) {
            if (globalBoard[1][i].winner != E) {
                count++;
                return globalBoard[1][i].winner;
            }
        }
    }
    return E;
}

function switchPlayer() {
    if (player == X) {
        player = O;
    }
    else {
        player = X;
    }
}

function solveUTTT(LockX, LockY, Locked) {
    var i, j, k, f;
    var someonewon = checkGlobalWinner();
    if (someonewon != E) {
        drawWinner(someonewon);
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard)) {
        for (i = 0; i < N; i++)
            for (j = 0; j < N; j++)
                if (!isFull(globalBoard[i][j].localBoard)) {
                    solveUTTT(i, j, true);
                }
        return false;
    }

    if (Locked) {
        found = false; //local variables to check if the current passed grid is a winner or not
        for (i = 0; i < N; i++) {
            for (j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E) //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    printglobal();
                    switchPlayer();
                    if ((globalBoard[LockX][LockY].winner == E))  // if grid has not won before then enter
                    {
                        globalBoard[LockX][LockY].checkWin();
                        if ((globalBoard[LockX][LockY].winner != E)) {
                            found = 1;
                        }
                    }
                    solveUTTT(i, j, true);
                    globalBoard[LockX][LockY].localBoard[i][j] = E;
                    if (found == 1) //in the same recursive entry, if last condition was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;
                    }
                    switchPlayer();
                }
            }
        }
    }
    else {
        found = false;
        for (k = 0; k < N; k++)
            for (f = 0; f < N; f++)
                for (i = 0; i < N; i++) {
                    for (j = 0; j < N; j++) {
                        if (globalBoard[k][f].localBoard[i][j] == 'E') {
                            globalBoard[k][f].localBoard[i][j] = player;
                            printglobal();
                            switchPlayer();
                            if ((globalBoard[k][f].winner == E)) // if grid has not won before then enter
                            {
                                globalBoard[k][f].checkWin();
                                if ((globalBoard[k][f].winner != E)) {
                                    found = 1;
                                }
                            }
                            solveUTTT(i, j, true);
                            globalBoard[k][f].localBoard[i][j] = E;
                            if (found == 1) //in the same recursive entry, if last condition was true, backtrack it.
                            {
                                globalBoard[k][f].winner = E;
                            }
                            switchPlayer();
                        }
                    }
                }
    }
    return false;
}

function isFull(grid) {
    for (var i = 0; i < 3; i++)
        for (var j = 0; j < 3; j++)
            if (grid[i][j] == E)
                return false;

    return true;
}
//*-------Algoritham END-------*//

//*-------Drawing Start-------*//
var canvas = document.getElementById("resultsCanvas");
canvas.width = window.innerWidth;
canvas.height = 10000;

var ctx = canvas.getContext("2d");

var GameContainer = document.getElementById('GameContainer'); 
GameContainer.width = window.innerWidth;

var drawingX = 10;
var drawingY = 10;
var drawingCount = 0;

function resetCanvas()
{
   // canvas.width = window.innerWidth;
   // canvas.height = 10000;
    ctx.clearRect(0,0,window.innerWidth,10000);
    drawingX = 10;
    drawingY = 10;
    drawingCount = 0; 
    count = 0;
    counter = 0;
}

function drawX(x, y) 
{
    ctx.beginPath();
    ctx.strokeStyle = '#E94F37';

    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
}

function drawO(X, Y)
{
    ctx.strokeStyle = '#F6F7EB';
    ctx.beginPath();
    ctx.arc(X, Y, 10, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawE(X, Y)
{
    ctx.strokeStyle = "black";
    ctx.strokeRect(X-10, Y-10, 20, 20);
}

function drawNumber()
{
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "green";
    ctx.fillText("Solution "+(drawingCount+1), drawingX+100, drawingY+80);
}

function drawWinner(winner)
{
    if (winner == "O")
    {
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
    }
    else
    {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = "red";
    }
    ctx.font = "30px Comic Sans MS";
    ctx.fillText(winner+" Has Won", drawingX+270, drawingY+80);
}

function drawBoard(X,Y)
{
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;

    ctx.moveTo(X + 210, Y+90);
    ctx.lineTo(X + 210, Y+450);
    
    ctx.moveTo(X + 330, Y+90);
    ctx.lineTo(X + 330, Y+450);

    ctx.moveTo(X + 90,   Y+210);
    ctx.lineTo(X + 450, Y+210);

    ctx.moveTo(X + 90, Y+330);
    ctx.lineTo(X + 450, Y+330);

    ctx.stroke();
}

function printglobal()
{
    drawNumber();
    var Spacing = 30;
    var gridX = 0;
    var gridY = drawingY;
    var starterX = 0; 
    var starterY = 0;

    drawBoard(drawingX,drawingY);

     for (var k = 0; k < N; k++) 
     {
        gridY += (Spacing * 4);
        gridX = drawingX;
         for (var s = 0; s < N; s++) 
         {
            gridX += (Spacing * 4);
            starterX = gridX;
            starterY = gridY;
            for (var i = 0; i < 3; i++) 
            {
                for (var j = 0; j < 3; j++)
                { 
                    if (globalBoard[k][s].localBoard[i][j] == "O")
                    {
                        drawO(starterX,starterY);
                    }
                    else if (globalBoard[k][s].localBoard[i][j] == "X")
                    {
                        drawX(starterX,starterY);
                    }
                    else
                    {
                        drawE(starterX,starterY);
                    }

                    starterX = starterX+30;  
                }
                starterX = gridX;
                starterY += 30;
            }
         }
     }
     drawingCount++;
     if (drawingCount % 3 == 0)
     {
        drawingY += 400;
       // canvas.height += 800;
        drawingX = 10;
     }
     else
     {
        drawingX += 400;
     }
}

function printsmall()
{
    if (smallBoard.winner == "O")
    {
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
    }
    else
    {
        ctx.strokeStyle = 'red';
        ctx.fillStyle = "red";
    }
    ctx.font = "20px Comic Sans MS";
    ctx.fillText(smallBoard.winner+" Has Won", drawingX+90, drawingY+20);

    var Spacing = 30;
    var gridX = drawingX+100;
    var gridY = drawingY+40;
    var starterX = 0; 
    var starterY = 0;

    //gridX += (Spacing * 4);
    starterX = gridX;
    starterY = gridY;
    for (var i = 0; i < 3; i++) 
    {
        for (var j = 0; j < 3; j++)
        { 
            
            if (smallBoard.localBoard[i][j] == "O")
            {
                drawO(starterX,starterY);
            }
            else if (smallBoard.localBoard[i][j] == "X")
            {
                drawX(starterX,starterY);
            }
            else
            {
                drawE(starterX,starterY);
            }

                starterX = starterX+30;  
            }
            starterX = gridX;
            starterY += 30;
            }
    drawingCount++;
     if (drawingCount % 8 == 0)
     {
        drawingY += 150;
        drawingX = 10;
     }
     else
     {
        drawingX += 150;
     }
}
//*-------Drawing END-------*//


//*-------lazy ULTiMATE XO functions to return results-------*//
function firstEntry()
{
    var found = false;
    for (var k = 0; k < N; k++)
        for (var f = 0; f < N; f++)
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    if (globalBoard[k][f].localBoard[i][j] == E) {
                        globalBoard[k][f].localBoard[i][j] = player;
                        switchPlayer();
                        if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                            globalBoard[k][f].checkWin();
                            if ((globalBoard[k][f].winner != E)) {
                                found = true;
                            }
                        }
                        // std::cout << " i played at " << i << j << std::endl;
                        solveUTTT(i, j, true);
                        globalBoard[k][f].localBoard[i][j] = E;
                        if (found == true) {  //in the same recursive entry, if last condition was true, backtrack it.
                            globalBoard[k][f].winner = E;
                        }
                        switchPlayer();
                    }
                }
            }
}


function firstTenWins(LockX, LockY, Locked) 
{
    var someonewon = checkGlobalWinner();
    if (someonewon != E)  // has anyone won yet?
    {
        drawWinner(someonewon);
        printglobal();
        counter++;  //increase winner count
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard))  //is the localBoard you got sent to full? Choosing a new board recursivly
    {
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++)
                if (!isFull(globalBoard[i][j].localBoard))  //checks for a local board with an empty cell
                {
                    if (firstTenWins(i, j, true)) 
                    {
                        if (counter > 9) 
                        {
                            console.log(counter);
                            return true;
                        }
                    }
                }
        return false;  //couldn't find a board with an empty cell, return false to stop the current recursion
    }

    if (Locked)  //are you locked to a certain board?
    {
        var found = false;  //will explain later down below
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E)  //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    switchPlayer();                                       //switch turns
                    if ((globalBoard[LockX][LockY].winner == E))          //is the winner of this board still Empty? if so, then enter
                    {
                        globalBoard[LockX][LockY].checkWin();         //checks for a winner, and makes globalBoard[LockX][LockY].winner equal to the winner
                        if ((globalBoard[LockX][LockY].winner != E))  //is the winner not E anymore? this means now you have a winner
                        {
                            found = true;  //makes this true for backtracking later in line 172
                        }
                    }
                    if (firstTenWins(i, j, true)) 
                    {
                        if (counter > 9) {
                            return true;
                        }
                    }                                                //call the function again , but now the LockX LockY coordinates are the new board
                                                                     //^ if you played in i = 1, j = 2, you are now in board LockX = 1, LockY = 2, for example
                    globalBoard[LockX][LockY].localBoard[i][j] = E;  // backtrack where you played after you're done with line 164 recursion
                    if (found == true)                                  //in the same recursive entry, if line 162 was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;  // make it E again
                    }
                    switchPlayer();  // we switched player before calling the function, so we are Backtracking it
                }
            }
        }
    } 
    else  // first entry only, where the player is not locked to any board, the rest of the code is the same as above
    {
        var found = false;
        for (var k = 0; k < N; k++)
            for (var f = 0; f < N; f++)
                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < N; j++) {
                        if (globalBoard[k][f].localBoard[i][j] == E) 
                        {
                            globalBoard[k][f].localBoard[i][j] = player;
                            switchPlayer();
                            if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                                globalBoard[k][f].checkWin();
                                if ((globalBoard[k][f].winner != E)) {
                                    found = true;
                                }
                            }
                            // std::cout << " i played at " << i << j << std::endl;
                            if (firstTenWins(i, j, true)) 
                            {
                                if (counter > 9) 
                                {
                                    return true;
                                }
                            }
                            globalBoard[k][f].localBoard[i][j] = E;
                            if (found == true) {  //in the same recursive entry, if last condition was true, backtrack it.
                                globalBoard[k][f].winner = E;
                            }
                            switchPlayer();
                        }
                    }
                }
    }
    return false;
}

function firstWin(LockX, LockY, Locked) 
{
    var someonewon = checkGlobalWinner();
    if (someonewon != E)  // has anyone won yet?
    {
        drawWinner(someonewon);
        printglobal();
        
        count++;  //increase winner count
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard))  //is the localBoard you got sent to full? Choosing a new board recursivly
    {
        for (var i = 0; i < N; i++)
            for (var j = 0; j < N; j++)
                if (!isFull(globalBoard[i][j].localBoard))  //checks for a local board with an empty cell
                {
                    if (firstWin(i, j, true)) {
                        return true;
                    }  // resume the algorithm after you found a board with an empty cell
                }
        return false;  //couldn't find a board with an empty cell, return false to stop the current recursion
    }

    if (Locked)  //are you locked to a certain board?
    {
        var found = false;  //will explain later down below
        for (var i = 0; i < N; i++) {
            for (var j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E)  //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    switchPlayer();                                       //switch turns
                    if ((globalBoard[LockX][LockY].winner == E))          //is the winner of this board still Empty? if so, then enter
                    {
                        globalBoard[LockX][LockY].checkWin();         //checks for a winner, and makes globalBoard[LockX][LockY].winner equal to the winner
                        if ((globalBoard[LockX][LockY].winner != E))  //is the winner not E anymore? this means now you have a winner
                        {
                            found = true;  //makes this true for backtracking later in line 172
                        }
                    }
                    if (firstWin(i, j, true)) {
                        return true;
                    }                                                //call the function again , but now the LockX LockY coordinates are the new board
                                                                     //^ if you played in i = 1, j = 2, you are now in board LockX = 1, LockY = 2, for example
                    globalBoard[LockX][LockY].localBoard[i][j] = E;  // backtrack where you played after you're done with line 164 recursion
                    if (found == true)                                  //in the same recursive entry, if line 162 was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;  // make it E again
                    }
                    switchPlayer();  // we switched player before calling the function, so we are Backtracking it
                }
            }
        }
    } else  // first entry only, where the player is not locked to any board, the rest of the code is the same as above
    {
        var found = false;
        for (var k = 0; k < N; k++)
            for (var f = 0; f < N; f++)
                for (var i = 0; i < N; i++) {
                    for (var j = 0; j < N; j++) {
                        if (globalBoard[k][f].localBoard[i][j] == E) 
                        {
                            globalBoard[k][f].localBoard[i][j] = player;
                            switchPlayer();
                            if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                                globalBoard[k][f].checkWin();
                                if ((globalBoard[k][f].winner != E)) {
                                    found = true;
                                }
                            }
                            // std::cout << " i played at " << i << j << std::endl;
                            if (firstWin(i, j, true)) 
                            {
                                return true;
                            }
                            globalBoard[k][f].localBoard[i][j] = E;
                            if (found == true) 
                            {  //in the same recursive entry, if last condition was true, backtrack it.
                                globalBoard[k][f].winner = E;
                            }
                            switchPlayer();
                        }
                    }
                }
    }
    return false;
}
//*-------end of lazy ULTIMATE XO functions to return results-------*//

//*-------lazy SMALL XO functions to return results-------*//
function firstWinnerSmall() 
{
    // allCount++; //for this count to work, comment the next if().
    smallBoard.checkWin();

    if (smallBoard.winner != E) 
    {
        printsmall();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        count++;
        return true;
    }

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (smallBoard.localBoard[i][j] == E)  // is cell empty ?
            {
                smallBoard.localBoard[i][j] = player;  //place player X or O
                //moveCount++;          //increase move count
                switchPlayer();       // self explanatory
                if (firstWinnerSmall()) 
                {
                    return true;
                }
                switchPlayer();
                smallBoard.localBoard[i][j] = E;
            }
        }
    }
    return false;  //return false if have not found a solution
}

function firstTenWinssmall() 
{
    // allCount++; //for this count to work, comment the next if().
    smallBoard.checkWin();

    if (smallBoard.winner != E) 
    {
        printsmall();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        count++;
        return true;
    }

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (smallBoard.localBoard[i][j] == E)  // is cell empty ?
            {
                smallBoard.localBoard[i][j] = player;  //place player X or O
                //moveCount++;          //increase move count
                switchPlayer();       // self explanatory
                if (firstWinnerSmall()) 
                {
                    if (count>9)
                        return true;
                }
                switchPlayer();
                smallBoard.localBoard[i][j] = E;
            }
        }
    }
    return false;  //return false if have not found a solution
}

function solveXO() 
{
    smallBoard.checkWin();

    if (smallBoard.winner != E) 
    {
        printsmall();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        count++;
        return true;
    }

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (smallBoard.localBoard[i][j] == E)  // is cell empty ?
            {
                smallBoard.localBoard[i][j] = player;  //place player X or O
                //moveCount++;          //increase move count
                //previous = player;    //record the previous player before switching
                switchPlayer();       // self explanatory
                // if (solveXO(grid)) {  //uncomment these lines
                //     return true;      //to find only the
                // }                     //first solution
                solveXO();  //recalls the function with the current grid after placing X or O

                switchPlayer();  //after exiting line 61, we are backtracking, so switch player again
                smallBoard.localBoard[i][j] = E;  //backtracking, make the same cell that was played empty again
            }
        }
    }

    return false;  //return false if have not found a solution
}
//*-------END OF lazy SMALL XO functions to return results-------*//