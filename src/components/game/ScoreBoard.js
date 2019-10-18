import React from "react";
import { IndividualScore } from "./IndividualScore";

export class ScoreBoard extends React.Component {
    defaultHeight = 0;
    defaultWidth = 0;
    
    componentDidMount() {
        this.defaultHeight = window.innerHeight / 5;
        this.defaultWidth = 0;
        if (window.innerWidth > 1200) {
            this.defaultWidth = window.innerWidth / 4;
        }
        else if (window.innerWidth > 600) {
            this.defaultWidth = window.innerWidth / 3;
        }
        else {
            this.defaultWidth = window.innerWidth / 2;
        }
    }

    //to get a value of top that centers the div
    getDefaultTop = () => {
        let window_height = window.innerHeight;
        return window_height/2 - (this.defaultHeight/2) + "px";
    }

    //to get a value of left that centers the div
    getDefaultLeft = () => {
        let window_width = window.innerWidth;
        return window_width/2 - (this.defaultWidth/2) + "px";
    }

    render() {
        return(
            <div id="scoreboard"
            style={{top: this.getDefaultTop(),
            left: this.getDefaultLeft(),
            height: this.defaultHeight,
            width: this.defaultWidth,
            textAlign: "center",
            position: "absolute",
            color: "white",
            backgroundColor: "transparent",
            }}>
                <div style = {{backgroundColor: "transparent", fontSize: "1.5rem", fontFamily: "Lobster"}}>Points remaining: {this.props.maxPoints - this.props.userScore}</div>
                <IndividualScore height = {this.defaultHeight / 3} bgColor = "transparent" name="Harsh" rank = "1" userScore = {this.props.userScore}/>
                <IndividualScore height = {this.defaultHeight / 3} bgColor = "transparent" rank = "2"/>
                <IndividualScore height = {this.defaultHeight / 3} bgColor = "transparent" rank = "3"/>
            </div>
        )
    }
}