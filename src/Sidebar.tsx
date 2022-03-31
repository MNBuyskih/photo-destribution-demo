import React from "react";
import {PhotosPicker} from "./PhotosPicker";
import {IPhoto, TOrientation} from "./App";
import {OrientationPicker} from "./OrientationPicker";

interface IProps {
  photos: IPhoto[];
  orientation: TOrientation;
  onOrientationChange(orientation: TOrientation): void;
  onPhotosChange(photos: IPhoto[]): void;
}

export function Sidebar(props: IProps): JSX.Element {
  const {orientation, photos, onOrientationChange, onPhotosChange} = props;

  return (
    <div className="sidebar">
      <OrientationPicker orientation={orientation} onOrientationChange={onOrientationChange} />
      <PhotosPicker photos={photos} onPhotosChange={onPhotosChange} />
    </div>
  );
}
