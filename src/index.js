import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Game } from "./components/game/Game/Game";
import { StartGameUi } from "./components/game/StartGameUi/StartGameUi";
import { EndGameUi } from './components/game/EndGameUi/EndGameUi';
import * as serviceWorker from './serviceWorker';
import {Route, Router} from "react-router-dom";
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import history from "./services/history";

const app = (
    <Router history = {history}>
    <div>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/start" component={StartGameUi} />
        <Route path="/game" component={Game} />
        <Route path="/end" component={EndGameUi} />
    </div>
    </Router>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
