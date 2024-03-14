import logo from "./logo.svg";
import logo1 from "./images/logo.png";
import "./App.css";
import MainComponent from "./MainComponent";
import bg from "./images/bg.png";
function App() {
  return (
    <div className="absolute inset-0">
      <img src={bg} className="w-full h-full object-cover" alt="Background" />
      <div className="absolute inset-0 flex  items-left">
        <img src={logo1} className="h-24 " alt="Logo" />
      </div>
      <div className=" grid grid-cols-2 absolute inset-0">
        <div>
          <div className=" text-white pl-16 pt-72 ">
            <h1 className="font-semibold text-6xl">Lorem Ipsum</h1>
            <h2 className=" pt-10 text-xl p">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
              dicta minus molestiae vel beatae natus eveniet ratione temporibus
              aperiam harum alias officiis assumenda officia quibusdam deleniti
              eos cupiditate dolore doloribus!
            </h2>
          </div>
        </div>
        <div>h</div>
      </div>
    </div>
  );
}

export default App;
