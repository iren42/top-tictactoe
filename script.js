function Gameboard()
{
    let rows = 3;
    let cols = 3;
    let board = [];

    for (let i = 0; i < rows; i++)
    {
        board[i] = [];
        for (let j = 0; j < cols; j++)
        {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () =>
    {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const isEmptyCell = (row, col) =>
    {
        if (board[row][col].getValue() === 0)
            return (true);
        return (false);
    }

    const addToken = (row, col, player) =>
    {
        board[row][col].addToken(player);
    }

    return { getBoard, isEmptyCell, addToken, printBoard };
}

function Cell()
{
    let value = 0;

    const addToken = (player) =>
    {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController()
{
    const board = Gameboard();

    const player1 = Player("J", 1);
    const player2 = Player("A", 2);

    let currentPlayer = player1.token;

    const switchPlayer = () =>
    {
        if (currentPlayer === player1.token)
            currentPlayer = player2.token;
        else
            currentPlayer = player1.token;
    }

    const playRound = (row, col) =>
    {
        console.log("Current player is " + currentPlayer);
        if (board.isEmptyCell(row, col))
        {
            console.log("Player (" + currentPlayer + ") placed its token at [" + row + ", " + col + "]");
            board.addToken(row, col, currentPlayer);
            switchPlayer();
        }
        else
        {
            console.log("Player (" + currentPlayer + ") could not place its token at [" + row + ", " + col + "]");
        }

    }

    const   showBoard = () => board.printBoard();
    playRound(0, 0);
    playRound(0, 0);
    playRound(1, 0);

    return ({showBoard})
}

function Player(name, token)
{
    return ({ name, token });
}

const game = GameController();