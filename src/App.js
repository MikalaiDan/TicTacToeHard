import React, { useState, useEffect } from "react";

// login
function LoginRegisterScreen({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter a username and password");
    } else {
      setError("");
      onLogin(username);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Please enter a username and password");
    } else {
      setError("");
      onRegister(username, password);
    }
  };

  return (
    <div>
      <h1>Register or Login</h1>
      <form>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

// Game Scene
function GameScene({ username }) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState("");
  const [score, setScore] = useState({ X: 0, O: 0 });

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = () => {
    for (let condition of winningConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== "")) {
      return "draw";
    }

    return "";
  };

  const handleCellClick = (index) => {
    if (board[index] === "" && winner === "") {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
    }
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner) {
      setWinner(winner);
      if (winner !== "draw") {
        const newScore = { ...score };
        newScore[winner]++;
        setScore(newScore);
      }
    }

    if (currentPlayer === "O" && winner === "") {
      const emptyCells = board.reduce((acc, cell, index) => {
        if (cell === "") {
          acc.push(index);
        }
        return acc;
      }, []);

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMoveIndex = emptyCells[randomIndex];
        const newBoard = [...board];
        newBoard[aiMoveIndex] = "O";
        setBoard(newBoard);
        setCurrentPlayer("X");
      }
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner("");
  };

  return (
    <div>
      <h1>Game Scene</h1>
      <p>
        Current Win/Loss Balance: X: {score.X} - O: {score.O}
      </p>
      <p>Current Username: {username}</p>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell}`}
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div>
          <p>{winner === "draw" ? "It's a draw!" : `${winner} wins!`}</p>
          <button onClick={resetGame}>New Game</button>
        </div>
      )}
    </div>
  );
}

// Leaderboard Screen
function LeaderboardScreen({ players }) {
  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Wins</th>
            <th>Total Games</th>
            <th>Defeats</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.username}</td>
              <td>{player.wins}</td>
              <td>{player.totalGames}</td>
              <td>{player.totalGames - player.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Profile Screen
function ProfileScreen({ username, onLogout }) {
  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

function TicTacToeGame() {
  const [screen, setScreen] = useState("login");
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const savedPlayers = JSON.parse(localStorage.getItem("players"));
    if (savedPlayers) {
      setPlayers(savedPlayers);
    }
  }, []);

  const handleLogin = (username) => {
    setUsername(username);
    setScreen("game");
  };

  const handleRegister = (username, password) => {
    const newPlayer = { username, password, wins: 0, totalGames: 0 };
    setPlayers([...players, newPlayer]);
    localStorage.setItem("players", JSON.stringify([...players, newPlayer]));
    setScreen("game");
  };

  const handleLogout = () => {
    setScreen("login");
    setUsername("");
  };

  const renderScreen = () => {
    switch (screen) {
      case "login":
        return (
          <LoginRegisterScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        );
      case "game":
        return <GameScene username={username} />;
      case "leaderboard":
        return <LeaderboardScreen players={players} />;
      case "profile":
        return <ProfileScreen username={username} onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderScreen()}
      <nav>
        <ul>
          <li>
            <button onClick={() => setScreen("login")}>Authorization</button>
          </li>
          <li>
            <button onClick={() => setScreen("game")}>Game Scene</button>
          </li>
          <li>
            <button onClick={() => setScreen("leaderboard")}>
              Leaderboard
            </button>
          </li>
          <li>
            <button onClick={() => setScreen("profile")}>Profile</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default TicTacToeGame;
