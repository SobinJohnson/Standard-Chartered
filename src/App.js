import logo from "./logo.svg";
import logo1 from "./images/logo.png";
import "./App.css";
import MainComponent from "./MainComponent";
import bg from "./images/bg.png";
import ChatBox from "./ChatBox";
function App() {
  return (
    <div className="absolute inset-0">
      <img src={bg} className="w-full h-full object-cover" alt="Background" />
      <div className="absolute inset-0 flex  items-left">
      </div>
      <div className=" grid grid-cols-2 absolute inset-0">
        <div>
          <div className=" text-white pl-16 pt-72 ">
            <h1 className="font-semibold text-6xl">KYC BOT</h1>
            <h2 className=" pt-10 text-xl p">
            Introducing our revolutionary KYC bot – the ultimate solution for swift and hassle-free online verifications! 
            Say goodbye to long wait times and paperwork. 
            </h2>
          </div>
        </div>
        <div className="h-screen p-10"> 
          <ChatBox></ChatBox>
        </div>
      </div>
    </div>
  );
}

export default App;
