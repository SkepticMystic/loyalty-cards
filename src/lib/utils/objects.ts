import { is_nullish } from ".";

const del_nullish_keys = <T extends Record<string, any>>(obj: T): T => {
  Object.keys(obj).forEach((key) => {
    if (is_nullish(obj[key])) delete obj[key];
  });

  return obj;
};

export const Objects = {
  del_nullish_keys,
};
