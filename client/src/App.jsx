import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

// Connect to the server using socket.io-client library
const socket = io("http://localhost:8080");

function App() {
  const [score, setScore] = useState({
    name: "",
    score: "",
  });

  const [scoreList, setScoreList] = useState([]);

  // Function to establish socket connection and set up event listeners
  const connectSocket = () => {
    // Listen for connection event and log a message when connected in client
    socket.on("connect", () => {
      console.log("connected to socket");
    });

    // Listen for scoreList event and update the score list state
    socket.on("scoreList", (res) => {
      setScoreList(res);
    });
  };

  useEffect(() => {
    connectSocket();

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      socket.off("connect"); // Remove connection event listener
      socket.off("scoreList"); // Remove scoreList event listener
    };
  }, []);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setScore({ ...score, [name]: value });
  };

  // Function to send the score to the server
  const sendScore = () => {
    socket.emit("score", score);
  };

  return (
    <>
      <h1>React Multiplayer Dashboard</h1>

      <input
        name="name"
        type="text"
        placeholder="Enter your name"
        onChange={handleOnChange}
      />
      <br />
      <input
        name="score"
        type="text"
        placeholder="Enter your score"
        onChange={handleOnChange}
      />
      <br />
      <br />
      <button onClick={sendScore}>Send</button>
      <div className="table-container">
        <table>
          <tr>
            <th>id</th>
            <th>Socket Id</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
          {scoreList.map((score) => {
            return (
              <tr key={score.id}>
                <td>{score.id}</td>
                <td>{score.socketId}</td>
                <td>{score.name}</td>
                <td>{score.score}</td>
              </tr>
            );
          })}
        </table>
      </div>
    </>
  );
}

export default App;
