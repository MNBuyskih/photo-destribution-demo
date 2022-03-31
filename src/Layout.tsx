import React from "react";
import {TOrientation} from "./App";
import {Page} from "./Page";

interface IProps {
  orientation: TOrientation;
}

export function Layout(props: IProps): JSX.Element {
  const {orientation} = props;


  return (
    <div className="layout">
      <Page orientation={orientation} />
    </div>
  );
}
