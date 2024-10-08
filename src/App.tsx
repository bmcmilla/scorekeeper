import Navbar from "./components/Navbar";

const App = (props) => {

  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
}

export default App;