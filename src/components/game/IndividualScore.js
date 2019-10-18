import React from "react";

export class IndividualScore extends React.Component {

    componentDidUpdate(prevProps, prevState) {
       if (prevProps.userScore !== this.props.userScore) {
           //everytime new props received, animate by flashing the background
           this.animateScoreArea();
       }
    }

    animateScoreArea = () => {
        let score_area = document.getElementById("score");
        let anim_colors = [score_area.style.color, "#000", score_area.style.color];
        let current_color = 0;

        let anim_interval = setInterval(frame, 100);
        function frame() {
            if (current_color === 3) {
                clearInterval(anim_interval);
            }
            else {
                score_area.style.color = anim_colors[current_color];
                current_color++;
            }
        }
    }

    render() {
        return(
            <div id="score"
            style={{height: this.props.height, backgroundColor: this.props.bgColor, fontFamily: "Lobster, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "center", padding: "5%"}}>
                    <div style={{fontSize: this.props.height/2.5 + "px"}}>{"#" + this.props.rank}</div>
                    <div style={{fontSize: this.props.height/2.5 + "px"}}>{this.props.name}</div>
                    <div style={{fontSize: this.props.height/2.5 + "px"}}>{this.props.userScore}</div>
                </div>
            </div>
        )
    }
}