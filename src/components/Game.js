/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import queryString from "query-string";
import { calculateWinner } from "./helper";
import Boardtest from "./Board";

import io from "socket.io-client";
let socket;
// let count = 0;

const Game = (props) => {
  const [state, setState] = useState({
    name: props.name,
    room: props.room,

  });
  const ENDPOINT = "localhost:8080";
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(props.isRoomCreator ? true : false);
  const [xO, setXo] = useState(props.isRoomCreator ? "X" : "O");
  const winner = calculateWinner(history[stepNumber]);

  const historyPoint = history.slice(0, stepNumber + 1);
  const current = historyPoint[stepNumber];
  const squares = [...current];

  const handleClick = (i) => {
    if (myTurn && !winner) {
      socket.emit("handleClick", JSON.stringify({ xO, i }), () => {

        // socket emiting
        console.log("i Am Xo in the emit", xO);
      });
    }
  };



 
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
      setMyTurn(myTurn ? false : true);
    });
  }, [myTurn]);

  const registerToIoEvents = () => {
    socket.on("send", (data) => {
      console.log("data", data);

      setCurrentPlayer(data.user);
      // return if won or occupied
      if (winner || squares[data.data.i]) return;
      // select square
      squares[data.data.i] = data.data.xO;
      setHistory([...historyPoint, squares]);
      setStepNumber(historyPoint.length);
    });
  };

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
      console.log(message);
    });

    // console.log(messages);
  }, [messages, message]);

  if (winner) {

  }
  return (
    <>
      <Boardtest squares={history[stepNumber]} onClick={handleClick} />
      <div className="info-wrapper">
  
        <h3>
          {!winner
            ? myTurn
              ? `It os Your turn to play!`
              : `Waitin for opponent...`
            : null}
        </h3>
        <h3>{winner ? `${currentPlayer} is the Winner!` : null}</h3>
      </div>
    </>
  );
};

export default Game;
