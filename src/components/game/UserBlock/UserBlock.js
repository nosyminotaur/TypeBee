import React from "react";
import "./UserBlock.css";
import black_hex from "./black_hex.svg";
import PropTypes from "prop-types";
import { ScoreBoard } from "../ScoreBoard";
import { MAX_POINTS, GameMode } from "../consts";
import { StopWatch } from "../StopWatch/StopWatch";
export class UserBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //word displayed by lower input box
            lowerWord: "",
            //index of the correct word in the this.words array
            currentWordIndex: 0,
            //to store and reset upper word
            upperWord: "",
            //text color of both the inputs
            correctColor: colors.NEUTRAL,
            //current location, top and left
            top: 0,
            left: 0,
            //score of the user. needs to be passed to parent
            userScore: 0,
        }
        this.words = this.props.words;
        //allows to start the stopwatch anytime
        this.stopwatch = React.createRef();
    }

    //holds timeout data to clear it later on
    windowTimeout;

    componentDidMount() {
        this.centerTextBlock();
        //sets the lowerWord to the first value in the words array to start the action
        this.setState({
            lowerWord: this.words[0]
        });
        //ensure that when this component loads the focus is on the upper input
        this.upperInput.focus();
        this.stopwatch.current.startForward();
    }

    componentDidUpdate(prevProps) {
        //to ensure state goes hand in hand with props
        if (prevProps.currentWord !== this.props.currentWord) {
            this.setState({
                lowerWord: this.props.currentWord,
                upperWord: "",
                correctColor: colors.NEUTRAL,
            });
        }
    }

    //to ensure that the input box is in center
    //X is handled in CSS
    centerTextBlock() {
        let inputs = document.getElementsByClassName("g-textarea");
        let stopwatch = document.getElementById("stopwatch-wrapper");

        let upShift = ((15/16 * this.props.width) - inputs[0].offsetHeight)/2;
        //if stopwatch present, shift the inputs by this amount to center them inside the image
        if (stopwatch !== null) {
            upShift += stopwatch.offsetHeight;
        }

        inputs[0].style.top = upShift + "px";
        inputs[1].style.top = upShift + "px";
    }

    getValidCoords = () => {
        let scoreboard = document.getElementById("scoreboard");
        let word_block = document.getElementById("word-block");

        let scoreboard_rect = scoreboard.getBoundingClientRect();
        let word_block_rect = word_block.getBoundingClientRect();

        let coords_top = [[0, scoreboard.getBoundingClientRect().y - this.props.width], [scoreboard_rect.bottom, window.innerHeight - this.props.width]];
        let coords_left = [[0, scoreboard.getBoundingClientRect().x - this.props.width], [scoreboard_rect.right, word_block_rect.right - this.props.width]];

        //initially use only the smaller values. if Math.random() > 0.5 for each case, update for the larger values
        let rand_top = this.getRandomNumber(coords_top[0][0], coords_top[0][1]);
        let rand_left = this.getRandomNumber(coords_left[0][1], coords_left[0][1]);
        
        //if this random > 0.5, use coords_top[1]
        if (Math.random() > 0.5) {
            rand_top = this.getRandomNumber(coords_top[1][0], coords_top[1][1]);
        }

        //if this random > 0.5, use coords_left[1]
        if (Math.random() > 0.5) {
            rand_left = this.getRandomNumber(coords_left[1][0], coords_left[1][1]);
        }
        
        //boundary check on the upper part
        ///lower part not necessary
        if (rand_left < 0) {rand_left = 0}
        if (rand_top < 0) {rand_top = 0}

        return [rand_top, rand_left];
    }

    getRandomNumber(min,max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    fadeOutWordBlock = () => {
        let word_block = document.getElementById("user-block");
        
        if (word_block === null) return;

        word_block.style.opacity = '0';
        
        let [rand_top, rand_left] = this.getValidCoords();
        
        this.setState({
            lowerWord: this.words[this.state.currentWordIndex + 1],
            upperWord: "",
            correctColor: colors.NEUTRAL,
            currentWordIndex: this.state.currentWordIndex + 1,
            top: rand_top,           
            left: rand_left,
        });

        window.setTimeout(this.fadeInWordBlock, 50);
    }

    fadeInWordBlock() {
        let word_block = document.getElementById("user-block");
        let initial_opacity = 0;
        let timer = setInterval(() => {
            if (word_block.style.opacity === '1') {
                clearInterval(timer);
            }
            word_block.style.opacity = initial_opacity;
            word_block.style.filter = 'alpha(opacity=' + initial_opacity * 100 + ")";
            initial_opacity += 0.1;
        }, 8);
        window.clearTimeout(this.windowTimeout);
    }
    
    textUpdated(event) {
        let currentWord = this.words[this.state.currentWordIndex];

        //handle state of upperWord to update input
        let upperWord = event.target.value;
        this.setState({
            upperWord
        });

        //if nothing has been entered, set lowerWord to the currentWord so that the user knows that he has to enter that word
        if (upperWord.length === 0) {
            this.setState({
                lowerWord: currentWord,
                correctColor: colors.NEUTRAL
            });
        }
        else {
            //to lowercase done because someone might enter both cases and then it will be invalid
            if (currentWord.toLowerCase() === upperWord.toLowerCase()) {
                //start fading animation here
                this.windowTimeout = window.setTimeout(this.fadeOutWordBlock, 300);

                //call parent function on current word input
                let isOver = this.props.onWordCompleted(this.state.currentWordIndex);

                if (isOver) return;

                //animate text area to show user that a new word is ready
                this.animateTextArea();

                this.setState({
                    userScore: this.state.userScore + currentWord.length
                });
            }

            //if currentWord partially matches the upper word, set lowerWord to same as upperWord to
            //tell user he is writing correctly.
            //else, tell user he is wrong by coloring in red
            if (currentWord.substring(0, upperWord.length).toLowerCase() === upperWord.toLowerCase()) {
                this.setState({
                    lowerWord: upperWord,
                    correctColor: colors.VALID
                });
            }
            else {
                this.setState({
                    lowerWord: upperWord,
                    correctColor: colors.INVALID
                });
            }
        }
    }

    //flash colors to indicate user that the next word is ready/ correct word was entered
    animateTextArea() {
        let text_area = document.getElementsByClassName("g-textarea");
        let anim_colors = [colors.VALID, "#ffffff", colors.VALID];
        let current_color = 0;

        let anim_interval = setInterval(frame, 50);
        function frame() {
            //if final color reached, clear the interval
            if (current_color === 3) {
                clearInterval(anim_interval);
            }
            else {
                text_area[0].style.color = anim_colors[current_color];
                text_area[1].style.color = anim_colors[current_color];
                current_color++;
            }
        }
    }

    handleChangeLower(event) {
        this.setState({
            lowerWord: event.target.value
        });
    }

    changeInputType(input) {
        input.target.type = "text"
    }

    render() {
        return(
            <div id="outer-wrapper">
                <div id="user-block" style={{top: this.state.top, left: this.state.left}}>
                    {/* stopwatch is relative to it's parent, so only needed to shift it by width/2 */}
                    <StopWatch ref = {this.stopwatch} left = { this.props.width/2 } />
                    <img id="hexagon"
                    src={black_hex}
                    height={(this.props.width * 15/16)}
                    width={this.props.width}
                    alt={this.state.lowerWord}
                    style={{zIndex: "-2", position: "absolute"}} />
                    
                    <input style={{color: this.state.correctColor, fontSize: (0.15 * this.props.width) - 4}}
                    placeholder={this.props.currentWord}
                    value = {this.state.lowerWord}
                    onChange = {(e) => this.handleChangeLower(e)}
                    className="g-textarea" />

                    <input type = "password" autoComplete = "off" onFocus = {(e) => this.changeInputType(e)}
                    value = {this.state.upperWord}
                    ref={(input) => { this.upperInput = input; }}
                    style={{color: this.state.correctColor, opacity: "0.1", fontSize: (0.15 * this.props.width) - 4}}
                    onChange = {(e) => this.textUpdated(e)}
                    className="g-textarea" />
                </div>
                {
                    this.props.gameType === GameMode.POINTS
                    ?
                    <ScoreBoard userScore = {this.state.userScore} maxPoints = {MAX_POINTS} />
                    :
                    ""
                }
            </div>
        )
    }
}

UserBlock.defaultProps = {
    width: 160,
    top: "0",
    left: "0"
}

UserBlock.propTypes = {
    width: PropTypes.number,
    top: PropTypes.string,
    left: PropTypes.string
}

const colors = {
    NEUTRAL: "white",
    //just a bit darker than #98FB98
    VALID: "#33ff77",
    INVALID: "red"
};