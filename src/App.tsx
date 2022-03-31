import React from "react";
import "./App.css";
import {Layout} from "./Layout";
import {Sidebar} from "./Sidebar";

export type TOrientation = "portrait" | "landscape" | "square";

export interface IPhoto {
  width: number;
  height: number;
  src: string;
}

function App() {
  const [orientation, setOrientation] = React.useState<TOrientation>("square");
  const [photos, setPhotos] = React.useState<IPhoto[]>([]);

  return (
    <div className="App">
      <Sidebar
        orientation={orientation}
        onOrientationChange={setOrientation}
        photos={photos}
        onPhotosChange={setPhotos}
      />
      <Layout orientation={orientation} />
    </div>
  );
}

export default App;
