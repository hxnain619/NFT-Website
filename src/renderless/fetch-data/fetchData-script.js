export const parsePolygonCollection = (result) => {
  return result.map((val) => ({
    ...val,
    type: "collections",
  }));
};
export const parsePolygonSingle = (result) => {
  return result.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
export const parseAvaxSingle = (result) => {
  return result.map((val) => ({
    ...val,
    type: "1of1",
  }));
};
