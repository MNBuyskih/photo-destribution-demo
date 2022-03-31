import React from "react";
import {TOrientation} from "./App";

const ORIENTATIONS: TOrientation[] = ["portrait", "square", "landscape"];

interface IProps {
  orientation: TOrientation;
  onOrientationChange(orientation: TOrientation): void;
}

export function OrientationPicker(props: IProps): JSX.Element {
  const {orientation, onOrientationChange} = props;

  return (
    <div>
      <strong>Page orientation:</strong>
      {ORIENTATIONS.map(o => <Orientation key={o} orientation={o} onChange={onOrientationChange} isChecked={o === orientation} />)}</div>

  );
}

interface IOrientationProps {
  orientation: TOrientation,
  isChecked: boolean,
  onChange: (orientation: TOrientation) => void
}

function Orientation(props: IOrientationProps): JSX.Element {
  const {orientation, isChecked, onChange} = props;
  const handleChange = React.useCallback(() => onChange(orientation), [onChange, orientation]);

  return (
    <div>
      <label>
        <input checked={isChecked}
               name="orientation"
               type="radio"
               id="orientation"
               value={orientation}
               onChange={handleChange} />
        {orientation}
      </label>
    </div>
  );
}
