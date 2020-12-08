/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import shortid from "shortid";
import Board from "./components/Board";
import Game from "./components/Game";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import queryString from "query-string";
import io from "socket.io-client";
let socket;
let roomId = null; // Unique id when player creates a room

const App = () => {
  const [state, setState] = useState({
    piece: "",
    name: "",
    isPlaying: false,
    isRoomCreator: false,
    isDisabled: false,
    myTurn: false,
  });

  let lobbyChannel = null; // Lobby channel
  let gameChannel = null; // Game channel

  const onPressCreate = () => {
    if (state.name) {
      roomId =  shortid.generate().substring(0, 5);
      setState({
        piece: "X",
        name: state.name,
        isRoomCreator: true,
        isDisabled: true, // Disable the 'Create' button
        myTurn: true, // Player X makes the 1st move
        // roomId: shortid.generate().substring(0, 5),
        isPlaying: true,
      });
      lobbyChannel = "tictactoelobby--" + roomId; // Lobby channel name
      Swal.fire({
        position: "top",
        allowOutsideClick: false,
        title: "Share this room ID with your friend",
        text: roomId,
        width: 275,
        padding: "0.7em",
        // Custom CSS to change the size of the modal
        customClass: {
          heightAuto: false,
          title: "title-class",
          popup: "popup-class",
          confirmButton: "button-class",
        },
      });
    } else {
      Swal.fire({
        position: "top",
        allowOutsideClick: true,
        text: "You must enter a name!",
        width: 275,
        padding: "0.7em",
        // Custom CSS to change the size of the modal
        customClass: {
          heightAuto: false,
          title: "title-class",
          popup: "popup-class",
          confirmButton: "button-class",
        },
      });
    }
  };

  let joinRoom = (value) => {
    roomId = value;
    lobbyChannel = "tictactoelobby--" + roomId;
  };

  const onPressJoin = (e) => {
    if (state.name) {


      Swal.fire({
        position: "top",
        input: "text",
        allowOutsideClick: false,
        inputPlaceholder: "Enter the room id",
        showCancelButton: true,
        confirmButtonColor: "rgb(208,33,41)",
        confirmButtonText: "OK",
        width: 275,
        padding: "0.7em",
        customClass: {
          heightAuto: false,
          popup: "popup-class",
          confirmButton: "join-button-class",
          cancelButton: "join-button-class",
        },
      }).then((result) => {
        // Check if the user typed a value in the input field
        if (result.value) {
          joinRoom(result.value);
        }
        setState({
          piece: "O",
          name: state.name,
          isPlaying: true

        });
      });
    } else {
      Swal.fire({
        position: "top",
        allowOutsideClick: true,
        text: "You must enter a name!",
        width: 275,
        padding: "0.7em",
        // Custom CSS to change the size of the modal
        customClass: {
          heightAuto: false,
          title: "title-class",
          popup: "popup-class",
          confirmButton: "button-class",
        },
      });
    }
  };

  return (
    <>
  
        <div className="title">
          <p> React Tic Tac Toe </p>
        </div>

        {!state.isPlaying && (
          <div className="game">
            <div className="board">
              <Board squares={0} onClick={(index) => null} />

              <div className="button-container">
                {/* <Link
                  onClick={(e) =>
                    !state.name || roomId ? e.preventDefault() : null
                  }
                  to={`/chat?room=${roomId}`}
                > */}
                  <button
                    className="create-button "
                    disabled={state.isDisabled}
                    onClick={(e) => onPressCreate()}
                  >
                    Create
                  </button>
                  <button
                    className="join-button"
                    onClick={(e) => onPressJoin()}
                  >
                    Join
                  </button>
                {/* </Link> */}

                <br />
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) =>
                    setState({
                      name: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
        {state.isPlaying && state.name && (
          // <Route
            // path="/game"
            // component={Game}
            <Game
            name={state.name}
            room={roomId}
            gameChannel={gameChannel}
            piece={state.piece}
            isRoomCreator={state.isRoomCreator}
            myTurn={state.myTurn}
            // xUsername={state.xUsername}
            // oUsername={state.oUsername}
            // endGame={endGame}
          />
        )}
      {/* </Router> */}
    </>
  );
};

export default App;
