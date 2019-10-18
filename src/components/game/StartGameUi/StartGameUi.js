import React from "react";
import "./StartGameUi.css";
import loading from "./loading.svg";

export class StartGameUi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            buttonText: "Ready?"
        }
        //for setting and clearing Interval functions
        this.windowTimeout = null;
    }

    //flow -> 
    //set text to waiting...
    //set loading to true
    //fetch if all are ready and keep fetching until success.
    //call startCountdown
    onClick = () => {
        this.setState({
            buttonText: "Waiting...",
            loading: true
        });
        fetch("https://random-word-api.herokuapp.com/word?key=YEIHKPIN&number=40").then(response => response.json())
        .then(response => {
            this.setState({
                buttonText: 5,
                loading: false
            });
            this.windowTimeout = setTimeout(this.startCountdown, 1000);
        });
    }

    startCountdown = () => {
        if (this.state.buttonText === 0) {
            clearTimeout(this.windowTimeout);
            //route to the main game component!
            this.props.history.push("/game");
            return;
        }
        this.setState({
            buttonText: this.state.buttonText - 1
        });
        this.windowTimeout = setTimeout(this.startCountdown, 1000);
    }
    
    render() {
        return(
            <div className="wrapper">
                {this.state.isLoading ?
                    <div>
                        <h1 style={{color: "white"}}>Waiting for other players!</h1>
                        <img src={loading} alt="loading" width = "300px" height="200px"/>
                    </div>
                    :
                    <div className="button" onClick={() => this.onClick()}>
                        <span className="button__mask"></span>
                        <span className="button__text">{this.state.buttonText}</span>
                        <span className="button__text button__text--bis">{this.state.buttonText}</span>
                    </div>
                }
            </div>
        )
    }
}