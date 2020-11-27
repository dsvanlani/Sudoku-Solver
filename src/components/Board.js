import React from 'react'
import Tile from './Tile'
import dummyBoard from '../dummyBoard'
import CheckSolutionButton from './CheckSolutionButton'
import checkIDs from '../checkIDs'

class Board extends React.Component {
    constructor() {
        super()
        const initTiles = dummyBoard.map(k => {
            return {
                value: k,
                isInitial: !!k 
            }
        })
        this.state = {
            tiles: initTiles,
            selectedTile: null,
            isSolved: false,
        }
    }

    handleClick(id) {
        // Changes the selectedTile value in state
        const selectedTile = id
        this.setState({
            ...this.state,
            selectedTile: selectedTile
        })
    }

    handleKeyDown(event) {
        const numbers = ['1','2','3','4','5','6','7','8','9']
        if (this.state.tiles[this.state.selectedTile] && !this.state.tiles[this.state.selectedTile].isInitial ) {
            if (numbers.includes(event.key)) {
                const targetTile = this.state.selectedTile
                let updatedTiles = [...this.state.tiles]
                updatedTiles[targetTile] = {
                    value: parseInt(event.key),
                }
                this.setState({
                    ...this.state,
                    tiles: updatedTiles
                })
            }      
        }
    }
    getValues(idArray) {
        /* Takes in an array of the id's to check,
            returns an array of values from said ids */

        const valuesList = []
        for (let i=0; i < idArray.length; i++) {
            valuesList.push(this.state.tiles[idArray[i]].value)
        }
        return valuesList
    }

    checkValidity(valuesArray) {
        /* Takes in an array of Values and returns true
            or false depending on if each number between
            1 and 9 is represented once and only once */
            let checkNumbers = [1,2,3,4,5,6,7,8,9]

            for (let i=0; i< checkNumbers.length; i++) {
                var num = checkNumbers.pop()
                if (!valuesArray.includes(num)) {
                    return false
                }
            }
            return true
    }

    handleSolve() {
        let checks = []
        for (let i=0; i < checkIDs.length; i++) {   // This creates an array filled with the outcomes to
            let set = this.getValues(checkIDs[i])   // each of the checks [true,true,false,true... ] etc.
            checks.push(this.checkValidity(set))
        }
        
        if (!checks.includes(false)) {               // If none of them failed, set the state to solved
            const tempState = this.state
            tempState.isInitial = true
            this.setState(tempState)
        }
    }
        
    
    render() {
        const board = this.state.tiles.map((tile, i) => 
            <Tile 
                key={i}
                value={tile.value}
                isInitial={tile.isInitial}
                onClick={() => this.handleClick(i)}
                />
        )   
        
        return(
            <div 
            className='board'
            onKeyDown={e => this.handleKeyDown(e)}>
                {board}
                <CheckSolutionButton
                    onClick={() => this.handleSolve()} />
            </div>
        )
    }
}


export default Board