/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";
import { calculateWinner } from "./helper";
import Boardtest from "./Board-test";

import io from "socket.io-client";
let socket;
// let count = 0;
const Game = (props) => {
  const [state, setState] = useState({
    name: props.name,
    room: props.room,
    myTurn: props.myTurn,
    // isRoomCreator: props.isRoomCreator,
    message: "",
    messages: "",
    count: 0,
  });
  const [c, sc] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:8080";

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const [myTurn, setMyTurn] = useState(props.isRoomCreator ? true : false);
  const winner = calculateWinner(history[stepNumber]);
  // const xO = xIsNext ? "X" : "O";
  const [xO, setXo] = useState(props.isRoomCreator ? "X" : "O");
  let newSquares;
  const historyPoint = history.slice(0, stepNumber + 1);
  const current = historyPoint[stepNumber];
  const squares = [...current];
  const handleClick = (i) => {
    if (myTurn && !winner) {
      socket.emit("handleClick", JSON.stringify({ xO, i }), () => {
      
        // setXisNext(!xIsNext);

        // socket emiting
        console.log("i Am Xo in the emit", xO);
      });
      // });
    } else if (winner) {
      alert(``)
    }

  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXisNext(step % 2 === 0);
  };

  const renderMoves = () =>
    history.map((_step, move) => {
      const destination = move ? `Go to move #${move}` : "Go to Start";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{destination}</button>
        </li>
      );
    });

  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(props);
    console.log(socket);

    let name = state.name;
    let room = state.room;

    socket.emit("join", { name, room });
    registerToIoEvents();

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, props, state.name, state.room]);

  useEffect(() => {
    socket.on("send", (data) => {
      // console.log(message);
      // if (message.data === "X") {
      setMyTurn(myTurn ? false : true);
      // return if won or occupied
      console.log("balulu balala balele");
      // }
      // xO === "X" ? setXo("O") : setXo("X");
    });
  }, [myTurn]);

  const registerToIoEvents = () => {
    socket.on("send", (data) => {
      console.log('data', data);
     
      // return if won or occupied
      if (winner || squares[data.data.i]) return;
      // select square
      //! mark!!!!
      squares[data.data.i] = data.data.xO;
      setHistory([...historyPoint, squares]);
      setStepNumber(historyPoint.length);
    });
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      console.log(message);
      // if (message.data === "X") {
      //   setMyTurn(myTurn ? false : true);
      //   console.log(myTurn);
      // }
    });

    // console.log(messages);
  }, [messages, message, props.isRoomCreator, myTurn]);

  const counterClick = () => {
    // sc(c+1);
    socket.emit("click", c, () => {
      sc(c + 1);
      console.log("i Am c in the emit", c);
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    console.log();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
  };

  const show = () => {
    return messages.map((m) => <div>{m.text}</div>);
  };

  return (
    <>
      <h1>Game!!!!!!!!</h1>
      {/* <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button onClick={counterClick}>Click</button>
      <div>{show()}</div> */}

      <Boardtest squares={history[stepNumber]} onClick={handleClick} />
      <div className="info-wrapper">
        <div>
          <h3>History</h3>
          {renderMoves()}
        </div>
        <h3>{winner ? "Winner: " + winner : "Next Player: " + xO}</h3>
      </div>
    </>
  );
};

export default Game;
