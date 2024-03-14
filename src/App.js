import logo from "./logo.svg";
import "./App.css";
import MainComponent from "./MainComponent";
import bg from "./images/bg.png";
import ChatBox from "./ChatBox";
function App() {
  return (
    <div className="w-screen  flex">
      <img src={bg} className="w-full h-screen absolute inset-0 -z-10" alt="Background"></img>
      <div className="w-2/3"></div>
      <div className="w/1/3">
        <ChatBox></ChatBox>
      </div>

    </div>
  );
}

export default App;
