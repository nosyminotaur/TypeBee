import React, {Component} from "react";
import Axios from "axios";
import { Alert, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { validateUsername, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../../services/authServices";

export class UsernameLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            isLoginSuccess: true,
            loginMessage: "",
            isUsernameValid: null,
            isFormValid: true,
            formInvalidText: null
        }
    }

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        
        //Check username input only, if valid, then display a "tick" sign or else a "cross" sign
        if (e.target.id === "username") {
            //if input is too small
            if (e.target.value.length < MIN_USERNAME_LENGTH) {
                this.setState({
                    isUsernameValid: null,
                    isFormValid: false,
                    formInvalidText: "Username length must be atleast " + MIN_USERNAME_LENGTH + " characters"
                });
                return;
            }

            if (validateUsername(e.target.value)) {
                this.setState({
                    isUsernameValid: "\u2611",
                    isFormValid: true,
                    formInvalidText: null
                });
            } else {
                this.setState({
                    isUsernameValid: "\u2717",
                    isFormValid: false,
                    formInvalidText: 
                    <p>Invalid format of username!
                        <p>Allowed special characters:
                        <ul>
                            <li>Dash</li>
                            <li>Underscore</li>
                            <li>Dot</li>
                        </ul>
                        </p>
                    </p>
                })
            }
        }

        if (e.target.id === "password") {
            if (e.target.value.length < MIN_PASSWORD_LENGTH) {
                this.setState({
                    isFormValid: false,
                    formInvalidText: "Password must be atleast " + MIN_PASSWORD_LENGTH + " characters"
                });
            } else {
                this.setState({
                    isFormValid: true,
                    formInvalidText: null
                });
            }
        }
    };

    submitLoginForm(event) {
        event.preventDefault();

        if (!this.state.isFormValid) {
            return;
        }

        let data = {
            "Username": this.state.username,
            "Password": this.state.password
        }

        Axios.post("api/auth/username-login", data).then((res) => {
            this.setState({
                isLoginSuccess: true
            });
            this.props.history.push("/game");
        }).catch((err) => {
            if (err.response.request.status === 400) {
                // console.log(err.response);
                let errors = err.response.data.errors.join("\n");
                this.setState({
                    isLoginSuccess: false,
                    loginMessage: errors
                });
            } else {
                this.setState({
                    isLoginSuccess: false,
                    loginMessage: "Could not login, please try again!"
                });
            }
        });
    }

    render(){
        return (
            <div>
                <InputGroup>
                    <Input id="username" placeholder="user-name" onChange={(event) => this.inputChange(event)} />
                    <InputGroupAddon addonType="append">{this.state.isUsernameValid}</InputGroupAddon>
                </InputGroup>
                <br />
                <InputGroup>
                    <Input id="password" type="password" placeholder="password" onChange={(event) => this.inputChange(event)} />
                    <br />
                </InputGroup>
                <br />
                <Alert color="danger" isOpen={!this.state.isFormValid}>
                    {this.state.formInvalidText}
                </Alert>
                <br />
                {/* Alert to tell user to try again if login was unsuccesful*/}
                <Alert color="danger" isOpen={!this.state.isLoginSuccess}>
                    {this.state.loginMessage}
                </Alert>
                <Button outline color="primary" size="lg" disabled={!this.state.isFormValid} onClick={(event) => this.submitLoginForm(event)}>Login!</Button>
                <br />
            </div>
        );
    }
}