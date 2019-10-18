import React, { Component } from "react";
import { InputGroup, InputGroupAddon, Input, Button, Alert } from 'reactstrap';
import Axios from "axios";
import { validateUsername, validateEmail, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MIN_EMAIL_LENGTH } from "../../services/authServices";

export class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            isUserUniqueText: null,
            isEmailUniqueText: null,
            isSignupSuccess: true,
            isFormValid: true,
            formInvalidText: null,
            signupFailureText: null
        }
    }

    validateEmail(email) {
        let re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateUsername(username) {
        //Same regex present in API
        let re = /^[-_.A-Za-z0-9]+$/;
        return re.test(String(username).toLowerCase());
    }

    inputChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });

        if (event.target.id === "email") {
            this.CheckEmail(event);
        }

        if (event.target.id === "username") {
            this.CheckUserName(event);
        }
    };

    //sends a get request to API to check whether username is valid
    CheckUserName(event) {
        const username = event.target.value;
        this.setState({
            "isUserUniqueText": "\u2611",
            isFormValid: true,
            isSignupSuccess: true
        });

        if (username === null || username === "" || username.length < MIN_USERNAME_LENGTH) {
            this.setState({
                "isUserUniqueText": null,
                isFormValid: false
            });
            return;
        }

        if (!validateUsername(username)) {
            this.setState({
                "isUserUniqueText": "\u2717",
                isFormValid: false,
                formInvalidText: "Invalid format of username!"
            });
            return;
        }

        // Axios.get('api/auth/username-exists/' + username)
        //     .then((res) => {
        //         console.log(res.data);
        //         if (res.data) {
        //             this.setState({
        //                 "isUserUniqueText": "\u2717",
        //                 isFormValid: false,
        //                 formInvalidText: "Username already exists!"
        //             });
        //          return;
        //         }
        //     });
    }

    CheckEmail(event) {
        const email = event.target.value;
        this.setState({
            "isEmailUniqueText": "\u2611",
            isFormValid: true,
            isSignupSuccess: true
        });

        if (email === null || email === "" || email.length < MIN_EMAIL_LENGTH) {
            this.setState({
                "isEmailUniqueText": null,
                isFormValid: false,
                formInvalidText: "Email format incorrect!"
            });
        } else {
            this.setState({
                isFormValid: true,
            });
        }

        if (!validateEmail(email)) {
            this.setState({
                "isEmailUniqueText": "\u2717",
                isFormValid: false,
                formInvalidText: "Invalid format of email!"
            });
        } else {
            this.setState({
                isFormValid: true,
            });
        }

        // Axios.get('api/auth/emailExists/' + email)
        //     .then((res) => {
        //         if (res.data) {
        //             this.setState({
        //                 "isEmailUniqueText": "\u2717",
        //                 isFormValid: false,
        //                 formInvalidText: "Email already exists!"
        //             });
        //         } else {
        //             this.setState({
        //                 isFormValid: true,
        //             });
        //         }
        //     });
    }

    onSignUp(event) {
        event.preventDefault();

        if (this.state.password.length < MIN_PASSWORD_LENGTH) {
            this.setState({
                isFormValid: false,
                formInvalidText: "Password must be atleast " + MIN_PASSWORD_LENGTH + " characters"
            });
            return;
        }

        if (!this.state.isFormValid) {
            return;
        }

        let data = {
            "Email": this.state.email,
            "Username": this.state.username,
            "password": this.state.password
        };

        let headers = {
            'Content-Type': 'application/json'
        };

        Axios.post("api/auth/signup", data, {headers}).then((res) => {
            console.log("Successfully signed up!");
            this.setState({
                isSignupSuccess: true
            });
            this.props.history.push("/login");
        }).catch((err) => {
            console.log(err.response);
            let errors = err.response.data.errors;
            let errorResult = errors.join("\n");
            this.setState({
                isSignupSuccess: false,
                signupFailureText: errorResult
            })
        });
    }

    render() {
        let centerContainer = {
            margin: "auto",
            width: window.innerWidth > 1000 ? "40%" : "80%",
        }
        const { isUserUniqueText } = this.state;
        const { isEmailUniqueText } = this.state;

        let blackContent = {
            "color": "black"
        }

        return (
            <div className="container" style={centerContainer}>
                <h2 style={blackContent} > SignUp for TypeSmash!</h2>
                <br />
                <InputGroup size="lg">
                    {/* Checks if email exists */}
                    <Input id="email" onChange={(event) => { this.inputChange(event) }} placeholder="Enter Email" />
                    {/* Displays tick if email is not taken */}
                    <InputGroupAddon addonType="append">{isEmailUniqueText}</InputGroupAddon>
                </InputGroup>
                <br />
                <InputGroup size="lg">
                    <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                    {/* Checks if username exists */}
                    <Input id="username" onChange={(event) => { this.inputChange(event) }} placeholder="user-name" />
                    {/* Displays tick if username is not taken */}
                    <InputGroupAddon addonType="append">{isUserUniqueText}</InputGroupAddon>
                </InputGroup>
                <br />
                <InputGroup size="lg">
                    <Input id="password" type="password" placeholder="Enter password" onChange={(event) => this.inputChange(event)} />
                    <br />
                </InputGroup>
                <br />
                <Alert color="danger" isOpen={!this.state.isFormValid}>
                    {this.state.formInvalidText}
                </Alert>
                <br />
                <Alert color="danger" isOpen={!this.state.isSignupSuccess}>
                    Could not signup, please try again!
                    <br />
                    {this.state.signupFailureText}
                </Alert>
                <br />
                {/*TODO - Add a disabled attribute*/}
                <Button outline color="primary" size="lg" onClick={(event) => this.onSignUp(event)}>Signup</Button>
                <br />
            </div>
        );
    }
}