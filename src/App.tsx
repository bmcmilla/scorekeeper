import { Route } from "@solidjs/router"
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Game from "./components/Game";

const App = () => {

  return (
    <>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/game" component={Game} />      
    </>
  );
}

export default App;