import React from "react";
import {TOrientation} from "./App";
import cat0 from "./assets/cat0.jpg";
import cat1 from "./assets/cat1.jpg";
import cat2 from "./assets/cat2.jpg";
import cat3 from "./assets/cat3.jpg";

interface IProps {orientation: TOrientation;}

export function Page(props: IProps) {
  const {orientation} = props;
  const pageSize = React.useMemo(() => orientation === "portrait" ? [850, 1100] : orientation === "landscape" ? [
    1100,
    850,
  ] : [1100, 1100], [orientation]);
  const style = React.useMemo(() => ({width: `${pageSize[0]}px`, height: `${pageSize[1]}px`}), [pageSize]);
  const cat = useRandomCat();
  const {image, size: imageSize} = cat;
  const {top, left, width,height} = useImageLayout(imageSize[0], imageSize[1], pageSize[0], pageSize[1]);

  return <div className="page" style={style}>
    <div className="info">
      <dl>
        <dt>image width:</dt>
        <dd>{imageSize[0]}px</dd>
        <dt>image height:</dt>
        <dd>{imageSize[1]}px</dd>
      </dl>
    </div>
    <img src={image} style={{top, left, width,height}} className="image" />
  </div>;
}

function useImageLayout(imageWidth: number, imageHeight: number, pageWidth: number, pageHeight: number): {
  top: number,
  left: number,
  width: number,
  height: number
} {
  const imageRatio = imageWidth / imageHeight;
  const pageRatio = pageWidth / pageHeight;

  if (imageRatio > pageRatio) {
    const width = pageWidth;
    const height = width / imageRatio;
    const top = (pageHeight - height) / 2;
    const left = 0;
    return {top, left, width, height};
  } else {
    const height = pageHeight;
    const width = height * imageRatio;
    const top = 0;
    const left = (pageWidth - width) / 2;
    return {top, left, width, height};
  }
}

function useRandomCat(min = 0, max = 3) {
  const rand = () => Math.floor(Math.random() * (max - min)) + min;
  const sizes = [[16, 9], [9, 16], [4, 3], [3, 4]].map(size => ([size[0] * 1000, size[1] * 1000]));

  return [
    {size: sizes[rand()], image: cat0},
    {size: sizes[rand()], image: cat1},
    {size: sizes[rand()], image: cat2},
    {size: sizes[rand()], image: cat3},
  ][rand()];
}
