import './App.css'

import BattleHook from './battleHook'

const player2Ships = {
  carrier: ['A10', 'B10', 'C10', 'D10', 'E10'],
  battleship: ['B3', 'B4', 'B5', 'B6'],
  destroyer: ['F3', 'G3', 'H3'],
  submarine: ['G1', 'H1', 'I1'],
  patrol: ['A9', 'B9'],
}
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

function App() {
  let battleship = BattleHook({ player2Ships })

  return (
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
                let tile = battleship.tile(r, c)
                return (
                  <td
                    key={r + c}
                    onClick={() => battleship.fire(r, c)}
                    className="tile"
                  >
                    <Tile tile={tile} />
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function Tile({ tile }) {
  if (tile && tile.struck) {
    if (tile.type) return <div className="tile-hit">X</div>
    return <div className="tile-miss" />
  }
  return <div className="tile-empty" />
}

export default App
