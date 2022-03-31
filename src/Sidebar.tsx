import React from "react";
import {TOrientation} from "./App";

interface IProps {
  orientation: TOrientation;
  onOrientationChange: (orientation: TOrientation) => void;
}

export function Sidebar(props: IProps): JSX.Element {
  const {orientation, onOrientationChange} = props;
  const handleOrientationChange = React.useCallback((e) => onOrientationChange(e.target.value), [onOrientationChange]);

  return (
    <div className="sidebar">
      <div>
        <label htmlFor={"orientation"}>Page orientation </label>
        <select id={"orientation"} defaultValue={orientation} onChange={handleOrientationChange}>
          <option value="portrait">Portrait</option>
          <option value="square">Square</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>
    </div>
  );
}
