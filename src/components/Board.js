import React from 'react'
import Tile from './Tile'
import dummyBoard from '../dummyBoard'
import CheckSolutionButton from './CheckSolutionButton'
import checkIDs from '../checkIDs'

class Board extends React.Component {
    constructor() {
        super()
        const initTiles = dummyBoard.map(k => {  // creates an array of objects of length 81
            return {                             // to represent the tiles on the board
                value: k,
                isInitial: !!k 
            }
        })
        this.state = {
            tiles: initTiles,
            selectedTile: null,
            isSolved: false,
            step: 0,
            history: [initTiles]
        }
    }

    handleClick(id) {
        // Changes the selectedTile value in state
        const selectedTile = id
        this.setState({
            ...this.state,
            selectedTile: selectedTile,
        })
    }

    handleKeyDown(event) {
        const numbers = ['1','2','3','4','5','6','7','8','9']
        if (this.state.tiles[this.state.selectedTile] && !this.state.tiles[this.state.selectedTile].isInitial ) {
            if (numbers.includes(event.key)) {  // if the key down was a number
                const targetTile = this.state.selectedTile   // get the target tile from state
                let updatedTiles = [...this.state.tiles]     // copy the state of tiles
                updatedTiles[targetTile] = {                 // change the value of the target tile
                    value: parseInt(event.key),
                }
                this.setState({
                    ...this.state,
                    tiles: updatedTiles,
                    step: this.state.step + 1,
                    history: this.state.history.concat([updatedTiles])
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
                var num = checkNumbers.pop()         // get a number from the list -
                if (!valuesArray.includes(num)) {    // if its not in the set of values, return false
                    return false
                }
            }
            return true                            // return true if you never had to return false
    }

    handleSolve() {
        let checks = []
        for (let i=0; i < checkIDs.length; i++) {   // This creates an array filled with the outcomes to
            let set = this.getValues(checkIDs[i])   // each of the checks [true,true,false,true... ] etc.
            checks.push(this.checkValidity(set))
        }

        if (!checks.includes(false)) {               // If none of them failed, set the state to solved
            const tempState = this.state
            tempState.isSolved = true
            this.setState(tempState)
        }
    }

    handleBack() {
        const currentStep = this.state.step                           // get current step
        const newTiles = this.state.history[currentStep-1]            // get the tiles for the previous step in history
        const newHistory = this.state.history.slice(0, currentStep)   // make the history forget that last step
        console.log(newHistory)
        this.setState({
            ...this.state,
            tiles: newTiles,
            history: newHistory,
            step: currentStep - 1
        })
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

                <span id="solvedSpan">
                    {this.state.isSolved ? "You Got it!":""}
                </span>
                <button 
                className="toggleHistoryButton"
                onClick={() => this.handleBack()}>
                    Back
                    </button>
            </div>
        )
    }
}


export default Board