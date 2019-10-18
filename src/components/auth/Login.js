import React, { Component } from "react";
import { EmailLogin } from "./EmailLogin";
import { UsernameLogin } from "./UsernameLogin";
import { Button, ButtonGroup } from "reactstrap";

export class Login extends Component {

    componentDidMount() {
        // check if we are logged in
        if (this.props.isLoggedIn === true) {
            // redirect to /game
            // should instead have no login button, but instead a signout button 
            // if we are already logged in
            this.props.history.push("/game");
        }
    }

    state = {
        loginMethod: "username"
    }

    switchLoginMethod = () => {
        if (this.state.loginMethod === "username") {
            this.setState({ loginMethod: "email" });
        }
        else {
            this.setState({ loginMethod: "username" });
        }
    }

    changeLoginMethod(event) {
        this.setState({
            loginMethod: event.target.id
        });
    }

    render() {
        let centerContainer = {
            color: "black",
            padding: "3%",
            width: "80%",
        };

        return (
            <div className="container" style={centerContainer} >
                <h2>Welcome Back!</h2>
                <h5>Please login to continue!</h5>
                <br />
                <ButtonGroup size="lg">
                    <Button id="username" outline={this.state.loginMethod !== "username"} color="info" onClick={(event) => this.changeLoginMethod(event)}>
                        Enter Username
                </Button>
                    <Button id="email" outline={this.state.loginMethod !== "email"} color="info" onClick={(event) => this.changeLoginMethod(event)}>
                        Enter Email
                    </Button>
                </ButtonGroup>
                <br />
                <br />
                {this.state.loginMethod === "username" ? // conditional rendering
                    <React.Fragment>
                        <UsernameLogin />
                    </React.Fragment>
                    : // else
                    <React.Fragment>
                        <EmailLogin />
                    </React.Fragment>
                }
            </div>
        );
    }
}