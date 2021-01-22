#include <iostream>
#define N 3
#define X 'X'
//defines X for x
#define O 'O'
//defines O for o
#define E 'E'
//defines E for Empty//
int count = 0;
bool isFull(char grid[N][N]);                       // is the local board full?
bool solveUTTT(int LockX, int LockY, bool Locked);  //our recursive function
void switchPlayer();                                //self explanatory
char checkGlobalWinner();                           //checks if there is a global winner
char player;                                        //turn of player
char previousPlayer;
void printGlobal();  //prints the whole game
void firstEntry();
bool firstWin(int LockX, int LockY, bool Locked);  //works only on the first call of the algorithm.
bool firstTenWins(int LockX, int LockY, bool Locked);
class GlobalBoard {
   public:
    char winner = E;  //records the winner of each local grid seperately
    void checkWin()   //checks the winner for the local board
    {
        if (winner != E)  //if the winner isn't E, then it won before, dont change the previous winner.
        {
            return;
        }
        if ((((localBoard[0][0] == localBoard[1][1]) && (localBoard[1][1] == localBoard[2][2])) ||
             ((localBoard[0][2] == localBoard[1][1]) && (localBoard[1][1] == localBoard[2][0]))) &&
            (localBoard[1][1] != E)) {
            winner = localBoard[1][1];  // records the winner from diagonals
            return;
        }

        for (int i = 0; i < N; i++) {
            if ((localBoard[i][0] == localBoard[i][1]) && (localBoard[i][1] == localBoard[i][2]) && (localBoard[i][1] != E)) {
                winner = localBoard[i][1];  //records the winner from rows
                return;
            }
        }
        for (int i = 0; i < N; i++) {
            if ((localBoard[0][i] == localBoard[1][i]) && (localBoard[1][i] == localBoard[2][i]) && (localBoard[1][i] != E)) {
                winner = localBoard[1][i];  //records the winner from columns
                return;
            }
        }

        winner = E;  // no one won? keep winner as E for Empty
        return;
    }
    char localBoard[3][3] =
        {X, O, X,
         O, E, O,
         X, O, X};    // the class has a local board 3 by 3
} globalBoard[3][3];  //we make an object of this class also with the size of 3 by 3, which means we have 9 objects of this array (so 9 local grids)

int main() {
    globalBoard[1][1].localBoard[1][1] = X;
    player = O;                  // start with player X or O
    for (int i = 0; i < N; i++)  //checks for an already won board in case we give a template with a winner.
    {
        for (int j = 0; j < N; j++) {
            globalBoard[i][j].checkWin();
        }
    }
    int choice;
    std::cout << "Enter 1 to find all solutions\n"
              << "Enter 2 to find only the first solution\n"
              << "Enter 3 to find the first 10 solutions\n";

    while (choice > 3 || choice < 0) {
        std::cout << "Please enter a valid choice : ";
        std::cin >> choice;
    }
    switch (choice) {
        case 1:
            solveUTTT(0, 0, false);           //first call of the function
            std::cout << count << std::endl;  //print out the number of wins
            break;

        case 2:
            firstWin(0, 0, false);
            std::cout << "Winner is " << previousPlayer << std::endl;  //print out the number of wins
            std::cout << count << std::endl;                           //print out the number of wins
            break;
        case 3:
            firstTenWins(0, 0, false);
            std::cout << count << std::endl;  //print out the number of wins
            break;
    }
}

char checkGlobalWinner()  //checks for a global winner
{
    if ((((globalBoard[0][0].winner == globalBoard[1][1].winner) && (globalBoard[1][1].winner == globalBoard[2][2].winner)) ||
         ((globalBoard[0][2].winner == globalBoard[1][1].winner) && (globalBoard[1][1].winner == globalBoard[2][0].winner)))) {
        if (globalBoard[1][1].winner != E)  // if there's a winner and the winner is not E
        {
            // std::cout << globalBoard[1][1].winner; //uncomment to print the winning player
            return globalBoard[1][1].winner;  //returns winning player
        }
    }

    for (int i = 0; i < N; i++)  //same but for rows
    {
        if ((globalBoard[i][0].winner == globalBoard[i][1].winner) &&
            (globalBoard[i][1].winner == globalBoard[i][2].winner)) {
            if (globalBoard[i][1].winner != E) {
                // std::cout << globalBoard[i][1].winner;

                return globalBoard[i][1].winner;
            }
        }
    }
    for (int i = 0; i < N; i++)  //same but for columns
    {
        if ((globalBoard[0][i].winner == globalBoard[1][i].winner) &&
            (globalBoard[1][i].winner == globalBoard[2][i].winner)) {
            if (globalBoard[1][i].winner != E) {
                // std::cout << globalBoard[1][i].winner;
                return globalBoard[1][i].winner;
            }
        }
    }
    return E;  //no winner? return E for empty
}  //big O is n
void switchPlayer()  //self explanatory
{
    previousPlayer = player;
    if (player == X) {
        player = O;
    } else {
        player = X;
    }
}

