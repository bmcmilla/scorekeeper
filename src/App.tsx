import { Route } from "@solidjs/router"
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="register" component={Register} />
    </>
  );
}

export default App;