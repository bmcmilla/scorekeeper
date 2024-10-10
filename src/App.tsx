import Navbar from "./components/Navbar";

const App = (props) => {

  return (
    <>
      <Navbar />
      {props.children}
      <footer class="footer bg-neutral text-neutral-content items-center p-4">
        <aside class="grid-flow-col items-center">
          <p>Copyright © {new Date().getFullYear()} Tens e Mais. All rights reserved.</p>
        </aside>
      </footer>
    </>
  );
}

export default App;