import React from "react";
import "./Game.css";
import { UserBlock } from "../UserBlock/UserBlock";
import loading from "./loading.svg";
import { GameMode, MAX_POINTS } from "../consts";

export class Game extends React.Component {
    constructor() {
        super();
        fetch("https://random-word-api.herokuapp.com/word?key=O84EEYEZ&number=40")
        .then(response => response.json())
        .then(response => {
            this.setState({
                words: response,
                isReady: true,
            });
            this.forceUpdate();
        });
    }
    componentDidMount() {
        let component = document.getElementById("overlay");
        let initial_opacity = 0;
        component.style.opacity = initial_opacity;
        let timer = setInterval(() => {
            if (component.style.opacity === '1') {
                clearInterval(timer);
            }
            component.style.opacity = initial_opacity;
            component.style.filter = 'alpha(opacity=' + initial_opacity * 100 + ")";
            initial_opacity += 0.02;
        }, 1);
    }
    
    state = {
        words: [],
        isReady: false,
        currentWordIndex: 0,
        userScore: 0,
        gameType: GameMode.POINTS
    };

    onWordCompleted(currentWordIndex) {
        let isOver = false;

        if (this.state.userScore + this.state.words[currentWordIndex].length >= MAX_POINTS) {
            this.props.history.push("/end")
            isOver = true;
        }

        this.setState({
            currentWordIndex,
            userScore: this.state.words[currentWordIndex].length + this.state.userScore
        });

        return isOver;
    }
    
    render() {
        return(
            <div id="overlay">
                <div id='stars'></div>
                <div id='stars2'></div>
                <div id='stars3'></div>
                <div id="word-block" >
                    {
                        this.state.isReady ?
                        <div>
                            <UserBlock
                            onWordCompleted={(param) => this.onWordCompleted(param)} 
                            words = {this.state.words}
                            gameType = {this.state.gameType}
                            width = {window.innerWidth > 1200 ? window.innerWidth/8 : window.innerWidth > 768 ? window.innerWidth/6 : window.innerHeight / 5} />
                            
                        </div>
                        :
                        <div>
                            <h3>Waiting for words to arrive!</h3>
                            <img src = {loading} width="30px" height="30px" alt="loading animation"/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}