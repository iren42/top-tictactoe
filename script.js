"use strict";

const player1 = PlayerFactory("J", 1);
const player2 = PlayerFactory("A", 2);
const notPlayer = PlayerFactory("", 0);

const board = (function ()
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
        if (board[row][col].getValue() !== 0)
            return (false);
        return (true);
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

    const threeInDiagTopRight = () =>
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

    const clear = () =>
    {
        for (let i = 0; i < size; i++)
        {
            for (let j = 0; j < size; j++)
            {
                board[i][j].addToken(0);
            }
        }
    }

    const hasTokensEverywhere = () =>
    {
        for (let i = 0; i < size; i++)
        {
            for (let j = 0; j < size; j++)
            {
                if (board[i][j].getValue() === 0)
                    return (false);
            }
        }
        return (true);
    }

    return ({
        getBoard,
        clear,
        isEmptyCell,
        addToken,
        printBoard,
        threeTokensInRow,
        threeTokensInCol,
        threeInDiagTopLeft,
        threeInDiagTopRight,
        getSize,
        hasTokensEverywhere
    });
})();

function Cell()
{
    let value = 0;

    const addToken = (player) =>
    {
        value = player;
    };

    const getValue = () => value;

    return ({
        addToken,
        getValue
    });
}

const game = (function ()
{
    let activePlayer = player1;
    let isRunning = true;
    let winningPlayer = notPlayer;

    const switchPlayer = () =>
    {
        if (activePlayer === player1)
            activePlayer = player2;
        else
            activePlayer = player1;
    }

    const playRound = (row, col) =>
    {
        if (!isRunning)
            return;
        console.log("active player is " + activePlayer.getToken());
        if (!board.isEmptyCell(row, col))
        {
            console.log("Player (" + activePlayer.getToken() + ") could not place its token at [" + row + ", " + col + "]");
            return;
        }
        console.log("Player (" + activePlayer.getToken() + ") placed its token at [" + row + ", " + col + "]");
        board.addToken(row, col, activePlayer.getToken());
        if (isGameOver())
        {
            isRunning = false;
            return;
        }
        switchPlayer();
    }

    const isGameOver = () =>
    {
        board.printBoard();
        for (let i = 0; i < board.getSize(); i++)
        {
            if (board.threeTokensInCol(i) || board.threeTokensInRow(i))
            {
                announceWinner();
                winningPlayer = activePlayer;
                return (true);
            }
        }
        if (board.threeInDiagTopLeft() || board.threeInDiagTopRight())
        {
            announceWinner();
            winningPlayer = activePlayer;
            return (true);
        }
        if (board.hasTokensEverywhere())
            return (true);
        return (false);
    }

    const announceWinner = () =>
    {
        console.log("Game is over. Player " + activePlayer.getToken() + " '" + activePlayer.name + "' wins");
    }

    const getActivePlayer = () => activePlayer;

    const printBoard = () => board.printBoard();

    const restart = () =>
    {
        board.clear();
        activePlayer = player1;
        isRunning = true;
    }

    const getIsRunning = () => isRunning;

    const getWinningPlayer = () => winningPlayer;

    return ({
        printBoard,
        getIsRunning,
        getWinningPlayer,
        restart,
        getActivePlayer,
        getBoard: board.getBoard,
        playRound
    });
})();

function PlayerFactory(name, token)
{
    const getToken = () => token;
    return ({
        name,
        getToken
    });
}

const screenController = (function ()
{
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const winnerDiv = document.querySelector(".winner");

    const updateScreen = () =>
    {
        // clear the board
        boardDiv.textContent = "";
        winnerDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${ activePlayer.name }'s turn...`;

        if (!game.getIsRunning() && game.getWinningPlayer() !== notPlayer)
            winnerDiv.textContent = `${ game.getWinningPlayer().name } won`;
        else if (!game.getIsRunning())
            winnerDiv.textContent = "It's a draw";
        else
            ;

        // Render board squares
        renderBoard(board);
    }

    const renderBoard = (board) =>
    {
        board.forEach((size, rowIndex) =>
        {
            size.forEach((cell, colIndex) =>
            {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create a data attribute to identify the column
                // This makes it easier to pass into our `playRound` function 
                cellButton.dataset.column = colIndex;
                cellButton.dataset.row = rowIndex;
                if (cell.getValue() !== 0)
                    cellButton.textContent = cell.getValue();
                else
                    cellButton.textContent = "";
                boardDiv.appendChild(cellButton);
            })
        })
    }

    boardDiv.addEventListener("click", event =>
    {
        const selectedColumn = event.target.dataset.column;
        const selectedRow = event.target.dataset.row;
        // Make sure I've clicked a cell button and not the gaps in between
        if (!selectedColumn || !selectedRow)
            return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    })

    const form = document.querySelector("form");
    form.addEventListener("submit", event =>
    {
        event.preventDefault();
        let buffer = [];
        const formData = new FormData(form);
        for (const pair of formData.entries())
        {
            buffer.push(pair[1]);
        }
        player1.name = buffer.shift();
        player2.name = buffer.shift();
        updateScreen();
    })

    const restart = document.querySelector("#restart");
    restart.addEventListener("click", event =>
    {
        game.restart();
        updateScreen();
    })

    updateScreen();

    return ({
        updateScreen
    })
})();