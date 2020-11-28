import React from 'react'
import Tile from './Tile'
import getBoard from '../getBoard'
import CheckSolutionButton from './CheckSolutionButton'
import checkIDs from '../checkIDs'
import getRow from '../utils/getRow'
import getColumn from '../utils/getColumn'
import get3by3 from '../utils/get3by3'
import sleep from '../utils/sleep'

class Board extends React.Component {
    constructor() {
        super()
        const boardValues = getBoard()
        const initTiles = boardValues.map(k => {  // creates an array of objects of length 81
            return {                             // to represent the tiles on the board
                value: k,
                isInitial: !!k 
            }
        })
        this.state = {
            initTiles: initTiles,
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

    handleCheckSolution() {
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
        if (this.state.step != 0) {
            const currentStep = this.state.step                           // get current step
            const newTiles = this.state.history[currentStep-1]            // get the tiles for the previous step in history
            const newHistory = this.state.history.slice(0, currentStep)   // make the history forget that last step
            this.setState({
            ...this.state,
            tiles: newTiles,
            history: newHistory,
            step: currentStep - 1
        })

        }
        
    }

    isTerminus(tiles) {
        for (let i=0; i < 81; i++) {
            if (tiles[i].value === null) {
                return false
            }
        }
        return true
    }
    
    isSolution() {
        let checks = []
        for (let i=0; i < checkIDs.length; i++) {   // This creates an array filled with the outcomes to
            let set = this.getValues(checkIDs[i])   // each of the checks [true,true,false,true... ] etc.
            checks.push(this.checkValidity(set))
        }

        if (checks.includes(false)) {
            return false
        } else {
            return true
         }
    }

    async handleSolve() {
        let currentTiles = this.state.initTiles
        let frontier = []
        
        while (true) {
            /* First, check that the tile configuration is a solution, if so
            change the state of the board to solved */
            if (this.isTerminus(currentTiles) && this.isSolution(currentTiles)) {
                break
            }
            
             /* Next get all the possible actions for the current tile configuration */
            let actions = this.getActions(currentTiles)
            /* For each action get add the result to the frontier */
            for (let i=0; i < actions.length; i++) {
                let action = actions[i]
                let result = this.getResult(currentTiles, action)
                frontier.push(result)
                }   
            
                await new Promise(r => setTimeout(r, 50));

            /* set the new tile configuration to the last item in the frontier */
            currentTiles = frontier.pop()
            this.setState({
                ...this.state,
                tiles: currentTiles
            })
        }

        this.setState({
            ...this.state,
            isSolved: true,
            tiles: currentTiles
        })
    }

    getPossibleValues(id, tiles) {
        /* takes in a tile id and a tile configuration and returns an array of
            legal values on that tile */
        let tilesToCheck = []
        let excludedValues = []
        let possibleValues = []

        tilesToCheck = tilesToCheck.concat(getRow(id), getColumn(id), get3by3(id))

        for (let i=0; i < tilesToCheck.length; i++) {
            let tile = tiles[tilesToCheck[i]]
            if (!!tile.value) {
                excludedValues.push(tile.value)
            }
        }

        for (let i=1; i < 10; i++) {
            if (!excludedValues.includes(i)) {
                possibleValues.push(i)
            }
        }
        return possibleValues
    }

    getActions(tiles) {
        /* this takes in an array of tile objects and returns an array of "action objects"
        which look like this:
        action = {
            tileID: <id of the tile>,
            value: <possible value>
        } */

        // find the first open square
        let firstOpenTile = null
        let firstOpenTileFound = false
        let actions = []

        while (!firstOpenTileFound) {
            for (let i=0; i<81; i++) {
                if (tiles[80-i].value == null) {
                    firstOpenTile = 80-i
                    firstOpenTileFound = true
                }
            }
        }

        const possibleValues = this.getPossibleValues(firstOpenTile, tiles)

        for (let i = 0; i<possibleValues.length; i++) {
            let actionObject = {
                tileID: firstOpenTile,
                value: possibleValues[i]
            }
            actions.push(actionObject)
        }
        
        return actions
    }

    getResult(tiles, action) {
        /* takes in tiles as the tile configuration, and an action object and returns the
        resulting tile configuration */
        
        const tileID = action.tileID
        const value = action.value

        let newTiles = tiles.slice()
        newTiles[tileID] = {
            value: value,
            isInitial: false
        }
        
        return newTiles
    }


    /* Render Method */
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
                    onClick={() => this.handleCheckSolution()} />
                <button 
                className="toggleHistoryButton"
                onClick={() => this.handleBack()}>
                    Undo
                </button>
                <button
                id="solveButton"
                onClick={() => this.handleSolve()}>
                Solve
                </button>
                <span id="solvedSpan">
                    {this.state.isSolved ? "Correct Solution":""}
                </span>
            </div>
        )
    }
}


export default Board