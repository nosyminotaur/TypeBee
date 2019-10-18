import React, {Component} from "react";
import Axios from "axios";
import { Alert, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { validateEmail, MIN_PASSWORD_LENGTH, MIN_EMAIL_LENGTH } from "../../services/authServices";

export class EmailLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isLoginSuccess: true,
            loginMessage: "",
            isEmailValid: null,
            isFormValid: true,
            formInvalidText: null
        }
    }

    inputChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        
        //Check email input only, if valid, then display a "tick" sign or else a "cross" sign
        if (e.target.id === "email") {
            //if input is too small
            if (e.target.value.length < 6) {
                this.setState({
                    isEmailValid: null,
                    isFormValid: false,
                    formInvalidText: "Email length must be atleast " + MIN_EMAIL_LENGTH + " characters"
                });
                return;
            }

            if (validateEmail(e.target.value)) {
                this.setState({
                    isEmailValid: "\u2611",
                    isFormValid: true,
                    formInvalidText: null
                });
            } else {
                this.setState({
                    isEmailValid: "\u2717",
                    isFormValid: false,
                    formInvalidText: "Invalid format of email!"
                });
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
            "Email": this.state.email,
            "Password": this.state.password
        }

        Axios.post("api/auth/email-login", data).then((res) => {
            this.setState({
                isLoginSuccess: true
            });
            this.props.history.push("/start");
        }).catch((err) => {
            if (err.response.request.status === 400) {
                let errors = err.response.data.errors;
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
        return(
            <div>
                {/* Two input groups, each taking email and password respectively */}
                <InputGroup>
                    <Input id="email" placeholder="Enter email!" onChange={(event) => this.inputChange(event)} />
                    <InputGroupAddon addonType="append">{this.state.isEmailValid}</InputGroupAddon>
                </InputGroup>
                <br />
                <InputGroup>
                    <Input id="password" type="password" placeholder="Enter password" onChange={(event) => this.inputChange(event)} />
                    <br />
                </InputGroup>
                <br />
                <Alert color="danger" isOpen={!this.state.isFormValid}>
                    {this.state.formInvalidText}
                </Alert>
                {/* Alert to tell user to try again if login was unsuccesful*/}
                <Alert color="danger" isOpen={!this.state.isLoginSuccess}>
                    {this.state.loginMessage}
                </Alert>
                <br />
                <Button outline color="primary" size="lg" disabled={!this.state.isFormValid} onClick={(event) => this.submitLoginForm(event)}>Login!</Button>
                <br />
            </div>
        );
    }
}