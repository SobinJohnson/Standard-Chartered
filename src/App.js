import logo from "./logo.svg";
import "./App.css";
import MainComponent from "./MainComponent";
import bg from "./images/bg.png";
function App() {
  return (
    <div className="w-screen">
      <img src={bg} className="w-full h-screen" alt="Background"></img>
    </div>
  );
}

export default App;
