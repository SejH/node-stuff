// "Is it difficult because it is complex, or because it is unfamiliar?"
const { set: _set, get: _get, curry, reduceRight, map: lodashMap } = require('lodash');

const foldl = f => z => (l = []) => {
  const [x, ...xs] = l;
  return l.length
    ? foldl(f)(f(z, x))(xs)
    : z;
};

const foldr = f => z => (l = []) => {
  const [x, ...xs] = l;
  return l.length
    ? f(x, foldr(f)(z)(xs))
    : z;
};

module.exports = {
  compose: (...args) => curry(reduceRight)(args)((acc, fn) => fn(acc)),

  map: fn => l => lodashMap(l, fn),
  id: val => () => val,
  add: x => y => y + x,
  mul: x => y => y * x,
  div: x => y => y / x,
  mod: x => y => y % x,
  eq: x => y => y === x,
  gt: x => y => y > x,
  lt: x => y => y < x,
  gte: x => y => y >= x,
  lte: x => y => y <= x,

  delay: t => val => new Promise(resolve => setTimeout(() => resolve(val), t)),

  _map: f => foldl((acc, x) => acc.append(f(x)))([]),
  foldl,
  foldr,

  reverse: foldr((x, acc) => acc.concat(x))([]),
  sum: foldl((acc, x) => acc + x)(0),

  set: (...args) => (
    args.length === 2
      ? obj => _set(obj, args[0], args[1])
      : _set(...args)
  ),
  get: (...args) => (
    args.length === 1
      ? obj => _get(obj, args[0])
      : _get(...args)
  ),

  memoize: fn => {
    const cache = {};
    return (...args) => Object.keys(cache).includes(args)
      ? cache[args]
      : fn(...args);
  },

  promiseLift: fn => (...pArgs) => Promise.all(pArgs).then(args => fn(...args)),
  promiseLiftCurry: fn => (...pArgs) => (
    Promise.all(pArgs).then(args => args.reduce((acc, arg) => acc(arg), fn))
  ),

  // optionOrDefault
  ood: (options, defaultValue) => val => (
    Object.keys(options).includes(val)
      ? options[val]
      : defaultValue(val)
  )
};
