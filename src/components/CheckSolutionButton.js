import React from 'react'

export default class CheckSolutionButton extends React.Component {
    render() {
        return(
            <button 
            id="checkSolutionButton"
            onClick={() => this.props.onClick()}
            >Check Solution</button>
        
        )
    }
}
