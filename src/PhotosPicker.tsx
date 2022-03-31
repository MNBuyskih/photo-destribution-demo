import React from "react";
import {IPhoto} from "./App";

interface IProps {
  photos: IPhoto[];
  onPhotosChange: (photos: IPhoto[]) => void;
}

export function PhotosPicker(props: IProps): JSX.Element {
  const {photos: defaultPhotos, onPhotosChange} = props;
  const [photos, setPhotos] = React.useState(defaultPhotos);

  return (
    <div>
      <br />
      <div><strong>Photos:</strong></div>

      <div className="photos-picker">

      </div>
    </div>
  );
}
