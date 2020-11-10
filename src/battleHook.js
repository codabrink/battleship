import {useReducer} from 'react'

export default function BattleHook({ player2Ships }) {
  let initState = {tiles: {}}

  for (let [type, coordinates] of Object.entries(player2Ships)) {
    for (let coordinate of coordinates) {
      initState.tiles[coordinate] = {
        type,
        struck: false
      }
    }
  }

  let [data, dispatch] = useReducer(reducer, initState)

  return {
    tile: (row, column) => data.tiles[`${row}${column}`],
    fire: (row, column) => {dispatch({type: 'fire', row, column})},
    ...data
  }
}
function reducer(state, action) {
  switch (action.type) {
    case 'fire':
      let coordinates = action.row + action.column
      console.log("Firing on ", coordinates)

      return {
        ...state,
        tiles: {
          ...state.tiles,
          [coordinates]: {
            ...state.tiles[coordinates] || { type: null },
            struck: true
          }
        }
      }
    default:
      return state
  }
}