bool solveUTTT(int LockX, int LockY, bool Locked)  //LockX and LockY are coordinates for which board the turn is locked to,
{                                                  // Locked true or false. false for the first turn where you can choose a board to play in
                                                   // Every other time, it will be true
    if (checkGlobalWinner() != E)                  // has anyone won yet?
    {
        count++;  //increase winner count
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard))  //is the localBoard you got sent to full? Choosing a new board recursivly
    {
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                if (!isFull(globalBoard[i][j].localBoard))  //checks for a local board with an empty cell
                {
                    solveUTTT(i, j, true);  // resume the algorithm after you found a board with an empty cell
                }
        return false;  //couldn't find a board with an empty cell, return false to stop the current recursion
    }

    if (Locked)  //are you locked to a certain board?
    {
        bool found = 0;  //will explain later down below
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E)  //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    switchPlayer();                                       //switch turns
                    if ((globalBoard[LockX][LockY].winner == E))          //is the winner of this board still Empty? if so, then enter
                    {
                        globalBoard[LockX][LockY].checkWin();         //checks for a winner, and makes globalBoard[LockX][LockY].winner equal to the winner
                        if ((globalBoard[LockX][LockY].winner != E))  //is the winner not E anymore? this means now you have a winner
                        {
                            found = 1;  //makes this true for backtracking later in line 172
                        }
                    }
                    solveUTTT(i, j, true);                           //call the function again , but now the LockX LockY coordinates are the new board
                                                                     //^ if you played in i = 1, j = 2, you are now in board LockX = 1, LockY = 2, for example
                    globalBoard[LockX][LockY].localBoard[i][j] = E;  // backtrack where you played after you're done with line 164 recursion
                    if (found == 1)                                  //in the same recursive entry, if line 162 was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;  // make it E again
                    }
                    switchPlayer();  // we switched player before calling the function, so we are Backtracking it
                }
            }
        }
    } else  // first entry only, where the player is not locked to any board, the rest of the code is the same as above
    {
        firstEntry();
    }

    return false;
}

bool firstWin(int LockX, int LockY, bool Locked) {
    if (checkGlobalWinner() != E)  // has anyone won yet?
    {
        printGlobal();
        count++;  //increase winner count
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard))  //is the localBoard you got sent to full? Choosing a new board recursivly
    {
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
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
        bool found = 0;  //will explain later down below
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E)  //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    switchPlayer();                                       //switch turns
                    if ((globalBoard[LockX][LockY].winner == E))          //is the winner of this board still Empty? if so, then enter
                    {
                        globalBoard[LockX][LockY].checkWin();         //checks for a winner, and makes globalBoard[LockX][LockY].winner equal to the winner
                        if ((globalBoard[LockX][LockY].winner != E))  //is the winner not E anymore? this means now you have a winner
                        {
                            found = 1;  //makes this true for backtracking later in line 172
                        }
                    }
                    if (firstWin(i, j, true)) {
                        return true;
                    }                                                //call the function again , but now the LockX LockY coordinates are the new board
                                                                     //^ if you played in i = 1, j = 2, you are now in board LockX = 1, LockY = 2, for example
                    globalBoard[LockX][LockY].localBoard[i][j] = E;  // backtrack where you played after you're done with line 164 recursion
                    if (found == 1)                                  //in the same recursive entry, if line 162 was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;  // make it E again
                    }
                    switchPlayer();  // we switched player before calling the function, so we are Backtracking it
                }
            }
        }
    } else  // first entry only, where the player is not locked to any board, the rest of the code is the same as above
    {
        bool found = 0;
        for (int k = 0; k < N; k++)
            for (int f = 0; f < N; f++)
                for (int i = 0; i < N; i++) {
                    for (int j = 0; j < N; j++) {
                        if (globalBoard[k][f].localBoard[i][j] == E) {
                            globalBoard[k][f].localBoard[i][j] = player;
                            switchPlayer();
                            if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                                globalBoard[k][f].checkWin();
                                if ((globalBoard[k][f].winner != E)) {
                                    found = 1;
                                }
                            }
                            // std::cout << " i played at " << i << j << std::endl;
                            if (firstWin(i, j, true)) {
                                return true;
                            }
                            globalBoard[k][f].localBoard[i][j] = E;
                            if (found == 1) {  //in the same recursive entry, if last condition was true, backtrack it.
                                globalBoard[k][f].winner = E;
                            }
                            switchPlayer();
                        }
                    }
                }
    }

    return false;
}
void firstEntry() {
    bool found = 0;
    for (int k = 0; k < N; k++)
        for (int f = 0; f < N; f++)
            for (int i = 0; i < N; i++) {
                for (int j = 0; j < N; j++) {
                    if (globalBoard[k][f].localBoard[i][j] == E) {
                        globalBoard[k][f].localBoard[i][j] = player;
                        switchPlayer();
                        if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                            globalBoard[k][f].checkWin();
                            if ((globalBoard[k][f].winner != E)) {
                                found = 1;
                            }
                        }
                        // std::cout << " i played at " << i << j << std::endl;
                        solveUTTT(i, j, true);
                        globalBoard[k][f].localBoard[i][j] = E;
                        if (found == 1) {  //in the same recursive entry, if last condition was true, backtrack it.
                            globalBoard[k][f].winner = E;
                        }
                        switchPlayer();
                    }
                }
            }
}

