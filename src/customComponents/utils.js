import { AbstractArray } from "@polkadot/types/codec/AbstractArray";

/**
 * @description This checks Arrays,Strings, Maps,Sets for empty state and returns true. It returns false If not empty or Constructor not supported
 * @param {*} type
 * @returns {boolean}
 *
 */
const isEmpty = type => {
  
  switch (type) {
  
    case type instanceof Array || type instanceof String:
      if (!type.length) return true;

      return type.every(el => !el);
    case type instanceof Map || type instanceof Set:
      if (!type.size) return true;
      break;
    case type instanceof AbstractArray:
      
      return type.isEmpty
    default:
      return false;
  }
};

export { isEmpty };
