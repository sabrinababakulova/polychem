import { every } from "lodash";

export const isObjectValuesNotEmpty = (obj) => {
  return every(
    obj,
    (value) => value !== null && value !== undefined && value !== ""
  );
};