bool isFull(char grid[N][N]) {
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            if (grid[i][j] == E)  //finds an empty cell in the grid
                return false;     //it is not empty

    return true;  //it is empty
}

void printGlobal() {
    int countPrint = 0;
    for (int k = 0; k < N; k++) {
        for (int s = 0; s < N; s++) {
            for (int i = 0; i < N; i++) {
                if (i == N && countPrint < (N * N)) {
                    countPrint++;
                    i = 0;
                    continue;
                }
                for (int j = 0; j < N; j++) {
                    std::cout << globalBoard[k][i].localBoard[s][j];
                }
                std::cout << "  ";
            }
            std::cout << "\n";
        }
        std::cout << "\n";
    }
    std::cout << "--------------------------\n";
}

bool firstTenWins(int LockX, int LockY, bool Locked) {
    if (checkGlobalWinner() != E)  // has anyone won yet?
    {
        std::cout << "Winner is : " << previousPlayer << "\n";
        printGlobal();
        count++;  //increase winner count
        return true;
    }
    if (isFull(globalBoard[LockX][LockY].localBoard))  //is the localBoard you got sent to full? Choosing a new board recursivly
    {
        for (int i = 0; i < N; i++)
            for (int j = 0; j < N; j++)
                if (!isFull(globalBoard[i][j].localBoard))  //checks for a local board with an empty cell
                {
                    if (firstTenWins(i, j, true)) {
                        if (count > 9) {
                            return true;
                        }
                    }
                }
        return false;  //couldn't find a board with an empty cell, return false to stop the current recursion
    }

    if (Locked)  //are you locked to a certain board?
    {
        bool found = 0;  //will explain later down below
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < N; j++) {
                if (globalBoard[LockX][LockY].localBoard[i][j] == E)  //if spot is empty
                {
                    globalBoard[LockX][LockY].localBoard[i][j] = player;  //fill spot
                    switchPlayer();                                       //switch turns
                    if ((globalBoard[LockX][LockY].winner == E))          //is the winner of this board still Empty? if so, then enter
                    {
                        globalBoard[LockX][LockY].checkWin();         //checks for a winner, and makes globalBoard[LockX][LockY].winner equal to the winner
                        if ((globalBoard[LockX][LockY].winner != E))  //is the winner not E anymore? this means now you have a winner
                        {
                            found = 1;  //makes this true for backtracking later in line 172
                        }
                    }
                    if (firstTenWins(i, j, true)) {
                        if (count > 9) {
                            return true;
                        }
                    }                                                //call the function again , but now the LockX LockY coordinates are the new board
                                                                     //^ if you played in i = 1, j = 2, you are now in board LockX = 1, LockY = 2, for example
                    globalBoard[LockX][LockY].localBoard[i][j] = E;  // backtrack where you played after you're done with line 164 recursion
                    if (found == 1)                                  //in the same recursive entry, if line 162 was true, backtrack it.
                    {
                        globalBoard[LockX][LockY].winner = E;  // make it E again
                    }
                    switchPlayer();  // we switched player before calling the function, so we are Backtracking it
                }
            }
        }
    } else  // first entry only, where the player is not locked to any board, the rest of the code is the same as above
    {
        bool found = 0;
        for (int k = 0; k < N; k++)
            for (int f = 0; f < N; f++)
                for (int i = 0; i < N; i++) {
                    for (int j = 0; j < N; j++) {
                        if (globalBoard[k][f].localBoard[i][j] == E) {
                            globalBoard[k][f].localBoard[i][j] = player;
                            switchPlayer();
                            if ((globalBoard[k][f].winner == E)) {  // has it won before? if so, dont enter
                                globalBoard[k][f].checkWin();
                                if ((globalBoard[k][f].winner != E)) {
                                    found = 1;
                                }
                            }
                            // std::cout << " i played at " << i << j << std::endl;
                            if (firstTenWins(i, j, true)) {
                                if (count > 9) {
                                    return true;
                                }
                            }
                            globalBoard[k][f].localBoard[i][j] = E;
                            if (found == 1) {  //in the same recursive entry, if last condition was true, backtrack it.
                                globalBoard[k][f].winner = E;
                            }
                            switchPlayer();
                        }
                    }
                }
    }

    return false;
}