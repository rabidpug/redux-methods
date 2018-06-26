//@flow

/**
 * @description determines whether the given item is an object
 * @param {*} item
 * @returns {boolean}
 */

export default function isObject ( item: mixed ): boolean {
  return !!item && typeof item === 'object' && !Array.isArray( item );
}
