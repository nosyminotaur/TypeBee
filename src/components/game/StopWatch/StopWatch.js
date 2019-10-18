import React from "react";
import "./StopWatch.css";

export class StopWatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSec: 0
        }
        //in rem
        this.defaultFontSize = 1.8

        //holds timeout data to clear it later on
        this.windowTimeout = null;
    }

    //increment timer
    startForward(interval = 100) {
        this.windowTimeout =  setInterval(() => {
            this.setState({
                currentSec: this.state.currentSec + 0.1
            })
        }, interval);
    }

    //decrement timer
    startBackward(interval = 100) {
        this.windowTimeout =  setInterval(() => {
            this.setState({
                currentSec: this.state.currentSec - 0.1
            })
        }, interval);
    }

    stop() {
        clearInterval(this.windowTimeout);
    }

    //example : if default = 16px -> left - 16*(0.5) to move stopwatch to center
    getLeft = () => {
        return this.props.left - (parseFloat(getComputedStyle(document.body).fontSize) * (this.defaultFontSize - 1));
    }

    render() {
        return(
            <div id = "stopwatch-wrapper"
            style={{left: this.getLeft(), position: "relative", fontSize: this.defaultFontSize + "rem", color: "white"}}>
                { this.state.currentSec.toFixed(1) }
            </div>
        );
    }
}