import React from 'react'

class Tile extends React.Component {
    handleKeyDown(event) {
        console.log(event.key)
    }
    render() {
        return(
            <button
            className={ this.props.isInitial ? "tile initialTile": "tile"}
            onClick={() => this.props.onClick()}

            >
                {this.props.value}
            </button>
        )
    }
}

export default Tile