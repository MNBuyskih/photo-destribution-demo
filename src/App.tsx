import React from "react";
import "./App.css";
import {Layout} from "./Layout";
import {Sidebar} from "./Sidebar";

export type TOrientation = "portrait" | "landscape" | "square";

function App() {
  const [orientation, setOrientation] = React.useState<TOrientation>("square");

  return (
    <div className="App">
      <Sidebar orientation={orientation} onOrientationChange={setOrientation} />
      <Layout orientation={orientation} />
    </div>
  );
}

export default App;
