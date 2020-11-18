import { useReducer, useEffect } from "react";
import { player1Ships, player2Moves } from "./const";
const API = "https://solv-battleship.herokuapp.com";

export default function BattleHook({ players = 2 }) {
  let initState = {
    won: 0,
    gameId: "",
    move: 0,
    lastFireStruck: false,
    lastPlayer: "0",
    tiles: {},
    players,
    player2MoveIndex: 0,
  };

  initState.tiles["1"] = {};
  for (let [type, coordinates] of Object.entries(player1Ships)) {
    for (let coordinate of coordinates) {
      initState.tiles["1"][coordinate] = {
        type,
        struck: false,
      };
    }
  }
  initState.tiles["2"] = {};
  let [data, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    fetch(`${API}/api/v1/battleship/createGame`, { method: "POST" })
      .then((r) => r.json())
      .then((r) => {
        dispatch({ type: "setGameId", gameId: r.gameId });
      });
  }, []);

  return {
    tile: (row, column, player) => {
      return data.tiles[player + ""][row + column];
    },
    fire: (row, column, player) => {
      post("/api/v1/battleship/fire", {
        gameId: data.gameId,
        coordinate: row + column,
      }).then((r) => {
        dispatch({
          type: "fire",
          row,
          column,
          player: player + "",
          status: r.status,
        });
      });
    },
    computerFire: () => {
      post("/api/v1/battleship/requestMove", {
        gameId: data.gameId,
      }).then((r) => {
        dispatch({ type: "fire", coordinates: r.coordinate, player: "2" });
        dispatch({ type: "incrementPlayer2MoveIndex" });
      });
    },
    ...data,
  };
}

function post(url, body) {
  return fetch(`${API}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((r) => r.json());
}

function reducer(state, action) {
  switch (action.type) {
    case "setGameId":
      return {
        ...state,
        gameId: action.gameId,
      };
    case "fire":
      let coordinates = action.coordinates || action.row + action.column;
      console.log("Firing on ", coordinates);

      let hit =
        action.status === "hit" ||
        (action.player === "2" && state.tiles["1"][coordinates]?.type);

      let _state = {
        ...state,
        move: state.move + 1,
        lastPlayer: action.player,
        lastFireStruck: hit,
        tiles: {
          ...state.tiles,
          [action.player]: {
            ...state.tiles[action.player],
            [coordinates]: {
              ...(state.tiles[action.player][coordinates] || { type: null }),
              struck: true,
              hit,
            },
          },
        },
      };

      for (let [_, t] of Object.entries(_state.tiles)) {
        let tiles = Object.values(t);
        let hits = tiles.reduce((acc, t) => (t.hit ? acc + 1 : acc), 0);
        if (hits === 17) state = { ...state, won: action.player };
      }

      return _state;
    case "incrementPlayer2MoveIndex":
      return {
        ...state,
        player2MoveIndex: state.player2MoveIndex + 1,
      };
    default:
      return state;
  }
}
