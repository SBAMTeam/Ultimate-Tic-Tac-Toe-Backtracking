#include <iostream>
#include <string>
#define E "E"
#define X "X"
#define O "O"
#define N 3

int count = 0;                             // counts all win solutions
int moveCount = 0;                         //counts all moves when there is a winning solution
int allCount = 0;                          // counts all moves regardless of winning.
void switchPlayer();                       //self explanatory
void print();                              // prints the current grid
bool solveXO(std::string grid[N][N]);      // backtracking algorithm
bool checkWinner(std::string grid[N][N]);  //checks if there is a winner in the grid

std::string localBoard[N][N] =
    {E, E, E,
     E, E, E,
     E, E, E};  // the grid
std::string player;
std::string previous = X;

void print() {
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            std::cout << localBoard[i][j];
        }
        std::cout << "\n";
    }
    std::cout << "\n";
    std::cout << "\n";
}

bool solveXO(std::string grid[N][N]) {
    // allCount++; //for this count to work, comment the next if().
    if (checkWinner(grid)) {
        //print();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        count++;

        return true;
    }
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (grid[i][j] == E)  // is cell empty ?
            {
                grid[i][j] = player;  //place player X or O
                moveCount++;          //increase move count
                previous = player;    //record the previous player before switching
                switchPlayer();       // self explanatory
                // if (solveXO(grid)) {  //uncomment these lines
                //     return true;      //to find only the
                // }                     //first solution
                solveXO(grid);  //recalls the function with the current grid after placing X or O

                switchPlayer();  //after exiting line 61, we are backtracking, so switch player again
                grid[i][j] = E;  //backtracking, make the same cell that was played empty again
            }
        }
    }

    return false;  //return false if have not found a solution
}

bool checkWinner(std::string grid[N][N])  //self explanatory
{
    if (

        (((localBoard[0][0] == localBoard[1][1]) && (localBoard[1][1] == localBoard[2][2])) ||
         (localBoard[0][2] == localBoard[1][1]) && (localBoard[1][1] == localBoard[2][0])) &&
        (localBoard[1][1] != E))  //checks for diagonals winning
    {
        return true;
    }
    for (int i = 0; i < N; i++)  //checks for rows and columns winning
        if (((grid[i][0] == grid[i][1]) && (grid[i][1] == grid[i][2]) && (grid[i][0] != E)) ||
            ((grid[0][i] == grid[1][i]) && (grid[1][i] == grid[2][i]) && (grid[0][i] != E))) {
            return true;
        }

    return false;  //no winner? return false
}

// void play(int x, int y)  //for a normal game, we used this function to place X and O
// {
//     localBoard[x][y] = player;
//     switchPlayer();
// }

void switchPlayer() {
    if (player == X) {
        player = O;
    } else {
        player = X;
    }
}  //self explanatory

bool firstWinner(std::string grid[N][N]) {
    // allCount++; //for this count to work, comment the next if().
    if (checkWinner(grid)) {
        print();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        std::cout << "Winner is " << previous << "!\n";
        count++;
        return true;
    }
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (grid[i][j] == E)  // is cell empty ?
            {
                grid[i][j] = player;  //place player X or O
                moveCount++;          //increase move count
                previous = player;    //record the previous player before switching
                switchPlayer();       // self explanatory
                if (firstWinner(grid)) {
                    return true;
                }
                switchPlayer();
                grid[i][j] = E;
            }
        }
    }

    return false;  //return false if have not found a solution
}

bool firstTenWins(std::string grid[N][N]) {
    // allCount++; //for this count to work, comment the next if().
    if (checkWinner(grid)) {
        print();  //put print() after ||grid[i][j] = player;|| near line 46 to print ALL steps
        count++;
        return true;
    }
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            if (grid[i][j] == E)  // is cell empty ?
            {
                grid[i][j] = player;  //place player X or O
                moveCount++;          //increase move count
                previous = player;    //record the previous player before switching
                switchPlayer();       // self explanatory
                if (firstTenWins(grid)) {
                    if (count > 9)
                        return true;
                }
                switchPlayer();
                grid[i][j] = E;
            }
        }
    }

    return false;  //return false if have not found a solution
}
int main(int argc, char *argv[]) {
    player = O;
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
            if (solveXO(localBoard))  //if calling the function returns a winner on the first entry, when entering an already won board.
            {
                std::cout << "Winner is : " << previous << "\n";
            } else {
                std::cout << "The number of solutions found is : " << count << "\n";  //number of solutions
                std::cout << "The number of moves is : " << moveCount << "\n";        //number of moves

                // std::cout << "The number of moves is : " << allCount << "\n"; //to find count of all moves, remove the win condition from line 37 to 41
            }
            break;

        case 2:
            firstWinner(localBoard);
            std::cout << "The number of moves is : " << moveCount << "\n";  //number of moves

            break;
        case 3:
            firstTenWins(localBoard);
            std::cout << "The number of moves is : " << moveCount << "\n";  //number of moves
            break;
    }
}
