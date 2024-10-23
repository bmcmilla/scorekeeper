import Navbar from "./Navbar";

const App = (props) => {

  return (
    <div class="min-h-screen flex flex-col">
      <Navbar />
      <main class="flex-grow">
        {props.children}
      </main>
      <footer class="footer bg-neutral text-neutral-content items-center p-4">
        <aside class="grid-flow-col items-center">
          <p>Copyright © {new Date().getFullYear()} Tens e Mais. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;