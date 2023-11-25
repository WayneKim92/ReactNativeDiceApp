export interface EdgeInsets {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

type EdgeInsetsSize = number;

const fromLTRB = (left: EdgeInsetsSize, top: EdgeInsetsSize, right: EdgeInsetsSize, bottom: EdgeInsetsSize) => {
  const paddingLeft = left;
  const paddingTop = top;
  const paddingRight = right;
  const paddingBottom = bottom;

  return {
    paddingLeft: paddingLeft !== 0 ? paddingLeft : undefined,
    paddingTop: paddingTop !== 0 ? paddingTop : undefined,
    paddingRight: paddingRight !== 0 ? paddingRight : undefined,
    paddingBottom: paddingBottom !== 0 ? paddingBottom : undefined,
  };
};
const fromVH = (vertical: EdgeInsetsSize, horizontal: EdgeInsetsSize) =>
  fromLTRB(horizontal, vertical, horizontal, vertical);
const all = (inset: EdgeInsetsSize) => fromLTRB(inset, inset, inset, inset);
const left = (inset: EdgeInsetsSize) => fromLTRB(inset, 0, 0, 0);
const top = (inset: EdgeInsetsSize) => fromLTRB(0, inset, 0, 0);
const right = (inset: EdgeInsetsSize) => fromLTRB(0, 0, inset, 0);
const bottom = (inset: EdgeInsetsSize) => fromLTRB(0, 0, 0, inset);
const vertical = (inset: EdgeInsetsSize) => fromLTRB(0, inset, 0, inset);
const horizontal = (inset: EdgeInsetsSize) => fromLTRB(inset, 0, inset, 0);

export const EdgeInsets = {
  fromLTRB,
  fromVH,
  all,
  left,
  top,
  right,
  bottom,
  vertical,
  horizontal,
};
