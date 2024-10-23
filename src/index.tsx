/* @refresh reload */
import './index.css';
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Game from "./components/Game";
import App from './components/App';

const root = document.getElementById('root');

render(() =>
  <Router root={App}>
    <Route path="/" component={Dashboard} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/game/:id" component={Game} />
  </Router>
  , root!);
