import "./App.css";
import BattleHook from "./battleHook";
import React, { useEffect } from "react";

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const PLAYERS = 2;

function App() {
  let battleship = BattleHook({});

  useEffect(() => {
    let { lastPlayer, lastFireStruck } = battleship;
    if (
      (lastPlayer === "2" && lastFireStruck) ||
      (lastPlayer === "1" && !lastFireStruck)
    ) {
      battleship.computerFire();
    }
  }, [battleship.move]);

  let boards = [];
  for (let i = 1; i <= PLAYERS; i++) {
    boards.push(<Board battleship={battleship} player={i} />);
  }

  return <div style={{ display: "flex" }}>{boards}</div>;
}

function Board({ battleship, player }) {
  if (!battleship.gameId) return <span>Loading...</span>;
  if (battleship.won) return <span>Player {battleship.won} won!</span>;
  return (
    <div>
      <h4 style={{ textAlign: "center" }}>Player {player}</h4>
      <table>
        <tbody>
          <tr>
            <td />
            {COLUMNS.map((c) => (
              <td key={c}>{c}</td>
            ))}
          </tr>
          {ROWS.map((r) => {
            return (
              <tr key={r}>
                <td>{r}</td>
                {COLUMNS.map((c) => {
                  let tile = battleship.tile(r, c, player);
                  return (
                    <td
                      key={r + c}
                      onClick={() => {
                        // add if not already clicked
                        battleship.fire(r, c, player);
                      }}
                      className="tile"
                    >
                      <Tile tile={tile} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Tile({ tile }) {
  if (tile && tile.struck) {
    if (tile.hit) return <div className="tile-hit">X</div>;
    return <div className="tile-miss" />;
  }
  return <div className="tile-empty" />;
}

export default App;
