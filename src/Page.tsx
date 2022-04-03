import React from "react";
import { TOrientation } from "./App";
import cat0 from "./assets/cat0.jpg";
import cat1 from "./assets/cat1.jpg";
import cat2 from "./assets/cat2.jpg";
import cat3 from "./assets/cat3.jpg";

interface IProps {
  orientation: TOrientation;
}
interface IPhoto {
  size: [number, number];
  image: string;
}

interface INodeBase {
  ar?: number;
  targetAr?: number;
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

interface ILeafNode extends INodeBase {
  label: "P";
  photo: IPhoto;
}

interface IInternalNode extends INodeBase {
  label: "V" | "H";
  children: [INode, INode];
}

type INode = ILeafNode | IInternalNode;

export function Page(props: IProps) {
  const { orientation } = props;
  const pageSize = React.useMemo(
    () =>
      orientation === "portrait"
        ? [850, 1100]
        : orientation === "landscape"
        ? [1100, 850]
        : [1100, 1100],
    [orientation]
  );
  const style = React.useMemo(
    () => ({ width: `${pageSize[0]}px`, height: `${pageSize[1]}px` }),
    [pageSize]
  );
  const cats = [
    useRandomCat(),
    useRandomCat(),
    useRandomCat(),
    useRandomCat(),
    useRandomCat(),
    useRandomCat(),
    useRandomCat(),
  ];

  const pageAr = pageSize[0] / pageSize[1];

  const layout = crateLayoutDivideConquer(cats, pageAr);
  calculateLayout(layout, pageSize[0], pageSize[1]);

  console.log(
    `Canvas filled by ${(
      (Math.min(pageAr, layout.ar!) / Math.max(pageAr, layout.ar!)) *
      100
    ).toFixed(2)}%`
  );

  return (
    <div className="page" style={style}>
      {selectLeafNodes(layout).map((l) => renderPhoto(l))}
    </div>
  );
}

function selectLeafNodes(node: INode): ILeafNode[] {
  if (node.label === "P") {
    return [node];
  } else {
    return selectLeafNodes(node.children[0]).concat(
      selectLeafNodes(node.children[1])
    );
  }
}

function renderPhoto(leaf: ILeafNode) {
  const { left, top, width, height } = leaf;
  const imageStyles = { left, top, width, height };

  return (
    <div className="image" style={imageStyles}>
      <div className="info">
        <dt>Image ratio: {leaf.ar?.toFixed(2)}</dt>
      </div>
      <img src={leaf.photo.image} />
    </div>
  );
}

function useRandomCat(): IPhoto {
  const rand = (min = 0, max = 4) =>
    Math.floor(Math.random() * (max - min)) + min;
  const sizes: [number, number][] = [
    [16, 9],
    [9, 16],
    [4, 3],
    [3, 4],
    [2, 3],
    [3, 2],
    [1, 1],
  ].map((size) => [size[0] * 1000, size[1] * 1000]);

  return [
    { size: sizes[rand(0, 7)], image: cat0 },
    { size: sizes[rand(0, 7)], image: cat1 },
    { size: sizes[rand(0, 7)], image: cat2 },
    { size: sizes[rand(0, 7)], image: cat3 },
  ][rand()];
}

function crateLayoutDivideConquer(photos: IPhoto[], targetAr: number): INode {
  const photoNodes = photos
    .map((p) => createPhotoNode(p))
    .sort((a, b) => a.ar! - b.ar!);

  return createTree(photoNodes, photoNodes.length, targetAr);
}

function createTree(
  photoNodes: ILeafNode[],
  numberOfPhotos: number,
  targetAr: number
): INode {
  if (numberOfPhotos === 1) {
    return chooseOnePhotoNode(photoNodes, targetAr);
  }

  if (numberOfPhotos === 2) {
    return chooseTwoPhotoNode(photoNodes, targetAr);
  }

  const numberOfPhotosFirstChild = Math.floor(numberOfPhotos / 2);
  const numberOfPhotosSecondChild = numberOfPhotos - numberOfPhotosFirstChild;

  // applying golden ratio principle
  const targetArRatioFirstChild = targetAr > 1 ? 0.382 : 2.618;
  const targetArRatioSecondChild = targetAr > 1 ? 0.618 : 1.618;
  // const targetArRatioFirstChild = targetAr > 1 ? 0.5 : 2;
  // const targetArRatioSecondChild = targetAr > 1 ? 0.5 : 2;
  const nodeType = targetAr > 1 ? "H" : "V";

  return {
    label: nodeType,
    children: [
      createTree(
        photoNodes,
        numberOfPhotosFirstChild,
        targetAr * targetArRatioFirstChild
      ),
      createTree(
        photoNodes,
        numberOfPhotosSecondChild,
        targetAr * targetArRatioSecondChild
      ),
    ],
  };
}

function chooseOnePhotoNode(photoNodes: ILeafNode[], targetAr: number) {
  let bestMatchIndex = 0;
  let bestMatchAr = Math.abs(targetAr - photoNodes[0].ar!);

  photoNodes.forEach((p, i) => {
    const ar = Math.abs(targetAr - p.ar!);
    if (ar < bestMatchAr) {
      bestMatchIndex = i;
      bestMatchAr = ar;
    }
  });

  return photoNodes.splice(bestMatchIndex, 1)[0];
}

function chooseTwoPhotoNode(
  photoNodes: ILeafNode[],
  targetAr: number
): IInternalNode {
  let i = 0;
  let p = 0;
  let j = photoNodes.length - 1;
  let q = j;
  let nodeType: "H" | "V" = "H";

  let bestMatchAr = Math.abs(photoNodes[p].ar! + photoNodes[q].ar! - targetAr);

  while (i < j) {
    if (
      Math.abs(photoNodes[i].ar! + photoNodes[j].ar! - targetAr) < bestMatchAr
    ) {
      bestMatchAr = Math.abs(photoNodes[i].ar! + photoNodes[j].ar! - targetAr);
      p = i;
      q = j;
    }

    if (photoNodes[i].ar! + photoNodes[j].ar! > targetAr) {
      j--;
    } else {
      i++;
    }
  }

  i = 0;
  j = photoNodes.length - 1;

  while (i < j) {
    const ar =
      (photoNodes[i].ar! * photoNodes[j].ar!) /
      (photoNodes[i].ar! + photoNodes[j].ar!);
    if (Math.abs(ar - targetAr) < bestMatchAr) {
      bestMatchAr = Math.abs(ar - targetAr);
      p = i;
      q = j;
      nodeType = "V";
    }

    if (ar > targetAr) {
      j--;
    } else {
      i++;
    }
  }

  const result: IInternalNode = {
    label: nodeType,
    children: [photoNodes[p], photoNodes[q]],
  };

  // q > p, we need to remove photoNodes[q] first to make sure photoNodes[p] is still pointing to the right item
  photoNodes.splice(q, 1);
  photoNodes.splice(p, 1);

  return result;
}

function createPhotoNode(photo: IPhoto): ILeafNode {
  return {
    label: "P",
    photo: photo,
    ar: photo.size[0] / photo.size[1],
  };
}

function createLayout(photos: IPhoto[]): INode {
  const photo0 = p(photos[0]);
  const photo1 = p(photos[1]);
  const photo2 = p(photos[2]);
  const photo3 = p(photos[3]);
  const photo4 = p(photos[4]);
  const photo5 = p(photos[5]);
  const photo6 = p(photos[6]);

  return v(
    h(photo0, h(photo1, photo2)),
    h(v(photo3, h(photo4, photo5)), photo6)
  );

  function h(node1: INode, node2: INode): INode {
    return {
      label: "H",
      children: [node1, node2],
    };
  }

  function v(node1: INode, node2: INode): INode {
    return {
      label: "V",
      children: [node1, node2],
    };
  }

  function p(photo: IPhoto): INode {
    return {
      label: "P",
      photo: photo,
      ar: photo.size[0] / photo.size[1],
    };
  }
}

function calculateLayout(root: INode, pageWidth: number, pageHeight: number) {
  const pageRatio = pageWidth / pageHeight;

  fillAspectRatio(root);

  if (root.ar! > pageRatio) {
    root.width = pageWidth;
    root.height = pageWidth / root.ar!;
    root.top = (pageHeight - root.height) / 2;
    root.left = 0;
  } else {
    root.height = pageHeight;
    root.width = pageHeight * root.ar!;
    root.top = 0;
    root.left = (pageWidth - root.width) / 2;
  }

  fillSizes(root);
}

function fillAspectRatio(node: INode): number {
  if (node.label === "P") {
    return node.ar!;
  }

  if (node.label === "H") {
    node.ar =
      fillAspectRatio(node.children[0]) + fillAspectRatio(node.children[1]);

    return node.ar;
  }

  if (node.label === "V") {
    node.ar =
      1 /
      (1 / fillAspectRatio(node.children[0]) +
        1 / fillAspectRatio(node.children[1]));

    return node.ar;
  }

  return 0;
}

function fillSizes(node: INode) {
  if (node.label === "H") {
    node.children[0].height = node.height;
    node.children[0].width = node.height! * node.children[0].ar!;
    node.children[0].top = node.top;
    node.children[0].left = node.left;
    node.children[1].height = node.height;
    node.children[1].width = node.height! * node.children[1].ar!;
    node.children[1].top = node.top;
    node.children[1].left = node.left! + node.children[0].width;
  }
  if (node.label === "V") {
    node.children[0].height = node.width! / node.children[0].ar!;
    node.children[0].width = node.width;
    node.children[0].top = node.top;
    node.children[0].left = node.left;
    node.children[1].height = node.width! / node.children[1].ar!;
    node.children[1].width = node.width;
    node.children[1].top = node.top! + node.children[0].height;
    node.children[1].left = node.left!;
  }

  if (node.label === "H" || node.label === "V") {
    fillSizes(node.children[0]);
    fillSizes(node.children[1]);
  }
}
