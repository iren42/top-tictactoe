function Gameboard()
{
    const size = 3;
    let board = [];

    for (let i = 0; i < size; i++)
    {
        board[i] = [];
        for (let j = 0; j < size; j++)
        {
            board[i].push(Cell());
        }
    }

    const getSize = () => size;

    const getBoard = () => board;

    const printBoard = () =>
    {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    const isEmptyCell = (row, col) =>
    {
        if (!(row < size && row >= 0 && col < size && col >= 0))
            return (false);
        if (board[row][col].getValue() === 0)
            return (true);
        return (false);
    }

    const addToken = (row, col, player) =>
    {
        board[row][col].addToken(player);
    }

    const threeTokensInRow = (row) =>
    {
        if (board[row][0].getValue() === 0)
            return (false);
        let token = board[row][0];
        for (let i = 1; i < size; i++)
        {
            // console.log(token.getValue() + " " + board[row][i].getValue());
            if (token.getValue() != board[row][i].getValue())
                return (false);
        }
        return (true);
    }

    const threeTokensInCol = (col) =>
    {
        if (board[0][col].getValue() === 0)
            return (false);
        let token = board[0][col];
        for (let i = 1; i < size; i++)
        {
            if (token.getValue() != board[i][col].getValue())
                return (false);
        }
        return (true);
    }

    const threeInDiagTopLeft = () =>
    {
        if (board[0][0].getValue() === 0)
            return (false);
        let token = board[0][0];
        for (let i = 1; i < size; i++)
        {
            if (token.getValue() != board[i][i].getValue())
                return (false);
        }
        return (true);
    }

    const threeInDiagTopRight= () =>
    {
        if (board[0][size - 1].getValue() === 0)
            return (false);
        let token = board[0][size - 1];
        for (let i = 1; i < size; i++)
        {
            if (token.getValue() != board[i][size - 1 - i].getValue())
                return (false);
        }
        return (true);
    }

    return { getBoard, isEmptyCell, addToken, printBoard, threeTokensInRow, threeTokensInCol, threeInDiagTopLeft, threeInDiagTopRight, getSize };
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

    let currentPlayer = player1;

    const switchPlayer = () =>
    {
        if (currentPlayer === player1)
            currentPlayer = player2;
        else
            currentPlayer = player1;
    }

    const playRound = (row, col) =>
    {
        console.log("Current player is " + currentPlayer.token);
        if (board.isEmptyCell(row, col))
        {
            console.log("Player (" + currentPlayer.token + ") placed its token at [" + row + ", " + col + "]");
            board.addToken(row, col, currentPlayer.token);
            isGameOver();
            switchPlayer();
        }
        else
        {
            console.log("Player (" + currentPlayer.token + ") could not place its token at [" + row + ", " + col + "]");
        }
    }

    const isGameOver = () =>
    {
        board.printBoard();
        for (let i = 0; i < board.getSize(); i++)
        {
            if (board.threeTokensInCol(i) || board.threeTokensInRow(i))
            {
                announceWinner();
                return (true);
            }
        }
        if (board.threeInDiagTopLeft() || board.threeInDiagTopRight())
        {
            announceWinner();
            return (true);
        }
        return (false);
    }

    const announceWinner = () =>
    {
        console.log("Game is over. Player " + currentPlayer.token + " '" + currentPlayer.name + "' wins");
    }

    const showBoard = () => board.printBoard();
    // row
    // playRound(0, 0);
    // playRound(1, 0);
    // playRound(0, 1);
    // playRound(1, 1);
    // playRound(0, 2);

    // col
    // playRound(0, 0);
    // playRound(1, 1);
    // playRound(1, 0);
    // playRound(1, 2);
    // playRound(2, 0);

    // diag 
    playRound(0, 0);
    playRound(0, 1);
    playRound(1, 1);
    playRound(1, 2);
    playRound(2, 2);
    return ({ showBoard })
}

function Player(name, token)
{
    return ({ name, token });
}

const game = GameController();