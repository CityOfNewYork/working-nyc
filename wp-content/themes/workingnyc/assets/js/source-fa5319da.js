(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire (path) {
		throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$J =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$V = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$U = fails$V;

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails$U(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var objectPropertyIsEnumerable = {};

	var nativePropertyIsEnumerable$1 = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor$8 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$8 && !nativePropertyIsEnumerable$1.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$8(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable$1;

	var createPropertyDescriptor$9 = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString$3 = {}.toString;

	var classofRaw$1 = function (it) {
	  return toString$3.call(it).slice(8, -1);
	};

	var fails$T = fails$V;
	var classof$g = classofRaw$1;

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$T(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$g(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$f = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$4 = indexedObject;
	var requireObjectCoercible$e = requireObjectCoercible$f;

	var toIndexedObject$d = function (it) {
	  return IndexedObject$4(requireObjectCoercible$e(it));
	};

	var isObject$z = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var isObject$y = isObject$z;

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive$b = function (input, PREFERRED_STRING) {
	  if (!isObject$y(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$y(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject$y(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject$y(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty$1 = {}.hasOwnProperty;

	var has$l = function (it, key) {
	  return hasOwnProperty$1.call(it, key);
	};

	var global$I = global$J;
	var isObject$x = isObject$z;

	var document$2 = global$I.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject$x(document$2) && isObject$x(document$2.createElement);

	var documentCreateElement$1 = function (it) {
	  return EXISTS ? document$2.createElement(it) : {};
	};

	var DESCRIPTORS$w = descriptors;
	var fails$S = fails$V;
	var createElement$3 = documentCreateElement$1;

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$w && !fails$S(function () {
	  return Object.defineProperty(createElement$3('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var DESCRIPTORS$v = descriptors;
	var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$8 = createPropertyDescriptor$9;
	var toIndexedObject$c = toIndexedObject$d;
	var toPrimitive$a = toPrimitive$b;
	var has$k = has$l;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	var nativeGetOwnPropertyDescriptor$3 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$v ? nativeGetOwnPropertyDescriptor$3 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$c(O);
	  P = toPrimitive$a(P, true);
	  if (IE8_DOM_DEFINE$1) try {
	    return nativeGetOwnPropertyDescriptor$3(O, P);
	  } catch (error) { /* empty */ }
	  if (has$k(O, P)) return createPropertyDescriptor$8(!propertyIsEnumerableModule$2.f.call(O, P), O[P]);
	};

	var objectDefineProperty = {};

	var isObject$w = isObject$z;

	var anObject$x = function (it) {
	  if (!isObject$w(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var DESCRIPTORS$u = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var anObject$w = anObject$x;
	var toPrimitive$9 = toPrimitive$b;

	var nativeDefineProperty$2 = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$u ? nativeDefineProperty$2 : function defineProperty(O, P, Attributes) {
	  anObject$w(O);
	  P = toPrimitive$9(P, true);
	  anObject$w(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return nativeDefineProperty$2(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$t = descriptors;
	var definePropertyModule$c = objectDefineProperty;
	var createPropertyDescriptor$7 = createPropertyDescriptor$9;

	var createNonEnumerableProperty$g = DESCRIPTORS$t ? function (object, key, value) {
	  return definePropertyModule$c.f(object, key, createPropertyDescriptor$7(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var redefine$g = {exports: {}};

	var global$H = global$J;
	var createNonEnumerableProperty$f = createNonEnumerableProperty$g;

	var setGlobal$3 = function (key, value) {
	  try {
	    createNonEnumerableProperty$f(global$H, key, value);
	  } catch (error) {
	    global$H[key] = value;
	  } return value;
	};

	var global$G = global$J;
	var setGlobal$2 = setGlobal$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$G[SHARED] || setGlobal$2(SHARED, {});

	var sharedStore = store$3;

	var store$2 = sharedStore;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof store$2.inspectSource != 'function') {
	  store$2.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource$3 = store$2.inspectSource;

	var global$F = global$J;
	var inspectSource$2 = inspectSource$3;

	var WeakMap$1 = global$F.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource$2(WeakMap$1));

	var shared$3 = {exports: {}};

	var isPure = false;

	var store$1 = sharedStore;

	(shared$3.exports = function (key, value) {
	  return store$1[key] || (store$1[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode: 'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});

	var id$2 = 0;
	var postfix = Math.random();

	var uid$8 = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id$2 + postfix).toString(36);
	};

	var shared$2 = shared$3.exports;
	var uid$7 = uid$8;

	var keys$3 = shared$2('keys');

	var sharedKey$4 = function (key) {
	  return keys$3[key] || (keys$3[key] = uid$7(key));
	};

	var hiddenKeys$6 = {};

	var NATIVE_WEAK_MAP$1 = nativeWeakMap;
	var global$E = global$J;
	var isObject$v = isObject$z;
	var createNonEnumerableProperty$e = createNonEnumerableProperty$g;
	var objectHas = has$l;
	var sharedKey$3 = sharedKey$4;
	var hiddenKeys$5 = hiddenKeys$6;

	var WeakMap = global$E.WeakMap;
	var set$4, get$2, has$j;

	var enforce = function (it) {
	  return has$j(it) ? get$2(it) : set$4(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$v(it) || (state = get$2(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP$1) {
	  var store = new WeakMap();
	  var wmget = store.get;
	  var wmhas = store.has;
	  var wmset = store.set;
	  set$4 = function (it, metadata) {
	    wmset.call(store, it, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return wmget.call(store, it) || {};
	  };
	  has$j = function (it) {
	    return wmhas.call(store, it);
	  };
	} else {
	  var STATE = sharedKey$3('state');
	  hiddenKeys$5[STATE] = true;
	  set$4 = function (it, metadata) {
	    createNonEnumerableProperty$e(it, STATE, metadata);
	    return metadata;
	  };
	  get$2 = function (it) {
	    return objectHas(it, STATE) ? it[STATE] : {};
	  };
	  has$j = function (it) {
	    return objectHas(it, STATE);
	  };
	}

	var internalState = {
	  set: set$4,
	  get: get$2,
	  has: has$j,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var global$D = global$J;
	var createNonEnumerableProperty$d = createNonEnumerableProperty$g;
	var has$i = has$l;
	var setGlobal$1 = setGlobal$3;
	var inspectSource$1 = inspectSource$3;
	var InternalStateModule$c = internalState;

	var getInternalState$8 = InternalStateModule$c.get;
	var enforceInternalState = InternalStateModule$c.enforce;
	var TEMPLATE = String(String).split('String');

	(redefine$g.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has$i(value, 'name')) createNonEnumerableProperty$d(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global$D) {
	    if (simple) O[key] = value;
	    else setGlobal$1(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty$d(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState$8(this).source || inspectSource$1(this);
	});

	var global$C = global$J;

	var path$5 = global$C;

	var path$4 = path$5;
	var global$B = global$J;

	var aFunction$g = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn$d = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$g(path$4[namespace]) || aFunction$g(global$B[namespace])
	    : path$4[namespace] && path$4[namespace][method] || global$B[namespace] && global$B[namespace][method];
	};

	var objectGetOwnPropertyNames = {};

	var ceil$2 = Math.ceil;
	var floor$9 = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger$c = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$9 : ceil$2)(argument);
	};

	var toInteger$b = toInteger$c;

	var min$8 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength$t = function (argument) {
	  return argument > 0 ? min$8(toInteger$b(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toInteger$a = toInteger$c;

	var max$3 = Math.max;
	var min$7 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$8 = function (index, length) {
	  var integer = toInteger$a(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$7(integer, length);
	};

	var toIndexedObject$b = toIndexedObject$d;
	var toLength$s = toLength$t;
	var toAbsoluteIndex$7 = toAbsoluteIndex$8;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$6 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$b($this);
	    var length = toLength$s(O.length);
	    var index = toAbsoluteIndex$7(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod$6(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$6(false)
	};

	var has$h = has$l;
	var toIndexedObject$a = toIndexedObject$d;
	var indexOf = arrayIncludes.indexOf;
	var hiddenKeys$4 = hiddenKeys$6;

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$a(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has$h(hiddenKeys$4, key) && has$h(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$h(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;

	var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$3);
	};

	var objectGetOwnPropertySymbols = {};

	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$c = getBuiltIn$d;
	var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
	var anObject$v = anObject$x;

	// all object keys, includes non-enumerable and symbols
	var ownKeys$3 = getBuiltIn$c('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule$1.f(anObject$v(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$2.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var has$g = has$l;
	var ownKeys$2 = ownKeys$3;
	var getOwnPropertyDescriptorModule$6 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$b = objectDefineProperty;

	var copyConstructorProperties$2 = function (target, source) {
	  var keys = ownKeys$2(source);
	  var defineProperty = definePropertyModule$b.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$6.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has$g(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var fails$R = fails$V;

	var replacement = /#|\.prototype\./;

	var isForced$5 = function (feature, detection) {
	  var value = data$1[normalize$1(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails$R(detection)
	    : !!detection;
	};

	var normalize$1 = isForced$5.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data$1 = isForced$5.data = {};
	var NATIVE = isForced$5.NATIVE = 'N';
	var POLYFILL = isForced$5.POLYFILL = 'P';

	var isForced_1 = isForced$5;

	var global$A = global$J;
	var getOwnPropertyDescriptor$7 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$c = createNonEnumerableProperty$g;
	var redefine$f = redefine$g.exports;
	var setGlobal = setGlobal$3;
	var copyConstructorProperties$1 = copyConstructorProperties$2;
	var isForced$4 = isForced_1;

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$A;
	  } else if (STATIC) {
	    target = global$A[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global$A[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$7(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced$4(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties$1(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty$c(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine$f(target, key, sourceProperty, options);
	  }
	};

	var fails$Q = fails$V;

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$Q(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var NATIVE_SYMBOL$2 = nativeSymbol;

	var useSymbolAsUid = NATIVE_SYMBOL$2
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var classof$f = classofRaw$1;

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray$7 = Array.isArray || function isArray(arg) {
	  return classof$f(arg) == 'Array';
	};

	var requireObjectCoercible$d = requireObjectCoercible$f;

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject$o = function (argument) {
	  return Object(requireObjectCoercible$d(argument));
	};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys$4 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$s = descriptors;
	var definePropertyModule$a = objectDefineProperty;
	var anObject$u = anObject$x;
	var objectKeys$3 = objectKeys$4;

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = DESCRIPTORS$s ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$u(O);
	  var keys = objectKeys$3(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule$a.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var getBuiltIn$b = getBuiltIn$d;

	var html$3 = getBuiltIn$b('document', 'documentElement');

	var anObject$t = anObject$x;
	var defineProperties$2 = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys$2 = hiddenKeys$6;
	var html$2 = html$3;
	var documentCreateElement = documentCreateElement$1;
	var sharedKey$2 = sharedKey$4;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE$2 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$2('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$2.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$2[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$2] = anObject$t(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : defineProperties$2(result, Properties);
	};

	var objectGetOwnPropertyNamesExternal = {};

	var toIndexedObject$9 = toIndexedObject$d;
	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNames.f;

	var toString$2 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames$2(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && toString$2.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames$2(toIndexedObject$9(it));
	};

	var global$z = global$J;
	var shared$1 = shared$3.exports;
	var has$f = has$l;
	var uid$6 = uid$8;
	var NATIVE_SYMBOL$1 = nativeSymbol;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var WellKnownSymbolsStore$1 = shared$1('wks');
	var Symbol$1 = global$z.Symbol;
	var createWellKnownSymbol = USE_SYMBOL_AS_UID$1 ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$6;

	var wellKnownSymbol$u = function (name) {
	  if (!has$f(WellKnownSymbolsStore$1, name)) {
	    if (NATIVE_SYMBOL$1 && has$f(Symbol$1, name)) WellKnownSymbolsStore$1[name] = Symbol$1[name];
	    else WellKnownSymbolsStore$1[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore$1[name];
	};

	var wellKnownSymbolWrapped = {};

	var wellKnownSymbol$t = wellKnownSymbol$u;

	wellKnownSymbolWrapped.f = wellKnownSymbol$t;

	var path$3 = path$5;
	var has$e = has$l;
	var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
	var defineProperty$d = objectDefineProperty.f;

	var defineWellKnownSymbol$e = function (NAME) {
	  var Symbol = path$3.Symbol || (path$3.Symbol = {});
	  if (!has$e(Symbol, NAME)) defineProperty$d(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule$1.f(NAME)
	  });
	};

	var defineProperty$c = objectDefineProperty.f;
	var has$d = has$l;
	var wellKnownSymbol$s = wellKnownSymbol$u;

	var TO_STRING_TAG$4 = wellKnownSymbol$s('toStringTag');

	var setToStringTag$a = function (it, TAG, STATIC) {
	  if (it && !has$d(it = STATIC ? it : it.prototype, TO_STRING_TAG$4)) {
	    defineProperty$c(it, TO_STRING_TAG$4, { configurable: true, value: TAG });
	  }
	};

	var aFunction$f = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	var aFunction$e = aFunction$f;

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$e(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var isObject$u = isObject$z;
	var isArray$6 = isArray$7;
	var wellKnownSymbol$r = wellKnownSymbol$u;

	var SPECIES$6 = wellKnownSymbol$r('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate$5 = function (originalArray, length) {
	  var C;
	  if (isArray$6(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray$6(C.prototype))) C = undefined;
	    else if (isObject$u(C)) {
	      C = C[SPECIES$6];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var bind$d = functionBindContext;
	var IndexedObject$3 = indexedObject;
	var toObject$n = toObject$o;
	var toLength$r = toLength$t;
	var arraySpeciesCreate$4 = arraySpeciesCreate$5;

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$5 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$n($this);
	    var self = IndexedObject$3(O);
	    var boundFunction = bind$d(callbackfn, that, 3);
	    var length = toLength$r(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate$4;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$5(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$5(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$5(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$5(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$5(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$5(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$5(6)
	};

	var $$2i = _export;
	var global$y = global$J;
	var getBuiltIn$a = getBuiltIn$d;
	var DESCRIPTORS$r = descriptors;
	var NATIVE_SYMBOL = nativeSymbol;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;
	var fails$P = fails$V;
	var has$c = has$l;
	var isArray$5 = isArray$7;
	var isObject$t = isObject$z;
	var anObject$s = anObject$x;
	var toObject$m = toObject$o;
	var toIndexedObject$8 = toIndexedObject$d;
	var toPrimitive$8 = toPrimitive$b;
	var createPropertyDescriptor$6 = createPropertyDescriptor$9;
	var nativeObjectCreate = objectCreate;
	var objectKeys$2 = objectKeys$4;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var getOwnPropertyDescriptorModule$5 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$9 = objectDefineProperty;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var createNonEnumerableProperty$b = createNonEnumerableProperty$g;
	var redefine$e = redefine$g.exports;
	var shared = shared$3.exports;
	var sharedKey$1 = sharedKey$4;
	var hiddenKeys$1 = hiddenKeys$6;
	var uid$5 = uid$8;
	var wellKnownSymbol$q = wellKnownSymbol$u;
	var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
	var defineWellKnownSymbol$d = defineWellKnownSymbol$e;
	var setToStringTag$9 = setToStringTag$a;
	var InternalStateModule$b = internalState;
	var $forEach$2 = arrayIteration.forEach;

	var HIDDEN = sharedKey$1('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE$1 = wellKnownSymbol$q('toPrimitive');
	var setInternalState$c = InternalStateModule$b.set;
	var getInternalState$7 = InternalStateModule$b.getterFor(SYMBOL);
	var ObjectPrototype$3 = Object[PROTOTYPE$1];
	var $Symbol = global$y.Symbol;
	var $stringify$1 = getBuiltIn$a('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$2 = getOwnPropertyDescriptorModule$5.f;
	var nativeDefineProperty$1 = definePropertyModule$9.f;
	var nativeGetOwnPropertyNames$1 = getOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = propertyIsEnumerableModule$1.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore = shared('wks');
	var QObject = global$y.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = DESCRIPTORS$r && fails$P(function () {
	  return nativeObjectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$2(ObjectPrototype$3, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$3[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$3) {
	    nativeDefineProperty$1(ObjectPrototype$3, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap$1 = function (tag, description) {
	  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$c(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!DESCRIPTORS$r) symbol.description = description;
	  return symbol;
	};

	var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$3) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject$s(O);
	  var key = toPrimitive$8(P, true);
	  anObject$s(Attributes);
	  if (has$c(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has$c(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor$6(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has$c(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$6(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject$s(O);
	  var properties = toIndexedObject$8(Properties);
	  var keys = objectKeys$2(properties).concat($getOwnPropertySymbols(properties));
	  $forEach$2(keys, function (key) {
	    if (!DESCRIPTORS$r || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive$8(V, true);
	  var enumerable = nativePropertyIsEnumerable.call(this, P);
	  if (this === ObjectPrototype$3 && has$c(AllSymbols, P) && !has$c(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has$c(this, P) || !has$c(AllSymbols, P) || has$c(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject$8(O);
	  var key = toPrimitive$8(P, true);
	  if (it === ObjectPrototype$3 && has$c(AllSymbols, key) && !has$c(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$2(it, key);
	  if (descriptor && has$c(AllSymbols, key) && !(has$c(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject$8(O));
	  var result = [];
	  $forEach$2(names, function (key) {
	    if (!has$c(AllSymbols, key) && !has$c(hiddenKeys$1, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$3;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$8(O));
	  var result = [];
	  $forEach$2(names, function (key) {
	    if (has$c(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has$c(ObjectPrototype$3, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!NATIVE_SYMBOL) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid$5(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$3) setter.call(ObjectPrototypeSymbols, value);
	      if (has$c(this, HIDDEN) && has$c(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor$6(1, value));
	    };
	    if (DESCRIPTORS$r && USE_SETTER) setSymbolDescriptor(ObjectPrototype$3, tag, { configurable: true, set: setter });
	    return wrap$1(tag, description);
	  };

	  redefine$e($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$7(this).tag;
	  });

	  redefine$e($Symbol, 'withoutSetter', function (description) {
	    return wrap$1(uid$5(description), description);
	  });

	  propertyIsEnumerableModule$1.f = $propertyIsEnumerable;
	  definePropertyModule$9.f = $defineProperty;
	  getOwnPropertyDescriptorModule$5.f = $getOwnPropertyDescriptor;
	  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  getOwnPropertySymbolsModule$1.f = $getOwnPropertySymbols;

	  wrappedWellKnownSymbolModule.f = function (name) {
	    return wrap$1(wellKnownSymbol$q(name), name);
	  };

	  if (DESCRIPTORS$r) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$7(this).description;
	      }
	    });
	    {
	      redefine$e(ObjectPrototype$3, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	$$2i({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
	  Symbol: $Symbol
	});

	$forEach$2(objectKeys$2(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol$d(name);
	});

	$$2i({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has$c(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has$c(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	$$2i({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS$r }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	$$2i({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	$$2i({ target: 'Object', stat: true, forced: fails$P(function () { getOwnPropertySymbolsModule$1.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return getOwnPropertySymbolsModule$1.f(toObject$m(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify$1) {
	  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails$P(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify$1([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify$1({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify$1(Object(symbol)) != '{}';
	  });

	  $$2i({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject$t(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray$5(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify$1.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE$1]) {
	  createNonEnumerableProperty$b($Symbol[PROTOTYPE$1], TO_PRIMITIVE$1, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag$9($Symbol, SYMBOL);

	hiddenKeys$1[HIDDEN] = true;

	var defineWellKnownSymbol$c = defineWellKnownSymbol$e;

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol$c('asyncIterator');

	var $$2h = _export;
	var DESCRIPTORS$q = descriptors;
	var global$x = global$J;
	var has$b = has$l;
	var isObject$s = isObject$z;
	var defineProperty$b = objectDefineProperty.f;
	var copyConstructorProperties = copyConstructorProperties$2;

	var NativeSymbol = global$x.Symbol;

	if (DESCRIPTORS$q && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$b(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject$s(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has$b(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  $$2h({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var defineWellKnownSymbol$b = defineWellKnownSymbol$e;

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol$b('hasInstance');

	var defineWellKnownSymbol$a = defineWellKnownSymbol$e;

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol$a('isConcatSpreadable');

	var defineWellKnownSymbol$9 = defineWellKnownSymbol$e;

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol$9('iterator');

	var defineWellKnownSymbol$8 = defineWellKnownSymbol$e;

	// `Symbol.match` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.match
	defineWellKnownSymbol$8('match');

	var defineWellKnownSymbol$7 = defineWellKnownSymbol$e;

	// `Symbol.matchAll` well-known symbol
	defineWellKnownSymbol$7('matchAll');

	var defineWellKnownSymbol$6 = defineWellKnownSymbol$e;

	// `Symbol.replace` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.replace
	defineWellKnownSymbol$6('replace');

	var defineWellKnownSymbol$5 = defineWellKnownSymbol$e;

	// `Symbol.search` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.search
	defineWellKnownSymbol$5('search');

	var defineWellKnownSymbol$4 = defineWellKnownSymbol$e;

	// `Symbol.species` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.species
	defineWellKnownSymbol$4('species');

	var defineWellKnownSymbol$3 = defineWellKnownSymbol$e;

	// `Symbol.split` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.split
	defineWellKnownSymbol$3('split');

	var defineWellKnownSymbol$2 = defineWellKnownSymbol$e;

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol$2('toPrimitive');

	var defineWellKnownSymbol$1 = defineWellKnownSymbol$e;

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol$1('toStringTag');

	var defineWellKnownSymbol = defineWellKnownSymbol$e;

	// `Symbol.unscopables` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	var DESCRIPTORS$p = descriptors;
	var fails$O = fails$V;
	var objectKeys$1 = objectKeys$4;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var toObject$l = toObject$o;
	var IndexedObject$2 = indexedObject;

	var nativeAssign = Object.assign;
	var defineProperty$a = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails$O(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS$p && nativeAssign({ b: 1 }, nativeAssign(defineProperty$a({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$a(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys$1(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject$l(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;
	  while (argumentsLength > index) {
	    var S = IndexedObject$2(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys$1(S).concat(getOwnPropertySymbols(S)) : objectKeys$1(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS$p || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	var $$2g = _export;
	var assign$1 = objectAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	$$2g({ target: 'Object', stat: true, forced: Object.assign !== assign$1 }, {
	  assign: assign$1
	});

	var $$2f = _export;
	var DESCRIPTORS$o = descriptors;
	var create$8 = objectCreate;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	$$2f({ target: 'Object', stat: true, sham: !DESCRIPTORS$o }, {
	  create: create$8
	});

	var $$2e = _export;
	var DESCRIPTORS$n = descriptors;
	var objectDefinePropertyModile = objectDefineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	$$2e({ target: 'Object', stat: true, forced: !DESCRIPTORS$n, sham: !DESCRIPTORS$n }, {
	  defineProperty: objectDefinePropertyModile.f
	});

	var $$2d = _export;
	var DESCRIPTORS$m = descriptors;
	var defineProperties$1 = objectDefineProperties;

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	$$2d({ target: 'Object', stat: true, forced: !DESCRIPTORS$m, sham: !DESCRIPTORS$m }, {
	  defineProperties: defineProperties$1
	});

	var DESCRIPTORS$l = descriptors;
	var objectKeys = objectKeys$4;
	var toIndexedObject$7 = toIndexedObject$d;
	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$4 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject$7(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!DESCRIPTORS$l || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$4(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$4(false)
	};

	var $$2c = _export;
	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	$$2c({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var fails$N = fails$V;

	var freezing = !fails$N(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = {exports: {}};

	var hiddenKeys = hiddenKeys$6;
	var isObject$r = isObject$z;
	var has$a = has$l;
	var defineProperty$9 = objectDefineProperty.f;
	var uid$4 = uid$8;
	var FREEZING$4 = freezing;

	var METADATA = uid$4('meta');
	var id$1 = 0;

	var isExtensible$1 = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty$9(it, METADATA, { value: {
	    objectID: 'O' + ++id$1, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey$1 = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject$r(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has$a(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData$1 = function (it, create) {
	  if (!has$a(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze$3 = function (it) {
	  if (FREEZING$4 && meta.REQUIRED && isExtensible$1(it) && !has$a(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = internalMetadata.exports = {
	  REQUIRED: false,
	  fastKey: fastKey$1,
	  getWeakData: getWeakData$1,
	  onFreeze: onFreeze$3
	};

	hiddenKeys[METADATA] = true;

	var $$2b = _export;
	var FREEZING$3 = freezing;
	var fails$M = fails$V;
	var isObject$q = isObject$z;
	var onFreeze$2 = internalMetadata.exports.onFreeze;

	var nativeFreeze = Object.freeze;
	var FAILS_ON_PRIMITIVES$9 = fails$M(function () { nativeFreeze(1); });

	// `Object.freeze` method
	// https://tc39.github.io/ecma262/#sec-object.freeze
	$$2b({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$9, sham: !FREEZING$3 }, {
	  freeze: function freeze(it) {
	    return nativeFreeze && isObject$q(it) ? nativeFreeze(onFreeze$2(it)) : it;
	  }
	});

	var iterate$9 = {exports: {}};

	var iterators = {};

	var wellKnownSymbol$p = wellKnownSymbol$u;
	var Iterators$4 = iterators;

	var ITERATOR$8 = wellKnownSymbol$p('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$3 = function (it) {
	  return it !== undefined && (Iterators$4.Array === it || ArrayPrototype$1[ITERATOR$8] === it);
	};

	var wellKnownSymbol$o = wellKnownSymbol$u;

	var TO_STRING_TAG$3 = wellKnownSymbol$o('toStringTag');
	var test$2 = {};

	test$2[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test$2) === '[object z]';

	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var classofRaw = classofRaw$1;
	var wellKnownSymbol$n = wellKnownSymbol$u;

	var TO_STRING_TAG$2 = wellKnownSymbol$n('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$e = TO_STRING_TAG_SUPPORT$2 ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var classof$d = classof$e;
	var Iterators$3 = iterators;
	var wellKnownSymbol$m = wellKnownSymbol$u;

	var ITERATOR$7 = wellKnownSymbol$m('iterator');

	var getIteratorMethod$5 = function (it) {
	  if (it != undefined) return it[ITERATOR$7]
	    || it['@@iterator']
	    || Iterators$3[classof$d(it)];
	};

	var anObject$r = anObject$x;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$2 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$r(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject$r(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var anObject$q = anObject$x;
	var isArrayIteratorMethod$2 = isArrayIteratorMethod$3;
	var toLength$q = toLength$t;
	var bind$c = functionBindContext;
	var getIteratorMethod$4 = getIteratorMethod$5;
	var callWithSafeIterationClosing$1 = callWithSafeIterationClosing$2;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate$8 = iterate$9.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = bind$c(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod$4(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod$2(iterFn)) {
	      for (index = 0, length = toLength$q(iterable.length); length > index; index++) {
	        result = AS_ENTRIES
	          ? boundFunction(anObject$q(step = iterable[index])[0], step[1])
	          : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing$1(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	iterate$8.stop = function (result) {
	  return new Result(true, result);
	};

	var toPrimitive$7 = toPrimitive$b;
	var definePropertyModule$8 = objectDefineProperty;
	var createPropertyDescriptor$5 = createPropertyDescriptor$9;

	var createProperty$7 = function (object, key, value) {
	  var propertyKey = toPrimitive$7(key);
	  if (propertyKey in object) definePropertyModule$8.f(object, propertyKey, createPropertyDescriptor$5(0, value));
	  else object[propertyKey] = value;
	};

	var $$2a = _export;
	var iterate$7 = iterate$9.exports;
	var createProperty$6 = createProperty$7;

	// `Object.fromEntries` method
	// https://github.com/tc39/proposal-object-from-entries
	$$2a({ target: 'Object', stat: true }, {
	  fromEntries: function fromEntries(iterable) {
	    var obj = {};
	    iterate$7(iterable, function (k, v) {
	      createProperty$6(obj, k, v);
	    }, undefined, true);
	    return obj;
	  }
	});

	var $$29 = _export;
	var fails$L = fails$V;
	var toIndexedObject$6 = toIndexedObject$d;
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var DESCRIPTORS$k = descriptors;

	var FAILS_ON_PRIMITIVES$8 = fails$L(function () { nativeGetOwnPropertyDescriptor$1(1); });
	var FORCED$p = !DESCRIPTORS$k || FAILS_ON_PRIMITIVES$8;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	$$29({ target: 'Object', stat: true, forced: FORCED$p, sham: !DESCRIPTORS$k }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$1(toIndexedObject$6(it), key);
	  }
	});

	var $$28 = _export;
	var DESCRIPTORS$j = descriptors;
	var ownKeys$1 = ownKeys$3;
	var toIndexedObject$5 = toIndexedObject$d;
	var getOwnPropertyDescriptorModule$4 = objectGetOwnPropertyDescriptor;
	var createProperty$5 = createProperty$7;

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	$$28({ target: 'Object', stat: true, sham: !DESCRIPTORS$j }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject$5(object);
	    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$4.f;
	    var keys = ownKeys$1(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty$5(result, key, descriptor);
	    }
	    return result;
	  }
	});

	var $$27 = _export;
	var fails$K = fails$V;
	var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES$7 = fails$K(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	$$27({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$7 }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames
	});

	var fails$J = fails$V;

	var correctPrototypeGetter = !fails$J(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var has$9 = has$l;
	var toObject$k = toObject$o;
	var sharedKey = sharedKey$4;
	var CORRECT_PROTOTYPE_GETTER$2 = correctPrototypeGetter;

	var IE_PROTO = sharedKey('IE_PROTO');
	var ObjectPrototype$2 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf$1 = CORRECT_PROTOTYPE_GETTER$2 ? Object.getPrototypeOf : function (O) {
	  O = toObject$k(O);
	  if (has$9(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$2 : null;
	};

	var $$26 = _export;
	var fails$I = fails$V;
	var toObject$j = toObject$o;
	var nativeGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER$1 = correctPrototypeGetter;

	var FAILS_ON_PRIMITIVES$6 = fails$I(function () { nativeGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	$$26({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$6, sham: !CORRECT_PROTOTYPE_GETTER$1 }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return nativeGetPrototypeOf(toObject$j(it));
	  }
	});

	// `SameValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-samevalue
	var sameValue$1 = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	var $$25 = _export;
	var is = sameValue$1;

	// `Object.is` method
	// https://tc39.github.io/ecma262/#sec-object.is
	$$25({ target: 'Object', stat: true }, {
	  is: is
	});

	var $$24 = _export;
	var fails$H = fails$V;
	var isObject$p = isObject$z;

	var nativeIsExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$5 = fails$H(function () { nativeIsExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.github.io/ecma262/#sec-object.isextensible
	$$24({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5 }, {
	  isExtensible: function isExtensible(it) {
	    return isObject$p(it) ? nativeIsExtensible ? nativeIsExtensible(it) : true : false;
	  }
	});

	var $$23 = _export;
	var fails$G = fails$V;
	var isObject$o = isObject$z;

	var nativeIsFrozen = Object.isFrozen;
	var FAILS_ON_PRIMITIVES$4 = fails$G(function () { nativeIsFrozen(1); });

	// `Object.isFrozen` method
	// https://tc39.github.io/ecma262/#sec-object.isfrozen
	$$23({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
	  isFrozen: function isFrozen(it) {
	    return isObject$o(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
	  }
	});

	var $$22 = _export;
	var fails$F = fails$V;
	var isObject$n = isObject$z;

	var nativeIsSealed = Object.isSealed;
	var FAILS_ON_PRIMITIVES$3 = fails$F(function () { nativeIsSealed(1); });

	// `Object.isSealed` method
	// https://tc39.github.io/ecma262/#sec-object.issealed
	$$22({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
	  isSealed: function isSealed(it) {
	    return isObject$n(it) ? nativeIsSealed ? nativeIsSealed(it) : false : true;
	  }
	});

	var $$21 = _export;
	var toObject$i = toObject$o;
	var nativeKeys = objectKeys$4;
	var fails$E = fails$V;

	var FAILS_ON_PRIMITIVES$2 = fails$E(function () { nativeKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	$$21({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
	  keys: function keys(it) {
	    return nativeKeys(toObject$i(it));
	  }
	});

	var $$20 = _export;
	var isObject$m = isObject$z;
	var onFreeze$1 = internalMetadata.exports.onFreeze;
	var FREEZING$2 = freezing;
	var fails$D = fails$V;

	var nativePreventExtensions = Object.preventExtensions;
	var FAILS_ON_PRIMITIVES$1 = fails$D(function () { nativePreventExtensions(1); });

	// `Object.preventExtensions` method
	// https://tc39.github.io/ecma262/#sec-object.preventextensions
	$$20({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !FREEZING$2 }, {
	  preventExtensions: function preventExtensions(it) {
	    return nativePreventExtensions && isObject$m(it) ? nativePreventExtensions(onFreeze$1(it)) : it;
	  }
	});

	var $$1$ = _export;
	var isObject$l = isObject$z;
	var onFreeze = internalMetadata.exports.onFreeze;
	var FREEZING$1 = freezing;
	var fails$C = fails$V;

	var nativeSeal = Object.seal;
	var FAILS_ON_PRIMITIVES = fails$C(function () { nativeSeal(1); });

	// `Object.seal` method
	// https://tc39.github.io/ecma262/#sec-object.seal
	$$1$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !FREEZING$1 }, {
	  seal: function seal(it) {
	    return nativeSeal && isObject$l(it) ? nativeSeal(onFreeze(it)) : it;
	  }
	});

	var isObject$k = isObject$z;

	var aPossiblePrototype$2 = function (it) {
	  if (!isObject$k(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	var anObject$p = anObject$x;
	var aPossiblePrototype$1 = aPossiblePrototype$2;

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf$1 = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject$p(O);
	    aPossiblePrototype$1(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var $$1_ = _export;
	var setPrototypeOf$6 = objectSetPrototypeOf$1;

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	$$1_({ target: 'Object', stat: true }, {
	  setPrototypeOf: setPrototypeOf$6
	});

	var $$1Z = _export;
	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.github.io/ecma262/#sec-object.values
	$$1Z({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$c = classof$e;

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$c(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var redefine$d = redefine$g.exports;
	var toString$1 = objectToString;

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!TO_STRING_TAG_SUPPORT) {
	  redefine$d(Object.prototype, 'toString', toString$1, { unsafe: true });
	}

	var global$w = global$J;
	var fails$B = fails$V;

	// Forced replacement object prototype accessors methods
	var objectPrototypeAccessorsForced = !fails$B(function () {
	  var key = Math.random();
	  // In FF throws only define methods
	  // eslint-disable-next-line no-undef, no-useless-call
	  __defineSetter__.call(null, key, function () { /* empty */ });
	  delete global$w[key];
	});

	var $$1Y = _export;
	var DESCRIPTORS$i = descriptors;
	var FORCED$o = objectPrototypeAccessorsForced;
	var toObject$h = toObject$o;
	var aFunction$d = aFunction$f;
	var definePropertyModule$7 = objectDefineProperty;

	// `Object.prototype.__defineGetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__defineGetter__
	if (DESCRIPTORS$i) {
	  $$1Y({ target: 'Object', proto: true, forced: FORCED$o }, {
	    __defineGetter__: function __defineGetter__(P, getter) {
	      definePropertyModule$7.f(toObject$h(this), P, { get: aFunction$d(getter), enumerable: true, configurable: true });
	    }
	  });
	}

	var $$1X = _export;
	var DESCRIPTORS$h = descriptors;
	var FORCED$n = objectPrototypeAccessorsForced;
	var toObject$g = toObject$o;
	var aFunction$c = aFunction$f;
	var definePropertyModule$6 = objectDefineProperty;

	// `Object.prototype.__defineSetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__defineSetter__
	if (DESCRIPTORS$h) {
	  $$1X({ target: 'Object', proto: true, forced: FORCED$n }, {
	    __defineSetter__: function __defineSetter__(P, setter) {
	      definePropertyModule$6.f(toObject$g(this), P, { set: aFunction$c(setter), enumerable: true, configurable: true });
	    }
	  });
	}

	var $$1W = _export;
	var DESCRIPTORS$g = descriptors;
	var FORCED$m = objectPrototypeAccessorsForced;
	var toObject$f = toObject$o;
	var toPrimitive$6 = toPrimitive$b;
	var getPrototypeOf$9 = objectGetPrototypeOf$1;
	var getOwnPropertyDescriptor$6 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupGetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupGetter__
	if (DESCRIPTORS$g) {
	  $$1W({ target: 'Object', proto: true, forced: FORCED$m }, {
	    __lookupGetter__: function __lookupGetter__(P) {
	      var O = toObject$f(this);
	      var key = toPrimitive$6(P, true);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$6(O, key)) return desc.get;
	      } while (O = getPrototypeOf$9(O));
	    }
	  });
	}

	var $$1V = _export;
	var DESCRIPTORS$f = descriptors;
	var FORCED$l = objectPrototypeAccessorsForced;
	var toObject$e = toObject$o;
	var toPrimitive$5 = toPrimitive$b;
	var getPrototypeOf$8 = objectGetPrototypeOf$1;
	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;

	// `Object.prototype.__lookupSetter__` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.__lookupSetter__
	if (DESCRIPTORS$f) {
	  $$1V({ target: 'Object', proto: true, forced: FORCED$l }, {
	    __lookupSetter__: function __lookupSetter__(P) {
	      var O = toObject$e(this);
	      var key = toPrimitive$5(P, true);
	      var desc;
	      do {
	        if (desc = getOwnPropertyDescriptor$5(O, key)) return desc.set;
	      } while (O = getPrototypeOf$8(O));
	    }
	  });
	}

	var aFunction$b = aFunction$f;
	var isObject$j = isObject$z;

	var slice$1 = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$b(this);
	  var partArgs = slice$1.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice$1.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject$j(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	var $$1U = _export;
	var bind$b = functionBind;

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	$$1U({ target: 'Function', proto: true }, {
	  bind: bind$b
	});

	var DESCRIPTORS$e = descriptors;
	var defineProperty$8 = objectDefineProperty.f;

	var FunctionPrototype$1 = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype$1.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$1 = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (DESCRIPTORS$e && !(NAME$1 in FunctionPrototype$1)) {
	  defineProperty$8(FunctionPrototype$1, NAME$1, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var isObject$i = isObject$z;
	var definePropertyModule$5 = objectDefineProperty;
	var getPrototypeOf$7 = objectGetPrototypeOf$1;
	var wellKnownSymbol$l = wellKnownSymbol$u;

	var HAS_INSTANCE = wellKnownSymbol$l('hasInstance');
	var FunctionPrototype = Function.prototype;

	// `Function.prototype[@@hasInstance]` method
	// https://tc39.github.io/ecma262/#sec-function.prototype-@@hasinstance
	if (!(HAS_INSTANCE in FunctionPrototype)) {
	  definePropertyModule$5.f(FunctionPrototype, HAS_INSTANCE, { value: function (O) {
	    if (typeof this != 'function' || !isObject$i(O)) return false;
	    if (!isObject$i(this.prototype)) return O instanceof this;
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = getPrototypeOf$7(O)) if (this.prototype === O) return true;
	    return false;
	  } });
	}

	var $$1T = _export;
	var global$v = global$J;

	// `globalThis` object
	// https://github.com/tc39/proposal-global
	$$1T({ global: true }, {
	  globalThis: global$v
	});

	var bind$a = functionBindContext;
	var toObject$d = toObject$o;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$2;
	var isArrayIteratorMethod$1 = isArrayIteratorMethod$3;
	var toLength$p = toLength$t;
	var createProperty$4 = createProperty$7;
	var getIteratorMethod$3 = getIteratorMethod$5;

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom$1 = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject$d(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod$3(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = bind$a(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod$1(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty$4(result, index, value);
	    }
	  } else {
	    length = toLength$p(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty$4(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var wellKnownSymbol$k = wellKnownSymbol$u;

	var ITERATOR$6 = wellKnownSymbol$k('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$6] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration$4 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$6] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var $$1S = _export;
	var from = arrayFrom$1;
	var checkCorrectnessOfIteration$3 = checkCorrectnessOfIteration$4;

	var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration$3(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	$$1S({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
	  from: from
	});

	var $$1R = _export;
	var isArray$4 = isArray$7;

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	$$1R({ target: 'Array', stat: true }, {
	  isArray: isArray$4
	});

	var $$1Q = _export;
	var fails$A = fails$V;
	var createProperty$3 = createProperty$7;

	var ISNT_GENERIC = fails$A(function () {
	  function F() { /* empty */ }
	  return !(Array.of.call(F) instanceof F);
	});

	// `Array.of` method
	// https://tc39.github.io/ecma262/#sec-array.of
	// WebKit Array.of isn't generic
	$$1Q({ target: 'Array', stat: true, forced: ISNT_GENERIC }, {
	  of: function of(/* ...args */) {
	    var index = 0;
	    var argumentsLength = arguments.length;
	    var result = new (typeof this == 'function' ? this : Array)(argumentsLength);
	    while (argumentsLength > index) createProperty$3(result, index, arguments[index++]);
	    result.length = argumentsLength;
	    return result;
	  }
	});

	var getBuiltIn$9 = getBuiltIn$d;

	var engineUserAgent = getBuiltIn$9('navigator', 'userAgent') || '';

	var global$u = global$J;
	var userAgent$3 = engineUserAgent;

	var process$5 = global$u.process;
	var versions = process$5 && process$5.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (userAgent$3) {
	  match = userAgent$3.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent$3.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var fails$z = fails$V;
	var wellKnownSymbol$j = wellKnownSymbol$u;
	var V8_VERSION$2 = engineV8Version;

	var SPECIES$5 = wellKnownSymbol$j('species');

	var arrayMethodHasSpeciesSupport$5 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$2 >= 51 || !fails$z(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$5] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var $$1P = _export;
	var fails$y = fails$V;
	var isArray$3 = isArray$7;
	var isObject$h = isObject$z;
	var toObject$c = toObject$o;
	var toLength$o = toLength$t;
	var createProperty$2 = createProperty$7;
	var arraySpeciesCreate$3 = arraySpeciesCreate$5;
	var arrayMethodHasSpeciesSupport$4 = arrayMethodHasSpeciesSupport$5;
	var wellKnownSymbol$i = wellKnownSymbol$u;
	var V8_VERSION$1 = engineV8Version;

	var IS_CONCAT_SPREADABLE = wellKnownSymbol$i('isConcatSpreadable');
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION$1 >= 51 || !fails$y(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$4('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$h(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$3(O);
	};

	var FORCED$k = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	$$1P({ target: 'Array', proto: true, forced: FORCED$k }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject$c(this);
	    var A = arraySpeciesCreate$3(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength$o(E.length);
	        if (n + len > MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty$2(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$1) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty$2(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var toObject$b = toObject$o;
	var toAbsoluteIndex$6 = toAbsoluteIndex$8;
	var toLength$n = toLength$t;

	var min$6 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject$b(this);
	  var len = toLength$n(O.length);
	  var to = toAbsoluteIndex$6(target, len);
	  var from = toAbsoluteIndex$6(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$6((end === undefined ? len : toAbsoluteIndex$6(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var wellKnownSymbol$h = wellKnownSymbol$u;
	var create$7 = objectCreate;
	var definePropertyModule$4 = objectDefineProperty;

	var UNSCOPABLES = wellKnownSymbol$h('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  definePropertyModule$4.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: create$7(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables$8 = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $$1O = _export;
	var copyWithin = arrayCopyWithin;
	var addToUnscopables$7 = addToUnscopables$8;

	// `Array.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	$$1O({ target: 'Array', proto: true }, {
	  copyWithin: copyWithin
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$7('copyWithin');

	var fails$x = fails$V;

	var arrayMethodIsStrict$9 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$x(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var DESCRIPTORS$d = descriptors;
	var fails$w = fails$V;
	var has$8 = has$l;

	var defineProperty$7 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength$e = function (METHOD_NAME, options) {
	  if (has$8(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has$8(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has$8(options, 0) ? options[0] : thrower;
	  var argument1 = has$8(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails$w(function () {
	    if (ACCESSORS && !DESCRIPTORS$d) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$7(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $$1N = _export;
	var $every$1 = arrayIteration.every;
	var arrayMethodIsStrict$8 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$d = arrayMethodUsesToLength$e;

	var STRICT_METHOD$8 = arrayMethodIsStrict$8('every');
	var USES_TO_LENGTH$d = arrayMethodUsesToLength$d('every');

	// `Array.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.every
	$$1N({ target: 'Array', proto: true, forced: !STRICT_METHOD$8 || !USES_TO_LENGTH$d }, {
	  every: function every(callbackfn /* , thisArg */) {
	    return $every$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var toObject$a = toObject$o;
	var toAbsoluteIndex$5 = toAbsoluteIndex$8;
	var toLength$m = toLength$t;

	// `Array.prototype.fill` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	var arrayFill$1 = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject$a(this);
	  var length = toLength$m(O.length);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex$5(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex$5(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	var $$1M = _export;
	var fill = arrayFill$1;
	var addToUnscopables$6 = addToUnscopables$8;

	// `Array.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	$$1M({ target: 'Array', proto: true }, {
	  fill: fill
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$6('fill');

	var $$1L = _export;
	var $filter$1 = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$5;
	var arrayMethodUsesToLength$c = arrayMethodUsesToLength$e;

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$3('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$c = arrayMethodUsesToLength$c('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	$$1L({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$c }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1K = _export;
	var $find$1 = arrayIteration.find;
	var addToUnscopables$5 = addToUnscopables$8;
	var arrayMethodUsesToLength$b = arrayMethodUsesToLength$e;

	var FIND = 'find';
	var SKIPS_HOLES$1 = true;

	var USES_TO_LENGTH$b = arrayMethodUsesToLength$b(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	$$1K({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 || !USES_TO_LENGTH$b }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$5(FIND);

	var $$1J = _export;
	var $findIndex$1 = arrayIteration.findIndex;
	var addToUnscopables$4 = addToUnscopables$8;
	var arrayMethodUsesToLength$a = arrayMethodUsesToLength$e;

	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH$a = arrayMethodUsesToLength$a(FIND_INDEX);

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.findindex
	$$1J({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$a }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$4(FIND_INDEX);

	var isArray$2 = isArray$7;
	var toLength$l = toLength$t;
	var bind$9 = functionBindContext;

	// `FlattenIntoArray` abstract operation
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var flattenIntoArray$2 = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? bind$9(mapper, thisArg, 3) : false;
	  var element;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray$2(element)) {
	        targetIndex = flattenIntoArray$2(target, original, element, toLength$l(element.length), targetIndex, depth - 1) - 1;
	      } else {
	        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray$2;

	var $$1I = _export;
	var flattenIntoArray$1 = flattenIntoArray_1;
	var toObject$9 = toObject$o;
	var toLength$k = toLength$t;
	var toInteger$9 = toInteger$c;
	var arraySpeciesCreate$2 = arraySpeciesCreate$5;

	// `Array.prototype.flat` method
	// https://github.com/tc39/proposal-flatMap
	$$1I({ target: 'Array', proto: true }, {
	  flat: function flat(/* depthArg = 1 */) {
	    var depthArg = arguments.length ? arguments[0] : undefined;
	    var O = toObject$9(this);
	    var sourceLen = toLength$k(O.length);
	    var A = arraySpeciesCreate$2(O, 0);
	    A.length = flattenIntoArray$1(A, O, O, sourceLen, 0, depthArg === undefined ? 1 : toInteger$9(depthArg));
	    return A;
	  }
	});

	var $$1H = _export;
	var flattenIntoArray = flattenIntoArray_1;
	var toObject$8 = toObject$o;
	var toLength$j = toLength$t;
	var aFunction$a = aFunction$f;
	var arraySpeciesCreate$1 = arraySpeciesCreate$5;

	// `Array.prototype.flatMap` method
	// https://github.com/tc39/proposal-flatMap
	$$1H({ target: 'Array', proto: true }, {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject$8(this);
	    var sourceLen = toLength$j(O.length);
	    var A;
	    aFunction$a(callbackfn);
	    A = arraySpeciesCreate$1(O, 0);
	    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return A;
	  }
	});

	var $forEach$1 = arrayIteration.forEach;
	var arrayMethodIsStrict$7 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$9 = arrayMethodUsesToLength$e;

	var STRICT_METHOD$7 = arrayMethodIsStrict$7('forEach');
	var USES_TO_LENGTH$9 = arrayMethodUsesToLength$9('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD$7 || !USES_TO_LENGTH$9) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	var $$1G = _export;
	var forEach$2 = arrayForEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	$$1G({ target: 'Array', proto: true, forced: [].forEach != forEach$2 }, {
	  forEach: forEach$2
	});

	var $$1F = _export;
	var $includes$1 = arrayIncludes.includes;
	var addToUnscopables$3 = addToUnscopables$8;
	var arrayMethodUsesToLength$8 = arrayMethodUsesToLength$e;

	var USES_TO_LENGTH$8 = arrayMethodUsesToLength$8('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	$$1F({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$8 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes$1(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$3('includes');

	var $$1E = _export;
	var $indexOf$1 = arrayIncludes.indexOf;
	var arrayMethodIsStrict$6 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$7 = arrayMethodUsesToLength$e;

	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO$1 = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$6 = arrayMethodIsStrict$6('indexOf');
	var USES_TO_LENGTH$7 = arrayMethodUsesToLength$7('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	$$1E({ target: 'Array', proto: true, forced: NEGATIVE_ZERO$1 || !STRICT_METHOD$6 || !USES_TO_LENGTH$7 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO$1
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf$1(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1D = _export;
	var IndexedObject$1 = indexedObject;
	var toIndexedObject$4 = toIndexedObject$d;
	var arrayMethodIsStrict$5 = arrayMethodIsStrict$9;

	var nativeJoin = [].join;

	var ES3_STRINGS = IndexedObject$1 != Object;
	var STRICT_METHOD$5 = arrayMethodIsStrict$5('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	$$1D({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$5 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject$4(this), separator === undefined ? ',' : separator);
	  }
	});

	var toIndexedObject$3 = toIndexedObject$d;
	var toInteger$8 = toInteger$c;
	var toLength$i = toLength$t;
	var arrayMethodIsStrict$4 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$6 = arrayMethodUsesToLength$e;

	var min$5 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$4 = arrayMethodIsStrict$4('lastIndexOf');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength$6('indexOf', { ACCESSORS: true, 1: 0 });
	var FORCED$j = NEGATIVE_ZERO || !STRICT_METHOD$4 || !USES_TO_LENGTH$6;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$j ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject$3(this);
	  var length = toLength$i(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$5(index, toInteger$8(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : nativeLastIndexOf;

	var $$1C = _export;
	var lastIndexOf = arrayLastIndexOf;

	// `Array.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	$$1C({ target: 'Array', proto: true, forced: lastIndexOf !== [].lastIndexOf }, {
	  lastIndexOf: lastIndexOf
	});

	var $$1B = _export;
	var $map$1 = arrayIteration.map;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$5;
	var arrayMethodUsesToLength$5 = arrayMethodUsesToLength$e;

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('map');
	// FF49- issue
	var USES_TO_LENGTH$5 = arrayMethodUsesToLength$5('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	$$1B({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$5 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var aFunction$9 = aFunction$f;
	var toObject$7 = toObject$o;
	var IndexedObject = indexedObject;
	var toLength$h = toLength$t;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$3 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$9(callbackfn);
	    var O = toObject$7(that);
	    var self = IndexedObject(O);
	    var length = toLength$h(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$3(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$3(true)
	};

	var $$1A = _export;
	var $reduce$1 = arrayReduce.left;
	var arrayMethodIsStrict$3 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$4 = arrayMethodUsesToLength$e;

	var STRICT_METHOD$3 = arrayMethodIsStrict$3('reduce');
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength$4('reduce', { 1: 0 });

	// `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	$$1A({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || !USES_TO_LENGTH$4 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1z = _export;
	var $reduceRight$1 = arrayReduce.right;
	var arrayMethodIsStrict$2 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$3 = arrayMethodUsesToLength$e;

	var STRICT_METHOD$2 = arrayMethodIsStrict$2('reduceRight');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength$3('reduce', { 1: 0 });

	// `Array.prototype.reduceRight` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	$$1z({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || !USES_TO_LENGTH$3 }, {
	  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
	    return $reduceRight$1(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1y = _export;
	var isArray$1 = isArray$7;

	var nativeReverse = [].reverse;
	var test$1 = [1, 2];

	// `Array.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
	// fix for Safari 12.0 bug
	// https://bugs.webkit.org/show_bug.cgi?id=188794
	$$1y({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
	  reverse: function reverse() {
	    // eslint-disable-next-line no-self-assign
	    if (isArray$1(this)) this.length = this.length;
	    return nativeReverse.call(this);
	  }
	});

	var $$1x = _export;
	var isObject$g = isObject$z;
	var isArray = isArray$7;
	var toAbsoluteIndex$4 = toAbsoluteIndex$8;
	var toLength$g = toLength$t;
	var toIndexedObject$2 = toIndexedObject$d;
	var createProperty$1 = createProperty$7;
	var wellKnownSymbol$g = wellKnownSymbol$u;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$5;
	var arrayMethodUsesToLength$2 = arrayMethodUsesToLength$e;

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('slice');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength$2('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$4 = wellKnownSymbol$g('species');
	var nativeSlice = [].slice;
	var max$2 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	$$1x({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject$2(this);
	    var length = toLength$g(O.length);
	    var k = toAbsoluteIndex$4(start, length);
	    var fin = toAbsoluteIndex$4(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject$g(Constructor)) {
	        Constructor = Constructor[SPECIES$4];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$2(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$1(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var $$1w = _export;
	var $some$1 = arrayIteration.some;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$9;
	var arrayMethodUsesToLength$1 = arrayMethodUsesToLength$e;

	var STRICT_METHOD$1 = arrayMethodIsStrict$1('some');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength$1('some');

	// `Array.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.some
	$$1w({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$1 }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1v = _export;
	var aFunction$8 = aFunction$f;
	var toObject$6 = toObject$o;
	var fails$v = fails$V;
	var arrayMethodIsStrict = arrayMethodIsStrict$9;

	var test = [];
	var nativeSort = test.sort;

	// IE8-
	var FAILS_ON_UNDEFINED = fails$v(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails$v(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD = arrayMethodIsStrict('sort');

	var FORCED$i = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD;

	// `Array.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.sort
	$$1v({ target: 'Array', proto: true, forced: FORCED$i }, {
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? nativeSort.call(toObject$6(this))
	      : nativeSort.call(toObject$6(this), aFunction$8(comparefn));
	  }
	});

	var $$1u = _export;
	var toAbsoluteIndex$3 = toAbsoluteIndex$8;
	var toInteger$7 = toInteger$c;
	var toLength$f = toLength$t;
	var toObject$5 = toObject$o;
	var arraySpeciesCreate = arraySpeciesCreate$5;
	var createProperty = createProperty$7;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$5;
	var arrayMethodUsesToLength = arrayMethodUsesToLength$e;

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$1 = Math.max;
	var min$4 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	$$1u({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject$5(this);
	    var len = toLength$f(O.length);
	    var actualStart = toAbsoluteIndex$3(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$4(max$1(toInteger$7(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var getBuiltIn$8 = getBuiltIn$d;
	var definePropertyModule$3 = objectDefineProperty;
	var wellKnownSymbol$f = wellKnownSymbol$u;
	var DESCRIPTORS$c = descriptors;

	var SPECIES$3 = wellKnownSymbol$f('species');

	var setSpecies$6 = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn$8(CONSTRUCTOR_NAME);
	  var defineProperty = definePropertyModule$3.f;

	  if (DESCRIPTORS$c && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var setSpecies$5 = setSpecies$6;

	// `Array[@@species]` getter
	// https://tc39.github.io/ecma262/#sec-get-array-@@species
	setSpecies$5('Array');

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module
	var addToUnscopables$2 = addToUnscopables$8;

	addToUnscopables$2('flat');

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module
	var addToUnscopables$1 = addToUnscopables$8;

	addToUnscopables$1('flatMap');

	var getPrototypeOf$6 = objectGetPrototypeOf$1;
	var createNonEnumerableProperty$a = createNonEnumerableProperty$g;
	var has$7 = has$l;
	var wellKnownSymbol$e = wellKnownSymbol$u;

	var ITERATOR$5 = wellKnownSymbol$e('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	var returnThis$2 = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$6(getPrototypeOf$6(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype$2 == undefined) IteratorPrototype$2 = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if (!has$7(IteratorPrototype$2, ITERATOR$5)) {
	  createNonEnumerableProperty$a(IteratorPrototype$2, ITERATOR$5, returnThis$2);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var create$6 = objectCreate;
	var createPropertyDescriptor$4 = createPropertyDescriptor$9;
	var setToStringTag$8 = setToStringTag$a;
	var Iterators$2 = iterators;

	var returnThis$1 = function () { return this; };

	var createIteratorConstructor$3 = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create$6(IteratorPrototype$1, { next: createPropertyDescriptor$4(1, next) });
	  setToStringTag$8(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$2[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var $$1t = _export;
	var createIteratorConstructor$2 = createIteratorConstructor$3;
	var getPrototypeOf$5 = objectGetPrototypeOf$1;
	var setPrototypeOf$5 = objectSetPrototypeOf$1;
	var setToStringTag$7 = setToStringTag$a;
	var createNonEnumerableProperty$9 = createNonEnumerableProperty$g;
	var redefine$c = redefine$g.exports;
	var wellKnownSymbol$d = wellKnownSymbol$u;
	var Iterators$1 = iterators;
	var IteratorsCore = iteratorsCore;

	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol$d('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator$3 = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor$2(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf$5(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf$5(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf$5) {
	          setPrototypeOf$5(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty$9(CurrentIteratorPrototype, ITERATOR$4, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag$7(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty$9(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  Iterators$1[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine$c(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$1t({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var toIndexedObject$1 = toIndexedObject$d;
	var addToUnscopables = addToUnscopables$8;
	var Iterators = iterators;
	var InternalStateModule$a = internalState;
	var defineIterator$2 = defineIterator$3;

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$b = InternalStateModule$a.set;
	var getInternalState$6 = InternalStateModule$a.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
	  setInternalState$b(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject$1(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$6(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	Iterators.Arguments = Iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var $$1s = _export;
	var toAbsoluteIndex$2 = toAbsoluteIndex$8;

	var fromCharCode = String.fromCharCode;
	var nativeFromCodePoint = String.fromCodePoint;

	// length should be 1, old FF problem
	var INCORRECT_LENGTH = !!nativeFromCodePoint && nativeFromCodePoint.length != 1;

	// `String.fromCodePoint` method
	// https://tc39.github.io/ecma262/#sec-string.fromcodepoint
	$$1s({ target: 'String', stat: true, forced: INCORRECT_LENGTH }, {
	  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
	    var elements = [];
	    var length = arguments.length;
	    var i = 0;
	    var code;
	    while (length > i) {
	      code = +arguments[i++];
	      if (toAbsoluteIndex$2(code, 0x10FFFF) !== code) throw RangeError(code + ' is not a valid code point');
	      elements.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xD800, code % 0x400 + 0xDC00)
	      );
	    } return elements.join('');
	  }
	});

	var $$1r = _export;
	var toIndexedObject = toIndexedObject$d;
	var toLength$e = toLength$t;

	// `String.raw` method
	// https://tc39.github.io/ecma262/#sec-string.raw
	$$1r({ target: 'String', stat: true }, {
	  raw: function raw(template) {
	    var rawTemplate = toIndexedObject(template.raw);
	    var literalSegments = toLength$e(rawTemplate.length);
	    var argumentsLength = arguments.length;
	    var elements = [];
	    var i = 0;
	    while (literalSegments > i) {
	      elements.push(String(rawTemplate[i++]));
	      if (i < argumentsLength) elements.push(String(arguments[i]));
	    } return elements.join('');
	  }
	});

	var toInteger$6 = toInteger$c;
	var requireObjectCoercible$c = requireObjectCoercible$f;

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible$c($this));
	    var position = toInteger$6(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var $$1q = _export;
	var codeAt$1 = stringMultibyte.codeAt;

	// `String.prototype.codePointAt` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	$$1q({ target: 'String', proto: true }, {
	  codePointAt: function codePointAt(pos) {
	    return codeAt$1(this, pos);
	  }
	});

	var isObject$f = isObject$z;
	var classof$b = classofRaw$1;
	var wellKnownSymbol$c = wellKnownSymbol$u;

	var MATCH$2 = wellKnownSymbol$c('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$f(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classof$b(it) == 'RegExp');
	};

	var isRegExp$4 = isRegexp;

	var notARegexp = function (it) {
	  if (isRegExp$4(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var wellKnownSymbol$b = wellKnownSymbol$u;

	var MATCH$1 = wellKnownSymbol$b('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	var $$1p = _export;
	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
	var toLength$d = toLength$t;
	var notARegExp$2 = notARegexp;
	var requireObjectCoercible$b = requireObjectCoercible$f;
	var correctIsRegExpLogic$2 = correctIsRegexpLogic;

	var nativeEndsWith = ''.endsWith;
	var min$3 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegExpLogic$2('endsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	  var descriptor = getOwnPropertyDescriptor$4(String.prototype, 'endsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.endsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.endswith
	$$1p({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = String(requireObjectCoercible$b(this));
	    notARegExp$2(searchString);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = toLength$d(that.length);
	    var end = endPosition === undefined ? len : min$3(toLength$d(endPosition), len);
	    var search = String(searchString);
	    return nativeEndsWith
	      ? nativeEndsWith.call(that, search, end)
	      : that.slice(end - search.length, end) === search;
	  }
	});

	var $$1o = _export;
	var notARegExp$1 = notARegexp;
	var requireObjectCoercible$a = requireObjectCoercible$f;
	var correctIsRegExpLogic$1 = correctIsRegexpLogic;

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	$$1o({ target: 'String', proto: true, forced: !correctIsRegExpLogic$1('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible$a(this))
	      .indexOf(notARegExp$1(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var anObject$o = anObject$x;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$o(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var regexpStickyHelpers = {};

	var fails$u = fails$V;

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	regexpStickyHelpers.UNSUPPORTED_Y = fails$u(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	regexpStickyHelpers.BROKEN_CARET = fails$u(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpFlags = regexpFlags$1;
	var stickyHelpers$1 = regexpStickyHelpers;

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$3 = stickyHelpers$1.UNSUPPORTED_Y || stickyHelpers$1.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$3;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$3 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $$1n = _export;
	var exec = regexpExec$3;

	$$1n({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
	  exec: exec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var redefine$b = redefine$g.exports;
	var fails$t = fails$V;
	var wellKnownSymbol$a = wellKnownSymbol$u;
	var regexpExec$2 = regexpExec$3;
	var createNonEnumerableProperty$8 = createNonEnumerableProperty$g;

	var SPECIES$2 = wellKnownSymbol$a('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$t(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol$a('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$t(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol$a(KEY);

	  var DELEGATES_TO_SYMBOL = !fails$t(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$t(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$2] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec$2) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine$b(String.prototype, KEY, stringMethod);
	    redefine$b(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty$8(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex$4 = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	var classof$a = classofRaw$1;
	var regexpExec$1 = regexpExec$3;

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classof$a(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec$1.call(R, S);
	};

	var fixRegExpWellKnownSymbolLogic$3 = fixRegexpWellKnownSymbolLogic;
	var anObject$n = anObject$x;
	var toLength$c = toLength$t;
	var requireObjectCoercible$9 = requireObjectCoercible$f;
	var advanceStringIndex$3 = advanceStringIndex$4;
	var regExpExec$3 = regexpExecAbstract;

	// @@match logic
	fixRegExpWellKnownSymbolLogic$3('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible$9(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject$n(regexp);
	      var S = String(this);

	      if (!rx.global) return regExpExec$3(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regExpExec$3(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$3(S, toLength$c(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var anObject$m = anObject$x;
	var aFunction$7 = aFunction$f;
	var wellKnownSymbol$9 = wellKnownSymbol$u;

	var SPECIES$1 = wellKnownSymbol$9('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor$9 = function (O, defaultConstructor) {
	  var C = anObject$m(O).constructor;
	  var S;
	  return C === undefined || (S = anObject$m(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction$7(S);
	};

	var $$1m = _export;
	var createIteratorConstructor$1 = createIteratorConstructor$3;
	var requireObjectCoercible$8 = requireObjectCoercible$f;
	var toLength$b = toLength$t;
	var aFunction$6 = aFunction$f;
	var anObject$l = anObject$x;
	var classof$9 = classofRaw$1;
	var isRegExp$3 = isRegexp;
	var getRegExpFlags = regexpFlags$1;
	var createNonEnumerableProperty$7 = createNonEnumerableProperty$g;
	var fails$s = fails$V;
	var wellKnownSymbol$8 = wellKnownSymbol$u;
	var speciesConstructor$8 = speciesConstructor$9;
	var advanceStringIndex$2 = advanceStringIndex$4;
	var InternalStateModule$9 = internalState;
	var IS_PURE$1 = isPure;

	var MATCH_ALL = wellKnownSymbol$8('matchAll');
	var REGEXP_STRING = 'RegExp String';
	var REGEXP_STRING_ITERATOR = REGEXP_STRING + ' Iterator';
	var setInternalState$a = InternalStateModule$9.set;
	var getInternalState$5 = InternalStateModule$9.getterFor(REGEXP_STRING_ITERATOR);
	var RegExpPrototype$3 = RegExp.prototype;
	var regExpBuiltinExec = RegExpPrototype$3.exec;
	var nativeMatchAll = ''.matchAll;

	var WORKS_WITH_NON_GLOBAL_REGEX = !!nativeMatchAll && !fails$s(function () {
	  'a'.matchAll(/./);
	});

	var regExpExec$2 = function (R, S) {
	  var exec = R.exec;
	  var result;
	  if (typeof exec == 'function') {
	    result = exec.call(R, S);
	    if (typeof result != 'object') throw TypeError('Incorrect exec result');
	    return result;
	  } return regExpBuiltinExec.call(R, S);
	};

	// eslint-disable-next-line max-len
	var $RegExpStringIterator = createIteratorConstructor$1(function RegExpStringIterator(regexp, string, global, fullUnicode) {
	  setInternalState$a(this, {
	    type: REGEXP_STRING_ITERATOR,
	    regexp: regexp,
	    string: string,
	    global: global,
	    unicode: fullUnicode,
	    done: false
	  });
	}, REGEXP_STRING, function next() {
	  var state = getInternalState$5(this);
	  if (state.done) return { value: undefined, done: true };
	  var R = state.regexp;
	  var S = state.string;
	  var match = regExpExec$2(R, S);
	  if (match === null) return { value: undefined, done: state.done = true };
	  if (state.global) {
	    if (String(match[0]) == '') R.lastIndex = advanceStringIndex$2(S, toLength$b(R.lastIndex), state.unicode);
	    return { value: match, done: false };
	  }
	  state.done = true;
	  return { value: match, done: false };
	});

	var $matchAll = function (string) {
	  var R = anObject$l(this);
	  var S = String(string);
	  var C, flagsValue, flags, matcher, global, fullUnicode;
	  C = speciesConstructor$8(R, RegExp);
	  flagsValue = R.flags;
	  if (flagsValue === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$3)) {
	    flagsValue = getRegExpFlags.call(R);
	  }
	  flags = flagsValue === undefined ? '' : String(flagsValue);
	  matcher = new C(C === RegExp ? R.source : R, flags);
	  global = !!~flags.indexOf('g');
	  fullUnicode = !!~flags.indexOf('u');
	  matcher.lastIndex = toLength$b(R.lastIndex);
	  return new $RegExpStringIterator(matcher, S, global, fullUnicode);
	};

	// `String.prototype.matchAll` method
	// https://github.com/tc39/proposal-string-matchall
	$$1m({ target: 'String', proto: true, forced: WORKS_WITH_NON_GLOBAL_REGEX }, {
	  matchAll: function matchAll(regexp) {
	    var O = requireObjectCoercible$8(this);
	    var flags, S, matcher, rx;
	    if (regexp != null) {
	      if (isRegExp$3(regexp)) {
	        flags = String(requireObjectCoercible$8('flags' in RegExpPrototype$3
	          ? regexp.flags
	          : getRegExpFlags.call(regexp)
	        ));
	        if (!~flags.indexOf('g')) throw TypeError('`.matchAll` does not allow non-global regexes');
	      }
	      if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	      matcher = regexp[MATCH_ALL];
	      if (matcher === undefined && IS_PURE$1 && classof$9(regexp) == 'RegExp') matcher = $matchAll;
	      if (matcher != null) return aFunction$6(matcher).call(regexp, O);
	    } else if (WORKS_WITH_NON_GLOBAL_REGEX) return nativeMatchAll.apply(O, arguments);
	    S = String(O);
	    rx = new RegExp(regexp, 'g');
	    return rx[MATCH_ALL](S);
	  }
	});

	MATCH_ALL in RegExpPrototype$3 || createNonEnumerableProperty$7(RegExpPrototype$3, MATCH_ALL, $matchAll);

	var toInteger$5 = toInteger$c;
	var requireObjectCoercible$7 = requireObjectCoercible$f;

	// `String.prototype.repeat` method implementation
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	var stringRepeat = ''.repeat || function repeat(count) {
	  var str = String(requireObjectCoercible$7(this));
	  var result = '';
	  var n = toInteger$5(count);
	  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	// https://github.com/tc39/proposal-string-pad-start-end
	var toLength$a = toLength$t;
	var repeat$4 = stringRepeat;
	var requireObjectCoercible$6 = requireObjectCoercible$f;

	var ceil$1 = Math.ceil;

	// `String.prototype.{ padStart, padEnd }` methods implementation
	var createMethod$1 = function (IS_END) {
	  return function ($this, maxLength, fillString) {
	    var S = String(requireObjectCoercible$6($this));
	    var stringLength = S.length;
	    var fillStr = fillString === undefined ? ' ' : String(fillString);
	    var intMaxLength = toLength$a(maxLength);
	    var fillLen, stringFiller;
	    if (intMaxLength <= stringLength || fillStr == '') return S;
	    fillLen = intMaxLength - stringLength;
	    stringFiller = repeat$4.call(fillStr, ceil$1(fillLen / fillStr.length));
	    if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
	    return IS_END ? S + stringFiller : stringFiller + S;
	  };
	};

	var stringPad = {
	  // `String.prototype.padStart` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	  start: createMethod$1(false),
	  // `String.prototype.padEnd` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.padend
	  end: createMethod$1(true)
	};

	// https://github.com/zloirock/core-js/issues/280
	var userAgent$2 = engineUserAgent;

	// eslint-disable-next-line unicorn/no-unsafe-regex
	var stringPadWebkitBug = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent$2);

	var $$1l = _export;
	var $padEnd = stringPad.end;
	var WEBKIT_BUG$1 = stringPadWebkitBug;

	// `String.prototype.padEnd` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.padend
	$$1l({ target: 'String', proto: true, forced: WEBKIT_BUG$1 }, {
	  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
	    return $padEnd(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1k = _export;
	var $padStart = stringPad.start;
	var WEBKIT_BUG = stringPadWebkitBug;

	// `String.prototype.padStart` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.padstart
	$$1k({ target: 'String', proto: true, forced: WEBKIT_BUG }, {
	  padStart: function padStart(maxLength /* , fillString = ' ' */) {
	    return $padStart(this, maxLength, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$1j = _export;
	var repeat$3 = stringRepeat;

	// `String.prototype.repeat` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
	$$1j({ target: 'String', proto: true }, {
	  repeat: repeat$3
	});

	var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
	var anObject$k = anObject$x;
	var toObject$4 = toObject$o;
	var toLength$9 = toLength$t;
	var toInteger$4 = toInteger$c;
	var requireObjectCoercible$5 = requireObjectCoercible$f;
	var advanceStringIndex$1 = advanceStringIndex$4;
	var regExpExec$1 = regexpExecAbstract;

	var max = Math.max;
	var min$2 = Math.min;
	var floor$8 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegExpWellKnownSymbolLogic$2('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible$5(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject$k(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regExpExec$1(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$1(S, toLength$9(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max(min$2(toInteger$4(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject$4(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$8(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
	var anObject$j = anObject$x;
	var requireObjectCoercible$4 = requireObjectCoercible$f;
	var sameValue = sameValue$1;
	var regExpExec = regexpExecAbstract;

	// @@search logic
	fixRegExpWellKnownSymbolLogic$1('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible$4(this);
	      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
	      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
	    function (regexp) {
	      var res = maybeCallNative(nativeSearch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject$j(regexp);
	      var S = String(this);

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regExpExec(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var isRegExp$2 = isRegexp;
	var anObject$i = anObject$x;
	var requireObjectCoercible$3 = requireObjectCoercible$f;
	var speciesConstructor$7 = speciesConstructor$9;
	var advanceStringIndex = advanceStringIndex$4;
	var toLength$8 = toLength$t;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var fails$r = fails$V;

	var arrayPush = [].push;
	var min$1 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !fails$r(function () { return !RegExp(MAX_UINT32, 'y'); });

	// @@split logic
	fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible$3(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp$2(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output.length > lim ? output.slice(0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible$3(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	      if (res.done) return res.value;

	      var rx = anObject$i(regexp);
	      var S = String(this);
	      var C = speciesConstructor$7(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = min$1(toLength$8(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	}, !SUPPORTS_Y);

	var $$1i = _export;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var toLength$7 = toLength$t;
	var notARegExp = notARegexp;
	var requireObjectCoercible$2 = requireObjectCoercible$f;
	var correctIsRegExpLogic = correctIsRegexpLogic;

	var nativeStartsWith = ''.startsWith;
	var min = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$3(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
	$$1i({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = String(requireObjectCoercible$2(this));
	    notARegExp(searchString);
	    var index = toLength$7(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces$4 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var requireObjectCoercible$1 = requireObjectCoercible$f;
	var whitespaces$3 = whitespaces$4;

	var whitespace = '[' + whitespaces$3 + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible$1($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod(3)
	};

	var fails$q = fails$V;
	var whitespaces$2 = whitespaces$4;

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails$q(function () {
	    return !!whitespaces$2[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces$2[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $$1h = _export;
	var $trim = stringTrim.trim;
	var forcedStringTrimMethod$2 = stringTrimForced;

	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	$$1h({ target: 'String', proto: true, forced: forcedStringTrimMethod$2('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var $$1g = _export;
	var $trimStart = stringTrim.start;
	var forcedStringTrimMethod$1 = stringTrimForced;

	var FORCED$h = forcedStringTrimMethod$1('trimStart');

	var trimStart = FORCED$h ? function trimStart() {
	  return $trimStart(this);
	} : ''.trimStart;

	// `String.prototype.{ trimStart, trimLeft }` methods
	// https://github.com/tc39/ecmascript-string-left-right-trim
	$$1g({ target: 'String', proto: true, forced: FORCED$h }, {
	  trimStart: trimStart,
	  trimLeft: trimStart
	});

	var $$1f = _export;
	var $trimEnd = stringTrim.end;
	var forcedStringTrimMethod = stringTrimForced;

	var FORCED$g = forcedStringTrimMethod('trimEnd');

	var trimEnd = FORCED$g ? function trimEnd() {
	  return $trimEnd(this);
	} : ''.trimEnd;

	// `String.prototype.{ trimEnd, trimRight }` methods
	// https://github.com/tc39/ecmascript-string-left-right-trim
	$$1f({ target: 'String', proto: true, forced: FORCED$g }, {
	  trimEnd: trimEnd,
	  trimRight: trimEnd
	});

	var charAt = stringMultibyte.charAt;
	var InternalStateModule$8 = internalState;
	var defineIterator$1 = defineIterator$3;

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$9 = InternalStateModule$8.set;
	var getInternalState$4 = InternalStateModule$8.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator$1(String, 'String', function (iterated) {
	  setInternalState$9(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$4(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var requireObjectCoercible = requireObjectCoercible$f;

	var quot = /"/g;

	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	var fails$p = fails$V;

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails$p(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	var $$1e = _export;
	var createHTML$c = createHtml;
	var forcedStringHTMLMethod$c = stringHtmlForced;

	// `String.prototype.anchor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.anchor
	$$1e({ target: 'String', proto: true, forced: forcedStringHTMLMethod$c('anchor') }, {
	  anchor: function anchor(name) {
	    return createHTML$c(this, 'a', 'name', name);
	  }
	});

	var $$1d = _export;
	var createHTML$b = createHtml;
	var forcedStringHTMLMethod$b = stringHtmlForced;

	// `String.prototype.big` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.big
	$$1d({ target: 'String', proto: true, forced: forcedStringHTMLMethod$b('big') }, {
	  big: function big() {
	    return createHTML$b(this, 'big', '', '');
	  }
	});

	var $$1c = _export;
	var createHTML$a = createHtml;
	var forcedStringHTMLMethod$a = stringHtmlForced;

	// `String.prototype.blink` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.blink
	$$1c({ target: 'String', proto: true, forced: forcedStringHTMLMethod$a('blink') }, {
	  blink: function blink() {
	    return createHTML$a(this, 'blink', '', '');
	  }
	});

	var $$1b = _export;
	var createHTML$9 = createHtml;
	var forcedStringHTMLMethod$9 = stringHtmlForced;

	// `String.prototype.bold` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.bold
	$$1b({ target: 'String', proto: true, forced: forcedStringHTMLMethod$9('bold') }, {
	  bold: function bold() {
	    return createHTML$9(this, 'b', '', '');
	  }
	});

	var $$1a = _export;
	var createHTML$8 = createHtml;
	var forcedStringHTMLMethod$8 = stringHtmlForced;

	// `String.prototype.fixed` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fixed
	$$1a({ target: 'String', proto: true, forced: forcedStringHTMLMethod$8('fixed') }, {
	  fixed: function fixed() {
	    return createHTML$8(this, 'tt', '', '');
	  }
	});

	var $$19 = _export;
	var createHTML$7 = createHtml;
	var forcedStringHTMLMethod$7 = stringHtmlForced;

	// `String.prototype.fontcolor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fontcolor
	$$19({ target: 'String', proto: true, forced: forcedStringHTMLMethod$7('fontcolor') }, {
	  fontcolor: function fontcolor(color) {
	    return createHTML$7(this, 'font', 'color', color);
	  }
	});

	var $$18 = _export;
	var createHTML$6 = createHtml;
	var forcedStringHTMLMethod$6 = stringHtmlForced;

	// `String.prototype.fontsize` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.fontsize
	$$18({ target: 'String', proto: true, forced: forcedStringHTMLMethod$6('fontsize') }, {
	  fontsize: function fontsize(size) {
	    return createHTML$6(this, 'font', 'size', size);
	  }
	});

	var $$17 = _export;
	var createHTML$5 = createHtml;
	var forcedStringHTMLMethod$5 = stringHtmlForced;

	// `String.prototype.italics` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.italics
	$$17({ target: 'String', proto: true, forced: forcedStringHTMLMethod$5('italics') }, {
	  italics: function italics() {
	    return createHTML$5(this, 'i', '', '');
	  }
	});

	var $$16 = _export;
	var createHTML$4 = createHtml;
	var forcedStringHTMLMethod$4 = stringHtmlForced;

	// `String.prototype.link` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.link
	$$16({ target: 'String', proto: true, forced: forcedStringHTMLMethod$4('link') }, {
	  link: function link(url) {
	    return createHTML$4(this, 'a', 'href', url);
	  }
	});

	var $$15 = _export;
	var createHTML$3 = createHtml;
	var forcedStringHTMLMethod$3 = stringHtmlForced;

	// `String.prototype.small` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.small
	$$15({ target: 'String', proto: true, forced: forcedStringHTMLMethod$3('small') }, {
	  small: function small() {
	    return createHTML$3(this, 'small', '', '');
	  }
	});

	var $$14 = _export;
	var createHTML$2 = createHtml;
	var forcedStringHTMLMethod$2 = stringHtmlForced;

	// `String.prototype.strike` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.strike
	$$14({ target: 'String', proto: true, forced: forcedStringHTMLMethod$2('strike') }, {
	  strike: function strike() {
	    return createHTML$2(this, 'strike', '', '');
	  }
	});

	var $$13 = _export;
	var createHTML$1 = createHtml;
	var forcedStringHTMLMethod$1 = stringHtmlForced;

	// `String.prototype.sub` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sub
	$$13({ target: 'String', proto: true, forced: forcedStringHTMLMethod$1('sub') }, {
	  sub: function sub() {
	    return createHTML$1(this, 'sub', '', '');
	  }
	});

	var $$12 = _export;
	var createHTML = createHtml;
	var forcedStringHTMLMethod = stringHtmlForced;

	// `String.prototype.sup` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.sup
	$$12({ target: 'String', proto: true, forced: forcedStringHTMLMethod('sup') }, {
	  sup: function sup() {
	    return createHTML(this, 'sup', '', '');
	  }
	});

	var isObject$e = isObject$z;
	var setPrototypeOf$4 = objectSetPrototypeOf$1;

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired$4 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    setPrototypeOf$4 &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject$e(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) setPrototypeOf$4($this, NewTargetPrototype);
	  return $this;
	};

	var DESCRIPTORS$b = descriptors;
	var global$t = global$J;
	var isForced$3 = isForced_1;
	var inheritIfRequired$3 = inheritIfRequired$4;
	var defineProperty$6 = objectDefineProperty.f;
	var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;
	var isRegExp$1 = isRegexp;
	var getFlags = regexpFlags$1;
	var stickyHelpers = regexpStickyHelpers;
	var redefine$a = redefine$g.exports;
	var fails$o = fails$V;
	var setInternalState$8 = internalState.set;
	var setSpecies$4 = setSpecies$6;
	var wellKnownSymbol$7 = wellKnownSymbol$u;

	var MATCH = wellKnownSymbol$7('match');
	var NativeRegExp = global$t.RegExp;
	var RegExpPrototype$2 = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var UNSUPPORTED_Y$2 = stickyHelpers.UNSUPPORTED_Y;

	var FORCED$f = DESCRIPTORS$b && isForced$3('RegExp', (!CORRECT_NEW || UNSUPPORTED_Y$2 || fails$o(function () {
	  re2[MATCH] = false;
	  // RegExp constructor can alter flags and IsRegExp works correct with @@match
	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})));

	// `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor
	if (FORCED$f) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegExp$1(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = getFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$2) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired$3(
	      CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags),
	      thisIsRegExp ? this : RegExpPrototype$2,
	      RegExpWrapper
	    );

	    if (UNSUPPORTED_Y$2 && sticky) setInternalState$8(result, { sticky: sticky });

	    return result;
	  };
	  var proxy$1 = function (key) {
	    key in RegExpWrapper || defineProperty$6(RegExpWrapper, key, {
	      configurable: true,
	      get: function () { return NativeRegExp[key]; },
	      set: function (it) { NativeRegExp[key] = it; }
	    });
	  };
	  var keys$2 = getOwnPropertyNames$3(NativeRegExp);
	  var index$2 = 0;
	  while (keys$2.length > index$2) proxy$1(keys$2[index$2++]);
	  RegExpPrototype$2.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$2;
	  redefine$a(global$t, 'RegExp', RegExpWrapper);
	}

	// https://tc39.github.io/ecma262/#sec-get-regexp-@@species
	setSpecies$4('RegExp');

	var DESCRIPTORS$a = descriptors;
	var objectDefinePropertyModule = objectDefineProperty;
	var regExpFlags = regexpFlags$1;
	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y;

	// `RegExp.prototype.flags` getter
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	if (DESCRIPTORS$a && (/./g.flags != 'g' || UNSUPPORTED_Y$1)) {
	  objectDefinePropertyModule.f(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regExpFlags
	  });
	}

	var DESCRIPTORS$9 = descriptors;
	var UNSUPPORTED_Y = regexpStickyHelpers.UNSUPPORTED_Y;
	var defineProperty$5 = objectDefineProperty.f;
	var getInternalState$3 = internalState.get;
	var RegExpPrototype$1 = RegExp.prototype;

	// `RegExp.prototype.sticky` getter
	if (DESCRIPTORS$9 && UNSUPPORTED_Y) {
	  defineProperty$5(RegExp.prototype, 'sticky', {
	    configurable: true,
	    get: function () {
	      if (this === RegExpPrototype$1) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (this instanceof RegExp) {
	        return !!getInternalState$3(this).sticky;
	      }
	      throw TypeError('Incompatible receiver, RegExp required');
	    }
	  });
	}

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var $$11 = _export;
	var isObject$d = isObject$z;

	var DELEGATES_TO_EXEC = function () {
	  var execCalled = false;
	  var re = /[ac]/;
	  re.exec = function () {
	    execCalled = true;
	    return /./.exec.apply(this, arguments);
	  };
	  return re.test('abc') === true && execCalled;
	}();

	var nativeTest = /./.test;

	$$11({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
	  test: function (str) {
	    if (typeof this.exec !== 'function') {
	      return nativeTest.call(this, str);
	    }
	    var result = this.exec(str);
	    if (result !== null && !isObject$d(result)) {
	      throw new Error('RegExp exec method returned something other than an Object or null');
	    }
	    return !!result;
	  }
	});

	var redefine$9 = redefine$g.exports;
	var anObject$h = anObject$x;
	var fails$n = fails$V;
	var flags$1 = regexpFlags$1;

	var TO_STRING$1 = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING$1];

	var NOT_GENERIC = fails$n(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine$9(RegExp.prototype, TO_STRING$1, function toString() {
	    var R = anObject$h(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags$1.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var global$s = global$J;
	var trim$2 = stringTrim.trim;
	var whitespaces$1 = whitespaces$4;

	var $parseInt = global$s.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$e = $parseInt(whitespaces$1 + '08') !== 8 || $parseInt(whitespaces$1 + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$e ? function parseInt(string, radix) {
	  var S = trim$2(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	var $$10 = _export;
	var parseIntImplementation = numberParseInt;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	$$10({ global: true, forced: parseInt != parseIntImplementation }, {
	  parseInt: parseIntImplementation
	});

	var global$r = global$J;
	var trim$1 = stringTrim.trim;
	var whitespaces = whitespaces$4;

	var $parseFloat = global$r.parseFloat;
	var FORCED$d = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

	// `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$d ? function parseFloat(string) {
	  var trimmedString = trim$1(String(string));
	  var result = $parseFloat(trimmedString);
	  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
	} : $parseFloat;

	var $$$ = _export;
	var parseFloatImplementation = numberParseFloat;

	// `parseFloat` method
	// https://tc39.github.io/ecma262/#sec-parsefloat-string
	$$$({ global: true, forced: parseFloat != parseFloatImplementation }, {
	  parseFloat: parseFloatImplementation
	});

	var DESCRIPTORS$8 = descriptors;
	var global$q = global$J;
	var isForced$2 = isForced_1;
	var redefine$8 = redefine$g.exports;
	var has$6 = has$l;
	var classof$8 = classofRaw$1;
	var inheritIfRequired$2 = inheritIfRequired$4;
	var toPrimitive$4 = toPrimitive$b;
	var fails$m = fails$V;
	var create$5 = objectCreate;
	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$4 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$q[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classof$8(create$5(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber$1 = function (argument) {
	  var it = toPrimitive$4(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced$2(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails$m(function () { NumberPrototype.valueOf.call(dummy); }) : classof$8(dummy) != NUMBER)
	        ? inheritIfRequired$2(new NativeNumber(toNumber$1(it)), dummy, NumberWrapper) : toNumber$1(it);
	  };
	  for (var keys$1 = DESCRIPTORS$8 ? getOwnPropertyNames$2(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key$1; keys$1.length > j$1; j$1++) {
	    if (has$6(NativeNumber, key$1 = keys$1[j$1]) && !has$6(NumberWrapper, key$1)) {
	      defineProperty$4(NumberWrapper, key$1, getOwnPropertyDescriptor$2(NativeNumber, key$1));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine$8(global$q, NUMBER, NumberWrapper);
	}

	var $$_ = _export;

	// `Number.EPSILON` constant
	// https://tc39.github.io/ecma262/#sec-number.epsilon
	$$_({ target: 'Number', stat: true }, {
	  EPSILON: Math.pow(2, -52)
	});

	var global$p = global$J;

	var globalIsFinite = global$p.isFinite;

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	var numberIsFinite$1 = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	var $$Z = _export;
	var numberIsFinite = numberIsFinite$1;

	// `Number.isFinite` method
	// https://tc39.github.io/ecma262/#sec-number.isfinite
	$$Z({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

	var isObject$c = isObject$z;

	var floor$7 = Math.floor;

	// `Number.isInteger` method implementation
	// https://tc39.github.io/ecma262/#sec-number.isinteger
	var isInteger$2 = function isInteger(it) {
	  return !isObject$c(it) && isFinite(it) && floor$7(it) === it;
	};

	var $$Y = _export;
	var isInteger$1 = isInteger$2;

	// `Number.isInteger` method
	// https://tc39.github.io/ecma262/#sec-number.isinteger
	$$Y({ target: 'Number', stat: true }, {
	  isInteger: isInteger$1
	});

	var $$X = _export;

	// `Number.isNaN` method
	// https://tc39.github.io/ecma262/#sec-number.isnan
	$$X({ target: 'Number', stat: true }, {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

	var $$W = _export;
	var isInteger = isInteger$2;

	var abs$7 = Math.abs;

	// `Number.isSafeInteger` method
	// https://tc39.github.io/ecma262/#sec-number.issafeinteger
	$$W({ target: 'Number', stat: true }, {
	  isSafeInteger: function isSafeInteger(number) {
	    return isInteger(number) && abs$7(number) <= 0x1FFFFFFFFFFFFF;
	  }
	});

	var $$V = _export;

	// `Number.MAX_SAFE_INTEGER` constant
	// https://tc39.github.io/ecma262/#sec-number.max_safe_integer
	$$V({ target: 'Number', stat: true }, {
	  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
	});

	var $$U = _export;

	// `Number.MIN_SAFE_INTEGER` constant
	// https://tc39.github.io/ecma262/#sec-number.min_safe_integer
	$$U({ target: 'Number', stat: true }, {
	  MIN_SAFE_INTEGER: -0x1FFFFFFFFFFFFF
	});

	var $$T = _export;
	var parseFloat$1 = numberParseFloat;

	// `Number.parseFloat` method
	// https://tc39.github.io/ecma262/#sec-number.parseFloat
	$$T({ target: 'Number', stat: true, forced: Number.parseFloat != parseFloat$1 }, {
	  parseFloat: parseFloat$1
	});

	var $$S = _export;
	var parseInt$1 = numberParseInt;

	// `Number.parseInt` method
	// https://tc39.github.io/ecma262/#sec-number.parseint
	$$S({ target: 'Number', stat: true, forced: Number.parseInt != parseInt$1 }, {
	  parseInt: parseInt$1
	});

	var classof$7 = classofRaw$1;

	// `thisNumberValue` abstract operation
	// https://tc39.github.io/ecma262/#sec-thisnumbervalue
	var thisNumberValue$2 = function (value) {
	  if (typeof value != 'number' && classof$7(value) != 'Number') {
	    throw TypeError('Incorrect invocation');
	  }
	  return +value;
	};

	var $$R = _export;
	var toInteger$3 = toInteger$c;
	var thisNumberValue$1 = thisNumberValue$2;
	var repeat$2 = stringRepeat;
	var fails$l = fails$V;

	var nativeToFixed = 1.0.toFixed;
	var floor$6 = Math.floor;

	var pow$4 = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow$4(x, n - 1, acc * x) : pow$4(x * x, n / 2, acc);
	};

	var log$8 = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var FORCED$c = nativeToFixed && (
	  0.00008.toFixed(3) !== '0.000' ||
	  0.9.toFixed(0) !== '1' ||
	  1.255.toFixed(2) !== '1.25' ||
	  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
	) || !fails$l(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed.call({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.github.io/ecma262/#sec-number.prototype.tofixed
	$$R({ target: 'Number', proto: true, forced: FORCED$c }, {
	  // eslint-disable-next-line max-statements
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue$1(this);
	    var fractDigits = toInteger$3(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    var multiply = function (n, c) {
	      var index = -1;
	      var c2 = c;
	      while (++index < 6) {
	        c2 += n * data[index];
	        data[index] = c2 % 1e7;
	        c2 = floor$6(c2 / 1e7);
	      }
	    };

	    var divide = function (n) {
	      var index = 6;
	      var c = 0;
	      while (--index >= 0) {
	        c += data[index];
	        data[index] = floor$6(c / n);
	        c = (c % n) * 1e7;
	      }
	    };

	    var dataToString = function () {
	      var index = 6;
	      var s = '';
	      while (--index >= 0) {
	        if (s !== '' || index === 0 || data[index] !== 0) {
	          var t = String(data[index]);
	          s = s === '' ? t : s + repeat$2.call('0', 7 - t.length) + t;
	        }
	      } return s;
	    };

	    if (fractDigits < 0 || fractDigits > 20) throw RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log$8(number * pow$4(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow$4(2, -e, 1) : number / pow$4(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(1e7, 0);
	          j -= 7;
	        }
	        multiply(pow$4(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(1 << 23);
	          j -= 23;
	        }
	        divide(1 << j);
	        multiply(1, 1);
	        divide(2);
	        result = dataToString();
	      } else {
	        multiply(0, z);
	        multiply(1 << -e, 0);
	        result = dataToString() + repeat$2.call('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + repeat$2.call('0', fractDigits - k) + result
	        : result.slice(0, k - fractDigits) + '.' + result.slice(k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	var $$Q = _export;
	var fails$k = fails$V;
	var thisNumberValue = thisNumberValue$2;

	var nativeToPrecision = 1.0.toPrecision;

	var FORCED$b = fails$k(function () {
	  // IE7-
	  return nativeToPrecision.call(1, undefined) !== '1';
	}) || !fails$k(function () {
	  // V8 ~ Android 4.3-
	  nativeToPrecision.call({});
	});

	// `Number.prototype.toPrecision` method
	// https://tc39.github.io/ecma262/#sec-number.prototype.toprecision
	$$Q({ target: 'Number', proto: true, forced: FORCED$b }, {
	  toPrecision: function toPrecision(precision) {
	    return precision === undefined
	      ? nativeToPrecision.call(thisNumberValue(this))
	      : nativeToPrecision.call(thisNumberValue(this), precision);
	  }
	});

	var log$7 = Math.log;

	// `Math.log1p` method implementation
	// https://tc39.github.io/ecma262/#sec-math.log1p
	var mathLog1p = Math.log1p || function log1p(x) {
	  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log$7(1 + x);
	};

	var $$P = _export;
	var log1p$1 = mathLog1p;

	var nativeAcosh = Math.acosh;
	var log$6 = Math.log;
	var sqrt$2 = Math.sqrt;
	var LN2$2 = Math.LN2;

	var FORCED$a = !nativeAcosh
	  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
	  || Math.floor(nativeAcosh(Number.MAX_VALUE)) != 710
	  // Tor Browser bug: Math.acosh(Infinity) -> NaN
	  || nativeAcosh(Infinity) != Infinity;

	// `Math.acosh` method
	// https://tc39.github.io/ecma262/#sec-math.acosh
	$$P({ target: 'Math', stat: true, forced: FORCED$a }, {
	  acosh: function acosh(x) {
	    return (x = +x) < 1 ? NaN : x > 94906265.62425156
	      ? log$6(x) + LN2$2
	      : log1p$1(x - 1 + sqrt$2(x - 1) * sqrt$2(x + 1));
	  }
	});

	var $$O = _export;

	var nativeAsinh = Math.asinh;
	var log$5 = Math.log;
	var sqrt$1 = Math.sqrt;

	function asinh(x) {
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log$5(x + sqrt$1(x * x + 1));
	}

	// `Math.asinh` method
	// https://tc39.github.io/ecma262/#sec-math.asinh
	// Tor Browser bug: Math.asinh(0) -> -0
	$$O({ target: 'Math', stat: true, forced: !(nativeAsinh && 1 / nativeAsinh(0) > 0) }, {
	  asinh: asinh
	});

	var $$N = _export;

	var nativeAtanh = Math.atanh;
	var log$4 = Math.log;

	// `Math.atanh` method
	// https://tc39.github.io/ecma262/#sec-math.atanh
	// Tor Browser bug: Math.atanh(-0) -> 0
	$$N({ target: 'Math', stat: true, forced: !(nativeAtanh && 1 / nativeAtanh(-0) < 0) }, {
	  atanh: function atanh(x) {
	    return (x = +x) == 0 ? x : log$4((1 + x) / (1 - x)) / 2;
	  }
	});

	// `Math.sign` method implementation
	// https://tc39.github.io/ecma262/#sec-math.sign
	var mathSign = Math.sign || function sign(x) {
	  // eslint-disable-next-line no-self-compare
	  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	};

	var $$M = _export;
	var sign$2 = mathSign;

	var abs$6 = Math.abs;
	var pow$3 = Math.pow;

	// `Math.cbrt` method
	// https://tc39.github.io/ecma262/#sec-math.cbrt
	$$M({ target: 'Math', stat: true }, {
	  cbrt: function cbrt(x) {
	    return sign$2(x = +x) * pow$3(abs$6(x), 1 / 3);
	  }
	});

	var $$L = _export;

	var floor$5 = Math.floor;
	var log$3 = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.github.io/ecma262/#sec-math.clz32
	$$L({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    return (x >>>= 0) ? 31 - floor$5(log$3(x + 0.5) * LOG2E) : 32;
	  }
	});

	var nativeExpm1 = Math.expm1;
	var exp$2 = Math.exp;

	// `Math.expm1` method implementation
	// https://tc39.github.io/ecma262/#sec-math.expm1
	var mathExpm1 = (!nativeExpm1
	  // Old FF bug
	  || nativeExpm1(10) > 22025.465794806719 || nativeExpm1(10) < 22025.4657948067165168
	  // Tor Browser bug
	  || nativeExpm1(-2e-17) != -2e-17
	) ? function expm1(x) {
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp$2(x) - 1;
	} : nativeExpm1;

	var $$K = _export;
	var expm1$3 = mathExpm1;

	var nativeCosh = Math.cosh;
	var abs$5 = Math.abs;
	var E$1 = Math.E;

	// `Math.cosh` method
	// https://tc39.github.io/ecma262/#sec-math.cosh
	$$K({ target: 'Math', stat: true, forced: !nativeCosh || nativeCosh(710) === Infinity }, {
	  cosh: function cosh(x) {
	    var t = expm1$3(abs$5(x) - 1) + 1;
	    return (t + 1 / (t * E$1 * E$1)) * (E$1 / 2);
	  }
	});

	var $$J = _export;
	var expm1$2 = mathExpm1;

	// `Math.expm1` method
	// https://tc39.github.io/ecma262/#sec-math.expm1
	$$J({ target: 'Math', stat: true, forced: expm1$2 != Math.expm1 }, { expm1: expm1$2 });

	var sign$1 = mathSign;

	var abs$4 = Math.abs;
	var pow$2 = Math.pow;
	var EPSILON = pow$2(2, -52);
	var EPSILON32 = pow$2(2, -23);
	var MAX32 = pow$2(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$2(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	// `Math.fround` method implementation
	// https://tc39.github.io/ecma262/#sec-math.fround
	var mathFround = Math.fround || function fround(x) {
	  var $abs = abs$4(x);
	  var $sign = sign$1(x);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};

	var $$I = _export;
	var fround = mathFround;

	// `Math.fround` method
	// https://tc39.github.io/ecma262/#sec-math.fround
	$$I({ target: 'Math', stat: true }, { fround: fround });

	var $$H = _export;

	var $hypot = Math.hypot;
	var abs$3 = Math.abs;
	var sqrt = Math.sqrt;

	// Chrome 77 bug
	// https://bugs.chromium.org/p/v8/issues/detail?id=9546
	var BUGGY = !!$hypot && $hypot(Infinity, NaN) !== Infinity;

	// `Math.hypot` method
	// https://tc39.github.io/ecma262/#sec-math.hypot
	$$H({ target: 'Math', stat: true, forced: BUGGY }, {
	  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
	    var sum = 0;
	    var i = 0;
	    var aLen = arguments.length;
	    var larg = 0;
	    var arg, div;
	    while (i < aLen) {
	      arg = abs$3(arguments[i++]);
	      if (larg < arg) {
	        div = larg / arg;
	        sum = sum * div * div + 1;
	        larg = arg;
	      } else if (arg > 0) {
	        div = arg / larg;
	        sum += div * div;
	      } else sum += arg;
	    }
	    return larg === Infinity ? Infinity : larg * sqrt(sum);
	  }
	});

	var $$G = _export;
	var fails$j = fails$V;

	var nativeImul = Math.imul;

	var FORCED$9 = fails$j(function () {
	  return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
	});

	// `Math.imul` method
	// https://tc39.github.io/ecma262/#sec-math.imul
	// some WebKit versions fails with big numbers, some has wrong arity
	$$G({ target: 'Math', stat: true, forced: FORCED$9 }, {
	  imul: function imul(x, y) {
	    var UINT16 = 0xFFFF;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	var $$F = _export;

	var log$2 = Math.log;
	var LOG10E = Math.LOG10E;

	// `Math.log10` method
	// https://tc39.github.io/ecma262/#sec-math.log10
	$$F({ target: 'Math', stat: true }, {
	  log10: function log10(x) {
	    return log$2(x) * LOG10E;
	  }
	});

	var $$E = _export;
	var log1p = mathLog1p;

	// `Math.log1p` method
	// https://tc39.github.io/ecma262/#sec-math.log1p
	$$E({ target: 'Math', stat: true }, { log1p: log1p });

	var $$D = _export;

	var log$1 = Math.log;
	var LN2$1 = Math.LN2;

	// `Math.log2` method
	// https://tc39.github.io/ecma262/#sec-math.log2
	$$D({ target: 'Math', stat: true }, {
	  log2: function log2(x) {
	    return log$1(x) / LN2$1;
	  }
	});

	var $$C = _export;
	var sign = mathSign;

	// `Math.sign` method
	// https://tc39.github.io/ecma262/#sec-math.sign
	$$C({ target: 'Math', stat: true }, {
	  sign: sign
	});

	var $$B = _export;
	var fails$i = fails$V;
	var expm1$1 = mathExpm1;

	var abs$2 = Math.abs;
	var exp$1 = Math.exp;
	var E = Math.E;

	var FORCED$8 = fails$i(function () {
	  return Math.sinh(-2e-17) != -2e-17;
	});

	// `Math.sinh` method
	// https://tc39.github.io/ecma262/#sec-math.sinh
	// V8 near Chromium 38 has a problem with very small numbers
	$$B({ target: 'Math', stat: true, forced: FORCED$8 }, {
	  sinh: function sinh(x) {
	    return abs$2(x = +x) < 1 ? (expm1$1(x) - expm1$1(-x)) / 2 : (exp$1(x - 1) - exp$1(-x - 1)) * (E / 2);
	  }
	});

	var $$A = _export;
	var expm1 = mathExpm1;

	var exp = Math.exp;

	// `Math.tanh` method
	// https://tc39.github.io/ecma262/#sec-math.tanh
	$$A({ target: 'Math', stat: true }, {
	  tanh: function tanh(x) {
	    var a = expm1(x = +x);
	    var b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  }
	});

	var setToStringTag$6 = setToStringTag$a;

	// Math[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
	setToStringTag$6(Math, 'Math', true);

	var $$z = _export;

	var ceil = Math.ceil;
	var floor$4 = Math.floor;

	// `Math.trunc` method
	// https://tc39.github.io/ecma262/#sec-math.trunc
	$$z({ target: 'Math', stat: true }, {
	  trunc: function trunc(it) {
	    return (it > 0 ? floor$4 : ceil)(it);
	  }
	});

	var $$y = _export;

	// `Date.now` method
	// https://tc39.github.io/ecma262/#sec-date.now
	$$y({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	var $$x = _export;
	var fails$h = fails$V;
	var toObject$3 = toObject$o;
	var toPrimitive$3 = toPrimitive$b;

	var FORCED$7 = fails$h(function () {
	  return new Date(NaN).toJSON() !== null
	    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
	});

	// `Date.prototype.toJSON` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.tojson
	$$x({ target: 'Date', proto: true, forced: FORCED$7 }, {
	  // eslint-disable-next-line no-unused-vars
	  toJSON: function toJSON(key) {
	    var O = toObject$3(this);
	    var pv = toPrimitive$3(O);
	    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
	  }
	});

	var fails$g = fails$V;
	var padStart = stringPad.start;

	var abs$1 = Math.abs;
	var DatePrototype$2 = Date.prototype;
	var getTime$1 = DatePrototype$2.getTime;
	var nativeDateToISOString = DatePrototype$2.toISOString;

	// `Date.prototype.toISOString` method implementation
	// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit fails here:
	var dateToIsoString = (fails$g(function () {
	  return nativeDateToISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !fails$g(function () {
	  nativeDateToISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime$1.call(this))) throw RangeError('Invalid time value');
	  var date = this;
	  var year = date.getUTCFullYear();
	  var milliseconds = date.getUTCMilliseconds();
	  var sign = year < 0 ? '-' : year > 9999 ? '+' : '';
	  return sign + padStart(abs$1(year), sign ? 6 : 4, 0) +
	    '-' + padStart(date.getUTCMonth() + 1, 2, 0) +
	    '-' + padStart(date.getUTCDate(), 2, 0) +
	    'T' + padStart(date.getUTCHours(), 2, 0) +
	    ':' + padStart(date.getUTCMinutes(), 2, 0) +
	    ':' + padStart(date.getUTCSeconds(), 2, 0) +
	    '.' + padStart(milliseconds, 3, 0) +
	    'Z';
	} : nativeDateToISOString;

	var $$w = _export;
	var toISOString = dateToIsoString;

	// `Date.prototype.toISOString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.toisostring
	// PhantomJS / old WebKit has a broken implementations
	$$w({ target: 'Date', proto: true, forced: Date.prototype.toISOString !== toISOString }, {
	  toISOString: toISOString
	});

	var redefine$7 = redefine$g.exports;

	var DatePrototype$1 = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var nativeDateToString = DatePrototype$1[TO_STRING];
	var getTime = DatePrototype$1.getTime;

	// `Date.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
	if (new Date(NaN) + '' != INVALID_DATE) {
	  redefine$7(DatePrototype$1, TO_STRING, function toString() {
	    var value = getTime.call(this);
	    // eslint-disable-next-line no-self-compare
	    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
	  });
	}

	var anObject$g = anObject$x;
	var toPrimitive$2 = toPrimitive$b;

	var dateToPrimitive$1 = function (hint) {
	  if (hint !== 'string' && hint !== 'number' && hint !== 'default') {
	    throw TypeError('Incorrect hint');
	  } return toPrimitive$2(anObject$g(this), hint !== 'number');
	};

	var createNonEnumerableProperty$6 = createNonEnumerableProperty$g;
	var dateToPrimitive = dateToPrimitive$1;
	var wellKnownSymbol$6 = wellKnownSymbol$u;

	var TO_PRIMITIVE = wellKnownSymbol$6('toPrimitive');
	var DatePrototype = Date.prototype;

	// `Date.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-date.prototype-@@toprimitive
	if (!(TO_PRIMITIVE in DatePrototype)) {
	  createNonEnumerableProperty$6(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
	}

	var $$v = _export;
	var getBuiltIn$7 = getBuiltIn$d;
	var fails$f = fails$V;

	var $stringify = getBuiltIn$7('JSON', 'stringify');
	var re = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var fix = function (match, offset, string) {
	  var prev = string.charAt(offset - 1);
	  var next = string.charAt(offset + 1);
	  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
	    return '\\u' + match.charCodeAt(0).toString(16);
	  } return match;
	};

	var FORCED$6 = fails$f(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	if ($stringify) {
	  // https://github.com/tc39/proposal-well-formed-stringify
	  $$v({ target: 'JSON', stat: true, forced: FORCED$6 }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var result = $stringify.apply(null, arguments);
	      return typeof result == 'string' ? result.replace(re, fix) : result;
	    }
	  });
	}

	var global$o = global$J;
	var setToStringTag$5 = setToStringTag$a;

	// JSON[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
	setToStringTag$5(global$o.JSON, 'JSON', true);

	var global$n = global$J;

	var nativePromiseConstructor = global$n.Promise;

	var redefine$6 = redefine$g.exports;

	var redefineAll$6 = function (target, src, options) {
	  for (var key in src) redefine$6(target, key, src[key], options);
	  return target;
	};

	var anInstance$8 = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var userAgent$1 = engineUserAgent;

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent$1);

	var global$m = global$J;
	var fails$e = fails$V;
	var classof$6 = classofRaw$1;
	var bind$8 = functionBindContext;
	var html$1 = html$3;
	var createElement$2 = documentCreateElement$1;
	var IS_IOS$1 = engineIsIos;

	var location = global$m.location;
	var set$3 = global$m.setImmediate;
	var clear = global$m.clearImmediate;
	var process$4 = global$m.process;
	var MessageChannel = global$m.MessageChannel;
	var Dispatch = global$m.Dispatch;
	var counter$1 = 0;
	var queue$1 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue$1.hasOwnProperty(id)) {
	    var fn = queue$1[id];
	    delete queue$1[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global$m.postMessage(id + '', location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$3 || !clear) {
	  set$3 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue$1[++counter$1] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter$1);
	    return counter$1;
	  };
	  clear = function clearImmediate(id) {
	    delete queue$1[id];
	  };
	  // Node.js 0.8-
	  if (classof$6(process$4) == 'process') {
	    defer = function (id) {
	      process$4.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !IS_IOS$1) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bind$8(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global$m.addEventListener &&
	    typeof postMessage == 'function' &&
	    !global$m.importScripts &&
	    !fails$e(post) &&
	    location.protocol !== 'file:'
	  ) {
	    defer = post;
	    global$m.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in createElement$2('script')) {
	    defer = function (id) {
	      html$1.appendChild(createElement$2('script'))[ONREADYSTATECHANGE] = function () {
	        html$1.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$2 = {
	  set: set$3,
	  clear: clear
	};

	var global$l = global$J;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var classof$5 = classofRaw$1;
	var macrotask = task$2.set;
	var IS_IOS = engineIsIos;

	var MutationObserver$1 = global$l.MutationObserver || global$l.WebKitMutationObserver;
	var process$3 = global$l.process;
	var Promise$1 = global$l.Promise;
	var IS_NODE$1 = classof$5(process$3) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$l, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE$1 && (parent = process$3.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE$1) {
	    notify$1 = function () {
	      process$3.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver$1 && !IS_IOS) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver$1(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify$1 = function () {
	      then.call(promise, flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify$1 = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global$l, flush);
	    };
	  }
	}

	var microtask$2 = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify$1();
	  } last = task;
	};

	var newPromiseCapability$2 = {};

	var aFunction$5 = aFunction$f;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$5(resolve);
	  this.reject = aFunction$5(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	newPromiseCapability$2.f = function (C) {
	  return new PromiseCapability(C);
	};

	var anObject$f = anObject$x;
	var isObject$b = isObject$z;
	var newPromiseCapability$1 = newPromiseCapability$2;

	var promiseResolve$2 = function (C, x) {
	  anObject$f(C);
	  if (isObject$b(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability$1.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var global$k = global$J;

	var hostReportErrors$1 = function (a, b) {
	  var console = global$k.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform$4 = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var $$u = _export;
	var global$j = global$J;
	var getBuiltIn$6 = getBuiltIn$d;
	var NativePromise$1 = nativePromiseConstructor;
	var redefine$5 = redefine$g.exports;
	var redefineAll$5 = redefineAll$6;
	var setToStringTag$4 = setToStringTag$a;
	var setSpecies$3 = setSpecies$6;
	var isObject$a = isObject$z;
	var aFunction$4 = aFunction$f;
	var anInstance$7 = anInstance$8;
	var classof$4 = classofRaw$1;
	var inspectSource = inspectSource$3;
	var iterate$6 = iterate$9.exports;
	var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$4;
	var speciesConstructor$6 = speciesConstructor$9;
	var task$1 = task$2.set;
	var microtask$1 = microtask$2;
	var promiseResolve$1 = promiseResolve$2;
	var hostReportErrors = hostReportErrors$1;
	var newPromiseCapabilityModule$3 = newPromiseCapability$2;
	var perform$3 = perform$4;
	var InternalStateModule$7 = internalState;
	var isForced$1 = isForced_1;
	var wellKnownSymbol$5 = wellKnownSymbol$u;
	var V8_VERSION = engineV8Version;

	var SPECIES = wellKnownSymbol$5('species');
	var PROMISE = 'Promise';
	var getInternalState$2 = InternalStateModule$7.get;
	var setInternalState$7 = InternalStateModule$7.set;
	var getInternalPromiseState = InternalStateModule$7.getterFor(PROMISE);
	var PromiseConstructor = NativePromise$1;
	var TypeError$1 = global$j.TypeError;
	var document$1 = global$j.document;
	var process$2 = global$j.process;
	var $fetch$1 = getBuiltIn$6('fetch');
	var newPromiseCapability = newPromiseCapabilityModule$3.f;
	var newGenericPromiseCapability = newPromiseCapability;
	var IS_NODE = classof$4(process$2) == 'process';
	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$j.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$5 = isForced$1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (V8_VERSION === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION = FORCED$5 || !checkCorrectnessOfIteration$2(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject$a(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask$1(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$j.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global$j['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global$j, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform$3(function () {
	        if (IS_NODE) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global$j, function () {
	    if (IS_NODE) {
	      process$2.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind$7 = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask$1(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind$7(internalResolve, promise, wrapper, state),
	            bind$7(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$5) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance$7(this, PromiseConstructor, PROMISE);
	    aFunction$4(executor);
	    Internal.call(this);
	    var state = getInternalState$2(this);
	    try {
	      executor(bind$7(internalResolve, this, state), bind$7(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$7(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll$5(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability(speciesConstructor$6(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE ? process$2.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$2(promise);
	    this.promise = promise;
	    this.resolve = bind$7(internalResolve, promise, state);
	    this.reject = bind$7(internalReject, promise, state);
	  };
	  newPromiseCapabilityModule$3.f = newPromiseCapability = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (typeof NativePromise$1 == 'function') {
	    nativeThen = NativePromise$1.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine$5(NativePromise$1.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch$1 == 'function') $$u({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve$1(PromiseConstructor, $fetch$1.apply(global$j, arguments));
	      }
	    });
	  }
	}

	$$u({ global: true, wrap: true, forced: FORCED$5 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag$4(PromiseConstructor, PROMISE, false);
	setSpecies$3(PROMISE);

	PromiseWrapper = getBuiltIn$6(PROMISE);

	// statics
	$$u({ target: PROMISE, stat: true, forced: FORCED$5 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	$$u({ target: PROMISE, stat: true, forced: FORCED$5 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve$1(this, x);
	  }
	});

	$$u({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$3(function () {
	      var $promiseResolve = aFunction$4(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$6(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = perform$3(function () {
	      var $promiseResolve = aFunction$4(C.resolve);
	      iterate$6(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$t = _export;
	var aFunction$3 = aFunction$f;
	var newPromiseCapabilityModule$2 = newPromiseCapability$2;
	var perform$2 = perform$4;
	var iterate$5 = iterate$9.exports;

	// `Promise.allSettled` method
	// https://github.com/tc39/proposal-promise-allSettled
	$$t({ target: 'Promise', stat: true }, {
	  allSettled: function allSettled(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$2.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$2(function () {
	      var promiseResolve = aFunction$3(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$5(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'fulfilled', value: value };
	          --remaining || resolve(values);
	        }, function (e) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = { status: 'rejected', reason: e };
	          --remaining || resolve(values);
	        });
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$s = _export;
	var NativePromise = nativePromiseConstructor;
	var fails$d = fails$V;
	var getBuiltIn$5 = getBuiltIn$d;
	var speciesConstructor$5 = speciesConstructor$9;
	var promiseResolve = promiseResolve$2;
	var redefine$4 = redefine$g.exports;

	// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
	var NON_GENERIC = !!NativePromise && fails$d(function () {
	  NativePromise.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
	});

	// `Promise.prototype.finally` method
	// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
	$$s({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
	  'finally': function (onFinally) {
	    var C = speciesConstructor$5(this, getBuiltIn$5('Promise'));
	    var isFunction = typeof onFinally == 'function';
	    return this.then(
	      isFunction ? function (x) {
	        return promiseResolve(C, onFinally()).then(function () { return x; });
	      } : onFinally,
	      isFunction ? function (e) {
	        return promiseResolve(C, onFinally()).then(function () { throw e; });
	      } : onFinally
	    );
	  }
	});

	// patch native Promise.prototype for native async functions
	if (typeof NativePromise == 'function' && !NativePromise.prototype['finally']) {
	  redefine$4(NativePromise.prototype, 'finally', getBuiltIn$5('Promise').prototype['finally']);
	}

	var $$r = _export;
	var global$i = global$J;
	var isForced = isForced_1;
	var redefine$3 = redefine$g.exports;
	var InternalMetadataModule$1 = internalMetadata.exports;
	var iterate$4 = iterate$9.exports;
	var anInstance$6 = anInstance$8;
	var isObject$9 = isObject$z;
	var fails$c = fails$V;
	var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$4;
	var setToStringTag$3 = setToStringTag$a;
	var inheritIfRequired$1 = inheritIfRequired$4;

	var collection$4 = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$i[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine$3(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject$9(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject$9(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject$9(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails$c(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    InternalMetadataModule$1.REQUIRED = true;
	  } else if (isForced(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails$c(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration$1(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails$c(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance$6(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired$1(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate$4(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  $$r({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag$3(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineProperty$3 = objectDefineProperty.f;
	var create$4 = objectCreate;
	var redefineAll$4 = redefineAll$6;
	var bind$6 = functionBindContext;
	var anInstance$5 = anInstance$8;
	var iterate$3 = iterate$9.exports;
	var defineIterator = defineIterator$3;
	var setSpecies$2 = setSpecies$6;
	var DESCRIPTORS$7 = descriptors;
	var fastKey = internalMetadata.exports.fastKey;
	var InternalStateModule$6 = internalState;

	var setInternalState$6 = InternalStateModule$6.set;
	var internalStateGetterFor$1 = InternalStateModule$6.getterFor;

	var collectionStrong$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$5(that, C, CONSTRUCTOR_NAME);
	      setInternalState$6(that, {
	        type: CONSTRUCTOR_NAME,
	        index: create$4(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!DESCRIPTORS$7) that.size = 0;
	      if (iterable != undefined) iterate$3(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (DESCRIPTORS$7) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll$4(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (DESCRIPTORS$7) state.size = 0;
	        else that.size = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (DESCRIPTORS$7) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = bind$6(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll$4(C.prototype, IS_MAP ? {
	      // 23.1.3.6 Map.prototype.get(key)
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // 23.1.3.9 Map.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // 23.2.3.1 Set.prototype.add(value)
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (DESCRIPTORS$7) defineProperty$3(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$6(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies$2(CONSTRUCTOR_NAME);
	  }
	};

	var collection$3 = collection$4;
	var collectionStrong$1 = collectionStrong$2;

	// `Map` constructor
	// https://tc39.github.io/ecma262/#sec-map-objects
	collection$3('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong$1);

	var collection$2 = collection$4;
	var collectionStrong = collectionStrong$2;

	// `Set` constructor
	// https://tc39.github.io/ecma262/#sec-set-objects
	collection$2('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var redefineAll$3 = redefineAll$6;
	var getWeakData = internalMetadata.exports.getWeakData;
	var anObject$e = anObject$x;
	var isObject$8 = isObject$z;
	var anInstance$4 = anInstance$8;
	var iterate$2 = iterate$9.exports;
	var ArrayIterationModule = arrayIteration;
	var $has = has$l;
	var InternalStateModule$5 = internalState;

	var setInternalState$5 = InternalStateModule$5.set;
	var internalStateGetterFor = InternalStateModule$5.getterFor;
	var find$1 = ArrayIterationModule.find;
	var findIndex = ArrayIterationModule.findIndex;
	var id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find$1(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$4(that, C, CONSTRUCTOR_NAME);
	      setInternalState$5(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate$2(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject$e(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll$3(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject$8(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && $has(data, state.id) && delete data[state.id];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject$8(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && $has(data, state.id);
	      }
	    });

	    redefineAll$3(C.prototype, IS_MAP ? {
	      // 23.3.3.3 WeakMap.prototype.get(key)
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject$8(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // 23.3.3.5 WeakMap.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // 23.4.3.1 WeakSet.prototype.add(value)
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	var global$h = global$J;
	var redefineAll$2 = redefineAll$6;
	var InternalMetadataModule = internalMetadata.exports;
	var collection$1 = collection$4;
	var collectionWeak$1 = collectionWeak$2;
	var isObject$7 = isObject$z;
	var enforceIternalState = internalState.enforce;
	var NATIVE_WEAK_MAP = nativeWeakMap;

	var IS_IE11 = !global$h.ActiveXObject && 'ActiveXObject' in global$h;
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.github.io/ecma262/#sec-weakmap-constructor
	var $WeakMap = collection$1('WeakMap', wrapper, collectionWeak$1);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (NATIVE_WEAK_MAP && IS_IE11) {
	  InternalWeakMap = collectionWeak$1.getConstructor(wrapper, 'WeakMap', true);
	  InternalMetadataModule.REQUIRED = true;
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll$2(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject$7(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject$7(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject$7(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject$7(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}

	var collection = collection$4;
	var collectionWeak = collectionWeak$2;

	// `WeakSet` constructor
	// https://tc39.github.io/ecma262/#sec-weakset-constructor
	collection('WeakSet', function (init) {
	  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionWeak);

	var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

	var toInteger$2 = toInteger$c;
	var toLength$6 = toLength$t;

	// `ToIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-toindex
	var toIndex$2 = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger$2(it);
	  var length = toLength$6(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity$1 = 1 / 0;
	var abs = Math.abs;
	var pow$1 = Math.pow;
	var floor$3 = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = new Array(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow$1(2, -24) - pow$1(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs(number);
	  // eslint-disable-next-line no-self-compare
	  if (number != number || number === Infinity$1) {
	    // eslint-disable-next-line no-self-compare
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$3(log(number) / LN2);
	    if (number * (c = pow$1(2, -exponent)) < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow$1(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow$1(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow$1(2, eBias - 1) * pow$1(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
	  } else {
	    mantissa = mantissa + pow$1(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow$1(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var global$g = global$J;
	var DESCRIPTORS$6 = descriptors;
	var NATIVE_ARRAY_BUFFER$2 = arrayBufferNative;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$g;
	var redefineAll$1 = redefineAll$6;
	var fails$b = fails$V;
	var anInstance$3 = anInstance$8;
	var toInteger$1 = toInteger$c;
	var toLength$5 = toLength$t;
	var toIndex$1 = toIndex$2;
	var IEEE754 = ieee754;
	var getPrototypeOf$4 = objectGetPrototypeOf$1;
	var setPrototypeOf$3 = objectSetPrototypeOf$1;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var defineProperty$2 = objectDefineProperty.f;
	var arrayFill = arrayFill$1;
	var setToStringTag$2 = setToStringTag$a;
	var InternalStateModule$4 = internalState;

	var getInternalState$1 = InternalStateModule$4.get;
	var setInternalState$4 = InternalStateModule$4.set;
	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE = 'prototype';
	var WRONG_LENGTH$1 = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer$1 = global$g[ARRAY_BUFFER$1];
	var $ArrayBuffer = NativeArrayBuffer$1;
	var $DataView = global$g[DATA_VIEW];
	var $DataViewPrototype = $DataView && $DataView[PROTOTYPE];
	var ObjectPrototype$1 = Object.prototype;
	var RangeError$2 = global$g.RangeError;

	var packIEEE754 = IEEE754.pack;
	var unpackIEEE754 = IEEE754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter$1 = function (Constructor, key) {
	  defineProperty$2(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$1(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$2(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set$2 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$2(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!NATIVE_ARRAY_BUFFER$2) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance$3(this, $ArrayBuffer, ARRAY_BUFFER$1);
	    var byteLength = toIndex$1(length);
	    setInternalState$4(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!DESCRIPTORS$6) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance$3(this, $DataView, DATA_VIEW);
	    anInstance$3(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState$1(buffer).byteLength;
	    var offset = toInteger$1(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$2('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength$5(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$2(WRONG_LENGTH$1);
	    setInternalState$4(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!DESCRIPTORS$6) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  if (DESCRIPTORS$6) {
	    addGetter$1($ArrayBuffer, 'byteLength');
	    addGetter$1($DataView, 'buffer');
	    addGetter$1($DataView, 'byteLength');
	    addGetter$1($DataView, 'byteOffset');
	  }

	  redefineAll$1($DataView[PROTOTYPE], {
	    getInt8: function getInt8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get$1(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get$1(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get$1(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set$2(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set$2(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set$2(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set$2(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  if (!fails$b(function () {
	    NativeArrayBuffer$1(1);
	  }) || !fails$b(function () {
	    new NativeArrayBuffer$1(-1); // eslint-disable-line no-new
	  }) || fails$b(function () {
	    new NativeArrayBuffer$1(); // eslint-disable-line no-new
	    new NativeArrayBuffer$1(1.5); // eslint-disable-line no-new
	    new NativeArrayBuffer$1(NaN); // eslint-disable-line no-new
	    return NativeArrayBuffer$1.name != ARRAY_BUFFER$1;
	  })) {
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance$3(this, $ArrayBuffer);
	      return new NativeArrayBuffer$1(toIndex$1(length));
	    };
	    var ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE] = NativeArrayBuffer$1[PROTOTYPE];
	    for (var keys = getOwnPropertyNames$1(NativeArrayBuffer$1), j = 0, key; keys.length > j;) {
	      if (!((key = keys[j++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty$5($ArrayBuffer, key, NativeArrayBuffer$1[key]);
	      }
	    }
	    ArrayBufferPrototype.constructor = $ArrayBuffer;
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (setPrototypeOf$3 && getPrototypeOf$4($DataViewPrototype) !== ObjectPrototype$1) {
	    setPrototypeOf$3($DataViewPrototype, ObjectPrototype$1);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var nativeSetInt8 = $DataViewPrototype.setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll$1($DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag$2($ArrayBuffer, ARRAY_BUFFER$1);
	setToStringTag$2($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var $$q = _export;
	var global$f = global$J;
	var arrayBufferModule = arrayBuffer;
	var setSpecies$1 = setSpecies$6;

	var ARRAY_BUFFER = 'ArrayBuffer';
	var ArrayBuffer$4 = arrayBufferModule[ARRAY_BUFFER];
	var NativeArrayBuffer = global$f[ARRAY_BUFFER];

	// `ArrayBuffer` constructor
	// https://tc39.github.io/ecma262/#sec-arraybuffer-constructor
	$$q({ global: true, forced: NativeArrayBuffer !== ArrayBuffer$4 }, {
	  ArrayBuffer: ArrayBuffer$4
	});

	setSpecies$1(ARRAY_BUFFER);

	var NATIVE_ARRAY_BUFFER$1 = arrayBufferNative;
	var DESCRIPTORS$5 = descriptors;
	var global$e = global$J;
	var isObject$6 = isObject$z;
	var has$5 = has$l;
	var classof$3 = classof$e;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$g;
	var redefine$2 = redefine$g.exports;
	var defineProperty$1 = objectDefineProperty.f;
	var getPrototypeOf$3 = objectGetPrototypeOf$1;
	var setPrototypeOf$2 = objectSetPrototypeOf$1;
	var wellKnownSymbol$4 = wellKnownSymbol$u;
	var uid$1 = uid$8;

	var Int8Array$3 = global$e.Int8Array;
	var Int8ArrayPrototype = Int8Array$3 && Int8Array$3.prototype;
	var Uint8ClampedArray = global$e.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
	var TypedArray$1 = Int8Array$3 && getPrototypeOf$3(Int8Array$3);
	var TypedArrayPrototype$1 = Int8ArrayPrototype && getPrototypeOf$3(Int8ArrayPrototype);
	var ObjectPrototype = Object.prototype;
	var isPrototypeOf = ObjectPrototype.isPrototypeOf;

	var TO_STRING_TAG$1 = wellKnownSymbol$4('toStringTag');
	var TYPED_ARRAY_TAG$1 = uid$1('TYPED_ARRAY_TAG');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS$3 = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$2 && classof$3(global$e.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var isView = function isView(it) {
	  var klass = classof$3(it);
	  return klass === 'DataView' || has$5(TypedArrayConstructorsList, klass);
	};

	var isTypedArray$1 = function (it) {
	  return isObject$6(it) && has$5(TypedArrayConstructorsList, classof$3(it));
	};

	var aTypedArray$m = function (it) {
	  if (isTypedArray$1(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor$6 = function (C) {
	  if (setPrototypeOf$2) {
	    if (isPrototypeOf.call(TypedArray$1, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has$5(TypedArrayConstructorsList, NAME)) {
	    var TypedArrayConstructor = global$e[ARRAY];
	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  } throw TypeError('Target is not a typed array constructor');
	};

	var exportTypedArrayMethod$n = function (KEY, property, forced) {
	  if (!DESCRIPTORS$5) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global$e[ARRAY];
	    if (TypedArrayConstructor && has$5(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }
	  if (!TypedArrayPrototype$1[KEY] || forced) {
	    redefine$2(TypedArrayPrototype$1, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportTypedArrayStaticMethod$2 = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!DESCRIPTORS$5) return;
	  if (setPrototypeOf$2) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global$e[ARRAY];
	      if (TypedArrayConstructor && has$5(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }
	    if (!TypedArray$1[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine$2(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$3 && Int8Array$3[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global$e[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine$2(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME in TypedArrayConstructorsList) {
	  if (!global$e[NAME]) NATIVE_ARRAY_BUFFER_VIEWS$3 = false;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || typeof TypedArray$1 != 'function' || TypedArray$1 === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray$1 = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME in TypedArrayConstructorsList) {
	    if (global$e[NAME]) setPrototypeOf$2(global$e[NAME], TypedArray$1);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS$3 || !TypedArrayPrototype$1 || TypedArrayPrototype$1 === ObjectPrototype) {
	  TypedArrayPrototype$1 = TypedArray$1.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS$3) for (NAME in TypedArrayConstructorsList) {
	    if (global$e[NAME]) setPrototypeOf$2(global$e[NAME].prototype, TypedArrayPrototype$1);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS$3 && getPrototypeOf$3(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$1) {
	  setPrototypeOf$2(Uint8ClampedArrayPrototype, TypedArrayPrototype$1);
	}

	if (DESCRIPTORS$5 && !has$5(TypedArrayPrototype$1, TO_STRING_TAG$1)) {
	  TYPED_ARRAY_TAG_REQIRED = true;
	  defineProperty$1(TypedArrayPrototype$1, TO_STRING_TAG$1, { get: function () {
	    return isObject$6(this) ? this[TYPED_ARRAY_TAG$1] : undefined;
	  } });
	  for (NAME in TypedArrayConstructorsList) if (global$e[NAME]) {
	    createNonEnumerableProperty$4(global$e[NAME], TYPED_ARRAY_TAG$1, NAME);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$3,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG$1,
	  aTypedArray: aTypedArray$m,
	  aTypedArrayConstructor: aTypedArrayConstructor$6,
	  exportTypedArrayMethod: exportTypedArrayMethod$n,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$2,
	  isView: isView,
	  isTypedArray: isTypedArray$1,
	  TypedArray: TypedArray$1,
	  TypedArrayPrototype: TypedArrayPrototype$1
	};

	var $$p = _export;
	var ArrayBufferViewCore$o = arrayBufferViewCore;

	var NATIVE_ARRAY_BUFFER_VIEWS$2 = ArrayBufferViewCore$o.NATIVE_ARRAY_BUFFER_VIEWS;

	// `ArrayBuffer.isView` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.isview
	$$p({ target: 'ArrayBuffer', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS$2 }, {
	  isView: ArrayBufferViewCore$o.isView
	});

	var $$o = _export;
	var fails$a = fails$V;
	var ArrayBufferModule$2 = arrayBuffer;
	var anObject$d = anObject$x;
	var toAbsoluteIndex$1 = toAbsoluteIndex$8;
	var toLength$4 = toLength$t;
	var speciesConstructor$4 = speciesConstructor$9;

	var ArrayBuffer$3 = ArrayBufferModule$2.ArrayBuffer;
	var DataView$2 = ArrayBufferModule$2.DataView;
	var nativeArrayBufferSlice = ArrayBuffer$3.prototype.slice;

	var INCORRECT_SLICE = fails$a(function () {
	  return !new ArrayBuffer$3(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
	$$o({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject$d(this), start); // FF fix
	    }
	    var length = anObject$d(this).byteLength;
	    var first = toAbsoluteIndex$1(start, length);
	    var fin = toAbsoluteIndex$1(end === undefined ? length : end, length);
	    var result = new (speciesConstructor$4(this, ArrayBuffer$3))(toLength$4(fin - first));
	    var viewSource = new DataView$2(this);
	    var viewTarget = new DataView$2(result);
	    var index = 0;
	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    } return result;
	  }
	});

	var $$n = _export;
	var ArrayBufferModule$1 = arrayBuffer;
	var NATIVE_ARRAY_BUFFER = arrayBufferNative;

	// `DataView` constructor
	// https://tc39.github.io/ecma262/#sec-dataview-constructor
	$$n({ global: true, forced: !NATIVE_ARRAY_BUFFER }, {
	  DataView: ArrayBufferModule$1.DataView
	});

	var typedArrayConstructor = {exports: {}};

	/* eslint-disable no-new */

	var global$d = global$J;
	var fails$9 = fails$V;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$4;
	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$2 = global$d.ArrayBuffer;
	var Int8Array$2 = global$d.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$9(function () {
	  Int8Array$2(1);
	}) || !fails$9(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails$9(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
	});

	var toInteger = toInteger$c;

	var toPositiveInteger$1 = function (it) {
	  var result = toInteger(it);
	  if (result < 0) throw RangeError("The argument can't be less than 0");
	  return result;
	};

	var toPositiveInteger = toPositiveInteger$1;

	var toOffset$2 = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) throw RangeError('Wrong offset');
	  return offset;
	};

	var toObject$2 = toObject$o;
	var toLength$3 = toLength$t;
	var getIteratorMethod$2 = getIteratorMethod$5;
	var isArrayIteratorMethod = isArrayIteratorMethod$3;
	var bind$5 = functionBindContext;
	var aTypedArrayConstructor$5 = arrayBufferViewCore.aTypedArrayConstructor;

	var typedArrayFrom$2 = function from(source /* , mapfn, thisArg */) {
	  var O = toObject$2(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod$2(O);
	  var i, length, result, step, iterator, next;
	  if (iteratorMethod != undefined && !isArrayIteratorMethod(iteratorMethod)) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    O = [];
	    while (!(step = next.call(iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = bind$5(mapfn, arguments[2], 2);
	  }
	  length = toLength$3(O.length);
	  result = new (aTypedArrayConstructor$5(this))(length);
	  for (i = 0; length > i; i++) {
	    result[i] = mapping ? mapfn(O[i], i) : O[i];
	  }
	  return result;
	};

	var $$m = _export;
	var global$c = global$J;
	var DESCRIPTORS$4 = descriptors;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2 = typedArrayConstructorsRequireWrappers;
	var ArrayBufferViewCore$n = arrayBufferViewCore;
	var ArrayBufferModule = arrayBuffer;
	var anInstance$2 = anInstance$8;
	var createPropertyDescriptor$3 = createPropertyDescriptor$9;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$g;
	var toLength$2 = toLength$t;
	var toIndex = toIndex$2;
	var toOffset$1 = toOffset$2;
	var toPrimitive$1 = toPrimitive$b;
	var has$4 = has$l;
	var classof$2 = classof$e;
	var isObject$5 = isObject$z;
	var create$3 = objectCreate;
	var setPrototypeOf$1 = objectSetPrototypeOf$1;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var typedArrayFrom$1 = typedArrayFrom$2;
	var forEach$1 = arrayIteration.forEach;
	var setSpecies = setSpecies$6;
	var definePropertyModule$2 = objectDefineProperty;
	var getOwnPropertyDescriptorModule$3 = objectGetOwnPropertyDescriptor;
	var InternalStateModule$3 = internalState;
	var inheritIfRequired = inheritIfRequired$4;

	var getInternalState = InternalStateModule$3.get;
	var setInternalState$3 = InternalStateModule$3.set;
	var nativeDefineProperty = definePropertyModule$2.f;
	var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule$3.f;
	var round = Math.round;
	var RangeError$1 = global$c.RangeError;
	var ArrayBuffer$1 = ArrayBufferModule.ArrayBuffer;
	var DataView$1 = ArrayBufferModule.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore$n.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = ArrayBufferViewCore$n.TYPED_ARRAY_TAG;
	var TypedArray = ArrayBufferViewCore$n.TypedArray;
	var TypedArrayPrototype = ArrayBufferViewCore$n.TypedArrayPrototype;
	var aTypedArrayConstructor$4 = ArrayBufferViewCore$n.aTypedArrayConstructor;
	var isTypedArray = ArrayBufferViewCore$n.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$4(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return it instanceof ArrayBuffer$1 || (klass = classof$2(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && typeof key != 'symbol'
	    && key in target
	    && String(+key) == String(key);
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  return isTypedArrayIndex(target, key = toPrimitive$1(key, true))
	    ? createPropertyDescriptor$3(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  if (isTypedArrayIndex(target, key = toPrimitive$1(key, true))
	    && isObject$5(descriptor)
	    && has$4(descriptor, 'value')
	    && !has$4(descriptor, 'get')
	    && !has$4(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!has$4(descriptor, 'writable') || descriptor.writable)
	    && (!has$4(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (DESCRIPTORS$4) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    getOwnPropertyDescriptorModule$3.f = wrappedGetOwnPropertyDescriptor;
	    definePropertyModule$2.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  $$m({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  typedArrayConstructor.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global$c[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance$2(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject$5(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer$1(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset$1(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError$1(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError$1(WRONG_LENGTH);
	          } else {
	            byteLength = toLength$2($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError$1(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return typedArrayFrom$1.call(TypedArrayConstructor, data);
	        }
	        setInternalState$3(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView$1(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (setPrototypeOf$1) setPrototypeOf$1(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$3(TypedArrayPrototype);
	    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$2) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance$2(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        return inheritIfRequired(function () {
	          if (!isObject$5(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return typedArrayFrom$1.call(TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (setPrototypeOf$1) setPrototypeOf$1(TypedArrayConstructor, TypedArray);
	      forEach$1(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty$3(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty$3(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty$3(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    $$m({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty$3(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty$3(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else typedArrayConstructor.exports = function () { /* empty */ };

	var createTypedArrayConstructor$8 = typedArrayConstructor.exports;

	// `Int8Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$8('Int8', function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$7 = typedArrayConstructor.exports;

	// `Uint8Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$7('Uint8', function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$6 = typedArrayConstructor.exports;

	// `Uint8ClampedArray` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$6('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	var createTypedArrayConstructor$5 = typedArrayConstructor.exports;

	// `Int16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$5('Int16', function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$4 = typedArrayConstructor.exports;

	// `Uint16Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$4('Uint16', function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$3 = typedArrayConstructor.exports;

	// `Int32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$3('Int32', function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$2 = typedArrayConstructor.exports;

	// `Uint32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$2('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$1 = typedArrayConstructor.exports;

	// `Float32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$1('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor = typedArrayConstructor.exports;

	// `Float64Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor('Float64', function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1 = typedArrayConstructorsRequireWrappers;
	var exportTypedArrayStaticMethod$1 = arrayBufferViewCore.exportTypedArrayStaticMethod;
	var typedArrayFrom = typedArrayFrom$2;

	// `%TypedArray%.from` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.from
	exportTypedArrayStaticMethod$1('from', typedArrayFrom, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1);

	var ArrayBufferViewCore$m = arrayBufferViewCore;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;

	var aTypedArrayConstructor$3 = ArrayBufferViewCore$m.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod = ArrayBufferViewCore$m.exportTypedArrayStaticMethod;

	// `%TypedArray%.of` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.of
	exportTypedArrayStaticMethod('of', function of(/* ...items */) {
	  var index = 0;
	  var length = arguments.length;
	  var result = new (aTypedArrayConstructor$3(this))(length);
	  while (length > index) result[index] = arguments[index++];
	  return result;
	}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

	var ArrayBufferViewCore$l = arrayBufferViewCore;
	var $copyWithin = arrayCopyWithin;

	var aTypedArray$l = ArrayBufferViewCore$l.aTypedArray;
	var exportTypedArrayMethod$m = ArrayBufferViewCore$l.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$m('copyWithin', function copyWithin(target, start /* , end */) {
	  return $copyWithin.call(aTypedArray$l(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var ArrayBufferViewCore$k = arrayBufferViewCore;
	var $every = arrayIteration.every;

	var aTypedArray$k = ArrayBufferViewCore$k.aTypedArray;
	var exportTypedArrayMethod$l = ArrayBufferViewCore$k.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$l('every', function every(callbackfn /* , thisArg */) {
	  return $every(aTypedArray$k(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$j = arrayBufferViewCore;
	var $fill = arrayFill$1;

	var aTypedArray$j = ArrayBufferViewCore$j.aTypedArray;
	var exportTypedArrayMethod$k = ArrayBufferViewCore$j.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$k('fill', function fill(value /* , start, end */) {
	  return $fill.apply(aTypedArray$j(this), arguments);
	});

	var ArrayBufferViewCore$i = arrayBufferViewCore;
	var $filter = arrayIteration.filter;
	var speciesConstructor$3 = speciesConstructor$9;

	var aTypedArray$i = ArrayBufferViewCore$i.aTypedArray;
	var aTypedArrayConstructor$2 = ArrayBufferViewCore$i.aTypedArrayConstructor;
	var exportTypedArrayMethod$j = ArrayBufferViewCore$i.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$j('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor$3(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	});

	var ArrayBufferViewCore$h = arrayBufferViewCore;
	var $find = arrayIteration.find;

	var aTypedArray$h = ArrayBufferViewCore$h.aTypedArray;
	var exportTypedArrayMethod$i = ArrayBufferViewCore$h.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$i('find', function find(predicate /* , thisArg */) {
	  return $find(aTypedArray$h(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$g = arrayBufferViewCore;
	var $findIndex = arrayIteration.findIndex;

	var aTypedArray$g = ArrayBufferViewCore$g.aTypedArray;
	var exportTypedArrayMethod$h = ArrayBufferViewCore$g.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$h('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex(aTypedArray$g(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$f = arrayBufferViewCore;
	var $forEach = arrayIteration.forEach;

	var aTypedArray$f = ArrayBufferViewCore$f.aTypedArray;
	var exportTypedArrayMethod$g = ArrayBufferViewCore$f.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$g('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach(aTypedArray$f(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$e = arrayBufferViewCore;
	var $includes = arrayIncludes.includes;

	var aTypedArray$e = ArrayBufferViewCore$e.aTypedArray;
	var exportTypedArrayMethod$f = ArrayBufferViewCore$e.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$f('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes(aTypedArray$e(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$d = arrayBufferViewCore;
	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$d = ArrayBufferViewCore$d.aTypedArray;
	var exportTypedArrayMethod$e = ArrayBufferViewCore$d.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$e('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$d(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var global$b = global$J;
	var ArrayBufferViewCore$c = arrayBufferViewCore;
	var ArrayIterators = es_array_iterator;
	var wellKnownSymbol$3 = wellKnownSymbol$u;

	var ITERATOR$3 = wellKnownSymbol$3('iterator');
	var Uint8Array$2 = global$b.Uint8Array;
	var arrayValues = ArrayIterators.values;
	var arrayKeys$1 = ArrayIterators.keys;
	var arrayEntries = ArrayIterators.entries;
	var aTypedArray$c = ArrayBufferViewCore$c.aTypedArray;
	var exportTypedArrayMethod$d = ArrayBufferViewCore$c.exportTypedArrayMethod;
	var nativeTypedArrayIterator = Uint8Array$2 && Uint8Array$2.prototype[ITERATOR$3];

	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
	  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$c(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$d('entries', function entries() {
	  return arrayEntries.call(aTypedArray$c(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$d('keys', function keys() {
	  return arrayKeys$1.call(aTypedArray$c(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$d('values', typedArrayValues, !CORRECT_ITER_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$d(ITERATOR$3, typedArrayValues, !CORRECT_ITER_NAME);

	var ArrayBufferViewCore$b = arrayBufferViewCore;

	var aTypedArray$b = ArrayBufferViewCore$b.aTypedArray;
	var exportTypedArrayMethod$c = ArrayBufferViewCore$b.exportTypedArrayMethod;
	var $join = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$c('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var ArrayBufferViewCore$a = arrayBufferViewCore;
	var $lastIndexOf = arrayLastIndexOf;

	var aTypedArray$a = ArrayBufferViewCore$a.aTypedArray;
	var exportTypedArrayMethod$b = ArrayBufferViewCore$a.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$b('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return $lastIndexOf.apply(aTypedArray$a(this), arguments);
	});

	var ArrayBufferViewCore$9 = arrayBufferViewCore;
	var $map = arrayIteration.map;
	var speciesConstructor$2 = speciesConstructor$9;

	var aTypedArray$9 = ArrayBufferViewCore$9.aTypedArray;
	var aTypedArrayConstructor$1 = ArrayBufferViewCore$9.aTypedArrayConstructor;
	var exportTypedArrayMethod$a = ArrayBufferViewCore$9.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$a('map', function map(mapfn /* , thisArg */) {
	  return $map(aTypedArray$9(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (aTypedArrayConstructor$1(speciesConstructor$2(O, O.constructor)))(length);
	  });
	});

	var ArrayBufferViewCore$8 = arrayBufferViewCore;
	var $reduce = arrayReduce.left;

	var aTypedArray$8 = ArrayBufferViewCore$8.aTypedArray;
	var exportTypedArrayMethod$9 = ArrayBufferViewCore$8.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$9('reduce', function reduce(callbackfn /* , initialValue */) {
	  return $reduce(aTypedArray$8(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$7 = arrayBufferViewCore;
	var $reduceRight = arrayReduce.right;

	var aTypedArray$7 = ArrayBufferViewCore$7.aTypedArray;
	var exportTypedArrayMethod$8 = ArrayBufferViewCore$7.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$8('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return $reduceRight(aTypedArray$7(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$6 = arrayBufferViewCore;

	var aTypedArray$6 = ArrayBufferViewCore$6.aTypedArray;
	var exportTypedArrayMethod$7 = ArrayBufferViewCore$6.exportTypedArrayMethod;
	var floor$2 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$7('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$6(that).length;
	  var middle = floor$2(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var ArrayBufferViewCore$5 = arrayBufferViewCore;
	var toLength$1 = toLength$t;
	var toOffset = toOffset$2;
	var toObject$1 = toObject$o;
	var fails$8 = fails$V;

	var aTypedArray$5 = ArrayBufferViewCore$5.aTypedArray;
	var exportTypedArrayMethod$6 = ArrayBufferViewCore$5.exportTypedArrayMethod;

	var FORCED$4 = fails$8(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$6('set', function set(arrayLike /* , offset */) {
	  aTypedArray$5(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject$1(arrayLike);
	  var len = toLength$1(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$4);

	var ArrayBufferViewCore$4 = arrayBufferViewCore;
	var speciesConstructor$1 = speciesConstructor$9;
	var fails$7 = fails$V;

	var aTypedArray$4 = ArrayBufferViewCore$4.aTypedArray;
	var aTypedArrayConstructor = ArrayBufferViewCore$4.aTypedArrayConstructor;
	var exportTypedArrayMethod$5 = ArrayBufferViewCore$4.exportTypedArrayMethod;
	var $slice$1 = [].slice;

	var FORCED$3 = fails$7(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$5('slice', function slice(start, end) {
	  var list = $slice$1.call(aTypedArray$4(this), start, end);
	  var C = speciesConstructor$1(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$3);

	var ArrayBufferViewCore$3 = arrayBufferViewCore;
	var $some = arrayIteration.some;

	var aTypedArray$3 = ArrayBufferViewCore$3.aTypedArray;
	var exportTypedArrayMethod$4 = ArrayBufferViewCore$3.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$4('some', function some(callbackfn /* , thisArg */) {
	  return $some(aTypedArray$3(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$2 = arrayBufferViewCore;

	var aTypedArray$2 = ArrayBufferViewCore$2.aTypedArray;
	var exportTypedArrayMethod$3 = ArrayBufferViewCore$2.exportTypedArrayMethod;
	var $sort = [].sort;

	// `%TypedArray%.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$3('sort', function sort(comparefn) {
	  return $sort.call(aTypedArray$2(this), comparefn);
	});

	var ArrayBufferViewCore$1 = arrayBufferViewCore;
	var toLength = toLength$t;
	var toAbsoluteIndex = toAbsoluteIndex$8;
	var speciesConstructor = speciesConstructor$9;

	var aTypedArray$1 = ArrayBufferViewCore$1.aTypedArray;
	var exportTypedArrayMethod$2 = ArrayBufferViewCore$1.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$2('subarray', function subarray(begin, end) {
	  var O = aTypedArray$1(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var global$a = global$J;
	var ArrayBufferViewCore = arrayBufferViewCore;
	var fails$6 = fails$V;

	var Int8Array$1 = global$a.Int8Array;
	var aTypedArray = ArrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = ArrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;
	var $slice = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$6(function () {
	  $toLocaleString.call(new Int8Array$1(1));
	});

	var FORCED$2 = fails$6(function () {
	  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
	}) || !fails$6(function () {
	  Int8Array$1.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$1('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice.call(aTypedArray(this)) : aTypedArray(this), arguments);
	}, FORCED$2);

	var exportTypedArrayMethod = arrayBufferViewCore.exportTypedArrayMethod;
	var fails$5 = fails$V;
	var global$9 = global$J;

	var Uint8Array$1 = global$9.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype || {};
	var arrayToString = [].toString;
	var arrayJoin = [].join;

	if (fails$5(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return arrayJoin.call(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	var $$l = _export;
	var getBuiltIn$4 = getBuiltIn$d;
	var aFunction$2 = aFunction$f;
	var anObject$c = anObject$x;
	var fails$4 = fails$V;

	var nativeApply = getBuiltIn$4('Reflect', 'apply');
	var functionApply = Function.apply;

	// MS Edge argumentsList argument is optional
	var OPTIONAL_ARGUMENTS_LIST = !fails$4(function () {
	  nativeApply(function () { /* empty */ });
	});

	// `Reflect.apply` method
	// https://tc39.github.io/ecma262/#sec-reflect.apply
	$$l({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
	  apply: function apply(target, thisArgument, argumentsList) {
	    aFunction$2(target);
	    anObject$c(argumentsList);
	    return nativeApply
	      ? nativeApply(target, thisArgument, argumentsList)
	      : functionApply.call(target, thisArgument, argumentsList);
	  }
	});

	var $$k = _export;
	var getBuiltIn$3 = getBuiltIn$d;
	var aFunction$1 = aFunction$f;
	var anObject$b = anObject$x;
	var isObject$4 = isObject$z;
	var create$2 = objectCreate;
	var bind$4 = functionBind;
	var fails$3 = fails$V;

	var nativeConstruct = getBuiltIn$3('Reflect', 'construct');

	// `Reflect.construct` method
	// https://tc39.github.io/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails$3(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails$3(function () {
	  nativeConstruct(function () { /* empty */ });
	});
	var FORCED$1 = NEW_TARGET_BUG || ARGS_BUG;

	$$k({ target: 'Reflect', stat: true, forced: FORCED$1, sham: FORCED$1 }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aFunction$1(Target);
	    anObject$b(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (bind$4.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = create$2(isObject$4(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject$4(result) ? result : instance;
	  }
	});

	var $$j = _export;
	var DESCRIPTORS$3 = descriptors;
	var anObject$a = anObject$x;
	var toPrimitive = toPrimitive$b;
	var definePropertyModule$1 = objectDefineProperty;
	var fails$2 = fails$V;

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	var ERROR_INSTEAD_OF_FALSE = fails$2(function () {
	  // eslint-disable-next-line no-undef
	  Reflect.defineProperty(definePropertyModule$1.f({}, 1, { value: 1 }), 1, { value: 2 });
	});

	// `Reflect.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-reflect.defineproperty
	$$j({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS$3 }, {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject$a(target);
	    var key = toPrimitive(propertyKey, true);
	    anObject$a(attributes);
	    try {
	      definePropertyModule$1.f(target, key, attributes);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var $$i = _export;
	var anObject$9 = anObject$x;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	// `Reflect.deleteProperty` method
	// https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
	$$i({ target: 'Reflect', stat: true }, {
	  deleteProperty: function deleteProperty(target, propertyKey) {
	    var descriptor = getOwnPropertyDescriptor(anObject$9(target), propertyKey);
	    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
	  }
	});

	var $$h = _export;
	var isObject$3 = isObject$z;
	var anObject$8 = anObject$x;
	var has$3 = has$l;
	var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
	var getPrototypeOf$2 = objectGetPrototypeOf$1;

	// `Reflect.get` method
	// https://tc39.github.io/ecma262/#sec-reflect.get
	function get(target, propertyKey /* , receiver */) {
	  var receiver = arguments.length < 3 ? target : arguments[2];
	  var descriptor, prototype;
	  if (anObject$8(target) === receiver) return target[propertyKey];
	  if (descriptor = getOwnPropertyDescriptorModule$2.f(target, propertyKey)) return has$3(descriptor, 'value')
	    ? descriptor.value
	    : descriptor.get === undefined
	      ? undefined
	      : descriptor.get.call(receiver);
	  if (isObject$3(prototype = getPrototypeOf$2(target))) return get(prototype, propertyKey, receiver);
	}

	$$h({ target: 'Reflect', stat: true }, {
	  get: get
	});

	var $$g = _export;
	var DESCRIPTORS$2 = descriptors;
	var anObject$7 = anObject$x;
	var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;

	// `Reflect.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-reflect.getownpropertydescriptor
	$$g({ target: 'Reflect', stat: true, sham: !DESCRIPTORS$2 }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
	    return getOwnPropertyDescriptorModule$1.f(anObject$7(target), propertyKey);
	  }
	});

	var $$f = _export;
	var anObject$6 = anObject$x;
	var objectGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	// `Reflect.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
	$$f({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return objectGetPrototypeOf(anObject$6(target));
	  }
	});

	var $$e = _export;

	// `Reflect.has` method
	// https://tc39.github.io/ecma262/#sec-reflect.has
	$$e({ target: 'Reflect', stat: true }, {
	  has: function has(target, propertyKey) {
	    return propertyKey in target;
	  }
	});

	var $$d = _export;
	var anObject$5 = anObject$x;

	var objectIsExtensible = Object.isExtensible;

	// `Reflect.isExtensible` method
	// https://tc39.github.io/ecma262/#sec-reflect.isextensible
	$$d({ target: 'Reflect', stat: true }, {
	  isExtensible: function isExtensible(target) {
	    anObject$5(target);
	    return objectIsExtensible ? objectIsExtensible(target) : true;
	  }
	});

	var $$c = _export;
	var ownKeys = ownKeys$3;

	// `Reflect.ownKeys` method
	// https://tc39.github.io/ecma262/#sec-reflect.ownkeys
	$$c({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	var $$b = _export;
	var getBuiltIn$2 = getBuiltIn$d;
	var anObject$4 = anObject$x;
	var FREEZING = freezing;

	// `Reflect.preventExtensions` method
	// https://tc39.github.io/ecma262/#sec-reflect.preventextensions
	$$b({ target: 'Reflect', stat: true, sham: !FREEZING }, {
	  preventExtensions: function preventExtensions(target) {
	    anObject$4(target);
	    try {
	      var objectPreventExtensions = getBuiltIn$2('Object', 'preventExtensions');
	      if (objectPreventExtensions) objectPreventExtensions(target);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	var $$a = _export;
	var anObject$3 = anObject$x;
	var isObject$2 = isObject$z;
	var has$2 = has$l;
	var fails$1 = fails$V;
	var definePropertyModule = objectDefineProperty;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var getPrototypeOf$1 = objectGetPrototypeOf$1;
	var createPropertyDescriptor$2 = createPropertyDescriptor$9;

	// `Reflect.set` method
	// https://tc39.github.io/ecma262/#sec-reflect.set
	function set$1(target, propertyKey, V /* , receiver */) {
	  var receiver = arguments.length < 4 ? target : arguments[3];
	  var ownDescriptor = getOwnPropertyDescriptorModule.f(anObject$3(target), propertyKey);
	  var existingDescriptor, prototype;
	  if (!ownDescriptor) {
	    if (isObject$2(prototype = getPrototypeOf$1(target))) {
	      return set$1(prototype, propertyKey, V, receiver);
	    }
	    ownDescriptor = createPropertyDescriptor$2(0);
	  }
	  if (has$2(ownDescriptor, 'value')) {
	    if (ownDescriptor.writable === false || !isObject$2(receiver)) return false;
	    if (existingDescriptor = getOwnPropertyDescriptorModule.f(receiver, propertyKey)) {
	      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
	      existingDescriptor.value = V;
	      definePropertyModule.f(receiver, propertyKey, existingDescriptor);
	    } else definePropertyModule.f(receiver, propertyKey, createPropertyDescriptor$2(0, V));
	    return true;
	  }
	  return ownDescriptor.set === undefined ? false : (ownDescriptor.set.call(receiver, V), true);
	}

	// MS Edge 17-18 Reflect.set allows setting the property to object
	// with non-writable property on the prototype
	var MS_EDGE_BUG = fails$1(function () {
	  var object = definePropertyModule.f({}, 'a', { configurable: true });
	  // eslint-disable-next-line no-undef
	  return Reflect.set(getPrototypeOf$1(object), 'a', 1, object) !== false;
	});

	$$a({ target: 'Reflect', stat: true, forced: MS_EDGE_BUG }, {
	  set: set$1
	});

	var $$9 = _export;
	var anObject$2 = anObject$x;
	var aPossiblePrototype = aPossiblePrototype$2;
	var objectSetPrototypeOf = objectSetPrototypeOf$1;

	// `Reflect.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-reflect.setprototypeof
	if (objectSetPrototypeOf) $$9({ target: 'Reflect', stat: true }, {
	  setPrototypeOf: function setPrototypeOf(target, proto) {
	    anObject$2(target);
	    aPossiblePrototype(proto);
	    try {
	      objectSetPrototypeOf(target, proto);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var global$8 = global$J;
	var DOMIterables$1 = domIterables;
	var forEach = arrayForEach;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$g;

	for (var COLLECTION_NAME$1 in DOMIterables$1) {
	  var Collection$1 = global$8[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype$1 && CollectionPrototype$1.forEach !== forEach) try {
	    createNonEnumerableProperty$2(CollectionPrototype$1, 'forEach', forEach);
	  } catch (error) {
	    CollectionPrototype$1.forEach = forEach;
	  }
	}

	var global$7 = global$J;
	var DOMIterables = domIterables;
	var ArrayIteratorMethods = es_array_iterator;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$g;
	var wellKnownSymbol$2 = wellKnownSymbol$u;

	var ITERATOR$2 = wellKnownSymbol$2('iterator');
	var TO_STRING_TAG = wellKnownSymbol$2('toStringTag');
	var ArrayValues = ArrayIteratorMethods.values;

	for (var COLLECTION_NAME in DOMIterables) {
	  var Collection = global$7[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
	      createNonEnumerableProperty$1(CollectionPrototype, ITERATOR$2, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$2] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG]) {
	      createNonEnumerableProperty$1(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	    }
	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty$1(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	}

	var $$8 = _export;
	var global$6 = global$J;
	var task = task$2;

	var FORCED = !global$6.setImmediate || !global$6.clearImmediate;

	// http://w3c.github.io/setImmediate/
	$$8({ global: true, bind: true, enumerable: true, forced: FORCED }, {
	  // `setImmediate` method
	  // http://w3c.github.io/setImmediate/#si-setImmediate
	  setImmediate: task.set,
	  // `clearImmediate` method
	  // http://w3c.github.io/setImmediate/#si-clearImmediate
	  clearImmediate: task.clear
	});

	var $$7 = _export;
	var global$5 = global$J;
	var microtask = microtask$2;
	var classof$1 = classofRaw$1;

	var process$1 = global$5.process;
	var isNode = classof$1(process$1) == 'process';

	// `queueMicrotask` method
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-queuemicrotask
	$$7({ global: true, enumerable: true, noTargetGet: true }, {
	  queueMicrotask: function queueMicrotask(fn) {
	    var domain = isNode && process$1.domain;
	    microtask(domain ? domain.bind(fn) : fn);
	  }
	});

	var $$6 = _export;
	var global$4 = global$J;
	var userAgent = engineUserAgent;

	var slice = [].slice;
	var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	$$6({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global$4.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global$4.setInterval)
	});

	var fails = fails$V;
	var wellKnownSymbol$1 = wellKnownSymbol$u;
	var IS_PURE = isPure;

	var ITERATOR$1 = wellKnownSymbol$1('iterator');

	var nativeUrl = !fails(function () {
	  var url = new URL('b?a=1&b=2&c=3', 'http://a');
	  var searchParams = url.searchParams;
	  var result = '';
	  url.pathname = 'c%20d';
	  searchParams.forEach(function (value, key) {
	    searchParams['delete']('b');
	    result += key + value;
	  });
	  return (IS_PURE && !url.toJSON)
	    || !searchParams.sort
	    || url.href !== 'http://a/c%20d?a=1&c=3'
	    || searchParams.get('c') !== '3'
	    || String(new URLSearchParams('?a=1')) !== 'a=1'
	    || !searchParams[ITERATOR$1]
	    // throws in Edge
	    || new URL('https://a@b').username !== 'a'
	    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
	    // not punycoded in Edge
	    || new URL('http://тест').host !== 'xn--e1aybc'
	    // not escaped in Chrome 62-
	    || new URL('http://a#б').hash !== '#%D0%B1'
	    // fails in Chrome 66-
	    || result !== 'a1c3'
	    // throws in Safari
	    || new URL('http://x', undefined).host !== 'x';
	});

	// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = '-'; // '\x2D'
	var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
	var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
	var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
	var baseMinusTMin = base - tMin;
	var floor$1 = Math.floor;
	var stringFromCharCode = String.fromCharCode;

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 */
	var ucs2decode = function (string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = string.charCodeAt(counter++);
	    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = string.charCodeAt(counter++);
	      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
	        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        output.push(value);
	        counter--;
	      }
	    } else {
	      output.push(value);
	    }
	  }
	  return output;
	};

	/**
	 * Converts a digit/integer into a basic code point.
	 */
	var digitToBasic = function (digit) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
	  delta += floor$1(delta / numPoints);
	  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
	    delta = floor$1(delta / baseMinusTMin);
	  }
	  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 */
	// eslint-disable-next-line  max-statements
	var encode$1 = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;
	  var i, currentValue;

	  // Handle the basic code points.
	  for (i = 0; i < input.length; i++) {
	    currentValue = input[i];
	    if (currentValue < 0x80) {
	      output.push(stringFromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length; // number of basic code points.
	  var handledCPCount = basicLength; // number of code points that have been handled;

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    output.push(delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next larger one:
	    var m = maxInt;
	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
	      throw RangeError(OVERFLOW_ERROR);
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (i = 0; i < input.length; i++) {
	      currentValue = input[i];
	      if (currentValue < n && ++delta > maxInt) {
	        throw RangeError(OVERFLOW_ERROR);
	      }
	      if (currentValue == n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        for (var k = base; /* no condition */; k += base) {
	          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
	          if (q < t) break;
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
	          q = floor$1(qMinusT / baseMinusT);
	        }

	        output.push(stringFromCharCode(digitToBasic(q)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
	        delta = 0;
	        ++handledCPCount;
	      }
	    }

	    ++delta;
	    ++n;
	  }
	  return output.join('');
	};

	var stringPunycodeToAscii = function (input) {
	  var encoded = [];
	  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
	  var i, label;
	  for (i = 0; i < labels.length; i++) {
	    label = labels[i];
	    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode$1(label) : label);
	  }
	  return encoded.join('.');
	};

	var anObject$1 = anObject$x;
	var getIteratorMethod$1 = getIteratorMethod$5;

	var getIterator$1 = function (it) {
	  var iteratorMethod = getIteratorMethod$1(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject$1(iteratorMethod.call(it));
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$5 = _export;
	var getBuiltIn$1 = getBuiltIn$d;
	var USE_NATIVE_URL$1 = nativeUrl;
	var redefine$1 = redefine$g.exports;
	var redefineAll = redefineAll$6;
	var setToStringTag$1 = setToStringTag$a;
	var createIteratorConstructor = createIteratorConstructor$3;
	var InternalStateModule$2 = internalState;
	var anInstance$1 = anInstance$8;
	var hasOwn$1 = has$l;
	var bind$3 = functionBindContext;
	var classof = classof$e;
	var anObject = anObject$x;
	var isObject$1 = isObject$z;
	var create$1 = objectCreate;
	var createPropertyDescriptor$1 = createPropertyDescriptor$9;
	var getIterator = getIterator$1;
	var getIteratorMethod = getIteratorMethod$5;
	var wellKnownSymbol = wellKnownSymbol$u;

	var $fetch = getBuiltIn$1('fetch');
	var Headers$1 = getBuiltIn$1('Headers');
	var ITERATOR = wellKnownSymbol('iterator');
	var URL_SEARCH_PARAMS = 'URLSearchParams';
	var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
	var setInternalState$2 = InternalStateModule$2.set;
	var getInternalParamsState = InternalStateModule$2.getterFor(URL_SEARCH_PARAMS);
	var getInternalIteratorState = InternalStateModule$2.getterFor(URL_SEARCH_PARAMS_ITERATOR);

	var plus = /\+/g;
	var sequences = Array(4);

	var percentSequence = function (bytes) {
	  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
	};

	var percentDecode = function (sequence) {
	  try {
	    return decodeURIComponent(sequence);
	  } catch (error) {
	    return sequence;
	  }
	};

	var deserialize = function (it) {
	  var result = it.replace(plus, ' ');
	  var bytes = 4;
	  try {
	    return decodeURIComponent(result);
	  } catch (error) {
	    while (bytes) {
	      result = result.replace(percentSequence(bytes--), percentDecode);
	    }
	    return result;
	  }
	};

	var find = /[!'()~]|%20/g;

	var replace = {
	  '!': '%21',
	  "'": '%27',
	  '(': '%28',
	  ')': '%29',
	  '~': '%7E',
	  '%20': '+'
	};

	var replacer = function (match) {
	  return replace[match];
	};

	var serialize$1 = function (it) {
	  return encodeURIComponent(it).replace(find, replacer);
	};

	var parseSearchParams = function (result, query) {
	  if (query) {
	    var attributes = query.split('&');
	    var index = 0;
	    var attribute, entry;
	    while (index < attributes.length) {
	      attribute = attributes[index++];
	      if (attribute.length) {
	        entry = attribute.split('=');
	        result.push({
	          key: deserialize(entry.shift()),
	          value: deserialize(entry.join('='))
	        });
	      }
	    }
	  }
	};

	var updateSearchParams = function (query) {
	  this.entries.length = 0;
	  parseSearchParams(this.entries, query);
	};

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError('Not enough arguments');
	};

	var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
	  setInternalState$2(this, {
	    type: URL_SEARCH_PARAMS_ITERATOR,
	    iterator: getIterator(getInternalParamsState(params).entries),
	    kind: kind
	  });
	}, 'Iterator', function next() {
	  var state = getInternalIteratorState(this);
	  var kind = state.kind;
	  var step = state.iterator.next();
	  var entry = step.value;
	  if (!step.done) {
	    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
	  } return step;
	});

	// `URLSearchParams` constructor
	// https://url.spec.whatwg.org/#interface-urlsearchparams
	var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
	  anInstance$1(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
	  var init = arguments.length > 0 ? arguments[0] : undefined;
	  var that = this;
	  var entries = [];
	  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

	  setInternalState$2(that, {
	    type: URL_SEARCH_PARAMS,
	    entries: entries,
	    updateURL: function () { /* empty */ },
	    updateSearchParams: updateSearchParams
	  });

	  if (init !== undefined) {
	    if (isObject$1(init)) {
	      iteratorMethod = getIteratorMethod(init);
	      if (typeof iteratorMethod === 'function') {
	        iterator = iteratorMethod.call(init);
	        next = iterator.next;
	        while (!(step = next.call(iterator)).done) {
	          entryIterator = getIterator(anObject(step.value));
	          entryNext = entryIterator.next;
	          if (
	            (first = entryNext.call(entryIterator)).done ||
	            (second = entryNext.call(entryIterator)).done ||
	            !entryNext.call(entryIterator).done
	          ) throw TypeError('Expected sequence with length 2');
	          entries.push({ key: first.value + '', value: second.value + '' });
	        }
	      } else for (key in init) if (hasOwn$1(init, key)) entries.push({ key: key, value: init[key] + '' });
	    } else {
	      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
	    }
	  }
	};

	var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

	redefineAll(URLSearchParamsPrototype, {
	  // `URLSearchParams.prototype.appent` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
	  append: function append(name, value) {
	    validateArgumentsLength(arguments.length, 2);
	    var state = getInternalParamsState(this);
	    state.entries.push({ key: name + '', value: value + '' });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.delete` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
	  'delete': function (name) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index].key === key) entries.splice(index, 1);
	      else index++;
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.get` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
	  get: function get(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) return entries[index].value;
	    }
	    return null;
	  },
	  // `URLSearchParams.prototype.getAll` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
	  getAll: function getAll(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var result = [];
	    var index = 0;
	    for (; index < entries.length; index++) {
	      if (entries[index].key === key) result.push(entries[index].value);
	    }
	    return result;
	  },
	  // `URLSearchParams.prototype.has` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
	  has: function has(name) {
	    validateArgumentsLength(arguments.length, 1);
	    var entries = getInternalParamsState(this).entries;
	    var key = name + '';
	    var index = 0;
	    while (index < entries.length) {
	      if (entries[index++].key === key) return true;
	    }
	    return false;
	  },
	  // `URLSearchParams.prototype.set` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
	  set: function set(name, value) {
	    validateArgumentsLength(arguments.length, 1);
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    var found = false;
	    var key = name + '';
	    var val = value + '';
	    var index = 0;
	    var entry;
	    for (; index < entries.length; index++) {
	      entry = entries[index];
	      if (entry.key === key) {
	        if (found) entries.splice(index--, 1);
	        else {
	          found = true;
	          entry.value = val;
	        }
	      }
	    }
	    if (!found) entries.push({ key: key, value: val });
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.sort` method
	  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
	  sort: function sort() {
	    var state = getInternalParamsState(this);
	    var entries = state.entries;
	    // Array#sort is not stable in some engines
	    var slice = entries.slice();
	    var entry, entriesIndex, sliceIndex;
	    entries.length = 0;
	    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
	      entry = slice[sliceIndex];
	      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
	        if (entries[entriesIndex].key > entry.key) {
	          entries.splice(entriesIndex, 0, entry);
	          break;
	        }
	      }
	      if (entriesIndex === sliceIndex) entries.push(entry);
	    }
	    state.updateURL();
	  },
	  // `URLSearchParams.prototype.forEach` method
	  forEach: function forEach(callback /* , thisArg */) {
	    var entries = getInternalParamsState(this).entries;
	    var boundFunction = bind$3(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
	    var index = 0;
	    var entry;
	    while (index < entries.length) {
	      entry = entries[index++];
	      boundFunction(entry.value, entry.key, this);
	    }
	  },
	  // `URLSearchParams.prototype.keys` method
	  keys: function keys() {
	    return new URLSearchParamsIterator(this, 'keys');
	  },
	  // `URLSearchParams.prototype.values` method
	  values: function values() {
	    return new URLSearchParamsIterator(this, 'values');
	  },
	  // `URLSearchParams.prototype.entries` method
	  entries: function entries() {
	    return new URLSearchParamsIterator(this, 'entries');
	  }
	}, { enumerable: true });

	// `URLSearchParams.prototype[@@iterator]` method
	redefine$1(URLSearchParamsPrototype, ITERATOR, URLSearchParamsPrototype.entries);

	// `URLSearchParams.prototype.toString` method
	// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
	redefine$1(URLSearchParamsPrototype, 'toString', function toString() {
	  var entries = getInternalParamsState(this).entries;
	  var result = [];
	  var index = 0;
	  var entry;
	  while (index < entries.length) {
	    entry = entries[index++];
	    result.push(serialize$1(entry.key) + '=' + serialize$1(entry.value));
	  } return result.join('&');
	}, { enumerable: true });

	setToStringTag$1(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

	$$5({ global: true, forced: !USE_NATIVE_URL$1 }, {
	  URLSearchParams: URLSearchParamsConstructor
	});

	// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
	// https://github.com/zloirock/core-js/issues/674
	if (!USE_NATIVE_URL$1 && typeof $fetch == 'function' && typeof Headers$1 == 'function') {
	  $$5({ global: true, enumerable: true, forced: true }, {
	    fetch: function fetch(input /* , init */) {
	      var args = [input];
	      var init, body, headers;
	      if (arguments.length > 1) {
	        init = arguments[1];
	        if (isObject$1(init)) {
	          body = init.body;
	          if (classof(body) === URL_SEARCH_PARAMS) {
	            headers = init.headers ? new Headers$1(init.headers) : new Headers$1();
	            if (!headers.has('content-type')) {
	              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	            }
	            init = create$1(init, {
	              body: createPropertyDescriptor$1(0, String(body)),
	              headers: createPropertyDescriptor$1(0, headers)
	            });
	          }
	        }
	        args.push(init);
	      } return $fetch.apply(this, args);
	    }
	  });
	}

	var web_urlSearchParams = {
	  URLSearchParams: URLSearchParamsConstructor,
	  getState: getInternalParamsState
	};

	// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`

	var $$4 = _export;
	var DESCRIPTORS$1 = descriptors;
	var USE_NATIVE_URL = nativeUrl;
	var global$3 = global$J;
	var defineProperties = objectDefineProperties;
	var redefine = redefine$g.exports;
	var anInstance = anInstance$8;
	var has$1 = has$l;
	var assign = objectAssign;
	var arrayFrom = arrayFrom$1;
	var codeAt = stringMultibyte.codeAt;
	var toASCII = stringPunycodeToAscii;
	var setToStringTag = setToStringTag$a;
	var URLSearchParamsModule = web_urlSearchParams;
	var InternalStateModule$1 = internalState;

	var NativeURL = global$3.URL;
	var URLSearchParams$1 = URLSearchParamsModule.URLSearchParams;
	var getInternalSearchParamsState = URLSearchParamsModule.getState;
	var setInternalState$1 = InternalStateModule$1.set;
	var getInternalURLState = InternalStateModule$1.getterFor('URL');
	var floor = Math.floor;
	var pow = Math.pow;

	var INVALID_AUTHORITY = 'Invalid authority';
	var INVALID_SCHEME = 'Invalid scheme';
	var INVALID_HOST = 'Invalid host';
	var INVALID_PORT = 'Invalid port';

	var ALPHA = /[A-Za-z]/;
	var ALPHANUMERIC = /[\d+-.A-Za-z]/;
	var DIGIT = /\d/;
	var HEX_START = /^(0x|0X)/;
	var OCT = /^[0-7]+$/;
	var DEC = /^\d+$/;
	var HEX = /^[\dA-Fa-f]+$/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
	// eslint-disable-next-line no-control-regex
	var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
	// eslint-disable-next-line no-control-regex
	var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
	var EOF;

	var parseHost = function (url, input) {
	  var result, codePoints, index;
	  if (input.charAt(0) == '[') {
	    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
	    result = parseIPv6(input.slice(1, -1));
	    if (!result) return INVALID_HOST;
	    url.host = result;
	  // opaque host
	  } else if (!isSpecial(url)) {
	    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
	    result = '';
	    codePoints = arrayFrom(input);
	    for (index = 0; index < codePoints.length; index++) {
	      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
	    }
	    url.host = result;
	  } else {
	    input = toASCII(input);
	    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
	    result = parseIPv4(input);
	    if (result === null) return INVALID_HOST;
	    url.host = result;
	  }
	};

	var parseIPv4 = function (input) {
	  var parts = input.split('.');
	  var partsLength, numbers, index, part, radix, number, ipv4;
	  if (parts.length && parts[parts.length - 1] == '') {
	    parts.pop();
	  }
	  partsLength = parts.length;
	  if (partsLength > 4) return input;
	  numbers = [];
	  for (index = 0; index < partsLength; index++) {
	    part = parts[index];
	    if (part == '') return input;
	    radix = 10;
	    if (part.length > 1 && part.charAt(0) == '0') {
	      radix = HEX_START.test(part) ? 16 : 8;
	      part = part.slice(radix == 8 ? 1 : 2);
	    }
	    if (part === '') {
	      number = 0;
	    } else {
	      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
	      number = parseInt(part, radix);
	    }
	    numbers.push(number);
	  }
	  for (index = 0; index < partsLength; index++) {
	    number = numbers[index];
	    if (index == partsLength - 1) {
	      if (number >= pow(256, 5 - partsLength)) return null;
	    } else if (number > 255) return null;
	  }
	  ipv4 = numbers.pop();
	  for (index = 0; index < numbers.length; index++) {
	    ipv4 += numbers[index] * pow(256, 3 - index);
	  }
	  return ipv4;
	};

	// eslint-disable-next-line max-statements
	var parseIPv6 = function (input) {
	  var address = [0, 0, 0, 0, 0, 0, 0, 0];
	  var pieceIndex = 0;
	  var compress = null;
	  var pointer = 0;
	  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

	  var char = function () {
	    return input.charAt(pointer);
	  };

	  if (char() == ':') {
	    if (input.charAt(1) != ':') return;
	    pointer += 2;
	    pieceIndex++;
	    compress = pieceIndex;
	  }
	  while (char()) {
	    if (pieceIndex == 8) return;
	    if (char() == ':') {
	      if (compress !== null) return;
	      pointer++;
	      pieceIndex++;
	      compress = pieceIndex;
	      continue;
	    }
	    value = length = 0;
	    while (length < 4 && HEX.test(char())) {
	      value = value * 16 + parseInt(char(), 16);
	      pointer++;
	      length++;
	    }
	    if (char() == '.') {
	      if (length == 0) return;
	      pointer -= length;
	      if (pieceIndex > 6) return;
	      numbersSeen = 0;
	      while (char()) {
	        ipv4Piece = null;
	        if (numbersSeen > 0) {
	          if (char() == '.' && numbersSeen < 4) pointer++;
	          else return;
	        }
	        if (!DIGIT.test(char())) return;
	        while (DIGIT.test(char())) {
	          number = parseInt(char(), 10);
	          if (ipv4Piece === null) ipv4Piece = number;
	          else if (ipv4Piece == 0) return;
	          else ipv4Piece = ipv4Piece * 10 + number;
	          if (ipv4Piece > 255) return;
	          pointer++;
	        }
	        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
	        numbersSeen++;
	        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
	      }
	      if (numbersSeen != 4) return;
	      break;
	    } else if (char() == ':') {
	      pointer++;
	      if (!char()) return;
	    } else if (char()) return;
	    address[pieceIndex++] = value;
	  }
	  if (compress !== null) {
	    swaps = pieceIndex - compress;
	    pieceIndex = 7;
	    while (pieceIndex != 0 && swaps > 0) {
	      swap = address[pieceIndex];
	      address[pieceIndex--] = address[compress + swaps - 1];
	      address[compress + --swaps] = swap;
	    }
	  } else if (pieceIndex != 8) return;
	  return address;
	};

	var findLongestZeroSequence = function (ipv6) {
	  var maxIndex = null;
	  var maxLength = 1;
	  var currStart = null;
	  var currLength = 0;
	  var index = 0;
	  for (; index < 8; index++) {
	    if (ipv6[index] !== 0) {
	      if (currLength > maxLength) {
	        maxIndex = currStart;
	        maxLength = currLength;
	      }
	      currStart = null;
	      currLength = 0;
	    } else {
	      if (currStart === null) currStart = index;
	      ++currLength;
	    }
	  }
	  if (currLength > maxLength) {
	    maxIndex = currStart;
	    maxLength = currLength;
	  }
	  return maxIndex;
	};

	var serializeHost = function (host) {
	  var result, index, compress, ignore0;
	  // ipv4
	  if (typeof host == 'number') {
	    result = [];
	    for (index = 0; index < 4; index++) {
	      result.unshift(host % 256);
	      host = floor(host / 256);
	    } return result.join('.');
	  // ipv6
	  } else if (typeof host == 'object') {
	    result = '';
	    compress = findLongestZeroSequence(host);
	    for (index = 0; index < 8; index++) {
	      if (ignore0 && host[index] === 0) continue;
	      if (ignore0) ignore0 = false;
	      if (compress === index) {
	        result += index ? ':' : '::';
	        ignore0 = true;
	      } else {
	        result += host[index].toString(16);
	        if (index < 7) result += ':';
	      }
	    }
	    return '[' + result + ']';
	  } return host;
	};

	var C0ControlPercentEncodeSet = {};
	var fragmentPercentEncodeSet = assign({}, C0ControlPercentEncodeSet, {
	  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
	});
	var pathPercentEncodeSet = assign({}, fragmentPercentEncodeSet, {
	  '#': 1, '?': 1, '{': 1, '}': 1
	});
	var userinfoPercentEncodeSet = assign({}, pathPercentEncodeSet, {
	  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
	});

	var percentEncode = function (char, set) {
	  var code = codeAt(char, 0);
	  return code > 0x20 && code < 0x7F && !has$1(set, char) ? char : encodeURIComponent(char);
	};

	var specialSchemes = {
	  ftp: 21,
	  file: null,
	  http: 80,
	  https: 443,
	  ws: 80,
	  wss: 443
	};

	var isSpecial = function (url) {
	  return has$1(specialSchemes, url.scheme);
	};

	var includesCredentials = function (url) {
	  return url.username != '' || url.password != '';
	};

	var cannotHaveUsernamePasswordPort = function (url) {
	  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
	};

	var isWindowsDriveLetter = function (string, normalized) {
	  var second;
	  return string.length == 2 && ALPHA.test(string.charAt(0))
	    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
	};

	var startsWithWindowsDriveLetter = function (string) {
	  var third;
	  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
	    string.length == 2 ||
	    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
	  );
	};

	var shortenURLsPath = function (url) {
	  var path = url.path;
	  var pathSize = path.length;
	  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
	    path.pop();
	  }
	};

	var isSingleDot = function (segment) {
	  return segment === '.' || segment.toLowerCase() === '%2e';
	};

	var isDoubleDot = function (segment) {
	  segment = segment.toLowerCase();
	  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
	};

	// States:
	var SCHEME_START = {};
	var SCHEME = {};
	var NO_SCHEME = {};
	var SPECIAL_RELATIVE_OR_AUTHORITY = {};
	var PATH_OR_AUTHORITY = {};
	var RELATIVE = {};
	var RELATIVE_SLASH = {};
	var SPECIAL_AUTHORITY_SLASHES = {};
	var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
	var AUTHORITY = {};
	var HOST = {};
	var HOSTNAME = {};
	var PORT = {};
	var FILE = {};
	var FILE_SLASH = {};
	var FILE_HOST = {};
	var PATH_START = {};
	var PATH = {};
	var CANNOT_BE_A_BASE_URL_PATH = {};
	var QUERY = {};
	var FRAGMENT = {};

	// eslint-disable-next-line max-statements
	var parseURL = function (url, input, stateOverride, base) {
	  var state = stateOverride || SCHEME_START;
	  var pointer = 0;
	  var buffer = '';
	  var seenAt = false;
	  var seenBracket = false;
	  var seenPasswordToken = false;
	  var codePoints, char, bufferCodePoints, failure;

	  if (!stateOverride) {
	    url.scheme = '';
	    url.username = '';
	    url.password = '';
	    url.host = null;
	    url.port = null;
	    url.path = [];
	    url.query = null;
	    url.fragment = null;
	    url.cannotBeABaseURL = false;
	    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
	  }

	  input = input.replace(TAB_AND_NEW_LINE, '');

	  codePoints = arrayFrom(input);

	  while (pointer <= codePoints.length) {
	    char = codePoints[pointer];
	    switch (state) {
	      case SCHEME_START:
	        if (char && ALPHA.test(char)) {
	          buffer += char.toLowerCase();
	          state = SCHEME;
	        } else if (!stateOverride) {
	          state = NO_SCHEME;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case SCHEME:
	        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
	          buffer += char.toLowerCase();
	        } else if (char == ':') {
	          if (stateOverride && (
	            (isSpecial(url) != has$1(specialSchemes, buffer)) ||
	            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
	            (url.scheme == 'file' && !url.host)
	          )) return;
	          url.scheme = buffer;
	          if (stateOverride) {
	            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
	            return;
	          }
	          buffer = '';
	          if (url.scheme == 'file') {
	            state = FILE;
	          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
	            state = SPECIAL_RELATIVE_OR_AUTHORITY;
	          } else if (isSpecial(url)) {
	            state = SPECIAL_AUTHORITY_SLASHES;
	          } else if (codePoints[pointer + 1] == '/') {
	            state = PATH_OR_AUTHORITY;
	            pointer++;
	          } else {
	            url.cannotBeABaseURL = true;
	            url.path.push('');
	            state = CANNOT_BE_A_BASE_URL_PATH;
	          }
	        } else if (!stateOverride) {
	          buffer = '';
	          state = NO_SCHEME;
	          pointer = 0;
	          continue;
	        } else return INVALID_SCHEME;
	        break;

	      case NO_SCHEME:
	        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
	        if (base.cannotBeABaseURL && char == '#') {
	          url.scheme = base.scheme;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          url.cannotBeABaseURL = true;
	          state = FRAGMENT;
	          break;
	        }
	        state = base.scheme == 'file' ? FILE : RELATIVE;
	        continue;

	      case SPECIAL_RELATIVE_OR_AUTHORITY:
	        if (char == '/' && codePoints[pointer + 1] == '/') {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	          pointer++;
	        } else {
	          state = RELATIVE;
	          continue;
	        } break;

	      case PATH_OR_AUTHORITY:
	        if (char == '/') {
	          state = AUTHORITY;
	          break;
	        } else {
	          state = PATH;
	          continue;
	        }

	      case RELATIVE:
	        url.scheme = base.scheme;
	        if (char == EOF) {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
	          state = RELATIVE_SLASH;
	        } else if (char == '?') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.query = base.query;
	          url.fragment = '';
	          state = FRAGMENT;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          url.path = base.path.slice();
	          url.path.pop();
	          state = PATH;
	          continue;
	        } break;

	      case RELATIVE_SLASH:
	        if (isSpecial(url) && (char == '/' || char == '\\')) {
	          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        } else if (char == '/') {
	          state = AUTHORITY;
	        } else {
	          url.username = base.username;
	          url.password = base.password;
	          url.host = base.host;
	          url.port = base.port;
	          state = PATH;
	          continue;
	        } break;

	      case SPECIAL_AUTHORITY_SLASHES:
	        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
	        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
	        pointer++;
	        break;

	      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
	        if (char != '/' && char != '\\') {
	          state = AUTHORITY;
	          continue;
	        } break;

	      case AUTHORITY:
	        if (char == '@') {
	          if (seenAt) buffer = '%40' + buffer;
	          seenAt = true;
	          bufferCodePoints = arrayFrom(buffer);
	          for (var i = 0; i < bufferCodePoints.length; i++) {
	            var codePoint = bufferCodePoints[i];
	            if (codePoint == ':' && !seenPasswordToken) {
	              seenPasswordToken = true;
	              continue;
	            }
	            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
	            if (seenPasswordToken) url.password += encodedCodePoints;
	            else url.username += encodedCodePoints;
	          }
	          buffer = '';
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (seenAt && buffer == '') return INVALID_AUTHORITY;
	          pointer -= arrayFrom(buffer).length + 1;
	          buffer = '';
	          state = HOST;
	        } else buffer += char;
	        break;

	      case HOST:
	      case HOSTNAME:
	        if (stateOverride && url.scheme == 'file') {
	          state = FILE_HOST;
	          continue;
	        } else if (char == ':' && !seenBracket) {
	          if (buffer == '') return INVALID_HOST;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PORT;
	          if (stateOverride == HOSTNAME) return;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url))
	        ) {
	          if (isSpecial(url) && buffer == '') return INVALID_HOST;
	          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
	          failure = parseHost(url, buffer);
	          if (failure) return failure;
	          buffer = '';
	          state = PATH_START;
	          if (stateOverride) return;
	          continue;
	        } else {
	          if (char == '[') seenBracket = true;
	          else if (char == ']') seenBracket = false;
	          buffer += char;
	        } break;

	      case PORT:
	        if (DIGIT.test(char)) {
	          buffer += char;
	        } else if (
	          char == EOF || char == '/' || char == '?' || char == '#' ||
	          (char == '\\' && isSpecial(url)) ||
	          stateOverride
	        ) {
	          if (buffer != '') {
	            var port = parseInt(buffer, 10);
	            if (port > 0xFFFF) return INVALID_PORT;
	            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
	            buffer = '';
	          }
	          if (stateOverride) return;
	          state = PATH_START;
	          continue;
	        } else return INVALID_PORT;
	        break;

	      case FILE:
	        url.scheme = 'file';
	        if (char == '/' || char == '\\') state = FILE_SLASH;
	        else if (base && base.scheme == 'file') {
	          if (char == EOF) {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	          } else if (char == '?') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.host = base.host;
	            url.path = base.path.slice();
	            url.query = base.query;
	            url.fragment = '';
	            state = FRAGMENT;
	          } else {
	            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	              url.host = base.host;
	              url.path = base.path.slice();
	              shortenURLsPath(url);
	            }
	            state = PATH;
	            continue;
	          }
	        } else {
	          state = PATH;
	          continue;
	        } break;

	      case FILE_SLASH:
	        if (char == '/' || char == '\\') {
	          state = FILE_HOST;
	          break;
	        }
	        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
	          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
	          else url.host = base.host;
	        }
	        state = PATH;
	        continue;

	      case FILE_HOST:
	        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
	          if (!stateOverride && isWindowsDriveLetter(buffer)) {
	            state = PATH;
	          } else if (buffer == '') {
	            url.host = '';
	            if (stateOverride) return;
	            state = PATH_START;
	          } else {
	            failure = parseHost(url, buffer);
	            if (failure) return failure;
	            if (url.host == 'localhost') url.host = '';
	            if (stateOverride) return;
	            buffer = '';
	            state = PATH_START;
	          } continue;
	        } else buffer += char;
	        break;

	      case PATH_START:
	        if (isSpecial(url)) {
	          state = PATH;
	          if (char != '/' && char != '\\') continue;
	        } else if (!stateOverride && char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          state = PATH;
	          if (char != '/') continue;
	        } break;

	      case PATH:
	        if (
	          char == EOF || char == '/' ||
	          (char == '\\' && isSpecial(url)) ||
	          (!stateOverride && (char == '?' || char == '#'))
	        ) {
	          if (isDoubleDot(buffer)) {
	            shortenURLsPath(url);
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else if (isSingleDot(buffer)) {
	            if (char != '/' && !(char == '\\' && isSpecial(url))) {
	              url.path.push('');
	            }
	          } else {
	            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
	              if (url.host) url.host = '';
	              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
	            }
	            url.path.push(buffer);
	          }
	          buffer = '';
	          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
	            while (url.path.length > 1 && url.path[0] === '') {
	              url.path.shift();
	            }
	          }
	          if (char == '?') {
	            url.query = '';
	            state = QUERY;
	          } else if (char == '#') {
	            url.fragment = '';
	            state = FRAGMENT;
	          }
	        } else {
	          buffer += percentEncode(char, pathPercentEncodeSet);
	        } break;

	      case CANNOT_BE_A_BASE_URL_PATH:
	        if (char == '?') {
	          url.query = '';
	          state = QUERY;
	        } else if (char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case QUERY:
	        if (!stateOverride && char == '#') {
	          url.fragment = '';
	          state = FRAGMENT;
	        } else if (char != EOF) {
	          if (char == "'" && isSpecial(url)) url.query += '%27';
	          else if (char == '#') url.query += '%23';
	          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
	        } break;

	      case FRAGMENT:
	        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
	        break;
	    }

	    pointer++;
	  }
	};

	// `URL` constructor
	// https://url.spec.whatwg.org/#url-class
	var URLConstructor = function URL(url /* , base */) {
	  var that = anInstance(this, URLConstructor, 'URL');
	  var base = arguments.length > 1 ? arguments[1] : undefined;
	  var urlString = String(url);
	  var state = setInternalState$1(that, { type: 'URL' });
	  var baseState, failure;
	  if (base !== undefined) {
	    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
	    else {
	      failure = parseURL(baseState = {}, String(base));
	      if (failure) throw TypeError(failure);
	    }
	  }
	  failure = parseURL(state, urlString, null, baseState);
	  if (failure) throw TypeError(failure);
	  var searchParams = state.searchParams = new URLSearchParams$1();
	  var searchParamsState = getInternalSearchParamsState(searchParams);
	  searchParamsState.updateSearchParams(state.query);
	  searchParamsState.updateURL = function () {
	    state.query = String(searchParams) || null;
	  };
	  if (!DESCRIPTORS$1) {
	    that.href = serializeURL.call(that);
	    that.origin = getOrigin.call(that);
	    that.protocol = getProtocol.call(that);
	    that.username = getUsername.call(that);
	    that.password = getPassword.call(that);
	    that.host = getHost.call(that);
	    that.hostname = getHostname.call(that);
	    that.port = getPort.call(that);
	    that.pathname = getPathname.call(that);
	    that.search = getSearch.call(that);
	    that.searchParams = getSearchParams.call(that);
	    that.hash = getHash$1.call(that);
	  }
	};

	var URLPrototype = URLConstructor.prototype;

	var serializeURL = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var username = url.username;
	  var password = url.password;
	  var host = url.host;
	  var port = url.port;
	  var path = url.path;
	  var query = url.query;
	  var fragment = url.fragment;
	  var output = scheme + ':';
	  if (host !== null) {
	    output += '//';
	    if (includesCredentials(url)) {
	      output += username + (password ? ':' + password : '') + '@';
	    }
	    output += serializeHost(host);
	    if (port !== null) output += ':' + port;
	  } else if (scheme == 'file') output += '//';
	  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	  if (query !== null) output += '?' + query;
	  if (fragment !== null) output += '#' + fragment;
	  return output;
	};

	var getOrigin = function () {
	  var url = getInternalURLState(this);
	  var scheme = url.scheme;
	  var port = url.port;
	  if (scheme == 'blob') try {
	    return new URL(scheme.path[0]).origin;
	  } catch (error) {
	    return 'null';
	  }
	  if (scheme == 'file' || !isSpecial(url)) return 'null';
	  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
	};

	var getProtocol = function () {
	  return getInternalURLState(this).scheme + ':';
	};

	var getUsername = function () {
	  return getInternalURLState(this).username;
	};

	var getPassword = function () {
	  return getInternalURLState(this).password;
	};

	var getHost = function () {
	  var url = getInternalURLState(this);
	  var host = url.host;
	  var port = url.port;
	  return host === null ? ''
	    : port === null ? serializeHost(host)
	    : serializeHost(host) + ':' + port;
	};

	var getHostname = function () {
	  var host = getInternalURLState(this).host;
	  return host === null ? '' : serializeHost(host);
	};

	var getPort = function () {
	  var port = getInternalURLState(this).port;
	  return port === null ? '' : String(port);
	};

	var getPathname = function () {
	  var url = getInternalURLState(this);
	  var path = url.path;
	  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
	};

	var getSearch = function () {
	  var query = getInternalURLState(this).query;
	  return query ? '?' + query : '';
	};

	var getSearchParams = function () {
	  return getInternalURLState(this).searchParams;
	};

	var getHash$1 = function () {
	  var fragment = getInternalURLState(this).fragment;
	  return fragment ? '#' + fragment : '';
	};

	var accessorDescriptor = function (getter, setter) {
	  return { get: getter, set: setter, configurable: true, enumerable: true };
	};

	if (DESCRIPTORS$1) {
	  defineProperties(URLPrototype, {
	    // `URL.prototype.href` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-href
	    href: accessorDescriptor(serializeURL, function (href) {
	      var url = getInternalURLState(this);
	      var urlString = String(href);
	      var failure = parseURL(url, urlString);
	      if (failure) throw TypeError(failure);
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.origin` getter
	    // https://url.spec.whatwg.org/#dom-url-origin
	    origin: accessorDescriptor(getOrigin),
	    // `URL.prototype.protocol` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-protocol
	    protocol: accessorDescriptor(getProtocol, function (protocol) {
	      var url = getInternalURLState(this);
	      parseURL(url, String(protocol) + ':', SCHEME_START);
	    }),
	    // `URL.prototype.username` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-username
	    username: accessorDescriptor(getUsername, function (username) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(username));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.username = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.password` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-password
	    password: accessorDescriptor(getPassword, function (password) {
	      var url = getInternalURLState(this);
	      var codePoints = arrayFrom(String(password));
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      url.password = '';
	      for (var i = 0; i < codePoints.length; i++) {
	        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
	      }
	    }),
	    // `URL.prototype.host` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-host
	    host: accessorDescriptor(getHost, function (host) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(host), HOST);
	    }),
	    // `URL.prototype.hostname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hostname
	    hostname: accessorDescriptor(getHostname, function (hostname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      parseURL(url, String(hostname), HOSTNAME);
	    }),
	    // `URL.prototype.port` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-port
	    port: accessorDescriptor(getPort, function (port) {
	      var url = getInternalURLState(this);
	      if (cannotHaveUsernamePasswordPort(url)) return;
	      port = String(port);
	      if (port == '') url.port = null;
	      else parseURL(url, port, PORT);
	    }),
	    // `URL.prototype.pathname` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-pathname
	    pathname: accessorDescriptor(getPathname, function (pathname) {
	      var url = getInternalURLState(this);
	      if (url.cannotBeABaseURL) return;
	      url.path = [];
	      parseURL(url, pathname + '', PATH_START);
	    }),
	    // `URL.prototype.search` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-search
	    search: accessorDescriptor(getSearch, function (search) {
	      var url = getInternalURLState(this);
	      search = String(search);
	      if (search == '') {
	        url.query = null;
	      } else {
	        if ('?' == search.charAt(0)) search = search.slice(1);
	        url.query = '';
	        parseURL(url, search, QUERY);
	      }
	      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
	    }),
	    // `URL.prototype.searchParams` getter
	    // https://url.spec.whatwg.org/#dom-url-searchparams
	    searchParams: accessorDescriptor(getSearchParams),
	    // `URL.prototype.hash` accessors pair
	    // https://url.spec.whatwg.org/#dom-url-hash
	    hash: accessorDescriptor(getHash$1, function (hash) {
	      var url = getInternalURLState(this);
	      hash = String(hash);
	      if (hash == '') {
	        url.fragment = null;
	        return;
	      }
	      if ('#' == hash.charAt(0)) hash = hash.slice(1);
	      url.fragment = '';
	      parseURL(url, hash, FRAGMENT);
	    })
	  });
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	redefine(URLPrototype, 'toJSON', function toJSON() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	// `URL.prototype.toString` method
	// https://url.spec.whatwg.org/#URL-stringification-behavior
	redefine(URLPrototype, 'toString', function toString() {
	  return serializeURL.call(this);
	}, { enumerable: true });

	if (NativeURL) {
	  var nativeCreateObjectURL = NativeURL.createObjectURL;
	  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
	  // `URL.createObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
	    return nativeCreateObjectURL.apply(NativeURL, arguments);
	  });
	  // `URL.revokeObjectURL` method
	  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
	  // eslint-disable-next-line no-unused-vars
	  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
	    return nativeRevokeObjectURL.apply(NativeURL, arguments);
	  });
	}

	setToStringTag(URLConstructor, 'URL');

	$$4({ global: true, forced: !USE_NATIVE_URL, sham: !DESCRIPTORS$1 }, {
	  URL: URLConstructor
	});

	var $$3 = _export;

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	$$3({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return URL.prototype.toString.call(this);
	  }
	});

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	}(runtime));

	var path$2 = path$5;

	path$2.Promise;

	var $$2 = _export;
	var DESCRIPTORS = descriptors;
	var getPrototypeOf = objectGetPrototypeOf$1;
	var setPrototypeOf = objectSetPrototypeOf$1;
	var create = objectCreate;
	var defineProperty = objectDefineProperty;
	var createPropertyDescriptor = createPropertyDescriptor$9;
	var iterate$1 = iterate$9.exports;
	var createNonEnumerableProperty = createNonEnumerableProperty$g;
	var InternalStateModule = internalState;

	var setInternalState = InternalStateModule.set;
	var getInternalAggregateErrorState = InternalStateModule.getterFor('AggregateError');

	var $AggregateError = function AggregateError(errors, message) {
	  var that = this;
	  if (!(that instanceof $AggregateError)) return new $AggregateError(errors, message);
	  if (setPrototypeOf) {
	    that = setPrototypeOf(new Error(message), getPrototypeOf(that));
	  }
	  var errorsArray = [];
	  iterate$1(errors, errorsArray.push, errorsArray);
	  if (DESCRIPTORS) setInternalState(that, { errors: errorsArray, type: 'AggregateError' });
	  else that.errors = errorsArray;
	  if (message !== undefined) createNonEnumerableProperty(that, 'message', String(message));
	  return that;
	};

	$AggregateError.prototype = create(Error.prototype, {
	  constructor: createPropertyDescriptor(5, $AggregateError),
	  message: createPropertyDescriptor(5, ''),
	  name: createPropertyDescriptor(5, 'AggregateError')
	});

	if (DESCRIPTORS) defineProperty.f($AggregateError.prototype, 'errors', {
	  get: function () {
	    return getInternalAggregateErrorState(this).errors;
	  },
	  configurable: true
	});

	$$2({ global: true }, {
	  AggregateError: $AggregateError
	});

	var $$1 = _export;
	var newPromiseCapabilityModule$1 = newPromiseCapability$2;
	var perform$1 = perform$4;

	// `Promise.try` method
	// https://github.com/tc39/proposal-promise-try
	$$1({ target: 'Promise', stat: true }, {
	  'try': function (callbackfn) {
	    var promiseCapability = newPromiseCapabilityModule$1.f(this);
	    var result = perform$1(callbackfn);
	    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
	    return promiseCapability.promise;
	  }
	});

	var $ = _export;
	var aFunction = aFunction$f;
	var getBuiltIn = getBuiltIn$d;
	var newPromiseCapabilityModule = newPromiseCapability$2;
	var perform = perform$4;
	var iterate = iterate$9.exports;

	var PROMISE_ANY_ERROR = 'No one promise resolved';

	// `Promise.any` method
	// https://github.com/tc39/proposal-promise-any
	$({ target: 'Promise', stat: true }, {
	  any: function any(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var promiseResolve = aFunction(C.resolve);
	      var errors = [];
	      var counter = 0;
	      var remaining = 1;
	      var alreadyResolved = false;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyRejected = false;
	        errors.push(undefined);
	        remaining++;
	        promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyResolved = true;
	          resolve(value);
	        }, function (e) {
	          if (alreadyRejected || alreadyResolved) return;
	          alreadyRejected = true;
	          errors[index] = e;
	          --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR));
	        });
	      });
	      --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR));
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var global$2 = global$J;
	var bind$2 = functionBindContext;

	var call = Function.call;

	var entryUnbind$1 = function (CONSTRUCTOR, METHOD, length) {
	  return bind$2(call, global$2[CONSTRUCTOR].prototype[METHOD], length);
	};

	var entryUnbind = entryUnbind$1;

	entryUnbind('Array', 'forEach');

	var path$1 = path$5;

	path$1.Object.assign;

	var path = path$5;

	path.URLSearchParams;

	var global$1 =
	  (typeof globalThis !== 'undefined' && globalThis) ||
	  (typeof self !== 'undefined' && self) ||
	  (typeof global$1 !== 'undefined' && global$1);

	var support = {
	  searchParams: 'URLSearchParams' in global$1,
	  iterable: 'Symbol' in global$1 && 'iterator' in Symbol,
	  blob:
	    'FileReader' in global$1 &&
	    'Blob' in global$1 &&
	    (function() {
	      try {
	        new Blob();
	        return true
	      } catch (e) {
	        return false
	      }
	    })(),
	  formData: 'FormData' in global$1,
	  arrayBuffer: 'ArrayBuffer' in global$1
	};

	function isDataView(obj) {
	  return obj && DataView.prototype.isPrototypeOf(obj)
	}

	if (support.arrayBuffer) {
	  var viewClasses = [
	    '[object Int8Array]',
	    '[object Uint8Array]',
	    '[object Uint8ClampedArray]',
	    '[object Int16Array]',
	    '[object Uint16Array]',
	    '[object Int32Array]',
	    '[object Uint32Array]',
	    '[object Float32Array]',
	    '[object Float64Array]'
	  ];

	  var isArrayBufferView =
	    ArrayBuffer.isView ||
	    function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	}

	function normalizeName(name) {
	  if (typeof name !== 'string') {
	    name = String(name);
	  }
	  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
	    throw new TypeError('Invalid character in header field name: "' + name + '"')
	  }
	  return name.toLowerCase()
	}

	function normalizeValue(value) {
	  if (typeof value !== 'string') {
	    value = String(value);
	  }
	  return value
	}

	// Build a destructive iterator for the value list
	function iteratorFor(items) {
	  var iterator = {
	    next: function() {
	      var value = items.shift();
	      return {done: value === undefined, value: value}
	    }
	  };

	  if (support.iterable) {
	    iterator[Symbol.iterator] = function() {
	      return iterator
	    };
	  }

	  return iterator
	}

	function Headers(headers) {
	  this.map = {};

	  if (headers instanceof Headers) {
	    headers.forEach(function(value, name) {
	      this.append(name, value);
	    }, this);
	  } else if (Array.isArray(headers)) {
	    headers.forEach(function(header) {
	      this.append(header[0], header[1]);
	    }, this);
	  } else if (headers) {
	    Object.getOwnPropertyNames(headers).forEach(function(name) {
	      this.append(name, headers[name]);
	    }, this);
	  }
	}

	Headers.prototype.append = function(name, value) {
	  name = normalizeName(name);
	  value = normalizeValue(value);
	  var oldValue = this.map[name];
	  this.map[name] = oldValue ? oldValue + ', ' + value : value;
	};

	Headers.prototype['delete'] = function(name) {
	  delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function(name) {
	  name = normalizeName(name);
	  return this.has(name) ? this.map[name] : null
	};

	Headers.prototype.has = function(name) {
	  return this.map.hasOwnProperty(normalizeName(name))
	};

	Headers.prototype.set = function(name, value) {
	  this.map[normalizeName(name)] = normalizeValue(value);
	};

	Headers.prototype.forEach = function(callback, thisArg) {
	  for (var name in this.map) {
	    if (this.map.hasOwnProperty(name)) {
	      callback.call(thisArg, this.map[name], name, this);
	    }
	  }
	};

	Headers.prototype.keys = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push(name);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.values = function() {
	  var items = [];
	  this.forEach(function(value) {
	    items.push(value);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.entries = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push([name, value]);
	  });
	  return iteratorFor(items)
	};

	if (support.iterable) {
	  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	}

	function consumed(body) {
	  if (body.bodyUsed) {
	    return Promise.reject(new TypeError('Already read'))
	  }
	  body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	  return new Promise(function(resolve, reject) {
	    reader.onload = function() {
	      resolve(reader.result);
	    };
	    reader.onerror = function() {
	      reject(reader.error);
	    };
	  })
	}

	function readBlobAsArrayBuffer(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsArrayBuffer(blob);
	  return promise
	}

	function readBlobAsText(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsText(blob);
	  return promise
	}

	function readArrayBufferAsText(buf) {
	  var view = new Uint8Array(buf);
	  var chars = new Array(view.length);

	  for (var i = 0; i < view.length; i++) {
	    chars[i] = String.fromCharCode(view[i]);
	  }
	  return chars.join('')
	}

	function bufferClone(buf) {
	  if (buf.slice) {
	    return buf.slice(0)
	  } else {
	    var view = new Uint8Array(buf.byteLength);
	    view.set(new Uint8Array(buf));
	    return view.buffer
	  }
	}

	function Body() {
	  this.bodyUsed = false;

	  this._initBody = function(body) {
	    /*
	      fetch-mock wraps the Response object in an ES6 Proxy to
	      provide useful test harness features such as flush. However, on
	      ES5 browsers without fetch or Proxy support pollyfills must be used;
	      the proxy-pollyfill is unable to proxy an attribute unless it exists
	      on the object before the Proxy is created. This change ensures
	      Response.bodyUsed exists on the instance, while maintaining the
	      semantic of setting Request.bodyUsed in the constructor before
	      _initBody is called.
	    */
	    this.bodyUsed = this.bodyUsed;
	    this._bodyInit = body;
	    if (!body) {
	      this._bodyText = '';
	    } else if (typeof body === 'string') {
	      this._bodyText = body;
	    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	      this._bodyBlob = body;
	    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	      this._bodyFormData = body;
	    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	      this._bodyText = body.toString();
	    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	      this._bodyArrayBuffer = bufferClone(body.buffer);
	      // IE 10-11 can't handle a DataView body.
	      this._bodyInit = new Blob([this._bodyArrayBuffer]);
	    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	      this._bodyArrayBuffer = bufferClone(body);
	    } else {
	      this._bodyText = body = Object.prototype.toString.call(body);
	    }

	    if (!this.headers.get('content-type')) {
	      if (typeof body === 'string') {
	        this.headers.set('content-type', 'text/plain;charset=UTF-8');
	      } else if (this._bodyBlob && this._bodyBlob.type) {
	        this.headers.set('content-type', this._bodyBlob.type);
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	      }
	    }
	  };

	  if (support.blob) {
	    this.blob = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return Promise.resolve(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as blob')
	      } else {
	        return Promise.resolve(new Blob([this._bodyText]))
	      }
	    };

	    this.arrayBuffer = function() {
	      if (this._bodyArrayBuffer) {
	        var isConsumed = consumed(this);
	        if (isConsumed) {
	          return isConsumed
	        }
	        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
	          return Promise.resolve(
	            this._bodyArrayBuffer.buffer.slice(
	              this._bodyArrayBuffer.byteOffset,
	              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
	            )
	          )
	        } else {
	          return Promise.resolve(this._bodyArrayBuffer)
	        }
	      } else {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	    };
	  }

	  this.text = function() {
	    var rejected = consumed(this);
	    if (rejected) {
	      return rejected
	    }

	    if (this._bodyBlob) {
	      return readBlobAsText(this._bodyBlob)
	    } else if (this._bodyArrayBuffer) {
	      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	    } else if (this._bodyFormData) {
	      throw new Error('could not read FormData body as text')
	    } else {
	      return Promise.resolve(this._bodyText)
	    }
	  };

	  if (support.formData) {
	    this.formData = function() {
	      return this.text().then(decode$1)
	    };
	  }

	  this.json = function() {
	    return this.text().then(JSON.parse)
	  };

	  return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	  var upcased = method.toUpperCase();
	  return methods.indexOf(upcased) > -1 ? upcased : method
	}

	function Request(input, options) {
	  if (!(this instanceof Request)) {
	    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	  }

	  options = options || {};
	  var body = options.body;

	  if (input instanceof Request) {
	    if (input.bodyUsed) {
	      throw new TypeError('Already read')
	    }
	    this.url = input.url;
	    this.credentials = input.credentials;
	    if (!options.headers) {
	      this.headers = new Headers(input.headers);
	    }
	    this.method = input.method;
	    this.mode = input.mode;
	    this.signal = input.signal;
	    if (!body && input._bodyInit != null) {
	      body = input._bodyInit;
	      input.bodyUsed = true;
	    }
	  } else {
	    this.url = String(input);
	  }

	  this.credentials = options.credentials || this.credentials || 'same-origin';
	  if (options.headers || !this.headers) {
	    this.headers = new Headers(options.headers);
	  }
	  this.method = normalizeMethod(options.method || this.method || 'GET');
	  this.mode = options.mode || this.mode || null;
	  this.signal = options.signal || this.signal;
	  this.referrer = null;

	  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	    throw new TypeError('Body not allowed for GET or HEAD requests')
	  }
	  this._initBody(body);

	  if (this.method === 'GET' || this.method === 'HEAD') {
	    if (options.cache === 'no-store' || options.cache === 'no-cache') {
	      // Search for a '_' parameter in the query string
	      var reParamSearch = /([?&])_=[^&]*/;
	      if (reParamSearch.test(this.url)) {
	        // If it already exists then set the value with the current time
	        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
	      } else {
	        // Otherwise add a new '_' parameter to the end with the current time
	        var reQueryString = /\?/;
	        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
	      }
	    }
	  }
	}

	Request.prototype.clone = function() {
	  return new Request(this, {body: this._bodyInit})
	};

	function decode$1(body) {
	  var form = new FormData();
	  body
	    .trim()
	    .split('&')
	    .forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	  return form
	}

	function parseHeaders(rawHeaders) {
	  var headers = new Headers();
	  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	  // https://tools.ietf.org/html/rfc7230#section-3.2
	  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	  // Avoiding split via regex to work around a common IE11 bug with the core-js 3.6.0 regex polyfill
	  // https://github.com/github/fetch/issues/748
	  // https://github.com/zloirock/core-js/issues/751
	  preProcessedHeaders
	    .split('\r')
	    .map(function(header) {
	      return header.indexOf('\n') === 0 ? header.substr(1, header.length) : header
	    })
	    .forEach(function(line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	  return headers
	}

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
	  if (!(this instanceof Response)) {
	    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	  }
	  if (!options) {
	    options = {};
	  }

	  this.type = 'default';
	  this.status = options.status === undefined ? 200 : options.status;
	  this.ok = this.status >= 200 && this.status < 300;
	  this.statusText = options.statusText === undefined ? '' : '' + options.statusText;
	  this.headers = new Headers(options.headers);
	  this.url = options.url || '';
	  this._initBody(bodyInit);
	}

	Body.call(Response.prototype);

	Response.prototype.clone = function() {
	  return new Response(this._bodyInit, {
	    status: this.status,
	    statusText: this.statusText,
	    headers: new Headers(this.headers),
	    url: this.url
	  })
	};

	Response.error = function() {
	  var response = new Response(null, {status: 0, statusText: ''});
	  response.type = 'error';
	  return response
	};

	var redirectStatuses = [301, 302, 303, 307, 308];

	Response.redirect = function(url, status) {
	  if (redirectStatuses.indexOf(status) === -1) {
	    throw new RangeError('Invalid status code')
	  }

	  return new Response(null, {status: status, headers: {location: url}})
	};

	var DOMException = global$1.DOMException;
	try {
	  new DOMException();
	} catch (err) {
	  DOMException = function(message, name) {
	    this.message = message;
	    this.name = name;
	    var error = Error(message);
	    this.stack = error.stack;
	  };
	  DOMException.prototype = Object.create(Error.prototype);
	  DOMException.prototype.constructor = DOMException;
	}

	function fetch$1(input, init) {
	  return new Promise(function(resolve, reject) {
	    var request = new Request(input, init);

	    if (request.signal && request.signal.aborted) {
	      return reject(new DOMException('Aborted', 'AbortError'))
	    }

	    var xhr = new XMLHttpRequest();

	    function abortXhr() {
	      xhr.abort();
	    }

	    xhr.onload = function() {
	      var options = {
	        status: xhr.status,
	        statusText: xhr.statusText,
	        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	      };
	      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	      var body = 'response' in xhr ? xhr.response : xhr.responseText;
	      setTimeout(function() {
	        resolve(new Response(body, options));
	      }, 0);
	    };

	    xhr.onerror = function() {
	      setTimeout(function() {
	        reject(new TypeError('Network request failed'));
	      }, 0);
	    };

	    xhr.ontimeout = function() {
	      setTimeout(function() {
	        reject(new TypeError('Network request failed'));
	      }, 0);
	    };

	    xhr.onabort = function() {
	      setTimeout(function() {
	        reject(new DOMException('Aborted', 'AbortError'));
	      }, 0);
	    };

	    function fixUrl(url) {
	      try {
	        return url === '' && global$1.location.href ? global$1.location.href : url
	      } catch (e) {
	        return url
	      }
	    }

	    xhr.open(request.method, fixUrl(request.url), true);

	    if (request.credentials === 'include') {
	      xhr.withCredentials = true;
	    } else if (request.credentials === 'omit') {
	      xhr.withCredentials = false;
	    }

	    if ('responseType' in xhr) {
	      if (support.blob) {
	        xhr.responseType = 'blob';
	      } else if (
	        support.arrayBuffer &&
	        request.headers.get('Content-Type') &&
	        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
	      ) {
	        xhr.responseType = 'arraybuffer';
	      }
	    }

	    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
	      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
	        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
	      });
	    } else {
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value);
	      });
	    }

	    if (request.signal) {
	      request.signal.addEventListener('abort', abortXhr);

	      xhr.onreadystatechange = function() {
	        // DONE (success or failure)
	        if (xhr.readyState === 4) {
	          request.signal.removeEventListener('abort', abortXhr);
	        }
	      };
	    }

	    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	  })
	}

	fetch$1.polyfill = true;

	if (!global$1.fetch) {
	  global$1.fetch = fetch$1;
	  global$1.Headers = Headers;
	  global$1.Request = Request;
	  global$1.Response = Response;
	}

	/**
	 * Polyfill for Element.prototype.closest()
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
	 */

	if (!Element.prototype.matches) {
	  Element.prototype.matches = Element.prototype.msMatchesSelector ||
	                              Element.prototype.webkitMatchesSelector;
	}

	if (!Element.prototype.closest) {
	  Element.prototype.closest = function(s) {
	    var el = this;

	    do {
	      if (el.matches(s)) return el;
	      el = el.parentElement || el.parentNode;
	    } while (el !== null && el.nodeType === 1);
	    return null;
	  };
	}

	/**
	 * Polyfill for Element.prototype.matches()
	 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
	 */

	/* eslint-disable no-undef */
	if (!Element.prototype.matches)
	  Element.prototype.matches =
	    Element.prototype.matchesSelector ||
	    Element.prototype.mozMatchesSelector ||
	    Element.prototype.msMatchesSelector ||
	    Element.prototype.oMatchesSelector ||
	    Element.prototype.webkitMatchesSelector ||
	    function(s) {
	      let matches = (this.document || this.ownerDocument)
	        .querySelectorAll(s);
	      let i = matches.length;
	      // eslint-disable-next-line no-empty
	      while (--i >= 0 && matches.item(i) !== this) {}
	      return i > -1;
	    };
	/* eslint-enable no-undef */

	/**
	 * Polyfill for Element.prototype.remove()
	 * https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#Polyfill
	 */

	(function(arr) {
	  arr.forEach(function(item) {
	    if (item.hasOwnProperty('remove')) return;

	    Object.defineProperty(item, 'remove', {
	      configurable: true,
	      enumerable: true,
	      writable: true,
	      value: function remove() {
	        if (this.parentNode !== null)
	          this.parentNode.removeChild(this);
	      }
	    });
	  });
	})([
	  Element.prototype,
	  CharacterData.prototype,
	  DocumentType.prototype
	]);
	/* eslint-enable no-undef */

	/**
	 * Polyfill for NodeList.prototype.forEach()
	 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
	 */

	/* eslint-disable no-undef */
	if (window.NodeList && !NodeList.prototype.forEach) {
	  NodeList.prototype.forEach = Array.prototype.forEach;
	}

	/**
	 * The Simple Toggle class. This will toggle the class 'active' and 'hidden'
	 * on target elements, determined by a click event on a selected link or
	 * element. This will also toggle the aria-hidden attribute for targeted
	 * elements to support screen readers. Target settings and other functionality
	 * can be controlled through data attributes.
	 *
	 * This uses the .matches() method which will require a polyfill for IE
	 * https://polyfill.io/v2/docs/features/#Element_prototype_matches
	 *
	 * @class
	 */
	class Toggle {
	  /**
	   * @constructor
	   *
	   * @param  {Object}  s  Settings for this Toggle instance
	   *
	   * @return {Object}     The class
	   */
	  constructor(s) {
	    // Create an object to store existing toggle listeners (if it doesn't exist)
	    if (!window.hasOwnProperty(Toggle.callback))
	      window[Toggle.callback] = [];

	    s = (!s) ? {} : s;

	    this.settings = {
	      selector: (s.selector) ? s.selector : Toggle.selector,
	      namespace: (s.namespace) ? s.namespace : Toggle.namespace,
	      inactiveClass: (s.inactiveClass) ? s.inactiveClass : Toggle.inactiveClass,
	      activeClass: (s.activeClass) ? s.activeClass : Toggle.activeClass,
	      before: (s.before) ? s.before : false,
	      after: (s.after) ? s.after : false,
	      valid: (s.valid) ? s.valid : false,
	      focusable: (s.hasOwnProperty('focusable')) ? s.focusable : true,
	      jump: (s.hasOwnProperty('jump')) ? s.jump : true
	    };

	    // Store the element for potential use in callbacks
	    this.element = (s.element) ? s.element : false;

	    if (this.element) {
	      this.element.addEventListener('click', (event) => {
	        this.toggle(event);
	      });
	    } else {
	      // If there isn't an existing instantiated toggle, add the event listener.
	      if (!window[Toggle.callback].hasOwnProperty(this.settings.selector)) {
	        let body = document.querySelector('body');

	        for (let i = 0; i < Toggle.events.length; i++) {
	          let tggleEvent = Toggle.events[i];

	          body.addEventListener(tggleEvent, event => {
	            if (!event.target.matches(this.settings.selector))
	              return;

	            this.event = event;

	            let type = event.type.toUpperCase();

	            if (
	              this[event.type] &&
	              Toggle.elements[type] &&
	              Toggle.elements[type].includes(event.target.tagName)
	            ) this[event.type](event);
	          });
	        }
	      }
	    }

	    // Record that a toggle using this selector has been instantiated.
	    // This prevents double toggling.
	    window[Toggle.callback][this.settings.selector] = true;

	    return this;
	  }

	  /**
	   * Click event handler
	   *
	   * @param  {Event}  event  The original click event
	   */
	  click(event) {
	    this.toggle(event);
	  }

	  /**
	   * Input/select/textarea change event handler. Checks to see if the
	   * event.target is valid then toggles accordingly.
	   *
	   * @param  {Event}  event  The original input change event
	   */
	  change(event) {
	    let valid = event.target.checkValidity();

	    if (valid && !this.isActive(event.target)) {
	      this.toggle(event); // show
	    } else if (!valid && this.isActive(event.target)) {
	      this.toggle(event); // hide
	    }
	  }

	  /**
	   * Check to see if the toggle is active
	   *
	   * @param  {Object}  element  The toggle element (trigger)
	   */
	  isActive(element) {
	    let active = false;

	    if (this.settings.activeClass) {
	      active = element.classList.contains(this.settings.activeClass);
	    }

	    // if () {
	      // Toggle.elementAriaRoles
	      // TODO: Add catch to see if element aria roles are toggled
	    // }

	    // if () {
	      // Toggle.targetAriaRoles
	      // TODO: Add catch to see if target aria roles are toggled
	    // }

	    return active;
	  }

	  /**
	   * Get the target of the toggle element (trigger)
	   *
	   * @param  {Object}  el  The toggle element (trigger)
	   */
	  getTarget(element) {
	    let target = false;

	    /** Anchor Links */
	    target = (element.hasAttribute('href')) ?
	      document.querySelector(element.getAttribute('href')) : target;

	    /** Toggle Controls */
	    target = (element.hasAttribute('aria-controls')) ?
	      document.querySelector(`#${element.getAttribute('aria-controls')}`) : target;

	    return target;
	  }

	  /**
	   * The toggle event proxy for getting and setting the element/s and target
	   *
	   * @param  {Object}  event  The main click event
	   *
	   * @return {Object}         The Toggle instance
	   */
	  toggle(event) {
	    let element = event.target;
	    let target = false;
	    let focusable = [];

	    event.preventDefault();

	    target = this.getTarget(element);

	    /** Focusable Children */
	    focusable = (target) ?
	      target.querySelectorAll(Toggle.elFocusable.join(', ')) : focusable;

	    /** Main Functionality */
	    if (!target) return this;
	    this.elementToggle(element, target, focusable);

	    /** Undo */
	    if (element.dataset[`${this.settings.namespace}Undo`]) {
	      const undo = document.querySelector(
	        element.dataset[`${this.settings.namespace}Undo`]
	      );

	      undo.addEventListener('click', (event) => {
	        event.preventDefault();
	        this.elementToggle(element, target);
	        undo.removeEventListener('click');
	      });
	    }

	    return this;
	  }

	  /**
	   * Get other toggles that might control the same element
	   *
	   * @param   {Object}    element  The toggling element
	   *
	   * @return  {NodeList}           List of other toggling elements
	   *                               that control the target
	   */
	  getOthers(element) {
	    let selector = false;

	    if (element.hasAttribute('href')) {
	      selector = `[href="${element.getAttribute('href')}"]`;
	    } else if (element.hasAttribute('aria-controls')) {
	      selector = `[aria-controls="${element.getAttribute('aria-controls')}"]`;
	    }

	    return (selector) ? document.querySelectorAll(selector) : [];
	  }

	  /**
	   * Hide the Toggle Target's focusable children from focus.
	   * If an element has the data-attribute `data-toggle-tabindex`
	   * it will use that as the default tab index of the element.
	   *
	   * @param   {NodeList}  elements  List of focusable elements
	   *
	   * @return  {Object}              The Toggle Instance
	   */
	  toggleFocusable(elements) {
	    elements.forEach(element => {
	      let tabindex = element.getAttribute('tabindex');

	      if (tabindex === '-1') {
	        let dataDefault = element
	          .getAttribute(`data-${Toggle.namespace}-tabindex`);

	        if (dataDefault) {
	          element.setAttribute('tabindex', dataDefault);
	        } else {
	          element.removeAttribute('tabindex');
	        }
	      } else {
	        element.setAttribute('tabindex', '-1');
	      }
	    });

	    return this;
	  }

	  /**
	   * Jumps to Element visibly and shifts focus
	   * to the element by setting the tabindex
	   *
	   * @param   {Object}  element  The Toggling Element
	   * @param   {Object}  target   The Target Element
	   *
	   * @return  {Object}           The Toggle instance
	   */
	  jumpTo(element, target) {
	    // Reset the history state. This will clear out
	    // the hash when the target is toggled closed
	    history.pushState('', '',
	      window.location.pathname + window.location.search);

	    // Focus if active
	    if (target.classList.contains(this.settings.activeClass)) {
	      window.location.hash = element.getAttribute('href');

	      target.setAttribute('tabindex', '0');
	      target.focus({preventScroll: true});
	    } else {
	      target.removeAttribute('tabindex');
	    }

	    return this;
	  }

	  /**
	   * The main toggling method for attributes
	   *
	   * @param  {Object}    element    The Toggle element
	   * @param  {Object}    target     The Target element to toggle active/hidden
	   * @param  {NodeList}  focusable  Any focusable children in the target
	   *
	   * @return {Object}               The Toggle instance
	   */
	  elementToggle(element, target, focusable = []) {
	    let i = 0;
	    let attr = '';
	    let value = '';

	    /**
	     * Store elements for potential use in callbacks
	     */

	    this.element = element;
	    this.target = target;
	    this.others = this.getOthers(element);
	    this.focusable = focusable;

	    /**
	     * Validity method property that will cancel the toggle if it returns false
	     */

	    if (this.settings.valid && !this.settings.valid(this))
	      return this;

	    /**
	     * Toggling before hook
	     */

	    if (this.settings.before)
	      this.settings.before(this);

	    /**
	     * Toggle Element and Target classes
	     */

	    if (this.settings.activeClass) {
	      this.element.classList.toggle(this.settings.activeClass);
	      this.target.classList.toggle(this.settings.activeClass);

	      // If there are other toggles that control the same element
	      this.others.forEach(other => {
	        if (other !== this.element)
	          other.classList.toggle(this.settings.activeClass);
	      });
	    }

	    if (this.settings.inactiveClass)
	      target.classList.toggle(this.settings.inactiveClass);

	    /**
	     * Target Element Aria Attributes
	     */

	    for (i = 0; i < Toggle.targetAriaRoles.length; i++) {
	      attr = Toggle.targetAriaRoles[i];
	      value = this.target.getAttribute(attr);

	      if (value != '' && value)
	        this.target.setAttribute(attr, (value === 'true') ? 'false' : 'true');
	    }

	    /**
	     * Toggle the target's focusable children tabindex
	     */

	    if (this.settings.focusable)
	      this.toggleFocusable(this.focusable);

	    /**
	     * Jump to Target Element if Toggle Element is an anchor link
	     */

	    if (this.settings.jump && this.element.hasAttribute('href'))
	      this.jumpTo(this.element, this.target);

	    /**
	     * Toggle Element (including multi toggles) Aria Attributes
	     */

	    for (i = 0; i < Toggle.elAriaRoles.length; i++) {
	      attr = Toggle.elAriaRoles[i];
	      value = this.element.getAttribute(attr);

	      if (value != '' && value)
	        this.element.setAttribute(attr, (value === 'true') ? 'false' : 'true');

	      // If there are other toggles that control the same element
	      this.others.forEach((other) => {
	        if (other !== this.element && other.getAttribute(attr))
	          other.setAttribute(attr, (value === 'true') ? 'false' : 'true');
	      });
	    }

	    /**
	     * Toggling complete hook
	     */

	    if (this.settings.after)
	      this.settings.after(this);

	    return this;
	  }
	}

	/** @type  {String}  The main selector to add the toggling function to */
	Toggle.selector = '[data-js*="toggle"]';

	/** @type  {String}  The namespace for our data attribute settings */
	Toggle.namespace = 'toggle';

	/** @type  {String}  The hide class */
	Toggle.inactiveClass = 'hidden';

	/** @type  {String}  The active class */
	Toggle.activeClass = 'active';

	/** @type  {Array}  Aria roles to toggle true/false on the toggling element */
	Toggle.elAriaRoles = ['aria-pressed', 'aria-expanded'];

	/** @type  {Array}  Aria roles to toggle true/false on the target element */
	Toggle.targetAriaRoles = ['aria-hidden'];

	/** @type  {Array}  Focusable elements to hide within the hidden target element */
	Toggle.elFocusable = [
	  'a', 'button', 'input', 'select', 'textarea', 'object', 'embed', 'form',
	  'fieldset', 'legend', 'label', 'area', 'audio', 'video', 'iframe', 'svg',
	  'details', 'table', '[tabindex]', '[contenteditable]', '[usemap]'
	];

	/** @type  {Array}  Key attribute for storing toggles in the window */
	Toggle.callback = ['TogglesCallback'];

	/** @type  {Array}  Default events to to watch for toggling. Each must have a handler in the class and elements to look for in Toggle.elements */
	Toggle.events = ['click', 'change'];

	/** @type  {Array}  Elements to delegate to each event handler */
	Toggle.elements = {
	  CLICK: ['A', 'BUTTON'],
	  CHANGE: ['SELECT', 'INPUT', 'TEXTAREA']
	};

	/**
	 * The Accordion module
	 * @class
	 */
	class Accordion {
	  /**
	   * @constructor
	   * @return {object} The class
	   */
	  constructor() {
	    this._toggle = new Toggle({
	      selector: Accordion.selector
	    });

	    return this;
	  }
	}

	/**
	 * The dom selector for the module
	 * @type {String}
	 */
	Accordion.selector = '[data-js*="accordion"]';

	/**
	 * @class  Dropdown
	 *
	 * Usage
	 *
	 * Element Attributes. Either <a> or <button>
	 *
	 * @attr  data-js="dropdown"         Instantiates the toggling method
	 * @attr  aria-controls=""           Targets the id of the dropdown
	 * @attr  aria-expanded="false"      Declares target closed/open when toggled
	 * @attr  data-dropdown="open"       Designates the primary opening element of the dropdown
	 * @attr  data-dropdown="close"      Designates the primary closing element of the dropdown
	 * @attr  data-dropdown-lock="true"  Wether to lock screen scrolling when drodown is open
	 *
	 * Target Attributes. Any <element>
	 *
	 * @attr  id=""               Matches aria-controls attr of Element
	 * @attr  class="hidden"      Hidden class
	 * @attr  aria-hidden="true"  Declares target open/closed when toggled
	 */
	class Dropdown {
	  /**
	   * @constructor  Instantiates dropdown and toggle method
	   *
	   * @return  {Object}  The instantiated dropdown with properties
	   */
	  constructor() {
	    this.selector = Dropdown.selector;

	    this.selectors = Dropdown.selectors;

	    this.classes = Dropdown.classes;

	    this.dataAttrs = Dropdown.dataAttrs;

	    this.toggle = new Toggle({
	      selector: this.selector,
	      after: (toggle) => {
	        let active = toggle.target.classList.contains(Toggle.activeClass);

	        // Lock the body from scrolling if lock attribute is present
	        if (active && toggle.element.dataset[this.dataAttrs.LOCK] === 'true') {
	          // Scroll to the top of the page
	          window.scroll(0, 0);

	          // Prevent scrolling on the body
	          document.querySelector('body').classList.add(this.classes.OVERFLOW);

	          // When the last focusable item in the list looses focus loop to the first
	          toggle.focusable.item(toggle.focusable.length - 1)
	            .addEventListener('blur', () => {
	              toggle.focusable.item(0).focus();
	            });
	        } else {
	          // Remove if all other dropdown body locks are inactive
	          let locks = document.querySelectorAll([
	              this.selector,
	              this.selectors.locks,
	              `.${Toggle.activeClass}`
	            ].join(''));

	          if (locks.length === 0) {
	            document.querySelector('body').classList.remove(this.classes.OVERFLOW);
	          }
	        }

	        // Focus on the close or open button if present
	        let id = `[aria-controls="${toggle.target.getAttribute('id')}"]`;
	        let close = document.querySelector(this.selectors.CLOSE + id);
	        let open = document.querySelector(this.selectors.OPEN + id);

	        if (active && close) {
	          close.focus();
	        } else if (open) {
	          open.focus();
	        }
	      }
	    });

	    return this;
	  }
	}

	/** @type  {String}  Main DOM selector */
	Dropdown.selector = '[data-js*=\"dropdown\"]';

	/** @type  {Object}  Additional selectors used by the script */
	Dropdown.selectors = {
	  CLOSE: '[data-dropdown*="close"]',
	  OPEN: '[data-dropdown*="open"]',
	  LOCKS: '[data-dropdown-lock="true"]'
	};

	/** @type  {Object}  Data attribute namespaces */
	Dropdown.dataAttrs = {
	  LOCK: 'dropdownLock'
	};

	/** @type  {Object}  Various classes used by the script */
	Dropdown.classes = {
	  OVERFLOW: 'overflow-hidden'
	};

	/**
	 * The Mobile Nav module
	 *
	 * @class
	 */
	class Menu {
	  /**
	   * @constructor
	   *
	   * @return  {object}  The class
	   */
	  constructor() {
	    this.selector = Menu.selector;

	    this.selectors = Menu.selectors;

	    this.toggle = new Toggle({
	      selector: this.selector,
	      after: toggle => {
	        // Shift focus from the open to the close button in the Mobile Menu when toggled
	        if (toggle.target.classList.contains(Toggle.activeClass)) {
	          toggle.target.querySelector(this.selectors.CLOSE).focus();

	          // When the last focusable item in the list looses focus loop to the first
	          toggle.focusable.item(toggle.focusable.length - 1)
	            .addEventListener('blur', () => {
	              toggle.focusable.item(0).focus();
	            });
	        } else {
	          document.querySelector(this.selectors.OPEN).focus();
	        }
	      }
	    });

	    return this;
	  }
	}

	/** @type  {String}  The dom selector for the module */
	Menu.selector = '[data-js*="menu"]';

	/** @type  {Object}  Additional selectors used by the script */
	Menu.selectors = {
	  CLOSE: '[data-js-menu*="close"]',
	  OPEN: '[data-js-menu*="open"]'
	};

	/**
	 * The Icon module
	 * @class
	 */
	class Icons {
	  /**
	   * @constructor
	   * @param  {String} path The path of the icon file
	   * @return {object} The class
	   */
	  constructor(path) {
	    path = (path) ? path : Icons.path;

	    fetch(path)
	      .then((response) => {
	        if (response.ok)
	          return response.text();
	        else
	          // eslint-disable-next-line no-console
	          console.dir(response);
	      })
	      .catch((error) => {
	        // eslint-disable-next-line no-console
	        console.dir(error);
	      })
	      .then((data) => {
	        const sprite = document.createElement('div');
	        sprite.innerHTML = data;
	        sprite.setAttribute('aria-hidden', true);
	        sprite.setAttribute('style', 'display: none;');
	        document.body.appendChild(sprite);
	      });

	    return this;
	  }
	}

	/** @type {String} The path of the icon file */
	Icons.path = 'svg/icons.svg';

	/**
	 * Copy to Clipboard Helper
	 */
	class Copy {
	  /**
	   * Add event listeners
	   *
	   * @constructor
	   */
	  constructor() {
	    // Set attributes
	    this.selector = Copy.selector;

	    this.aria = Copy.aria;

	    this.notifyTimeout = Copy.notifyTimeout;

	    // Select the entire text when it's focused on
	    document.querySelectorAll(Copy.selectors.TARGETS).forEach(item => {
	      item.addEventListener('focus', () => this.select(item));
	      item.addEventListener('click', () => this.select(item));
	    });

	    // The main click event for the class
	    document.querySelector('body').addEventListener('click', event => {
	      if (!event.target.matches(this.selector))
	        return;

	      this.element = event.target;

	      this.element.setAttribute(this.aria, false);

	      this.target = this.element.dataset.copy;

	      if (this.copy(this.target)) {
	        this.element.setAttribute(this.aria, true);

	        clearTimeout(this.element['timeout']);

	        this.element['timeout'] = setTimeout(() => {
	          this.element.setAttribute(this.aria, false);
	        }, this.notifyTimeout);
	      }
	    });

	    return this;
	  }

	  /**
	   * The click event handler
	   *
	   * @param   {String}  target  Content of target data attribute
	   *
	   * @return  {Boolean}         Wether copy was successful or not
	   */
	  copy(target) {
	    let selector = Copy.selectors.TARGETS.replace(']', `="${target}"]`);

	    let input = document.querySelector(selector);

	    this.select(input);

	    if (navigator.clipboard && navigator.clipboard.writeText)
	      navigator.clipboard.writeText(input.value);
	    else if (document.execCommand)
	      document.execCommand('copy');
	    else
	      return false;

	    return true;
	  }

	  /**
	   * Handler for the text selection method
	   *
	   * @param   {Object}  input  The input with content to select
	   */
	  select(input) {
	    input.select();

	    input.setSelectionRange(0, 99999);
	  }
	}

	/** The main element selector */
	Copy.selector = '[data-js*="copy"]';

	/** Class selectors */
	Copy.selectors = {
	  TARGETS: '[data-copy-target]'
	};

	/** Button aria role to toggle */
	Copy.aria = 'aria-pressed';

	/** Timeout for the "Copied!" notification */
	Copy.notifyTimeout = 1500;

	/**
	 * Utilities for Form components
	 * @class
	 */
	class Forms {
	  /**
	   * The Form constructor
	   * @param  {Object} form The form DOM element
	   */
	  constructor(form = false) {
	    this.FORM = form;

	    this.strings = Forms.strings;

	    this.submit = Forms.submit;

	    this.classes = Forms.classes;

	    this.markup = Forms.markup;

	    this.selectors = Forms.selectors;

	    this.attrs = Forms.attrs;

	    this.FORM.setAttribute('novalidate', true);

	    return this;
	  }

	  /**
	   * Map toggled checkbox values to an input.
	   * @param  {Object} event The parent click event.
	   * @return {Element}      The target element.
	   */
	  joinValues(event) {
	    if (!event.target.matches('input[type="checkbox"]'))
	      return;

	    if (!event.target.closest('[data-js-join-values]'))
	      return;

	    let el = event.target.closest('[data-js-join-values]');
	    let target = document.querySelector(el.dataset.jsJoinValues);

	    target.value = Array.from(
	        el.querySelectorAll('input[type="checkbox"]')
	      )
	      .filter((e) => (e.value && e.checked))
	      .map((e) => e.value)
	      .join(', ');

	    return target;
	  }

	  /**
	   * A simple form validation class that uses native form validation. It will
	   * add appropriate form feedback for each input that is invalid and native
	   * localized browser messaging.
	   *
	   * See https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
	   * See https://caniuse.com/#feat=form-validation for support
	   *
	   * @param  {Event}         event The form submission event
	   * @return {Class/Boolean}       The form class or false if invalid
	   */
	  valid(event) {
	    let validity = event.target.checkValidity();
	    let elements = event.target.querySelectorAll(this.selectors.REQUIRED);

	    for (let i = 0; i < elements.length; i++) {
	      // Remove old messaging if it exists
	      let el = elements[i];

	      this.reset(el);

	      // If this input valid, skip messaging
	      if (el.validity.valid) continue;

	      this.highlight(el);
	    }

	    return (validity) ? this : validity;
	  }

	  /**
	   * Adds focus and blur events to inputs with required attributes
	   * @param   {object}  form  Passing a form is possible, otherwise it will use
	   *                          the form passed to the constructor.
	   * @return  {class}         The form class
	   */
	  watch(form = false) {
	    this.FORM = (form) ? form : this.FORM;

	    let elements = this.FORM.querySelectorAll(this.selectors.REQUIRED);

	    /** Watch Individual Inputs */
	    for (let i = 0; i < elements.length; i++) {
	      // Remove old messaging if it exists
	      let el = elements[i];

	      el.addEventListener('focus', () => {
	        this.reset(el);
	      });

	      el.addEventListener('blur', () => {
	        if (!el.validity.valid)
	          this.highlight(el);
	      });
	    }

	    /** Submit Event */
	    this.FORM.addEventListener('submit', (event) => {
	      event.preventDefault();

	      if (this.valid(event) === false)
	        return false;

	      this.submit(event);
	    });

	    return this;
	  }

	  /**
	   * Removes the validity message and classes from the message.
	   * @param   {object}  el  The input element
	   * @return  {class}       The form class
	   */
	  reset(el) {
	    let container = (this.selectors.ERROR_MESSAGE_PARENT)
	      ? el.closest(this.selectors.ERROR_MESSAGE_PARENT) : el.parentNode;

	    let message = container.querySelector('.' + this.classes.ERROR_MESSAGE);

	    // Remove old messaging if it exists
	    container.classList.remove(this.classes.ERROR_CONTAINER);
	    if (message) message.remove();

	    // Remove error class from the form
	    container.closest('form').classList.remove(this.classes.ERROR_CONTAINER);

	    // Remove dynamic attributes from the input
	    el.removeAttribute(this.attrs.ERROR_INPUT[0]);
	    el.removeAttribute(this.attrs.ERROR_LABEL);

	    return this;
	  }

	  /**
	   * Displays a validity message to the user. It will first use any localized
	   * string passed to the class for required fields missing input. If the
	   * input is filled in but doesn't match the required pattern, it will use
	   * a localized string set for the specific input type. If one isn't provided
	   * it will use the default browser provided message.
	   * @param   {object}  el  The invalid input element
	   * @return  {class}       The form class
	   */
	  highlight(el) {
	    let container = (this.selectors.ERROR_MESSAGE_PARENT)
	      ? el.closest(this.selectors.ERROR_MESSAGE_PARENT) : el.parentNode;

	    // Create the new error message.
	    let message = document.createElement(this.markup.ERROR_MESSAGE);
	    let id = `${el.getAttribute('id')}-${this.classes.ERROR_MESSAGE}`;

	    // Get the error message from localized strings (if set).
	    if (el.validity.valueMissing && this.strings.VALID_REQUIRED)
	      message.innerHTML = this.strings.VALID_REQUIRED;
	    else if (!el.validity.valid &&
	      this.strings[`VALID_${el.type.toUpperCase()}_INVALID`]) {
	      let stringKey = `VALID_${el.type.toUpperCase()}_INVALID`;
	      message.innerHTML = this.strings[stringKey];
	    } else
	      message.innerHTML = el.validationMessage;

	    // Set aria attributes and css classes to the message
	    message.setAttribute('id', id);
	    message.setAttribute(this.attrs.ERROR_MESSAGE[0],
	      this.attrs.ERROR_MESSAGE[1]);
	    message.classList.add(this.classes.ERROR_MESSAGE);

	    // Add the error class and error message to the dom.
	    container.classList.add(this.classes.ERROR_CONTAINER);
	    container.insertBefore(message, container.childNodes[0]);

	    // Add the error class to the form
	    container.closest('form').classList.add(this.classes.ERROR_CONTAINER);

	    // Add dynamic attributes to the input
	    el.setAttribute(this.attrs.ERROR_INPUT[0], this.attrs.ERROR_INPUT[1]);
	    el.setAttribute(this.attrs.ERROR_LABEL, id);

	    return this;
	  }
	}

	/**
	 * A dictionairy of strings in the format.
	 * {
	 *   'VALID_REQUIRED': 'This is required',
	 *   'VALID_{{ TYPE }}_INVALID': 'Invalid'
	 * }
	 */
	Forms.strings = {};

	/** Placeholder for the submit function */
	Forms.submit = function() {};

	/** Classes for various containers */
	Forms.classes = {
	  'ERROR_MESSAGE': 'error-message', // error class for the validity message
	  'ERROR_CONTAINER': 'error', // class for the validity message parent
	  'ERROR_FORM': 'error'
	};

	/** HTML tags and markup for various elements */
	Forms.markup = {
	  'ERROR_MESSAGE': 'div',
	};

	/** DOM Selectors for various elements */
	Forms.selectors = {
	  'REQUIRED': '[required="true"]', // Selector for required input elements
	  'ERROR_MESSAGE_PARENT': false
	};

	/** Attributes for various elements */
	Forms.attrs = {
	  'ERROR_MESSAGE': ['aria-live', 'polite'], // Attribute for valid error message
	  'ERROR_INPUT': ['aria-invalid', 'true'],
	  'ERROR_LABEL': 'aria-describedby'
	};

	var e=/^(?:submit|button|image|reset|file)$/i,t=/^(?:input|select|textarea|keygen)/i,n=/(\[[^\[\]]*\])/g;function a(e,t,a){if(t.match(n))!function e(t,n,a){if(0===n.length)return a;var r=n.shift(),i=r.match(/^\[(.+?)\]$/);if("[]"===r)return t=t||[],Array.isArray(t)?t.push(e(null,n,a)):(t._values=t._values||[],t._values.push(e(null,n,a))),t;if(i){var l=i[1],u=+l;isNaN(u)?(t=t||{})[l]=e(t[l],n,a):(t=t||[])[u]=e(t[u],n,a);}else t[r]=e(t[r],n,a);return t}(e,function(e){var t=[],a=new RegExp(n),r=/^([^\[\]]*)/.exec(e);for(r[1]&&t.push(r[1]);null!==(r=a.exec(e));)t.push(r[1]);return t}(t),a);else {var r=e[t];r?(Array.isArray(r)||(e[t]=[r]),e[t].push(a)):e[t]=a;}return e}function r(e,t,n){return n=(n=String(n)).replace(/(\r)?\n/g,"\r\n"),n=(n=encodeURIComponent(n)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+n}function serialize(n,i){"object"!=typeof i?i={hash:!!i}:void 0===i.hash&&(i.hash=!0);for(var l=i.hash?{}:"",u=i.serializer||(i.hash?a:r),s=n&&n.elements?n.elements:[],c=Object.create(null),o=0;o<s.length;++o){var h=s[o];if((i.disabled||!h.disabled)&&h.name&&t.test(h.nodeName)&&!e.test(h.type)){var p=h.name,f=h.value;if("checkbox"!==h.type&&"radio"!==h.type||h.checked||(f=void 0),i.empty){if("checkbox"!==h.type||h.checked||(f=!1),"radio"===h.type&&(c[h.name]||h.checked?h.checked&&(c[h.name]=!0):c[h.name]=!1),null==f&&"radio"==h.type)continue}else if(!f)continue;if("select-multiple"!==h.type)l=u(l,p,f);else {f=[];for(var v=h.options,m=!1,d=0;d<v.length;++d){var y=v[d];y.selected&&(y.value||i.empty&&!y.value)&&(m=!0,l=i.hash&&"[]"!==p.slice(p.length-2)?u(l,p+"[]",y.value):u(l,p,y.value));}!m&&i.empty&&(l=u(l,p,""));}}}if(i.empty)for(var p in c)c[p]||(l=u(l,p,""));return l}

	/**
	 * @class  The Newsletter module
	 */
	class Newsletter {
	  /**
	   * @constructor
	   *
	   * @param   {Object}  element  The Newsletter DOM Object
	   *
	   * @return  {Class}            The instantiated Newsletter object
	   */
	  constructor(element) {
	    this._el = element;

	    this.keys = Newsletter.keys;

	    this.endpoints = Newsletter.endpoints;

	    this.selectors = Newsletter.selectors;

	    this.selector = Newsletter.selector;

	    this.stringKeys = Newsletter.stringKeys;

	    this.strings = Newsletter.strings;

	    this.templates = Newsletter.templates;

	    this.classes = Newsletter.classes;

	    this.callback = [
	      Newsletter.callback,
	      Math.random().toString().replace('0.', '')
	    ].join('');

	    // This sets the script callback function to a global function that
	    // can be accessed by the the requested script.
	    window[this.callback] = (data) => {
	      this._callback(data);
	    };

	    this.form = new Forms(this._el.querySelector('form'));

	    this.form.strings = this.strings;

	    this.form.submit = (event) => {
	      event.preventDefault();

	      this._submit(event)
	        .then(this._onload)
	        .catch(this._onerror);
	    };

	    this.form.watch();

	    return this;
	  }

	  /**
	   * The form submission method. Requests a script with a callback function
	   * to be executed on our page. The callback function will be passed the
	   * response as a JSON object (function parameter).
	   *
	   * @param   {Event}    event  The form submission event
	   *
	   * @return  {Promise}         A promise containing the new script call
	   */
	  _submit(event) {
	    event.preventDefault();

	    // Serialize the data
	    this._data = serialize(event.target, {hash: true});

	    // Switch the action to post-json. This creates an endpoint for mailchimp
	    // that acts as a script that can be loaded onto our page.
	    let action = event.target.action.replace(
	      `${this.endpoints.MAIN}?`, `${this.endpoints.MAIN_JSON}?`
	    );

	    // Add our params to the action
	    action = action + serialize(event.target, {serializer: (...params) => {
	      let prev = (typeof params[0] === 'string') ? params[0] : '';

	      return `${prev}&${params[1]}=${params[2]}`;
	    }});

	    // Append the callback reference. Mailchimp will wrap the JSON response in
	    // our callback method. Once we load the script the callback will execute.
	    action = `${action}&c=window.${this.callback}`;

	    // Create a promise that appends the script response of the post-json method
	    return new Promise((resolve, reject) => {
	      const script = document.createElement('script');

	      document.body.appendChild(script);
	      script.onload = resolve;
	      script.onerror = reject;
	      script.async = true;
	      script.src = encodeURI(action);
	    });
	  }

	  /**
	   * The script onload resolution
	   *
	   * @param   {Event}  event  The script on load event
	   *
	   * @return  {Class}         The Newsletter class
	   */
	  _onload(event) {
	    event.path[0].remove();

	    return this;
	  }

	  /**
	   * The script on error resolution
	   *
	   * @param   {Object}  error  The script on error load event
	   *
	   * @return  {Class}          The Newsletter class
	   */
	  _onerror(error) {
	    // eslint-disable-next-line no-console
	    console.dir(error);

	    return this;
	  }

	  /**
	   * The callback function for the MailChimp Script call
	   *
	   * @param   {Object}  data  The success/error message from MailChimp
	   *
	   * @return  {Class}        The Newsletter class
	   */
	  _callback(data) {
	    if (this[`_${data[this._key('MC_RESULT')]}`]) {
	      this[`_${data[this._key('MC_RESULT')]}`](data.msg);
	    } else {
	      // eslint-disable-next-line no-console
	      console.dir(data);
	    }

	    return this;
	  }

	  /**
	   * Submission error handler
	   *
	   * @param   {string}  msg  The error message
	   *
	   * @return  {Class}        The Newsletter class
	   */
	  _error(msg) {
	    this._elementsReset();
	    this._messaging('WARNING', msg);

	    return this;
	  }

	  /**
	   * Submission success handler
	   *
	   * @param   {string}  msg  The success message
	   *
	   * @return  {Class}        The Newsletter class
	   */
	  _success(msg) {
	    this._elementsReset();
	    this._messaging('SUCCESS', msg);

	    return this;
	  }

	  /**
	   * Present the response message to the user
	   *
	   * @param   {String}  type  The message type
	   * @param   {String}  msg   The message
	   *
	   * @return  {Class}         Newsletter
	   */
	  _messaging(type, msg = 'no message') {
	    let strings = Object.keys(this.stringKeys);
	    let handled = false;

	    let alertBox = this._el.querySelector(this.selectors[type]);

	    let alertBoxMsg = alertBox.querySelector(
	      this.selectors.ALERT_TEXT
	    );

	    // Get the localized string, these should be written to the DOM already.
	    // The utility contains a global method for retrieving them.
	    let stringKeys = strings.filter(s => msg.includes(this.stringKeys[s]));
	    msg = (stringKeys.length) ? this.strings[stringKeys[0]] : msg;
	    handled = (stringKeys.length) ? true : false;

	    // Replace string templates with values from either our form data or
	    // the Newsletter strings object.
	    for (let x = 0; x < this.templates.length; x++) {
	      let template = this.templates[x];
	      let key = template.replace('{{ ', '').replace(' }}', '');
	      let value = this._data[key] || this.strings[key];
	      let reg = new RegExp(template, 'gi');

	      msg = msg.replace(reg, (value) ? value : '');
	    }

	    if (handled) {
	      alertBoxMsg.innerHTML = msg;
	    } else if (type === 'ERROR') {
	      alertBoxMsg.innerHTML = this.strings.ERR_PLEASE_TRY_LATER;
	    }

	    if (alertBox) this._elementShow(alertBox, alertBoxMsg);

	    return this;
	  }

	  /**
	   * The main toggling method
	   *
	   * @return  {Class}  Newsletter
	   */
	  _elementsReset() {
	    let targets = this._el.querySelectorAll(this.selectors.ALERTS);

	    for (let i = 0; i < targets.length; i++)
	      if (!targets[i].classList.contains(this.classes.HIDDEN)) {
	        targets[i].classList.add(this.classes.HIDDEN);

	        this.classes.ANIMATE.split(' ').forEach((item) =>
	          targets[i].classList.remove(item)
	        );

	        // Screen Readers
	        targets[i].setAttribute('aria-hidden', 'true');
	        targets[i].querySelector(this.selectors.ALERT_TEXT)
	          .setAttribute('aria-live', 'off');
	      }

	    return this;
	  }

	  /**
	   * The main toggling method
	   *
	   * @param   {object}  target   Message container
	   * @param   {object}  content  Content that changes dynamically that should
	   *                             be announced to screen readers.
	   *
	   * @return  {Class}            Newsletter
	   */
	  _elementShow(target, content) {
	    target.classList.toggle(this.classes.HIDDEN);

	    this.classes.ANIMATE.split(' ').forEach((item) =>
	      target.classList.toggle(item)
	    );

	    // Screen Readers
	    target.setAttribute('aria-hidden', 'true');

	    if (content) {
	      content.setAttribute('aria-live', 'polite');
	    }

	    return this;
	  }

	  /**
	   * A proxy function for retrieving the proper key
	   *
	   * @param   {string}  key  The reference for the stored keys.
	   *
	   * @return  {string}       The desired key.
	   */
	  _key(key) {
	    return this.keys[key];
	  }
	}

	/** @type  {Object}  API data keys */
	Newsletter.keys = {
	  MC_RESULT: 'result',
	  MC_MSG: 'msg'
	};

	/** @type  {Object}  API endpoints */
	Newsletter.endpoints = {
	  MAIN: '/post',
	  MAIN_JSON: '/post-json'
	};

	/** @type  {String}  The Mailchimp callback reference. */
	Newsletter.callback = 'NewsletterCallback';

	/** @type  {Object}  DOM selectors for the instance's concerns */
	Newsletter.selectors = {
	  ELEMENT: '[data-js="newsletter"]',
	  ALERTS: '[data-js*="alert"]',
	  WARNING: '[data-js="alert-warning"]',
	  SUCCESS: '[data-js="alert-success"]',
	  ALERT_TEXT: '[data-js-alert="text"]'
	};

	/** @type  {String}  The main DOM selector for the instance */
	Newsletter.selector = Newsletter.selectors.ELEMENT;

	/** @type  {Object}  String references for the instance */
	Newsletter.stringKeys = {
	  SUCCESS_CONFIRM_EMAIL: 'Almost finished...',
	  ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
	  ERR_TOO_MANY_RECENT: 'too many',
	  ERR_ALREADY_SUBSCRIBED: 'is already subscribed',
	  ERR_INVALID_EMAIL: 'looks fake or invalid'
	};

	/** @type  {Object}  Available strings */
	Newsletter.strings = {
	  VALID_REQUIRED: 'This field is required.',
	  VALID_EMAIL_REQUIRED: 'Email is required.',
	  VALID_EMAIL_INVALID: 'Please enter a valid email.',
	  VALID_CHECKBOX_BOROUGH: 'Please select a borough.',
	  ERR_PLEASE_TRY_LATER: 'There was an error with your submission. ' +
	                        'Please try again later.',
	  SUCCESS_CONFIRM_EMAIL: 'Almost finished... We need to confirm your email ' +
	                         'address. To complete the subscription process, ' +
	                         'please click the link in the email we just sent you.',
	  ERR_PLEASE_ENTER_VALUE: 'Please enter a value',
	  ERR_TOO_MANY_RECENT: 'Recipient "{{ EMAIL }}" has too ' +
	                       'many recent signup requests',
	  ERR_ALREADY_SUBSCRIBED: '{{ EMAIL }} is already subscribed ' +
	                          'to list {{ LIST_NAME }}.',
	  ERR_INVALID_EMAIL: 'This email address looks fake or invalid. ' +
	                     'Please enter a real email address.',
	  LIST_NAME: 'Newsletter'
	};

	/** @type  {Array}  Placeholders that will be replaced in message strings */
	Newsletter.templates = [
	  '{{ EMAIL }}',
	  '{{ LIST_NAME }}'
	];

	Newsletter.classes = {
	  ANIMATE: 'animated fadeInUp',
	  HIDDEN: 'hidden'
	};

	/**
	 * Tracking bus for Google analytics and Webtrends.
	 */
	class Track {
	  constructor(s) {
	    const body = document.querySelector('body');

	    s = (!s) ? {} : s;

	    this._settings = {
	      selector: (s.selector) ? s.selector : Track.selector,
	    };

	    this.desinations = Track.destinations;

	    body.addEventListener('click', (event) => {
	      if (!event.target.matches(this._settings.selector))
	        return;

	      let key = event.target.dataset.trackKey;
	      let data = JSON.parse(event.target.dataset.trackData);

	      this.track(key, data);
	    });

	    return this;
	  }

	  /**
	   * Tracking function wrapper
	   *
	   * @param  {String}      key   The key or event of the data
	   * @param  {Collection}  data  The data to track
	   *
	   * @return {Object}            The final data object
	   */
	  track(key, data) {
	    // Set the path name based on the location
	    const d = data.map(el => {
	        if (el.hasOwnProperty(Track.key))
	          el[Track.key] = `${window.location.pathname}/${el[Track.key]}`;
	        return el;
	      });

	    let wt = this.webtrends(key, d);
	    let ga = this.gtag(key, d);

	    /* eslint-disable no-console */
	    console.dir({'Track': [wt, ga]});
	    /* eslint-enable no-console */

	    return d;
	  };

	  /**
	   * Data bus for tracking views in Webtrends and Google Analytics
	   *
	   * @param  {String}      app   The name of the Single Page Application to track
	   * @param  {String}      key   The key or event of the data
	   * @param  {Collection}  data  The data to track
	   */
	  view(app, key, data) {
	    let wt = this.webtrends(key, data);
	    let ga = this.gtagView(app, key);

	    /* eslint-disable no-console */
	    console.dir({'Track': [wt, ga]});
	    /* eslint-enable no-console */
	  };

	  /**
	   * Push Events to Webtrends
	   *
	   * @param  {String}      key   The key or event of the data
	   * @param  {Collection}  data  The data to track
	   */
	  webtrends(key, data) {
	    if (
	      typeof Webtrends === 'undefined' ||
	      typeof data === 'undefined' ||
	      !this.desinations.includes('webtrends')
	    )
	      return false;

	    let event = [{
	      'WT.ti': key
	    }];

	    if (data[0] && data[0].hasOwnProperty(Track.key))
	      event.push({
	        'DCS.dcsuri': data[0][Track.key]
	      });
	    else
	      Object.assign(event, data);

	    // Format data for Webtrends
	    let wtd = {argsa: event.flatMap(e => {
	      return Object.keys(e).flatMap(k => [k, e[k]]);
	    })};

	    // If 'action' is used as the key (for gtag.js), switch it to Webtrends
	    let action = data.argsa.indexOf('action');

	    if (action) data.argsa[action] = 'DCS.dcsuri';

	    // Webtrends doesn't send the page view for MultiTrack, add path to url
	    let dcsuri = data.argsa.indexOf('DCS.dcsuri');

	    if (dcsuri)
	      data.argsa[dcsuri + 1] = window.location.pathname + data.argsa[dcsuri + 1];

	    /* eslint-disable no-undef */
	    if (typeof Webtrends !== 'undefined')
	      Webtrends.multiTrack(wtd);
	    /* eslint-disable no-undef */

	    return ['Webtrends', wtd];
	  };

	  /**
	   * Push Click Events to Google Analytics
	   *
	   * @param  {String}      key   The key or event of the data
	   * @param  {Collection}  data  The data to track
	   */
	  gtag(key, data) {
	    if (
	      typeof gtag === 'undefined' ||
	      typeof data === 'undefined' ||
	      !this.desinations.includes('gtag')
	    )
	      return false;

	    let uri = data.find((element) => element.hasOwnProperty(Track.key));

	    let event = {
	      'event_category': key
	    };

	    /* eslint-disable no-undef */
	    gtag(Track.key, uri[Track.key], event);
	    /* eslint-enable no-undef */

	    return ['gtag', Track.key, uri[Track.key], event];
	  };

	  /**
	   * Push Screen View Events to Google Analytics
	   *
	   * @param  {String}  app  The name of the application
	   * @param  {String}  key  The key or event of the data
	   */
	  gtagView(app, key) {
	    if (
	      typeof gtag === 'undefined' ||
	      typeof data === 'undefined' ||
	      !this.desinations.includes('gtag')
	    )
	      return false;

	    let view = {
	      app_name: app,
	      screen_name: key
	    };

	    /* eslint-disable no-undef */
	    gtag('event', 'screen_view', view);
	    /* eslint-enable no-undef */

	    return ['gtag', Track.key, 'screen_view', view];
	  };
	}

	/** @type {String} The main selector to add the tracking function to */
	Track.selector = '[data-js*="track"]';

	/** @type {String} The main event tracking key to map to Webtrends DCS.uri */
	Track.key = 'event';

	/** @type {Array} What destinations to push data to */
	Track.destinations = [
	  'webtrends',
	  'gtag'
	];

	/**
	 * A wrapper around the navigator.share() API
	 */
	class WebShare {
	  /**
	   * @constructor
	   */
	  constructor(s = {}) {
	    this.selector = (s.selector) ? s.selector : WebShare.selector;

	    this.callback = (s.callback) ? s.callback : WebShare.callback;

	    this.fallback = (s.fallback) ? s.fallback : WebShare.fallback;

	    if (navigator.share) {
	      // Remove fallback aria toggling attributes
	      document.querySelectorAll(this.selector).forEach(item => {
	        item.removeAttribute('aria-controls');
	        item.removeAttribute('aria-expanded');
	      });

	      // Add event listener for the share click
	      document.querySelector('body').addEventListener('click', event => {
	        if (!event.target.matches(this.selector))
	          return;

	        this.element = event.target;

	        this.data = JSON.parse(this.element.dataset.webShare);

	        this.share(this.data);
	      });
	    } else
	      this.fallback(); // Execute the fallback

	    return this;
	  }

	  /**
	   * Web Share API handler
	   *
	   * @param   {Object}  data  An object containing title, url, and text.
	   *
	   * @return  {Promise}       The response of the .share() method.
	   */
	  share(data = {}) {
	    return navigator.share(data)
	      .then(res => {
	        this.callback(data);
	      }).catch(err => {
	        console.dir(err);
	      });
	  }
	}

	/** The html selector for the component */
	WebShare.selector = '[data-js*="web-share"]';

	/** Placeholder callback for a successful send */
	WebShare.callback = () => {
	  console.dir('Success!');
	};

	/** Placeholder for the WebShare fallback */
	WebShare.fallback = () => {
	  console.dir('Fallback!');
	};

	/**
	 * @class  Set the the css variable '--100vh' to the size of the Window's inner height.
	 */
	class WindowVh {
	  /**
	   * @constructor  Set event listeners
	   */
	  constructor(s = {}) {
	    this.property = (s.property) ? s.property : WindowVh.property;

	    window.addEventListener('load', () => {this.set();});

	    window.addEventListener('resize', () => {this.set();});

	    return this;
	  }

	  /**
	   * Sets the css variable property
	   */
	  set() {
	    document.documentElement.style
	      .setProperty(this.property, `${window.innerHeight}px`);
	  }
	}

	/** @param  {String}  property  The css variable string to set */
	WindowVh.property = '--100vh';

	/**
	 * A wrapper around Intersection Observer class
	 */
	class Observe {
	  constructor(s) {
	    this.options = (s.options) ? Object.assign(Observe.options, s.options) : Observe.options;

	    this.trigger = (s.trigger) ? s.trigger : Observe.trigger;

	    // Instantiate the Intersection Observer
	    this.observer = new IntersectionObserver((entries, observer) => {
	      this.callback(entries, observer);
	    }, this.options);

	    // Select all of the items to observe
	    this.items = s.element.querySelectorAll(`[data-js-observe-item="${s.element.dataset.jsObserveItems}"]`);

	    for (let i = 0; i < this.items.length; i++) {
	      const item = this.items[i];

	      this.observer.observe(item);
	    }
	  }

	  callback(entries, observer) {
	    let prevEntry = entries[0];

	    for (let i = 0; i < entries.length; i++) {
	      const entry = entries[i];

	      this.trigger(entry, prevEntry, observer);

	      prevEntry = entry;
	    }
	  }
	}

	Observe.options = {
	  root: null,
	  rootMargin: '0px',
	  threshold: [0.15]
	};

	Observe.trigger = entry => {
	  console.dir(entry);
	  console.dir('Observed! Create a entry trigger function and pass it to the instantiated Observe settings object.');
	};

	Observe.selector = '[data-js*="observe"]';

	var vue_common = {exports: {}};

	/*!
	 * Vue.js v2.6.11
	 * (c) 2014-2019 Evan You
	 * Released under the MIT License.
	 */

	/*  */

	var emptyObject = Object.freeze({});

	// These helpers produce better VM code in JS engines due to their
	// explicitness and function inlining.
	function isUndef (v) {
	  return v === undefined || v === null
	}

	function isDef (v) {
	  return v !== undefined && v !== null
	}

	function isTrue (v) {
	  return v === true
	}

	function isFalse (v) {
	  return v === false
	}

	/**
	 * Check if value is primitive.
	 */
	function isPrimitive (value) {
	  return (
	    typeof value === 'string' ||
	    typeof value === 'number' ||
	    // $flow-disable-line
	    typeof value === 'symbol' ||
	    typeof value === 'boolean'
	  )
	}

	/**
	 * Quick object check - this is primarily used to tell
	 * Objects from primitive values when we know the value
	 * is a JSON-compliant type.
	 */
	function isObject (obj) {
	  return obj !== null && typeof obj === 'object'
	}

	/**
	 * Get the raw type string of a value, e.g., [object Object].
	 */
	var _toString = Object.prototype.toString;

	function toRawType (value) {
	  return _toString.call(value).slice(8, -1)
	}

	/**
	 * Strict object type check. Only returns true
	 * for plain JavaScript objects.
	 */
	function isPlainObject (obj) {
	  return _toString.call(obj) === '[object Object]'
	}

	function isRegExp (v) {
	  return _toString.call(v) === '[object RegExp]'
	}

	/**
	 * Check if val is a valid array index.
	 */
	function isValidArrayIndex (val) {
	  var n = parseFloat(String(val));
	  return n >= 0 && Math.floor(n) === n && isFinite(val)
	}

	function isPromise (val) {
	  return (
	    isDef(val) &&
	    typeof val.then === 'function' &&
	    typeof val.catch === 'function'
	  )
	}

	/**
	 * Convert a value to a string that is actually rendered.
	 */
	function toString (val) {
	  return val == null
	    ? ''
	    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
	      ? JSON.stringify(val, null, 2)
	      : String(val)
	}

	/**
	 * Convert an input value to a number for persistence.
	 * If the conversion fails, return original string.
	 */
	function toNumber (val) {
	  var n = parseFloat(val);
	  return isNaN(n) ? val : n
	}

	/**
	 * Make a map and return a function for checking if a key
	 * is in that map.
	 */
	function makeMap (
	  str,
	  expectsLowerCase
	) {
	  var map = Object.create(null);
	  var list = str.split(',');
	  for (var i = 0; i < list.length; i++) {
	    map[list[i]] = true;
	  }
	  return expectsLowerCase
	    ? function (val) { return map[val.toLowerCase()]; }
	    : function (val) { return map[val]; }
	}

	/**
	 * Check if a tag is a built-in tag.
	 */
	var isBuiltInTag = makeMap('slot,component', true);

	/**
	 * Check if an attribute is a reserved attribute.
	 */
	var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

	/**
	 * Remove an item from an array.
	 */
	function remove (arr, item) {
	  if (arr.length) {
	    var index = arr.indexOf(item);
	    if (index > -1) {
	      return arr.splice(index, 1)
	    }
	  }
	}

	/**
	 * Check whether an object has the property.
	 */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn (obj, key) {
	  return hasOwnProperty.call(obj, key)
	}

	/**
	 * Create a cached version of a pure function.
	 */
	function cached (fn) {
	  var cache = Object.create(null);
	  return (function cachedFn (str) {
	    var hit = cache[str];
	    return hit || (cache[str] = fn(str))
	  })
	}

	/**
	 * Camelize a hyphen-delimited string.
	 */
	var camelizeRE = /-(\w)/g;
	var camelize = cached(function (str) {
	  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
	});

	/**
	 * Capitalize a string.
	 */
	var capitalize = cached(function (str) {
	  return str.charAt(0).toUpperCase() + str.slice(1)
	});

	/**
	 * Hyphenate a camelCase string.
	 */
	var hyphenateRE = /\B([A-Z])/g;
	var hyphenate = cached(function (str) {
	  return str.replace(hyphenateRE, '-$1').toLowerCase()
	});

	/**
	 * Simple bind polyfill for environments that do not support it,
	 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
	 * since native bind is now performant enough in most browsers.
	 * But removing it would mean breaking code that was able to run in
	 * PhantomJS 1.x, so this must be kept for backward compatibility.
	 */

	/* istanbul ignore next */
	function polyfillBind (fn, ctx) {
	  function boundFn (a) {
	    var l = arguments.length;
	    return l
	      ? l > 1
	        ? fn.apply(ctx, arguments)
	        : fn.call(ctx, a)
	      : fn.call(ctx)
	  }

	  boundFn._length = fn.length;
	  return boundFn
	}

	function nativeBind (fn, ctx) {
	  return fn.bind(ctx)
	}

	var bind = Function.prototype.bind
	  ? nativeBind
	  : polyfillBind;

	/**
	 * Convert an Array-like object to a real Array.
	 */
	function toArray (list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret
	}

	/**
	 * Mix properties into target object.
	 */
	function extend$1 (to, _from) {
	  for (var key in _from) {
	    to[key] = _from[key];
	  }
	  return to
	}

	/**
	 * Merge an Array of Objects into a single Object.
	 */
	function toObject (arr) {
	  var res = {};
	  for (var i = 0; i < arr.length; i++) {
	    if (arr[i]) {
	      extend$1(res, arr[i]);
	    }
	  }
	  return res
	}

	/* eslint-disable no-unused-vars */

	/**
	 * Perform no operation.
	 * Stubbing args to make Flow happy without leaving useless transpiled code
	 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
	 */
	function noop$1 (a, b, c) {}

	/**
	 * Always return false.
	 */
	var no = function (a, b, c) { return false; };

	/* eslint-enable no-unused-vars */

	/**
	 * Return the same value.
	 */
	var identity = function (_) { return _; };

	/**
	 * Generate a string containing static keys from compiler modules.
	 */
	function genStaticKeys (modules) {
	  return modules.reduce(function (keys, m) {
	    return keys.concat(m.staticKeys || [])
	  }, []).join(',')
	}

	/**
	 * Check if two values are loosely equal - that is,
	 * if they are plain objects, do they have the same shape?
	 */
	function looseEqual (a, b) {
	  if (a === b) { return true }
	  var isObjectA = isObject(a);
	  var isObjectB = isObject(b);
	  if (isObjectA && isObjectB) {
	    try {
	      var isArrayA = Array.isArray(a);
	      var isArrayB = Array.isArray(b);
	      if (isArrayA && isArrayB) {
	        return a.length === b.length && a.every(function (e, i) {
	          return looseEqual(e, b[i])
	        })
	      } else if (a instanceof Date && b instanceof Date) {
	        return a.getTime() === b.getTime()
	      } else if (!isArrayA && !isArrayB) {
	        var keysA = Object.keys(a);
	        var keysB = Object.keys(b);
	        return keysA.length === keysB.length && keysA.every(function (key) {
	          return looseEqual(a[key], b[key])
	        })
	      } else {
	        /* istanbul ignore next */
	        return false
	      }
	    } catch (e) {
	      /* istanbul ignore next */
	      return false
	    }
	  } else if (!isObjectA && !isObjectB) {
	    return String(a) === String(b)
	  } else {
	    return false
	  }
	}

	/**
	 * Return the first index at which a loosely equal value can be
	 * found in the array (if value is a plain object, the array must
	 * contain an object of the same shape), or -1 if it is not present.
	 */
	function looseIndexOf (arr, val) {
	  for (var i = 0; i < arr.length; i++) {
	    if (looseEqual(arr[i], val)) { return i }
	  }
	  return -1
	}

	/**
	 * Ensure a function is called only once.
	 */
	function once$1 (fn) {
	  var called = false;
	  return function () {
	    if (!called) {
	      called = true;
	      fn.apply(this, arguments);
	    }
	  }
	}

	var SSR_ATTR = 'data-server-rendered';

	var ASSET_TYPES = [
	  'component',
	  'directive',
	  'filter'
	];

	var LIFECYCLE_HOOKS = [
	  'beforeCreate',
	  'created',
	  'beforeMount',
	  'mounted',
	  'beforeUpdate',
	  'updated',
	  'beforeDestroy',
	  'destroyed',
	  'activated',
	  'deactivated',
	  'errorCaptured',
	  'serverPrefetch'
	];

	/*  */



	var config = ({
	  /**
	   * Option merge strategies (used in core/util/options)
	   */
	  // $flow-disable-line
	  optionMergeStrategies: Object.create(null),

	  /**
	   * Whether to suppress warnings.
	   */
	  silent: false,

	  /**
	   * Show production mode tip message on boot?
	   */
	  productionTip: "development" !== 'production',

	  /**
	   * Whether to enable devtools
	   */
	  devtools: "development" !== 'production',

	  /**
	   * Whether to record perf
	   */
	  performance: false,

	  /**
	   * Error handler for watcher errors
	   */
	  errorHandler: null,

	  /**
	   * Warn handler for watcher warns
	   */
	  warnHandler: null,

	  /**
	   * Ignore certain custom elements
	   */
	  ignoredElements: [],

	  /**
	   * Custom user key aliases for v-on
	   */
	  // $flow-disable-line
	  keyCodes: Object.create(null),

	  /**
	   * Check if a tag is reserved so that it cannot be registered as a
	   * component. This is platform-dependent and may be overwritten.
	   */
	  isReservedTag: no,

	  /**
	   * Check if an attribute is reserved so that it cannot be used as a component
	   * prop. This is platform-dependent and may be overwritten.
	   */
	  isReservedAttr: no,

	  /**
	   * Check if a tag is an unknown element.
	   * Platform-dependent.
	   */
	  isUnknownElement: no,

	  /**
	   * Get the namespace of an element
	   */
	  getTagNamespace: noop$1,

	  /**
	   * Parse the real tag name for the specific platform.
	   */
	  parsePlatformTagName: identity,

	  /**
	   * Check if an attribute must be bound using property, e.g. value
	   * Platform-dependent.
	   */
	  mustUseProp: no,

	  /**
	   * Perform updates asynchronously. Intended to be used by Vue Test Utils
	   * This will significantly reduce performance if set to false.
	   */
	  async: true,

	  /**
	   * Exposed for legacy reasons
	   */
	  _lifecycleHooks: LIFECYCLE_HOOKS
	});

	/*  */

	/**
	 * unicode letters used for parsing html tags, component names and property paths.
	 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
	 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
	 */
	var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

	/**
	 * Check if a string starts with $ or _
	 */
	function isReserved (str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F
	}

	/**
	 * Define a property.
	 */
	function def (obj, key, val, enumerable) {
	  Object.defineProperty(obj, key, {
	    value: val,
	    enumerable: !!enumerable,
	    writable: true,
	    configurable: true
	  });
	}

	/**
	 * Parse simple path.
	 */
	var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
	function parsePath$1 (path) {
	  if (bailRE.test(path)) {
	    return
	  }
	  var segments = path.split('.');
	  return function (obj) {
	    for (var i = 0; i < segments.length; i++) {
	      if (!obj) { return }
	      obj = obj[segments[i]];
	    }
	    return obj
	  }
	}

	/*  */

	// can we use __proto__?
	var hasProto = '__proto__' in {};

	// Browser environment sniffing
	var inBrowser$1 = typeof window !== 'undefined';
	var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
	var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
	var UA = inBrowser$1 && window.navigator.userAgent.toLowerCase();
	var isIE = UA && /msie|trident/.test(UA);
	var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isEdge = UA && UA.indexOf('edge/') > 0;
	(UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
	var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
	UA && /chrome\/\d+/.test(UA) && !isEdge;
	UA && /phantomjs/.test(UA);
	var isFF = UA && UA.match(/firefox\/(\d+)/);

	// Firefox has a "watch" function on Object.prototype...
	var nativeWatch = ({}).watch;

	var supportsPassive = false;
	if (inBrowser$1) {
	  try {
	    var opts = {};
	    Object.defineProperty(opts, 'passive', ({
	      get: function get () {
	        /* istanbul ignore next */
	        supportsPassive = true;
	      }
	    })); // https://github.com/facebook/flow/issues/285
	    window.addEventListener('test-passive', null, opts);
	  } catch (e) {}
	}

	// this needs to be lazy-evaled because vue may be required before
	// vue-server-renderer can set VUE_ENV
	var _isServer;
	var isServerRendering = function () {
	  if (_isServer === undefined) {
	    /* istanbul ignore if */
	    if (!inBrowser$1 && !inWeex && typeof commonjsGlobal !== 'undefined') {
	      // detect presence of vue-server-renderer and avoid
	      // Webpack shimming the process
	      _isServer = commonjsGlobal['process'] && commonjsGlobal['process'].env.VUE_ENV === 'server';
	    } else {
	      _isServer = false;
	    }
	  }
	  return _isServer
	};

	// detect devtools
	var devtools = inBrowser$1 && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

	/* istanbul ignore next */
	function isNative (Ctor) {
	  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
	}

	var hasSymbol$1 =
	  typeof Symbol !== 'undefined' && isNative(Symbol) &&
	  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

	var _Set;
	/* istanbul ignore if */ // $flow-disable-line
	if (typeof Set !== 'undefined' && isNative(Set)) {
	  // use native Set when available.
	  _Set = Set;
	} else {
	  // a non-standard Set polyfill that only works with primitive keys.
	  _Set = /*@__PURE__*/(function () {
	    function Set () {
	      this.set = Object.create(null);
	    }
	    Set.prototype.has = function has (key) {
	      return this.set[key] === true
	    };
	    Set.prototype.add = function add (key) {
	      this.set[key] = true;
	    };
	    Set.prototype.clear = function clear () {
	      this.set = Object.create(null);
	    };

	    return Set;
	  }());
	}

	/*  */

	var warn$1 = noop$1;
	var tip = noop$1;
	var generateComponentTrace = (noop$1); // work around flow check
	var formatComponentName = (noop$1);

	{
	  var hasConsole = typeof console !== 'undefined';
	  var classifyRE = /(?:^|[-_])(\w)/g;
	  var classify = function (str) { return str
	    .replace(classifyRE, function (c) { return c.toUpperCase(); })
	    .replace(/[-_]/g, ''); };

	  warn$1 = function (msg, vm) {
	    var trace = vm ? generateComponentTrace(vm) : '';

	    if (config.warnHandler) {
	      config.warnHandler.call(null, msg, vm, trace);
	    } else if (hasConsole && (!config.silent)) {
	      console.error(("[Vue warn]: " + msg + trace));
	    }
	  };

	  tip = function (msg, vm) {
	    if (hasConsole && (!config.silent)) {
	      console.warn("[Vue tip]: " + msg + (
	        vm ? generateComponentTrace(vm) : ''
	      ));
	    }
	  };

	  formatComponentName = function (vm, includeFile) {
	    if (vm.$root === vm) {
	      return '<Root>'
	    }
	    var options = typeof vm === 'function' && vm.cid != null
	      ? vm.options
	      : vm._isVue
	        ? vm.$options || vm.constructor.options
	        : vm;
	    var name = options.name || options._componentTag;
	    var file = options.__file;
	    if (!name && file) {
	      var match = file.match(/([^/\\]+)\.vue$/);
	      name = match && match[1];
	    }

	    return (
	      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
	      (file && includeFile !== false ? (" at " + file) : '')
	    )
	  };

	  var repeat = function (str, n) {
	    var res = '';
	    while (n) {
	      if (n % 2 === 1) { res += str; }
	      if (n > 1) { str += str; }
	      n >>= 1;
	    }
	    return res
	  };

	  generateComponentTrace = function (vm) {
	    if (vm._isVue && vm.$parent) {
	      var tree = [];
	      var currentRecursiveSequence = 0;
	      while (vm) {
	        if (tree.length > 0) {
	          var last = tree[tree.length - 1];
	          if (last.constructor === vm.constructor) {
	            currentRecursiveSequence++;
	            vm = vm.$parent;
	            continue
	          } else if (currentRecursiveSequence > 0) {
	            tree[tree.length - 1] = [last, currentRecursiveSequence];
	            currentRecursiveSequence = 0;
	          }
	        }
	        tree.push(vm);
	        vm = vm.$parent;
	      }
	      return '\n\nfound in\n\n' + tree
	        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
	            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
	            : formatComponentName(vm))); })
	        .join('\n')
	    } else {
	      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
	    }
	  };
	}

	/*  */

	var uid = 0;

	/**
	 * A dep is an observable that can have multiple
	 * directives subscribing to it.
	 */
	var Dep = function Dep () {
	  this.id = uid++;
	  this.subs = [];
	};

	Dep.prototype.addSub = function addSub (sub) {
	  this.subs.push(sub);
	};

	Dep.prototype.removeSub = function removeSub (sub) {
	  remove(this.subs, sub);
	};

	Dep.prototype.depend = function depend () {
	  if (Dep.target) {
	    Dep.target.addDep(this);
	  }
	};

	Dep.prototype.notify = function notify () {
	  // stabilize the subscriber list first
	  var subs = this.subs.slice();
	  if (!config.async) {
	    // subs aren't sorted in scheduler if not running async
	    // we need to sort them now to make sure they fire in correct
	    // order
	    subs.sort(function (a, b) { return a.id - b.id; });
	  }
	  for (var i = 0, l = subs.length; i < l; i++) {
	    subs[i].update();
	  }
	};

	// The current target watcher being evaluated.
	// This is globally unique because only one watcher
	// can be evaluated at a time.
	Dep.target = null;
	var targetStack = [];

	function pushTarget (target) {
	  targetStack.push(target);
	  Dep.target = target;
	}

	function popTarget () {
	  targetStack.pop();
	  Dep.target = targetStack[targetStack.length - 1];
	}

	/*  */

	var VNode = function VNode (
	  tag,
	  data,
	  children,
	  text,
	  elm,
	  context,
	  componentOptions,
	  asyncFactory
	) {
	  this.tag = tag;
	  this.data = data;
	  this.children = children;
	  this.text = text;
	  this.elm = elm;
	  this.ns = undefined;
	  this.context = context;
	  this.fnContext = undefined;
	  this.fnOptions = undefined;
	  this.fnScopeId = undefined;
	  this.key = data && data.key;
	  this.componentOptions = componentOptions;
	  this.componentInstance = undefined;
	  this.parent = undefined;
	  this.raw = false;
	  this.isStatic = false;
	  this.isRootInsert = true;
	  this.isComment = false;
	  this.isCloned = false;
	  this.isOnce = false;
	  this.asyncFactory = asyncFactory;
	  this.asyncMeta = undefined;
	  this.isAsyncPlaceholder = false;
	};

	var prototypeAccessors$1 = { child: { configurable: true } };

	// DEPRECATED: alias for componentInstance for backwards compat.
	/* istanbul ignore next */
	prototypeAccessors$1.child.get = function () {
	  return this.componentInstance
	};

	Object.defineProperties( VNode.prototype, prototypeAccessors$1 );

	var createEmptyVNode = function (text) {
	  if ( text === void 0 ) text = '';

	  var node = new VNode();
	  node.text = text;
	  node.isComment = true;
	  return node
	};

	function createTextVNode (val) {
	  return new VNode(undefined, undefined, undefined, String(val))
	}

	// optimized shallow clone
	// used for static nodes and slot nodes because they may be reused across
	// multiple renders, cloning them avoids errors when DOM manipulations rely
	// on their elm reference.
	function cloneVNode (vnode) {
	  var cloned = new VNode(
	    vnode.tag,
	    vnode.data,
	    // #7975
	    // clone children array to avoid mutating original in case of cloning
	    // a child.
	    vnode.children && vnode.children.slice(),
	    vnode.text,
	    vnode.elm,
	    vnode.context,
	    vnode.componentOptions,
	    vnode.asyncFactory
	  );
	  cloned.ns = vnode.ns;
	  cloned.isStatic = vnode.isStatic;
	  cloned.key = vnode.key;
	  cloned.isComment = vnode.isComment;
	  cloned.fnContext = vnode.fnContext;
	  cloned.fnOptions = vnode.fnOptions;
	  cloned.fnScopeId = vnode.fnScopeId;
	  cloned.asyncMeta = vnode.asyncMeta;
	  cloned.isCloned = true;
	  return cloned
	}

	/*
	 * not type checking this file because flow doesn't play well with
	 * dynamically accessing methods on Array prototype
	 */

	var arrayProto = Array.prototype;
	var arrayMethods = Object.create(arrayProto);

	var methodsToPatch = [
	  'push',
	  'pop',
	  'shift',
	  'unshift',
	  'splice',
	  'sort',
	  'reverse'
	];

	/**
	 * Intercept mutating methods and emit events
	 */
	methodsToPatch.forEach(function (method) {
	  // cache original method
	  var original = arrayProto[method];
	  def(arrayMethods, method, function mutator () {
	    var args = [], len = arguments.length;
	    while ( len-- ) args[ len ] = arguments[ len ];

	    var result = original.apply(this, args);
	    var ob = this.__ob__;
	    var inserted;
	    switch (method) {
	      case 'push':
	      case 'unshift':
	        inserted = args;
	        break
	      case 'splice':
	        inserted = args.slice(2);
	        break
	    }
	    if (inserted) { ob.observeArray(inserted); }
	    // notify change
	    ob.dep.notify();
	    return result
	  });
	});

	/*  */

	var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

	/**
	 * In some cases we may want to disable observation inside a component's
	 * update computation.
	 */
	var shouldObserve = true;

	function toggleObserving (value) {
	  shouldObserve = value;
	}

	/**
	 * Observer class that is attached to each observed
	 * object. Once attached, the observer converts the target
	 * object's property keys into getter/setters that
	 * collect dependencies and dispatch updates.
	 */
	var Observer = function Observer (value) {
	  this.value = value;
	  this.dep = new Dep();
	  this.vmCount = 0;
	  def(value, '__ob__', this);
	  if (Array.isArray(value)) {
	    if (hasProto) {
	      protoAugment(value, arrayMethods);
	    } else {
	      copyAugment(value, arrayMethods, arrayKeys);
	    }
	    this.observeArray(value);
	  } else {
	    this.walk(value);
	  }
	};

	/**
	 * Walk through all properties and convert them into
	 * getter/setters. This method should only be called when
	 * value type is Object.
	 */
	Observer.prototype.walk = function walk (obj) {
	  var keys = Object.keys(obj);
	  for (var i = 0; i < keys.length; i++) {
	    defineReactive$$1(obj, keys[i]);
	  }
	};

	/**
	 * Observe a list of Array items.
	 */
	Observer.prototype.observeArray = function observeArray (items) {
	  for (var i = 0, l = items.length; i < l; i++) {
	    observe(items[i]);
	  }
	};

	// helpers

	/**
	 * Augment a target Object or Array by intercepting
	 * the prototype chain using __proto__
	 */
	function protoAugment (target, src) {
	  /* eslint-disable no-proto */
	  target.__proto__ = src;
	  /* eslint-enable no-proto */
	}

	/**
	 * Augment a target Object or Array by defining
	 * hidden properties.
	 */
	/* istanbul ignore next */
	function copyAugment (target, src, keys) {
	  for (var i = 0, l = keys.length; i < l; i++) {
	    var key = keys[i];
	    def(target, key, src[key]);
	  }
	}

	/**
	 * Attempt to create an observer instance for a value,
	 * returns the new observer if successfully observed,
	 * or the existing observer if the value already has one.
	 */
	function observe (value, asRootData) {
	  if (!isObject(value) || value instanceof VNode) {
	    return
	  }
	  var ob;
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
	    ob = value.__ob__;
	  } else if (
	    shouldObserve &&
	    !isServerRendering() &&
	    (Array.isArray(value) || isPlainObject(value)) &&
	    Object.isExtensible(value) &&
	    !value._isVue
	  ) {
	    ob = new Observer(value);
	  }
	  if (asRootData && ob) {
	    ob.vmCount++;
	  }
	  return ob
	}

	/**
	 * Define a reactive property on an Object.
	 */
	function defineReactive$$1 (
	  obj,
	  key,
	  val,
	  customSetter,
	  shallow
	) {
	  var dep = new Dep();

	  var property = Object.getOwnPropertyDescriptor(obj, key);
	  if (property && property.configurable === false) {
	    return
	  }

	  // cater for pre-defined getter/setters
	  var getter = property && property.get;
	  var setter = property && property.set;
	  if ((!getter || setter) && arguments.length === 2) {
	    val = obj[key];
	  }

	  var childOb = !shallow && observe(val);
	  Object.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    get: function reactiveGetter () {
	      var value = getter ? getter.call(obj) : val;
	      if (Dep.target) {
	        dep.depend();
	        if (childOb) {
	          childOb.dep.depend();
	          if (Array.isArray(value)) {
	            dependArray(value);
	          }
	        }
	      }
	      return value
	    },
	    set: function reactiveSetter (newVal) {
	      var value = getter ? getter.call(obj) : val;
	      /* eslint-disable no-self-compare */
	      if (newVal === value || (newVal !== newVal && value !== value)) {
	        return
	      }
	      /* eslint-enable no-self-compare */
	      if (customSetter) {
	        customSetter();
	      }
	      // #7981: for accessor properties without setter
	      if (getter && !setter) { return }
	      if (setter) {
	        setter.call(obj, newVal);
	      } else {
	        val = newVal;
	      }
	      childOb = !shallow && observe(newVal);
	      dep.notify();
	    }
	  });
	}

	/**
	 * Set a property on an object. Adds the new property and
	 * triggers change notification if the property doesn't
	 * already exist.
	 */
	function set (target, key, val) {
	  if (isUndef(target) || isPrimitive(target)
	  ) {
	    warn$1(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
	  }
	  if (Array.isArray(target) && isValidArrayIndex(key)) {
	    target.length = Math.max(target.length, key);
	    target.splice(key, 1, val);
	    return val
	  }
	  if (key in target && !(key in Object.prototype)) {
	    target[key] = val;
	    return val
	  }
	  var ob = (target).__ob__;
	  if (target._isVue || (ob && ob.vmCount)) {
	    warn$1(
	      'Avoid adding reactive properties to a Vue instance or its root $data ' +
	      'at runtime - declare it upfront in the data option.'
	    );
	    return val
	  }
	  if (!ob) {
	    target[key] = val;
	    return val
	  }
	  defineReactive$$1(ob.value, key, val);
	  ob.dep.notify();
	  return val
	}

	/**
	 * Delete a property and trigger change if necessary.
	 */
	function del (target, key) {
	  if (isUndef(target) || isPrimitive(target)
	  ) {
	    warn$1(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
	  }
	  if (Array.isArray(target) && isValidArrayIndex(key)) {
	    target.splice(key, 1);
	    return
	  }
	  var ob = (target).__ob__;
	  if (target._isVue || (ob && ob.vmCount)) {
	    warn$1(
	      'Avoid deleting properties on a Vue instance or its root $data ' +
	      '- just set it to null.'
	    );
	    return
	  }
	  if (!hasOwn(target, key)) {
	    return
	  }
	  delete target[key];
	  if (!ob) {
	    return
	  }
	  ob.dep.notify();
	}

	/**
	 * Collect dependencies on array elements when the array is touched, since
	 * we cannot intercept array element access like property getters.
	 */
	function dependArray (value) {
	  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
	    e = value[i];
	    e && e.__ob__ && e.__ob__.dep.depend();
	    if (Array.isArray(e)) {
	      dependArray(e);
	    }
	  }
	}

	/*  */

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 */
	var strats = config.optionMergeStrategies;

	/**
	 * Options with restrictions
	 */
	{
	  strats.el = strats.propsData = function (parent, child, vm, key) {
	    if (!vm) {
	      warn$1(
	        "option \"" + key + "\" can only be used during instance " +
	        'creation with the `new` keyword.'
	      );
	    }
	    return defaultStrat(parent, child)
	  };
	}

	/**
	 * Helper that recursively merges two data objects together.
	 */
	function mergeData (to, from) {
	  if (!from) { return to }
	  var key, toVal, fromVal;

	  var keys = hasSymbol$1
	    ? Reflect.ownKeys(from)
	    : Object.keys(from);

	  for (var i = 0; i < keys.length; i++) {
	    key = keys[i];
	    // in case the object is already observed...
	    if (key === '__ob__') { continue }
	    toVal = to[key];
	    fromVal = from[key];
	    if (!hasOwn(to, key)) {
	      set(to, key, fromVal);
	    } else if (
	      toVal !== fromVal &&
	      isPlainObject(toVal) &&
	      isPlainObject(fromVal)
	    ) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to
	}

	/**
	 * Data
	 */
	function mergeDataOrFn (
	  parentVal,
	  childVal,
	  vm
	) {
	  if (!vm) {
	    // in a Vue.extend merge, both should be functions
	    if (!childVal) {
	      return parentVal
	    }
	    if (!parentVal) {
	      return childVal
	    }
	    // when parentVal & childVal are both present,
	    // we need to return a function that returns the
	    // merged result of both functions... no need to
	    // check if parentVal is a function here because
	    // it has to be a function to pass previous merges.
	    return function mergedDataFn () {
	      return mergeData(
	        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
	        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
	      )
	    }
	  } else {
	    return function mergedInstanceDataFn () {
	      // instance merge
	      var instanceData = typeof childVal === 'function'
	        ? childVal.call(vm, vm)
	        : childVal;
	      var defaultData = typeof parentVal === 'function'
	        ? parentVal.call(vm, vm)
	        : parentVal;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData)
	      } else {
	        return defaultData
	      }
	    }
	  }
	}

	strats.data = function (
	  parentVal,
	  childVal,
	  vm
	) {
	  if (!vm) {
	    if (childVal && typeof childVal !== 'function') {
	      warn$1(
	        'The "data" option should be a function ' +
	        'that returns a per-instance value in component ' +
	        'definitions.',
	        vm
	      );

	      return parentVal
	    }
	    return mergeDataOrFn(parentVal, childVal)
	  }

	  return mergeDataOrFn(parentVal, childVal, vm)
	};

	/**
	 * Hooks and props are merged as arrays.
	 */
	function mergeHook (
	  parentVal,
	  childVal
	) {
	  var res = childVal
	    ? parentVal
	      ? parentVal.concat(childVal)
	      : Array.isArray(childVal)
	        ? childVal
	        : [childVal]
	    : parentVal;
	  return res
	    ? dedupeHooks(res)
	    : res
	}

	function dedupeHooks (hooks) {
	  var res = [];
	  for (var i = 0; i < hooks.length; i++) {
	    if (res.indexOf(hooks[i]) === -1) {
	      res.push(hooks[i]);
	    }
	  }
	  return res
	}

	LIFECYCLE_HOOKS.forEach(function (hook) {
	  strats[hook] = mergeHook;
	});

	/**
	 * Assets
	 *
	 * When a vm is present (instance creation), we need to do
	 * a three-way merge between constructor options, instance
	 * options and parent options.
	 */
	function mergeAssets (
	  parentVal,
	  childVal,
	  vm,
	  key
	) {
	  var res = Object.create(parentVal || null);
	  if (childVal) {
	    assertObjectType(key, childVal, vm);
	    return extend$1(res, childVal)
	  } else {
	    return res
	  }
	}

	ASSET_TYPES.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});

	/**
	 * Watchers.
	 *
	 * Watchers hashes should not overwrite one
	 * another, so we merge them as arrays.
	 */
	strats.watch = function (
	  parentVal,
	  childVal,
	  vm,
	  key
	) {
	  // work around Firefox's Object.prototype.watch...
	  if (parentVal === nativeWatch) { parentVal = undefined; }
	  if (childVal === nativeWatch) { childVal = undefined; }
	  /* istanbul ignore if */
	  if (!childVal) { return Object.create(parentVal || null) }
	  {
	    assertObjectType(key, childVal, vm);
	  }
	  if (!parentVal) { return childVal }
	  var ret = {};
	  extend$1(ret, parentVal);
	  for (var key$1 in childVal) {
	    var parent = ret[key$1];
	    var child = childVal[key$1];
	    if (parent && !Array.isArray(parent)) {
	      parent = [parent];
	    }
	    ret[key$1] = parent
	      ? parent.concat(child)
	      : Array.isArray(child) ? child : [child];
	  }
	  return ret
	};

	/**
	 * Other object hashes.
	 */
	strats.props =
	strats.methods =
	strats.inject =
	strats.computed = function (
	  parentVal,
	  childVal,
	  vm,
	  key
	) {
	  if (childVal && "development" !== 'production') {
	    assertObjectType(key, childVal, vm);
	  }
	  if (!parentVal) { return childVal }
	  var ret = Object.create(null);
	  extend$1(ret, parentVal);
	  if (childVal) { extend$1(ret, childVal); }
	  return ret
	};
	strats.provide = mergeDataOrFn;

	/**
	 * Default strategy.
	 */
	var defaultStrat = function (parentVal, childVal) {
	  return childVal === undefined
	    ? parentVal
	    : childVal
	};

	/**
	 * Validate component names
	 */
	function checkComponents (options) {
	  for (var key in options.components) {
	    validateComponentName(key);
	  }
	}

	function validateComponentName (name) {
	  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
	    warn$1(
	      'Invalid component name: "' + name + '". Component names ' +
	      'should conform to valid custom element name in html5 specification.'
	    );
	  }
	  if (isBuiltInTag(name) || config.isReservedTag(name)) {
	    warn$1(
	      'Do not use built-in or reserved HTML elements as component ' +
	      'id: ' + name
	    );
	  }
	}

	/**
	 * Ensure all props option syntax are normalized into the
	 * Object-based format.
	 */
	function normalizeProps (options, vm) {
	  var props = options.props;
	  if (!props) { return }
	  var res = {};
	  var i, val, name;
	  if (Array.isArray(props)) {
	    i = props.length;
	    while (i--) {
	      val = props[i];
	      if (typeof val === 'string') {
	        name = camelize(val);
	        res[name] = { type: null };
	      } else {
	        warn$1('props must be strings when using array syntax.');
	      }
	    }
	  } else if (isPlainObject(props)) {
	    for (var key in props) {
	      val = props[key];
	      name = camelize(key);
	      res[name] = isPlainObject(val)
	        ? val
	        : { type: val };
	    }
	  } else {
	    warn$1(
	      "Invalid value for option \"props\": expected an Array or an Object, " +
	      "but got " + (toRawType(props)) + ".",
	      vm
	    );
	  }
	  options.props = res;
	}

	/**
	 * Normalize all injections into Object-based format
	 */
	function normalizeInject (options, vm) {
	  var inject = options.inject;
	  if (!inject) { return }
	  var normalized = options.inject = {};
	  if (Array.isArray(inject)) {
	    for (var i = 0; i < inject.length; i++) {
	      normalized[inject[i]] = { from: inject[i] };
	    }
	  } else if (isPlainObject(inject)) {
	    for (var key in inject) {
	      var val = inject[key];
	      normalized[key] = isPlainObject(val)
	        ? extend$1({ from: key }, val)
	        : { from: val };
	    }
	  } else {
	    warn$1(
	      "Invalid value for option \"inject\": expected an Array or an Object, " +
	      "but got " + (toRawType(inject)) + ".",
	      vm
	    );
	  }
	}

	/**
	 * Normalize raw function directives into object format.
	 */
	function normalizeDirectives (options) {
	  var dirs = options.directives;
	  if (dirs) {
	    for (var key in dirs) {
	      var def$$1 = dirs[key];
	      if (typeof def$$1 === 'function') {
	        dirs[key] = { bind: def$$1, update: def$$1 };
	      }
	    }
	  }
	}

	function assertObjectType (name, value, vm) {
	  if (!isPlainObject(value)) {
	    warn$1(
	      "Invalid value for option \"" + name + "\": expected an Object, " +
	      "but got " + (toRawType(value)) + ".",
	      vm
	    );
	  }
	}

	/**
	 * Merge two option objects into a new one.
	 * Core utility used in both instantiation and inheritance.
	 */
	function mergeOptions (
	  parent,
	  child,
	  vm
	) {
	  {
	    checkComponents(child);
	  }

	  if (typeof child === 'function') {
	    child = child.options;
	  }

	  normalizeProps(child, vm);
	  normalizeInject(child, vm);
	  normalizeDirectives(child);

	  // Apply extends and mixins on the child options,
	  // but only if it is a raw options object that isn't
	  // the result of another mergeOptions call.
	  // Only merged options has the _base property.
	  if (!child._base) {
	    if (child.extends) {
	      parent = mergeOptions(parent, child.extends, vm);
	    }
	    if (child.mixins) {
	      for (var i = 0, l = child.mixins.length; i < l; i++) {
	        parent = mergeOptions(parent, child.mixins[i], vm);
	      }
	    }
	  }

	  var options = {};
	  var key;
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!hasOwn(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField (key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options
	}

	/**
	 * Resolve an asset.
	 * This function is used because child instances need access
	 * to assets defined in its ancestor chain.
	 */
	function resolveAsset (
	  options,
	  type,
	  id,
	  warnMissing
	) {
	  /* istanbul ignore if */
	  if (typeof id !== 'string') {
	    return
	  }
	  var assets = options[type];
	  // check local registration variations first
	  if (hasOwn(assets, id)) { return assets[id] }
	  var camelizedId = camelize(id);
	  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
	  var PascalCaseId = capitalize(camelizedId);
	  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
	  // fallback to prototype chain
	  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
	  if (warnMissing && !res) {
	    warn$1(
	      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
	      options
	    );
	  }
	  return res
	}

	/*  */



	function validateProp (
	  key,
	  propOptions,
	  propsData,
	  vm
	) {
	  var prop = propOptions[key];
	  var absent = !hasOwn(propsData, key);
	  var value = propsData[key];
	  // boolean casting
	  var booleanIndex = getTypeIndex(Boolean, prop.type);
	  if (booleanIndex > -1) {
	    if (absent && !hasOwn(prop, 'default')) {
	      value = false;
	    } else if (value === '' || value === hyphenate(key)) {
	      // only cast empty string / same name to boolean if
	      // boolean has higher priority
	      var stringIndex = getTypeIndex(String, prop.type);
	      if (stringIndex < 0 || booleanIndex < stringIndex) {
	        value = true;
	      }
	    }
	  }
	  // check default value
	  if (value === undefined) {
	    value = getPropDefaultValue(vm, prop, key);
	    // since the default value is a fresh copy,
	    // make sure to observe it.
	    var prevShouldObserve = shouldObserve;
	    toggleObserving(true);
	    observe(value);
	    toggleObserving(prevShouldObserve);
	  }
	  {
	    assertProp(prop, key, value, vm, absent);
	  }
	  return value
	}

	/**
	 * Get the default value of a prop.
	 */
	function getPropDefaultValue (vm, prop, key) {
	  // no default, return undefined
	  if (!hasOwn(prop, 'default')) {
	    return undefined
	  }
	  var def = prop.default;
	  // warn against non-factory defaults for Object & Array
	  if (isObject(def)) {
	    warn$1(
	      'Invalid default value for prop "' + key + '": ' +
	      'Props with type Object/Array must use a factory function ' +
	      'to return the default value.',
	      vm
	    );
	  }
	  // the raw prop value was also undefined from previous render,
	  // return previous default value to avoid unnecessary watcher trigger
	  if (vm && vm.$options.propsData &&
	    vm.$options.propsData[key] === undefined &&
	    vm._props[key] !== undefined
	  ) {
	    return vm._props[key]
	  }
	  // call factory function for non-Function types
	  // a value is Function if its prototype is function even across different execution context
	  return typeof def === 'function' && getType(prop.type) !== 'Function'
	    ? def.call(vm)
	    : def
	}

	/**
	 * Assert whether a prop is valid.
	 */
	function assertProp (
	  prop,
	  name,
	  value,
	  vm,
	  absent
	) {
	  if (prop.required && absent) {
	    warn$1(
	      'Missing required prop: "' + name + '"',
	      vm
	    );
	    return
	  }
	  if (value == null && !prop.required) {
	    return
	  }
	  var type = prop.type;
	  var valid = !type || type === true;
	  var expectedTypes = [];
	  if (type) {
	    if (!Array.isArray(type)) {
	      type = [type];
	    }
	    for (var i = 0; i < type.length && !valid; i++) {
	      var assertedType = assertType(value, type[i]);
	      expectedTypes.push(assertedType.expectedType || '');
	      valid = assertedType.valid;
	    }
	  }

	  if (!valid) {
	    warn$1(
	      getInvalidTypeMessage(name, value, expectedTypes),
	      vm
	    );
	    return
	  }
	  var validator = prop.validator;
	  if (validator) {
	    if (!validator(value)) {
	      warn$1(
	        'Invalid prop: custom validator check failed for prop "' + name + '".',
	        vm
	      );
	    }
	  }
	}

	var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

	function assertType (value, type) {
	  var valid;
	  var expectedType = getType(type);
	  if (simpleCheckRE.test(expectedType)) {
	    var t = typeof value;
	    valid = t === expectedType.toLowerCase();
	    // for primitive wrapper objects
	    if (!valid && t === 'object') {
	      valid = value instanceof type;
	    }
	  } else if (expectedType === 'Object') {
	    valid = isPlainObject(value);
	  } else if (expectedType === 'Array') {
	    valid = Array.isArray(value);
	  } else {
	    valid = value instanceof type;
	  }
	  return {
	    valid: valid,
	    expectedType: expectedType
	  }
	}

	/**
	 * Use function string name to check built-in types,
	 * because a simple equality check will fail when running
	 * across different vms / iframes.
	 */
	function getType (fn) {
	  var match = fn && fn.toString().match(/^\s*function (\w+)/);
	  return match ? match[1] : ''
	}

	function isSameType (a, b) {
	  return getType(a) === getType(b)
	}

	function getTypeIndex (type, expectedTypes) {
	  if (!Array.isArray(expectedTypes)) {
	    return isSameType(expectedTypes, type) ? 0 : -1
	  }
	  for (var i = 0, len = expectedTypes.length; i < len; i++) {
	    if (isSameType(expectedTypes[i], type)) {
	      return i
	    }
	  }
	  return -1
	}

	function getInvalidTypeMessage (name, value, expectedTypes) {
	  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
	    " Expected " + (expectedTypes.map(capitalize).join(', '));
	  var expectedType = expectedTypes[0];
	  var receivedType = toRawType(value);
	  var expectedValue = styleValue(value, expectedType);
	  var receivedValue = styleValue(value, receivedType);
	  // check if we need to specify expected value
	  if (expectedTypes.length === 1 &&
	      isExplicable(expectedType) &&
	      !isBoolean(expectedType, receivedType)) {
	    message += " with value " + expectedValue;
	  }
	  message += ", got " + receivedType + " ";
	  // check if we need to specify received value
	  if (isExplicable(receivedType)) {
	    message += "with value " + receivedValue + ".";
	  }
	  return message
	}

	function styleValue (value, type) {
	  if (type === 'String') {
	    return ("\"" + value + "\"")
	  } else if (type === 'Number') {
	    return ("" + (Number(value)))
	  } else {
	    return ("" + value)
	  }
	}

	function isExplicable (value) {
	  var explicitTypes = ['string', 'number', 'boolean'];
	  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
	}

	function isBoolean () {
	  var args = [], len = arguments.length;
	  while ( len-- ) args[ len ] = arguments[ len ];

	  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
	}

	/*  */

	function handleError (err, vm, info) {
	  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
	  // See: https://github.com/vuejs/vuex/issues/1505
	  pushTarget();
	  try {
	    if (vm) {
	      var cur = vm;
	      while ((cur = cur.$parent)) {
	        var hooks = cur.$options.errorCaptured;
	        if (hooks) {
	          for (var i = 0; i < hooks.length; i++) {
	            try {
	              var capture = hooks[i].call(cur, err, vm, info) === false;
	              if (capture) { return }
	            } catch (e) {
	              globalHandleError(e, cur, 'errorCaptured hook');
	            }
	          }
	        }
	      }
	    }
	    globalHandleError(err, vm, info);
	  } finally {
	    popTarget();
	  }
	}

	function invokeWithErrorHandling (
	  handler,
	  context,
	  args,
	  vm,
	  info
	) {
	  var res;
	  try {
	    res = args ? handler.apply(context, args) : handler.call(context);
	    if (res && !res._isVue && isPromise(res) && !res._handled) {
	      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
	      // issue #9511
	      // avoid catch triggering multiple times when nested calls
	      res._handled = true;
	    }
	  } catch (e) {
	    handleError(e, vm, info);
	  }
	  return res
	}

	function globalHandleError (err, vm, info) {
	  if (config.errorHandler) {
	    try {
	      return config.errorHandler.call(null, err, vm, info)
	    } catch (e) {
	      // if the user intentionally throws the original error in the handler,
	      // do not log it twice
	      if (e !== err) {
	        logError(e, null, 'config.errorHandler');
	      }
	    }
	  }
	  logError(err, vm, info);
	}

	function logError (err, vm, info) {
	  {
	    warn$1(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
	  }
	  /* istanbul ignore else */
	  if ((inBrowser$1 || inWeex) && typeof console !== 'undefined') {
	    console.error(err);
	  } else {
	    throw err
	  }
	}

	/*  */

	var isUsingMicroTask = false;

	var callbacks = [];
	var pending = false;

	function flushCallbacks () {
	  pending = false;
	  var copies = callbacks.slice(0);
	  callbacks.length = 0;
	  for (var i = 0; i < copies.length; i++) {
	    copies[i]();
	  }
	}

	// Here we have async deferring wrappers using microtasks.
	// In 2.5 we used (macro) tasks (in combination with microtasks).
	// However, it has subtle problems when state is changed right before repaint
	// (e.g. #6813, out-in transitions).
	// Also, using (macro) tasks in event handler would cause some weird behaviors
	// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
	// So we now use microtasks everywhere, again.
	// A major drawback of this tradeoff is that there are some scenarios
	// where microtasks have too high a priority and fire in between supposedly
	// sequential events (e.g. #4521, #6690, which have workarounds)
	// or even between bubbling of the same event (#6566).
	var timerFunc;

	// The nextTick behavior leverages the microtask queue, which can be accessed
	// via either native Promise.then or MutationObserver.
	// MutationObserver has wider support, however it is seriously bugged in
	// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
	// completely stops working after triggering a few times... so, if native
	// Promise is available, we will use it:
	/* istanbul ignore next, $flow-disable-line */
	if (typeof Promise !== 'undefined' && isNative(Promise)) {
	  var p = Promise.resolve();
	  timerFunc = function () {
	    p.then(flushCallbacks);
	    // In problematic UIWebViews, Promise.then doesn't completely break, but
	    // it can get stuck in a weird state where callbacks are pushed into the
	    // microtask queue but the queue isn't being flushed, until the browser
	    // needs to do some other work, e.g. handle a timer. Therefore we can
	    // "force" the microtask queue to be flushed by adding an empty timer.
	    if (isIOS) { setTimeout(noop$1); }
	  };
	  isUsingMicroTask = true;
	} else if (!isIE && typeof MutationObserver !== 'undefined' && (
	  isNative(MutationObserver) ||
	  // PhantomJS and iOS 7.x
	  MutationObserver.toString() === '[object MutationObserverConstructor]'
	)) {
	  // Use MutationObserver where native Promise is not available,
	  // e.g. PhantomJS, iOS7, Android 4.4
	  // (#6466 MutationObserver is unreliable in IE11)
	  var counter = 1;
	  var observer = new MutationObserver(flushCallbacks);
	  var textNode = document.createTextNode(String(counter));
	  observer.observe(textNode, {
	    characterData: true
	  });
	  timerFunc = function () {
	    counter = (counter + 1) % 2;
	    textNode.data = String(counter);
	  };
	  isUsingMicroTask = true;
	} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
	  // Fallback to setImmediate.
	  // Technically it leverages the (macro) task queue,
	  // but it is still a better choice than setTimeout.
	  timerFunc = function () {
	    setImmediate(flushCallbacks);
	  };
	} else {
	  // Fallback to setTimeout.
	  timerFunc = function () {
	    setTimeout(flushCallbacks, 0);
	  };
	}

	function nextTick (cb, ctx) {
	  var _resolve;
	  callbacks.push(function () {
	    if (cb) {
	      try {
	        cb.call(ctx);
	      } catch (e) {
	        handleError(e, ctx, 'nextTick');
	      }
	    } else if (_resolve) {
	      _resolve(ctx);
	    }
	  });
	  if (!pending) {
	    pending = true;
	    timerFunc();
	  }
	  // $flow-disable-line
	  if (!cb && typeof Promise !== 'undefined') {
	    return new Promise(function (resolve) {
	      _resolve = resolve;
	    })
	  }
	}

	/*  */

	var mark;
	var measure;

	{
	  var perf = inBrowser$1 && window.performance;
	  /* istanbul ignore if */
	  if (
	    perf &&
	    perf.mark &&
	    perf.measure &&
	    perf.clearMarks &&
	    perf.clearMeasures
	  ) {
	    mark = function (tag) { return perf.mark(tag); };
	    measure = function (name, startTag, endTag) {
	      perf.measure(name, startTag, endTag);
	      perf.clearMarks(startTag);
	      perf.clearMarks(endTag);
	      // perf.clearMeasures(name)
	    };
	  }
	}

	/* not type checking this file because flow doesn't play well with Proxy */

	var initProxy;

	{
	  var allowedGlobals = makeMap(
	    'Infinity,undefined,NaN,isFinite,isNaN,' +
	    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
	    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
	    'require' // for Webpack/Browserify
	  );

	  var warnNonPresent = function (target, key) {
	    warn$1(
	      "Property or method \"" + key + "\" is not defined on the instance but " +
	      'referenced during render. Make sure that this property is reactive, ' +
	      'either in the data option, or for class-based components, by ' +
	      'initializing the property. ' +
	      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
	      target
	    );
	  };

	  var warnReservedPrefix = function (target, key) {
	    warn$1(
	      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
	      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
	      'prevent conflicts with Vue internals. ' +
	      'See: https://vuejs.org/v2/api/#data',
	      target
	    );
	  };

	  var hasProxy =
	    typeof Proxy !== 'undefined' && isNative(Proxy);

	  if (hasProxy) {
	    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
	    config.keyCodes = new Proxy(config.keyCodes, {
	      set: function set (target, key, value) {
	        if (isBuiltInModifier(key)) {
	          warn$1(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
	          return false
	        } else {
	          target[key] = value;
	          return true
	        }
	      }
	    });
	  }

	  var hasHandler = {
	    has: function has (target, key) {
	      var has = key in target;
	      var isAllowed = allowedGlobals(key) ||
	        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
	      if (!has && !isAllowed) {
	        if (key in target.$data) { warnReservedPrefix(target, key); }
	        else { warnNonPresent(target, key); }
	      }
	      return has || !isAllowed
	    }
	  };

	  var getHandler = {
	    get: function get (target, key) {
	      if (typeof key === 'string' && !(key in target)) {
	        if (key in target.$data) { warnReservedPrefix(target, key); }
	        else { warnNonPresent(target, key); }
	      }
	      return target[key]
	    }
	  };

	  initProxy = function initProxy (vm) {
	    if (hasProxy) {
	      // determine which proxy handler to use
	      var options = vm.$options;
	      var handlers = options.render && options.render._withStripped
	        ? getHandler
	        : hasHandler;
	      vm._renderProxy = new Proxy(vm, handlers);
	    } else {
	      vm._renderProxy = vm;
	    }
	  };
	}

	/*  */

	var seenObjects = new _Set();

	/**
	 * Recursively traverse an object to evoke all converted
	 * getters, so that every nested property inside the object
	 * is collected as a "deep" dependency.
	 */
	function traverse (val) {
	  _traverse(val, seenObjects);
	  seenObjects.clear();
	}

	function _traverse (val, seen) {
	  var i, keys;
	  var isA = Array.isArray(val);
	  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
	    return
	  }
	  if (val.__ob__) {
	    var depId = val.__ob__.dep.id;
	    if (seen.has(depId)) {
	      return
	    }
	    seen.add(depId);
	  }
	  if (isA) {
	    i = val.length;
	    while (i--) { _traverse(val[i], seen); }
	  } else {
	    keys = Object.keys(val);
	    i = keys.length;
	    while (i--) { _traverse(val[keys[i]], seen); }
	  }
	}

	/*  */

	var normalizeEvent = cached(function (name) {
	  var passive = name.charAt(0) === '&';
	  name = passive ? name.slice(1) : name;
	  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
	  name = once$$1 ? name.slice(1) : name;
	  var capture = name.charAt(0) === '!';
	  name = capture ? name.slice(1) : name;
	  return {
	    name: name,
	    once: once$$1,
	    capture: capture,
	    passive: passive
	  }
	});

	function createFnInvoker (fns, vm) {
	  function invoker () {
	    var arguments$1 = arguments;

	    var fns = invoker.fns;
	    if (Array.isArray(fns)) {
	      var cloned = fns.slice();
	      for (var i = 0; i < cloned.length; i++) {
	        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
	      }
	    } else {
	      // return handler return value for single handlers
	      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
	    }
	  }
	  invoker.fns = fns;
	  return invoker
	}

	function updateListeners (
	  on,
	  oldOn,
	  add,
	  remove$$1,
	  createOnceHandler,
	  vm
	) {
	  var name, cur, old, event;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    event = normalizeEvent(name);
	    if (isUndef(cur)) {
	      warn$1(
	        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
	        vm
	      );
	    } else if (isUndef(old)) {
	      if (isUndef(cur.fns)) {
	        cur = on[name] = createFnInvoker(cur, vm);
	      }
	      if (isTrue(event.once)) {
	        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
	      }
	      add(event.name, cur, event.capture, event.passive, event.params);
	    } else if (cur !== old) {
	      old.fns = cur;
	      on[name] = old;
	    }
	  }
	  for (name in oldOn) {
	    if (isUndef(on[name])) {
	      event = normalizeEvent(name);
	      remove$$1(event.name, oldOn[name], event.capture);
	    }
	  }
	}

	/*  */

	function mergeVNodeHook (def, hookKey, hook) {
	  if (def instanceof VNode) {
	    def = def.data.hook || (def.data.hook = {});
	  }
	  var invoker;
	  var oldHook = def[hookKey];

	  function wrappedHook () {
	    hook.apply(this, arguments);
	    // important: remove merged hook to ensure it's called only once
	    // and prevent memory leak
	    remove(invoker.fns, wrappedHook);
	  }

	  if (isUndef(oldHook)) {
	    // no existing hook
	    invoker = createFnInvoker([wrappedHook]);
	  } else {
	    /* istanbul ignore if */
	    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
	      // already a merged invoker
	      invoker = oldHook;
	      invoker.fns.push(wrappedHook);
	    } else {
	      // existing plain hook
	      invoker = createFnInvoker([oldHook, wrappedHook]);
	    }
	  }

	  invoker.merged = true;
	  def[hookKey] = invoker;
	}

	/*  */

	function extractPropsFromVNodeData (
	  data,
	  Ctor,
	  tag
	) {
	  // we are only extracting raw values here.
	  // validation and default values are handled in the child
	  // component itself.
	  var propOptions = Ctor.options.props;
	  if (isUndef(propOptions)) {
	    return
	  }
	  var res = {};
	  var attrs = data.attrs;
	  var props = data.props;
	  if (isDef(attrs) || isDef(props)) {
	    for (var key in propOptions) {
	      var altKey = hyphenate(key);
	      {
	        var keyInLowerCase = key.toLowerCase();
	        if (
	          key !== keyInLowerCase &&
	          attrs && hasOwn(attrs, keyInLowerCase)
	        ) {
	          tip(
	            "Prop \"" + keyInLowerCase + "\" is passed to component " +
	            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
	            " \"" + key + "\". " +
	            "Note that HTML attributes are case-insensitive and camelCased " +
	            "props need to use their kebab-case equivalents when using in-DOM " +
	            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
	          );
	        }
	      }
	      checkProp(res, props, key, altKey, true) ||
	      checkProp(res, attrs, key, altKey, false);
	    }
	  }
	  return res
	}

	function checkProp (
	  res,
	  hash,
	  key,
	  altKey,
	  preserve
	) {
	  if (isDef(hash)) {
	    if (hasOwn(hash, key)) {
	      res[key] = hash[key];
	      if (!preserve) {
	        delete hash[key];
	      }
	      return true
	    } else if (hasOwn(hash, altKey)) {
	      res[key] = hash[altKey];
	      if (!preserve) {
	        delete hash[altKey];
	      }
	      return true
	    }
	  }
	  return false
	}

	/*  */

	// The template compiler attempts to minimize the need for normalization by
	// statically analyzing the template at compile time.
	//
	// For plain HTML markup, normalization can be completely skipped because the
	// generated render function is guaranteed to return Array<VNode>. There are
	// two cases where extra normalization is needed:

	// 1. When the children contains components - because a functional component
	// may return an Array instead of a single root. In this case, just a simple
	// normalization is needed - if any child is an Array, we flatten the whole
	// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
	// because functional components already normalize their own children.
	function simpleNormalizeChildren (children) {
	  for (var i = 0; i < children.length; i++) {
	    if (Array.isArray(children[i])) {
	      return Array.prototype.concat.apply([], children)
	    }
	  }
	  return children
	}

	// 2. When the children contains constructs that always generated nested Arrays,
	// e.g. <template>, <slot>, v-for, or when the children is provided by user
	// with hand-written render functions / JSX. In such cases a full normalization
	// is needed to cater to all possible types of children values.
	function normalizeChildren (children) {
	  return isPrimitive(children)
	    ? [createTextVNode(children)]
	    : Array.isArray(children)
	      ? normalizeArrayChildren(children)
	      : undefined
	}

	function isTextNode (node) {
	  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
	}

	function normalizeArrayChildren (children, nestedIndex) {
	  var res = [];
	  var i, c, lastIndex, last;
	  for (i = 0; i < children.length; i++) {
	    c = children[i];
	    if (isUndef(c) || typeof c === 'boolean') { continue }
	    lastIndex = res.length - 1;
	    last = res[lastIndex];
	    //  nested
	    if (Array.isArray(c)) {
	      if (c.length > 0) {
	        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
	        // merge adjacent text nodes
	        if (isTextNode(c[0]) && isTextNode(last)) {
	          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
	          c.shift();
	        }
	        res.push.apply(res, c);
	      }
	    } else if (isPrimitive(c)) {
	      if (isTextNode(last)) {
	        // merge adjacent text nodes
	        // this is necessary for SSR hydration because text nodes are
	        // essentially merged when rendered to HTML strings
	        res[lastIndex] = createTextVNode(last.text + c);
	      } else if (c !== '') {
	        // convert primitive to vnode
	        res.push(createTextVNode(c));
	      }
	    } else {
	      if (isTextNode(c) && isTextNode(last)) {
	        // merge adjacent text nodes
	        res[lastIndex] = createTextVNode(last.text + c.text);
	      } else {
	        // default key for nested array children (likely generated by v-for)
	        if (isTrue(children._isVList) &&
	          isDef(c.tag) &&
	          isUndef(c.key) &&
	          isDef(nestedIndex)) {
	          c.key = "__vlist" + nestedIndex + "_" + i + "__";
	        }
	        res.push(c);
	      }
	    }
	  }
	  return res
	}

	/*  */

	function initProvide (vm) {
	  var provide = vm.$options.provide;
	  if (provide) {
	    vm._provided = typeof provide === 'function'
	      ? provide.call(vm)
	      : provide;
	  }
	}

	function initInjections (vm) {
	  var result = resolveInject(vm.$options.inject, vm);
	  if (result) {
	    toggleObserving(false);
	    Object.keys(result).forEach(function (key) {
	      /* istanbul ignore else */
	      {
	        defineReactive$$1(vm, key, result[key], function () {
	          warn$1(
	            "Avoid mutating an injected value directly since the changes will be " +
	            "overwritten whenever the provided component re-renders. " +
	            "injection being mutated: \"" + key + "\"",
	            vm
	          );
	        });
	      }
	    });
	    toggleObserving(true);
	  }
	}

	function resolveInject (inject, vm) {
	  if (inject) {
	    // inject is :any because flow is not smart enough to figure out cached
	    var result = Object.create(null);
	    var keys = hasSymbol$1
	      ? Reflect.ownKeys(inject)
	      : Object.keys(inject);

	    for (var i = 0; i < keys.length; i++) {
	      var key = keys[i];
	      // #6574 in case the inject object is observed...
	      if (key === '__ob__') { continue }
	      var provideKey = inject[key].from;
	      var source = vm;
	      while (source) {
	        if (source._provided && hasOwn(source._provided, provideKey)) {
	          result[key] = source._provided[provideKey];
	          break
	        }
	        source = source.$parent;
	      }
	      if (!source) {
	        if ('default' in inject[key]) {
	          var provideDefault = inject[key].default;
	          result[key] = typeof provideDefault === 'function'
	            ? provideDefault.call(vm)
	            : provideDefault;
	        } else {
	          warn$1(("Injection \"" + key + "\" not found"), vm);
	        }
	      }
	    }
	    return result
	  }
	}

	/*  */



	/**
	 * Runtime helper for resolving raw children VNodes into a slot object.
	 */
	function resolveSlots (
	  children,
	  context
	) {
	  if (!children || !children.length) {
	    return {}
	  }
	  var slots = {};
	  for (var i = 0, l = children.length; i < l; i++) {
	    var child = children[i];
	    var data = child.data;
	    // remove slot attribute if the node is resolved as a Vue slot node
	    if (data && data.attrs && data.attrs.slot) {
	      delete data.attrs.slot;
	    }
	    // named slots should only be respected if the vnode was rendered in the
	    // same context.
	    if ((child.context === context || child.fnContext === context) &&
	      data && data.slot != null
	    ) {
	      var name = data.slot;
	      var slot = (slots[name] || (slots[name] = []));
	      if (child.tag === 'template') {
	        slot.push.apply(slot, child.children || []);
	      } else {
	        slot.push(child);
	      }
	    } else {
	      (slots.default || (slots.default = [])).push(child);
	    }
	  }
	  // ignore slots that contains only whitespace
	  for (var name$1 in slots) {
	    if (slots[name$1].every(isWhitespace)) {
	      delete slots[name$1];
	    }
	  }
	  return slots
	}

	function isWhitespace (node) {
	  return (node.isComment && !node.asyncFactory) || node.text === ' '
	}

	/*  */

	function normalizeScopedSlots (
	  slots,
	  normalSlots,
	  prevSlots
	) {
	  var res;
	  var hasNormalSlots = Object.keys(normalSlots).length > 0;
	  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
	  var key = slots && slots.$key;
	  if (!slots) {
	    res = {};
	  } else if (slots._normalized) {
	    // fast path 1: child component re-render only, parent did not change
	    return slots._normalized
	  } else if (
	    isStable &&
	    prevSlots &&
	    prevSlots !== emptyObject &&
	    key === prevSlots.$key &&
	    !hasNormalSlots &&
	    !prevSlots.$hasNormal
	  ) {
	    // fast path 2: stable scoped slots w/ no normal slots to proxy,
	    // only need to normalize once
	    return prevSlots
	  } else {
	    res = {};
	    for (var key$1 in slots) {
	      if (slots[key$1] && key$1[0] !== '$') {
	        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
	      }
	    }
	  }
	  // expose normal slots on scopedSlots
	  for (var key$2 in normalSlots) {
	    if (!(key$2 in res)) {
	      res[key$2] = proxyNormalSlot(normalSlots, key$2);
	    }
	  }
	  // avoriaz seems to mock a non-extensible $scopedSlots object
	  // and when that is passed down this would cause an error
	  if (slots && Object.isExtensible(slots)) {
	    (slots)._normalized = res;
	  }
	  def(res, '$stable', isStable);
	  def(res, '$key', key);
	  def(res, '$hasNormal', hasNormalSlots);
	  return res
	}

	function normalizeScopedSlot(normalSlots, key, fn) {
	  var normalized = function () {
	    var res = arguments.length ? fn.apply(null, arguments) : fn({});
	    res = res && typeof res === 'object' && !Array.isArray(res)
	      ? [res] // single vnode
	      : normalizeChildren(res);
	    return res && (
	      res.length === 0 ||
	      (res.length === 1 && res[0].isComment) // #9658
	    ) ? undefined
	      : res
	  };
	  // this is a slot using the new v-slot syntax without scope. although it is
	  // compiled as a scoped slot, render fn users would expect it to be present
	  // on this.$slots because the usage is semantically a normal slot.
	  if (fn.proxy) {
	    Object.defineProperty(normalSlots, key, {
	      get: normalized,
	      enumerable: true,
	      configurable: true
	    });
	  }
	  return normalized
	}

	function proxyNormalSlot(slots, key) {
	  return function () { return slots[key]; }
	}

	/*  */

	/**
	 * Runtime helper for rendering v-for lists.
	 */
	function renderList (
	  val,
	  render
	) {
	  var ret, i, l, keys, key;
	  if (Array.isArray(val) || typeof val === 'string') {
	    ret = new Array(val.length);
	    for (i = 0, l = val.length; i < l; i++) {
	      ret[i] = render(val[i], i);
	    }
	  } else if (typeof val === 'number') {
	    ret = new Array(val);
	    for (i = 0; i < val; i++) {
	      ret[i] = render(i + 1, i);
	    }
	  } else if (isObject(val)) {
	    if (hasSymbol$1 && val[Symbol.iterator]) {
	      ret = [];
	      var iterator = val[Symbol.iterator]();
	      var result = iterator.next();
	      while (!result.done) {
	        ret.push(render(result.value, ret.length));
	        result = iterator.next();
	      }
	    } else {
	      keys = Object.keys(val);
	      ret = new Array(keys.length);
	      for (i = 0, l = keys.length; i < l; i++) {
	        key = keys[i];
	        ret[i] = render(val[key], key, i);
	      }
	    }
	  }
	  if (!isDef(ret)) {
	    ret = [];
	  }
	  (ret)._isVList = true;
	  return ret
	}

	/*  */

	/**
	 * Runtime helper for rendering <slot>
	 */
	function renderSlot (
	  name,
	  fallback,
	  props,
	  bindObject
	) {
	  var scopedSlotFn = this.$scopedSlots[name];
	  var nodes;
	  if (scopedSlotFn) { // scoped slot
	    props = props || {};
	    if (bindObject) {
	      if (!isObject(bindObject)) {
	        warn$1(
	          'slot v-bind without argument expects an Object',
	          this
	        );
	      }
	      props = extend$1(extend$1({}, bindObject), props);
	    }
	    nodes = scopedSlotFn(props) || fallback;
	  } else {
	    nodes = this.$slots[name] || fallback;
	  }

	  var target = props && props.slot;
	  if (target) {
	    return this.$createElement('template', { slot: target }, nodes)
	  } else {
	    return nodes
	  }
	}

	/*  */

	/**
	 * Runtime helper for resolving filters
	 */
	function resolveFilter (id) {
	  return resolveAsset(this.$options, 'filters', id, true) || identity
	}

	/*  */

	function isKeyNotMatch (expect, actual) {
	  if (Array.isArray(expect)) {
	    return expect.indexOf(actual) === -1
	  } else {
	    return expect !== actual
	  }
	}

	/**
	 * Runtime helper for checking keyCodes from config.
	 * exposed as Vue.prototype._k
	 * passing in eventKeyName as last argument separately for backwards compat
	 */
	function checkKeyCodes (
	  eventKeyCode,
	  key,
	  builtInKeyCode,
	  eventKeyName,
	  builtInKeyName
	) {
	  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
	  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
	    return isKeyNotMatch(builtInKeyName, eventKeyName)
	  } else if (mappedKeyCode) {
	    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
	  } else if (eventKeyName) {
	    return hyphenate(eventKeyName) !== key
	  }
	}

	/*  */

	/**
	 * Runtime helper for merging v-bind="object" into a VNode's data.
	 */
	function bindObjectProps (
	  data,
	  tag,
	  value,
	  asProp,
	  isSync
	) {
	  if (value) {
	    if (!isObject(value)) {
	      warn$1(
	        'v-bind without argument expects an Object or Array value',
	        this
	      );
	    } else {
	      if (Array.isArray(value)) {
	        value = toObject(value);
	      }
	      var hash;
	      var loop = function ( key ) {
	        if (
	          key === 'class' ||
	          key === 'style' ||
	          isReservedAttribute(key)
	        ) {
	          hash = data;
	        } else {
	          var type = data.attrs && data.attrs.type;
	          hash = asProp || config.mustUseProp(tag, type, key)
	            ? data.domProps || (data.domProps = {})
	            : data.attrs || (data.attrs = {});
	        }
	        var camelizedKey = camelize(key);
	        var hyphenatedKey = hyphenate(key);
	        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
	          hash[key] = value[key];

	          if (isSync) {
	            var on = data.on || (data.on = {});
	            on[("update:" + key)] = function ($event) {
	              value[key] = $event;
	            };
	          }
	        }
	      };

	      for (var key in value) loop( key );
	    }
	  }
	  return data
	}

	/*  */

	/**
	 * Runtime helper for rendering static trees.
	 */
	function renderStatic (
	  index,
	  isInFor
	) {
	  var cached = this._staticTrees || (this._staticTrees = []);
	  var tree = cached[index];
	  // if has already-rendered static tree and not inside v-for,
	  // we can reuse the same tree.
	  if (tree && !isInFor) {
	    return tree
	  }
	  // otherwise, render a fresh tree.
	  tree = cached[index] = this.$options.staticRenderFns[index].call(
	    this._renderProxy,
	    null,
	    this // for render fns generated for functional component templates
	  );
	  markStatic(tree, ("__static__" + index), false);
	  return tree
	}

	/**
	 * Runtime helper for v-once.
	 * Effectively it means marking the node as static with a unique key.
	 */
	function markOnce (
	  tree,
	  index,
	  key
	) {
	  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
	  return tree
	}

	function markStatic (
	  tree,
	  key,
	  isOnce
	) {
	  if (Array.isArray(tree)) {
	    for (var i = 0; i < tree.length; i++) {
	      if (tree[i] && typeof tree[i] !== 'string') {
	        markStaticNode(tree[i], (key + "_" + i), isOnce);
	      }
	    }
	  } else {
	    markStaticNode(tree, key, isOnce);
	  }
	}

	function markStaticNode (node, key, isOnce) {
	  node.isStatic = true;
	  node.key = key;
	  node.isOnce = isOnce;
	}

	/*  */

	function bindObjectListeners (data, value) {
	  if (value) {
	    if (!isPlainObject(value)) {
	      warn$1(
	        'v-on without argument expects an Object value',
	        this
	      );
	    } else {
	      var on = data.on = data.on ? extend$1({}, data.on) : {};
	      for (var key in value) {
	        var existing = on[key];
	        var ours = value[key];
	        on[key] = existing ? [].concat(existing, ours) : ours;
	      }
	    }
	  }
	  return data
	}

	/*  */

	function resolveScopedSlots (
	  fns, // see flow/vnode
	  res,
	  // the following are added in 2.6
	  hasDynamicKeys,
	  contentHashKey
	) {
	  res = res || { $stable: !hasDynamicKeys };
	  for (var i = 0; i < fns.length; i++) {
	    var slot = fns[i];
	    if (Array.isArray(slot)) {
	      resolveScopedSlots(slot, res, hasDynamicKeys);
	    } else if (slot) {
	      // marker for reverse proxying v-slot without scope on this.$slots
	      if (slot.proxy) {
	        slot.fn.proxy = true;
	      }
	      res[slot.key] = slot.fn;
	    }
	  }
	  if (contentHashKey) {
	    (res).$key = contentHashKey;
	  }
	  return res
	}

	/*  */

	function bindDynamicKeys (baseObj, values) {
	  for (var i = 0; i < values.length; i += 2) {
	    var key = values[i];
	    if (typeof key === 'string' && key) {
	      baseObj[values[i]] = values[i + 1];
	    } else if (key !== '' && key !== null) {
	      // null is a special value for explicitly removing a binding
	      warn$1(
	        ("Invalid value for dynamic directive argument (expected string or null): " + key),
	        this
	      );
	    }
	  }
	  return baseObj
	}

	// helper to dynamically append modifier runtime markers to event names.
	// ensure only append when value is already string, otherwise it will be cast
	// to string and cause the type check to miss.
	function prependModifier (value, symbol) {
	  return typeof value === 'string' ? symbol + value : value
	}

	/*  */

	function installRenderHelpers (target) {
	  target._o = markOnce;
	  target._n = toNumber;
	  target._s = toString;
	  target._l = renderList;
	  target._t = renderSlot;
	  target._q = looseEqual;
	  target._i = looseIndexOf;
	  target._m = renderStatic;
	  target._f = resolveFilter;
	  target._k = checkKeyCodes;
	  target._b = bindObjectProps;
	  target._v = createTextVNode;
	  target._e = createEmptyVNode;
	  target._u = resolveScopedSlots;
	  target._g = bindObjectListeners;
	  target._d = bindDynamicKeys;
	  target._p = prependModifier;
	}

	/*  */

	function FunctionalRenderContext (
	  data,
	  props,
	  children,
	  parent,
	  Ctor
	) {
	  var this$1$1 = this;

	  var options = Ctor.options;
	  // ensure the createElement function in functional components
	  // gets a unique context - this is necessary for correct named slot check
	  var contextVm;
	  if (hasOwn(parent, '_uid')) {
	    contextVm = Object.create(parent);
	    // $flow-disable-line
	    contextVm._original = parent;
	  } else {
	    // the context vm passed in is a functional context as well.
	    // in this case we want to make sure we are able to get a hold to the
	    // real context instance.
	    contextVm = parent;
	    // $flow-disable-line
	    parent = parent._original;
	  }
	  var isCompiled = isTrue(options._compiled);
	  var needNormalization = !isCompiled;

	  this.data = data;
	  this.props = props;
	  this.children = children;
	  this.parent = parent;
	  this.listeners = data.on || emptyObject;
	  this.injections = resolveInject(options.inject, parent);
	  this.slots = function () {
	    if (!this$1$1.$slots) {
	      normalizeScopedSlots(
	        data.scopedSlots,
	        this$1$1.$slots = resolveSlots(children, parent)
	      );
	    }
	    return this$1$1.$slots
	  };

	  Object.defineProperty(this, 'scopedSlots', ({
	    enumerable: true,
	    get: function get () {
	      return normalizeScopedSlots(data.scopedSlots, this.slots())
	    }
	  }));

	  // support for compiled functional template
	  if (isCompiled) {
	    // exposing $options for renderStatic()
	    this.$options = options;
	    // pre-resolve slots for renderSlot()
	    this.$slots = this.slots();
	    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
	  }

	  if (options._scopeId) {
	    this._c = function (a, b, c, d) {
	      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
	      if (vnode && !Array.isArray(vnode)) {
	        vnode.fnScopeId = options._scopeId;
	        vnode.fnContext = parent;
	      }
	      return vnode
	    };
	  } else {
	    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
	  }
	}

	installRenderHelpers(FunctionalRenderContext.prototype);

	function createFunctionalComponent (
	  Ctor,
	  propsData,
	  data,
	  contextVm,
	  children
	) {
	  var options = Ctor.options;
	  var props = {};
	  var propOptions = options.props;
	  if (isDef(propOptions)) {
	    for (var key in propOptions) {
	      props[key] = validateProp(key, propOptions, propsData || emptyObject);
	    }
	  } else {
	    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
	    if (isDef(data.props)) { mergeProps(props, data.props); }
	  }

	  var renderContext = new FunctionalRenderContext(
	    data,
	    props,
	    children,
	    contextVm,
	    Ctor
	  );

	  var vnode = options.render.call(null, renderContext._c, renderContext);

	  if (vnode instanceof VNode) {
	    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
	  } else if (Array.isArray(vnode)) {
	    var vnodes = normalizeChildren(vnode) || [];
	    var res = new Array(vnodes.length);
	    for (var i = 0; i < vnodes.length; i++) {
	      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
	    }
	    return res
	  }
	}

	function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
	  // #7817 clone node before setting fnContext, otherwise if the node is reused
	  // (e.g. it was from a cached normal slot) the fnContext causes named slots
	  // that should not be matched to match.
	  var clone = cloneVNode(vnode);
	  clone.fnContext = contextVm;
	  clone.fnOptions = options;
	  {
	    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
	  }
	  if (data.slot) {
	    (clone.data || (clone.data = {})).slot = data.slot;
	  }
	  return clone
	}

	function mergeProps (to, from) {
	  for (var key in from) {
	    to[camelize(key)] = from[key];
	  }
	}

	/*  */

	/*  */

	/*  */

	/*  */

	// inline hooks to be invoked on component VNodes during patch
	var componentVNodeHooks = {
	  init: function init (vnode, hydrating) {
	    if (
	      vnode.componentInstance &&
	      !vnode.componentInstance._isDestroyed &&
	      vnode.data.keepAlive
	    ) {
	      // kept-alive components, treat as a patch
	      var mountedNode = vnode; // work around flow
	      componentVNodeHooks.prepatch(mountedNode, mountedNode);
	    } else {
	      var child = vnode.componentInstance = createComponentInstanceForVnode(
	        vnode,
	        activeInstance
	      );
	      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
	    }
	  },

	  prepatch: function prepatch (oldVnode, vnode) {
	    var options = vnode.componentOptions;
	    var child = vnode.componentInstance = oldVnode.componentInstance;
	    updateChildComponent(
	      child,
	      options.propsData, // updated props
	      options.listeners, // updated listeners
	      vnode, // new parent vnode
	      options.children // new children
	    );
	  },

	  insert: function insert (vnode) {
	    var context = vnode.context;
	    var componentInstance = vnode.componentInstance;
	    if (!componentInstance._isMounted) {
	      componentInstance._isMounted = true;
	      callHook(componentInstance, 'mounted');
	    }
	    if (vnode.data.keepAlive) {
	      if (context._isMounted) {
	        // vue-router#1212
	        // During updates, a kept-alive component's child components may
	        // change, so directly walking the tree here may call activated hooks
	        // on incorrect children. Instead we push them into a queue which will
	        // be processed after the whole patch process ended.
	        queueActivatedComponent(componentInstance);
	      } else {
	        activateChildComponent(componentInstance, true /* direct */);
	      }
	    }
	  },

	  destroy: function destroy (vnode) {
	    var componentInstance = vnode.componentInstance;
	    if (!componentInstance._isDestroyed) {
	      if (!vnode.data.keepAlive) {
	        componentInstance.$destroy();
	      } else {
	        deactivateChildComponent(componentInstance, true /* direct */);
	      }
	    }
	  }
	};

	var hooksToMerge = Object.keys(componentVNodeHooks);

	function createComponent (
	  Ctor,
	  data,
	  context,
	  children,
	  tag
	) {
	  if (isUndef(Ctor)) {
	    return
	  }

	  var baseCtor = context.$options._base;

	  // plain options object: turn it into a constructor
	  if (isObject(Ctor)) {
	    Ctor = baseCtor.extend(Ctor);
	  }

	  // if at this stage it's not a constructor or an async component factory,
	  // reject.
	  if (typeof Ctor !== 'function') {
	    {
	      warn$1(("Invalid Component definition: " + (String(Ctor))), context);
	    }
	    return
	  }

	  // async component
	  var asyncFactory;
	  if (isUndef(Ctor.cid)) {
	    asyncFactory = Ctor;
	    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
	    if (Ctor === undefined) {
	      // return a placeholder node for async component, which is rendered
	      // as a comment node but preserves all the raw information for the node.
	      // the information will be used for async server-rendering and hydration.
	      return createAsyncPlaceholder(
	        asyncFactory,
	        data,
	        context,
	        children,
	        tag
	      )
	    }
	  }

	  data = data || {};

	  // resolve constructor options in case global mixins are applied after
	  // component constructor creation
	  resolveConstructorOptions(Ctor);

	  // transform component v-model data into props & events
	  if (isDef(data.model)) {
	    transformModel(Ctor.options, data);
	  }

	  // extract props
	  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

	  // functional component
	  if (isTrue(Ctor.options.functional)) {
	    return createFunctionalComponent(Ctor, propsData, data, context, children)
	  }

	  // extract listeners, since these needs to be treated as
	  // child component listeners instead of DOM listeners
	  var listeners = data.on;
	  // replace with listeners with .native modifier
	  // so it gets processed during parent component patch.
	  data.on = data.nativeOn;

	  if (isTrue(Ctor.options.abstract)) {
	    // abstract components do not keep anything
	    // other than props & listeners & slot

	    // work around flow
	    var slot = data.slot;
	    data = {};
	    if (slot) {
	      data.slot = slot;
	    }
	  }

	  // install component management hooks onto the placeholder node
	  installComponentHooks(data);

	  // return a placeholder vnode
	  var name = Ctor.options.name || tag;
	  var vnode = new VNode(
	    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
	    data, undefined, undefined, undefined, context,
	    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
	    asyncFactory
	  );

	  return vnode
	}

	function createComponentInstanceForVnode (
	  vnode, // we know it's MountedComponentVNode but flow doesn't
	  parent // activeInstance in lifecycle state
	) {
	  var options = {
	    _isComponent: true,
	    _parentVnode: vnode,
	    parent: parent
	  };
	  // check inline-template render functions
	  var inlineTemplate = vnode.data.inlineTemplate;
	  if (isDef(inlineTemplate)) {
	    options.render = inlineTemplate.render;
	    options.staticRenderFns = inlineTemplate.staticRenderFns;
	  }
	  return new vnode.componentOptions.Ctor(options)
	}

	function installComponentHooks (data) {
	  var hooks = data.hook || (data.hook = {});
	  for (var i = 0; i < hooksToMerge.length; i++) {
	    var key = hooksToMerge[i];
	    var existing = hooks[key];
	    var toMerge = componentVNodeHooks[key];
	    if (existing !== toMerge && !(existing && existing._merged)) {
	      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
	    }
	  }
	}

	function mergeHook$1 (f1, f2) {
	  var merged = function (a, b) {
	    // flow complains about extra args which is why we use any
	    f1(a, b);
	    f2(a, b);
	  };
	  merged._merged = true;
	  return merged
	}

	// transform component v-model info (value and callback) into
	// prop and event handler respectively.
	function transformModel (options, data) {
	  var prop = (options.model && options.model.prop) || 'value';
	  var event = (options.model && options.model.event) || 'input'
	  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
	  var on = data.on || (data.on = {});
	  var existing = on[event];
	  var callback = data.model.callback;
	  if (isDef(existing)) {
	    if (
	      Array.isArray(existing)
	        ? existing.indexOf(callback) === -1
	        : existing !== callback
	    ) {
	      on[event] = [callback].concat(existing);
	    }
	  } else {
	    on[event] = callback;
	  }
	}

	/*  */

	var SIMPLE_NORMALIZE = 1;
	var ALWAYS_NORMALIZE = 2;

	// wrapper function for providing a more flexible interface
	// without getting yelled at by flow
	function createElement (
	  context,
	  tag,
	  data,
	  children,
	  normalizationType,
	  alwaysNormalize
	) {
	  if (Array.isArray(data) || isPrimitive(data)) {
	    normalizationType = children;
	    children = data;
	    data = undefined;
	  }
	  if (isTrue(alwaysNormalize)) {
	    normalizationType = ALWAYS_NORMALIZE;
	  }
	  return _createElement(context, tag, data, children, normalizationType)
	}

	function _createElement (
	  context,
	  tag,
	  data,
	  children,
	  normalizationType
	) {
	  if (isDef(data) && isDef((data).__ob__)) {
	    warn$1(
	      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
	      'Always create fresh vnode data objects in each render!',
	      context
	    );
	    return createEmptyVNode()
	  }
	  // object syntax in v-bind
	  if (isDef(data) && isDef(data.is)) {
	    tag = data.is;
	  }
	  if (!tag) {
	    // in case of component :is set to falsy value
	    return createEmptyVNode()
	  }
	  // warn against non-primitive key
	  if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
	  ) {
	    {
	      warn$1(
	        'Avoid using non-primitive value as key, ' +
	        'use string/number value instead.',
	        context
	      );
	    }
	  }
	  // support single function children as default scoped slot
	  if (Array.isArray(children) &&
	    typeof children[0] === 'function'
	  ) {
	    data = data || {};
	    data.scopedSlots = { default: children[0] };
	    children.length = 0;
	  }
	  if (normalizationType === ALWAYS_NORMALIZE) {
	    children = normalizeChildren(children);
	  } else if (normalizationType === SIMPLE_NORMALIZE) {
	    children = simpleNormalizeChildren(children);
	  }
	  var vnode, ns;
	  if (typeof tag === 'string') {
	    var Ctor;
	    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
	    if (config.isReservedTag(tag)) {
	      // platform built-in elements
	      if (isDef(data) && isDef(data.nativeOn)) {
	        warn$1(
	          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
	          context
	        );
	      }
	      vnode = new VNode(
	        config.parsePlatformTagName(tag), data, children,
	        undefined, undefined, context
	      );
	    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
	      // component
	      vnode = createComponent(Ctor, data, context, children, tag);
	    } else {
	      // unknown or unlisted namespaced elements
	      // check at runtime because it may get assigned a namespace when its
	      // parent normalizes children
	      vnode = new VNode(
	        tag, data, children,
	        undefined, undefined, context
	      );
	    }
	  } else {
	    // direct component options / constructor
	    vnode = createComponent(tag, data, context, children);
	  }
	  if (Array.isArray(vnode)) {
	    return vnode
	  } else if (isDef(vnode)) {
	    if (isDef(ns)) { applyNS(vnode, ns); }
	    if (isDef(data)) { registerDeepBindings(data); }
	    return vnode
	  } else {
	    return createEmptyVNode()
	  }
	}

	function applyNS (vnode, ns, force) {
	  vnode.ns = ns;
	  if (vnode.tag === 'foreignObject') {
	    // use default namespace inside foreignObject
	    ns = undefined;
	    force = true;
	  }
	  if (isDef(vnode.children)) {
	    for (var i = 0, l = vnode.children.length; i < l; i++) {
	      var child = vnode.children[i];
	      if (isDef(child.tag) && (
	        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
	        applyNS(child, ns, force);
	      }
	    }
	  }
	}

	// ref #5318
	// necessary to ensure parent re-render when deep bindings like :style and
	// :class are used on slot nodes
	function registerDeepBindings (data) {
	  if (isObject(data.style)) {
	    traverse(data.style);
	  }
	  if (isObject(data.class)) {
	    traverse(data.class);
	  }
	}

	/*  */

	function initRender (vm) {
	  vm._vnode = null; // the root of the child tree
	  vm._staticTrees = null; // v-once cached trees
	  var options = vm.$options;
	  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
	  var renderContext = parentVnode && parentVnode.context;
	  vm.$slots = resolveSlots(options._renderChildren, renderContext);
	  vm.$scopedSlots = emptyObject;
	  // bind the createElement fn to this instance
	  // so that we get proper render context inside it.
	  // args order: tag, data, children, normalizationType, alwaysNormalize
	  // internal version is used by render functions compiled from templates
	  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
	  // normalization is always applied for the public version, used in
	  // user-written render functions.
	  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

	  // $attrs & $listeners are exposed for easier HOC creation.
	  // they need to be reactive so that HOCs using them are always updated
	  var parentData = parentVnode && parentVnode.data;

	  /* istanbul ignore else */
	  {
	    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
	      !isUpdatingChildComponent && warn$1("$attrs is readonly.", vm);
	    }, true);
	    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
	      !isUpdatingChildComponent && warn$1("$listeners is readonly.", vm);
	    }, true);
	  }
	}

	var currentRenderingInstance = null;

	function renderMixin (Vue) {
	  // install runtime convenience helpers
	  installRenderHelpers(Vue.prototype);

	  Vue.prototype.$nextTick = function (fn) {
	    return nextTick(fn, this)
	  };

	  Vue.prototype._render = function () {
	    var vm = this;
	    var ref = vm.$options;
	    var render = ref.render;
	    var _parentVnode = ref._parentVnode;

	    if (_parentVnode) {
	      vm.$scopedSlots = normalizeScopedSlots(
	        _parentVnode.data.scopedSlots,
	        vm.$slots,
	        vm.$scopedSlots
	      );
	    }

	    // set parent vnode. this allows render functions to have access
	    // to the data on the placeholder node.
	    vm.$vnode = _parentVnode;
	    // render self
	    var vnode;
	    try {
	      // There's no need to maintain a stack because all render fns are called
	      // separately from one another. Nested component's render fns are called
	      // when parent component is patched.
	      currentRenderingInstance = vm;
	      vnode = render.call(vm._renderProxy, vm.$createElement);
	    } catch (e) {
	      handleError(e, vm, "render");
	      // return error render result,
	      // or previous vnode to prevent render error causing blank component
	      /* istanbul ignore else */
	      if (vm.$options.renderError) {
	        try {
	          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
	        } catch (e) {
	          handleError(e, vm, "renderError");
	          vnode = vm._vnode;
	        }
	      } else {
	        vnode = vm._vnode;
	      }
	    } finally {
	      currentRenderingInstance = null;
	    }
	    // if the returned array contains only a single node, allow it
	    if (Array.isArray(vnode) && vnode.length === 1) {
	      vnode = vnode[0];
	    }
	    // return empty vnode in case the render function errored out
	    if (!(vnode instanceof VNode)) {
	      if (Array.isArray(vnode)) {
	        warn$1(
	          'Multiple root nodes returned from render function. Render function ' +
	          'should return a single root node.',
	          vm
	        );
	      }
	      vnode = createEmptyVNode();
	    }
	    // set parent
	    vnode.parent = _parentVnode;
	    return vnode
	  };
	}

	/*  */

	function ensureCtor (comp, base) {
	  if (
	    comp.__esModule ||
	    (hasSymbol$1 && comp[Symbol.toStringTag] === 'Module')
	  ) {
	    comp = comp.default;
	  }
	  return isObject(comp)
	    ? base.extend(comp)
	    : comp
	}

	function createAsyncPlaceholder (
	  factory,
	  data,
	  context,
	  children,
	  tag
	) {
	  var node = createEmptyVNode();
	  node.asyncFactory = factory;
	  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
	  return node
	}

	function resolveAsyncComponent (
	  factory,
	  baseCtor
	) {
	  if (isTrue(factory.error) && isDef(factory.errorComp)) {
	    return factory.errorComp
	  }

	  if (isDef(factory.resolved)) {
	    return factory.resolved
	  }

	  var owner = currentRenderingInstance;
	  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
	    // already pending
	    factory.owners.push(owner);
	  }

	  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
	    return factory.loadingComp
	  }

	  if (owner && !isDef(factory.owners)) {
	    var owners = factory.owners = [owner];
	    var sync = true;
	    var timerLoading = null;
	    var timerTimeout = null

	    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

	    var forceRender = function (renderCompleted) {
	      for (var i = 0, l = owners.length; i < l; i++) {
	        (owners[i]).$forceUpdate();
	      }

	      if (renderCompleted) {
	        owners.length = 0;
	        if (timerLoading !== null) {
	          clearTimeout(timerLoading);
	          timerLoading = null;
	        }
	        if (timerTimeout !== null) {
	          clearTimeout(timerTimeout);
	          timerTimeout = null;
	        }
	      }
	    };

	    var resolve = once$1(function (res) {
	      // cache resolved
	      factory.resolved = ensureCtor(res, baseCtor);
	      // invoke callbacks only if this is not a synchronous resolve
	      // (async resolves are shimmed as synchronous during SSR)
	      if (!sync) {
	        forceRender(true);
	      } else {
	        owners.length = 0;
	      }
	    });

	    var reject = once$1(function (reason) {
	      warn$1(
	        "Failed to resolve async component: " + (String(factory)) +
	        (reason ? ("\nReason: " + reason) : '')
	      );
	      if (isDef(factory.errorComp)) {
	        factory.error = true;
	        forceRender(true);
	      }
	    });

	    var res = factory(resolve, reject);

	    if (isObject(res)) {
	      if (isPromise(res)) {
	        // () => Promise
	        if (isUndef(factory.resolved)) {
	          res.then(resolve, reject);
	        }
	      } else if (isPromise(res.component)) {
	        res.component.then(resolve, reject);

	        if (isDef(res.error)) {
	          factory.errorComp = ensureCtor(res.error, baseCtor);
	        }

	        if (isDef(res.loading)) {
	          factory.loadingComp = ensureCtor(res.loading, baseCtor);
	          if (res.delay === 0) {
	            factory.loading = true;
	          } else {
	            timerLoading = setTimeout(function () {
	              timerLoading = null;
	              if (isUndef(factory.resolved) && isUndef(factory.error)) {
	                factory.loading = true;
	                forceRender(false);
	              }
	            }, res.delay || 200);
	          }
	        }

	        if (isDef(res.timeout)) {
	          timerTimeout = setTimeout(function () {
	            timerTimeout = null;
	            if (isUndef(factory.resolved)) {
	              reject(
	                "timeout (" + (res.timeout) + "ms)"
	              );
	            }
	          }, res.timeout);
	        }
	      }
	    }

	    sync = false;
	    // return in case resolved synchronously
	    return factory.loading
	      ? factory.loadingComp
	      : factory.resolved
	  }
	}

	/*  */

	function isAsyncPlaceholder (node) {
	  return node.isComment && node.asyncFactory
	}

	/*  */

	function getFirstComponentChild (children) {
	  if (Array.isArray(children)) {
	    for (var i = 0; i < children.length; i++) {
	      var c = children[i];
	      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
	        return c
	      }
	    }
	  }
	}

	/*  */

	/*  */

	function initEvents (vm) {
	  vm._events = Object.create(null);
	  vm._hasHookEvent = false;
	  // init parent attached events
	  var listeners = vm.$options._parentListeners;
	  if (listeners) {
	    updateComponentListeners(vm, listeners);
	  }
	}

	var target;

	function add (event, fn) {
	  target.$on(event, fn);
	}

	function remove$1 (event, fn) {
	  target.$off(event, fn);
	}

	function createOnceHandler (event, fn) {
	  var _target = target;
	  return function onceHandler () {
	    var res = fn.apply(null, arguments);
	    if (res !== null) {
	      _target.$off(event, onceHandler);
	    }
	  }
	}

	function updateComponentListeners (
	  vm,
	  listeners,
	  oldListeners
	) {
	  target = vm;
	  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
	  target = undefined;
	}

	function eventsMixin (Vue) {
	  var hookRE = /^hook:/;
	  Vue.prototype.$on = function (event, fn) {
	    var vm = this;
	    if (Array.isArray(event)) {
	      for (var i = 0, l = event.length; i < l; i++) {
	        vm.$on(event[i], fn);
	      }
	    } else {
	      (vm._events[event] || (vm._events[event] = [])).push(fn);
	      // optimize hook:event cost by using a boolean flag marked at registration
	      // instead of a hash lookup
	      if (hookRE.test(event)) {
	        vm._hasHookEvent = true;
	      }
	    }
	    return vm
	  };

	  Vue.prototype.$once = function (event, fn) {
	    var vm = this;
	    function on () {
	      vm.$off(event, on);
	      fn.apply(vm, arguments);
	    }
	    on.fn = fn;
	    vm.$on(event, on);
	    return vm
	  };

	  Vue.prototype.$off = function (event, fn) {
	    var vm = this;
	    // all
	    if (!arguments.length) {
	      vm._events = Object.create(null);
	      return vm
	    }
	    // array of events
	    if (Array.isArray(event)) {
	      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
	        vm.$off(event[i$1], fn);
	      }
	      return vm
	    }
	    // specific event
	    var cbs = vm._events[event];
	    if (!cbs) {
	      return vm
	    }
	    if (!fn) {
	      vm._events[event] = null;
	      return vm
	    }
	    // specific handler
	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        cbs.splice(i, 1);
	        break
	      }
	    }
	    return vm
	  };

	  Vue.prototype.$emit = function (event) {
	    var vm = this;
	    {
	      var lowerCaseEvent = event.toLowerCase();
	      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
	        tip(
	          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
	          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
	          "Note that HTML attributes are case-insensitive and you cannot use " +
	          "v-on to listen to camelCase events when using in-DOM templates. " +
	          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
	        );
	      }
	    }
	    var cbs = vm._events[event];
	    if (cbs) {
	      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
	      var args = toArray(arguments, 1);
	      var info = "event handler for \"" + event + "\"";
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
	      }
	    }
	    return vm
	  };
	}

	/*  */

	var activeInstance = null;
	var isUpdatingChildComponent = false;

	function setActiveInstance(vm) {
	  var prevActiveInstance = activeInstance;
	  activeInstance = vm;
	  return function () {
	    activeInstance = prevActiveInstance;
	  }
	}

	function initLifecycle (vm) {
	  var options = vm.$options;

	  // locate first non-abstract parent
	  var parent = options.parent;
	  if (parent && !options.abstract) {
	    while (parent.$options.abstract && parent.$parent) {
	      parent = parent.$parent;
	    }
	    parent.$children.push(vm);
	  }

	  vm.$parent = parent;
	  vm.$root = parent ? parent.$root : vm;

	  vm.$children = [];
	  vm.$refs = {};

	  vm._watcher = null;
	  vm._inactive = null;
	  vm._directInactive = false;
	  vm._isMounted = false;
	  vm._isDestroyed = false;
	  vm._isBeingDestroyed = false;
	}

	function lifecycleMixin (Vue) {
	  Vue.prototype._update = function (vnode, hydrating) {
	    var vm = this;
	    var prevEl = vm.$el;
	    var prevVnode = vm._vnode;
	    var restoreActiveInstance = setActiveInstance(vm);
	    vm._vnode = vnode;
	    // Vue.prototype.__patch__ is injected in entry points
	    // based on the rendering backend used.
	    if (!prevVnode) {
	      // initial render
	      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
	    } else {
	      // updates
	      vm.$el = vm.__patch__(prevVnode, vnode);
	    }
	    restoreActiveInstance();
	    // update __vue__ reference
	    if (prevEl) {
	      prevEl.__vue__ = null;
	    }
	    if (vm.$el) {
	      vm.$el.__vue__ = vm;
	    }
	    // if parent is an HOC, update its $el as well
	    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
	      vm.$parent.$el = vm.$el;
	    }
	    // updated hook is called by the scheduler to ensure that children are
	    // updated in a parent's updated hook.
	  };

	  Vue.prototype.$forceUpdate = function () {
	    var vm = this;
	    if (vm._watcher) {
	      vm._watcher.update();
	    }
	  };

	  Vue.prototype.$destroy = function () {
	    var vm = this;
	    if (vm._isBeingDestroyed) {
	      return
	    }
	    callHook(vm, 'beforeDestroy');
	    vm._isBeingDestroyed = true;
	    // remove self from parent
	    var parent = vm.$parent;
	    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
	      remove(parent.$children, vm);
	    }
	    // teardown watchers
	    if (vm._watcher) {
	      vm._watcher.teardown();
	    }
	    var i = vm._watchers.length;
	    while (i--) {
	      vm._watchers[i].teardown();
	    }
	    // remove reference from data ob
	    // frozen object may not have observer.
	    if (vm._data.__ob__) {
	      vm._data.__ob__.vmCount--;
	    }
	    // call the last hook...
	    vm._isDestroyed = true;
	    // invoke destroy hooks on current rendered tree
	    vm.__patch__(vm._vnode, null);
	    // fire destroyed hook
	    callHook(vm, 'destroyed');
	    // turn off all instance listeners.
	    vm.$off();
	    // remove __vue__ reference
	    if (vm.$el) {
	      vm.$el.__vue__ = null;
	    }
	    // release circular reference (#6759)
	    if (vm.$vnode) {
	      vm.$vnode.parent = null;
	    }
	  };
	}

	function mountComponent (
	  vm,
	  el,
	  hydrating
	) {
	  vm.$el = el;
	  if (!vm.$options.render) {
	    vm.$options.render = createEmptyVNode;
	    {
	      /* istanbul ignore if */
	      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
	        vm.$options.el || el) {
	        warn$1(
	          'You are using the runtime-only build of Vue where the template ' +
	          'compiler is not available. Either pre-compile the templates into ' +
	          'render functions, or use the compiler-included build.',
	          vm
	        );
	      } else {
	        warn$1(
	          'Failed to mount component: template or render function not defined.',
	          vm
	        );
	      }
	    }
	  }
	  callHook(vm, 'beforeMount');

	  var updateComponent;
	  /* istanbul ignore if */
	  if (config.performance && mark) {
	    updateComponent = function () {
	      var name = vm._name;
	      var id = vm._uid;
	      var startTag = "vue-perf-start:" + id;
	      var endTag = "vue-perf-end:" + id;

	      mark(startTag);
	      var vnode = vm._render();
	      mark(endTag);
	      measure(("vue " + name + " render"), startTag, endTag);

	      mark(startTag);
	      vm._update(vnode, hydrating);
	      mark(endTag);
	      measure(("vue " + name + " patch"), startTag, endTag);
	    };
	  } else {
	    updateComponent = function () {
	      vm._update(vm._render(), hydrating);
	    };
	  }

	  // we set this to vm._watcher inside the watcher's constructor
	  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
	  // component's mounted hook), which relies on vm._watcher being already defined
	  new Watcher(vm, updateComponent, noop$1, {
	    before: function before () {
	      if (vm._isMounted && !vm._isDestroyed) {
	        callHook(vm, 'beforeUpdate');
	      }
	    }
	  }, true /* isRenderWatcher */);
	  hydrating = false;

	  // manually mounted instance, call mounted on self
	  // mounted is called for render-created child components in its inserted hook
	  if (vm.$vnode == null) {
	    vm._isMounted = true;
	    callHook(vm, 'mounted');
	  }
	  return vm
	}

	function updateChildComponent (
	  vm,
	  propsData,
	  listeners,
	  parentVnode,
	  renderChildren
	) {
	  {
	    isUpdatingChildComponent = true;
	  }

	  // determine whether component has slot children
	  // we need to do this before overwriting $options._renderChildren.

	  // check if there are dynamic scopedSlots (hand-written or compiled but with
	  // dynamic slot names). Static scoped slots compiled from template has the
	  // "$stable" marker.
	  var newScopedSlots = parentVnode.data.scopedSlots;
	  var oldScopedSlots = vm.$scopedSlots;
	  var hasDynamicScopedSlot = !!(
	    (newScopedSlots && !newScopedSlots.$stable) ||
	    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
	    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
	  );

	  // Any static slot children from the parent may have changed during parent's
	  // update. Dynamic scoped slots may also have changed. In such cases, a forced
	  // update is necessary to ensure correctness.
	  var needsForceUpdate = !!(
	    renderChildren ||               // has new static slots
	    vm.$options._renderChildren ||  // has old static slots
	    hasDynamicScopedSlot
	  );

	  vm.$options._parentVnode = parentVnode;
	  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

	  if (vm._vnode) { // update child tree's parent
	    vm._vnode.parent = parentVnode;
	  }
	  vm.$options._renderChildren = renderChildren;

	  // update $attrs and $listeners hash
	  // these are also reactive so they may trigger child update if the child
	  // used them during render
	  vm.$attrs = parentVnode.data.attrs || emptyObject;
	  vm.$listeners = listeners || emptyObject;

	  // update props
	  if (propsData && vm.$options.props) {
	    toggleObserving(false);
	    var props = vm._props;
	    var propKeys = vm.$options._propKeys || [];
	    for (var i = 0; i < propKeys.length; i++) {
	      var key = propKeys[i];
	      var propOptions = vm.$options.props; // wtf flow?
	      props[key] = validateProp(key, propOptions, propsData, vm);
	    }
	    toggleObserving(true);
	    // keep a copy of raw propsData
	    vm.$options.propsData = propsData;
	  }

	  // update listeners
	  listeners = listeners || emptyObject;
	  var oldListeners = vm.$options._parentListeners;
	  vm.$options._parentListeners = listeners;
	  updateComponentListeners(vm, listeners, oldListeners);

	  // resolve slots + force update if has children
	  if (needsForceUpdate) {
	    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
	    vm.$forceUpdate();
	  }

	  {
	    isUpdatingChildComponent = false;
	  }
	}

	function isInInactiveTree (vm) {
	  while (vm && (vm = vm.$parent)) {
	    if (vm._inactive) { return true }
	  }
	  return false
	}

	function activateChildComponent (vm, direct) {
	  if (direct) {
	    vm._directInactive = false;
	    if (isInInactiveTree(vm)) {
	      return
	    }
	  } else if (vm._directInactive) {
	    return
	  }
	  if (vm._inactive || vm._inactive === null) {
	    vm._inactive = false;
	    for (var i = 0; i < vm.$children.length; i++) {
	      activateChildComponent(vm.$children[i]);
	    }
	    callHook(vm, 'activated');
	  }
	}

	function deactivateChildComponent (vm, direct) {
	  if (direct) {
	    vm._directInactive = true;
	    if (isInInactiveTree(vm)) {
	      return
	    }
	  }
	  if (!vm._inactive) {
	    vm._inactive = true;
	    for (var i = 0; i < vm.$children.length; i++) {
	      deactivateChildComponent(vm.$children[i]);
	    }
	    callHook(vm, 'deactivated');
	  }
	}

	function callHook (vm, hook) {
	  // #7573 disable dep collection when invoking lifecycle hooks
	  pushTarget();
	  var handlers = vm.$options[hook];
	  var info = hook + " hook";
	  if (handlers) {
	    for (var i = 0, j = handlers.length; i < j; i++) {
	      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
	    }
	  }
	  if (vm._hasHookEvent) {
	    vm.$emit('hook:' + hook);
	  }
	  popTarget();
	}

	/*  */

	var MAX_UPDATE_COUNT = 100;

	var queue = [];
	var activatedChildren = [];
	var has = {};
	var circular = {};
	var waiting = false;
	var flushing = false;
	var index = 0;

	/**
	 * Reset the scheduler's state.
	 */
	function resetSchedulerState () {
	  index = queue.length = activatedChildren.length = 0;
	  has = {};
	  {
	    circular = {};
	  }
	  waiting = flushing = false;
	}

	// Async edge case #6566 requires saving the timestamp when event listeners are
	// attached. However, calling performance.now() has a perf overhead especially
	// if the page has thousands of event listeners. Instead, we take a timestamp
	// every time the scheduler flushes and use that for all event listeners
	// attached during that flush.
	var currentFlushTimestamp = 0;

	// Async edge case fix requires storing an event listener's attach timestamp.
	var getNow = Date.now;

	// Determine what event timestamp the browser is using. Annoyingly, the
	// timestamp can either be hi-res (relative to page load) or low-res
	// (relative to UNIX epoch), so in order to compare time we have to use the
	// same timestamp type when saving the flush timestamp.
	// All IE versions use low-res event timestamps, and have problematic clock
	// implementations (#9632)
	if (inBrowser$1 && !isIE) {
	  var performance = window.performance;
	  if (
	    performance &&
	    typeof performance.now === 'function' &&
	    getNow() > document.createEvent('Event').timeStamp
	  ) {
	    // if the event timestamp, although evaluated AFTER the Date.now(), is
	    // smaller than it, it means the event is using a hi-res timestamp,
	    // and we need to use the hi-res version for event listener timestamps as
	    // well.
	    getNow = function () { return performance.now(); };
	  }
	}

	/**
	 * Flush both queues and run the watchers.
	 */
	function flushSchedulerQueue () {
	  currentFlushTimestamp = getNow();
	  flushing = true;
	  var watcher, id;

	  // Sort queue before flush.
	  // This ensures that:
	  // 1. Components are updated from parent to child. (because parent is always
	  //    created before the child)
	  // 2. A component's user watchers are run before its render watcher (because
	  //    user watchers are created before the render watcher)
	  // 3. If a component is destroyed during a parent component's watcher run,
	  //    its watchers can be skipped.
	  queue.sort(function (a, b) { return a.id - b.id; });

	  // do not cache length because more watchers might be pushed
	  // as we run existing watchers
	  for (index = 0; index < queue.length; index++) {
	    watcher = queue[index];
	    if (watcher.before) {
	      watcher.before();
	    }
	    id = watcher.id;
	    has[id] = null;
	    watcher.run();
	    // in dev build, check and stop circular updates.
	    if (has[id] != null) {
	      circular[id] = (circular[id] || 0) + 1;
	      if (circular[id] > MAX_UPDATE_COUNT) {
	        warn$1(
	          'You may have an infinite update loop ' + (
	            watcher.user
	              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
	              : "in a component render function."
	          ),
	          watcher.vm
	        );
	        break
	      }
	    }
	  }

	  // keep copies of post queues before resetting state
	  var activatedQueue = activatedChildren.slice();
	  var updatedQueue = queue.slice();

	  resetSchedulerState();

	  // call component updated and activated hooks
	  callActivatedHooks(activatedQueue);
	  callUpdatedHooks(updatedQueue);

	  // devtool hook
	  /* istanbul ignore if */
	  if (devtools && config.devtools) {
	    devtools.emit('flush');
	  }
	}

	function callUpdatedHooks (queue) {
	  var i = queue.length;
	  while (i--) {
	    var watcher = queue[i];
	    var vm = watcher.vm;
	    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
	      callHook(vm, 'updated');
	    }
	  }
	}

	/**
	 * Queue a kept-alive component that was activated during patch.
	 * The queue will be processed after the entire tree has been patched.
	 */
	function queueActivatedComponent (vm) {
	  // setting _inactive to false here so that a render function can
	  // rely on checking whether it's in an inactive tree (e.g. router-view)
	  vm._inactive = false;
	  activatedChildren.push(vm);
	}

	function callActivatedHooks (queue) {
	  for (var i = 0; i < queue.length; i++) {
	    queue[i]._inactive = true;
	    activateChildComponent(queue[i], true /* true */);
	  }
	}

	/**
	 * Push a watcher into the watcher queue.
	 * Jobs with duplicate IDs will be skipped unless it's
	 * pushed when the queue is being flushed.
	 */
	function queueWatcher (watcher) {
	  var id = watcher.id;
	  if (has[id] == null) {
	    has[id] = true;
	    if (!flushing) {
	      queue.push(watcher);
	    } else {
	      // if already flushing, splice the watcher based on its id
	      // if already past its id, it will be run next immediately.
	      var i = queue.length - 1;
	      while (i > index && queue[i].id > watcher.id) {
	        i--;
	      }
	      queue.splice(i + 1, 0, watcher);
	    }
	    // queue the flush
	    if (!waiting) {
	      waiting = true;

	      if (!config.async) {
	        flushSchedulerQueue();
	        return
	      }
	      nextTick(flushSchedulerQueue);
	    }
	  }
	}

	/*  */



	var uid$2 = 0;

	/**
	 * A watcher parses an expression, collects dependencies,
	 * and fires callback when the expression value changes.
	 * This is used for both the $watch() api and directives.
	 */
	var Watcher = function Watcher (
	  vm,
	  expOrFn,
	  cb,
	  options,
	  isRenderWatcher
	) {
	  this.vm = vm;
	  if (isRenderWatcher) {
	    vm._watcher = this;
	  }
	  vm._watchers.push(this);
	  // options
	  if (options) {
	    this.deep = !!options.deep;
	    this.user = !!options.user;
	    this.lazy = !!options.lazy;
	    this.sync = !!options.sync;
	    this.before = options.before;
	  } else {
	    this.deep = this.user = this.lazy = this.sync = false;
	  }
	  this.cb = cb;
	  this.id = ++uid$2; // uid for batching
	  this.active = true;
	  this.dirty = this.lazy; // for lazy watchers
	  this.deps = [];
	  this.newDeps = [];
	  this.depIds = new _Set();
	  this.newDepIds = new _Set();
	  this.expression = expOrFn.toString();
	  // parse expression for getter
	  if (typeof expOrFn === 'function') {
	    this.getter = expOrFn;
	  } else {
	    this.getter = parsePath$1(expOrFn);
	    if (!this.getter) {
	      this.getter = noop$1;
	      warn$1(
	        "Failed watching path: \"" + expOrFn + "\" " +
	        'Watcher only accepts simple dot-delimited paths. ' +
	        'For full control, use a function instead.',
	        vm
	      );
	    }
	  }
	  this.value = this.lazy
	    ? undefined
	    : this.get();
	};

	/**
	 * Evaluate the getter, and re-collect dependencies.
	 */
	Watcher.prototype.get = function get () {
	  pushTarget(this);
	  var value;
	  var vm = this.vm;
	  try {
	    value = this.getter.call(vm, vm);
	  } catch (e) {
	    if (this.user) {
	      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
	    } else {
	      throw e
	    }
	  } finally {
	    // "touch" every property so they are all tracked as
	    // dependencies for deep watching
	    if (this.deep) {
	      traverse(value);
	    }
	    popTarget();
	    this.cleanupDeps();
	  }
	  return value
	};

	/**
	 * Add a dependency to this directive.
	 */
	Watcher.prototype.addDep = function addDep (dep) {
	  var id = dep.id;
	  if (!this.newDepIds.has(id)) {
	    this.newDepIds.add(id);
	    this.newDeps.push(dep);
	    if (!this.depIds.has(id)) {
	      dep.addSub(this);
	    }
	  }
	};

	/**
	 * Clean up for dependency collection.
	 */
	Watcher.prototype.cleanupDeps = function cleanupDeps () {
	  var i = this.deps.length;
	  while (i--) {
	    var dep = this.deps[i];
	    if (!this.newDepIds.has(dep.id)) {
	      dep.removeSub(this);
	    }
	  }
	  var tmp = this.depIds;
	  this.depIds = this.newDepIds;
	  this.newDepIds = tmp;
	  this.newDepIds.clear();
	  tmp = this.deps;
	  this.deps = this.newDeps;
	  this.newDeps = tmp;
	  this.newDeps.length = 0;
	};

	/**
	 * Subscriber interface.
	 * Will be called when a dependency changes.
	 */
	Watcher.prototype.update = function update () {
	  /* istanbul ignore else */
	  if (this.lazy) {
	    this.dirty = true;
	  } else if (this.sync) {
	    this.run();
	  } else {
	    queueWatcher(this);
	  }
	};

	/**
	 * Scheduler job interface.
	 * Will be called by the scheduler.
	 */
	Watcher.prototype.run = function run () {
	  if (this.active) {
	    var value = this.get();
	    if (
	      value !== this.value ||
	      // Deep watchers and watchers on Object/Arrays should fire even
	      // when the value is the same, because the value may
	      // have mutated.
	      isObject(value) ||
	      this.deep
	    ) {
	      // set new value
	      var oldValue = this.value;
	      this.value = value;
	      if (this.user) {
	        try {
	          this.cb.call(this.vm, value, oldValue);
	        } catch (e) {
	          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
	        }
	      } else {
	        this.cb.call(this.vm, value, oldValue);
	      }
	    }
	  }
	};

	/**
	 * Evaluate the value of the watcher.
	 * This only gets called for lazy watchers.
	 */
	Watcher.prototype.evaluate = function evaluate () {
	  this.value = this.get();
	  this.dirty = false;
	};

	/**
	 * Depend on all deps collected by this watcher.
	 */
	Watcher.prototype.depend = function depend () {
	  var i = this.deps.length;
	  while (i--) {
	    this.deps[i].depend();
	  }
	};

	/**
	 * Remove self from all dependencies' subscriber list.
	 */
	Watcher.prototype.teardown = function teardown () {
	  if (this.active) {
	    // remove self from vm's watcher list
	    // this is a somewhat expensive operation so we skip it
	    // if the vm is being destroyed.
	    if (!this.vm._isBeingDestroyed) {
	      remove(this.vm._watchers, this);
	    }
	    var i = this.deps.length;
	    while (i--) {
	      this.deps[i].removeSub(this);
	    }
	    this.active = false;
	  }
	};

	/*  */

	var sharedPropertyDefinition = {
	  enumerable: true,
	  configurable: true,
	  get: noop$1,
	  set: noop$1
	};

	function proxy (target, sourceKey, key) {
	  sharedPropertyDefinition.get = function proxyGetter () {
	    return this[sourceKey][key]
	  };
	  sharedPropertyDefinition.set = function proxySetter (val) {
	    this[sourceKey][key] = val;
	  };
	  Object.defineProperty(target, key, sharedPropertyDefinition);
	}

	function initState (vm) {
	  vm._watchers = [];
	  var opts = vm.$options;
	  if (opts.props) { initProps(vm, opts.props); }
	  if (opts.methods) { initMethods(vm, opts.methods); }
	  if (opts.data) {
	    initData(vm);
	  } else {
	    observe(vm._data = {}, true /* asRootData */);
	  }
	  if (opts.computed) { initComputed(vm, opts.computed); }
	  if (opts.watch && opts.watch !== nativeWatch) {
	    initWatch(vm, opts.watch);
	  }
	}

	function initProps (vm, propsOptions) {
	  var propsData = vm.$options.propsData || {};
	  var props = vm._props = {};
	  // cache prop keys so that future props updates can iterate using Array
	  // instead of dynamic object key enumeration.
	  var keys = vm.$options._propKeys = [];
	  var isRoot = !vm.$parent;
	  // root instance props should be converted
	  if (!isRoot) {
	    toggleObserving(false);
	  }
	  var loop = function ( key ) {
	    keys.push(key);
	    var value = validateProp(key, propsOptions, propsData, vm);
	    /* istanbul ignore else */
	    {
	      var hyphenatedKey = hyphenate(key);
	      if (isReservedAttribute(hyphenatedKey) ||
	          config.isReservedAttr(hyphenatedKey)) {
	        warn$1(
	          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
	          vm
	        );
	      }
	      defineReactive$$1(props, key, value, function () {
	        if (!isRoot && !isUpdatingChildComponent) {
	          warn$1(
	            "Avoid mutating a prop directly since the value will be " +
	            "overwritten whenever the parent component re-renders. " +
	            "Instead, use a data or computed property based on the prop's " +
	            "value. Prop being mutated: \"" + key + "\"",
	            vm
	          );
	        }
	      });
	    }
	    // static props are already proxied on the component's prototype
	    // during Vue.extend(). We only need to proxy props defined at
	    // instantiation here.
	    if (!(key in vm)) {
	      proxy(vm, "_props", key);
	    }
	  };

	  for (var key in propsOptions) loop( key );
	  toggleObserving(true);
	}

	function initData (vm) {
	  var data = vm.$options.data;
	  data = vm._data = typeof data === 'function'
	    ? getData(data, vm)
	    : data || {};
	  if (!isPlainObject(data)) {
	    data = {};
	    warn$1(
	      'data functions should return an object:\n' +
	      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
	      vm
	    );
	  }
	  // proxy data on instance
	  var keys = Object.keys(data);
	  var props = vm.$options.props;
	  var methods = vm.$options.methods;
	  var i = keys.length;
	  while (i--) {
	    var key = keys[i];
	    {
	      if (methods && hasOwn(methods, key)) {
	        warn$1(
	          ("Method \"" + key + "\" has already been defined as a data property."),
	          vm
	        );
	      }
	    }
	    if (props && hasOwn(props, key)) {
	      warn$1(
	        "The data property \"" + key + "\" is already declared as a prop. " +
	        "Use prop default value instead.",
	        vm
	      );
	    } else if (!isReserved(key)) {
	      proxy(vm, "_data", key);
	    }
	  }
	  // observe data
	  observe(data, true /* asRootData */);
	}

	function getData (data, vm) {
	  // #7573 disable dep collection when invoking data getters
	  pushTarget();
	  try {
	    return data.call(vm, vm)
	  } catch (e) {
	    handleError(e, vm, "data()");
	    return {}
	  } finally {
	    popTarget();
	  }
	}

	var computedWatcherOptions = { lazy: true };

	function initComputed (vm, computed) {
	  // $flow-disable-line
	  var watchers = vm._computedWatchers = Object.create(null);
	  // computed properties are just getters during SSR
	  var isSSR = isServerRendering();

	  for (var key in computed) {
	    var userDef = computed[key];
	    var getter = typeof userDef === 'function' ? userDef : userDef.get;
	    if (getter == null) {
	      warn$1(
	        ("Getter is missing for computed property \"" + key + "\"."),
	        vm
	      );
	    }

	    if (!isSSR) {
	      // create internal watcher for the computed property.
	      watchers[key] = new Watcher(
	        vm,
	        getter || noop$1,
	        noop$1,
	        computedWatcherOptions
	      );
	    }

	    // component-defined computed properties are already defined on the
	    // component prototype. We only need to define computed properties defined
	    // at instantiation here.
	    if (!(key in vm)) {
	      defineComputed(vm, key, userDef);
	    } else {
	      if (key in vm.$data) {
	        warn$1(("The computed property \"" + key + "\" is already defined in data."), vm);
	      } else if (vm.$options.props && key in vm.$options.props) {
	        warn$1(("The computed property \"" + key + "\" is already defined as a prop."), vm);
	      }
	    }
	  }
	}

	function defineComputed (
	  target,
	  key,
	  userDef
	) {
	  var shouldCache = !isServerRendering();
	  if (typeof userDef === 'function') {
	    sharedPropertyDefinition.get = shouldCache
	      ? createComputedGetter(key)
	      : createGetterInvoker(userDef);
	    sharedPropertyDefinition.set = noop$1;
	  } else {
	    sharedPropertyDefinition.get = userDef.get
	      ? shouldCache && userDef.cache !== false
	        ? createComputedGetter(key)
	        : createGetterInvoker(userDef.get)
	      : noop$1;
	    sharedPropertyDefinition.set = userDef.set || noop$1;
	  }
	  if (sharedPropertyDefinition.set === noop$1) {
	    sharedPropertyDefinition.set = function () {
	      warn$1(
	        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
	        this
	      );
	    };
	  }
	  Object.defineProperty(target, key, sharedPropertyDefinition);
	}

	function createComputedGetter (key) {
	  return function computedGetter () {
	    var watcher = this._computedWatchers && this._computedWatchers[key];
	    if (watcher) {
	      if (watcher.dirty) {
	        watcher.evaluate();
	      }
	      if (Dep.target) {
	        watcher.depend();
	      }
	      return watcher.value
	    }
	  }
	}

	function createGetterInvoker(fn) {
	  return function computedGetter () {
	    return fn.call(this, this)
	  }
	}

	function initMethods (vm, methods) {
	  var props = vm.$options.props;
	  for (var key in methods) {
	    {
	      if (typeof methods[key] !== 'function') {
	        warn$1(
	          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
	          "Did you reference the function correctly?",
	          vm
	        );
	      }
	      if (props && hasOwn(props, key)) {
	        warn$1(
	          ("Method \"" + key + "\" has already been defined as a prop."),
	          vm
	        );
	      }
	      if ((key in vm) && isReserved(key)) {
	        warn$1(
	          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
	          "Avoid defining component methods that start with _ or $."
	        );
	      }
	    }
	    vm[key] = typeof methods[key] !== 'function' ? noop$1 : bind(methods[key], vm);
	  }
	}

	function initWatch (vm, watch) {
	  for (var key in watch) {
	    var handler = watch[key];
	    if (Array.isArray(handler)) {
	      for (var i = 0; i < handler.length; i++) {
	        createWatcher(vm, key, handler[i]);
	      }
	    } else {
	      createWatcher(vm, key, handler);
	    }
	  }
	}

	function createWatcher (
	  vm,
	  expOrFn,
	  handler,
	  options
	) {
	  if (isPlainObject(handler)) {
	    options = handler;
	    handler = handler.handler;
	  }
	  if (typeof handler === 'string') {
	    handler = vm[handler];
	  }
	  return vm.$watch(expOrFn, handler, options)
	}

	function stateMixin (Vue) {
	  // flow somehow has problems with directly declared definition object
	  // when using Object.defineProperty, so we have to procedurally build up
	  // the object here.
	  var dataDef = {};
	  dataDef.get = function () { return this._data };
	  var propsDef = {};
	  propsDef.get = function () { return this._props };
	  {
	    dataDef.set = function () {
	      warn$1(
	        'Avoid replacing instance root $data. ' +
	        'Use nested data properties instead.',
	        this
	      );
	    };
	    propsDef.set = function () {
	      warn$1("$props is readonly.", this);
	    };
	  }
	  Object.defineProperty(Vue.prototype, '$data', dataDef);
	  Object.defineProperty(Vue.prototype, '$props', propsDef);

	  Vue.prototype.$set = set;
	  Vue.prototype.$delete = del;

	  Vue.prototype.$watch = function (
	    expOrFn,
	    cb,
	    options
	  ) {
	    var vm = this;
	    if (isPlainObject(cb)) {
	      return createWatcher(vm, expOrFn, cb, options)
	    }
	    options = options || {};
	    options.user = true;
	    var watcher = new Watcher(vm, expOrFn, cb, options);
	    if (options.immediate) {
	      try {
	        cb.call(vm, watcher.value);
	      } catch (error) {
	        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
	      }
	    }
	    return function unwatchFn () {
	      watcher.teardown();
	    }
	  };
	}

	/*  */

	var uid$3 = 0;

	function initMixin (Vue) {
	  Vue.prototype._init = function (options) {
	    var vm = this;
	    // a uid
	    vm._uid = uid$3++;

	    var startTag, endTag;
	    /* istanbul ignore if */
	    if (config.performance && mark) {
	      startTag = "vue-perf-start:" + (vm._uid);
	      endTag = "vue-perf-end:" + (vm._uid);
	      mark(startTag);
	    }

	    // a flag to avoid this being observed
	    vm._isVue = true;
	    // merge options
	    if (options && options._isComponent) {
	      // optimize internal component instantiation
	      // since dynamic options merging is pretty slow, and none of the
	      // internal component options needs special treatment.
	      initInternalComponent(vm, options);
	    } else {
	      vm.$options = mergeOptions(
	        resolveConstructorOptions(vm.constructor),
	        options || {},
	        vm
	      );
	    }
	    /* istanbul ignore else */
	    {
	      initProxy(vm);
	    }
	    // expose real self
	    vm._self = vm;
	    initLifecycle(vm);
	    initEvents(vm);
	    initRender(vm);
	    callHook(vm, 'beforeCreate');
	    initInjections(vm); // resolve injections before data/props
	    initState(vm);
	    initProvide(vm); // resolve provide after data/props
	    callHook(vm, 'created');

	    /* istanbul ignore if */
	    if (config.performance && mark) {
	      vm._name = formatComponentName(vm, false);
	      mark(endTag);
	      measure(("vue " + (vm._name) + " init"), startTag, endTag);
	    }

	    if (vm.$options.el) {
	      vm.$mount(vm.$options.el);
	    }
	  };
	}

	function initInternalComponent (vm, options) {
	  var opts = vm.$options = Object.create(vm.constructor.options);
	  // doing this because it's faster than dynamic enumeration.
	  var parentVnode = options._parentVnode;
	  opts.parent = options.parent;
	  opts._parentVnode = parentVnode;

	  var vnodeComponentOptions = parentVnode.componentOptions;
	  opts.propsData = vnodeComponentOptions.propsData;
	  opts._parentListeners = vnodeComponentOptions.listeners;
	  opts._renderChildren = vnodeComponentOptions.children;
	  opts._componentTag = vnodeComponentOptions.tag;

	  if (options.render) {
	    opts.render = options.render;
	    opts.staticRenderFns = options.staticRenderFns;
	  }
	}

	function resolveConstructorOptions (Ctor) {
	  var options = Ctor.options;
	  if (Ctor.super) {
	    var superOptions = resolveConstructorOptions(Ctor.super);
	    var cachedSuperOptions = Ctor.superOptions;
	    if (superOptions !== cachedSuperOptions) {
	      // super option changed,
	      // need to resolve new options.
	      Ctor.superOptions = superOptions;
	      // check if there are any late-modified/attached options (#4976)
	      var modifiedOptions = resolveModifiedOptions(Ctor);
	      // update base extend options
	      if (modifiedOptions) {
	        extend$1(Ctor.extendOptions, modifiedOptions);
	      }
	      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
	      if (options.name) {
	        options.components[options.name] = Ctor;
	      }
	    }
	  }
	  return options
	}

	function resolveModifiedOptions (Ctor) {
	  var modified;
	  var latest = Ctor.options;
	  var sealed = Ctor.sealedOptions;
	  for (var key in latest) {
	    if (latest[key] !== sealed[key]) {
	      if (!modified) { modified = {}; }
	      modified[key] = latest[key];
	    }
	  }
	  return modified
	}

	function Vue$1 (options) {
	  if (!(this instanceof Vue$1)
	  ) {
	    warn$1('Vue is a constructor and should be called with the `new` keyword');
	  }
	  this._init(options);
	}

	initMixin(Vue$1);
	stateMixin(Vue$1);
	eventsMixin(Vue$1);
	lifecycleMixin(Vue$1);
	renderMixin(Vue$1);

	/*  */

	function initUse (Vue) {
	  Vue.use = function (plugin) {
	    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
	    if (installedPlugins.indexOf(plugin) > -1) {
	      return this
	    }

	    // additional parameters
	    var args = toArray(arguments, 1);
	    args.unshift(this);
	    if (typeof plugin.install === 'function') {
	      plugin.install.apply(plugin, args);
	    } else if (typeof plugin === 'function') {
	      plugin.apply(null, args);
	    }
	    installedPlugins.push(plugin);
	    return this
	  };
	}

	/*  */

	function initMixin$1 (Vue) {
	  Vue.mixin = function (mixin) {
	    this.options = mergeOptions(this.options, mixin);
	    return this
	  };
	}

	/*  */

	function initExtend (Vue) {
	  /**
	   * Each instance constructor, including Vue, has a unique
	   * cid. This enables us to create wrapped "child
	   * constructors" for prototypal inheritance and cache them.
	   */
	  Vue.cid = 0;
	  var cid = 1;

	  /**
	   * Class inheritance
	   */
	  Vue.extend = function (extendOptions) {
	    extendOptions = extendOptions || {};
	    var Super = this;
	    var SuperId = Super.cid;
	    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
	    if (cachedCtors[SuperId]) {
	      return cachedCtors[SuperId]
	    }

	    var name = extendOptions.name || Super.options.name;
	    if (name) {
	      validateComponentName(name);
	    }

	    var Sub = function VueComponent (options) {
	      this._init(options);
	    };
	    Sub.prototype = Object.create(Super.prototype);
	    Sub.prototype.constructor = Sub;
	    Sub.cid = cid++;
	    Sub.options = mergeOptions(
	      Super.options,
	      extendOptions
	    );
	    Sub['super'] = Super;

	    // For props and computed properties, we define the proxy getters on
	    // the Vue instances at extension time, on the extended prototype. This
	    // avoids Object.defineProperty calls for each instance created.
	    if (Sub.options.props) {
	      initProps$1(Sub);
	    }
	    if (Sub.options.computed) {
	      initComputed$1(Sub);
	    }

	    // allow further extension/mixin/plugin usage
	    Sub.extend = Super.extend;
	    Sub.mixin = Super.mixin;
	    Sub.use = Super.use;

	    // create asset registers, so extended classes
	    // can have their private assets too.
	    ASSET_TYPES.forEach(function (type) {
	      Sub[type] = Super[type];
	    });
	    // enable recursive self-lookup
	    if (name) {
	      Sub.options.components[name] = Sub;
	    }

	    // keep a reference to the super options at extension time.
	    // later at instantiation we can check if Super's options have
	    // been updated.
	    Sub.superOptions = Super.options;
	    Sub.extendOptions = extendOptions;
	    Sub.sealedOptions = extend$1({}, Sub.options);

	    // cache constructor
	    cachedCtors[SuperId] = Sub;
	    return Sub
	  };
	}

	function initProps$1 (Comp) {
	  var props = Comp.options.props;
	  for (var key in props) {
	    proxy(Comp.prototype, "_props", key);
	  }
	}

	function initComputed$1 (Comp) {
	  var computed = Comp.options.computed;
	  for (var key in computed) {
	    defineComputed(Comp.prototype, key, computed[key]);
	  }
	}

	/*  */

	function initAssetRegisters (Vue) {
	  /**
	   * Create asset registration methods.
	   */
	  ASSET_TYPES.forEach(function (type) {
	    Vue[type] = function (
	      id,
	      definition
	    ) {
	      if (!definition) {
	        return this.options[type + 's'][id]
	      } else {
	        /* istanbul ignore if */
	        if (type === 'component') {
	          validateComponentName(id);
	        }
	        if (type === 'component' && isPlainObject(definition)) {
	          definition.name = definition.name || id;
	          definition = this.options._base.extend(definition);
	        }
	        if (type === 'directive' && typeof definition === 'function') {
	          definition = { bind: definition, update: definition };
	        }
	        this.options[type + 's'][id] = definition;
	        return definition
	      }
	    };
	  });
	}

	/*  */



	function getComponentName (opts) {
	  return opts && (opts.Ctor.options.name || opts.tag)
	}

	function matches (pattern, name) {
	  if (Array.isArray(pattern)) {
	    return pattern.indexOf(name) > -1
	  } else if (typeof pattern === 'string') {
	    return pattern.split(',').indexOf(name) > -1
	  } else if (isRegExp(pattern)) {
	    return pattern.test(name)
	  }
	  /* istanbul ignore next */
	  return false
	}

	function pruneCache (keepAliveInstance, filter) {
	  var cache = keepAliveInstance.cache;
	  var keys = keepAliveInstance.keys;
	  var _vnode = keepAliveInstance._vnode;
	  for (var key in cache) {
	    var cachedNode = cache[key];
	    if (cachedNode) {
	      var name = getComponentName(cachedNode.componentOptions);
	      if (name && !filter(name)) {
	        pruneCacheEntry(cache, key, keys, _vnode);
	      }
	    }
	  }
	}

	function pruneCacheEntry (
	  cache,
	  key,
	  keys,
	  current
	) {
	  var cached$$1 = cache[key];
	  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
	    cached$$1.componentInstance.$destroy();
	  }
	  cache[key] = null;
	  remove(keys, key);
	}

	var patternTypes = [String, RegExp, Array];

	var KeepAlive = {
	  name: 'keep-alive',
	  abstract: true,

	  props: {
	    include: patternTypes,
	    exclude: patternTypes,
	    max: [String, Number]
	  },

	  created: function created () {
	    this.cache = Object.create(null);
	    this.keys = [];
	  },

	  destroyed: function destroyed () {
	    for (var key in this.cache) {
	      pruneCacheEntry(this.cache, key, this.keys);
	    }
	  },

	  mounted: function mounted () {
	    var this$1$1 = this;

	    this.$watch('include', function (val) {
	      pruneCache(this$1$1, function (name) { return matches(val, name); });
	    });
	    this.$watch('exclude', function (val) {
	      pruneCache(this$1$1, function (name) { return !matches(val, name); });
	    });
	  },

	  render: function render () {
	    var slot = this.$slots.default;
	    var vnode = getFirstComponentChild(slot);
	    var componentOptions = vnode && vnode.componentOptions;
	    if (componentOptions) {
	      // check pattern
	      var name = getComponentName(componentOptions);
	      var ref = this;
	      var include = ref.include;
	      var exclude = ref.exclude;
	      if (
	        // not included
	        (include && (!name || !matches(include, name))) ||
	        // excluded
	        (exclude && name && matches(exclude, name))
	      ) {
	        return vnode
	      }

	      var ref$1 = this;
	      var cache = ref$1.cache;
	      var keys = ref$1.keys;
	      var key = vnode.key == null
	        // same constructor may get registered as different local components
	        // so cid alone is not enough (#3269)
	        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
	        : vnode.key;
	      if (cache[key]) {
	        vnode.componentInstance = cache[key].componentInstance;
	        // make current key freshest
	        remove(keys, key);
	        keys.push(key);
	      } else {
	        cache[key] = vnode;
	        keys.push(key);
	        // prune oldest entry
	        if (this.max && keys.length > parseInt(this.max)) {
	          pruneCacheEntry(cache, keys[0], keys, this._vnode);
	        }
	      }

	      vnode.data.keepAlive = true;
	    }
	    return vnode || (slot && slot[0])
	  }
	};

	var builtInComponents = {
	  KeepAlive: KeepAlive
	};

	/*  */

	function initGlobalAPI (Vue) {
	  // config
	  var configDef = {};
	  configDef.get = function () { return config; };
	  {
	    configDef.set = function () {
	      warn$1(
	        'Do not replace the Vue.config object, set individual fields instead.'
	      );
	    };
	  }
	  Object.defineProperty(Vue, 'config', configDef);

	  // exposed util methods.
	  // NOTE: these are not considered part of the public API - avoid relying on
	  // them unless you are aware of the risk.
	  Vue.util = {
	    warn: warn$1,
	    extend: extend$1,
	    mergeOptions: mergeOptions,
	    defineReactive: defineReactive$$1
	  };

	  Vue.set = set;
	  Vue.delete = del;
	  Vue.nextTick = nextTick;

	  // 2.6 explicit observable API
	  Vue.observable = function (obj) {
	    observe(obj);
	    return obj
	  };

	  Vue.options = Object.create(null);
	  ASSET_TYPES.forEach(function (type) {
	    Vue.options[type + 's'] = Object.create(null);
	  });

	  // this is used to identify the "base" constructor to extend all plain-object
	  // components with in Weex's multi-instance scenarios.
	  Vue.options._base = Vue;

	  extend$1(Vue.options.components, builtInComponents);

	  initUse(Vue);
	  initMixin$1(Vue);
	  initExtend(Vue);
	  initAssetRegisters(Vue);
	}

	initGlobalAPI(Vue$1);

	Object.defineProperty(Vue$1.prototype, '$isServer', {
	  get: isServerRendering
	});

	Object.defineProperty(Vue$1.prototype, '$ssrContext', {
	  get: function get () {
	    /* istanbul ignore next */
	    return this.$vnode && this.$vnode.ssrContext
	  }
	});

	// expose FunctionalRenderContext for ssr runtime helper installation
	Object.defineProperty(Vue$1, 'FunctionalRenderContext', {
	  value: FunctionalRenderContext
	});

	Vue$1.version = '2.6.11';

	/*  */

	// these are reserved for web because they are directly compiled away
	// during template compilation
	var isReservedAttr = makeMap('style,class');

	// attributes that should be using props for binding
	var acceptValue = makeMap('input,textarea,option,select,progress');
	var mustUseProp = function (tag, type, attr) {
	  return (
	    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
	    (attr === 'selected' && tag === 'option') ||
	    (attr === 'checked' && tag === 'input') ||
	    (attr === 'muted' && tag === 'video')
	  )
	};

	var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

	var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

	var convertEnumeratedValue = function (key, value) {
	  return isFalsyAttrValue(value) || value === 'false'
	    ? 'false'
	    // allow arbitrary string value for contenteditable
	    : key === 'contenteditable' && isValidContentEditableValue(value)
	      ? value
	      : 'true'
	};

	var isBooleanAttr = makeMap(
	  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
	  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
	  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
	  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
	  'required,reversed,scoped,seamless,selected,sortable,translate,' +
	  'truespeed,typemustmatch,visible'
	);

	var xlinkNS = 'http://www.w3.org/1999/xlink';

	var isXlink = function (name) {
	  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
	};

	var getXlinkProp = function (name) {
	  return isXlink(name) ? name.slice(6, name.length) : ''
	};

	var isFalsyAttrValue = function (val) {
	  return val == null || val === false
	};

	/*  */

	function genClassForVnode (vnode) {
	  var data = vnode.data;
	  var parentNode = vnode;
	  var childNode = vnode;
	  while (isDef(childNode.componentInstance)) {
	    childNode = childNode.componentInstance._vnode;
	    if (childNode && childNode.data) {
	      data = mergeClassData(childNode.data, data);
	    }
	  }
	  while (isDef(parentNode = parentNode.parent)) {
	    if (parentNode && parentNode.data) {
	      data = mergeClassData(data, parentNode.data);
	    }
	  }
	  return renderClass(data.staticClass, data.class)
	}

	function mergeClassData (child, parent) {
	  return {
	    staticClass: concat(child.staticClass, parent.staticClass),
	    class: isDef(child.class)
	      ? [child.class, parent.class]
	      : parent.class
	  }
	}

	function renderClass (
	  staticClass,
	  dynamicClass
	) {
	  if (isDef(staticClass) || isDef(dynamicClass)) {
	    return concat(staticClass, stringifyClass(dynamicClass))
	  }
	  /* istanbul ignore next */
	  return ''
	}

	function concat (a, b) {
	  return a ? b ? (a + ' ' + b) : a : (b || '')
	}

	function stringifyClass (value) {
	  if (Array.isArray(value)) {
	    return stringifyArray(value)
	  }
	  if (isObject(value)) {
	    return stringifyObject(value)
	  }
	  if (typeof value === 'string') {
	    return value
	  }
	  /* istanbul ignore next */
	  return ''
	}

	function stringifyArray (value) {
	  var res = '';
	  var stringified;
	  for (var i = 0, l = value.length; i < l; i++) {
	    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
	      if (res) { res += ' '; }
	      res += stringified;
	    }
	  }
	  return res
	}

	function stringifyObject (value) {
	  var res = '';
	  for (var key in value) {
	    if (value[key]) {
	      if (res) { res += ' '; }
	      res += key;
	    }
	  }
	  return res
	}

	/*  */

	var namespaceMap = {
	  svg: 'http://www.w3.org/2000/svg',
	  math: 'http://www.w3.org/1998/Math/MathML'
	};

	var isHTMLTag = makeMap(
	  'html,body,base,head,link,meta,style,title,' +
	  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
	  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
	  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
	  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
	  'embed,object,param,source,canvas,script,noscript,del,ins,' +
	  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
	  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
	  'output,progress,select,textarea,' +
	  'details,dialog,menu,menuitem,summary,' +
	  'content,element,shadow,template,blockquote,iframe,tfoot'
	);

	// this map is intentionally selective, only covering SVG elements that may
	// contain child elements.
	var isSVG = makeMap(
	  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
	  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
	  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
	  true
	);

	var isPreTag = function (tag) { return tag === 'pre'; };

	var isReservedTag = function (tag) {
	  return isHTMLTag(tag) || isSVG(tag)
	};

	function getTagNamespace (tag) {
	  if (isSVG(tag)) {
	    return 'svg'
	  }
	  // basic support for MathML
	  // note it doesn't support other MathML elements being component roots
	  if (tag === 'math') {
	    return 'math'
	  }
	}

	var unknownElementCache = Object.create(null);
	function isUnknownElement (tag) {
	  /* istanbul ignore if */
	  if (!inBrowser$1) {
	    return true
	  }
	  if (isReservedTag(tag)) {
	    return false
	  }
	  tag = tag.toLowerCase();
	  /* istanbul ignore if */
	  if (unknownElementCache[tag] != null) {
	    return unknownElementCache[tag]
	  }
	  var el = document.createElement(tag);
	  if (tag.indexOf('-') > -1) {
	    // http://stackoverflow.com/a/28210364/1070244
	    return (unknownElementCache[tag] = (
	      el.constructor === window.HTMLUnknownElement ||
	      el.constructor === window.HTMLElement
	    ))
	  } else {
	    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
	  }
	}

	var isTextInputType = makeMap('text,number,password,search,email,tel,url');

	/*  */

	/**
	 * Query an element selector if it's not an element already.
	 */
	function query (el) {
	  if (typeof el === 'string') {
	    var selected = document.querySelector(el);
	    if (!selected) {
	      warn$1(
	        'Cannot find element: ' + el
	      );
	      return document.createElement('div')
	    }
	    return selected
	  } else {
	    return el
	  }
	}

	/*  */

	function createElement$1 (tagName, vnode) {
	  var elm = document.createElement(tagName);
	  if (tagName !== 'select') {
	    return elm
	  }
	  // false or null will remove the attribute but undefined will not
	  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
	    elm.setAttribute('multiple', 'multiple');
	  }
	  return elm
	}

	function createElementNS (namespace, tagName) {
	  return document.createElementNS(namespaceMap[namespace], tagName)
	}

	function createTextNode (text) {
	  return document.createTextNode(text)
	}

	function createComment (text) {
	  return document.createComment(text)
	}

	function insertBefore (parentNode, newNode, referenceNode) {
	  parentNode.insertBefore(newNode, referenceNode);
	}

	function removeChild (node, child) {
	  node.removeChild(child);
	}

	function appendChild (node, child) {
	  node.appendChild(child);
	}

	function parentNode (node) {
	  return node.parentNode
	}

	function nextSibling (node) {
	  return node.nextSibling
	}

	function tagName (node) {
	  return node.tagName
	}

	function setTextContent (node, text) {
	  node.textContent = text;
	}

	function setStyleScope (node, scopeId) {
	  node.setAttribute(scopeId, '');
	}

	var nodeOps = /*#__PURE__*/Object.freeze({
	  createElement: createElement$1,
	  createElementNS: createElementNS,
	  createTextNode: createTextNode,
	  createComment: createComment,
	  insertBefore: insertBefore,
	  removeChild: removeChild,
	  appendChild: appendChild,
	  parentNode: parentNode,
	  nextSibling: nextSibling,
	  tagName: tagName,
	  setTextContent: setTextContent,
	  setStyleScope: setStyleScope
	});

	/*  */

	var ref = {
	  create: function create (_, vnode) {
	    registerRef(vnode);
	  },
	  update: function update (oldVnode, vnode) {
	    if (oldVnode.data.ref !== vnode.data.ref) {
	      registerRef(oldVnode, true);
	      registerRef(vnode);
	    }
	  },
	  destroy: function destroy (vnode) {
	    registerRef(vnode, true);
	  }
	};

	function registerRef (vnode, isRemoval) {
	  var key = vnode.data.ref;
	  if (!isDef(key)) { return }

	  var vm = vnode.context;
	  var ref = vnode.componentInstance || vnode.elm;
	  var refs = vm.$refs;
	  if (isRemoval) {
	    if (Array.isArray(refs[key])) {
	      remove(refs[key], ref);
	    } else if (refs[key] === ref) {
	      refs[key] = undefined;
	    }
	  } else {
	    if (vnode.data.refInFor) {
	      if (!Array.isArray(refs[key])) {
	        refs[key] = [ref];
	      } else if (refs[key].indexOf(ref) < 0) {
	        // $flow-disable-line
	        refs[key].push(ref);
	      }
	    } else {
	      refs[key] = ref;
	    }
	  }
	}

	/**
	 * Virtual DOM patching algorithm based on Snabbdom by
	 * Simon Friis Vindum (@paldepind)
	 * Licensed under the MIT License
	 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
	 *
	 * modified by Evan You (@yyx990803)
	 *
	 * Not type-checking this because this file is perf-critical and the cost
	 * of making flow understand it is not worth it.
	 */

	var emptyNode = new VNode('', {}, []);

	var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

	function sameVnode (a, b) {
	  return (
	    a.key === b.key && (
	      (
	        a.tag === b.tag &&
	        a.isComment === b.isComment &&
	        isDef(a.data) === isDef(b.data) &&
	        sameInputType(a, b)
	      ) || (
	        isTrue(a.isAsyncPlaceholder) &&
	        a.asyncFactory === b.asyncFactory &&
	        isUndef(b.asyncFactory.error)
	      )
	    )
	  )
	}

	function sameInputType (a, b) {
	  if (a.tag !== 'input') { return true }
	  var i;
	  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
	  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
	  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
	}

	function createKeyToOldIdx (children, beginIdx, endIdx) {
	  var i, key;
	  var map = {};
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) { map[key] = i; }
	  }
	  return map
	}

	function createPatchFunction (backend) {
	  var i, j;
	  var cbs = {};

	  var modules = backend.modules;
	  var nodeOps = backend.nodeOps;

	  for (i = 0; i < hooks.length; ++i) {
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (isDef(modules[j][hooks[i]])) {
	        cbs[hooks[i]].push(modules[j][hooks[i]]);
	      }
	    }
	  }

	  function emptyNodeAt (elm) {
	    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	  }

	  function createRmCb (childElm, listeners) {
	    function remove$$1 () {
	      if (--remove$$1.listeners === 0) {
	        removeNode(childElm);
	      }
	    }
	    remove$$1.listeners = listeners;
	    return remove$$1
	  }

	  function removeNode (el) {
	    var parent = nodeOps.parentNode(el);
	    // element may have already been removed due to v-html / v-text
	    if (isDef(parent)) {
	      nodeOps.removeChild(parent, el);
	    }
	  }

	  function isUnknownElement$$1 (vnode, inVPre) {
	    return (
	      !inVPre &&
	      !vnode.ns &&
	      !(
	        config.ignoredElements.length &&
	        config.ignoredElements.some(function (ignore) {
	          return isRegExp(ignore)
	            ? ignore.test(vnode.tag)
	            : ignore === vnode.tag
	        })
	      ) &&
	      config.isUnknownElement(vnode.tag)
	    )
	  }

	  var creatingElmInVPre = 0;

	  function createElm (
	    vnode,
	    insertedVnodeQueue,
	    parentElm,
	    refElm,
	    nested,
	    ownerArray,
	    index
	  ) {
	    if (isDef(vnode.elm) && isDef(ownerArray)) {
	      // This vnode was used in a previous render!
	      // now it's used as a new node, overwriting its elm would cause
	      // potential patch errors down the road when it's used as an insertion
	      // reference node. Instead, we clone the node on-demand before creating
	      // associated DOM element for it.
	      vnode = ownerArray[index] = cloneVNode(vnode);
	    }

	    vnode.isRootInsert = !nested; // for transition enter check
	    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
	      return
	    }

	    var data = vnode.data;
	    var children = vnode.children;
	    var tag = vnode.tag;
	    if (isDef(tag)) {
	      {
	        if (data && data.pre) {
	          creatingElmInVPre++;
	        }
	        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
	          warn$1(
	            'Unknown custom element: <' + tag + '> - did you ' +
	            'register the component correctly? For recursive components, ' +
	            'make sure to provide the "name" option.',
	            vnode.context
	          );
	        }
	      }

	      vnode.elm = vnode.ns
	        ? nodeOps.createElementNS(vnode.ns, tag)
	        : nodeOps.createElement(tag, vnode);
	      setScope(vnode);

	      /* istanbul ignore if */
	      {
	        createChildren(vnode, children, insertedVnodeQueue);
	        if (isDef(data)) {
	          invokeCreateHooks(vnode, insertedVnodeQueue);
	        }
	        insert(parentElm, vnode.elm, refElm);
	      }

	      if (data && data.pre) {
	        creatingElmInVPre--;
	      }
	    } else if (isTrue(vnode.isComment)) {
	      vnode.elm = nodeOps.createComment(vnode.text);
	      insert(parentElm, vnode.elm, refElm);
	    } else {
	      vnode.elm = nodeOps.createTextNode(vnode.text);
	      insert(parentElm, vnode.elm, refElm);
	    }
	  }

	  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
	    var i = vnode.data;
	    if (isDef(i)) {
	      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
	      if (isDef(i = i.hook) && isDef(i = i.init)) {
	        i(vnode, false /* hydrating */);
	      }
	      // after calling the init hook, if the vnode is a child component
	      // it should've created a child instance and mounted it. the child
	      // component also has set the placeholder vnode's elm.
	      // in that case we can just return the element and be done.
	      if (isDef(vnode.componentInstance)) {
	        initComponent(vnode, insertedVnodeQueue);
	        insert(parentElm, vnode.elm, refElm);
	        if (isTrue(isReactivated)) {
	          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
	        }
	        return true
	      }
	    }
	  }

	  function initComponent (vnode, insertedVnodeQueue) {
	    if (isDef(vnode.data.pendingInsert)) {
	      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
	      vnode.data.pendingInsert = null;
	    }
	    vnode.elm = vnode.componentInstance.$el;
	    if (isPatchable(vnode)) {
	      invokeCreateHooks(vnode, insertedVnodeQueue);
	      setScope(vnode);
	    } else {
	      // empty component root.
	      // skip all element-related modules except for ref (#3455)
	      registerRef(vnode);
	      // make sure to invoke the insert hook
	      insertedVnodeQueue.push(vnode);
	    }
	  }

	  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
	    var i;
	    // hack for #4339: a reactivated component with inner transition
	    // does not trigger because the inner node's created hooks are not called
	    // again. It's not ideal to involve module-specific logic in here but
	    // there doesn't seem to be a better way to do it.
	    var innerNode = vnode;
	    while (innerNode.componentInstance) {
	      innerNode = innerNode.componentInstance._vnode;
	      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
	        for (i = 0; i < cbs.activate.length; ++i) {
	          cbs.activate[i](emptyNode, innerNode);
	        }
	        insertedVnodeQueue.push(innerNode);
	        break
	      }
	    }
	    // unlike a newly created component,
	    // a reactivated keep-alive component doesn't insert itself
	    insert(parentElm, vnode.elm, refElm);
	  }

	  function insert (parent, elm, ref$$1) {
	    if (isDef(parent)) {
	      if (isDef(ref$$1)) {
	        if (nodeOps.parentNode(ref$$1) === parent) {
	          nodeOps.insertBefore(parent, elm, ref$$1);
	        }
	      } else {
	        nodeOps.appendChild(parent, elm);
	      }
	    }
	  }

	  function createChildren (vnode, children, insertedVnodeQueue) {
	    if (Array.isArray(children)) {
	      {
	        checkDuplicateKeys(children);
	      }
	      for (var i = 0; i < children.length; ++i) {
	        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
	      }
	    } else if (isPrimitive(vnode.text)) {
	      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
	    }
	  }

	  function isPatchable (vnode) {
	    while (vnode.componentInstance) {
	      vnode = vnode.componentInstance._vnode;
	    }
	    return isDef(vnode.tag)
	  }

	  function invokeCreateHooks (vnode, insertedVnodeQueue) {
	    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
	      cbs.create[i$1](emptyNode, vnode);
	    }
	    i = vnode.data.hook; // Reuse variable
	    if (isDef(i)) {
	      if (isDef(i.create)) { i.create(emptyNode, vnode); }
	      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
	    }
	  }

	  // set scope id attribute for scoped CSS.
	  // this is implemented as a special case to avoid the overhead
	  // of going through the normal attribute patching process.
	  function setScope (vnode) {
	    var i;
	    if (isDef(i = vnode.fnScopeId)) {
	      nodeOps.setStyleScope(vnode.elm, i);
	    } else {
	      var ancestor = vnode;
	      while (ancestor) {
	        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
	          nodeOps.setStyleScope(vnode.elm, i);
	        }
	        ancestor = ancestor.parent;
	      }
	    }
	    // for slot content they should also get the scopeId from the host instance.
	    if (isDef(i = activeInstance) &&
	      i !== vnode.context &&
	      i !== vnode.fnContext &&
	      isDef(i = i.$options._scopeId)
	    ) {
	      nodeOps.setStyleScope(vnode.elm, i);
	    }
	  }

	  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
	    }
	  }

	  function invokeDestroyHook (vnode) {
	    var i, j;
	    var data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
	      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
	    }
	    if (isDef(i = vnode.children)) {
	      for (j = 0; j < vnode.children.length; ++j) {
	        invokeDestroyHook(vnode.children[j]);
	      }
	    }
	  }

	  function removeVnodes (vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.tag)) {
	          removeAndInvokeRemoveHook(ch);
	          invokeDestroyHook(ch);
	        } else { // Text node
	          removeNode(ch.elm);
	        }
	      }
	    }
	  }

	  function removeAndInvokeRemoveHook (vnode, rm) {
	    if (isDef(rm) || isDef(vnode.data)) {
	      var i;
	      var listeners = cbs.remove.length + 1;
	      if (isDef(rm)) {
	        // we have a recursively passed down rm callback
	        // increase the listeners count
	        rm.listeners += listeners;
	      } else {
	        // directly removing
	        rm = createRmCb(vnode.elm, listeners);
	      }
	      // recursively invoke hooks on child component root node
	      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
	        removeAndInvokeRemoveHook(i, rm);
	      }
	      for (i = 0; i < cbs.remove.length; ++i) {
	        cbs.remove[i](vnode, rm);
	      }
	      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
	        i(vnode, rm);
	      } else {
	        rm();
	      }
	    } else {
	      removeNode(vnode.elm);
	    }
	  }

	  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
	    var oldStartIdx = 0;
	    var newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

	    // removeOnly is a special flag used only by <transition-group>
	    // to ensure removed elements stay in correct relative positions
	    // during leaving transitions
	    var canMove = !removeOnly;

	    {
	      checkDuplicateKeys(newCh);
	    }

	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
	        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
	        idxInOld = isDef(newStartVnode.key)
	          ? oldKeyToIdx[newStartVnode.key]
	          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
	        if (isUndef(idxInOld)) { // New element
	          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
	        } else {
	          vnodeToMove = oldCh[idxInOld];
	          if (sameVnode(vnodeToMove, newStartVnode)) {
	            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
	            oldCh[idxInOld] = undefined;
	            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
	          } else {
	            // same key but different element. treat as new element
	            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
	          }
	        }
	        newStartVnode = newCh[++newStartIdx];
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
	      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
	    }
	  }

	  function checkDuplicateKeys (children) {
	    var seenKeys = {};
	    for (var i = 0; i < children.length; i++) {
	      var vnode = children[i];
	      var key = vnode.key;
	      if (isDef(key)) {
	        if (seenKeys[key]) {
	          warn$1(
	            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
	            vnode.context
	          );
	        } else {
	          seenKeys[key] = true;
	        }
	      }
	    }
	  }

	  function findIdxInOld (node, oldCh, start, end) {
	    for (var i = start; i < end; i++) {
	      var c = oldCh[i];
	      if (isDef(c) && sameVnode(node, c)) { return i }
	    }
	  }

	  function patchVnode (
	    oldVnode,
	    vnode,
	    insertedVnodeQueue,
	    ownerArray,
	    index,
	    removeOnly
	  ) {
	    if (oldVnode === vnode) {
	      return
	    }

	    if (isDef(vnode.elm) && isDef(ownerArray)) {
	      // clone reused vnode
	      vnode = ownerArray[index] = cloneVNode(vnode);
	    }

	    var elm = vnode.elm = oldVnode.elm;

	    if (isTrue(oldVnode.isAsyncPlaceholder)) {
	      if (isDef(vnode.asyncFactory.resolved)) {
	        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
	      } else {
	        vnode.isAsyncPlaceholder = true;
	      }
	      return
	    }

	    // reuse element for static trees.
	    // note we only do this if the vnode is cloned -
	    // if the new node is not cloned it means the render functions have been
	    // reset by the hot-reload-api and we need to do a proper re-render.
	    if (isTrue(vnode.isStatic) &&
	      isTrue(oldVnode.isStatic) &&
	      vnode.key === oldVnode.key &&
	      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
	    ) {
	      vnode.componentInstance = oldVnode.componentInstance;
	      return
	    }

	    var i;
	    var data = vnode.data;
	    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
	      i(oldVnode, vnode);
	    }

	    var oldCh = oldVnode.children;
	    var ch = vnode.children;
	    if (isDef(data) && isPatchable(vnode)) {
	      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
	      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
	      } else if (isDef(ch)) {
	        {
	          checkDuplicateKeys(ch);
	        }
	        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        nodeOps.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      nodeOps.setTextContent(elm, vnode.text);
	    }
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
	    }
	  }

	  function invokeInsertHook (vnode, queue, initial) {
	    // delay insert hooks for component root nodes, invoke them after the
	    // element is really inserted
	    if (isTrue(initial) && isDef(vnode.parent)) {
	      vnode.parent.data.pendingInsert = queue;
	    } else {
	      for (var i = 0; i < queue.length; ++i) {
	        queue[i].data.hook.insert(queue[i]);
	      }
	    }
	  }

	  var hydrationBailed = false;
	  // list of modules that can skip create hook during hydration because they
	  // are already rendered on the client or has no need for initialization
	  // Note: style is excluded because it relies on initial clone for future
	  // deep updates (#7063).
	  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

	  // Note: this is a browser-only function so we can assume elms are DOM nodes.
	  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
	    var i;
	    var tag = vnode.tag;
	    var data = vnode.data;
	    var children = vnode.children;
	    inVPre = inVPre || (data && data.pre);
	    vnode.elm = elm;

	    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
	      vnode.isAsyncPlaceholder = true;
	      return true
	    }
	    // assert node match
	    {
	      if (!assertNodeMatch(elm, vnode, inVPre)) {
	        return false
	      }
	    }
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
	      if (isDef(i = vnode.componentInstance)) {
	        // child component. it should have hydrated its own tree.
	        initComponent(vnode, insertedVnodeQueue);
	        return true
	      }
	    }
	    if (isDef(tag)) {
	      if (isDef(children)) {
	        // empty element, allow client to pick up and populate children
	        if (!elm.hasChildNodes()) {
	          createChildren(vnode, children, insertedVnodeQueue);
	        } else {
	          // v-html and domProps: innerHTML
	          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
	            if (i !== elm.innerHTML) {
	              /* istanbul ignore if */
	              if (typeof console !== 'undefined' &&
	                !hydrationBailed
	              ) {
	                hydrationBailed = true;
	                console.warn('Parent: ', elm);
	                console.warn('server innerHTML: ', i);
	                console.warn('client innerHTML: ', elm.innerHTML);
	              }
	              return false
	            }
	          } else {
	            // iterate and compare children lists
	            var childrenMatch = true;
	            var childNode = elm.firstChild;
	            for (var i$1 = 0; i$1 < children.length; i$1++) {
	              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
	                childrenMatch = false;
	                break
	              }
	              childNode = childNode.nextSibling;
	            }
	            // if childNode is not null, it means the actual childNodes list is
	            // longer than the virtual children list.
	            if (!childrenMatch || childNode) {
	              /* istanbul ignore if */
	              if (typeof console !== 'undefined' &&
	                !hydrationBailed
	              ) {
	                hydrationBailed = true;
	                console.warn('Parent: ', elm);
	                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
	              }
	              return false
	            }
	          }
	        }
	      }
	      if (isDef(data)) {
	        var fullInvoke = false;
	        for (var key in data) {
	          if (!isRenderedModule(key)) {
	            fullInvoke = true;
	            invokeCreateHooks(vnode, insertedVnodeQueue);
	            break
	          }
	        }
	        if (!fullInvoke && data['class']) {
	          // ensure collecting deps for deep class bindings for future updates
	          traverse(data['class']);
	        }
	      }
	    } else if (elm.data !== vnode.text) {
	      elm.data = vnode.text;
	    }
	    return true
	  }

	  function assertNodeMatch (node, vnode, inVPre) {
	    if (isDef(vnode.tag)) {
	      return vnode.tag.indexOf('vue-component') === 0 || (
	        !isUnknownElement$$1(vnode, inVPre) &&
	        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
	      )
	    } else {
	      return node.nodeType === (vnode.isComment ? 8 : 3)
	    }
	  }

	  return function patch (oldVnode, vnode, hydrating, removeOnly) {
	    if (isUndef(vnode)) {
	      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
	      return
	    }

	    var isInitialPatch = false;
	    var insertedVnodeQueue = [];

	    if (isUndef(oldVnode)) {
	      // empty mount (likely as component), create new root element
	      isInitialPatch = true;
	      createElm(vnode, insertedVnodeQueue);
	    } else {
	      var isRealElement = isDef(oldVnode.nodeType);
	      if (!isRealElement && sameVnode(oldVnode, vnode)) {
	        // patch existing root node
	        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
	      } else {
	        if (isRealElement) {
	          // mounting to a real element
	          // check if this is server-rendered content and if we can perform
	          // a successful hydration.
	          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
	            oldVnode.removeAttribute(SSR_ATTR);
	            hydrating = true;
	          }
	          if (isTrue(hydrating)) {
	            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
	              invokeInsertHook(vnode, insertedVnodeQueue, true);
	              return oldVnode
	            } else {
	              warn$1(
	                'The client-side rendered virtual DOM tree is not matching ' +
	                'server-rendered content. This is likely caused by incorrect ' +
	                'HTML markup, for example nesting block-level elements inside ' +
	                '<p>, or missing <tbody>. Bailing hydration and performing ' +
	                'full client-side render.'
	              );
	            }
	          }
	          // either not server-rendered, or hydration failed.
	          // create an empty node and replace it
	          oldVnode = emptyNodeAt(oldVnode);
	        }

	        // replacing existing element
	        var oldElm = oldVnode.elm;
	        var parentElm = nodeOps.parentNode(oldElm);

	        // create new node
	        createElm(
	          vnode,
	          insertedVnodeQueue,
	          // extremely rare edge case: do not insert if old element is in a
	          // leaving transition. Only happens when combining transition +
	          // keep-alive + HOCs. (#4590)
	          oldElm._leaveCb ? null : parentElm,
	          nodeOps.nextSibling(oldElm)
	        );

	        // update parent placeholder node element, recursively
	        if (isDef(vnode.parent)) {
	          var ancestor = vnode.parent;
	          var patchable = isPatchable(vnode);
	          while (ancestor) {
	            for (var i = 0; i < cbs.destroy.length; ++i) {
	              cbs.destroy[i](ancestor);
	            }
	            ancestor.elm = vnode.elm;
	            if (patchable) {
	              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
	                cbs.create[i$1](emptyNode, ancestor);
	              }
	              // #6513
	              // invoke insert hooks that may have been merged by create hooks.
	              // e.g. for directives that uses the "inserted" hook.
	              var insert = ancestor.data.hook.insert;
	              if (insert.merged) {
	                // start at index 1 to avoid re-invoking component mounted hook
	                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
	                  insert.fns[i$2]();
	                }
	              }
	            } else {
	              registerRef(ancestor);
	            }
	            ancestor = ancestor.parent;
	          }
	        }

	        // destroy old node
	        if (isDef(parentElm)) {
	          removeVnodes([oldVnode], 0, 0);
	        } else if (isDef(oldVnode.tag)) {
	          invokeDestroyHook(oldVnode);
	        }
	      }
	    }

	    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
	    return vnode.elm
	  }
	}

	/*  */

	var directives = {
	  create: updateDirectives,
	  update: updateDirectives,
	  destroy: function unbindDirectives (vnode) {
	    updateDirectives(vnode, emptyNode);
	  }
	};

	function updateDirectives (oldVnode, vnode) {
	  if (oldVnode.data.directives || vnode.data.directives) {
	    _update(oldVnode, vnode);
	  }
	}

	function _update (oldVnode, vnode) {
	  var isCreate = oldVnode === emptyNode;
	  var isDestroy = vnode === emptyNode;
	  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
	  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

	  var dirsWithInsert = [];
	  var dirsWithPostpatch = [];

	  var key, oldDir, dir;
	  for (key in newDirs) {
	    oldDir = oldDirs[key];
	    dir = newDirs[key];
	    if (!oldDir) {
	      // new directive, bind
	      callHook$1(dir, 'bind', vnode, oldVnode);
	      if (dir.def && dir.def.inserted) {
	        dirsWithInsert.push(dir);
	      }
	    } else {
	      // existing directive, update
	      dir.oldValue = oldDir.value;
	      dir.oldArg = oldDir.arg;
	      callHook$1(dir, 'update', vnode, oldVnode);
	      if (dir.def && dir.def.componentUpdated) {
	        dirsWithPostpatch.push(dir);
	      }
	    }
	  }

	  if (dirsWithInsert.length) {
	    var callInsert = function () {
	      for (var i = 0; i < dirsWithInsert.length; i++) {
	        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
	      }
	    };
	    if (isCreate) {
	      mergeVNodeHook(vnode, 'insert', callInsert);
	    } else {
	      callInsert();
	    }
	  }

	  if (dirsWithPostpatch.length) {
	    mergeVNodeHook(vnode, 'postpatch', function () {
	      for (var i = 0; i < dirsWithPostpatch.length; i++) {
	        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
	      }
	    });
	  }

	  if (!isCreate) {
	    for (key in oldDirs) {
	      if (!newDirs[key]) {
	        // no longer present, unbind
	        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
	      }
	    }
	  }
	}

	var emptyModifiers = Object.create(null);

	function normalizeDirectives$1 (
	  dirs,
	  vm
	) {
	  var res = Object.create(null);
	  if (!dirs) {
	    // $flow-disable-line
	    return res
	  }
	  var i, dir;
	  for (i = 0; i < dirs.length; i++) {
	    dir = dirs[i];
	    if (!dir.modifiers) {
	      // $flow-disable-line
	      dir.modifiers = emptyModifiers;
	    }
	    res[getRawDirName(dir)] = dir;
	    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
	  }
	  // $flow-disable-line
	  return res
	}

	function getRawDirName (dir) {
	  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
	}

	function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
	  var fn = dir.def && dir.def[hook];
	  if (fn) {
	    try {
	      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
	    } catch (e) {
	      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
	    }
	  }
	}

	var baseModules = [
	  ref,
	  directives
	];

	/*  */

	function updateAttrs (oldVnode, vnode) {
	  var opts = vnode.componentOptions;
	  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
	    return
	  }
	  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
	    return
	  }
	  var key, cur, old;
	  var elm = vnode.elm;
	  var oldAttrs = oldVnode.data.attrs || {};
	  var attrs = vnode.data.attrs || {};
	  // clone observed objects, as the user probably wants to mutate it
	  if (isDef(attrs.__ob__)) {
	    attrs = vnode.data.attrs = extend$1({}, attrs);
	  }

	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      setAttr(elm, key, cur);
	    }
	  }
	  // #4391: in IE9, setting type can reset value for input[type=radio]
	  // #6666: IE/Edge forces progress value down to 1 before setting a max
	  /* istanbul ignore if */
	  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
	    setAttr(elm, 'value', attrs.value);
	  }
	  for (key in oldAttrs) {
	    if (isUndef(attrs[key])) {
	      if (isXlink(key)) {
	        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
	      } else if (!isEnumeratedAttr(key)) {
	        elm.removeAttribute(key);
	      }
	    }
	  }
	}

	function setAttr (el, key, value) {
	  if (el.tagName.indexOf('-') > -1) {
	    baseSetAttr(el, key, value);
	  } else if (isBooleanAttr(key)) {
	    // set attribute for blank value
	    // e.g. <option disabled>Select one</option>
	    if (isFalsyAttrValue(value)) {
	      el.removeAttribute(key);
	    } else {
	      // technically allowfullscreen is a boolean attribute for <iframe>,
	      // but Flash expects a value of "true" when used on <embed> tag
	      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
	        ? 'true'
	        : key;
	      el.setAttribute(key, value);
	    }
	  } else if (isEnumeratedAttr(key)) {
	    el.setAttribute(key, convertEnumeratedValue(key, value));
	  } else if (isXlink(key)) {
	    if (isFalsyAttrValue(value)) {
	      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
	    } else {
	      el.setAttributeNS(xlinkNS, key, value);
	    }
	  } else {
	    baseSetAttr(el, key, value);
	  }
	}

	function baseSetAttr (el, key, value) {
	  if (isFalsyAttrValue(value)) {
	    el.removeAttribute(key);
	  } else {
	    // #7138: IE10 & 11 fires input event when setting placeholder on
	    // <textarea>... block the first input event and remove the blocker
	    // immediately.
	    /* istanbul ignore if */
	    if (
	      isIE && !isIE9 &&
	      el.tagName === 'TEXTAREA' &&
	      key === 'placeholder' && value !== '' && !el.__ieph
	    ) {
	      var blocker = function (e) {
	        e.stopImmediatePropagation();
	        el.removeEventListener('input', blocker);
	      };
	      el.addEventListener('input', blocker);
	      // $flow-disable-line
	      el.__ieph = true; /* IE placeholder patched */
	    }
	    el.setAttribute(key, value);
	  }
	}

	var attrs = {
	  create: updateAttrs,
	  update: updateAttrs
	};

	/*  */

	function updateClass (oldVnode, vnode) {
	  var el = vnode.elm;
	  var data = vnode.data;
	  var oldData = oldVnode.data;
	  if (
	    isUndef(data.staticClass) &&
	    isUndef(data.class) && (
	      isUndef(oldData) || (
	        isUndef(oldData.staticClass) &&
	        isUndef(oldData.class)
	      )
	    )
	  ) {
	    return
	  }

	  var cls = genClassForVnode(vnode);

	  // handle transition classes
	  var transitionClass = el._transitionClasses;
	  if (isDef(transitionClass)) {
	    cls = concat(cls, stringifyClass(transitionClass));
	  }

	  // set the class
	  if (cls !== el._prevClass) {
	    el.setAttribute('class', cls);
	    el._prevClass = cls;
	  }
	}

	var klass = {
	  create: updateClass,
	  update: updateClass
	};

	/*  */

	var validDivisionCharRE = /[\w).+\-_$\]]/;

	function parseFilters (exp) {
	  var inSingle = false;
	  var inDouble = false;
	  var inTemplateString = false;
	  var inRegex = false;
	  var curly = 0;
	  var square = 0;
	  var paren = 0;
	  var lastFilterIndex = 0;
	  var c, prev, i, expression, filters;

	  for (i = 0; i < exp.length; i++) {
	    prev = c;
	    c = exp.charCodeAt(i);
	    if (inSingle) {
	      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
	    } else if (inDouble) {
	      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
	    } else if (inTemplateString) {
	      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
	    } else if (inRegex) {
	      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
	    } else if (
	      c === 0x7C && // pipe
	      exp.charCodeAt(i + 1) !== 0x7C &&
	      exp.charCodeAt(i - 1) !== 0x7C &&
	      !curly && !square && !paren
	    ) {
	      if (expression === undefined) {
	        // first filter, end of expression
	        lastFilterIndex = i + 1;
	        expression = exp.slice(0, i).trim();
	      } else {
	        pushFilter();
	      }
	    } else {
	      switch (c) {
	        case 0x22: inDouble = true; break         // "
	        case 0x27: inSingle = true; break         // '
	        case 0x60: inTemplateString = true; break // `
	        case 0x28: paren++; break                 // (
	        case 0x29: paren--; break                 // )
	        case 0x5B: square++; break                // [
	        case 0x5D: square--; break                // ]
	        case 0x7B: curly++; break                 // {
	        case 0x7D: curly--; break                 // }
	      }
	      if (c === 0x2f) { // /
	        var j = i - 1;
	        var p = (void 0);
	        // find first non-whitespace prev char
	        for (; j >= 0; j--) {
	          p = exp.charAt(j);
	          if (p !== ' ') { break }
	        }
	        if (!p || !validDivisionCharRE.test(p)) {
	          inRegex = true;
	        }
	      }
	    }
	  }

	  if (expression === undefined) {
	    expression = exp.slice(0, i).trim();
	  } else if (lastFilterIndex !== 0) {
	    pushFilter();
	  }

	  function pushFilter () {
	    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
	    lastFilterIndex = i + 1;
	  }

	  if (filters) {
	    for (i = 0; i < filters.length; i++) {
	      expression = wrapFilter(expression, filters[i]);
	    }
	  }

	  return expression
	}

	function wrapFilter (exp, filter) {
	  var i = filter.indexOf('(');
	  if (i < 0) {
	    // _f: resolveFilter
	    return ("_f(\"" + filter + "\")(" + exp + ")")
	  } else {
	    var name = filter.slice(0, i);
	    var args = filter.slice(i + 1);
	    return ("_f(\"" + name + "\")(" + exp + (args !== ')' ? ',' + args : args))
	  }
	}

	/*  */



	/* eslint-disable no-unused-vars */
	function baseWarn (msg, range) {
	  console.error(("[Vue compiler]: " + msg));
	}
	/* eslint-enable no-unused-vars */

	function pluckModuleFunction (
	  modules,
	  key
	) {
	  return modules
	    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
	    : []
	}

	function addProp (el, name, value, range, dynamic) {
	  (el.props || (el.props = [])).push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
	  el.plain = false;
	}

	function addAttr (el, name, value, range, dynamic) {
	  var attrs = dynamic
	    ? (el.dynamicAttrs || (el.dynamicAttrs = []))
	    : (el.attrs || (el.attrs = []));
	  attrs.push(rangeSetItem({ name: name, value: value, dynamic: dynamic }, range));
	  el.plain = false;
	}

	// add a raw attr (use this in preTransforms)
	function addRawAttr (el, name, value, range) {
	  el.attrsMap[name] = value;
	  el.attrsList.push(rangeSetItem({ name: name, value: value }, range));
	}

	function addDirective (
	  el,
	  name,
	  rawName,
	  value,
	  arg,
	  isDynamicArg,
	  modifiers,
	  range
	) {
	  (el.directives || (el.directives = [])).push(rangeSetItem({
	    name: name,
	    rawName: rawName,
	    value: value,
	    arg: arg,
	    isDynamicArg: isDynamicArg,
	    modifiers: modifiers
	  }, range));
	  el.plain = false;
	}

	function prependModifierMarker (symbol, name, dynamic) {
	  return dynamic
	    ? ("_p(" + name + ",\"" + symbol + "\")")
	    : symbol + name // mark the event as captured
	}

	function addHandler (
	  el,
	  name,
	  value,
	  modifiers,
	  important,
	  warn,
	  range,
	  dynamic
	) {
	  modifiers = modifiers || emptyObject;
	  // warn prevent and passive modifier
	  /* istanbul ignore if */
	  if (
	    warn &&
	    modifiers.prevent && modifiers.passive
	  ) {
	    warn(
	      'passive and prevent can\'t be used together. ' +
	      'Passive handler can\'t prevent default event.',
	      range
	    );
	  }

	  // normalize click.right and click.middle since they don't actually fire
	  // this is technically browser-specific, but at least for now browsers are
	  // the only target envs that have right/middle clicks.
	  if (modifiers.right) {
	    if (dynamic) {
	      name = "(" + name + ")==='click'?'contextmenu':(" + name + ")";
	    } else if (name === 'click') {
	      name = 'contextmenu';
	      delete modifiers.right;
	    }
	  } else if (modifiers.middle) {
	    if (dynamic) {
	      name = "(" + name + ")==='click'?'mouseup':(" + name + ")";
	    } else if (name === 'click') {
	      name = 'mouseup';
	    }
	  }

	  // check capture modifier
	  if (modifiers.capture) {
	    delete modifiers.capture;
	    name = prependModifierMarker('!', name, dynamic);
	  }
	  if (modifiers.once) {
	    delete modifiers.once;
	    name = prependModifierMarker('~', name, dynamic);
	  }
	  /* istanbul ignore if */
	  if (modifiers.passive) {
	    delete modifiers.passive;
	    name = prependModifierMarker('&', name, dynamic);
	  }

	  var events;
	  if (modifiers.native) {
	    delete modifiers.native;
	    events = el.nativeEvents || (el.nativeEvents = {});
	  } else {
	    events = el.events || (el.events = {});
	  }

	  var newHandler = rangeSetItem({ value: value.trim(), dynamic: dynamic }, range);
	  if (modifiers !== emptyObject) {
	    newHandler.modifiers = modifiers;
	  }

	  var handlers = events[name];
	  /* istanbul ignore if */
	  if (Array.isArray(handlers)) {
	    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
	  } else if (handlers) {
	    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
	  } else {
	    events[name] = newHandler;
	  }

	  el.plain = false;
	}

	function getRawBindingAttr (
	  el,
	  name
	) {
	  return el.rawAttrsMap[':' + name] ||
	    el.rawAttrsMap['v-bind:' + name] ||
	    el.rawAttrsMap[name]
	}

	function getBindingAttr (
	  el,
	  name,
	  getStatic
	) {
	  var dynamicValue =
	    getAndRemoveAttr(el, ':' + name) ||
	    getAndRemoveAttr(el, 'v-bind:' + name);
	  if (dynamicValue != null) {
	    return parseFilters(dynamicValue)
	  } else if (getStatic !== false) {
	    var staticValue = getAndRemoveAttr(el, name);
	    if (staticValue != null) {
	      return JSON.stringify(staticValue)
	    }
	  }
	}

	// note: this only removes the attr from the Array (attrsList) so that it
	// doesn't get processed by processAttrs.
	// By default it does NOT remove it from the map (attrsMap) because the map is
	// needed during codegen.
	function getAndRemoveAttr (
	  el,
	  name,
	  removeFromMap
	) {
	  var val;
	  if ((val = el.attrsMap[name]) != null) {
	    var list = el.attrsList;
	    for (var i = 0, l = list.length; i < l; i++) {
	      if (list[i].name === name) {
	        list.splice(i, 1);
	        break
	      }
	    }
	  }
	  if (removeFromMap) {
	    delete el.attrsMap[name];
	  }
	  return val
	}

	function getAndRemoveAttrByRegex (
	  el,
	  name
	) {
	  var list = el.attrsList;
	  for (var i = 0, l = list.length; i < l; i++) {
	    var attr = list[i];
	    if (name.test(attr.name)) {
	      list.splice(i, 1);
	      return attr
	    }
	  }
	}

	function rangeSetItem (
	  item,
	  range
	) {
	  if (range) {
	    if (range.start != null) {
	      item.start = range.start;
	    }
	    if (range.end != null) {
	      item.end = range.end;
	    }
	  }
	  return item
	}

	/*  */

	/**
	 * Cross-platform code generation for component v-model
	 */
	function genComponentModel (
	  el,
	  value,
	  modifiers
	) {
	  var ref = modifiers || {};
	  var number = ref.number;
	  var trim = ref.trim;

	  var baseValueExpression = '$$v';
	  var valueExpression = baseValueExpression;
	  if (trim) {
	    valueExpression =
	      "(typeof " + baseValueExpression + " === 'string'" +
	      "? " + baseValueExpression + ".trim()" +
	      ": " + baseValueExpression + ")";
	  }
	  if (number) {
	    valueExpression = "_n(" + valueExpression + ")";
	  }
	  var assignment = genAssignmentCode(value, valueExpression);

	  el.model = {
	    value: ("(" + value + ")"),
	    expression: JSON.stringify(value),
	    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
	  };
	}

	/**
	 * Cross-platform codegen helper for generating v-model value assignment code.
	 */
	function genAssignmentCode (
	  value,
	  assignment
	) {
	  var res = parseModel(value);
	  if (res.key === null) {
	    return (value + "=" + assignment)
	  } else {
	    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
	  }
	}

	/**
	 * Parse a v-model expression into a base path and a final key segment.
	 * Handles both dot-path and possible square brackets.
	 *
	 * Possible cases:
	 *
	 * - test
	 * - test[key]
	 * - test[test1[key]]
	 * - test["a"][key]
	 * - xxx.test[a[a].test1[key]]
	 * - test.xxx.a["asa"][test1[key]]
	 *
	 */

	var len, str, chr, index$1, expressionPos, expressionEndPos;



	function parseModel (val) {
	  // Fix https://github.com/vuejs/vue/pull/7730
	  // allow v-model="obj.val " (trailing whitespace)
	  val = val.trim();
	  len = val.length;

	  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
	    index$1 = val.lastIndexOf('.');
	    if (index$1 > -1) {
	      return {
	        exp: val.slice(0, index$1),
	        key: '"' + val.slice(index$1 + 1) + '"'
	      }
	    } else {
	      return {
	        exp: val,
	        key: null
	      }
	    }
	  }

	  str = val;
	  index$1 = expressionPos = expressionEndPos = 0;

	  while (!eof()) {
	    chr = next();
	    /* istanbul ignore if */
	    if (isStringStart(chr)) {
	      parseString(chr);
	    } else if (chr === 0x5B) {
	      parseBracket(chr);
	    }
	  }

	  return {
	    exp: val.slice(0, expressionPos),
	    key: val.slice(expressionPos + 1, expressionEndPos)
	  }
	}

	function next () {
	  return str.charCodeAt(++index$1)
	}

	function eof () {
	  return index$1 >= len
	}

	function isStringStart (chr) {
	  return chr === 0x22 || chr === 0x27
	}

	function parseBracket (chr) {
	  var inBracket = 1;
	  expressionPos = index$1;
	  while (!eof()) {
	    chr = next();
	    if (isStringStart(chr)) {
	      parseString(chr);
	      continue
	    }
	    if (chr === 0x5B) { inBracket++; }
	    if (chr === 0x5D) { inBracket--; }
	    if (inBracket === 0) {
	      expressionEndPos = index$1;
	      break
	    }
	  }
	}

	function parseString (chr) {
	  var stringQuote = chr;
	  while (!eof()) {
	    chr = next();
	    if (chr === stringQuote) {
	      break
	    }
	  }
	}

	/*  */

	var warn$1$1;

	// in some cases, the event used has to be determined at runtime
	// so we used some reserved tokens during compile.
	var RANGE_TOKEN = '__r';
	var CHECKBOX_RADIO_TOKEN = '__c';

	function model (
	  el,
	  dir,
	  _warn
	) {
	  warn$1$1 = _warn;
	  var value = dir.value;
	  var modifiers = dir.modifiers;
	  var tag = el.tag;
	  var type = el.attrsMap.type;

	  {
	    // inputs with type="file" are read only and setting the input's
	    // value will throw an error.
	    if (tag === 'input' && type === 'file') {
	      warn$1$1(
	        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
	        "File inputs are read only. Use a v-on:change listener instead.",
	        el.rawAttrsMap['v-model']
	      );
	    }
	  }

	  if (el.component) {
	    genComponentModel(el, value, modifiers);
	    // component v-model doesn't need extra runtime
	    return false
	  } else if (tag === 'select') {
	    genSelect(el, value, modifiers);
	  } else if (tag === 'input' && type === 'checkbox') {
	    genCheckboxModel(el, value, modifiers);
	  } else if (tag === 'input' && type === 'radio') {
	    genRadioModel(el, value, modifiers);
	  } else if (tag === 'input' || tag === 'textarea') {
	    genDefaultModel(el, value, modifiers);
	  } else if (!config.isReservedTag(tag)) {
	    genComponentModel(el, value, modifiers);
	    // component v-model doesn't need extra runtime
	    return false
	  } else {
	    warn$1$1(
	      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
	      "v-model is not supported on this element type. " +
	      'If you are working with contenteditable, it\'s recommended to ' +
	      'wrap a library dedicated for that purpose inside a custom component.',
	      el.rawAttrsMap['v-model']
	    );
	  }

	  // ensure runtime directive metadata
	  return true
	}

	function genCheckboxModel (
	  el,
	  value,
	  modifiers
	) {
	  var number = modifiers && modifiers.number;
	  var valueBinding = getBindingAttr(el, 'value') || 'null';
	  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
	  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
	  addProp(el, 'checked',
	    "Array.isArray(" + value + ")" +
	    "?_i(" + value + "," + valueBinding + ")>-1" + (
	      trueValueBinding === 'true'
	        ? (":(" + value + ")")
	        : (":_q(" + value + "," + trueValueBinding + ")")
	    )
	  );
	  addHandler(el, 'change',
	    "var $$a=" + value + "," +
	        '$$el=$event.target,' +
	        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
	    'if(Array.isArray($$a)){' +
	      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
	          '$$i=_i($$a,$$v);' +
	      "if($$el.checked){$$i<0&&(" + (genAssignmentCode(value, '$$a.concat([$$v])')) + ")}" +
	      "else{$$i>-1&&(" + (genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')) + ")}" +
	    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
	    null, true
	  );
	}

	function genRadioModel (
	  el,
	  value,
	  modifiers
	) {
	  var number = modifiers && modifiers.number;
	  var valueBinding = getBindingAttr(el, 'value') || 'null';
	  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
	  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
	  addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
	}

	function genSelect (
	  el,
	  value,
	  modifiers
	) {
	  var number = modifiers && modifiers.number;
	  var selectedVal = "Array.prototype.filter" +
	    ".call($event.target.options,function(o){return o.selected})" +
	    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
	    "return " + (number ? '_n(val)' : 'val') + "})";

	  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
	  var code = "var $$selectedVal = " + selectedVal + ";";
	  code = code + " " + (genAssignmentCode(value, assignment));
	  addHandler(el, 'change', code, null, true);
	}

	function genDefaultModel (
	  el,
	  value,
	  modifiers
	) {
	  var type = el.attrsMap.type;

	  // warn if v-bind:value conflicts with v-model
	  // except for inputs with v-bind:type
	  {
	    var value$1 = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
	    var typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
	    if (value$1 && !typeBinding) {
	      var binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
	      warn$1$1(
	        binding + "=\"" + value$1 + "\" conflicts with v-model on the same element " +
	        'because the latter already expands to a value binding internally',
	        el.rawAttrsMap[binding]
	      );
	    }
	  }

	  var ref = modifiers || {};
	  var lazy = ref.lazy;
	  var number = ref.number;
	  var trim = ref.trim;
	  var needCompositionGuard = !lazy && type !== 'range';
	  var event = lazy
	    ? 'change'
	    : type === 'range'
	      ? RANGE_TOKEN
	      : 'input';

	  var valueExpression = '$event.target.value';
	  if (trim) {
	    valueExpression = "$event.target.value.trim()";
	  }
	  if (number) {
	    valueExpression = "_n(" + valueExpression + ")";
	  }

	  var code = genAssignmentCode(value, valueExpression);
	  if (needCompositionGuard) {
	    code = "if($event.target.composing)return;" + code;
	  }

	  addProp(el, 'value', ("(" + value + ")"));
	  addHandler(el, event, code, null, true);
	  if (trim || number) {
	    addHandler(el, 'blur', '$forceUpdate()');
	  }
	}

	/*  */

	// normalize v-model event tokens that can only be determined at runtime.
	// it's important to place the event as the first in the array because
	// the whole point is ensuring the v-model callback gets called before
	// user-attached handlers.
	function normalizeEvents (on) {
	  /* istanbul ignore if */
	  if (isDef(on[RANGE_TOKEN])) {
	    // IE input[type=range] only supports `change` event
	    var event = isIE ? 'change' : 'input';
	    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
	    delete on[RANGE_TOKEN];
	  }
	  // This was originally intended to fix #4521 but no longer necessary
	  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
	  /* istanbul ignore if */
	  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
	    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
	    delete on[CHECKBOX_RADIO_TOKEN];
	  }
	}

	var target$1;

	function createOnceHandler$1 (event, handler, capture) {
	  var _target = target$1; // save current target element in closure
	  return function onceHandler () {
	    var res = handler.apply(null, arguments);
	    if (res !== null) {
	      remove$2(event, onceHandler, capture, _target);
	    }
	  }
	}

	// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
	// implementation and does not fire microtasks in between event propagation, so
	// safe to exclude.
	var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

	function add$1 (
	  name,
	  handler,
	  capture,
	  passive
	) {
	  // async edge case #6566: inner click event triggers patch, event handler
	  // attached to outer element during patch, and triggered again. This
	  // happens because browsers fire microtask ticks between event propagation.
	  // the solution is simple: we save the timestamp when a handler is attached,
	  // and the handler would only fire if the event passed to it was fired
	  // AFTER it was attached.
	  if (useMicrotaskFix) {
	    var attachedTimestamp = currentFlushTimestamp;
	    var original = handler;
	    handler = original._wrapper = function (e) {
	      if (
	        // no bubbling, should always fire.
	        // this is just a safety net in case event.timeStamp is unreliable in
	        // certain weird environments...
	        e.target === e.currentTarget ||
	        // event is fired after handler attachment
	        e.timeStamp >= attachedTimestamp ||
	        // bail for environments that have buggy event.timeStamp implementations
	        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
	        // #9681 QtWebEngine event.timeStamp is negative value
	        e.timeStamp <= 0 ||
	        // #9448 bail if event is fired in another document in a multi-page
	        // electron/nw.js app, since event.timeStamp will be using a different
	        // starting reference
	        e.target.ownerDocument !== document
	      ) {
	        return original.apply(this, arguments)
	      }
	    };
	  }
	  target$1.addEventListener(
	    name,
	    handler,
	    supportsPassive
	      ? { capture: capture, passive: passive }
	      : capture
	  );
	}

	function remove$2 (
	  name,
	  handler,
	  capture,
	  _target
	) {
	  (_target || target$1).removeEventListener(
	    name,
	    handler._wrapper || handler,
	    capture
	  );
	}

	function updateDOMListeners (oldVnode, vnode) {
	  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
	    return
	  }
	  var on = vnode.data.on || {};
	  var oldOn = oldVnode.data.on || {};
	  target$1 = vnode.elm;
	  normalizeEvents(on);
	  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
	  target$1 = undefined;
	}

	var events = {
	  create: updateDOMListeners,
	  update: updateDOMListeners
	};

	/*  */

	var svgContainer;

	function updateDOMProps (oldVnode, vnode) {
	  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
	    return
	  }
	  var key, cur;
	  var elm = vnode.elm;
	  var oldProps = oldVnode.data.domProps || {};
	  var props = vnode.data.domProps || {};
	  // clone observed objects, as the user probably wants to mutate it
	  if (isDef(props.__ob__)) {
	    props = vnode.data.domProps = extend$1({}, props);
	  }

	  for (key in oldProps) {
	    if (!(key in props)) {
	      elm[key] = '';
	    }
	  }

	  for (key in props) {
	    cur = props[key];
	    // ignore children if the node has textContent or innerHTML,
	    // as these will throw away existing DOM nodes and cause removal errors
	    // on subsequent patches (#3360)
	    if (key === 'textContent' || key === 'innerHTML') {
	      if (vnode.children) { vnode.children.length = 0; }
	      if (cur === oldProps[key]) { continue }
	      // #6601 work around Chrome version <= 55 bug where single textNode
	      // replaced by innerHTML/textContent retains its parentNode property
	      if (elm.childNodes.length === 1) {
	        elm.removeChild(elm.childNodes[0]);
	      }
	    }

	    if (key === 'value' && elm.tagName !== 'PROGRESS') {
	      // store value as _value as well since
	      // non-string values will be stringified
	      elm._value = cur;
	      // avoid resetting cursor position when value is the same
	      var strCur = isUndef(cur) ? '' : String(cur);
	      if (shouldUpdateValue(elm, strCur)) {
	        elm.value = strCur;
	      }
	    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
	      // IE doesn't support innerHTML for SVG elements
	      svgContainer = svgContainer || document.createElement('div');
	      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
	      var svg = svgContainer.firstChild;
	      while (elm.firstChild) {
	        elm.removeChild(elm.firstChild);
	      }
	      while (svg.firstChild) {
	        elm.appendChild(svg.firstChild);
	      }
	    } else if (
	      // skip the update if old and new VDOM state is the same.
	      // `value` is handled separately because the DOM value may be temporarily
	      // out of sync with VDOM state due to focus, composition and modifiers.
	      // This  #4521 by skipping the unnecesarry `checked` update.
	      cur !== oldProps[key]
	    ) {
	      // some property updates can throw
	      // e.g. `value` on <progress> w/ non-finite value
	      try {
	        elm[key] = cur;
	      } catch (e) {}
	    }
	  }
	}

	// check platforms/web/util/attrs.js acceptValue


	function shouldUpdateValue (elm, checkVal) {
	  return (!elm.composing && (
	    elm.tagName === 'OPTION' ||
	    isNotInFocusAndDirty(elm, checkVal) ||
	    isDirtyWithModifiers(elm, checkVal)
	  ))
	}

	function isNotInFocusAndDirty (elm, checkVal) {
	  // return true when textbox (.number and .trim) loses focus and its value is
	  // not equal to the updated value
	  var notInFocus = true;
	  // #6157
	  // work around IE bug when accessing document.activeElement in an iframe
	  try { notInFocus = document.activeElement !== elm; } catch (e) {}
	  return notInFocus && elm.value !== checkVal
	}

	function isDirtyWithModifiers (elm, newVal) {
	  var value = elm.value;
	  var modifiers = elm._vModifiers; // injected by v-model runtime
	  if (isDef(modifiers)) {
	    if (modifiers.number) {
	      return toNumber(value) !== toNumber(newVal)
	    }
	    if (modifiers.trim) {
	      return value.trim() !== newVal.trim()
	    }
	  }
	  return value !== newVal
	}

	var domProps = {
	  create: updateDOMProps,
	  update: updateDOMProps
	};

	/*  */

	var parseStyleText = cached(function (cssText) {
	  var res = {};
	  var listDelimiter = /;(?![^(]*\))/g;
	  var propertyDelimiter = /:(.+)/;
	  cssText.split(listDelimiter).forEach(function (item) {
	    if (item) {
	      var tmp = item.split(propertyDelimiter);
	      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
	    }
	  });
	  return res
	});

	// merge static and dynamic style data on the same vnode
	function normalizeStyleData (data) {
	  var style = normalizeStyleBinding(data.style);
	  // static style is pre-processed into an object during compilation
	  // and is always a fresh object, so it's safe to merge into it
	  return data.staticStyle
	    ? extend$1(data.staticStyle, style)
	    : style
	}

	// normalize possible array / string values into Object
	function normalizeStyleBinding (bindingStyle) {
	  if (Array.isArray(bindingStyle)) {
	    return toObject(bindingStyle)
	  }
	  if (typeof bindingStyle === 'string') {
	    return parseStyleText(bindingStyle)
	  }
	  return bindingStyle
	}

	/**
	 * parent component style should be after child's
	 * so that parent component's style could override it
	 */
	function getStyle (vnode, checkChild) {
	  var res = {};
	  var styleData;

	  if (checkChild) {
	    var childNode = vnode;
	    while (childNode.componentInstance) {
	      childNode = childNode.componentInstance._vnode;
	      if (
	        childNode && childNode.data &&
	        (styleData = normalizeStyleData(childNode.data))
	      ) {
	        extend$1(res, styleData);
	      }
	    }
	  }

	  if ((styleData = normalizeStyleData(vnode.data))) {
	    extend$1(res, styleData);
	  }

	  var parentNode = vnode;
	  while ((parentNode = parentNode.parent)) {
	    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
	      extend$1(res, styleData);
	    }
	  }
	  return res
	}

	/*  */

	var cssVarRE = /^--/;
	var importantRE = /\s*!important$/;
	var setProp = function (el, name, val) {
	  /* istanbul ignore if */
	  if (cssVarRE.test(name)) {
	    el.style.setProperty(name, val);
	  } else if (importantRE.test(val)) {
	    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
	  } else {
	    var normalizedName = normalize(name);
	    if (Array.isArray(val)) {
	      // Support values array created by autoprefixer, e.g.
	      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
	      // Set them one by one, and the browser will only set those it can recognize
	      for (var i = 0, len = val.length; i < len; i++) {
	        el.style[normalizedName] = val[i];
	      }
	    } else {
	      el.style[normalizedName] = val;
	    }
	  }
	};

	var vendorNames = ['Webkit', 'Moz', 'ms'];

	var emptyStyle;
	var normalize = cached(function (prop) {
	  emptyStyle = emptyStyle || document.createElement('div').style;
	  prop = camelize(prop);
	  if (prop !== 'filter' && (prop in emptyStyle)) {
	    return prop
	  }
	  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
	  for (var i = 0; i < vendorNames.length; i++) {
	    var name = vendorNames[i] + capName;
	    if (name in emptyStyle) {
	      return name
	    }
	  }
	});

	function updateStyle (oldVnode, vnode) {
	  var data = vnode.data;
	  var oldData = oldVnode.data;

	  if (isUndef(data.staticStyle) && isUndef(data.style) &&
	    isUndef(oldData.staticStyle) && isUndef(oldData.style)
	  ) {
	    return
	  }

	  var cur, name;
	  var el = vnode.elm;
	  var oldStaticStyle = oldData.staticStyle;
	  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

	  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
	  var oldStyle = oldStaticStyle || oldStyleBinding;

	  var style = normalizeStyleBinding(vnode.data.style) || {};

	  // store normalized style under a different key for next diff
	  // make sure to clone it if it's reactive, since the user likely wants
	  // to mutate it.
	  vnode.data.normalizedStyle = isDef(style.__ob__)
	    ? extend$1({}, style)
	    : style;

	  var newStyle = getStyle(vnode, true);

	  for (name in oldStyle) {
	    if (isUndef(newStyle[name])) {
	      setProp(el, name, '');
	    }
	  }
	  for (name in newStyle) {
	    cur = newStyle[name];
	    if (cur !== oldStyle[name]) {
	      // ie9 setting to null has no effect, must use empty string
	      setProp(el, name, cur == null ? '' : cur);
	    }
	  }
	}

	var style = {
	  create: updateStyle,
	  update: updateStyle
	};

	/*  */

	var whitespaceRE = /\s+/;

	/**
	 * Add class with compatibility for SVG since classList is not supported on
	 * SVG elements in IE
	 */
	function addClass (el, cls) {
	  /* istanbul ignore if */
	  if (!cls || !(cls = cls.trim())) {
	    return
	  }

	  /* istanbul ignore else */
	  if (el.classList) {
	    if (cls.indexOf(' ') > -1) {
	      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
	    } else {
	      el.classList.add(cls);
	    }
	  } else {
	    var cur = " " + (el.getAttribute('class') || '') + " ";
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      el.setAttribute('class', (cur + cls).trim());
	    }
	  }
	}

	/**
	 * Remove class with compatibility for SVG since classList is not supported on
	 * SVG elements in IE
	 */
	function removeClass (el, cls) {
	  /* istanbul ignore if */
	  if (!cls || !(cls = cls.trim())) {
	    return
	  }

	  /* istanbul ignore else */
	  if (el.classList) {
	    if (cls.indexOf(' ') > -1) {
	      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
	    } else {
	      el.classList.remove(cls);
	    }
	    if (!el.classList.length) {
	      el.removeAttribute('class');
	    }
	  } else {
	    var cur = " " + (el.getAttribute('class') || '') + " ";
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    cur = cur.trim();
	    if (cur) {
	      el.setAttribute('class', cur);
	    } else {
	      el.removeAttribute('class');
	    }
	  }
	}

	/*  */

	function resolveTransition (def$$1) {
	  if (!def$$1) {
	    return
	  }
	  /* istanbul ignore else */
	  if (typeof def$$1 === 'object') {
	    var res = {};
	    if (def$$1.css !== false) {
	      extend$1(res, autoCssTransition(def$$1.name || 'v'));
	    }
	    extend$1(res, def$$1);
	    return res
	  } else if (typeof def$$1 === 'string') {
	    return autoCssTransition(def$$1)
	  }
	}

	var autoCssTransition = cached(function (name) {
	  return {
	    enterClass: (name + "-enter"),
	    enterToClass: (name + "-enter-to"),
	    enterActiveClass: (name + "-enter-active"),
	    leaveClass: (name + "-leave"),
	    leaveToClass: (name + "-leave-to"),
	    leaveActiveClass: (name + "-leave-active")
	  }
	});

	var hasTransition = inBrowser$1 && !isIE9;
	var TRANSITION = 'transition';
	var ANIMATION = 'animation';

	// Transition property/event sniffing
	var transitionProp = 'transition';
	var transitionEndEvent = 'transitionend';
	var animationProp = 'animation';
	var animationEndEvent = 'animationend';
	if (hasTransition) {
	  /* istanbul ignore if */
	  if (window.ontransitionend === undefined &&
	    window.onwebkittransitionend !== undefined
	  ) {
	    transitionProp = 'WebkitTransition';
	    transitionEndEvent = 'webkitTransitionEnd';
	  }
	  if (window.onanimationend === undefined &&
	    window.onwebkitanimationend !== undefined
	  ) {
	    animationProp = 'WebkitAnimation';
	    animationEndEvent = 'webkitAnimationEnd';
	  }
	}

	// binding to window is necessary to make hot reload work in IE in strict mode
	var raf = inBrowser$1
	  ? window.requestAnimationFrame
	    ? window.requestAnimationFrame.bind(window)
	    : setTimeout
	  : /* istanbul ignore next */ function (fn) { return fn(); };

	function nextFrame (fn) {
	  raf(function () {
	    raf(fn);
	  });
	}

	function addTransitionClass (el, cls) {
	  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
	  if (transitionClasses.indexOf(cls) < 0) {
	    transitionClasses.push(cls);
	    addClass(el, cls);
	  }
	}

	function removeTransitionClass (el, cls) {
	  if (el._transitionClasses) {
	    remove(el._transitionClasses, cls);
	  }
	  removeClass(el, cls);
	}

	function whenTransitionEnds (
	  el,
	  expectedType,
	  cb
	) {
	  var ref = getTransitionInfo(el, expectedType);
	  var type = ref.type;
	  var timeout = ref.timeout;
	  var propCount = ref.propCount;
	  if (!type) { return cb() }
	  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
	  var ended = 0;
	  var end = function () {
	    el.removeEventListener(event, onEnd);
	    cb();
	  };
	  var onEnd = function (e) {
	    if (e.target === el) {
	      if (++ended >= propCount) {
	        end();
	      }
	    }
	  };
	  setTimeout(function () {
	    if (ended < propCount) {
	      end();
	    }
	  }, timeout + 1);
	  el.addEventListener(event, onEnd);
	}

	var transformRE = /\b(transform|all)(,|$)/;

	function getTransitionInfo (el, expectedType) {
	  var styles = window.getComputedStyle(el);
	  // JSDOM may return undefined for transition properties
	  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
	  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
	  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
	  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
	  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
	  var animationTimeout = getTimeout(animationDelays, animationDurations);

	  var type;
	  var timeout = 0;
	  var propCount = 0;
	  /* istanbul ignore if */
	  if (expectedType === TRANSITION) {
	    if (transitionTimeout > 0) {
	      type = TRANSITION;
	      timeout = transitionTimeout;
	      propCount = transitionDurations.length;
	    }
	  } else if (expectedType === ANIMATION) {
	    if (animationTimeout > 0) {
	      type = ANIMATION;
	      timeout = animationTimeout;
	      propCount = animationDurations.length;
	    }
	  } else {
	    timeout = Math.max(transitionTimeout, animationTimeout);
	    type = timeout > 0
	      ? transitionTimeout > animationTimeout
	        ? TRANSITION
	        : ANIMATION
	      : null;
	    propCount = type
	      ? type === TRANSITION
	        ? transitionDurations.length
	        : animationDurations.length
	      : 0;
	  }
	  var hasTransform =
	    type === TRANSITION &&
	    transformRE.test(styles[transitionProp + 'Property']);
	  return {
	    type: type,
	    timeout: timeout,
	    propCount: propCount,
	    hasTransform: hasTransform
	  }
	}

	function getTimeout (delays, durations) {
	  /* istanbul ignore next */
	  while (delays.length < durations.length) {
	    delays = delays.concat(delays);
	  }

	  return Math.max.apply(null, durations.map(function (d, i) {
	    return toMs(d) + toMs(delays[i])
	  }))
	}

	// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
	// in a locale-dependent way, using a comma instead of a dot.
	// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
	// as a floor function) causing unexpected behaviors
	function toMs (s) {
	  return Number(s.slice(0, -1).replace(',', '.')) * 1000
	}

	/*  */

	function enter (vnode, toggleDisplay) {
	  var el = vnode.elm;

	  // call leave callback now
	  if (isDef(el._leaveCb)) {
	    el._leaveCb.cancelled = true;
	    el._leaveCb();
	  }

	  var data = resolveTransition(vnode.data.transition);
	  if (isUndef(data)) {
	    return
	  }

	  /* istanbul ignore if */
	  if (isDef(el._enterCb) || el.nodeType !== 1) {
	    return
	  }

	  var css = data.css;
	  var type = data.type;
	  var enterClass = data.enterClass;
	  var enterToClass = data.enterToClass;
	  var enterActiveClass = data.enterActiveClass;
	  var appearClass = data.appearClass;
	  var appearToClass = data.appearToClass;
	  var appearActiveClass = data.appearActiveClass;
	  var beforeEnter = data.beforeEnter;
	  var enter = data.enter;
	  var afterEnter = data.afterEnter;
	  var enterCancelled = data.enterCancelled;
	  var beforeAppear = data.beforeAppear;
	  var appear = data.appear;
	  var afterAppear = data.afterAppear;
	  var appearCancelled = data.appearCancelled;
	  var duration = data.duration;

	  // activeInstance will always be the <transition> component managing this
	  // transition. One edge case to check is when the <transition> is placed
	  // as the root node of a child component. In that case we need to check
	  // <transition>'s parent for appear check.
	  var context = activeInstance;
	  var transitionNode = activeInstance.$vnode;
	  while (transitionNode && transitionNode.parent) {
	    context = transitionNode.context;
	    transitionNode = transitionNode.parent;
	  }

	  var isAppear = !context._isMounted || !vnode.isRootInsert;

	  if (isAppear && !appear && appear !== '') {
	    return
	  }

	  var startClass = isAppear && appearClass
	    ? appearClass
	    : enterClass;
	  var activeClass = isAppear && appearActiveClass
	    ? appearActiveClass
	    : enterActiveClass;
	  var toClass = isAppear && appearToClass
	    ? appearToClass
	    : enterToClass;

	  var beforeEnterHook = isAppear
	    ? (beforeAppear || beforeEnter)
	    : beforeEnter;
	  var enterHook = isAppear
	    ? (typeof appear === 'function' ? appear : enter)
	    : enter;
	  var afterEnterHook = isAppear
	    ? (afterAppear || afterEnter)
	    : afterEnter;
	  var enterCancelledHook = isAppear
	    ? (appearCancelled || enterCancelled)
	    : enterCancelled;

	  var explicitEnterDuration = toNumber(
	    isObject(duration)
	      ? duration.enter
	      : duration
	  );

	  if (explicitEnterDuration != null) {
	    checkDuration(explicitEnterDuration, 'enter', vnode);
	  }

	  var expectsCSS = css !== false && !isIE9;
	  var userWantsControl = getHookArgumentsLength(enterHook);

	  var cb = el._enterCb = once$1(function () {
	    if (expectsCSS) {
	      removeTransitionClass(el, toClass);
	      removeTransitionClass(el, activeClass);
	    }
	    if (cb.cancelled) {
	      if (expectsCSS) {
	        removeTransitionClass(el, startClass);
	      }
	      enterCancelledHook && enterCancelledHook(el);
	    } else {
	      afterEnterHook && afterEnterHook(el);
	    }
	    el._enterCb = null;
	  });

	  if (!vnode.data.show) {
	    // remove pending leave element on enter by injecting an insert hook
	    mergeVNodeHook(vnode, 'insert', function () {
	      var parent = el.parentNode;
	      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
	      if (pendingNode &&
	        pendingNode.tag === vnode.tag &&
	        pendingNode.elm._leaveCb
	      ) {
	        pendingNode.elm._leaveCb();
	      }
	      enterHook && enterHook(el, cb);
	    });
	  }

	  // start enter transition
	  beforeEnterHook && beforeEnterHook(el);
	  if (expectsCSS) {
	    addTransitionClass(el, startClass);
	    addTransitionClass(el, activeClass);
	    nextFrame(function () {
	      removeTransitionClass(el, startClass);
	      if (!cb.cancelled) {
	        addTransitionClass(el, toClass);
	        if (!userWantsControl) {
	          if (isValidDuration(explicitEnterDuration)) {
	            setTimeout(cb, explicitEnterDuration);
	          } else {
	            whenTransitionEnds(el, type, cb);
	          }
	        }
	      }
	    });
	  }

	  if (vnode.data.show) {
	    toggleDisplay && toggleDisplay();
	    enterHook && enterHook(el, cb);
	  }

	  if (!expectsCSS && !userWantsControl) {
	    cb();
	  }
	}

	function leave (vnode, rm) {
	  var el = vnode.elm;

	  // call enter callback now
	  if (isDef(el._enterCb)) {
	    el._enterCb.cancelled = true;
	    el._enterCb();
	  }

	  var data = resolveTransition(vnode.data.transition);
	  if (isUndef(data) || el.nodeType !== 1) {
	    return rm()
	  }

	  /* istanbul ignore if */
	  if (isDef(el._leaveCb)) {
	    return
	  }

	  var css = data.css;
	  var type = data.type;
	  var leaveClass = data.leaveClass;
	  var leaveToClass = data.leaveToClass;
	  var leaveActiveClass = data.leaveActiveClass;
	  var beforeLeave = data.beforeLeave;
	  var leave = data.leave;
	  var afterLeave = data.afterLeave;
	  var leaveCancelled = data.leaveCancelled;
	  var delayLeave = data.delayLeave;
	  var duration = data.duration;

	  var expectsCSS = css !== false && !isIE9;
	  var userWantsControl = getHookArgumentsLength(leave);

	  var explicitLeaveDuration = toNumber(
	    isObject(duration)
	      ? duration.leave
	      : duration
	  );

	  if (isDef(explicitLeaveDuration)) {
	    checkDuration(explicitLeaveDuration, 'leave', vnode);
	  }

	  var cb = el._leaveCb = once$1(function () {
	    if (el.parentNode && el.parentNode._pending) {
	      el.parentNode._pending[vnode.key] = null;
	    }
	    if (expectsCSS) {
	      removeTransitionClass(el, leaveToClass);
	      removeTransitionClass(el, leaveActiveClass);
	    }
	    if (cb.cancelled) {
	      if (expectsCSS) {
	        removeTransitionClass(el, leaveClass);
	      }
	      leaveCancelled && leaveCancelled(el);
	    } else {
	      rm();
	      afterLeave && afterLeave(el);
	    }
	    el._leaveCb = null;
	  });

	  if (delayLeave) {
	    delayLeave(performLeave);
	  } else {
	    performLeave();
	  }

	  function performLeave () {
	    // the delayed leave may have already been cancelled
	    if (cb.cancelled) {
	      return
	    }
	    // record leaving element
	    if (!vnode.data.show && el.parentNode) {
	      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
	    }
	    beforeLeave && beforeLeave(el);
	    if (expectsCSS) {
	      addTransitionClass(el, leaveClass);
	      addTransitionClass(el, leaveActiveClass);
	      nextFrame(function () {
	        removeTransitionClass(el, leaveClass);
	        if (!cb.cancelled) {
	          addTransitionClass(el, leaveToClass);
	          if (!userWantsControl) {
	            if (isValidDuration(explicitLeaveDuration)) {
	              setTimeout(cb, explicitLeaveDuration);
	            } else {
	              whenTransitionEnds(el, type, cb);
	            }
	          }
	        }
	      });
	    }
	    leave && leave(el, cb);
	    if (!expectsCSS && !userWantsControl) {
	      cb();
	    }
	  }
	}

	// only used in dev mode
	function checkDuration (val, name, vnode) {
	  if (typeof val !== 'number') {
	    warn$1(
	      "<transition> explicit " + name + " duration is not a valid number - " +
	      "got " + (JSON.stringify(val)) + ".",
	      vnode.context
	    );
	  } else if (isNaN(val)) {
	    warn$1(
	      "<transition> explicit " + name + " duration is NaN - " +
	      'the duration expression might be incorrect.',
	      vnode.context
	    );
	  }
	}

	function isValidDuration (val) {
	  return typeof val === 'number' && !isNaN(val)
	}

	/**
	 * Normalize a transition hook's argument length. The hook may be:
	 * - a merged hook (invoker) with the original in .fns
	 * - a wrapped component method (check ._length)
	 * - a plain function (.length)
	 */
	function getHookArgumentsLength (fn) {
	  if (isUndef(fn)) {
	    return false
	  }
	  var invokerFns = fn.fns;
	  if (isDef(invokerFns)) {
	    // invoker
	    return getHookArgumentsLength(
	      Array.isArray(invokerFns)
	        ? invokerFns[0]
	        : invokerFns
	    )
	  } else {
	    return (fn._length || fn.length) > 1
	  }
	}

	function _enter (_, vnode) {
	  if (vnode.data.show !== true) {
	    enter(vnode);
	  }
	}

	var transition = inBrowser$1 ? {
	  create: _enter,
	  activate: _enter,
	  remove: function remove$$1 (vnode, rm) {
	    /* istanbul ignore else */
	    if (vnode.data.show !== true) {
	      leave(vnode, rm);
	    } else {
	      rm();
	    }
	  }
	} : {};

	var platformModules = [
	  attrs,
	  klass,
	  events,
	  domProps,
	  style,
	  transition
	];

	/*  */

	// the directive module should be applied last, after all
	// built-in modules have been applied.
	var modules = platformModules.concat(baseModules);

	var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

	/**
	 * Not type checking this file because flow doesn't like attaching
	 * properties to Elements.
	 */

	/* istanbul ignore if */
	if (isIE9) {
	  // http://www.matts411.com/post/internet-explorer-9-oninput/
	  document.addEventListener('selectionchange', function () {
	    var el = document.activeElement;
	    if (el && el.vmodel) {
	      trigger(el, 'input');
	    }
	  });
	}

	var directive = {
	  inserted: function inserted (el, binding, vnode, oldVnode) {
	    if (vnode.tag === 'select') {
	      // #6903
	      if (oldVnode.elm && !oldVnode.elm._vOptions) {
	        mergeVNodeHook(vnode, 'postpatch', function () {
	          directive.componentUpdated(el, binding, vnode);
	        });
	      } else {
	        setSelected(el, binding, vnode.context);
	      }
	      el._vOptions = [].map.call(el.options, getValue);
	    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
	      el._vModifiers = binding.modifiers;
	      if (!binding.modifiers.lazy) {
	        el.addEventListener('compositionstart', onCompositionStart);
	        el.addEventListener('compositionend', onCompositionEnd);
	        // Safari < 10.2 & UIWebView doesn't fire compositionend when
	        // switching focus before confirming composition choice
	        // this also fixes the issue where some browsers e.g. iOS Chrome
	        // fires "change" instead of "input" on autocomplete.
	        el.addEventListener('change', onCompositionEnd);
	        /* istanbul ignore if */
	        if (isIE9) {
	          el.vmodel = true;
	        }
	      }
	    }
	  },

	  componentUpdated: function componentUpdated (el, binding, vnode) {
	    if (vnode.tag === 'select') {
	      setSelected(el, binding, vnode.context);
	      // in case the options rendered by v-for have changed,
	      // it's possible that the value is out-of-sync with the rendered options.
	      // detect such cases and filter out values that no longer has a matching
	      // option in the DOM.
	      var prevOptions = el._vOptions;
	      var curOptions = el._vOptions = [].map.call(el.options, getValue);
	      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
	        // trigger change event if
	        // no matching option found for at least one value
	        var needReset = el.multiple
	          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
	          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
	        if (needReset) {
	          trigger(el, 'change');
	        }
	      }
	    }
	  }
	};

	function setSelected (el, binding, vm) {
	  actuallySetSelected(el, binding, vm);
	  /* istanbul ignore if */
	  if (isIE || isEdge) {
	    setTimeout(function () {
	      actuallySetSelected(el, binding, vm);
	    }, 0);
	  }
	}

	function actuallySetSelected (el, binding, vm) {
	  var value = binding.value;
	  var isMultiple = el.multiple;
	  if (isMultiple && !Array.isArray(value)) {
	    warn$1(
	      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
	      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
	      vm
	    );
	    return
	  }
	  var selected, option;
	  for (var i = 0, l = el.options.length; i < l; i++) {
	    option = el.options[i];
	    if (isMultiple) {
	      selected = looseIndexOf(value, getValue(option)) > -1;
	      if (option.selected !== selected) {
	        option.selected = selected;
	      }
	    } else {
	      if (looseEqual(getValue(option), value)) {
	        if (el.selectedIndex !== i) {
	          el.selectedIndex = i;
	        }
	        return
	      }
	    }
	  }
	  if (!isMultiple) {
	    el.selectedIndex = -1;
	  }
	}

	function hasNoMatchingOption (value, options) {
	  return options.every(function (o) { return !looseEqual(o, value); })
	}

	function getValue (option) {
	  return '_value' in option
	    ? option._value
	    : option.value
	}

	function onCompositionStart (e) {
	  e.target.composing = true;
	}

	function onCompositionEnd (e) {
	  // prevent triggering an input event for no reason
	  if (!e.target.composing) { return }
	  e.target.composing = false;
	  trigger(e.target, 'input');
	}

	function trigger (el, type) {
	  var e = document.createEvent('HTMLEvents');
	  e.initEvent(type, true, true);
	  el.dispatchEvent(e);
	}

	/*  */

	// recursively search for possible transition defined inside the component root
	function locateNode (vnode) {
	  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
	    ? locateNode(vnode.componentInstance._vnode)
	    : vnode
	}

	var show = {
	  bind: function bind (el, ref, vnode) {
	    var value = ref.value;

	    vnode = locateNode(vnode);
	    var transition$$1 = vnode.data && vnode.data.transition;
	    var originalDisplay = el.__vOriginalDisplay =
	      el.style.display === 'none' ? '' : el.style.display;
	    if (value && transition$$1) {
	      vnode.data.show = true;
	      enter(vnode, function () {
	        el.style.display = originalDisplay;
	      });
	    } else {
	      el.style.display = value ? originalDisplay : 'none';
	    }
	  },

	  update: function update (el, ref, vnode) {
	    var value = ref.value;
	    var oldValue = ref.oldValue;

	    /* istanbul ignore if */
	    if (!value === !oldValue) { return }
	    vnode = locateNode(vnode);
	    var transition$$1 = vnode.data && vnode.data.transition;
	    if (transition$$1) {
	      vnode.data.show = true;
	      if (value) {
	        enter(vnode, function () {
	          el.style.display = el.__vOriginalDisplay;
	        });
	      } else {
	        leave(vnode, function () {
	          el.style.display = 'none';
	        });
	      }
	    } else {
	      el.style.display = value ? el.__vOriginalDisplay : 'none';
	    }
	  },

	  unbind: function unbind (
	    el,
	    binding,
	    vnode,
	    oldVnode,
	    isDestroy
	  ) {
	    if (!isDestroy) {
	      el.style.display = el.__vOriginalDisplay;
	    }
	  }
	};

	var platformDirectives = {
	  model: directive,
	  show: show
	};

	/*  */

	var transitionProps = {
	  name: String,
	  appear: Boolean,
	  css: Boolean,
	  mode: String,
	  type: String,
	  enterClass: String,
	  leaveClass: String,
	  enterToClass: String,
	  leaveToClass: String,
	  enterActiveClass: String,
	  leaveActiveClass: String,
	  appearClass: String,
	  appearActiveClass: String,
	  appearToClass: String,
	  duration: [Number, String, Object]
	};

	// in case the child is also an abstract component, e.g. <keep-alive>
	// we want to recursively retrieve the real component to be rendered
	function getRealChild (vnode) {
	  var compOptions = vnode && vnode.componentOptions;
	  if (compOptions && compOptions.Ctor.options.abstract) {
	    return getRealChild(getFirstComponentChild(compOptions.children))
	  } else {
	    return vnode
	  }
	}

	function extractTransitionData (comp) {
	  var data = {};
	  var options = comp.$options;
	  // props
	  for (var key in options.propsData) {
	    data[key] = comp[key];
	  }
	  // events.
	  // extract listeners and pass them directly to the transition methods
	  var listeners = options._parentListeners;
	  for (var key$1 in listeners) {
	    data[camelize(key$1)] = listeners[key$1];
	  }
	  return data
	}

	function placeholder (h, rawChild) {
	  if (/\d-keep-alive$/.test(rawChild.tag)) {
	    return h('keep-alive', {
	      props: rawChild.componentOptions.propsData
	    })
	  }
	}

	function hasParentTransition (vnode) {
	  while ((vnode = vnode.parent)) {
	    if (vnode.data.transition) {
	      return true
	    }
	  }
	}

	function isSameChild (child, oldChild) {
	  return oldChild.key === child.key && oldChild.tag === child.tag
	}

	var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

	var isVShowDirective = function (d) { return d.name === 'show'; };

	var Transition = {
	  name: 'transition',
	  props: transitionProps,
	  abstract: true,

	  render: function render (h) {
	    var this$1$1 = this;

	    var children = this.$slots.default;
	    if (!children) {
	      return
	    }

	    // filter out text nodes (possible whitespaces)
	    children = children.filter(isNotTextNode);
	    /* istanbul ignore if */
	    if (!children.length) {
	      return
	    }

	    // warn multiple elements
	    if (children.length > 1) {
	      warn$1(
	        '<transition> can only be used on a single element. Use ' +
	        '<transition-group> for lists.',
	        this.$parent
	      );
	    }

	    var mode = this.mode;

	    // warn invalid mode
	    if (mode && mode !== 'in-out' && mode !== 'out-in'
	    ) {
	      warn$1(
	        'invalid <transition> mode: ' + mode,
	        this.$parent
	      );
	    }

	    var rawChild = children[0];

	    // if this is a component root node and the component's
	    // parent container node also has transition, skip.
	    if (hasParentTransition(this.$vnode)) {
	      return rawChild
	    }

	    // apply transition data to child
	    // use getRealChild() to ignore abstract components e.g. keep-alive
	    var child = getRealChild(rawChild);
	    /* istanbul ignore if */
	    if (!child) {
	      return rawChild
	    }

	    if (this._leaving) {
	      return placeholder(h, rawChild)
	    }

	    // ensure a key that is unique to the vnode type and to this transition
	    // component instance. This key will be used to remove pending leaving nodes
	    // during entering.
	    var id = "__transition-" + (this._uid) + "-";
	    child.key = child.key == null
	      ? child.isComment
	        ? id + 'comment'
	        : id + child.tag
	      : isPrimitive(child.key)
	        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
	        : child.key;

	    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
	    var oldRawChild = this._vnode;
	    var oldChild = getRealChild(oldRawChild);

	    // mark v-show
	    // so that the transition module can hand over the control to the directive
	    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
	      child.data.show = true;
	    }

	    if (
	      oldChild &&
	      oldChild.data &&
	      !isSameChild(child, oldChild) &&
	      !isAsyncPlaceholder(oldChild) &&
	      // #6687 component root is a comment node
	      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
	    ) {
	      // replace old child transition data with fresh one
	      // important for dynamic transitions!
	      var oldData = oldChild.data.transition = extend$1({}, data);
	      // handle transition mode
	      if (mode === 'out-in') {
	        // return placeholder node and queue update when leave finishes
	        this._leaving = true;
	        mergeVNodeHook(oldData, 'afterLeave', function () {
	          this$1$1._leaving = false;
	          this$1$1.$forceUpdate();
	        });
	        return placeholder(h, rawChild)
	      } else if (mode === 'in-out') {
	        if (isAsyncPlaceholder(child)) {
	          return oldRawChild
	        }
	        var delayedLeave;
	        var performLeave = function () { delayedLeave(); };
	        mergeVNodeHook(data, 'afterEnter', performLeave);
	        mergeVNodeHook(data, 'enterCancelled', performLeave);
	        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
	      }
	    }

	    return rawChild
	  }
	};

	/*  */

	var props = extend$1({
	  tag: String,
	  moveClass: String
	}, transitionProps);

	delete props.mode;

	var TransitionGroup = {
	  props: props,

	  beforeMount: function beforeMount () {
	    var this$1$1 = this;

	    var update = this._update;
	    this._update = function (vnode, hydrating) {
	      var restoreActiveInstance = setActiveInstance(this$1$1);
	      // force removing pass
	      this$1$1.__patch__(
	        this$1$1._vnode,
	        this$1$1.kept,
	        false, // hydrating
	        true // removeOnly (!important, avoids unnecessary moves)
	      );
	      this$1$1._vnode = this$1$1.kept;
	      restoreActiveInstance();
	      update.call(this$1$1, vnode, hydrating);
	    };
	  },

	  render: function render (h) {
	    var tag = this.tag || this.$vnode.data.tag || 'span';
	    var map = Object.create(null);
	    var prevChildren = this.prevChildren = this.children;
	    var rawChildren = this.$slots.default || [];
	    var children = this.children = [];
	    var transitionData = extractTransitionData(this);

	    for (var i = 0; i < rawChildren.length; i++) {
	      var c = rawChildren[i];
	      if (c.tag) {
	        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
	          children.push(c);
	          map[c.key] = c
	          ;(c.data || (c.data = {})).transition = transitionData;
	        } else {
	          var opts = c.componentOptions;
	          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
	          warn$1(("<transition-group> children must be keyed: <" + name + ">"));
	        }
	      }
	    }

	    if (prevChildren) {
	      var kept = [];
	      var removed = [];
	      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
	        var c$1 = prevChildren[i$1];
	        c$1.data.transition = transitionData;
	        c$1.data.pos = c$1.elm.getBoundingClientRect();
	        if (map[c$1.key]) {
	          kept.push(c$1);
	        } else {
	          removed.push(c$1);
	        }
	      }
	      this.kept = h(tag, null, kept);
	      this.removed = removed;
	    }

	    return h(tag, null, children)
	  },

	  updated: function updated () {
	    var children = this.prevChildren;
	    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
	    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
	      return
	    }

	    // we divide the work into three loops to avoid mixing DOM reads and writes
	    // in each iteration - which helps prevent layout thrashing.
	    children.forEach(callPendingCbs);
	    children.forEach(recordPosition);
	    children.forEach(applyTranslation);

	    // force reflow to put everything in position
	    // assign to this to avoid being removed in tree-shaking
	    // $flow-disable-line
	    this._reflow = document.body.offsetHeight;

	    children.forEach(function (c) {
	      if (c.data.moved) {
	        var el = c.elm;
	        var s = el.style;
	        addTransitionClass(el, moveClass);
	        s.transform = s.WebkitTransform = s.transitionDuration = '';
	        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
	          if (e && e.target !== el) {
	            return
	          }
	          if (!e || /transform$/.test(e.propertyName)) {
	            el.removeEventListener(transitionEndEvent, cb);
	            el._moveCb = null;
	            removeTransitionClass(el, moveClass);
	          }
	        });
	      }
	    });
	  },

	  methods: {
	    hasMove: function hasMove (el, moveClass) {
	      /* istanbul ignore if */
	      if (!hasTransition) {
	        return false
	      }
	      /* istanbul ignore if */
	      if (this._hasMove) {
	        return this._hasMove
	      }
	      // Detect whether an element with the move class applied has
	      // CSS transitions. Since the element may be inside an entering
	      // transition at this very moment, we make a clone of it and remove
	      // all other transition classes applied to ensure only the move class
	      // is applied.
	      var clone = el.cloneNode();
	      if (el._transitionClasses) {
	        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
	      }
	      addClass(clone, moveClass);
	      clone.style.display = 'none';
	      this.$el.appendChild(clone);
	      var info = getTransitionInfo(clone);
	      this.$el.removeChild(clone);
	      return (this._hasMove = info.hasTransform)
	    }
	  }
	};

	function callPendingCbs (c) {
	  /* istanbul ignore if */
	  if (c.elm._moveCb) {
	    c.elm._moveCb();
	  }
	  /* istanbul ignore if */
	  if (c.elm._enterCb) {
	    c.elm._enterCb();
	  }
	}

	function recordPosition (c) {
	  c.data.newPos = c.elm.getBoundingClientRect();
	}

	function applyTranslation (c) {
	  var oldPos = c.data.pos;
	  var newPos = c.data.newPos;
	  var dx = oldPos.left - newPos.left;
	  var dy = oldPos.top - newPos.top;
	  if (dx || dy) {
	    c.data.moved = true;
	    var s = c.elm.style;
	    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
	    s.transitionDuration = '0s';
	  }
	}

	var platformComponents = {
	  Transition: Transition,
	  TransitionGroup: TransitionGroup
	};

	/*  */

	// install platform specific utils
	Vue$1.config.mustUseProp = mustUseProp;
	Vue$1.config.isReservedTag = isReservedTag;
	Vue$1.config.isReservedAttr = isReservedAttr;
	Vue$1.config.getTagNamespace = getTagNamespace;
	Vue$1.config.isUnknownElement = isUnknownElement;

	// install platform runtime directives & components
	extend$1(Vue$1.options.directives, platformDirectives);
	extend$1(Vue$1.options.components, platformComponents);

	// install platform patch function
	Vue$1.prototype.__patch__ = inBrowser$1 ? patch : noop$1;

	// public mount method
	Vue$1.prototype.$mount = function (
	  el,
	  hydrating
	) {
	  el = el && inBrowser$1 ? query(el) : undefined;
	  return mountComponent(this, el, hydrating)
	};

	// devtools global hook
	/* istanbul ignore next */
	if (inBrowser$1) {
	  setTimeout(function () {
	    if (config.devtools) {
	      if (devtools) {
	        devtools.emit('init', Vue$1);
	      } else {
	        console[console.info ? 'info' : 'log'](
	          'Download the Vue Devtools extension for a better development experience:\n' +
	          'https://github.com/vuejs/vue-devtools'
	        );
	      }
	    }
	    if (config.productionTip !== false &&
	      typeof console !== 'undefined'
	    ) {
	      console[console.info ? 'info' : 'log'](
	        "You are running Vue in development mode.\n" +
	        "Make sure to turn on production mode when deploying for production.\n" +
	        "See more tips at https://vuejs.org/guide/deployment.html"
	      );
	    }
	  }, 0);
	}

	/*  */

	var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
	var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

	var buildRegex = cached(function (delimiters) {
	  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
	  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
	  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
	});



	function parseText (
	  text,
	  delimiters
	) {
	  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
	  if (!tagRE.test(text)) {
	    return
	  }
	  var tokens = [];
	  var rawTokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, tokenValue;
	  while ((match = tagRE.exec(text))) {
	    index = match.index;
	    // push text token
	    if (index > lastIndex) {
	      rawTokens.push(tokenValue = text.slice(lastIndex, index));
	      tokens.push(JSON.stringify(tokenValue));
	    }
	    // tag token
	    var exp = parseFilters(match[1].trim());
	    tokens.push(("_s(" + exp + ")"));
	    rawTokens.push({ '@binding': exp });
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    rawTokens.push(tokenValue = text.slice(lastIndex));
	    tokens.push(JSON.stringify(tokenValue));
	  }
	  return {
	    expression: tokens.join('+'),
	    tokens: rawTokens
	  }
	}

	/*  */

	function transformNode (el, options) {
	  var warn = options.warn || baseWarn;
	  var staticClass = getAndRemoveAttr(el, 'class');
	  if (staticClass) {
	    var res = parseText(staticClass, options.delimiters);
	    if (res) {
	      warn(
	        "class=\"" + staticClass + "\": " +
	        'Interpolation inside attributes has been removed. ' +
	        'Use v-bind or the colon shorthand instead. For example, ' +
	        'instead of <div class="{{ val }}">, use <div :class="val">.',
	        el.rawAttrsMap['class']
	      );
	    }
	  }
	  if (staticClass) {
	    el.staticClass = JSON.stringify(staticClass);
	  }
	  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
	  if (classBinding) {
	    el.classBinding = classBinding;
	  }
	}

	function genData (el) {
	  var data = '';
	  if (el.staticClass) {
	    data += "staticClass:" + (el.staticClass) + ",";
	  }
	  if (el.classBinding) {
	    data += "class:" + (el.classBinding) + ",";
	  }
	  return data
	}

	var klass$1 = {
	  staticKeys: ['staticClass'],
	  transformNode: transformNode,
	  genData: genData
	};

	/*  */

	function transformNode$1 (el, options) {
	  var warn = options.warn || baseWarn;
	  var staticStyle = getAndRemoveAttr(el, 'style');
	  if (staticStyle) {
	    /* istanbul ignore if */
	    {
	      var res = parseText(staticStyle, options.delimiters);
	      if (res) {
	        warn(
	          "style=\"" + staticStyle + "\": " +
	          'Interpolation inside attributes has been removed. ' +
	          'Use v-bind or the colon shorthand instead. For example, ' +
	          'instead of <div style="{{ val }}">, use <div :style="val">.',
	          el.rawAttrsMap['style']
	        );
	      }
	    }
	    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
	  }

	  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
	  if (styleBinding) {
	    el.styleBinding = styleBinding;
	  }
	}

	function genData$1 (el) {
	  var data = '';
	  if (el.staticStyle) {
	    data += "staticStyle:" + (el.staticStyle) + ",";
	  }
	  if (el.styleBinding) {
	    data += "style:(" + (el.styleBinding) + "),";
	  }
	  return data
	}

	var style$1 = {
	  staticKeys: ['staticStyle'],
	  transformNode: transformNode$1,
	  genData: genData$1
	};

	/*  */

	var decoder;

	var he = {
	  decode: function decode (html) {
	    decoder = decoder || document.createElement('div');
	    decoder.innerHTML = html;
	    return decoder.textContent
	  }
	};

	/*  */

	var isUnaryTag = makeMap(
	  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
	  'link,meta,param,source,track,wbr'
	);

	// Elements that you can, intentionally, leave open
	// (and which close themselves)
	var canBeLeftOpenTag = makeMap(
	  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
	);

	// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
	// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
	var isNonPhrasingTag = makeMap(
	  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
	  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
	  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
	  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
	  'title,tr,track'
	);

	/**
	 * Not type-checking this file because it's mostly vendor code.
	 */

	// Regular Expressions for parsing tags and attributes
	var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
	var dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
	var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z" + (unicodeRegExp.source) + "]*";
	var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
	var startTagOpen = new RegExp(("^<" + qnameCapture));
	var startTagClose = /^\s*(\/?)>/;
	var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
	var doctype = /^<!DOCTYPE [^>]+>/i;
	// #7298: escape - to avoid being passed as HTML comment when inlined in page
	var comment = /^<!\--/;
	var conditionalComment = /^<!\[/;

	// Special Elements (can contain anything)
	var isPlainTextElement = makeMap('script,style,textarea', true);
	var reCache = {};

	var decodingMap = {
	  '&lt;': '<',
	  '&gt;': '>',
	  '&quot;': '"',
	  '&amp;': '&',
	  '&#10;': '\n',
	  '&#9;': '\t',
	  '&#39;': "'"
	};
	var encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
	var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

	// #5992
	var isIgnoreNewlineTag = makeMap('pre,textarea', true);
	var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };

	function decodeAttr (value, shouldDecodeNewlines) {
	  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
	  return value.replace(re, function (match) { return decodingMap[match]; })
	}

	function parseHTML (html, options) {
	  var stack = [];
	  var expectHTML = options.expectHTML;
	  var isUnaryTag$$1 = options.isUnaryTag || no;
	  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
	  var index = 0;
	  var last, lastTag;
	  while (html) {
	    last = html;
	    // Make sure we're not in a plaintext content element like script/style
	    if (!lastTag || !isPlainTextElement(lastTag)) {
	      var textEnd = html.indexOf('<');
	      if (textEnd === 0) {
	        // Comment:
	        if (comment.test(html)) {
	          var commentEnd = html.indexOf('-->');

	          if (commentEnd >= 0) {
	            if (options.shouldKeepComment) {
	              options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
	            }
	            advance(commentEnd + 3);
	            continue
	          }
	        }

	        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
	        if (conditionalComment.test(html)) {
	          var conditionalEnd = html.indexOf(']>');

	          if (conditionalEnd >= 0) {
	            advance(conditionalEnd + 2);
	            continue
	          }
	        }

	        // Doctype:
	        var doctypeMatch = html.match(doctype);
	        if (doctypeMatch) {
	          advance(doctypeMatch[0].length);
	          continue
	        }

	        // End tag:
	        var endTagMatch = html.match(endTag);
	        if (endTagMatch) {
	          var curIndex = index;
	          advance(endTagMatch[0].length);
	          parseEndTag(endTagMatch[1], curIndex, index);
	          continue
	        }

	        // Start tag:
	        var startTagMatch = parseStartTag();
	        if (startTagMatch) {
	          handleStartTag(startTagMatch);
	          if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
	            advance(1);
	          }
	          continue
	        }
	      }

	      var text = (void 0), rest = (void 0), next = (void 0);
	      if (textEnd >= 0) {
	        rest = html.slice(textEnd);
	        while (
	          !endTag.test(rest) &&
	          !startTagOpen.test(rest) &&
	          !comment.test(rest) &&
	          !conditionalComment.test(rest)
	        ) {
	          // < in plain text, be forgiving and treat it as text
	          next = rest.indexOf('<', 1);
	          if (next < 0) { break }
	          textEnd += next;
	          rest = html.slice(textEnd);
	        }
	        text = html.substring(0, textEnd);
	      }

	      if (textEnd < 0) {
	        text = html;
	      }

	      if (text) {
	        advance(text.length);
	      }

	      if (options.chars && text) {
	        options.chars(text, index - text.length, index);
	      }
	    } else {
	      var endTagLength = 0;
	      var stackedTag = lastTag.toLowerCase();
	      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
	      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) {
	        endTagLength = endTag.length;
	        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
	          text = text
	            .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
	            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
	        }
	        if (shouldIgnoreFirstNewline(stackedTag, text)) {
	          text = text.slice(1);
	        }
	        if (options.chars) {
	          options.chars(text);
	        }
	        return ''
	      });
	      index += html.length - rest$1.length;
	      html = rest$1;
	      parseEndTag(stackedTag, index - endTagLength, index);
	    }

	    if (html === last) {
	      options.chars && options.chars(html);
	      if (!stack.length && options.warn) {
	        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""), { start: index + html.length });
	      }
	      break
	    }
	  }

	  // Clean up any remaining tags
	  parseEndTag();

	  function advance (n) {
	    index += n;
	    html = html.substring(n);
	  }

	  function parseStartTag () {
	    var start = html.match(startTagOpen);
	    if (start) {
	      var match = {
	        tagName: start[1],
	        attrs: [],
	        start: index
	      };
	      advance(start[0].length);
	      var end, attr;
	      while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
	        attr.start = index;
	        advance(attr[0].length);
	        attr.end = index;
	        match.attrs.push(attr);
	      }
	      if (end) {
	        match.unarySlash = end[1];
	        advance(end[0].length);
	        match.end = index;
	        return match
	      }
	    }
	  }

	  function handleStartTag (match) {
	    var tagName = match.tagName;
	    var unarySlash = match.unarySlash;

	    if (expectHTML) {
	      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
	        parseEndTag(lastTag);
	      }
	      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
	        parseEndTag(tagName);
	      }
	    }

	    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

	    var l = match.attrs.length;
	    var attrs = new Array(l);
	    for (var i = 0; i < l; i++) {
	      var args = match.attrs[i];
	      var value = args[3] || args[4] || args[5] || '';
	      var shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
	        ? options.shouldDecodeNewlinesForHref
	        : options.shouldDecodeNewlines;
	      attrs[i] = {
	        name: args[1],
	        value: decodeAttr(value, shouldDecodeNewlines)
	      };
	      if (options.outputSourceRange) {
	        attrs[i].start = args.start + args[0].match(/^\s*/).length;
	        attrs[i].end = args.end;
	      }
	    }

	    if (!unary) {
	      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
	      lastTag = tagName;
	    }

	    if (options.start) {
	      options.start(tagName, attrs, unary, match.start, match.end);
	    }
	  }

	  function parseEndTag (tagName, start, end) {
	    var pos, lowerCasedTagName;
	    if (start == null) { start = index; }
	    if (end == null) { end = index; }

	    // Find the closest opened tag of the same type
	    if (tagName) {
	      lowerCasedTagName = tagName.toLowerCase();
	      for (pos = stack.length - 1; pos >= 0; pos--) {
	        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
	          break
	        }
	      }
	    } else {
	      // If no tag name is provided, clean shop
	      pos = 0;
	    }

	    if (pos >= 0) {
	      // Close all the open elements, up the stack
	      for (var i = stack.length - 1; i >= pos; i--) {
	        if (i > pos || !tagName &&
	          options.warn
	        ) {
	          options.warn(
	            ("tag <" + (stack[i].tag) + "> has no matching end tag."),
	            { start: stack[i].start, end: stack[i].end }
	          );
	        }
	        if (options.end) {
	          options.end(stack[i].tag, start, end);
	        }
	      }

	      // Remove the open elements from the stack
	      stack.length = pos;
	      lastTag = pos && stack[pos - 1].tag;
	    } else if (lowerCasedTagName === 'br') {
	      if (options.start) {
	        options.start(tagName, [], true, start, end);
	      }
	    } else if (lowerCasedTagName === 'p') {
	      if (options.start) {
	        options.start(tagName, [], false, start, end);
	      }
	      if (options.end) {
	        options.end(tagName, start, end);
	      }
	    }
	  }
	}

	/*  */

	var onRE = /^@|^v-on:/;
	var dirRE = /^v-|^@|^:|^#/;
	var forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
	var forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
	var stripParensRE = /^\(|\)$/g;
	var dynamicArgRE = /^\[.*\]$/;

	var argRE = /:(.*)$/;
	var bindRE = /^:|^\.|^v-bind:/;
	var modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

	var slotRE = /^v-slot(:|$)|^#/;

	var lineBreakRE = /[\r\n]/;
	var whitespaceRE$1 = /\s+/g;

	var invalidAttributeRE = /[\s"'<>\/=]/;

	var decodeHTMLCached = cached(he.decode);

	var emptySlotScopeToken = "_empty_";

	// configurable state
	var warn$2;
	var delimiters;
	var transforms;
	var preTransforms;
	var postTransforms;
	var platformIsPreTag;
	var platformMustUseProp;
	var platformGetTagNamespace;
	var maybeComponent;

	function createASTElement (
	  tag,
	  attrs,
	  parent
	) {
	  return {
	    type: 1,
	    tag: tag,
	    attrsList: attrs,
	    attrsMap: makeAttrsMap(attrs),
	    rawAttrsMap: {},
	    parent: parent,
	    children: []
	  }
	}

	/**
	 * Convert HTML string to AST.
	 */
	function parse$1 (
	  template,
	  options
	) {
	  warn$2 = options.warn || baseWarn;

	  platformIsPreTag = options.isPreTag || no;
	  platformMustUseProp = options.mustUseProp || no;
	  platformGetTagNamespace = options.getTagNamespace || no;
	  var isReservedTag = options.isReservedTag || no;
	  maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };

	  transforms = pluckModuleFunction(options.modules, 'transformNode');
	  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
	  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

	  delimiters = options.delimiters;

	  var stack = [];
	  var preserveWhitespace = options.preserveWhitespace !== false;
	  var whitespaceOption = options.whitespace;
	  var root;
	  var currentParent;
	  var inVPre = false;
	  var inPre = false;
	  var warned = false;

	  function warnOnce (msg, range) {
	    if (!warned) {
	      warned = true;
	      warn$2(msg, range);
	    }
	  }

	  function closeElement (element) {
	    trimEndingWhitespace(element);
	    if (!inVPre && !element.processed) {
	      element = processElement(element, options);
	    }
	    // tree management
	    if (!stack.length && element !== root) {
	      // allow root elements with v-if, v-else-if and v-else
	      if (root.if && (element.elseif || element.else)) {
	        {
	          checkRootConstraints(element);
	        }
	        addIfCondition(root, {
	          exp: element.elseif,
	          block: element
	        });
	      } else {
	        warnOnce(
	          "Component template should contain exactly one root element. " +
	          "If you are using v-if on multiple elements, " +
	          "use v-else-if to chain them instead.",
	          { start: element.start }
	        );
	      }
	    }
	    if (currentParent && !element.forbidden) {
	      if (element.elseif || element.else) {
	        processIfConditions(element, currentParent);
	      } else {
	        if (element.slotScope) {
	          // scoped slot
	          // keep it in the children list so that v-else(-if) conditions can
	          // find it as the prev node.
	          var name = element.slotTarget || '"default"'
	          ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
	        }
	        currentParent.children.push(element);
	        element.parent = currentParent;
	      }
	    }

	    // final children cleanup
	    // filter out scoped slots
	    element.children = element.children.filter(function (c) { return !(c).slotScope; });
	    // remove trailing whitespace node again
	    trimEndingWhitespace(element);

	    // check pre state
	    if (element.pre) {
	      inVPre = false;
	    }
	    if (platformIsPreTag(element.tag)) {
	      inPre = false;
	    }
	    // apply post-transforms
	    for (var i = 0; i < postTransforms.length; i++) {
	      postTransforms[i](element, options);
	    }
	  }

	  function trimEndingWhitespace (el) {
	    // remove trailing whitespace node
	    if (!inPre) {
	      var lastNode;
	      while (
	        (lastNode = el.children[el.children.length - 1]) &&
	        lastNode.type === 3 &&
	        lastNode.text === ' '
	      ) {
	        el.children.pop();
	      }
	    }
	  }

	  function checkRootConstraints (el) {
	    if (el.tag === 'slot' || el.tag === 'template') {
	      warnOnce(
	        "Cannot use <" + (el.tag) + "> as component root element because it may " +
	        'contain multiple nodes.',
	        { start: el.start }
	      );
	    }
	    if (el.attrsMap.hasOwnProperty('v-for')) {
	      warnOnce(
	        'Cannot use v-for on stateful component root element because ' +
	        'it renders multiple elements.',
	        el.rawAttrsMap['v-for']
	      );
	    }
	  }

	  parseHTML(template, {
	    warn: warn$2,
	    expectHTML: options.expectHTML,
	    isUnaryTag: options.isUnaryTag,
	    canBeLeftOpenTag: options.canBeLeftOpenTag,
	    shouldDecodeNewlines: options.shouldDecodeNewlines,
	    shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
	    shouldKeepComment: options.comments,
	    outputSourceRange: options.outputSourceRange,
	    start: function start (tag, attrs, unary, start$1, end) {
	      // check namespace.
	      // inherit parent ns if there is one
	      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

	      // handle IE svg bug
	      /* istanbul ignore if */
	      if (isIE && ns === 'svg') {
	        attrs = guardIESVGBug(attrs);
	      }

	      var element = createASTElement(tag, attrs, currentParent);
	      if (ns) {
	        element.ns = ns;
	      }

	      {
	        if (options.outputSourceRange) {
	          element.start = start$1;
	          element.end = end;
	          element.rawAttrsMap = element.attrsList.reduce(function (cumulated, attr) {
	            cumulated[attr.name] = attr;
	            return cumulated
	          }, {});
	        }
	        attrs.forEach(function (attr) {
	          if (invalidAttributeRE.test(attr.name)) {
	            warn$2(
	              "Invalid dynamic argument expression: attribute names cannot contain " +
	              "spaces, quotes, <, >, / or =.",
	              {
	                start: attr.start + attr.name.indexOf("["),
	                end: attr.start + attr.name.length
	              }
	            );
	          }
	        });
	      }

	      if (isForbiddenTag(element) && !isServerRendering()) {
	        element.forbidden = true;
	        warn$2(
	          'Templates should only be responsible for mapping the state to the ' +
	          'UI. Avoid placing tags with side-effects in your templates, such as ' +
	          "<" + tag + ">" + ', as they will not be parsed.',
	          { start: element.start }
	        );
	      }

	      // apply pre-transforms
	      for (var i = 0; i < preTransforms.length; i++) {
	        element = preTransforms[i](element, options) || element;
	      }

	      if (!inVPre) {
	        processPre(element);
	        if (element.pre) {
	          inVPre = true;
	        }
	      }
	      if (platformIsPreTag(element.tag)) {
	        inPre = true;
	      }
	      if (inVPre) {
	        processRawAttrs(element);
	      } else if (!element.processed) {
	        // structural directives
	        processFor(element);
	        processIf(element);
	        processOnce(element);
	      }

	      if (!root) {
	        root = element;
	        {
	          checkRootConstraints(root);
	        }
	      }

	      if (!unary) {
	        currentParent = element;
	        stack.push(element);
	      } else {
	        closeElement(element);
	      }
	    },

	    end: function end (tag, start, end$1) {
	      var element = stack[stack.length - 1];
	      // pop stack
	      stack.length -= 1;
	      currentParent = stack[stack.length - 1];
	      if (options.outputSourceRange) {
	        element.end = end$1;
	      }
	      closeElement(element);
	    },

	    chars: function chars (text, start, end) {
	      if (!currentParent) {
	        {
	          if (text === template) {
	            warnOnce(
	              'Component template requires a root element, rather than just text.',
	              { start: start }
	            );
	          } else if ((text = text.trim())) {
	            warnOnce(
	              ("text \"" + text + "\" outside root element will be ignored."),
	              { start: start }
	            );
	          }
	        }
	        return
	      }
	      // IE textarea placeholder bug
	      /* istanbul ignore if */
	      if (isIE &&
	        currentParent.tag === 'textarea' &&
	        currentParent.attrsMap.placeholder === text
	      ) {
	        return
	      }
	      var children = currentParent.children;
	      if (inPre || text.trim()) {
	        text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
	      } else if (!children.length) {
	        // remove the whitespace-only node right after an opening tag
	        text = '';
	      } else if (whitespaceOption) {
	        if (whitespaceOption === 'condense') {
	          // in condense mode, remove the whitespace node if it contains
	          // line break, otherwise condense to a single space
	          text = lineBreakRE.test(text) ? '' : ' ';
	        } else {
	          text = ' ';
	        }
	      } else {
	        text = preserveWhitespace ? ' ' : '';
	      }
	      if (text) {
	        if (!inPre && whitespaceOption === 'condense') {
	          // condense consecutive whitespaces into single space
	          text = text.replace(whitespaceRE$1, ' ');
	        }
	        var res;
	        var child;
	        if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
	          child = {
	            type: 2,
	            expression: res.expression,
	            tokens: res.tokens,
	            text: text
	          };
	        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
	          child = {
	            type: 3,
	            text: text
	          };
	        }
	        if (child) {
	          if (options.outputSourceRange) {
	            child.start = start;
	            child.end = end;
	          }
	          children.push(child);
	        }
	      }
	    },
	    comment: function comment (text, start, end) {
	      // adding anyting as a sibling to the root node is forbidden
	      // comments should still be allowed, but ignored
	      if (currentParent) {
	        var child = {
	          type: 3,
	          text: text,
	          isComment: true
	        };
	        if (options.outputSourceRange) {
	          child.start = start;
	          child.end = end;
	        }
	        currentParent.children.push(child);
	      }
	    }
	  });
	  return root
	}

	function processPre (el) {
	  if (getAndRemoveAttr(el, 'v-pre') != null) {
	    el.pre = true;
	  }
	}

	function processRawAttrs (el) {
	  var list = el.attrsList;
	  var len = list.length;
	  if (len) {
	    var attrs = el.attrs = new Array(len);
	    for (var i = 0; i < len; i++) {
	      attrs[i] = {
	        name: list[i].name,
	        value: JSON.stringify(list[i].value)
	      };
	      if (list[i].start != null) {
	        attrs[i].start = list[i].start;
	        attrs[i].end = list[i].end;
	      }
	    }
	  } else if (!el.pre) {
	    // non root node in pre blocks with no attributes
	    el.plain = true;
	  }
	}

	function processElement (
	  element,
	  options
	) {
	  processKey(element);

	  // determine whether this is a plain element after
	  // removing structural attributes
	  element.plain = (
	    !element.key &&
	    !element.scopedSlots &&
	    !element.attrsList.length
	  );

	  processRef(element);
	  processSlotContent(element);
	  processSlotOutlet(element);
	  processComponent(element);
	  for (var i = 0; i < transforms.length; i++) {
	    element = transforms[i](element, options) || element;
	  }
	  processAttrs(element);
	  return element
	}

	function processKey (el) {
	  var exp = getBindingAttr(el, 'key');
	  if (exp) {
	    {
	      if (el.tag === 'template') {
	        warn$2(
	          "<template> cannot be keyed. Place the key on real elements instead.",
	          getRawBindingAttr(el, 'key')
	        );
	      }
	      if (el.for) {
	        var iterator = el.iterator2 || el.iterator1;
	        var parent = el.parent;
	        if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
	          warn$2(
	            "Do not use v-for index as key on <transition-group> children, " +
	            "this is the same as not using keys.",
	            getRawBindingAttr(el, 'key'),
	            true /* tip */
	          );
	        }
	      }
	    }
	    el.key = exp;
	  }
	}

	function processRef (el) {
	  var ref = getBindingAttr(el, 'ref');
	  if (ref) {
	    el.ref = ref;
	    el.refInFor = checkInFor(el);
	  }
	}

	function processFor (el) {
	  var exp;
	  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
	    var res = parseFor(exp);
	    if (res) {
	      extend$1(el, res);
	    } else {
	      warn$2(
	        ("Invalid v-for expression: " + exp),
	        el.rawAttrsMap['v-for']
	      );
	    }
	  }
	}



	function parseFor (exp) {
	  var inMatch = exp.match(forAliasRE);
	  if (!inMatch) { return }
	  var res = {};
	  res.for = inMatch[2].trim();
	  var alias = inMatch[1].trim().replace(stripParensRE, '');
	  var iteratorMatch = alias.match(forIteratorRE);
	  if (iteratorMatch) {
	    res.alias = alias.replace(forIteratorRE, '').trim();
	    res.iterator1 = iteratorMatch[1].trim();
	    if (iteratorMatch[2]) {
	      res.iterator2 = iteratorMatch[2].trim();
	    }
	  } else {
	    res.alias = alias;
	  }
	  return res
	}

	function processIf (el) {
	  var exp = getAndRemoveAttr(el, 'v-if');
	  if (exp) {
	    el.if = exp;
	    addIfCondition(el, {
	      exp: exp,
	      block: el
	    });
	  } else {
	    if (getAndRemoveAttr(el, 'v-else') != null) {
	      el.else = true;
	    }
	    var elseif = getAndRemoveAttr(el, 'v-else-if');
	    if (elseif) {
	      el.elseif = elseif;
	    }
	  }
	}

	function processIfConditions (el, parent) {
	  var prev = findPrevElement(parent.children);
	  if (prev && prev.if) {
	    addIfCondition(prev, {
	      exp: el.elseif,
	      block: el
	    });
	  } else {
	    warn$2(
	      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
	      "used on element <" + (el.tag) + "> without corresponding v-if.",
	      el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
	    );
	  }
	}

	function findPrevElement (children) {
	  var i = children.length;
	  while (i--) {
	    if (children[i].type === 1) {
	      return children[i]
	    } else {
	      if (children[i].text !== ' ') {
	        warn$2(
	          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
	          "will be ignored.",
	          children[i]
	        );
	      }
	      children.pop();
	    }
	  }
	}

	function addIfCondition (el, condition) {
	  if (!el.ifConditions) {
	    el.ifConditions = [];
	  }
	  el.ifConditions.push(condition);
	}

	function processOnce (el) {
	  var once$$1 = getAndRemoveAttr(el, 'v-once');
	  if (once$$1 != null) {
	    el.once = true;
	  }
	}

	// handle content being passed to a component as slot,
	// e.g. <template slot="xxx">, <div slot-scope="xxx">
	function processSlotContent (el) {
	  var slotScope;
	  if (el.tag === 'template') {
	    slotScope = getAndRemoveAttr(el, 'scope');
	    /* istanbul ignore if */
	    if (slotScope) {
	      warn$2(
	        "the \"scope\" attribute for scoped slots have been deprecated and " +
	        "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
	        "can also be used on plain elements in addition to <template> to " +
	        "denote scoped slots.",
	        el.rawAttrsMap['scope'],
	        true
	      );
	    }
	    el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
	  } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
	    /* istanbul ignore if */
	    if (el.attrsMap['v-for']) {
	      warn$2(
	        "Ambiguous combined usage of slot-scope and v-for on <" + (el.tag) + "> " +
	        "(v-for takes higher priority). Use a wrapper <template> for the " +
	        "scoped slot to make it clearer.",
	        el.rawAttrsMap['slot-scope'],
	        true
	      );
	    }
	    el.slotScope = slotScope;
	  }

	  // slot="xxx"
	  var slotTarget = getBindingAttr(el, 'slot');
	  if (slotTarget) {
	    el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
	    el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
	    // preserve slot as an attribute for native shadow DOM compat
	    // only for non-scoped slots.
	    if (el.tag !== 'template' && !el.slotScope) {
	      addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
	    }
	  }

	  // 2.6 v-slot syntax
	  {
	    if (el.tag === 'template') {
	      // v-slot on <template>
	      var slotBinding = getAndRemoveAttrByRegex(el, slotRE);
	      if (slotBinding) {
	        {
	          if (el.slotTarget || el.slotScope) {
	            warn$2(
	              "Unexpected mixed usage of different slot syntaxes.",
	              el
	            );
	          }
	          if (el.parent && !maybeComponent(el.parent)) {
	            warn$2(
	              "<template v-slot> can only appear at the root level inside " +
	              "the receiving component",
	              el
	            );
	          }
	        }
	        var ref = getSlotName(slotBinding);
	        var name = ref.name;
	        var dynamic = ref.dynamic;
	        el.slotTarget = name;
	        el.slotTargetDynamic = dynamic;
	        el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
	      }
	    } else {
	      // v-slot on component, denotes default slot
	      var slotBinding$1 = getAndRemoveAttrByRegex(el, slotRE);
	      if (slotBinding$1) {
	        {
	          if (!maybeComponent(el)) {
	            warn$2(
	              "v-slot can only be used on components or <template>.",
	              slotBinding$1
	            );
	          }
	          if (el.slotScope || el.slotTarget) {
	            warn$2(
	              "Unexpected mixed usage of different slot syntaxes.",
	              el
	            );
	          }
	          if (el.scopedSlots) {
	            warn$2(
	              "To avoid scope ambiguity, the default slot should also use " +
	              "<template> syntax when there are other named slots.",
	              slotBinding$1
	            );
	          }
	        }
	        // add the component's children to its default slot
	        var slots = el.scopedSlots || (el.scopedSlots = {});
	        var ref$1 = getSlotName(slotBinding$1);
	        var name$1 = ref$1.name;
	        var dynamic$1 = ref$1.dynamic;
	        var slotContainer = slots[name$1] = createASTElement('template', [], el);
	        slotContainer.slotTarget = name$1;
	        slotContainer.slotTargetDynamic = dynamic$1;
	        slotContainer.children = el.children.filter(function (c) {
	          if (!c.slotScope) {
	            c.parent = slotContainer;
	            return true
	          }
	        });
	        slotContainer.slotScope = slotBinding$1.value || emptySlotScopeToken;
	        // remove children as they are returned from scopedSlots now
	        el.children = [];
	        // mark el non-plain so data gets generated
	        el.plain = false;
	      }
	    }
	  }
	}

	function getSlotName (binding) {
	  var name = binding.name.replace(slotRE, '');
	  if (!name) {
	    if (binding.name[0] !== '#') {
	      name = 'default';
	    } else {
	      warn$2(
	        "v-slot shorthand syntax requires a slot name.",
	        binding
	      );
	    }
	  }
	  return dynamicArgRE.test(name)
	    // dynamic [name]
	    ? { name: name.slice(1, -1), dynamic: true }
	    // static name
	    : { name: ("\"" + name + "\""), dynamic: false }
	}

	// handle <slot/> outlets
	function processSlotOutlet (el) {
	  if (el.tag === 'slot') {
	    el.slotName = getBindingAttr(el, 'name');
	    if (el.key) {
	      warn$2(
	        "`key` does not work on <slot> because slots are abstract outlets " +
	        "and can possibly expand into multiple elements. " +
	        "Use the key on a wrapping element instead.",
	        getRawBindingAttr(el, 'key')
	      );
	    }
	  }
	}

	function processComponent (el) {
	  var binding;
	  if ((binding = getBindingAttr(el, 'is'))) {
	    el.component = binding;
	  }
	  if (getAndRemoveAttr(el, 'inline-template') != null) {
	    el.inlineTemplate = true;
	  }
	}

	function processAttrs (el) {
	  var list = el.attrsList;
	  var i, l, name, rawName, value, modifiers, syncGen, isDynamic;
	  for (i = 0, l = list.length; i < l; i++) {
	    name = rawName = list[i].name;
	    value = list[i].value;
	    if (dirRE.test(name)) {
	      // mark element as dynamic
	      el.hasBindings = true;
	      // modifiers
	      modifiers = parseModifiers(name.replace(dirRE, ''));
	      // support .foo shorthand syntax for the .prop modifier
	      if (modifiers) {
	        name = name.replace(modifierRE, '');
	      }
	      if (bindRE.test(name)) { // v-bind
	        name = name.replace(bindRE, '');
	        value = parseFilters(value);
	        isDynamic = dynamicArgRE.test(name);
	        if (isDynamic) {
	          name = name.slice(1, -1);
	        }
	        if (
	          value.trim().length === 0
	        ) {
	          warn$2(
	            ("The value for a v-bind expression cannot be empty. Found in \"v-bind:" + name + "\"")
	          );
	        }
	        if (modifiers) {
	          if (modifiers.prop && !isDynamic) {
	            name = camelize(name);
	            if (name === 'innerHtml') { name = 'innerHTML'; }
	          }
	          if (modifiers.camel && !isDynamic) {
	            name = camelize(name);
	          }
	          if (modifiers.sync) {
	            syncGen = genAssignmentCode(value, "$event");
	            if (!isDynamic) {
	              addHandler(
	                el,
	                ("update:" + (camelize(name))),
	                syncGen,
	                null,
	                false,
	                warn$2,
	                list[i]
	              );
	              if (hyphenate(name) !== camelize(name)) {
	                addHandler(
	                  el,
	                  ("update:" + (hyphenate(name))),
	                  syncGen,
	                  null,
	                  false,
	                  warn$2,
	                  list[i]
	                );
	              }
	            } else {
	              // handler w/ dynamic event name
	              addHandler(
	                el,
	                ("\"update:\"+(" + name + ")"),
	                syncGen,
	                null,
	                false,
	                warn$2,
	                list[i],
	                true // dynamic
	              );
	            }
	          }
	        }
	        if ((modifiers && modifiers.prop) || (
	          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
	        )) {
	          addProp(el, name, value, list[i], isDynamic);
	        } else {
	          addAttr(el, name, value, list[i], isDynamic);
	        }
	      } else if (onRE.test(name)) { // v-on
	        name = name.replace(onRE, '');
	        isDynamic = dynamicArgRE.test(name);
	        if (isDynamic) {
	          name = name.slice(1, -1);
	        }
	        addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
	      } else { // normal directives
	        name = name.replace(dirRE, '');
	        // parse arg
	        var argMatch = name.match(argRE);
	        var arg = argMatch && argMatch[1];
	        isDynamic = false;
	        if (arg) {
	          name = name.slice(0, -(arg.length + 1));
	          if (dynamicArgRE.test(arg)) {
	            arg = arg.slice(1, -1);
	            isDynamic = true;
	          }
	        }
	        addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
	        if (name === 'model') {
	          checkForAliasModel(el, value);
	        }
	      }
	    } else {
	      // literal attribute
	      {
	        var res = parseText(value, delimiters);
	        if (res) {
	          warn$2(
	            name + "=\"" + value + "\": " +
	            'Interpolation inside attributes has been removed. ' +
	            'Use v-bind or the colon shorthand instead. For example, ' +
	            'instead of <div id="{{ val }}">, use <div :id="val">.',
	            list[i]
	          );
	        }
	      }
	      addAttr(el, name, JSON.stringify(value), list[i]);
	      // #6887 firefox doesn't update muted state if set via attribute
	      // even immediately after element creation
	      if (!el.component &&
	          name === 'muted' &&
	          platformMustUseProp(el.tag, el.attrsMap.type, name)) {
	        addProp(el, name, 'true', list[i]);
	      }
	    }
	  }
	}

	function checkInFor (el) {
	  var parent = el;
	  while (parent) {
	    if (parent.for !== undefined) {
	      return true
	    }
	    parent = parent.parent;
	  }
	  return false
	}

	function parseModifiers (name) {
	  var match = name.match(modifierRE);
	  if (match) {
	    var ret = {};
	    match.forEach(function (m) { ret[m.slice(1)] = true; });
	    return ret
	  }
	}

	function makeAttrsMap (attrs) {
	  var map = {};
	  for (var i = 0, l = attrs.length; i < l; i++) {
	    if (
	      map[attrs[i].name] && !isIE && !isEdge
	    ) {
	      warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
	    }
	    map[attrs[i].name] = attrs[i].value;
	  }
	  return map
	}

	// for script (e.g. type="x/template") or style, do not decode content
	function isTextTag (el) {
	  return el.tag === 'script' || el.tag === 'style'
	}

	function isForbiddenTag (el) {
	  return (
	    el.tag === 'style' ||
	    (el.tag === 'script' && (
	      !el.attrsMap.type ||
	      el.attrsMap.type === 'text/javascript'
	    ))
	  )
	}

	var ieNSBug = /^xmlns:NS\d+/;
	var ieNSPrefix = /^NS\d+:/;

	/* istanbul ignore next */
	function guardIESVGBug (attrs) {
	  var res = [];
	  for (var i = 0; i < attrs.length; i++) {
	    var attr = attrs[i];
	    if (!ieNSBug.test(attr.name)) {
	      attr.name = attr.name.replace(ieNSPrefix, '');
	      res.push(attr);
	    }
	  }
	  return res
	}

	function checkForAliasModel (el, value) {
	  var _el = el;
	  while (_el) {
	    if (_el.for && _el.alias === value) {
	      warn$2(
	        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
	        "You are binding v-model directly to a v-for iteration alias. " +
	        "This will not be able to modify the v-for source array because " +
	        "writing to the alias is like modifying a function local variable. " +
	        "Consider using an array of objects and use v-model on an object property instead.",
	        el.rawAttrsMap['v-model']
	      );
	    }
	    _el = _el.parent;
	  }
	}

	/*  */

	function preTransformNode (el, options) {
	  if (el.tag === 'input') {
	    var map = el.attrsMap;
	    if (!map['v-model']) {
	      return
	    }

	    var typeBinding;
	    if (map[':type'] || map['v-bind:type']) {
	      typeBinding = getBindingAttr(el, 'type');
	    }
	    if (!map.type && !typeBinding && map['v-bind']) {
	      typeBinding = "(" + (map['v-bind']) + ").type";
	    }

	    if (typeBinding) {
	      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
	      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
	      var hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
	      var elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
	      // 1. checkbox
	      var branch0 = cloneASTElement(el);
	      // process for on the main node
	      processFor(branch0);
	      addRawAttr(branch0, 'type', 'checkbox');
	      processElement(branch0, options);
	      branch0.processed = true; // prevent it from double-processed
	      branch0.if = "(" + typeBinding + ")==='checkbox'" + ifConditionExtra;
	      addIfCondition(branch0, {
	        exp: branch0.if,
	        block: branch0
	      });
	      // 2. add radio else-if condition
	      var branch1 = cloneASTElement(el);
	      getAndRemoveAttr(branch1, 'v-for', true);
	      addRawAttr(branch1, 'type', 'radio');
	      processElement(branch1, options);
	      addIfCondition(branch0, {
	        exp: "(" + typeBinding + ")==='radio'" + ifConditionExtra,
	        block: branch1
	      });
	      // 3. other
	      var branch2 = cloneASTElement(el);
	      getAndRemoveAttr(branch2, 'v-for', true);
	      addRawAttr(branch2, ':type', typeBinding);
	      processElement(branch2, options);
	      addIfCondition(branch0, {
	        exp: ifCondition,
	        block: branch2
	      });

	      if (hasElse) {
	        branch0.else = true;
	      } else if (elseIfCondition) {
	        branch0.elseif = elseIfCondition;
	      }

	      return branch0
	    }
	  }
	}

	function cloneASTElement (el) {
	  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
	}

	var model$1 = {
	  preTransformNode: preTransformNode
	};

	var modules$1 = [
	  klass$1,
	  style$1,
	  model$1
	];

	/*  */

	function text (el, dir) {
	  if (dir.value) {
	    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"), dir);
	  }
	}

	/*  */

	function html (el, dir) {
	  if (dir.value) {
	    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"), dir);
	  }
	}

	var directives$1 = {
	  model: model,
	  text: text,
	  html: html
	};

	/*  */

	var baseOptions = {
	  expectHTML: true,
	  modules: modules$1,
	  directives: directives$1,
	  isPreTag: isPreTag,
	  isUnaryTag: isUnaryTag,
	  mustUseProp: mustUseProp,
	  canBeLeftOpenTag: canBeLeftOpenTag,
	  isReservedTag: isReservedTag,
	  getTagNamespace: getTagNamespace,
	  staticKeys: genStaticKeys(modules$1)
	};

	/*  */

	var isStaticKey;
	var isPlatformReservedTag;

	var genStaticKeysCached = cached(genStaticKeys$1);

	/**
	 * Goal of the optimizer: walk the generated template AST tree
	 * and detect sub-trees that are purely static, i.e. parts of
	 * the DOM that never needs to change.
	 *
	 * Once we detect these sub-trees, we can:
	 *
	 * 1. Hoist them into constants, so that we no longer need to
	 *    create fresh nodes for them on each re-render;
	 * 2. Completely skip them in the patching process.
	 */
	function optimize (root, options) {
	  if (!root) { return }
	  isStaticKey = genStaticKeysCached(options.staticKeys || '');
	  isPlatformReservedTag = options.isReservedTag || no;
	  // first pass: mark all non-static nodes.
	  markStatic$1(root);
	  // second pass: mark static roots.
	  markStaticRoots(root, false);
	}

	function genStaticKeys$1 (keys) {
	  return makeMap(
	    'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
	    (keys ? ',' + keys : '')
	  )
	}

	function markStatic$1 (node) {
	  node.static = isStatic(node);
	  if (node.type === 1) {
	    // do not make component slot content static. this avoids
	    // 1. components not able to mutate slot nodes
	    // 2. static slot content fails for hot-reloading
	    if (
	      !isPlatformReservedTag(node.tag) &&
	      node.tag !== 'slot' &&
	      node.attrsMap['inline-template'] == null
	    ) {
	      return
	    }
	    for (var i = 0, l = node.children.length; i < l; i++) {
	      var child = node.children[i];
	      markStatic$1(child);
	      if (!child.static) {
	        node.static = false;
	      }
	    }
	    if (node.ifConditions) {
	      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
	        var block = node.ifConditions[i$1].block;
	        markStatic$1(block);
	        if (!block.static) {
	          node.static = false;
	        }
	      }
	    }
	  }
	}

	function markStaticRoots (node, isInFor) {
	  if (node.type === 1) {
	    if (node.static || node.once) {
	      node.staticInFor = isInFor;
	    }
	    // For a node to qualify as a static root, it should have children that
	    // are not just static text. Otherwise the cost of hoisting out will
	    // outweigh the benefits and it's better off to just always render it fresh.
	    if (node.static && node.children.length && !(
	      node.children.length === 1 &&
	      node.children[0].type === 3
	    )) {
	      node.staticRoot = true;
	      return
	    } else {
	      node.staticRoot = false;
	    }
	    if (node.children) {
	      for (var i = 0, l = node.children.length; i < l; i++) {
	        markStaticRoots(node.children[i], isInFor || !!node.for);
	      }
	    }
	    if (node.ifConditions) {
	      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
	        markStaticRoots(node.ifConditions[i$1].block, isInFor);
	      }
	    }
	  }
	}

	function isStatic (node) {
	  if (node.type === 2) { // expression
	    return false
	  }
	  if (node.type === 3) { // text
	    return true
	  }
	  return !!(node.pre || (
	    !node.hasBindings && // no dynamic bindings
	    !node.if && !node.for && // not v-if or v-for or v-else
	    !isBuiltInTag(node.tag) && // not a built-in
	    isPlatformReservedTag(node.tag) && // not a component
	    !isDirectChildOfTemplateFor(node) &&
	    Object.keys(node).every(isStaticKey)
	  ))
	}

	function isDirectChildOfTemplateFor (node) {
	  while (node.parent) {
	    node = node.parent;
	    if (node.tag !== 'template') {
	      return false
	    }
	    if (node.for) {
	      return true
	    }
	  }
	  return false
	}

	/*  */

	var fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function(?:\s+[\w$]+)?\s*\(/;
	var fnInvokeRE = /\([^)]*?\);*$/;
	var simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

	// KeyboardEvent.keyCode aliases
	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40,
	  'delete': [8, 46]
	};

	// KeyboardEvent.key aliases
	var keyNames = {
	  // #7880: IE11 and Edge use `Esc` for Escape key name.
	  esc: ['Esc', 'Escape'],
	  tab: 'Tab',
	  enter: 'Enter',
	  // #9112: IE11 uses `Spacebar` for Space key name.
	  space: [' ', 'Spacebar'],
	  // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
	  up: ['Up', 'ArrowUp'],
	  left: ['Left', 'ArrowLeft'],
	  right: ['Right', 'ArrowRight'],
	  down: ['Down', 'ArrowDown'],
	  // #9112: IE11 uses `Del` for Delete key name.
	  'delete': ['Backspace', 'Delete', 'Del']
	};

	// #4868: modifiers that prevent the execution of the listener
	// need to explicitly return null so that we can determine whether to remove
	// the listener for .once
	var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

	var modifierCode = {
	  stop: '$event.stopPropagation();',
	  prevent: '$event.preventDefault();',
	  self: genGuard("$event.target !== $event.currentTarget"),
	  ctrl: genGuard("!$event.ctrlKey"),
	  shift: genGuard("!$event.shiftKey"),
	  alt: genGuard("!$event.altKey"),
	  meta: genGuard("!$event.metaKey"),
	  left: genGuard("'button' in $event && $event.button !== 0"),
	  middle: genGuard("'button' in $event && $event.button !== 1"),
	  right: genGuard("'button' in $event && $event.button !== 2")
	};

	function genHandlers (
	  events,
	  isNative
	) {
	  var prefix = isNative ? 'nativeOn:' : 'on:';
	  var staticHandlers = "";
	  var dynamicHandlers = "";
	  for (var name in events) {
	    var handlerCode = genHandler(events[name]);
	    if (events[name] && events[name].dynamic) {
	      dynamicHandlers += name + "," + handlerCode + ",";
	    } else {
	      staticHandlers += "\"" + name + "\":" + handlerCode + ",";
	    }
	  }
	  staticHandlers = "{" + (staticHandlers.slice(0, -1)) + "}";
	  if (dynamicHandlers) {
	    return prefix + "_d(" + staticHandlers + ",[" + (dynamicHandlers.slice(0, -1)) + "])"
	  } else {
	    return prefix + staticHandlers
	  }
	}

	function genHandler (handler) {
	  if (!handler) {
	    return 'function(){}'
	  }

	  if (Array.isArray(handler)) {
	    return ("[" + (handler.map(function (handler) { return genHandler(handler); }).join(',')) + "]")
	  }

	  var isMethodPath = simplePathRE.test(handler.value);
	  var isFunctionExpression = fnExpRE.test(handler.value);
	  var isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

	  if (!handler.modifiers) {
	    if (isMethodPath || isFunctionExpression) {
	      return handler.value
	    }
	    return ("function($event){" + (isFunctionInvocation ? ("return " + (handler.value)) : handler.value) + "}") // inline statement
	  } else {
	    var code = '';
	    var genModifierCode = '';
	    var keys = [];
	    for (var key in handler.modifiers) {
	      if (modifierCode[key]) {
	        genModifierCode += modifierCode[key];
	        // left/right
	        if (keyCodes[key]) {
	          keys.push(key);
	        }
	      } else if (key === 'exact') {
	        var modifiers = (handler.modifiers);
	        genModifierCode += genGuard(
	          ['ctrl', 'shift', 'alt', 'meta']
	            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
	            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
	            .join('||')
	        );
	      } else {
	        keys.push(key);
	      }
	    }
	    if (keys.length) {
	      code += genKeyFilter(keys);
	    }
	    // Make sure modifiers like prevent and stop get executed after key filtering
	    if (genModifierCode) {
	      code += genModifierCode;
	    }
	    var handlerCode = isMethodPath
	      ? ("return " + (handler.value) + "($event)")
	      : isFunctionExpression
	        ? ("return (" + (handler.value) + ")($event)")
	        : isFunctionInvocation
	          ? ("return " + (handler.value))
	          : handler.value;
	    return ("function($event){" + code + handlerCode + "}")
	  }
	}

	function genKeyFilter (keys) {
	  return (
	    // make sure the key filters only apply to KeyboardEvents
	    // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
	    // key events that do not have keyCode property...
	    "if(!$event.type.indexOf('key')&&" +
	    (keys.map(genFilterCode).join('&&')) + ")return null;"
	  )
	}

	function genFilterCode (key) {
	  var keyVal = parseInt(key, 10);
	  if (keyVal) {
	    return ("$event.keyCode!==" + keyVal)
	  }
	  var keyCode = keyCodes[key];
	  var keyName = keyNames[key];
	  return (
	    "_k($event.keyCode," +
	    (JSON.stringify(key)) + "," +
	    (JSON.stringify(keyCode)) + "," +
	    "$event.key," +
	    "" + (JSON.stringify(keyName)) +
	    ")"
	  )
	}

	/*  */

	function on (el, dir) {
	  if (dir.modifiers) {
	    warn$1("v-on without argument does not support modifiers.");
	  }
	  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
	}

	/*  */

	function bind$1 (el, dir) {
	  el.wrapData = function (code) {
	    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
	  };
	}

	/*  */

	var baseDirectives = {
	  on: on,
	  bind: bind$1,
	  cloak: noop$1
	};

	/*  */





	var CodegenState = function CodegenState (options) {
	  this.options = options;
	  this.warn = options.warn || baseWarn;
	  this.transforms = pluckModuleFunction(options.modules, 'transformCode');
	  this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
	  this.directives = extend$1(extend$1({}, baseDirectives), options.directives);
	  var isReservedTag = options.isReservedTag || no;
	  this.maybeComponent = function (el) { return !!el.component || !isReservedTag(el.tag); };
	  this.onceId = 0;
	  this.staticRenderFns = [];
	  this.pre = false;
	};



	function generate (
	  ast,
	  options
	) {
	  var state = new CodegenState(options);
	  var code = ast ? genElement(ast, state) : '_c("div")';
	  return {
	    render: ("with(this){return " + code + "}"),
	    staticRenderFns: state.staticRenderFns
	  }
	}

	function genElement (el, state) {
	  if (el.parent) {
	    el.pre = el.pre || el.parent.pre;
	  }

	  if (el.staticRoot && !el.staticProcessed) {
	    return genStatic(el, state)
	  } else if (el.once && !el.onceProcessed) {
	    return genOnce(el, state)
	  } else if (el.for && !el.forProcessed) {
	    return genFor(el, state)
	  } else if (el.if && !el.ifProcessed) {
	    return genIf(el, state)
	  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
	    return genChildren(el, state) || 'void 0'
	  } else if (el.tag === 'slot') {
	    return genSlot(el, state)
	  } else {
	    // component or element
	    var code;
	    if (el.component) {
	      code = genComponent(el.component, el, state);
	    } else {
	      var data;
	      if (!el.plain || (el.pre && state.maybeComponent(el))) {
	        data = genData$2(el, state);
	      }

	      var children = el.inlineTemplate ? null : genChildren(el, state, true);
	      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
	    }
	    // module transforms
	    for (var i = 0; i < state.transforms.length; i++) {
	      code = state.transforms[i](el, code);
	    }
	    return code
	  }
	}

	// hoist static sub-trees out
	function genStatic (el, state) {
	  el.staticProcessed = true;
	  // Some elements (templates) need to behave differently inside of a v-pre
	  // node.  All pre nodes are static roots, so we can use this as a location to
	  // wrap a state change and reset it upon exiting the pre node.
	  var originalPreState = state.pre;
	  if (el.pre) {
	    state.pre = el.pre;
	  }
	  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
	  state.pre = originalPreState;
	  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
	}

	// v-once
	function genOnce (el, state) {
	  el.onceProcessed = true;
	  if (el.if && !el.ifProcessed) {
	    return genIf(el, state)
	  } else if (el.staticInFor) {
	    var key = '';
	    var parent = el.parent;
	    while (parent) {
	      if (parent.for) {
	        key = parent.key;
	        break
	      }
	      parent = parent.parent;
	    }
	    if (!key) {
	      state.warn(
	        "v-once can only be used inside v-for that is keyed. ",
	        el.rawAttrsMap['v-once']
	      );
	      return genElement(el, state)
	    }
	    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
	  } else {
	    return genStatic(el, state)
	  }
	}

	function genIf (
	  el,
	  state,
	  altGen,
	  altEmpty
	) {
	  el.ifProcessed = true; // avoid recursion
	  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
	}

	function genIfConditions (
	  conditions,
	  state,
	  altGen,
	  altEmpty
	) {
	  if (!conditions.length) {
	    return altEmpty || '_e()'
	  }

	  var condition = conditions.shift();
	  if (condition.exp) {
	    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
	  } else {
	    return ("" + (genTernaryExp(condition.block)))
	  }

	  // v-if with v-once should generate code like (a)?_m(0):_m(1)
	  function genTernaryExp (el) {
	    return altGen
	      ? altGen(el, state)
	      : el.once
	        ? genOnce(el, state)
	        : genElement(el, state)
	  }
	}

	function genFor (
	  el,
	  state,
	  altGen,
	  altHelper
	) {
	  var exp = el.for;
	  var alias = el.alias;
	  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
	  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

	  if (state.maybeComponent(el) &&
	    el.tag !== 'slot' &&
	    el.tag !== 'template' &&
	    !el.key
	  ) {
	    state.warn(
	      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
	      "v-for should have explicit keys. " +
	      "See https://vuejs.org/guide/list.html#key for more info.",
	      el.rawAttrsMap['v-for'],
	      true /* tip */
	    );
	  }

	  el.forProcessed = true; // avoid recursion
	  return (altHelper || '_l') + "((" + exp + ")," +
	    "function(" + alias + iterator1 + iterator2 + "){" +
	      "return " + ((altGen || genElement)(el, state)) +
	    '})'
	}

	function genData$2 (el, state) {
	  var data = '{';

	  // directives first.
	  // directives may mutate the el's other properties before they are generated.
	  var dirs = genDirectives(el, state);
	  if (dirs) { data += dirs + ','; }

	  // key
	  if (el.key) {
	    data += "key:" + (el.key) + ",";
	  }
	  // ref
	  if (el.ref) {
	    data += "ref:" + (el.ref) + ",";
	  }
	  if (el.refInFor) {
	    data += "refInFor:true,";
	  }
	  // pre
	  if (el.pre) {
	    data += "pre:true,";
	  }
	  // record original tag name for components using "is" attribute
	  if (el.component) {
	    data += "tag:\"" + (el.tag) + "\",";
	  }
	  // module data generation functions
	  for (var i = 0; i < state.dataGenFns.length; i++) {
	    data += state.dataGenFns[i](el);
	  }
	  // attributes
	  if (el.attrs) {
	    data += "attrs:" + (genProps(el.attrs)) + ",";
	  }
	  // DOM props
	  if (el.props) {
	    data += "domProps:" + (genProps(el.props)) + ",";
	  }
	  // event handlers
	  if (el.events) {
	    data += (genHandlers(el.events, false)) + ",";
	  }
	  if (el.nativeEvents) {
	    data += (genHandlers(el.nativeEvents, true)) + ",";
	  }
	  // slot target
	  // only for non-scoped slots
	  if (el.slotTarget && !el.slotScope) {
	    data += "slot:" + (el.slotTarget) + ",";
	  }
	  // scoped slots
	  if (el.scopedSlots) {
	    data += (genScopedSlots(el, el.scopedSlots, state)) + ",";
	  }
	  // component v-model
	  if (el.model) {
	    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
	  }
	  // inline-template
	  if (el.inlineTemplate) {
	    var inlineTemplate = genInlineTemplate(el, state);
	    if (inlineTemplate) {
	      data += inlineTemplate + ",";
	    }
	  }
	  data = data.replace(/,$/, '') + '}';
	  // v-bind dynamic argument wrap
	  // v-bind with dynamic arguments must be applied using the same v-bind object
	  // merge helper so that class/style/mustUseProp attrs are handled correctly.
	  if (el.dynamicAttrs) {
	    data = "_b(" + data + ",\"" + (el.tag) + "\"," + (genProps(el.dynamicAttrs)) + ")";
	  }
	  // v-bind data wrap
	  if (el.wrapData) {
	    data = el.wrapData(data);
	  }
	  // v-on data wrap
	  if (el.wrapListeners) {
	    data = el.wrapListeners(data);
	  }
	  return data
	}

	function genDirectives (el, state) {
	  var dirs = el.directives;
	  if (!dirs) { return }
	  var res = 'directives:[';
	  var hasRuntime = false;
	  var i, l, dir, needRuntime;
	  for (i = 0, l = dirs.length; i < l; i++) {
	    dir = dirs[i];
	    needRuntime = true;
	    var gen = state.directives[dir.name];
	    if (gen) {
	      // compile-time directive that manipulates AST.
	      // returns true if it also needs a runtime counterpart.
	      needRuntime = !!gen(el, dir, state.warn);
	    }
	    if (needRuntime) {
	      hasRuntime = true;
	      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:" + (dir.isDynamicArg ? dir.arg : ("\"" + (dir.arg) + "\""))) : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
	    }
	  }
	  if (hasRuntime) {
	    return res.slice(0, -1) + ']'
	  }
	}

	function genInlineTemplate (el, state) {
	  var ast = el.children[0];
	  if (el.children.length !== 1 || ast.type !== 1) {
	    state.warn(
	      'Inline-template components must have exactly one child element.',
	      { start: el.start }
	    );
	  }
	  if (ast && ast.type === 1) {
	    var inlineRenderFns = generate(ast, state.options);
	    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
	  }
	}

	function genScopedSlots (
	  el,
	  slots,
	  state
	) {
	  // by default scoped slots are considered "stable", this allows child
	  // components with only scoped slots to skip forced updates from parent.
	  // but in some cases we have to bail-out of this optimization
	  // for example if the slot contains dynamic names, has v-if or v-for on them...
	  var needsForceUpdate = el.for || Object.keys(slots).some(function (key) {
	    var slot = slots[key];
	    return (
	      slot.slotTargetDynamic ||
	      slot.if ||
	      slot.for ||
	      containsSlotChild(slot) // is passing down slot from parent which may be dynamic
	    )
	  });

	  // #9534: if a component with scoped slots is inside a conditional branch,
	  // it's possible for the same component to be reused but with different
	  // compiled slot content. To avoid that, we generate a unique key based on
	  // the generated code of all the slot contents.
	  var needsKey = !!el.if;

	  // OR when it is inside another scoped slot or v-for (the reactivity may be
	  // disconnected due to the intermediate scope variable)
	  // #9438, #9506
	  // TODO: this can be further optimized by properly analyzing in-scope bindings
	  // and skip force updating ones that do not actually use scope variables.
	  if (!needsForceUpdate) {
	    var parent = el.parent;
	    while (parent) {
	      if (
	        (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
	        parent.for
	      ) {
	        needsForceUpdate = true;
	        break
	      }
	      if (parent.if) {
	        needsKey = true;
	      }
	      parent = parent.parent;
	    }
	  }

	  var generatedSlots = Object.keys(slots)
	    .map(function (key) { return genScopedSlot(slots[key], state); })
	    .join(',');

	  return ("scopedSlots:_u([" + generatedSlots + "]" + (needsForceUpdate ? ",null,true" : "") + (!needsForceUpdate && needsKey ? (",null,false," + (hash(generatedSlots))) : "") + ")")
	}

	function hash(str) {
	  var hash = 5381;
	  var i = str.length;
	  while(i) {
	    hash = (hash * 33) ^ str.charCodeAt(--i);
	  }
	  return hash >>> 0
	}

	function containsSlotChild (el) {
	  if (el.type === 1) {
	    if (el.tag === 'slot') {
	      return true
	    }
	    return el.children.some(containsSlotChild)
	  }
	  return false
	}

	function genScopedSlot (
	  el,
	  state
	) {
	  var isLegacySyntax = el.attrsMap['slot-scope'];
	  if (el.if && !el.ifProcessed && !isLegacySyntax) {
	    return genIf(el, state, genScopedSlot, "null")
	  }
	  if (el.for && !el.forProcessed) {
	    return genFor(el, state, genScopedSlot)
	  }
	  var slotScope = el.slotScope === emptySlotScopeToken
	    ? ""
	    : String(el.slotScope);
	  var fn = "function(" + slotScope + "){" +
	    "return " + (el.tag === 'template'
	      ? el.if && isLegacySyntax
	        ? ("(" + (el.if) + ")?" + (genChildren(el, state) || 'undefined') + ":undefined")
	        : genChildren(el, state) || 'undefined'
	      : genElement(el, state)) + "}";
	  // reverse proxy v-slot without scope on this.$slots
	  var reverseProxy = slotScope ? "" : ",proxy:true";
	  return ("{key:" + (el.slotTarget || "\"default\"") + ",fn:" + fn + reverseProxy + "}")
	}

	function genChildren (
	  el,
	  state,
	  checkSkip,
	  altGenElement,
	  altGenNode
	) {
	  var children = el.children;
	  if (children.length) {
	    var el$1 = children[0];
	    // optimize single v-for
	    if (children.length === 1 &&
	      el$1.for &&
	      el$1.tag !== 'template' &&
	      el$1.tag !== 'slot'
	    ) {
	      var normalizationType = checkSkip
	        ? state.maybeComponent(el$1) ? ",1" : ",0"
	        : "";
	      return ("" + ((altGenElement || genElement)(el$1, state)) + normalizationType)
	    }
	    var normalizationType$1 = checkSkip
	      ? getNormalizationType(children, state.maybeComponent)
	      : 0;
	    var gen = altGenNode || genNode;
	    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType$1 ? ("," + normalizationType$1) : ''))
	  }
	}

	// determine the normalization needed for the children array.
	// 0: no normalization needed
	// 1: simple normalization needed (possible 1-level deep nested array)
	// 2: full normalization needed
	function getNormalizationType (
	  children,
	  maybeComponent
	) {
	  var res = 0;
	  for (var i = 0; i < children.length; i++) {
	    var el = children[i];
	    if (el.type !== 1) {
	      continue
	    }
	    if (needsNormalization(el) ||
	        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
	      res = 2;
	      break
	    }
	    if (maybeComponent(el) ||
	        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
	      res = 1;
	    }
	  }
	  return res
	}

	function needsNormalization (el) {
	  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
	}

	function genNode (node, state) {
	  if (node.type === 1) {
	    return genElement(node, state)
	  } else if (node.type === 3 && node.isComment) {
	    return genComment(node)
	  } else {
	    return genText(node)
	  }
	}

	function genText (text) {
	  return ("_v(" + (text.type === 2
	    ? text.expression // no need for () because already wrapped in _s()
	    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
	}

	function genComment (comment) {
	  return ("_e(" + (JSON.stringify(comment.text)) + ")")
	}

	function genSlot (el, state) {
	  var slotName = el.slotName || '"default"';
	  var children = genChildren(el, state);
	  var res = "_t(" + slotName + (children ? ("," + children) : '');
	  var attrs = el.attrs || el.dynamicAttrs
	    ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(function (attr) { return ({
	        // slot props are camelized
	        name: camelize(attr.name),
	        value: attr.value,
	        dynamic: attr.dynamic
	      }); }))
	    : null;
	  var bind$$1 = el.attrsMap['v-bind'];
	  if ((attrs || bind$$1) && !children) {
	    res += ",null";
	  }
	  if (attrs) {
	    res += "," + attrs;
	  }
	  if (bind$$1) {
	    res += (attrs ? '' : ',null') + "," + bind$$1;
	  }
	  return res + ')'
	}

	// componentName is el.component, take it as argument to shun flow's pessimistic refinement
	function genComponent (
	  componentName,
	  el,
	  state
	) {
	  var children = el.inlineTemplate ? null : genChildren(el, state, true);
	  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
	}

	function genProps (props) {
	  var staticProps = "";
	  var dynamicProps = "";
	  for (var i = 0; i < props.length; i++) {
	    var prop = props[i];
	    var value = transformSpecialNewlines(prop.value);
	    if (prop.dynamic) {
	      dynamicProps += (prop.name) + "," + value + ",";
	    } else {
	      staticProps += "\"" + (prop.name) + "\":" + value + ",";
	    }
	  }
	  staticProps = "{" + (staticProps.slice(0, -1)) + "}";
	  if (dynamicProps) {
	    return ("_d(" + staticProps + ",[" + (dynamicProps.slice(0, -1)) + "])")
	  } else {
	    return staticProps
	  }
	}

	// #3895, #4268
	function transformSpecialNewlines (text) {
	  return text
	    .replace(/\u2028/g, '\\u2028')
	    .replace(/\u2029/g, '\\u2029')
	}

	/*  */



	// these keywords should not appear inside expressions, but operators like
	// typeof, instanceof and in are allowed
	var prohibitedKeywordRE = new RegExp('\\b' + (
	  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
	  'super,throw,while,yield,delete,export,import,return,switch,default,' +
	  'extends,finally,continue,debugger,function,arguments'
	).split(',').join('\\b|\\b') + '\\b');

	// these unary operators should not be used as property/method names
	var unaryOperatorsRE = new RegExp('\\b' + (
	  'delete,typeof,void'
	).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

	// strip strings in expressions
	var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

	// detect problematic expressions in a template
	function detectErrors (ast, warn) {
	  if (ast) {
	    checkNode(ast, warn);
	  }
	}

	function checkNode (node, warn) {
	  if (node.type === 1) {
	    for (var name in node.attrsMap) {
	      if (dirRE.test(name)) {
	        var value = node.attrsMap[name];
	        if (value) {
	          var range = node.rawAttrsMap[name];
	          if (name === 'v-for') {
	            checkFor(node, ("v-for=\"" + value + "\""), warn, range);
	          } else if (name === 'v-slot' || name[0] === '#') {
	            checkFunctionParameterExpression(value, (name + "=\"" + value + "\""), warn, range);
	          } else if (onRE.test(name)) {
	            checkEvent(value, (name + "=\"" + value + "\""), warn, range);
	          } else {
	            checkExpression(value, (name + "=\"" + value + "\""), warn, range);
	          }
	        }
	      }
	    }
	    if (node.children) {
	      for (var i = 0; i < node.children.length; i++) {
	        checkNode(node.children[i], warn);
	      }
	    }
	  } else if (node.type === 2) {
	    checkExpression(node.expression, node.text, warn, node);
	  }
	}

	function checkEvent (exp, text, warn, range) {
	  var stripped = exp.replace(stripStringRE, '');
	  var keywordMatch = stripped.match(unaryOperatorsRE);
	  if (keywordMatch && stripped.charAt(keywordMatch.index - 1) !== '$') {
	    warn(
	      "avoid using JavaScript unary operator as property name: " +
	      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim()),
	      range
	    );
	  }
	  checkExpression(exp, text, warn, range);
	}

	function checkFor (node, text, warn, range) {
	  checkExpression(node.for || '', text, warn, range);
	  checkIdentifier(node.alias, 'v-for alias', text, warn, range);
	  checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
	  checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
	}

	function checkIdentifier (
	  ident,
	  type,
	  text,
	  warn,
	  range
	) {
	  if (typeof ident === 'string') {
	    try {
	      new Function(("var " + ident + "=_"));
	    } catch (e) {
	      warn(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())), range);
	    }
	  }
	}

	function checkExpression (exp, text, warn, range) {
	  try {
	    new Function(("return " + exp));
	  } catch (e) {
	    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
	    if (keywordMatch) {
	      warn(
	        "avoid using JavaScript keyword as property name: " +
	        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim()),
	        range
	      );
	    } else {
	      warn(
	        "invalid expression: " + (e.message) + " in\n\n" +
	        "    " + exp + "\n\n" +
	        "  Raw expression: " + (text.trim()) + "\n",
	        range
	      );
	    }
	  }
	}

	function checkFunctionParameterExpression (exp, text, warn, range) {
	  try {
	    new Function(exp, '');
	  } catch (e) {
	    warn(
	      "invalid function parameter expression: " + (e.message) + " in\n\n" +
	      "    " + exp + "\n\n" +
	      "  Raw expression: " + (text.trim()) + "\n",
	      range
	    );
	  }
	}

	/*  */

	var range = 2;

	function generateCodeFrame (
	  source,
	  start,
	  end
	) {
	  if ( start === void 0 ) start = 0;
	  if ( end === void 0 ) end = source.length;

	  var lines = source.split(/\r?\n/);
	  var count = 0;
	  var res = [];
	  for (var i = 0; i < lines.length; i++) {
	    count += lines[i].length + 1;
	    if (count >= start) {
	      for (var j = i - range; j <= i + range || end > count; j++) {
	        if (j < 0 || j >= lines.length) { continue }
	        res.push(("" + (j + 1) + (repeat$1(" ", 3 - String(j + 1).length)) + "|  " + (lines[j])));
	        var lineLength = lines[j].length;
	        if (j === i) {
	          // push underline
	          var pad = start - (count - lineLength) + 1;
	          var length = end > count ? lineLength - pad : end - start;
	          res.push("   |  " + repeat$1(" ", pad) + repeat$1("^", length));
	        } else if (j > i) {
	          if (end > count) {
	            var length$1 = Math.min(end - count, lineLength);
	            res.push("   |  " + repeat$1("^", length$1));
	          }
	          count += lineLength + 1;
	        }
	      }
	      break
	    }
	  }
	  return res.join('\n')
	}

	function repeat$1 (str, n) {
	  var result = '';
	  if (n > 0) {
	    while (true) { // eslint-disable-line
	      if (n & 1) { result += str; }
	      n >>>= 1;
	      if (n <= 0) { break }
	      str += str;
	    }
	  }
	  return result
	}

	/*  */



	function createFunction (code, errors) {
	  try {
	    return new Function(code)
	  } catch (err) {
	    errors.push({ err: err, code: code });
	    return noop$1
	  }
	}

	function createCompileToFunctionFn (compile) {
	  var cache = Object.create(null);

	  return function compileToFunctions (
	    template,
	    options,
	    vm
	  ) {
	    options = extend$1({}, options);
	    var warn$$1 = options.warn || warn$1;
	    delete options.warn;

	    /* istanbul ignore if */
	    {
	      // detect possible CSP restriction
	      try {
	        new Function('return 1');
	      } catch (e) {
	        if (e.toString().match(/unsafe-eval|CSP/)) {
	          warn$$1(
	            'It seems you are using the standalone build of Vue.js in an ' +
	            'environment with Content Security Policy that prohibits unsafe-eval. ' +
	            'The template compiler cannot work in this environment. Consider ' +
	            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
	            'templates into render functions.'
	          );
	        }
	      }
	    }

	    // check cache
	    var key = options.delimiters
	      ? String(options.delimiters) + template
	      : template;
	    if (cache[key]) {
	      return cache[key]
	    }

	    // compile
	    var compiled = compile(template, options);

	    // check compilation errors/tips
	    {
	      if (compiled.errors && compiled.errors.length) {
	        if (options.outputSourceRange) {
	          compiled.errors.forEach(function (e) {
	            warn$$1(
	              "Error compiling template:\n\n" + (e.msg) + "\n\n" +
	              generateCodeFrame(template, e.start, e.end),
	              vm
	            );
	          });
	        } else {
	          warn$$1(
	            "Error compiling template:\n\n" + template + "\n\n" +
	            compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
	            vm
	          );
	        }
	      }
	      if (compiled.tips && compiled.tips.length) {
	        if (options.outputSourceRange) {
	          compiled.tips.forEach(function (e) { return tip(e.msg, vm); });
	        } else {
	          compiled.tips.forEach(function (msg) { return tip(msg, vm); });
	        }
	      }
	    }

	    // turn code into functions
	    var res = {};
	    var fnGenErrors = [];
	    res.render = createFunction(compiled.render, fnGenErrors);
	    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
	      return createFunction(code, fnGenErrors)
	    });

	    // check function generation errors.
	    // this should only happen if there is a bug in the compiler itself.
	    // mostly for codegen development use
	    /* istanbul ignore if */
	    {
	      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
	        warn$$1(
	          "Failed to generate render function:\n\n" +
	          fnGenErrors.map(function (ref) {
	            var err = ref.err;
	            var code = ref.code;

	            return ((err.toString()) + " in\n\n" + code + "\n");
	        }).join('\n'),
	          vm
	        );
	      }
	    }

	    return (cache[key] = res)
	  }
	}

	/*  */

	function createCompilerCreator (baseCompile) {
	  return function createCompiler (baseOptions) {
	    function compile (
	      template,
	      options
	    ) {
	      var finalOptions = Object.create(baseOptions);
	      var errors = [];
	      var tips = [];

	      var warn = function (msg, range, tip) {
	        (tip ? tips : errors).push(msg);
	      };

	      if (options) {
	        if (options.outputSourceRange) {
	          // $flow-disable-line
	          var leadingSpaceLength = template.match(/^\s*/)[0].length;

	          warn = function (msg, range, tip) {
	            var data = { msg: msg };
	            if (range) {
	              if (range.start != null) {
	                data.start = range.start + leadingSpaceLength;
	              }
	              if (range.end != null) {
	                data.end = range.end + leadingSpaceLength;
	              }
	            }
	            (tip ? tips : errors).push(data);
	          };
	        }
	        // merge custom modules
	        if (options.modules) {
	          finalOptions.modules =
	            (baseOptions.modules || []).concat(options.modules);
	        }
	        // merge custom directives
	        if (options.directives) {
	          finalOptions.directives = extend$1(
	            Object.create(baseOptions.directives || null),
	            options.directives
	          );
	        }
	        // copy other options
	        for (var key in options) {
	          if (key !== 'modules' && key !== 'directives') {
	            finalOptions[key] = options[key];
	          }
	        }
	      }

	      finalOptions.warn = warn;

	      var compiled = baseCompile(template.trim(), finalOptions);
	      {
	        detectErrors(compiled.ast, warn);
	      }
	      compiled.errors = errors;
	      compiled.tips = tips;
	      return compiled
	    }

	    return {
	      compile: compile,
	      compileToFunctions: createCompileToFunctionFn(compile)
	    }
	  }
	}

	/*  */

	// `createCompilerCreator` allows creating compilers that use alternative
	// parser/optimizer/codegen, e.g the SSR optimizing compiler.
	// Here we just export a default compiler using the default parts.
	var createCompiler = createCompilerCreator(function baseCompile (
	  template,
	  options
	) {
	  var ast = parse$1(template.trim(), options);
	  if (options.optimize !== false) {
	    optimize(ast, options);
	  }
	  var code = generate(ast, options);
	  return {
	    ast: ast,
	    render: code.render,
	    staticRenderFns: code.staticRenderFns
	  }
	});

	/*  */

	var ref$1 = createCompiler(baseOptions);
	var compileToFunctions = ref$1.compileToFunctions;

	/*  */

	// check whether current browser encodes a char inside attribute values
	var div;
	function getShouldDecode (href) {
	  div = div || document.createElement('div');
	  div.innerHTML = href ? "<a href=\"\n\"/>" : "<div a=\"\n\"/>";
	  return div.innerHTML.indexOf('&#10;') > 0
	}

	// #3663: IE encodes newlines inside attribute values while other browsers don't
	var shouldDecodeNewlines = inBrowser$1 ? getShouldDecode(false) : false;
	// #6828: chrome encodes content in a[href]
	var shouldDecodeNewlinesForHref = inBrowser$1 ? getShouldDecode(true) : false;

	/*  */

	var idToTemplate = cached(function (id) {
	  var el = query(id);
	  return el && el.innerHTML
	});

	var mount = Vue$1.prototype.$mount;
	Vue$1.prototype.$mount = function (
	  el,
	  hydrating
	) {
	  el = el && query(el);

	  /* istanbul ignore if */
	  if (el === document.body || el === document.documentElement) {
	    warn$1(
	      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
	    );
	    return this
	  }

	  var options = this.$options;
	  // resolve template/el and convert to render function
	  if (!options.render) {
	    var template = options.template;
	    if (template) {
	      if (typeof template === 'string') {
	        if (template.charAt(0) === '#') {
	          template = idToTemplate(template);
	          /* istanbul ignore if */
	          if (!template) {
	            warn$1(
	              ("Template element not found or is empty: " + (options.template)),
	              this
	            );
	          }
	        }
	      } else if (template.nodeType) {
	        template = template.innerHTML;
	      } else {
	        {
	          warn$1('invalid template option:' + template, this);
	        }
	        return this
	      }
	    } else if (el) {
	      template = getOuterHTML(el);
	    }
	    if (template) {
	      /* istanbul ignore if */
	      if (config.performance && mark) {
	        mark('compile');
	      }

	      var ref = compileToFunctions(template, {
	        outputSourceRange: "development" !== 'production',
	        shouldDecodeNewlines: shouldDecodeNewlines,
	        shouldDecodeNewlinesForHref: shouldDecodeNewlinesForHref,
	        delimiters: options.delimiters,
	        comments: options.comments
	      }, this);
	      var render = ref.render;
	      var staticRenderFns = ref.staticRenderFns;
	      options.render = render;
	      options.staticRenderFns = staticRenderFns;

	      /* istanbul ignore if */
	      if (config.performance && mark) {
	        mark('compile end');
	        measure(("vue " + (this._name) + " compile"), 'compile', 'compile end');
	      }
	    }
	  }
	  return mount.call(this, el, hydrating)
	};

	/**
	 * Get outerHTML of elements, taking care
	 * of SVG elements in IE as well.
	 */
	function getOuterHTML (el) {
	  if (el.outerHTML) {
	    return el.outerHTML
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(el.cloneNode(true));
	    return container.innerHTML
	  }
	}

	Vue$1.compile = compileToFunctions;

	var vue_common_dev = Vue$1;

	{
	  vue_common.exports = vue_common_dev;
	}

	var Vue = vue_common.exports;

	var axios$1 = {exports: {}};

	/* axios v0.19.2 | (c) 2020 by Matt Zabriskie */

	(function (module, exports) {
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ (function(module, exports, __webpack_require__) {

		module.exports = __webpack_require__(1);

	/***/ }),
	/* 1 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		var bind = __webpack_require__(3);
		var Axios = __webpack_require__(4);
		var mergeConfig = __webpack_require__(22);
		var defaults = __webpack_require__(10);
		
		/**
		 * Create an instance of Axios
		 *
		 * @param {Object} defaultConfig The default config for the instance
		 * @return {Axios} A new instance of Axios
		 */
		function createInstance(defaultConfig) {
		  var context = new Axios(defaultConfig);
		  var instance = bind(Axios.prototype.request, context);
		
		  // Copy axios.prototype to instance
		  utils.extend(instance, Axios.prototype, context);
		
		  // Copy context to instance
		  utils.extend(instance, context);
		
		  return instance;
		}
		
		// Create the default instance to be exported
		var axios = createInstance(defaults);
		
		// Expose Axios class to allow class inheritance
		axios.Axios = Axios;
		
		// Factory for creating new instances
		axios.create = function create(instanceConfig) {
		  return createInstance(mergeConfig(axios.defaults, instanceConfig));
		};
		
		// Expose Cancel & CancelToken
		axios.Cancel = __webpack_require__(23);
		axios.CancelToken = __webpack_require__(24);
		axios.isCancel = __webpack_require__(9);
		
		// Expose all/spread
		axios.all = function all(promises) {
		  return Promise.all(promises);
		};
		axios.spread = __webpack_require__(25);
		
		module.exports = axios;
		
		// Allow use of default import syntax in TypeScript
		module.exports.default = axios;


	/***/ }),
	/* 2 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var bind = __webpack_require__(3);
		
		/*global toString:true*/
		
		// utils is a library of generic helper functions non-specific to axios
		
		var toString = Object.prototype.toString;
		
		/**
		 * Determine if a value is an Array
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an Array, otherwise false
		 */
		function isArray(val) {
		  return toString.call(val) === '[object Array]';
		}
		
		/**
		 * Determine if a value is undefined
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if the value is undefined, otherwise false
		 */
		function isUndefined(val) {
		  return typeof val === 'undefined';
		}
		
		/**
		 * Determine if a value is a Buffer
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Buffer, otherwise false
		 */
		function isBuffer(val) {
		  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
		    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
		}
		
		/**
		 * Determine if a value is an ArrayBuffer
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
		 */
		function isArrayBuffer(val) {
		  return toString.call(val) === '[object ArrayBuffer]';
		}
		
		/**
		 * Determine if a value is a FormData
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an FormData, otherwise false
		 */
		function isFormData(val) {
		  return (typeof FormData !== 'undefined') && (val instanceof FormData);
		}
		
		/**
		 * Determine if a value is a view on an ArrayBuffer
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
		 */
		function isArrayBufferView(val) {
		  var result;
		  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
		    result = ArrayBuffer.isView(val);
		  } else {
		    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
		  }
		  return result;
		}
		
		/**
		 * Determine if a value is a String
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a String, otherwise false
		 */
		function isString(val) {
		  return typeof val === 'string';
		}
		
		/**
		 * Determine if a value is a Number
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Number, otherwise false
		 */
		function isNumber(val) {
		  return typeof val === 'number';
		}
		
		/**
		 * Determine if a value is an Object
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is an Object, otherwise false
		 */
		function isObject(val) {
		  return val !== null && typeof val === 'object';
		}
		
		/**
		 * Determine if a value is a Date
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Date, otherwise false
		 */
		function isDate(val) {
		  return toString.call(val) === '[object Date]';
		}
		
		/**
		 * Determine if a value is a File
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a File, otherwise false
		 */
		function isFile(val) {
		  return toString.call(val) === '[object File]';
		}
		
		/**
		 * Determine if a value is a Blob
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Blob, otherwise false
		 */
		function isBlob(val) {
		  return toString.call(val) === '[object Blob]';
		}
		
		/**
		 * Determine if a value is a Function
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Function, otherwise false
		 */
		function isFunction(val) {
		  return toString.call(val) === '[object Function]';
		}
		
		/**
		 * Determine if a value is a Stream
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a Stream, otherwise false
		 */
		function isStream(val) {
		  return isObject(val) && isFunction(val.pipe);
		}
		
		/**
		 * Determine if a value is a URLSearchParams object
		 *
		 * @param {Object} val The value to test
		 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
		 */
		function isURLSearchParams(val) {
		  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
		}
		
		/**
		 * Trim excess whitespace off the beginning and end of a string
		 *
		 * @param {String} str The String to trim
		 * @returns {String} The String freed of excess whitespace
		 */
		function trim(str) {
		  return str.replace(/^\s*/, '').replace(/\s*$/, '');
		}
		
		/**
		 * Determine if we're running in a standard browser environment
		 *
		 * This allows axios to run in a web worker, and react-native.
		 * Both environments support XMLHttpRequest, but not fully standard globals.
		 *
		 * web workers:
		 *  typeof window -> undefined
		 *  typeof document -> undefined
		 *
		 * react-native:
		 *  navigator.product -> 'ReactNative'
		 * nativescript
		 *  navigator.product -> 'NativeScript' or 'NS'
		 */
		function isStandardBrowserEnv() {
		  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
		                                           navigator.product === 'NativeScript' ||
		                                           navigator.product === 'NS')) {
		    return false;
		  }
		  return (
		    typeof window !== 'undefined' &&
		    typeof document !== 'undefined'
		  );
		}
		
		/**
		 * Iterate over an Array or an Object invoking a function for each item.
		 *
		 * If `obj` is an Array callback will be called passing
		 * the value, index, and complete array for each item.
		 *
		 * If 'obj' is an Object callback will be called passing
		 * the value, key, and complete object for each property.
		 *
		 * @param {Object|Array} obj The object to iterate
		 * @param {Function} fn The callback to invoke for each item
		 */
		function forEach(obj, fn) {
		  // Don't bother if no value provided
		  if (obj === null || typeof obj === 'undefined') {
		    return;
		  }
		
		  // Force an array if not already something iterable
		  if (typeof obj !== 'object') {
		    /*eslint no-param-reassign:0*/
		    obj = [obj];
		  }
		
		  if (isArray(obj)) {
		    // Iterate over array values
		    for (var i = 0, l = obj.length; i < l; i++) {
		      fn.call(null, obj[i], i, obj);
		    }
		  } else {
		    // Iterate over object keys
		    for (var key in obj) {
		      if (Object.prototype.hasOwnProperty.call(obj, key)) {
		        fn.call(null, obj[key], key, obj);
		      }
		    }
		  }
		}
		
		/**
		 * Accepts varargs expecting each argument to be an object, then
		 * immutably merges the properties of each object and returns result.
		 *
		 * When multiple objects contain the same key the later object in
		 * the arguments list will take precedence.
		 *
		 * Example:
		 *
		 * ```js
		 * var result = merge({foo: 123}, {foo: 456});
		 * console.log(result.foo); // outputs 456
		 * ```
		 *
		 * @param {Object} obj1 Object to merge
		 * @returns {Object} Result of all merge properties
		 */
		function merge(/* obj1, obj2, obj3, ... */) {
		  var result = {};
		  function assignValue(val, key) {
		    if (typeof result[key] === 'object' && typeof val === 'object') {
		      result[key] = merge(result[key], val);
		    } else {
		      result[key] = val;
		    }
		  }
		
		  for (var i = 0, l = arguments.length; i < l; i++) {
		    forEach(arguments[i], assignValue);
		  }
		  return result;
		}
		
		/**
		 * Function equal to merge with the difference being that no reference
		 * to original objects is kept.
		 *
		 * @see merge
		 * @param {Object} obj1 Object to merge
		 * @returns {Object} Result of all merge properties
		 */
		function deepMerge(/* obj1, obj2, obj3, ... */) {
		  var result = {};
		  function assignValue(val, key) {
		    if (typeof result[key] === 'object' && typeof val === 'object') {
		      result[key] = deepMerge(result[key], val);
		    } else if (typeof val === 'object') {
		      result[key] = deepMerge({}, val);
		    } else {
		      result[key] = val;
		    }
		  }
		
		  for (var i = 0, l = arguments.length; i < l; i++) {
		    forEach(arguments[i], assignValue);
		  }
		  return result;
		}
		
		/**
		 * Extends object a by mutably adding to it the properties of object b.
		 *
		 * @param {Object} a The object to be extended
		 * @param {Object} b The object to copy properties from
		 * @param {Object} thisArg The object to bind function to
		 * @return {Object} The resulting value of object a
		 */
		function extend(a, b, thisArg) {
		  forEach(b, function assignValue(val, key) {
		    if (thisArg && typeof val === 'function') {
		      a[key] = bind(val, thisArg);
		    } else {
		      a[key] = val;
		    }
		  });
		  return a;
		}
		
		module.exports = {
		  isArray: isArray,
		  isArrayBuffer: isArrayBuffer,
		  isBuffer: isBuffer,
		  isFormData: isFormData,
		  isArrayBufferView: isArrayBufferView,
		  isString: isString,
		  isNumber: isNumber,
		  isObject: isObject,
		  isUndefined: isUndefined,
		  isDate: isDate,
		  isFile: isFile,
		  isBlob: isBlob,
		  isFunction: isFunction,
		  isStream: isStream,
		  isURLSearchParams: isURLSearchParams,
		  isStandardBrowserEnv: isStandardBrowserEnv,
		  forEach: forEach,
		  merge: merge,
		  deepMerge: deepMerge,
		  extend: extend,
		  trim: trim
		};


	/***/ }),
	/* 3 */
	/***/ (function(module, exports) {
		
		module.exports = function bind(fn, thisArg) {
		  return function wrap() {
		    var args = new Array(arguments.length);
		    for (var i = 0; i < args.length; i++) {
		      args[i] = arguments[i];
		    }
		    return fn.apply(thisArg, args);
		  };
		};


	/***/ }),
	/* 4 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		var buildURL = __webpack_require__(5);
		var InterceptorManager = __webpack_require__(6);
		var dispatchRequest = __webpack_require__(7);
		var mergeConfig = __webpack_require__(22);
		
		/**
		 * Create a new instance of Axios
		 *
		 * @param {Object} instanceConfig The default config for the instance
		 */
		function Axios(instanceConfig) {
		  this.defaults = instanceConfig;
		  this.interceptors = {
		    request: new InterceptorManager(),
		    response: new InterceptorManager()
		  };
		}
		
		/**
		 * Dispatch a request
		 *
		 * @param {Object} config The config specific for this request (merged with this.defaults)
		 */
		Axios.prototype.request = function request(config) {
		  /*eslint no-param-reassign:0*/
		  // Allow for axios('example/url'[, config]) a la fetch API
		  if (typeof config === 'string') {
		    config = arguments[1] || {};
		    config.url = arguments[0];
		  } else {
		    config = config || {};
		  }
		
		  config = mergeConfig(this.defaults, config);
		
		  // Set config.method
		  if (config.method) {
		    config.method = config.method.toLowerCase();
		  } else if (this.defaults.method) {
		    config.method = this.defaults.method.toLowerCase();
		  } else {
		    config.method = 'get';
		  }
		
		  // Hook up interceptors middleware
		  var chain = [dispatchRequest, undefined];
		  var promise = Promise.resolve(config);
		
		  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
		    chain.unshift(interceptor.fulfilled, interceptor.rejected);
		  });
		
		  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
		    chain.push(interceptor.fulfilled, interceptor.rejected);
		  });
		
		  while (chain.length) {
		    promise = promise.then(chain.shift(), chain.shift());
		  }
		
		  return promise;
		};
		
		Axios.prototype.getUri = function getUri(config) {
		  config = mergeConfig(this.defaults, config);
		  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
		};
		
		// Provide aliases for supported request methods
		utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
		  /*eslint func-names:0*/
		  Axios.prototype[method] = function(url, config) {
		    return this.request(utils.merge(config || {}, {
		      method: method,
		      url: url
		    }));
		  };
		});
		
		utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
		  /*eslint func-names:0*/
		  Axios.prototype[method] = function(url, data, config) {
		    return this.request(utils.merge(config || {}, {
		      method: method,
		      url: url,
		      data: data
		    }));
		  };
		});
		
		module.exports = Axios;


	/***/ }),
	/* 5 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		function encode(val) {
		  return encodeURIComponent(val).
		    replace(/%40/gi, '@').
		    replace(/%3A/gi, ':').
		    replace(/%24/g, '$').
		    replace(/%2C/gi, ',').
		    replace(/%20/g, '+').
		    replace(/%5B/gi, '[').
		    replace(/%5D/gi, ']');
		}
		
		/**
		 * Build a URL by appending params to the end
		 *
		 * @param {string} url The base of the url (e.g., http://www.google.com)
		 * @param {object} [params] The params to be appended
		 * @returns {string} The formatted url
		 */
		module.exports = function buildURL(url, params, paramsSerializer) {
		  /*eslint no-param-reassign:0*/
		  if (!params) {
		    return url;
		  }
		
		  var serializedParams;
		  if (paramsSerializer) {
		    serializedParams = paramsSerializer(params);
		  } else if (utils.isURLSearchParams(params)) {
		    serializedParams = params.toString();
		  } else {
		    var parts = [];
		
		    utils.forEach(params, function serialize(val, key) {
		      if (val === null || typeof val === 'undefined') {
		        return;
		      }
		
		      if (utils.isArray(val)) {
		        key = key + '[]';
		      } else {
		        val = [val];
		      }
		
		      utils.forEach(val, function parseValue(v) {
		        if (utils.isDate(v)) {
		          v = v.toISOString();
		        } else if (utils.isObject(v)) {
		          v = JSON.stringify(v);
		        }
		        parts.push(encode(key) + '=' + encode(v));
		      });
		    });
		
		    serializedParams = parts.join('&');
		  }
		
		  if (serializedParams) {
		    var hashmarkIndex = url.indexOf('#');
		    if (hashmarkIndex !== -1) {
		      url = url.slice(0, hashmarkIndex);
		    }
		
		    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
		  }
		
		  return url;
		};


	/***/ }),
	/* 6 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		function InterceptorManager() {
		  this.handlers = [];
		}
		
		/**
		 * Add a new interceptor to the stack
		 *
		 * @param {Function} fulfilled The function to handle `then` for a `Promise`
		 * @param {Function} rejected The function to handle `reject` for a `Promise`
		 *
		 * @return {Number} An ID used to remove interceptor later
		 */
		InterceptorManager.prototype.use = function use(fulfilled, rejected) {
		  this.handlers.push({
		    fulfilled: fulfilled,
		    rejected: rejected
		  });
		  return this.handlers.length - 1;
		};
		
		/**
		 * Remove an interceptor from the stack
		 *
		 * @param {Number} id The ID that was returned by `use`
		 */
		InterceptorManager.prototype.eject = function eject(id) {
		  if (this.handlers[id]) {
		    this.handlers[id] = null;
		  }
		};
		
		/**
		 * Iterate over all the registered interceptors
		 *
		 * This method is particularly useful for skipping over any
		 * interceptors that may have become `null` calling `eject`.
		 *
		 * @param {Function} fn The function to call for each interceptor
		 */
		InterceptorManager.prototype.forEach = function forEach(fn) {
		  utils.forEach(this.handlers, function forEachHandler(h) {
		    if (h !== null) {
		      fn(h);
		    }
		  });
		};
		
		module.exports = InterceptorManager;


	/***/ }),
	/* 7 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		var transformData = __webpack_require__(8);
		var isCancel = __webpack_require__(9);
		var defaults = __webpack_require__(10);
		
		/**
		 * Throws a `Cancel` if cancellation has been requested.
		 */
		function throwIfCancellationRequested(config) {
		  if (config.cancelToken) {
		    config.cancelToken.throwIfRequested();
		  }
		}
		
		/**
		 * Dispatch a request to the server using the configured adapter.
		 *
		 * @param {object} config The config that is to be used for the request
		 * @returns {Promise} The Promise to be fulfilled
		 */
		module.exports = function dispatchRequest(config) {
		  throwIfCancellationRequested(config);
		
		  // Ensure headers exist
		  config.headers = config.headers || {};
		
		  // Transform request data
		  config.data = transformData(
		    config.data,
		    config.headers,
		    config.transformRequest
		  );
		
		  // Flatten headers
		  config.headers = utils.merge(
		    config.headers.common || {},
		    config.headers[config.method] || {},
		    config.headers
		  );
		
		  utils.forEach(
		    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
		    function cleanHeaderConfig(method) {
		      delete config.headers[method];
		    }
		  );
		
		  var adapter = config.adapter || defaults.adapter;
		
		  return adapter(config).then(function onAdapterResolution(response) {
		    throwIfCancellationRequested(config);
		
		    // Transform response data
		    response.data = transformData(
		      response.data,
		      response.headers,
		      config.transformResponse
		    );
		
		    return response;
		  }, function onAdapterRejection(reason) {
		    if (!isCancel(reason)) {
		      throwIfCancellationRequested(config);
		
		      // Transform response data
		      if (reason && reason.response) {
		        reason.response.data = transformData(
		          reason.response.data,
		          reason.response.headers,
		          config.transformResponse
		        );
		      }
		    }
		
		    return Promise.reject(reason);
		  });
		};


	/***/ }),
	/* 8 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		/**
		 * Transform the data for a request or a response
		 *
		 * @param {Object|String} data The data to be transformed
		 * @param {Array} headers The headers for the request or response
		 * @param {Array|Function} fns A single function or Array of functions
		 * @returns {*} The resulting transformed data
		 */
		module.exports = function transformData(data, headers, fns) {
		  /*eslint no-param-reassign:0*/
		  utils.forEach(fns, function transform(fn) {
		    data = fn(data, headers);
		  });
		
		  return data;
		};


	/***/ }),
	/* 9 */
	/***/ (function(module, exports) {
		
		module.exports = function isCancel(value) {
		  return !!(value && value.__CANCEL__);
		};


	/***/ }),
	/* 10 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		var normalizeHeaderName = __webpack_require__(11);
		
		var DEFAULT_CONTENT_TYPE = {
		  'Content-Type': 'application/x-www-form-urlencoded'
		};
		
		function setContentTypeIfUnset(headers, value) {
		  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
		    headers['Content-Type'] = value;
		  }
		}
		
		function getDefaultAdapter() {
		  var adapter;
		  if (typeof XMLHttpRequest !== 'undefined') {
		    // For browsers use XHR adapter
		    adapter = __webpack_require__(12);
		  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
		    // For node use HTTP adapter
		    adapter = __webpack_require__(12);
		  }
		  return adapter;
		}
		
		var defaults = {
		  adapter: getDefaultAdapter(),
		
		  transformRequest: [function transformRequest(data, headers) {
		    normalizeHeaderName(headers, 'Accept');
		    normalizeHeaderName(headers, 'Content-Type');
		    if (utils.isFormData(data) ||
		      utils.isArrayBuffer(data) ||
		      utils.isBuffer(data) ||
		      utils.isStream(data) ||
		      utils.isFile(data) ||
		      utils.isBlob(data)
		    ) {
		      return data;
		    }
		    if (utils.isArrayBufferView(data)) {
		      return data.buffer;
		    }
		    if (utils.isURLSearchParams(data)) {
		      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
		      return data.toString();
		    }
		    if (utils.isObject(data)) {
		      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
		      return JSON.stringify(data);
		    }
		    return data;
		  }],
		
		  transformResponse: [function transformResponse(data) {
		    /*eslint no-param-reassign:0*/
		    if (typeof data === 'string') {
		      try {
		        data = JSON.parse(data);
		      } catch (e) { /* Ignore */ }
		    }
		    return data;
		  }],
		
		  /**
		   * A timeout in milliseconds to abort a request. If set to 0 (default) a
		   * timeout is not created.
		   */
		  timeout: 0,
		
		  xsrfCookieName: 'XSRF-TOKEN',
		  xsrfHeaderName: 'X-XSRF-TOKEN',
		
		  maxContentLength: -1,
		
		  validateStatus: function validateStatus(status) {
		    return status >= 200 && status < 300;
		  }
		};
		
		defaults.headers = {
		  common: {
		    'Accept': 'application/json, text/plain, */*'
		  }
		};
		
		utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
		  defaults.headers[method] = {};
		});
		
		utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
		  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
		});
		
		module.exports = defaults;


	/***/ }),
	/* 11 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		module.exports = function normalizeHeaderName(headers, normalizedName) {
		  utils.forEach(headers, function processHeader(value, name) {
		    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
		      headers[normalizedName] = value;
		      delete headers[name];
		    }
		  });
		};


	/***/ }),
	/* 12 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		var settle = __webpack_require__(13);
		var buildURL = __webpack_require__(5);
		var buildFullPath = __webpack_require__(16);
		var parseHeaders = __webpack_require__(19);
		var isURLSameOrigin = __webpack_require__(20);
		var createError = __webpack_require__(14);
		
		module.exports = function xhrAdapter(config) {
		  return new Promise(function dispatchXhrRequest(resolve, reject) {
		    var requestData = config.data;
		    var requestHeaders = config.headers;
		
		    if (utils.isFormData(requestData)) {
		      delete requestHeaders['Content-Type']; // Let the browser set it
		    }
		
		    var request = new XMLHttpRequest();
		
		    // HTTP basic authentication
		    if (config.auth) {
		      var username = config.auth.username || '';
		      var password = config.auth.password || '';
		      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
		    }
		
		    var fullPath = buildFullPath(config.baseURL, config.url);
		    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
		
		    // Set the request timeout in MS
		    request.timeout = config.timeout;
		
		    // Listen for ready state
		    request.onreadystatechange = function handleLoad() {
		      if (!request || request.readyState !== 4) {
		        return;
		      }
		
		      // The request errored out and we didn't get a response, this will be
		      // handled by onerror instead
		      // With one exception: request that using file: protocol, most browsers
		      // will return status as 0 even though it's a successful request
		      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
		        return;
		      }
		
		      // Prepare the response
		      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
		      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
		      var response = {
		        data: responseData,
		        status: request.status,
		        statusText: request.statusText,
		        headers: responseHeaders,
		        config: config,
		        request: request
		      };
		
		      settle(resolve, reject, response);
		
		      // Clean up request
		      request = null;
		    };
		
		    // Handle browser request cancellation (as opposed to a manual cancellation)
		    request.onabort = function handleAbort() {
		      if (!request) {
		        return;
		      }
		
		      reject(createError('Request aborted', config, 'ECONNABORTED', request));
		
		      // Clean up request
		      request = null;
		    };
		
		    // Handle low level network errors
		    request.onerror = function handleError() {
		      // Real errors are hidden from us by the browser
		      // onerror should only fire if it's a network error
		      reject(createError('Network Error', config, null, request));
		
		      // Clean up request
		      request = null;
		    };
		
		    // Handle timeout
		    request.ontimeout = function handleTimeout() {
		      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
		      if (config.timeoutErrorMessage) {
		        timeoutErrorMessage = config.timeoutErrorMessage;
		      }
		      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
		        request));
		
		      // Clean up request
		      request = null;
		    };
		
		    // Add xsrf header
		    // This is only done if running in a standard browser environment.
		    // Specifically not if we're in a web worker, or react-native.
		    if (utils.isStandardBrowserEnv()) {
		      var cookies = __webpack_require__(21);
		
		      // Add xsrf header
		      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
		        cookies.read(config.xsrfCookieName) :
		        undefined;
		
		      if (xsrfValue) {
		        requestHeaders[config.xsrfHeaderName] = xsrfValue;
		      }
		    }
		
		    // Add headers to the request
		    if ('setRequestHeader' in request) {
		      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
		        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
		          // Remove Content-Type if data is undefined
		          delete requestHeaders[key];
		        } else {
		          // Otherwise add header to the request
		          request.setRequestHeader(key, val);
		        }
		      });
		    }
		
		    // Add withCredentials to request if needed
		    if (!utils.isUndefined(config.withCredentials)) {
		      request.withCredentials = !!config.withCredentials;
		    }
		
		    // Add responseType to request if needed
		    if (config.responseType) {
		      try {
		        request.responseType = config.responseType;
		      } catch (e) {
		        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
		        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
		        if (config.responseType !== 'json') {
		          throw e;
		        }
		      }
		    }
		
		    // Handle progress if needed
		    if (typeof config.onDownloadProgress === 'function') {
		      request.addEventListener('progress', config.onDownloadProgress);
		    }
		
		    // Not all browsers support upload events
		    if (typeof config.onUploadProgress === 'function' && request.upload) {
		      request.upload.addEventListener('progress', config.onUploadProgress);
		    }
		
		    if (config.cancelToken) {
		      // Handle cancellation
		      config.cancelToken.promise.then(function onCanceled(cancel) {
		        if (!request) {
		          return;
		        }
		
		        request.abort();
		        reject(cancel);
		        // Clean up request
		        request = null;
		      });
		    }
		
		    if (requestData === undefined) {
		      requestData = null;
		    }
		
		    // Send the request
		    request.send(requestData);
		  });
		};


	/***/ }),
	/* 13 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var createError = __webpack_require__(14);
		
		/**
		 * Resolve or reject a Promise based on response status.
		 *
		 * @param {Function} resolve A function that resolves the promise.
		 * @param {Function} reject A function that rejects the promise.
		 * @param {object} response The response.
		 */
		module.exports = function settle(resolve, reject, response) {
		  var validateStatus = response.config.validateStatus;
		  if (!validateStatus || validateStatus(response.status)) {
		    resolve(response);
		  } else {
		    reject(createError(
		      'Request failed with status code ' + response.status,
		      response.config,
		      null,
		      response.request,
		      response
		    ));
		  }
		};


	/***/ }),
	/* 14 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var enhanceError = __webpack_require__(15);
		
		/**
		 * Create an Error with the specified message, config, error code, request and response.
		 *
		 * @param {string} message The error message.
		 * @param {Object} config The config.
		 * @param {string} [code] The error code (for example, 'ECONNABORTED').
		 * @param {Object} [request] The request.
		 * @param {Object} [response] The response.
		 * @returns {Error} The created error.
		 */
		module.exports = function createError(message, config, code, request, response) {
		  var error = new Error(message);
		  return enhanceError(error, config, code, request, response);
		};


	/***/ }),
	/* 15 */
	/***/ (function(module, exports) {
		
		/**
		 * Update an Error with the specified config, error code, and response.
		 *
		 * @param {Error} error The error to update.
		 * @param {Object} config The config.
		 * @param {string} [code] The error code (for example, 'ECONNABORTED').
		 * @param {Object} [request] The request.
		 * @param {Object} [response] The response.
		 * @returns {Error} The error.
		 */
		module.exports = function enhanceError(error, config, code, request, response) {
		  error.config = config;
		  if (code) {
		    error.code = code;
		  }
		
		  error.request = request;
		  error.response = response;
		  error.isAxiosError = true;
		
		  error.toJSON = function() {
		    return {
		      // Standard
		      message: this.message,
		      name: this.name,
		      // Microsoft
		      description: this.description,
		      number: this.number,
		      // Mozilla
		      fileName: this.fileName,
		      lineNumber: this.lineNumber,
		      columnNumber: this.columnNumber,
		      stack: this.stack,
		      // Axios
		      config: this.config,
		      code: this.code
		    };
		  };
		  return error;
		};


	/***/ }),
	/* 16 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var isAbsoluteURL = __webpack_require__(17);
		var combineURLs = __webpack_require__(18);
		
		/**
		 * Creates a new URL by combining the baseURL with the requestedURL,
		 * only when the requestedURL is not already an absolute URL.
		 * If the requestURL is absolute, this function returns the requestedURL untouched.
		 *
		 * @param {string} baseURL The base URL
		 * @param {string} requestedURL Absolute or relative URL to combine
		 * @returns {string} The combined full path
		 */
		module.exports = function buildFullPath(baseURL, requestedURL) {
		  if (baseURL && !isAbsoluteURL(requestedURL)) {
		    return combineURLs(baseURL, requestedURL);
		  }
		  return requestedURL;
		};


	/***/ }),
	/* 17 */
	/***/ (function(module, exports) {
		
		/**
		 * Determines whether the specified URL is absolute
		 *
		 * @param {string} url The URL to test
		 * @returns {boolean} True if the specified URL is absolute, otherwise false
		 */
		module.exports = function isAbsoluteURL(url) {
		  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
		  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
		  // by any combination of letters, digits, plus, period, or hyphen.
		  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
		};


	/***/ }),
	/* 18 */
	/***/ (function(module, exports) {
		
		/**
		 * Creates a new URL by combining the specified URLs
		 *
		 * @param {string} baseURL The base URL
		 * @param {string} relativeURL The relative URL
		 * @returns {string} The combined URL
		 */
		module.exports = function combineURLs(baseURL, relativeURL) {
		  return relativeURL
		    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
		    : baseURL;
		};


	/***/ }),
	/* 19 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		// Headers whose duplicates are ignored by node
		// c.f. https://nodejs.org/api/http.html#http_message_headers
		var ignoreDuplicateOf = [
		  'age', 'authorization', 'content-length', 'content-type', 'etag',
		  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
		  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
		  'referer', 'retry-after', 'user-agent'
		];
		
		/**
		 * Parse headers into an object
		 *
		 * ```
		 * Date: Wed, 27 Aug 2014 08:58:49 GMT
		 * Content-Type: application/json
		 * Connection: keep-alive
		 * Transfer-Encoding: chunked
		 * ```
		 *
		 * @param {String} headers Headers needing to be parsed
		 * @returns {Object} Headers parsed into an object
		 */
		module.exports = function parseHeaders(headers) {
		  var parsed = {};
		  var key;
		  var val;
		  var i;
		
		  if (!headers) { return parsed; }
		
		  utils.forEach(headers.split('\n'), function parser(line) {
		    i = line.indexOf(':');
		    key = utils.trim(line.substr(0, i)).toLowerCase();
		    val = utils.trim(line.substr(i + 1));
		
		    if (key) {
		      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
		        return;
		      }
		      if (key === 'set-cookie') {
		        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
		      } else {
		        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
		      }
		    }
		  });
		
		  return parsed;
		};


	/***/ }),
	/* 20 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		module.exports = (
		  utils.isStandardBrowserEnv() ?
		
		  // Standard browser envs have full support of the APIs needed to test
		  // whether the request URL is of the same origin as current location.
		    (function standardBrowserEnv() {
		      var msie = /(msie|trident)/i.test(navigator.userAgent);
		      var urlParsingNode = document.createElement('a');
		      var originURL;
		
		      /**
		    * Parse a URL to discover it's components
		    *
		    * @param {String} url The URL to be parsed
		    * @returns {Object}
		    */
		      function resolveURL(url) {
		        var href = url;
		
		        if (msie) {
		        // IE needs attribute set twice to normalize properties
		          urlParsingNode.setAttribute('href', href);
		          href = urlParsingNode.href;
		        }
		
		        urlParsingNode.setAttribute('href', href);
		
		        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
		        return {
		          href: urlParsingNode.href,
		          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
		          host: urlParsingNode.host,
		          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
		          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
		          hostname: urlParsingNode.hostname,
		          port: urlParsingNode.port,
		          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
		            urlParsingNode.pathname :
		            '/' + urlParsingNode.pathname
		        };
		      }
		
		      originURL = resolveURL(window.location.href);
		
		      /**
		    * Determine if a URL shares the same origin as the current location
		    *
		    * @param {String} requestURL The URL to test
		    * @returns {boolean} True if URL shares the same origin, otherwise false
		    */
		      return function isURLSameOrigin(requestURL) {
		        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
		        return (parsed.protocol === originURL.protocol &&
		            parsed.host === originURL.host);
		      };
		    })() :
		
		  // Non standard browser envs (web workers, react-native) lack needed support.
		    (function nonStandardBrowserEnv() {
		      return function isURLSameOrigin() {
		        return true;
		      };
		    })()
		);


	/***/ }),
	/* 21 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		module.exports = (
		  utils.isStandardBrowserEnv() ?
		
		  // Standard browser envs support document.cookie
		    (function standardBrowserEnv() {
		      return {
		        write: function write(name, value, expires, path, domain, secure) {
		          var cookie = [];
		          cookie.push(name + '=' + encodeURIComponent(value));
		
		          if (utils.isNumber(expires)) {
		            cookie.push('expires=' + new Date(expires).toGMTString());
		          }
		
		          if (utils.isString(path)) {
		            cookie.push('path=' + path);
		          }
		
		          if (utils.isString(domain)) {
		            cookie.push('domain=' + domain);
		          }
		
		          if (secure === true) {
		            cookie.push('secure');
		          }
		
		          document.cookie = cookie.join('; ');
		        },
		
		        read: function read(name) {
		          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
		          return (match ? decodeURIComponent(match[3]) : null);
		        },
		
		        remove: function remove(name) {
		          this.write(name, '', Date.now() - 86400000);
		        }
		      };
		    })() :
		
		  // Non standard browser env (web workers, react-native) lack needed support.
		    (function nonStandardBrowserEnv() {
		      return {
		        write: function write() {},
		        read: function read() { return null; },
		        remove: function remove() {}
		      };
		    })()
		);


	/***/ }),
	/* 22 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var utils = __webpack_require__(2);
		
		/**
		 * Config-specific merge-function which creates a new config-object
		 * by merging two configuration objects together.
		 *
		 * @param {Object} config1
		 * @param {Object} config2
		 * @returns {Object} New object resulting from merging config2 to config1
		 */
		module.exports = function mergeConfig(config1, config2) {
		  // eslint-disable-next-line no-param-reassign
		  config2 = config2 || {};
		  var config = {};
		
		  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
		  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
		  var defaultToConfig2Keys = [
		    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
		    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
		    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
		    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
		    'httpsAgent', 'cancelToken', 'socketPath'
		  ];
		
		  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
		    if (typeof config2[prop] !== 'undefined') {
		      config[prop] = config2[prop];
		    }
		  });
		
		  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
		    if (utils.isObject(config2[prop])) {
		      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
		    } else if (typeof config2[prop] !== 'undefined') {
		      config[prop] = config2[prop];
		    } else if (utils.isObject(config1[prop])) {
		      config[prop] = utils.deepMerge(config1[prop]);
		    } else if (typeof config1[prop] !== 'undefined') {
		      config[prop] = config1[prop];
		    }
		  });
		
		  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
		    if (typeof config2[prop] !== 'undefined') {
		      config[prop] = config2[prop];
		    } else if (typeof config1[prop] !== 'undefined') {
		      config[prop] = config1[prop];
		    }
		  });
		
		  var axiosKeys = valueFromConfig2Keys
		    .concat(mergeDeepPropertiesKeys)
		    .concat(defaultToConfig2Keys);
		
		  var otherKeys = Object
		    .keys(config2)
		    .filter(function filterAxiosKeys(key) {
		      return axiosKeys.indexOf(key) === -1;
		    });
		
		  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
		    if (typeof config2[prop] !== 'undefined') {
		      config[prop] = config2[prop];
		    } else if (typeof config1[prop] !== 'undefined') {
		      config[prop] = config1[prop];
		    }
		  });
		
		  return config;
		};


	/***/ }),
	/* 23 */
	/***/ (function(module, exports) {
		
		/**
		 * A `Cancel` is an object that is thrown when an operation is canceled.
		 *
		 * @class
		 * @param {string=} message The message.
		 */
		function Cancel(message) {
		  this.message = message;
		}
		
		Cancel.prototype.toString = function toString() {
		  return 'Cancel' + (this.message ? ': ' + this.message : '');
		};
		
		Cancel.prototype.__CANCEL__ = true;
		
		module.exports = Cancel;


	/***/ }),
	/* 24 */
	/***/ (function(module, exports, __webpack_require__) {
		
		var Cancel = __webpack_require__(23);
		
		/**
		 * A `CancelToken` is an object that can be used to request cancellation of an operation.
		 *
		 * @class
		 * @param {Function} executor The executor function.
		 */
		function CancelToken(executor) {
		  if (typeof executor !== 'function') {
		    throw new TypeError('executor must be a function.');
		  }
		
		  var resolvePromise;
		  this.promise = new Promise(function promiseExecutor(resolve) {
		    resolvePromise = resolve;
		  });
		
		  var token = this;
		  executor(function cancel(message) {
		    if (token.reason) {
		      // Cancellation has already been requested
		      return;
		    }
		
		    token.reason = new Cancel(message);
		    resolvePromise(token.reason);
		  });
		}
		
		/**
		 * Throws a `Cancel` if cancellation has been requested.
		 */
		CancelToken.prototype.throwIfRequested = function throwIfRequested() {
		  if (this.reason) {
		    throw this.reason;
		  }
		};
		
		/**
		 * Returns an object that contains a new `CancelToken` and a function that, when called,
		 * cancels the `CancelToken`.
		 */
		CancelToken.source = function source() {
		  var cancel;
		  var token = new CancelToken(function executor(c) {
		    cancel = c;
		  });
		  return {
		    token: token,
		    cancel: cancel
		  };
		};
		
		module.exports = CancelToken;


	/***/ }),
	/* 25 */
	/***/ (function(module, exports) {
		
		/**
		 * Syntactic sugar for invoking a function and expanding an array for arguments.
		 *
		 * Common use case would be to use `Function.prototype.apply`.
		 *
		 *  ```js
		 *  function f(x, y, z) {}
		 *  var args = [1, 2, 3];
		 *  f.apply(null, args);
		 *  ```
		 *
		 * With `spread` this example can be re-written.
		 *
		 *  ```js
		 *  spread(function(x, y, z) {})([1, 2, 3]);
		 *  ```
		 *
		 * @param {Function} callback
		 * @returns {Function}
		 */
		module.exports = function spread(callback) {
		  return function wrap(arr) {
		    return callback.apply(null, arr);
		  };
		};


	/***/ })
	/******/ ])
	});

	}(axios$1));

	var axios = axios$1.exports;

	/*!
	  * vue-router v3.3.4
	  * (c) 2020 Evan You
	  * @license MIT
	  */

	/*  */

	function assert (condition, message) {
	  if (!condition) {
	    throw new Error(("[vue-router] " + message))
	  }
	}

	function warn (condition, message) {
	  if (!condition) {
	    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
	  }
	}

	function isError (err) {
	  return Object.prototype.toString.call(err).indexOf('Error') > -1
	}

	function isRouterError (err, errorType) {
	  return isError(err) && err._isRouter && (errorType == null || err.type === errorType)
	}

	function extend (a, b) {
	  for (var key in b) {
	    a[key] = b[key];
	  }
	  return a
	}

	var View = {
	  name: 'RouterView',
	  functional: true,
	  props: {
	    name: {
	      type: String,
	      default: 'default'
	    }
	  },
	  render: function render (_, ref) {
	    var props = ref.props;
	    var children = ref.children;
	    var parent = ref.parent;
	    var data = ref.data;

	    // used by devtools to display a router-view badge
	    data.routerView = true;

	    // directly use parent context's createElement() function
	    // so that components rendered by router-view can resolve named slots
	    var h = parent.$createElement;
	    var name = props.name;
	    var route = parent.$route;
	    var cache = parent._routerViewCache || (parent._routerViewCache = {});

	    // determine current view depth, also check to see if the tree
	    // has been toggled inactive but kept-alive.
	    var depth = 0;
	    var inactive = false;
	    while (parent && parent._routerRoot !== parent) {
	      var vnodeData = parent.$vnode ? parent.$vnode.data : {};
	      if (vnodeData.routerView) {
	        depth++;
	      }
	      if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
	        inactive = true;
	      }
	      parent = parent.$parent;
	    }
	    data.routerViewDepth = depth;

	    // render previous view if the tree is inactive and kept-alive
	    if (inactive) {
	      var cachedData = cache[name];
	      var cachedComponent = cachedData && cachedData.component;
	      if (cachedComponent) {
	        // #2301
	        // pass props
	        if (cachedData.configProps) {
	          fillPropsinData(cachedComponent, data, cachedData.route, cachedData.configProps);
	        }
	        return h(cachedComponent, data, children)
	      } else {
	        // render previous empty view
	        return h()
	      }
	    }

	    var matched = route.matched[depth];
	    var component = matched && matched.components[name];

	    // render empty node if no matched route or no config component
	    if (!matched || !component) {
	      cache[name] = null;
	      return h()
	    }

	    // cache component
	    cache[name] = { component: component };

	    // attach instance registration hook
	    // this will be called in the instance's injected lifecycle hooks
	    data.registerRouteInstance = function (vm, val) {
	      // val could be undefined for unregistration
	      var current = matched.instances[name];
	      if (
	        (val && current !== vm) ||
	        (!val && current === vm)
	      ) {
	        matched.instances[name] = val;
	      }
	    }

	    // also register instance in prepatch hook
	    // in case the same component instance is reused across different routes
	    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
	      matched.instances[name] = vnode.componentInstance;
	    };

	    // register instance in init hook
	    // in case kept-alive component be actived when routes changed
	    data.hook.init = function (vnode) {
	      if (vnode.data.keepAlive &&
	        vnode.componentInstance &&
	        vnode.componentInstance !== matched.instances[name]
	      ) {
	        matched.instances[name] = vnode.componentInstance;
	      }
	    };

	    var configProps = matched.props && matched.props[name];
	    // save route and configProps in cachce
	    if (configProps) {
	      extend(cache[name], {
	        route: route,
	        configProps: configProps
	      });
	      fillPropsinData(component, data, route, configProps);
	    }

	    return h(component, data, children)
	  }
	};

	function fillPropsinData (component, data, route, configProps) {
	  // resolve props
	  var propsToPass = data.props = resolveProps(route, configProps);
	  if (propsToPass) {
	    // clone to prevent mutation
	    propsToPass = data.props = extend({}, propsToPass);
	    // pass non-declared props as attrs
	    var attrs = data.attrs = data.attrs || {};
	    for (var key in propsToPass) {
	      if (!component.props || !(key in component.props)) {
	        attrs[key] = propsToPass[key];
	        delete propsToPass[key];
	      }
	    }
	  }
	}

	function resolveProps (route, config) {
	  switch (typeof config) {
	    case 'undefined':
	      return
	    case 'object':
	      return config
	    case 'function':
	      return config(route)
	    case 'boolean':
	      return config ? route.params : undefined
	    default:
	      {
	        warn(
	          false,
	          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
	          "expecting an object, function or boolean."
	        );
	      }
	  }
	}

	/*  */

	var encodeReserveRE = /[!'()*]/g;
	var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
	var commaRE = /%2C/g;

	// fixed encodeURIComponent which is more conformant to RFC3986:
	// - escapes [!'()*]
	// - preserve commas
	var encode = function (str) { return encodeURIComponent(str)
	  .replace(encodeReserveRE, encodeReserveReplacer)
	  .replace(commaRE, ','); };

	var decode = decodeURIComponent;

	function resolveQuery (
	  query,
	  extraQuery,
	  _parseQuery
	) {
	  if ( extraQuery === void 0 ) extraQuery = {};

	  var parse = _parseQuery || parseQuery;
	  var parsedQuery;
	  try {
	    parsedQuery = parse(query || '');
	  } catch (e) {
	    warn(false, e.message);
	    parsedQuery = {};
	  }
	  for (var key in extraQuery) {
	    parsedQuery[key] = extraQuery[key];
	  }
	  return parsedQuery
	}

	function parseQuery (query) {
	  var res = {};

	  query = query.trim().replace(/^(\?|#|&)/, '');

	  if (!query) {
	    return res
	  }

	  query.split('&').forEach(function (param) {
	    var parts = param.replace(/\+/g, ' ').split('=');
	    var key = decode(parts.shift());
	    var val = parts.length > 0
	      ? decode(parts.join('='))
	      : null;

	    if (res[key] === undefined) {
	      res[key] = val;
	    } else if (Array.isArray(res[key])) {
	      res[key].push(val);
	    } else {
	      res[key] = [res[key], val];
	    }
	  });

	  return res
	}

	function stringifyQuery (obj) {
	  var res = obj ? Object.keys(obj).map(function (key) {
	    var val = obj[key];

	    if (val === undefined) {
	      return ''
	    }

	    if (val === null) {
	      return encode(key)
	    }

	    if (Array.isArray(val)) {
	      var result = [];
	      val.forEach(function (val2) {
	        if (val2 === undefined) {
	          return
	        }
	        if (val2 === null) {
	          result.push(encode(key));
	        } else {
	          result.push(encode(key) + '=' + encode(val2));
	        }
	      });
	      return result.join('&')
	    }

	    return encode(key) + '=' + encode(val)
	  }).filter(function (x) { return x.length > 0; }).join('&') : null;
	  return res ? ("?" + res) : ''
	}

	/*  */

	var trailingSlashRE = /\/?$/;

	function createRoute (
	  record,
	  location,
	  redirectedFrom,
	  router
	) {
	  var stringifyQuery = router && router.options.stringifyQuery;

	  var query = location.query || {};
	  try {
	    query = clone(query);
	  } catch (e) {}

	  var route = {
	    name: location.name || (record && record.name),
	    meta: (record && record.meta) || {},
	    path: location.path || '/',
	    hash: location.hash || '',
	    query: query,
	    params: location.params || {},
	    fullPath: getFullPath(location, stringifyQuery),
	    matched: record ? formatMatch(record) : []
	  };
	  if (redirectedFrom) {
	    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery);
	  }
	  return Object.freeze(route)
	}

	function clone (value) {
	  if (Array.isArray(value)) {
	    return value.map(clone)
	  } else if (value && typeof value === 'object') {
	    var res = {};
	    for (var key in value) {
	      res[key] = clone(value[key]);
	    }
	    return res
	  } else {
	    return value
	  }
	}

	// the starting route that represents the initial state
	var START = createRoute(null, {
	  path: '/'
	});

	function formatMatch (record) {
	  var res = [];
	  while (record) {
	    res.unshift(record);
	    record = record.parent;
	  }
	  return res
	}

	function getFullPath (
	  ref,
	  _stringifyQuery
	) {
	  var path = ref.path;
	  var query = ref.query; if ( query === void 0 ) query = {};
	  var hash = ref.hash; if ( hash === void 0 ) hash = '';

	  var stringify = _stringifyQuery || stringifyQuery;
	  return (path || '/') + stringify(query) + hash
	}

	function isSameRoute (a, b) {
	  if (b === START) {
	    return a === b
	  } else if (!b) {
	    return false
	  } else if (a.path && b.path) {
	    return (
	      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
	      a.hash === b.hash &&
	      isObjectEqual(a.query, b.query)
	    )
	  } else if (a.name && b.name) {
	    return (
	      a.name === b.name &&
	      a.hash === b.hash &&
	      isObjectEqual(a.query, b.query) &&
	      isObjectEqual(a.params, b.params)
	    )
	  } else {
	    return false
	  }
	}

	function isObjectEqual (a, b) {
	  if ( a === void 0 ) a = {};
	  if ( b === void 0 ) b = {};

	  // handle null value #1566
	  if (!a || !b) { return a === b }
	  var aKeys = Object.keys(a);
	  var bKeys = Object.keys(b);
	  if (aKeys.length !== bKeys.length) {
	    return false
	  }
	  return aKeys.every(function (key) {
	    var aVal = a[key];
	    var bVal = b[key];
	    // check nested equality
	    if (typeof aVal === 'object' && typeof bVal === 'object') {
	      return isObjectEqual(aVal, bVal)
	    }
	    return String(aVal) === String(bVal)
	  })
	}

	function isIncludedRoute (current, target) {
	  return (
	    current.path.replace(trailingSlashRE, '/').indexOf(
	      target.path.replace(trailingSlashRE, '/')
	    ) === 0 &&
	    (!target.hash || current.hash === target.hash) &&
	    queryIncludes(current.query, target.query)
	  )
	}

	function queryIncludes (current, target) {
	  for (var key in target) {
	    if (!(key in current)) {
	      return false
	    }
	  }
	  return true
	}

	/*  */

	function resolvePath (
	  relative,
	  base,
	  append
	) {
	  var firstChar = relative.charAt(0);
	  if (firstChar === '/') {
	    return relative
	  }

	  if (firstChar === '?' || firstChar === '#') {
	    return base + relative
	  }

	  var stack = base.split('/');

	  // remove trailing segment if:
	  // - not appending
	  // - appending to trailing slash (last segment is empty)
	  if (!append || !stack[stack.length - 1]) {
	    stack.pop();
	  }

	  // resolve relative path
	  var segments = relative.replace(/^\//, '').split('/');
	  for (var i = 0; i < segments.length; i++) {
	    var segment = segments[i];
	    if (segment === '..') {
	      stack.pop();
	    } else if (segment !== '.') {
	      stack.push(segment);
	    }
	  }

	  // ensure leading slash
	  if (stack[0] !== '') {
	    stack.unshift('');
	  }

	  return stack.join('/')
	}

	function parsePath (path) {
	  var hash = '';
	  var query = '';

	  var hashIndex = path.indexOf('#');
	  if (hashIndex >= 0) {
	    hash = path.slice(hashIndex);
	    path = path.slice(0, hashIndex);
	  }

	  var queryIndex = path.indexOf('?');
	  if (queryIndex >= 0) {
	    query = path.slice(queryIndex + 1);
	    path = path.slice(0, queryIndex);
	  }

	  return {
	    path: path,
	    query: query,
	    hash: hash
	  }
	}

	function cleanPath (path) {
	  return path.replace(/\/\//g, '/')
	}

	var isarray = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

	/**
	 * Expose `pathToRegexp`.
	 */
	var pathToRegexp_1 = pathToRegexp;
	var parse_1 = parse;
	var compile_1 = compile;
	var tokensToFunction_1 = tokensToFunction;
	var tokensToRegExp_1 = tokensToRegExp;

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g');

	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {string}  str
	 * @param  {Object=} options
	 * @return {!Array}
	 */
	function parse (str, options) {
	  var tokens = [];
	  var key = 0;
	  var index = 0;
	  var path = '';
	  var defaultDelimiter = options && options.delimiter || '/';
	  var res;

	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0];
	    var escaped = res[1];
	    var offset = res.index;
	    path += str.slice(index, offset);
	    index = offset + m.length;

	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1];
	      continue
	    }

	    var next = str[index];
	    var prefix = res[2];
	    var name = res[3];
	    var capture = res[4];
	    var group = res[5];
	    var modifier = res[6];
	    var asterisk = res[7];

	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path);
	      path = '';
	    }

	    var partial = prefix != null && next != null && next !== prefix;
	    var repeat = modifier === '+' || modifier === '*';
	    var optional = modifier === '?' || modifier === '*';
	    var delimiter = res[2] || defaultDelimiter;
	    var pattern = capture || group;

	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      partial: partial,
	      asterisk: !!asterisk,
	      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
	    });
	  }

	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index);
	  }

	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path);
	  }

	  return tokens
	}

	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {string}             str
	 * @param  {Object=}            options
	 * @return {!function(Object=, Object=)}
	 */
	function compile (str, options) {
	  return tokensToFunction(parse(str, options), options)
	}

	/**
	 * Prettier encoding of URI path segments.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeURIComponentPretty (str) {
	  return encodeURI(str).replace(/[\/?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeAsterisk (str) {
	  return encodeURI(str).replace(/[?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}

	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens, options) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length);

	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$', flags(options));
	    }
	  }

	  return function (obj, opts) {
	    var path = '';
	    var data = obj || {};
	    var options = opts || {};
	    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i];

	      if (typeof token === 'string') {
	        path += token;

	        continue
	      }

	      var value = data[token.name];
	      var segment;

	      if (value == null) {
	        if (token.optional) {
	          // Prepend partial segment prefixes.
	          if (token.partial) {
	            path += token.prefix;
	          }

	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }

	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
	        }

	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }

	        for (var j = 0; j < value.length; j++) {
	          segment = encode(value[j]);

	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
	          }

	          path += (j === 0 ? token.prefix : token.delimiter) + segment;
	        }

	        continue
	      }

	      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }

	      path += token.prefix + segment;
	    }

	    return path
	  }
	}

	/**
	 * Escape a regular expression string.
	 *
	 * @param  {string} str
	 * @return {string}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
	}

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {string} group
	 * @return {string}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {!RegExp} re
	 * @param  {Array}   keys
	 * @return {!RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys;
	  return re
	}

	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {string}
	 */
	function flags (options) {
	  return options && options.sensitive ? '' : 'i'
	}

	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {!RegExp} path
	 * @param  {!Array}  keys
	 * @return {!RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g);

	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        partial: false,
	        asterisk: false,
	        pattern: null
	      });
	    }
	  }

	  return attachKeys(path, keys)
	}

	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {!Array}  path
	 * @param  {Array}   keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = [];

	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source);
	  }

	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

	  return attachKeys(regexp, keys)
	}

	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {string}  path
	 * @param  {!Array}  keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  return tokensToRegExp(parse(path, options), keys, options)
	}

	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {!Array}          tokens
	 * @param  {(Array|Object)=} keys
	 * @param  {Object=}         options
	 * @return {!RegExp}
	 */
	function tokensToRegExp (tokens, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys || options);
	    keys = [];
	  }

	  options = options || {};

	  var strict = options.strict;
	  var end = options.end !== false;
	  var route = '';

	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i];

	    if (typeof token === 'string') {
	      route += escapeString(token);
	    } else {
	      var prefix = escapeString(token.prefix);
	      var capture = '(?:' + token.pattern + ')';

	      keys.push(token);

	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*';
	      }

	      if (token.optional) {
	        if (!token.partial) {
	          capture = '(?:' + prefix + '(' + capture + '))?';
	        } else {
	          capture = prefix + '(' + capture + ')?';
	        }
	      } else {
	        capture = prefix + '(' + capture + ')';
	      }

	      route += capture;
	    }
	  }

	  var delimiter = escapeString(options.delimiter || '/');
	  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
	  }

	  if (end) {
	    route += '$';
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
	  }

	  return attachKeys(new RegExp('^' + route, flags(options)), keys)
	}

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(string|RegExp|Array)} path
	 * @param  {(Array|Object)=}       keys
	 * @param  {Object=}               options
	 * @return {!RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys || options);
	    keys = [];
	  }

	  options = options || {};

	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, /** @type {!Array} */ (keys))
	  }

	  if (isarray(path)) {
	    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
	  }

	  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
	}
	pathToRegexp_1.parse = parse_1;
	pathToRegexp_1.compile = compile_1;
	pathToRegexp_1.tokensToFunction = tokensToFunction_1;
	pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

	/*  */

	// $flow-disable-line
	var regexpCompileCache = Object.create(null);

	function fillParams (
	  path,
	  params,
	  routeMsg
	) {
	  params = params || {};
	  try {
	    var filler =
	      regexpCompileCache[path] ||
	      (regexpCompileCache[path] = pathToRegexp_1.compile(path));

	    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
	    // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
	    if (typeof params.pathMatch === 'string') { params[0] = params.pathMatch; }

	    return filler(params, { pretty: true })
	  } catch (e) {
	    {
	      // Fix #3072 no warn if `pathMatch` is string
	      warn(typeof params.pathMatch === 'string', ("missing param for " + routeMsg + ": " + (e.message)));
	    }
	    return ''
	  } finally {
	    // delete the 0 if it was added
	    delete params[0];
	  }
	}

	/*  */

	function normalizeLocation (
	  raw,
	  current,
	  append,
	  router
	) {
	  var next = typeof raw === 'string' ? { path: raw } : raw;
	  // named target
	  if (next._normalized) {
	    return next
	  } else if (next.name) {
	    next = extend({}, raw);
	    var params = next.params;
	    if (params && typeof params === 'object') {
	      next.params = extend({}, params);
	    }
	    return next
	  }

	  // relative params
	  if (!next.path && next.params && current) {
	    next = extend({}, next);
	    next._normalized = true;
	    var params$1 = extend(extend({}, current.params), next.params);
	    if (current.name) {
	      next.name = current.name;
	      next.params = params$1;
	    } else if (current.matched.length) {
	      var rawPath = current.matched[current.matched.length - 1].path;
	      next.path = fillParams(rawPath, params$1, ("path " + (current.path)));
	    } else {
	      warn(false, "relative params navigation requires a current route.");
	    }
	    return next
	  }

	  var parsedPath = parsePath(next.path || '');
	  var basePath = (current && current.path) || '/';
	  var path = parsedPath.path
	    ? resolvePath(parsedPath.path, basePath, append || next.append)
	    : basePath;

	  var query = resolveQuery(
	    parsedPath.query,
	    next.query,
	    router && router.options.parseQuery
	  );

	  var hash = next.hash || parsedPath.hash;
	  if (hash && hash.charAt(0) !== '#') {
	    hash = "#" + hash;
	  }

	  return {
	    _normalized: true,
	    path: path,
	    query: query,
	    hash: hash
	  }
	}

	/*  */

	// work around weird flow bug
	var toTypes = [String, Object];
	var eventTypes = [String, Array];

	var noop = function () {};

	var Link = {
	  name: 'RouterLink',
	  props: {
	    to: {
	      type: toTypes,
	      required: true
	    },
	    tag: {
	      type: String,
	      default: 'a'
	    },
	    exact: Boolean,
	    append: Boolean,
	    replace: Boolean,
	    activeClass: String,
	    exactActiveClass: String,
	    ariaCurrentValue: {
	      type: String,
	      default: 'page'
	    },
	    event: {
	      type: eventTypes,
	      default: 'click'
	    }
	  },
	  render: function render (h) {
	    var this$1$1 = this;

	    var router = this.$router;
	    var current = this.$route;
	    var ref = router.resolve(
	      this.to,
	      current,
	      this.append
	    );
	    var location = ref.location;
	    var route = ref.route;
	    var href = ref.href;

	    var classes = {};
	    var globalActiveClass = router.options.linkActiveClass;
	    var globalExactActiveClass = router.options.linkExactActiveClass;
	    // Support global empty active class
	    var activeClassFallback =
	      globalActiveClass == null ? 'router-link-active' : globalActiveClass;
	    var exactActiveClassFallback =
	      globalExactActiveClass == null
	        ? 'router-link-exact-active'
	        : globalExactActiveClass;
	    var activeClass =
	      this.activeClass == null ? activeClassFallback : this.activeClass;
	    var exactActiveClass =
	      this.exactActiveClass == null
	        ? exactActiveClassFallback
	        : this.exactActiveClass;

	    var compareTarget = route.redirectedFrom
	      ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
	      : route;

	    classes[exactActiveClass] = isSameRoute(current, compareTarget);
	    classes[activeClass] = this.exact
	      ? classes[exactActiveClass]
	      : isIncludedRoute(current, compareTarget);

	    var ariaCurrentValue = classes[exactActiveClass] ? this.ariaCurrentValue : null;

	    var handler = function (e) {
	      if (guardEvent(e)) {
	        if (this$1$1.replace) {
	          router.replace(location, noop);
	        } else {
	          router.push(location, noop);
	        }
	      }
	    };

	    var on = { click: guardEvent };
	    if (Array.isArray(this.event)) {
	      this.event.forEach(function (e) {
	        on[e] = handler;
	      });
	    } else {
	      on[this.event] = handler;
	    }

	    var data = { class: classes };

	    var scopedSlot =
	      !this.$scopedSlots.$hasNormal &&
	      this.$scopedSlots.default &&
	      this.$scopedSlots.default({
	        href: href,
	        route: route,
	        navigate: handler,
	        isActive: classes[activeClass],
	        isExactActive: classes[exactActiveClass]
	      });

	    if (scopedSlot) {
	      if (scopedSlot.length === 1) {
	        return scopedSlot[0]
	      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
	        {
	          warn(
	            false,
	            ("RouterLink with to=\"" + (this.to) + "\" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.")
	          );
	        }
	        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
	      }
	    }

	    if (this.tag === 'a') {
	      data.on = on;
	      data.attrs = { href: href, 'aria-current': ariaCurrentValue };
	    } else {
	      // find the first <a> child and apply listener and href
	      var a = findAnchor(this.$slots.default);
	      if (a) {
	        // in case the <a> is a static node
	        a.isStatic = false;
	        var aData = (a.data = extend({}, a.data));
	        aData.on = aData.on || {};
	        // transform existing events in both objects into arrays so we can push later
	        for (var event in aData.on) {
	          var handler$1 = aData.on[event];
	          if (event in on) {
	            aData.on[event] = Array.isArray(handler$1) ? handler$1 : [handler$1];
	          }
	        }
	        // append new listeners for router-link
	        for (var event$1 in on) {
	          if (event$1 in aData.on) {
	            // on[event] is always a function
	            aData.on[event$1].push(on[event$1]);
	          } else {
	            aData.on[event$1] = handler;
	          }
	        }

	        var aAttrs = (a.data.attrs = extend({}, a.data.attrs));
	        aAttrs.href = href;
	        aAttrs['aria-current'] = ariaCurrentValue;
	      } else {
	        // doesn't have <a> child, apply listener to self
	        data.on = on;
	      }
	    }

	    return h(this.tag, data, this.$slots.default)
	  }
	};

	function guardEvent (e) {
	  // don't redirect with control keys
	  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
	  // don't redirect when preventDefault called
	  if (e.defaultPrevented) { return }
	  // don't redirect on right click
	  if (e.button !== undefined && e.button !== 0) { return }
	  // don't redirect if `target="_blank"`
	  if (e.currentTarget && e.currentTarget.getAttribute) {
	    var target = e.currentTarget.getAttribute('target');
	    if (/\b_blank\b/i.test(target)) { return }
	  }
	  // this may be a Weex event which doesn't have this method
	  if (e.preventDefault) {
	    e.preventDefault();
	  }
	  return true
	}

	function findAnchor (children) {
	  if (children) {
	    var child;
	    for (var i = 0; i < children.length; i++) {
	      child = children[i];
	      if (child.tag === 'a') {
	        return child
	      }
	      if (child.children && (child = findAnchor(child.children))) {
	        return child
	      }
	    }
	  }
	}

	var _Vue;

	function install (Vue) {
	  if (install.installed && _Vue === Vue) { return }
	  install.installed = true;

	  _Vue = Vue;

	  var isDef = function (v) { return v !== undefined; };

	  var registerInstance = function (vm, callVal) {
	    var i = vm.$options._parentVnode;
	    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
	      i(vm, callVal);
	    }
	  };

	  Vue.mixin({
	    beforeCreate: function beforeCreate () {
	      if (isDef(this.$options.router)) {
	        this._routerRoot = this;
	        this._router = this.$options.router;
	        this._router.init(this);
	        Vue.util.defineReactive(this, '_route', this._router.history.current);
	      } else {
	        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
	      }
	      registerInstance(this, this);
	    },
	    destroyed: function destroyed () {
	      registerInstance(this);
	    }
	  });

	  Object.defineProperty(Vue.prototype, '$router', {
	    get: function get () { return this._routerRoot._router }
	  });

	  Object.defineProperty(Vue.prototype, '$route', {
	    get: function get () { return this._routerRoot._route }
	  });

	  Vue.component('RouterView', View);
	  Vue.component('RouterLink', Link);

	  var strats = Vue.config.optionMergeStrategies;
	  // use the same hook merging strategy for route hooks
	  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
	}

	/*  */

	var inBrowser = typeof window !== 'undefined';

	/*  */

	function createRouteMap (
	  routes,
	  oldPathList,
	  oldPathMap,
	  oldNameMap
	) {
	  // the path list is used to control path matching priority
	  var pathList = oldPathList || [];
	  // $flow-disable-line
	  var pathMap = oldPathMap || Object.create(null);
	  // $flow-disable-line
	  var nameMap = oldNameMap || Object.create(null);

	  routes.forEach(function (route) {
	    addRouteRecord(pathList, pathMap, nameMap, route);
	  });

	  // ensure wildcard routes are always at the end
	  for (var i = 0, l = pathList.length; i < l; i++) {
	    if (pathList[i] === '*') {
	      pathList.push(pathList.splice(i, 1)[0]);
	      l--;
	      i--;
	    }
	  }

	  {
	    // warn if routes do not include leading slashes
	    var found = pathList
	    // check for missing leading slash
	      .filter(function (path) { return path && path.charAt(0) !== '*' && path.charAt(0) !== '/'; });

	    if (found.length > 0) {
	      var pathNames = found.map(function (path) { return ("- " + path); }).join('\n');
	      warn(false, ("Non-nested routes must include a leading slash character. Fix the following routes: \n" + pathNames));
	    }
	  }

	  return {
	    pathList: pathList,
	    pathMap: pathMap,
	    nameMap: nameMap
	  }
	}

	function addRouteRecord (
	  pathList,
	  pathMap,
	  nameMap,
	  route,
	  parent,
	  matchAs
	) {
	  var path = route.path;
	  var name = route.name;
	  {
	    assert(path != null, "\"path\" is required in a route configuration.");
	    assert(
	      typeof route.component !== 'string',
	      "route config \"component\" for path: " + (String(
	        path || name
	      )) + " cannot be a " + "string id. Use an actual component instead."
	    );
	  }

	  var pathToRegexpOptions =
	    route.pathToRegexpOptions || {};
	  var normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict);

	  if (typeof route.caseSensitive === 'boolean') {
	    pathToRegexpOptions.sensitive = route.caseSensitive;
	  }

	  var record = {
	    path: normalizedPath,
	    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
	    components: route.components || { default: route.component },
	    instances: {},
	    name: name,
	    parent: parent,
	    matchAs: matchAs,
	    redirect: route.redirect,
	    beforeEnter: route.beforeEnter,
	    meta: route.meta || {},
	    props:
	      route.props == null
	        ? {}
	        : route.components
	          ? route.props
	          : { default: route.props }
	  };

	  if (route.children) {
	    // Warn if route is named, does not redirect and has a default child route.
	    // If users navigate to this route by name, the default child will
	    // not be rendered (GH Issue #629)
	    {
	      if (
	        route.name &&
	        !route.redirect &&
	        route.children.some(function (child) { return /^\/?$/.test(child.path); })
	      ) {
	        warn(
	          false,
	          "Named Route '" + (route.name) + "' has a default child route. " +
	            "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
	            "the default child route will not be rendered. Remove the name from " +
	            "this route and use the name of the default child route for named " +
	            "links instead."
	        );
	      }
	    }
	    route.children.forEach(function (child) {
	      var childMatchAs = matchAs
	        ? cleanPath((matchAs + "/" + (child.path)))
	        : undefined;
	      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
	    });
	  }

	  if (!pathMap[record.path]) {
	    pathList.push(record.path);
	    pathMap[record.path] = record;
	  }

	  if (route.alias !== undefined) {
	    var aliases = Array.isArray(route.alias) ? route.alias : [route.alias];
	    for (var i = 0; i < aliases.length; ++i) {
	      var alias = aliases[i];
	      if (alias === path) {
	        warn(
	          false,
	          ("Found an alias with the same value as the path: \"" + path + "\". You have to remove that alias. It will be ignored in development.")
	        );
	        // skip in dev to make it work
	        continue
	      }

	      var aliasRoute = {
	        path: alias,
	        children: route.children
	      };
	      addRouteRecord(
	        pathList,
	        pathMap,
	        nameMap,
	        aliasRoute,
	        parent,
	        record.path || '/' // matchAs
	      );
	    }
	  }

	  if (name) {
	    if (!nameMap[name]) {
	      nameMap[name] = record;
	    } else if (!matchAs) {
	      warn(
	        false,
	        "Duplicate named routes definition: " +
	          "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
	      );
	    }
	  }
	}

	function compileRouteRegex (
	  path,
	  pathToRegexpOptions
	) {
	  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
	  {
	    var keys = Object.create(null);
	    regex.keys.forEach(function (key) {
	      warn(
	        !keys[key.name],
	        ("Duplicate param keys in route with path: \"" + path + "\"")
	      );
	      keys[key.name] = true;
	    });
	  }
	  return regex
	}

	function normalizePath (
	  path,
	  parent,
	  strict
	) {
	  if (!strict) { path = path.replace(/\/$/, ''); }
	  if (path[0] === '/') { return path }
	  if (parent == null) { return path }
	  return cleanPath(((parent.path) + "/" + path))
	}

	/*  */



	function createMatcher (
	  routes,
	  router
	) {
	  var ref = createRouteMap(routes);
	  var pathList = ref.pathList;
	  var pathMap = ref.pathMap;
	  var nameMap = ref.nameMap;

	  function addRoutes (routes) {
	    createRouteMap(routes, pathList, pathMap, nameMap);
	  }

	  function match (
	    raw,
	    currentRoute,
	    redirectedFrom
	  ) {
	    var location = normalizeLocation(raw, currentRoute, false, router);
	    var name = location.name;

	    if (name) {
	      var record = nameMap[name];
	      {
	        warn(record, ("Route with name '" + name + "' does not exist"));
	      }
	      if (!record) { return _createRoute(null, location) }
	      var paramNames = record.regex.keys
	        .filter(function (key) { return !key.optional; })
	        .map(function (key) { return key.name; });

	      if (typeof location.params !== 'object') {
	        location.params = {};
	      }

	      if (currentRoute && typeof currentRoute.params === 'object') {
	        for (var key in currentRoute.params) {
	          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
	            location.params[key] = currentRoute.params[key];
	          }
	        }
	      }

	      location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
	      return _createRoute(record, location, redirectedFrom)
	    } else if (location.path) {
	      location.params = {};
	      for (var i = 0; i < pathList.length; i++) {
	        var path = pathList[i];
	        var record$1 = pathMap[path];
	        if (matchRoute(record$1.regex, location.path, location.params)) {
	          return _createRoute(record$1, location, redirectedFrom)
	        }
	      }
	    }
	    // no match
	    return _createRoute(null, location)
	  }

	  function redirect (
	    record,
	    location
	  ) {
	    var originalRedirect = record.redirect;
	    var redirect = typeof originalRedirect === 'function'
	      ? originalRedirect(createRoute(record, location, null, router))
	      : originalRedirect;

	    if (typeof redirect === 'string') {
	      redirect = { path: redirect };
	    }

	    if (!redirect || typeof redirect !== 'object') {
	      {
	        warn(
	          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
	        );
	      }
	      return _createRoute(null, location)
	    }

	    var re = redirect;
	    var name = re.name;
	    var path = re.path;
	    var query = location.query;
	    var hash = location.hash;
	    var params = location.params;
	    query = re.hasOwnProperty('query') ? re.query : query;
	    hash = re.hasOwnProperty('hash') ? re.hash : hash;
	    params = re.hasOwnProperty('params') ? re.params : params;

	    if (name) {
	      // resolved named direct
	      var targetRecord = nameMap[name];
	      {
	        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
	      }
	      return match({
	        _normalized: true,
	        name: name,
	        query: query,
	        hash: hash,
	        params: params
	      }, undefined, location)
	    } else if (path) {
	      // 1. resolve relative redirect
	      var rawPath = resolveRecordPath(path, record);
	      // 2. resolve params
	      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
	      // 3. rematch with existing query and hash
	      return match({
	        _normalized: true,
	        path: resolvedPath,
	        query: query,
	        hash: hash
	      }, undefined, location)
	    } else {
	      {
	        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
	      }
	      return _createRoute(null, location)
	    }
	  }

	  function alias (
	    record,
	    location,
	    matchAs
	  ) {
	    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
	    var aliasedMatch = match({
	      _normalized: true,
	      path: aliasedPath
	    });
	    if (aliasedMatch) {
	      var matched = aliasedMatch.matched;
	      var aliasedRecord = matched[matched.length - 1];
	      location.params = aliasedMatch.params;
	      return _createRoute(aliasedRecord, location)
	    }
	    return _createRoute(null, location)
	  }

	  function _createRoute (
	    record,
	    location,
	    redirectedFrom
	  ) {
	    if (record && record.redirect) {
	      return redirect(record, redirectedFrom || location)
	    }
	    if (record && record.matchAs) {
	      return alias(record, location, record.matchAs)
	    }
	    return createRoute(record, location, redirectedFrom, router)
	  }

	  return {
	    match: match,
	    addRoutes: addRoutes
	  }
	}

	function matchRoute (
	  regex,
	  path,
	  params
	) {
	  var m = path.match(regex);

	  if (!m) {
	    return false
	  } else if (!params) {
	    return true
	  }

	  for (var i = 1, len = m.length; i < len; ++i) {
	    var key = regex.keys[i - 1];
	    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
	    if (key) {
	      // Fix #1994: using * with props: true generates a param named 0
	      params[key.name || 'pathMatch'] = val;
	    }
	  }

	  return true
	}

	function resolveRecordPath (path, record) {
	  return resolvePath(path, record.parent ? record.parent.path : '/', true)
	}

	/*  */

	// use User Timing api (if present) for more accurate key precision
	var Time =
	  inBrowser && window.performance && window.performance.now
	    ? window.performance
	    : Date;

	function genStateKey () {
	  return Time.now().toFixed(3)
	}

	var _key = genStateKey();

	function getStateKey () {
	  return _key
	}

	function setStateKey (key) {
	  return (_key = key)
	}

	/*  */

	var positionStore = Object.create(null);

	function setupScroll () {
	  // Prevent browser scroll behavior on History popstate
	  if ('scrollRestoration' in window.history) {
	    window.history.scrollRestoration = 'manual';
	  }
	  // Fix for #1585 for Firefox
	  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
	  // Fix for #2774 Support for apps loaded from Windows file shares not mapped to network drives: replaced location.origin with
	  // window.location.protocol + '//' + window.location.host
	  // location.host contains the port and location.hostname doesn't
	  var protocolAndPath = window.location.protocol + '//' + window.location.host;
	  var absolutePath = window.location.href.replace(protocolAndPath, '');
	  // preserve existing history state as it could be overriden by the user
	  var stateCopy = extend({}, window.history.state);
	  stateCopy.key = getStateKey();
	  window.history.replaceState(stateCopy, '', absolutePath);
	  window.addEventListener('popstate', handlePopState);
	  return function () {
	    window.removeEventListener('popstate', handlePopState);
	  }
	}

	function handleScroll (
	  router,
	  to,
	  from,
	  isPop
	) {
	  if (!router.app) {
	    return
	  }

	  var behavior = router.options.scrollBehavior;
	  if (!behavior) {
	    return
	  }

	  {
	    assert(typeof behavior === 'function', "scrollBehavior must be a function");
	  }

	  // wait until re-render finishes before scrolling
	  router.app.$nextTick(function () {
	    var position = getScrollPosition();
	    var shouldScroll = behavior.call(
	      router,
	      to,
	      from,
	      isPop ? position : null
	    );

	    if (!shouldScroll) {
	      return
	    }

	    if (typeof shouldScroll.then === 'function') {
	      shouldScroll
	        .then(function (shouldScroll) {
	          scrollToPosition((shouldScroll), position);
	        })
	        .catch(function (err) {
	          {
	            assert(false, err.toString());
	          }
	        });
	    } else {
	      scrollToPosition(shouldScroll, position);
	    }
	  });
	}

	function saveScrollPosition () {
	  var key = getStateKey();
	  if (key) {
	    positionStore[key] = {
	      x: window.pageXOffset,
	      y: window.pageYOffset
	    };
	  }
	}

	function handlePopState (e) {
	  saveScrollPosition();
	  if (e.state && e.state.key) {
	    setStateKey(e.state.key);
	  }
	}

	function getScrollPosition () {
	  var key = getStateKey();
	  if (key) {
	    return positionStore[key]
	  }
	}

	function getElementPosition (el, offset) {
	  var docEl = document.documentElement;
	  var docRect = docEl.getBoundingClientRect();
	  var elRect = el.getBoundingClientRect();
	  return {
	    x: elRect.left - docRect.left - offset.x,
	    y: elRect.top - docRect.top - offset.y
	  }
	}

	function isValidPosition (obj) {
	  return isNumber(obj.x) || isNumber(obj.y)
	}

	function normalizePosition (obj) {
	  return {
	    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
	    y: isNumber(obj.y) ? obj.y : window.pageYOffset
	  }
	}

	function normalizeOffset (obj) {
	  return {
	    x: isNumber(obj.x) ? obj.x : 0,
	    y: isNumber(obj.y) ? obj.y : 0
	  }
	}

	function isNumber (v) {
	  return typeof v === 'number'
	}

	var hashStartsWithNumberRE = /^#\d/;

	function scrollToPosition (shouldScroll, position) {
	  var isObject = typeof shouldScroll === 'object';
	  if (isObject && typeof shouldScroll.selector === 'string') {
	    // getElementById would still fail if the selector contains a more complicated query like #main[data-attr]
	    // but at the same time, it doesn't make much sense to select an element with an id and an extra selector
	    var el = hashStartsWithNumberRE.test(shouldScroll.selector) // $flow-disable-line
	      ? document.getElementById(shouldScroll.selector.slice(1)) // $flow-disable-line
	      : document.querySelector(shouldScroll.selector);

	    if (el) {
	      var offset =
	        shouldScroll.offset && typeof shouldScroll.offset === 'object'
	          ? shouldScroll.offset
	          : {};
	      offset = normalizeOffset(offset);
	      position = getElementPosition(el, offset);
	    } else if (isValidPosition(shouldScroll)) {
	      position = normalizePosition(shouldScroll);
	    }
	  } else if (isObject && isValidPosition(shouldScroll)) {
	    position = normalizePosition(shouldScroll);
	  }

	  if (position) {
	    window.scrollTo(position.x, position.y);
	  }
	}

	/*  */

	var supportsPushState =
	  inBrowser &&
	  (function () {
	    var ua = window.navigator.userAgent;

	    if (
	      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
	      ua.indexOf('Mobile Safari') !== -1 &&
	      ua.indexOf('Chrome') === -1 &&
	      ua.indexOf('Windows Phone') === -1
	    ) {
	      return false
	    }

	    return window.history && typeof window.history.pushState === 'function'
	  })();

	function pushState (url, replace) {
	  saveScrollPosition();
	  // try...catch the pushState call to get around Safari
	  // DOM Exception 18 where it limits to 100 pushState calls
	  var history = window.history;
	  try {
	    if (replace) {
	      // preserve existing history state as it could be overriden by the user
	      var stateCopy = extend({}, history.state);
	      stateCopy.key = getStateKey();
	      history.replaceState(stateCopy, '', url);
	    } else {
	      history.pushState({ key: setStateKey(genStateKey()) }, '', url);
	    }
	  } catch (e) {
	    window.location[replace ? 'replace' : 'assign'](url);
	  }
	}

	function replaceState (url) {
	  pushState(url, true);
	}

	/*  */

	function runQueue (queue, fn, cb) {
	  var step = function (index) {
	    if (index >= queue.length) {
	      cb();
	    } else {
	      if (queue[index]) {
	        fn(queue[index], function () {
	          step(index + 1);
	        });
	      } else {
	        step(index + 1);
	      }
	    }
	  };
	  step(0);
	}

	/*  */

	function resolveAsyncComponents (matched) {
	  return function (to, from, next) {
	    var hasAsync = false;
	    var pending = 0;
	    var error = null;

	    flatMapComponents(matched, function (def, _, match, key) {
	      // if it's a function and doesn't have cid attached,
	      // assume it's an async component resolve function.
	      // we are not using Vue's default async resolving mechanism because
	      // we want to halt the navigation until the incoming component has been
	      // resolved.
	      if (typeof def === 'function' && def.cid === undefined) {
	        hasAsync = true;
	        pending++;

	        var resolve = once(function (resolvedDef) {
	          if (isESModule(resolvedDef)) {
	            resolvedDef = resolvedDef.default;
	          }
	          // save resolved on async factory in case it's used elsewhere
	          def.resolved = typeof resolvedDef === 'function'
	            ? resolvedDef
	            : _Vue.extend(resolvedDef);
	          match.components[key] = resolvedDef;
	          pending--;
	          if (pending <= 0) {
	            next();
	          }
	        });

	        var reject = once(function (reason) {
	          var msg = "Failed to resolve async component " + key + ": " + reason;
	          warn(false, msg);
	          if (!error) {
	            error = isError(reason)
	              ? reason
	              : new Error(msg);
	            next(error);
	          }
	        });

	        var res;
	        try {
	          res = def(resolve, reject);
	        } catch (e) {
	          reject(e);
	        }
	        if (res) {
	          if (typeof res.then === 'function') {
	            res.then(resolve, reject);
	          } else {
	            // new syntax in Vue 2.3
	            var comp = res.component;
	            if (comp && typeof comp.then === 'function') {
	              comp.then(resolve, reject);
	            }
	          }
	        }
	      }
	    });

	    if (!hasAsync) { next(); }
	  }
	}

	function flatMapComponents (
	  matched,
	  fn
	) {
	  return flatten(matched.map(function (m) {
	    return Object.keys(m.components).map(function (key) { return fn(
	      m.components[key],
	      m.instances[key],
	      m, key
	    ); })
	  }))
	}

	function flatten (arr) {
	  return Array.prototype.concat.apply([], arr)
	}

	var hasSymbol =
	  typeof Symbol === 'function' &&
	  typeof Symbol.toStringTag === 'symbol';

	function isESModule (obj) {
	  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
	}

	// in Webpack 2, require.ensure now also returns a Promise
	// so the resolve/reject functions may get called an extra time
	// if the user uses an arrow function shorthand that happens to
	// return that Promise.
	function once (fn) {
	  var called = false;
	  return function () {
	    var args = [], len = arguments.length;
	    while ( len-- ) args[ len ] = arguments[ len ];

	    if (called) { return }
	    called = true;
	    return fn.apply(this, args)
	  }
	}

	var NavigationFailureType = {
	  redirected: 1,
	  aborted: 2,
	  cancelled: 3,
	  duplicated: 4
	};

	function createNavigationRedirectedError (from, to) {
	  return createRouterError(
	    from,
	    to,
	    NavigationFailureType.redirected,
	    ("Redirected when going from \"" + (from.fullPath) + "\" to \"" + (stringifyRoute(
	      to
	    )) + "\" via a navigation guard.")
	  )
	}

	function createNavigationDuplicatedError (from, to) {
	  return createRouterError(
	    from,
	    to,
	    NavigationFailureType.duplicated,
	    ("Avoided redundant navigation to current location: \"" + (from.fullPath) + "\".")
	  )
	}

	function createNavigationCancelledError (from, to) {
	  return createRouterError(
	    from,
	    to,
	    NavigationFailureType.cancelled,
	    ("Navigation cancelled from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" with a new navigation.")
	  )
	}

	function createNavigationAbortedError (from, to) {
	  return createRouterError(
	    from,
	    to,
	    NavigationFailureType.aborted,
	    ("Navigation aborted from \"" + (from.fullPath) + "\" to \"" + (to.fullPath) + "\" via a navigation guard.")
	  )
	}

	function createRouterError (from, to, type, message) {
	  var error = new Error(message);
	  error._isRouter = true;
	  error.from = from;
	  error.to = to;
	  error.type = type;

	  return error
	}

	var propertiesToLog = ['params', 'query', 'hash'];

	function stringifyRoute (to) {
	  if (typeof to === 'string') { return to }
	  if ('path' in to) { return to.path }
	  var location = {};
	  propertiesToLog.forEach(function (key) {
	    if (key in to) { location[key] = to[key]; }
	  });
	  return JSON.stringify(location, null, 2)
	}

	/*  */

	var History = function History (router, base) {
	  this.router = router;
	  this.base = normalizeBase(base);
	  // start with a route object that stands for "nowhere"
	  this.current = START;
	  this.pending = null;
	  this.ready = false;
	  this.readyCbs = [];
	  this.readyErrorCbs = [];
	  this.errorCbs = [];
	  this.listeners = [];
	};

	History.prototype.listen = function listen (cb) {
	  this.cb = cb;
	};

	History.prototype.onReady = function onReady (cb, errorCb) {
	  if (this.ready) {
	    cb();
	  } else {
	    this.readyCbs.push(cb);
	    if (errorCb) {
	      this.readyErrorCbs.push(errorCb);
	    }
	  }
	};

	History.prototype.onError = function onError (errorCb) {
	  this.errorCbs.push(errorCb);
	};

	History.prototype.transitionTo = function transitionTo (
	  location,
	  onComplete,
	  onAbort
	) {
	    var this$1$1 = this;

	  var route = this.router.match(location, this.current);
	  this.confirmTransition(
	    route,
	    function () {
	      var prev = this$1$1.current;
	      this$1$1.updateRoute(route);
	      onComplete && onComplete(route);
	      this$1$1.ensureURL();
	      this$1$1.router.afterHooks.forEach(function (hook) {
	        hook && hook(route, prev);
	      });

	      // fire ready cbs once
	      if (!this$1$1.ready) {
	        this$1$1.ready = true;
	        this$1$1.readyCbs.forEach(function (cb) {
	          cb(route);
	        });
	      }
	    },
	    function (err) {
	      if (onAbort) {
	        onAbort(err);
	      }
	      if (err && !this$1$1.ready) {
	        this$1$1.ready = true;
	        // Initial redirection should still trigger the onReady onSuccess
	        // https://github.com/vuejs/vue-router/issues/3225
	        if (!isRouterError(err, NavigationFailureType.redirected)) {
	          this$1$1.readyErrorCbs.forEach(function (cb) {
	            cb(err);
	          });
	        } else {
	          this$1$1.readyCbs.forEach(function (cb) {
	            cb(route);
	          });
	        }
	      }
	    }
	  );
	};

	History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
	    var this$1$1 = this;

	  var current = this.current;
	  var abort = function (err) {
	    // changed after adding errors with
	    // https://github.com/vuejs/vue-router/pull/3047 before that change,
	    // redirect and aborted navigation would produce an err == null
	    if (!isRouterError(err) && isError(err)) {
	      if (this$1$1.errorCbs.length) {
	        this$1$1.errorCbs.forEach(function (cb) {
	          cb(err);
	        });
	      } else {
	        warn(false, 'uncaught error during route navigation:');
	        console.error(err);
	      }
	    }
	    onAbort && onAbort(err);
	  };
	  var lastRouteIndex = route.matched.length - 1;
	  var lastCurrentIndex = current.matched.length - 1;
	  if (
	    isSameRoute(route, current) &&
	    // in the case the route map has been dynamically appended to
	    lastRouteIndex === lastCurrentIndex &&
	    route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
	  ) {
	    this.ensureURL();
	    return abort(createNavigationDuplicatedError(current, route))
	  }

	  var ref = resolveQueue(
	    this.current.matched,
	    route.matched
	  );
	    var updated = ref.updated;
	    var deactivated = ref.deactivated;
	    var activated = ref.activated;

	  var queue = [].concat(
	    // in-component leave guards
	    extractLeaveGuards(deactivated),
	    // global before hooks
	    this.router.beforeHooks,
	    // in-component update hooks
	    extractUpdateHooks(updated),
	    // in-config enter guards
	    activated.map(function (m) { return m.beforeEnter; }),
	    // async components
	    resolveAsyncComponents(activated)
	  );

	  this.pending = route;
	  var iterator = function (hook, next) {
	    if (this$1$1.pending !== route) {
	      return abort(createNavigationCancelledError(current, route))
	    }
	    try {
	      hook(route, current, function (to) {
	        if (to === false) {
	          // next(false) -> abort navigation, ensure current URL
	          this$1$1.ensureURL(true);
	          abort(createNavigationAbortedError(current, route));
	        } else if (isError(to)) {
	          this$1$1.ensureURL(true);
	          abort(to);
	        } else if (
	          typeof to === 'string' ||
	          (typeof to === 'object' &&
	            (typeof to.path === 'string' || typeof to.name === 'string'))
	        ) {
	          // next('/') or next({ path: '/' }) -> redirect
	          abort(createNavigationRedirectedError(current, route));
	          if (typeof to === 'object' && to.replace) {
	            this$1$1.replace(to);
	          } else {
	            this$1$1.push(to);
	          }
	        } else {
	          // confirm transition and pass on the value
	          next(to);
	        }
	      });
	    } catch (e) {
	      abort(e);
	    }
	  };

	  runQueue(queue, iterator, function () {
	    var postEnterCbs = [];
	    var isValid = function () { return this$1$1.current === route; };
	    // wait until async components are resolved before
	    // extracting in-component enter guards
	    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
	    var queue = enterGuards.concat(this$1$1.router.resolveHooks);
	    runQueue(queue, iterator, function () {
	      if (this$1$1.pending !== route) {
	        return abort(createNavigationCancelledError(current, route))
	      }
	      this$1$1.pending = null;
	      onComplete(route);
	      if (this$1$1.router.app) {
	        this$1$1.router.app.$nextTick(function () {
	          postEnterCbs.forEach(function (cb) {
	            cb();
	          });
	        });
	      }
	    });
	  });
	};

	History.prototype.updateRoute = function updateRoute (route) {
	  this.current = route;
	  this.cb && this.cb(route);
	};

	History.prototype.setupListeners = function setupListeners () {
	  // Default implementation is empty
	};

	History.prototype.teardownListeners = function teardownListeners () {
	  this.listeners.forEach(function (cleanupListener) {
	    cleanupListener();
	  });
	  this.listeners = [];
	};

	function normalizeBase (base) {
	  if (!base) {
	    if (inBrowser) {
	      // respect <base> tag
	      var baseEl = document.querySelector('base');
	      base = (baseEl && baseEl.getAttribute('href')) || '/';
	      // strip full URL origin
	      base = base.replace(/^https?:\/\/[^\/]+/, '');
	    } else {
	      base = '/';
	    }
	  }
	  // make sure there's the starting slash
	  if (base.charAt(0) !== '/') {
	    base = '/' + base;
	  }
	  // remove trailing slash
	  return base.replace(/\/$/, '')
	}

	function resolveQueue (
	  current,
	  next
	) {
	  var i;
	  var max = Math.max(current.length, next.length);
	  for (i = 0; i < max; i++) {
	    if (current[i] !== next[i]) {
	      break
	    }
	  }
	  return {
	    updated: next.slice(0, i),
	    activated: next.slice(i),
	    deactivated: current.slice(i)
	  }
	}

	function extractGuards (
	  records,
	  name,
	  bind,
	  reverse
	) {
	  var guards = flatMapComponents(records, function (def, instance, match, key) {
	    var guard = extractGuard(def, name);
	    if (guard) {
	      return Array.isArray(guard)
	        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
	        : bind(guard, instance, match, key)
	    }
	  });
	  return flatten(reverse ? guards.reverse() : guards)
	}

	function extractGuard (
	  def,
	  key
	) {
	  if (typeof def !== 'function') {
	    // extend now so that global mixins are applied.
	    def = _Vue.extend(def);
	  }
	  return def.options[key]
	}

	function extractLeaveGuards (deactivated) {
	  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
	}

	function extractUpdateHooks (updated) {
	  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
	}

	function bindGuard (guard, instance) {
	  if (instance) {
	    return function boundRouteGuard () {
	      return guard.apply(instance, arguments)
	    }
	  }
	}

	function extractEnterGuards (
	  activated,
	  cbs,
	  isValid
	) {
	  return extractGuards(
	    activated,
	    'beforeRouteEnter',
	    function (guard, _, match, key) {
	      return bindEnterGuard(guard, match, key, cbs, isValid)
	    }
	  )
	}

	function bindEnterGuard (
	  guard,
	  match,
	  key,
	  cbs,
	  isValid
	) {
	  return function routeEnterGuard (to, from, next) {
	    return guard(to, from, function (cb) {
	      if (typeof cb === 'function') {
	        cbs.push(function () {
	          // #750
	          // if a router-view is wrapped with an out-in transition,
	          // the instance may not have been registered at this time.
	          // we will need to poll for registration until current route
	          // is no longer valid.
	          poll(cb, match.instances, key, isValid);
	        });
	      }
	      next(cb);
	    })
	  }
	}

	function poll (
	  cb, // somehow flow cannot infer this is a function
	  instances,
	  key,
	  isValid
	) {
	  if (
	    instances[key] &&
	    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
	  ) {
	    cb(instances[key]);
	  } else if (isValid()) {
	    setTimeout(function () {
	      poll(cb, instances, key, isValid);
	    }, 16);
	  }
	}

	/*  */

	var HTML5History = /*@__PURE__*/(function (History) {
	  function HTML5History (router, base) {
	    History.call(this, router, base);

	    this._startLocation = getLocation(this.base);
	  }

	  if ( History ) HTML5History.__proto__ = History;
	  HTML5History.prototype = Object.create( History && History.prototype );
	  HTML5History.prototype.constructor = HTML5History;

	  HTML5History.prototype.setupListeners = function setupListeners () {
	    var this$1$1 = this;

	    if (this.listeners.length > 0) {
	      return
	    }

	    var router = this.router;
	    var expectScroll = router.options.scrollBehavior;
	    var supportsScroll = supportsPushState && expectScroll;

	    if (supportsScroll) {
	      this.listeners.push(setupScroll());
	    }

	    var handleRoutingEvent = function () {
	      var current = this$1$1.current;

	      // Avoiding first `popstate` event dispatched in some browsers but first
	      // history route not updated since async guard at the same time.
	      var location = getLocation(this$1$1.base);
	      if (this$1$1.current === START && location === this$1$1._startLocation) {
	        return
	      }

	      this$1$1.transitionTo(location, function (route) {
	        if (supportsScroll) {
	          handleScroll(router, route, current, true);
	        }
	      });
	    };
	    window.addEventListener('popstate', handleRoutingEvent);
	    this.listeners.push(function () {
	      window.removeEventListener('popstate', handleRoutingEvent);
	    });
	  };

	  HTML5History.prototype.go = function go (n) {
	    window.history.go(n);
	  };

	  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    var ref = this;
	    var fromRoute = ref.current;
	    this.transitionTo(location, function (route) {
	      pushState(cleanPath(this$1$1.base + route.fullPath));
	      handleScroll(this$1$1.router, route, fromRoute, false);
	      onComplete && onComplete(route);
	    }, onAbort);
	  };

	  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    var ref = this;
	    var fromRoute = ref.current;
	    this.transitionTo(location, function (route) {
	      replaceState(cleanPath(this$1$1.base + route.fullPath));
	      handleScroll(this$1$1.router, route, fromRoute, false);
	      onComplete && onComplete(route);
	    }, onAbort);
	  };

	  HTML5History.prototype.ensureURL = function ensureURL (push) {
	    if (getLocation(this.base) !== this.current.fullPath) {
	      var current = cleanPath(this.base + this.current.fullPath);
	      push ? pushState(current) : replaceState(current);
	    }
	  };

	  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
	    return getLocation(this.base)
	  };

	  return HTML5History;
	}(History));

	function getLocation (base) {
	  var path = decodeURI(window.location.pathname);
	  if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
	    path = path.slice(base.length);
	  }
	  return (path || '/') + window.location.search + window.location.hash
	}

	/*  */

	var HashHistory = /*@__PURE__*/(function (History) {
	  function HashHistory (router, base, fallback) {
	    History.call(this, router, base);
	    // check history fallback deeplinking
	    if (fallback && checkFallback(this.base)) {
	      return
	    }
	    ensureSlash();
	  }

	  if ( History ) HashHistory.__proto__ = History;
	  HashHistory.prototype = Object.create( History && History.prototype );
	  HashHistory.prototype.constructor = HashHistory;

	  // this is delayed until the app mounts
	  // to avoid the hashchange listener being fired too early
	  HashHistory.prototype.setupListeners = function setupListeners () {
	    var this$1$1 = this;

	    if (this.listeners.length > 0) {
	      return
	    }

	    var router = this.router;
	    var expectScroll = router.options.scrollBehavior;
	    var supportsScroll = supportsPushState && expectScroll;

	    if (supportsScroll) {
	      this.listeners.push(setupScroll());
	    }

	    var handleRoutingEvent = function () {
	      var current = this$1$1.current;
	      if (!ensureSlash()) {
	        return
	      }
	      this$1$1.transitionTo(getHash(), function (route) {
	        if (supportsScroll) {
	          handleScroll(this$1$1.router, route, current, true);
	        }
	        if (!supportsPushState) {
	          replaceHash(route.fullPath);
	        }
	      });
	    };
	    var eventType = supportsPushState ? 'popstate' : 'hashchange';
	    window.addEventListener(
	      eventType,
	      handleRoutingEvent
	    );
	    this.listeners.push(function () {
	      window.removeEventListener(eventType, handleRoutingEvent);
	    });
	  };

	  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    var ref = this;
	    var fromRoute = ref.current;
	    this.transitionTo(
	      location,
	      function (route) {
	        pushHash(route.fullPath);
	        handleScroll(this$1$1.router, route, fromRoute, false);
	        onComplete && onComplete(route);
	      },
	      onAbort
	    );
	  };

	  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    var ref = this;
	    var fromRoute = ref.current;
	    this.transitionTo(
	      location,
	      function (route) {
	        replaceHash(route.fullPath);
	        handleScroll(this$1$1.router, route, fromRoute, false);
	        onComplete && onComplete(route);
	      },
	      onAbort
	    );
	  };

	  HashHistory.prototype.go = function go (n) {
	    window.history.go(n);
	  };

	  HashHistory.prototype.ensureURL = function ensureURL (push) {
	    var current = this.current.fullPath;
	    if (getHash() !== current) {
	      push ? pushHash(current) : replaceHash(current);
	    }
	  };

	  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
	    return getHash()
	  };

	  return HashHistory;
	}(History));

	function checkFallback (base) {
	  var location = getLocation(base);
	  if (!/^\/#/.test(location)) {
	    window.location.replace(cleanPath(base + '/#' + location));
	    return true
	  }
	}

	function ensureSlash () {
	  var path = getHash();
	  if (path.charAt(0) === '/') {
	    return true
	  }
	  replaceHash('/' + path);
	  return false
	}

	function getHash () {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  var href = window.location.href;
	  var index = href.indexOf('#');
	  // empty path
	  if (index < 0) { return '' }

	  href = href.slice(index + 1);
	  // decode the hash but not the search or hash
	  // as search(query) is already decoded
	  // https://github.com/vuejs/vue-router/issues/2708
	  var searchIndex = href.indexOf('?');
	  if (searchIndex < 0) {
	    var hashIndex = href.indexOf('#');
	    if (hashIndex > -1) {
	      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
	    } else { href = decodeURI(href); }
	  } else {
	    href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
	  }

	  return href
	}

	function getUrl (path) {
	  var href = window.location.href;
	  var i = href.indexOf('#');
	  var base = i >= 0 ? href.slice(0, i) : href;
	  return (base + "#" + path)
	}

	function pushHash (path) {
	  if (supportsPushState) {
	    pushState(getUrl(path));
	  } else {
	    window.location.hash = path;
	  }
	}

	function replaceHash (path) {
	  if (supportsPushState) {
	    replaceState(getUrl(path));
	  } else {
	    window.location.replace(getUrl(path));
	  }
	}

	/*  */

	var AbstractHistory = /*@__PURE__*/(function (History) {
	  function AbstractHistory (router, base) {
	    History.call(this, router, base);
	    this.stack = [];
	    this.index = -1;
	  }

	  if ( History ) AbstractHistory.__proto__ = History;
	  AbstractHistory.prototype = Object.create( History && History.prototype );
	  AbstractHistory.prototype.constructor = AbstractHistory;

	  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    this.transitionTo(
	      location,
	      function (route) {
	        this$1$1.stack = this$1$1.stack.slice(0, this$1$1.index + 1).concat(route);
	        this$1$1.index++;
	        onComplete && onComplete(route);
	      },
	      onAbort
	    );
	  };

	  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
	    var this$1$1 = this;

	    this.transitionTo(
	      location,
	      function (route) {
	        this$1$1.stack = this$1$1.stack.slice(0, this$1$1.index).concat(route);
	        onComplete && onComplete(route);
	      },
	      onAbort
	    );
	  };

	  AbstractHistory.prototype.go = function go (n) {
	    var this$1$1 = this;

	    var targetIndex = this.index + n;
	    if (targetIndex < 0 || targetIndex >= this.stack.length) {
	      return
	    }
	    var route = this.stack[targetIndex];
	    this.confirmTransition(
	      route,
	      function () {
	        this$1$1.index = targetIndex;
	        this$1$1.updateRoute(route);
	      },
	      function (err) {
	        if (isRouterError(err, NavigationFailureType.duplicated)) {
	          this$1$1.index = targetIndex;
	        }
	      }
	    );
	  };

	  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
	    var current = this.stack[this.stack.length - 1];
	    return current ? current.fullPath : '/'
	  };

	  AbstractHistory.prototype.ensureURL = function ensureURL () {
	    // noop
	  };

	  return AbstractHistory;
	}(History));

	/*  */



	var VueRouter = function VueRouter (options) {
	  if ( options === void 0 ) options = {};

	  this.app = null;
	  this.apps = [];
	  this.options = options;
	  this.beforeHooks = [];
	  this.resolveHooks = [];
	  this.afterHooks = [];
	  this.matcher = createMatcher(options.routes || [], this);

	  var mode = options.mode || 'hash';
	  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
	  if (this.fallback) {
	    mode = 'hash';
	  }
	  if (!inBrowser) {
	    mode = 'abstract';
	  }
	  this.mode = mode;

	  switch (mode) {
	    case 'history':
	      this.history = new HTML5History(this, options.base);
	      break
	    case 'hash':
	      this.history = new HashHistory(this, options.base, this.fallback);
	      break
	    case 'abstract':
	      this.history = new AbstractHistory(this, options.base);
	      break
	    default:
	      {
	        assert(false, ("invalid mode: " + mode));
	      }
	  }
	};

	var prototypeAccessors = { currentRoute: { configurable: true } };

	VueRouter.prototype.match = function match (
	  raw,
	  current,
	  redirectedFrom
	) {
	  return this.matcher.match(raw, current, redirectedFrom)
	};

	prototypeAccessors.currentRoute.get = function () {
	  return this.history && this.history.current
	};

	VueRouter.prototype.init = function init (app /* Vue component instance */) {
	    var this$1$1 = this;

	  assert(
	    install.installed,
	    "not installed. Make sure to call `Vue.use(VueRouter)` " +
	    "before creating root instance."
	  );

	  this.apps.push(app);

	  // set up app destroyed handler
	  // https://github.com/vuejs/vue-router/issues/2639
	  app.$once('hook:destroyed', function () {
	    // clean out app from this.apps array once destroyed
	    var index = this$1$1.apps.indexOf(app);
	    if (index > -1) { this$1$1.apps.splice(index, 1); }
	    // ensure we still have a main app or null if no apps
	    // we do not release the router so it can be reused
	    if (this$1$1.app === app) { this$1$1.app = this$1$1.apps[0] || null; }

	    if (!this$1$1.app) {
	      // clean up event listeners
	      // https://github.com/vuejs/vue-router/issues/2341
	      this$1$1.history.teardownListeners();
	    }
	  });

	  // main app previously initialized
	  // return as we don't need to set up new history listener
	  if (this.app) {
	    return
	  }

	  this.app = app;

	  var history = this.history;

	  if (history instanceof HTML5History || history instanceof HashHistory) {
	    var setupListeners = function () {
	      history.setupListeners();
	    };
	    history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
	  }

	  history.listen(function (route) {
	    this$1$1.apps.forEach(function (app) {
	      app._route = route;
	    });
	  });
	};

	VueRouter.prototype.beforeEach = function beforeEach (fn) {
	  return registerHook(this.beforeHooks, fn)
	};

	VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
	  return registerHook(this.resolveHooks, fn)
	};

	VueRouter.prototype.afterEach = function afterEach (fn) {
	  return registerHook(this.afterHooks, fn)
	};

	VueRouter.prototype.onReady = function onReady (cb, errorCb) {
	  this.history.onReady(cb, errorCb);
	};

	VueRouter.prototype.onError = function onError (errorCb) {
	  this.history.onError(errorCb);
	};

	VueRouter.prototype.push = function push (location, onComplete, onAbort) {
	    var this$1$1 = this;

	  // $flow-disable-line
	  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
	    return new Promise(function (resolve, reject) {
	      this$1$1.history.push(location, resolve, reject);
	    })
	  } else {
	    this.history.push(location, onComplete, onAbort);
	  }
	};

	VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
	    var this$1$1 = this;

	  // $flow-disable-line
	  if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
	    return new Promise(function (resolve, reject) {
	      this$1$1.history.replace(location, resolve, reject);
	    })
	  } else {
	    this.history.replace(location, onComplete, onAbort);
	  }
	};

	VueRouter.prototype.go = function go (n) {
	  this.history.go(n);
	};

	VueRouter.prototype.back = function back () {
	  this.go(-1);
	};

	VueRouter.prototype.forward = function forward () {
	  this.go(1);
	};

	VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
	  var route = to
	    ? to.matched
	      ? to
	      : this.resolve(to).route
	    : this.currentRoute;
	  if (!route) {
	    return []
	  }
	  return [].concat.apply([], route.matched.map(function (m) {
	    return Object.keys(m.components).map(function (key) {
	      return m.components[key]
	    })
	  }))
	};

	VueRouter.prototype.resolve = function resolve (
	  to,
	  current,
	  append
	) {
	  current = current || this.history.current;
	  var location = normalizeLocation(
	    to,
	    current,
	    append,
	    this
	  );
	  var route = this.match(location, current);
	  var fullPath = route.redirectedFrom || route.fullPath;
	  var base = this.history.base;
	  var href = createHref(base, fullPath, this.mode);
	  return {
	    location: location,
	    route: route,
	    href: href,
	    // for backwards compat
	    normalizedTo: location,
	    resolved: route
	  }
	};

	VueRouter.prototype.addRoutes = function addRoutes (routes) {
	  this.matcher.addRoutes(routes);
	  if (this.history.current !== START) {
	    this.history.transitionTo(this.history.getCurrentLocation());
	  }
	};

	Object.defineProperties( VueRouter.prototype, prototypeAccessors );

	function registerHook (list, fn) {
	  list.push(fn);
	  return function () {
	    var i = list.indexOf(fn);
	    if (i > -1) { list.splice(i, 1); }
	  }
	}

	function createHref (base, fullPath, mode) {
	  var path = mode === 'hash' ? '#' + fullPath : fullPath;
	  return base ? cleanPath(base + '/' + path) : path
	}

	VueRouter.install = install;
	VueRouter.version = '3.3.4';

	if (inBrowser && window.Vue) {
	  window.Vue.use(VueRouter);
	}

	var vueRouter_common = VueRouter;

	var VueRouter$1 = vueRouter_common;

	var qs$1 = {exports: {}};

	(function (module, exports) {
	(function(f){{module.exports=f();}})(function(){return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof commonjsRequire&&commonjsRequire;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof commonjsRequire&&commonjsRequire,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	module.exports = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};

	},{}],2:[function(require,module,exports){

	var stringify = require('./stringify');
	var parse = require('./parse');
	var formats = require('./formats');

	module.exports = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};

	},{"./formats":1,"./parse":3,"./stringify":4}],3:[function(require,module,exports){

	var utils = require('./utils');

	var has = Object.prototype.hasOwnProperty;

	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    charset: 'utf-8',
	    charsetSentinel: false,
	    comma: false,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    ignoreQueryPrefix: false,
	    interpretNumericEntities: false,
	    parameterLimit: 1000,
	    parseArrays: true,
	    plainObjects: false,
	    strictNullHandling: false
	};

	var interpretNumericEntities = function (str) {
	    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
	        return String.fromCharCode(parseInt(numberStr, 10));
	    });
	};

	// This is what browsers will submit when the ✓ character occurs in an
	// application/x-www-form-urlencoded body and the encoding of the page containing
	// the form is iso-8859-1, or when the submitted form has an accept-charset
	// attribute of iso-8859-1. Presumably also with other charsets that do not contain
	// the ✓ character, such as us-ascii.
	var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

	// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
	var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
	    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
	    var parts = cleanStr.split(options.delimiter, limit);
	    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
	    var i;

	    var charset = options.charset;
	    if (options.charsetSentinel) {
	        for (i = 0; i < parts.length; ++i) {
	            if (parts[i].indexOf('utf8=') === 0) {
	                if (parts[i] === charsetSentinel) {
	                    charset = 'utf-8';
	                } else if (parts[i] === isoSentinel) {
	                    charset = 'iso-8859-1';
	                }
	                skipIndex = i;
	                i = parts.length; // The eslint settings do not allow break;
	            }
	        }
	    }

	    for (i = 0; i < parts.length; ++i) {
	        if (i === skipIndex) {
	            continue;
	        }
	        var part = parts[i];

	        var bracketEqualsPos = part.indexOf(']=');
	        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part, defaults.decoder, charset);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos), defaults.decoder, charset);
	            val = options.decoder(part.slice(pos + 1), defaults.decoder, charset);
	        }

	        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
	            val = interpretNumericEntities(val);
	        }

	        if (val && options.comma && val.indexOf(',') > -1) {
	            val = val.split(',');
	        }

	        if (has.call(obj, key)) {
	            obj[key] = utils.combine(obj[key], val);
	        } else {
	            obj[key] = val;
	        }
	    }

	    return obj;
	};

	var parseObject = function (chain, val, options) {
	    var leaf = val;

	    for (var i = chain.length - 1; i >= 0; --i) {
	        var obj;
	        var root = chain[i];

	        if (root === '[]' && options.parseArrays) {
	            obj = [].concat(leaf);
	        } else {
	            obj = options.plainObjects ? Object.create(null) : {};
	            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	            var index = parseInt(cleanRoot, 10);
	            if (!options.parseArrays && cleanRoot === '') {
	                obj = { 0: leaf };
	            } else if (
	                !isNaN(index)
	                && root !== cleanRoot
	                && String(index) === cleanRoot
	                && index >= 0
	                && (options.parseArrays && index <= options.arrayLimit)
	            ) {
	                obj = [];
	                obj[index] = leaf;
	            } else {
	                obj[cleanRoot] = leaf;
	            }
	        }

	        leaf = obj;
	    }

	    return leaf;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;

	    // Get the parent

	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;

	    // Stash the parent if it exists

	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(parent);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options);
	};

	var normalizeParseOptions = function normalizeParseOptions(opts) {
	    if (!opts) {
	        return defaults;
	    }

	    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }
	    var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;

	    return {
	        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
	        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
	        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
	        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
	        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
	        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
	        depth: typeof opts.depth === 'number' ? opts.depth : defaults.depth,
	        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
	        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
	        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
	        parseArrays: opts.parseArrays !== false,
	        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
	    };
	};

	module.exports = function (str, opts) {
	    var options = normalizeParseOptions(opts);

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }

	    return utils.compact(obj);
	};

	},{"./utils":5}],4:[function(require,module,exports){

	var utils = require('./utils');
	var formats = require('./formats');
	var has = Object.prototype.hasOwnProperty;

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    comma: 'comma',
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};

	var isArray = Array.isArray;
	var push = Array.prototype.push;
	var pushToArray = function (arr, valueOrArray) {
	    push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
	};

	var toISO = Date.prototype.toISOString;

	var defaults = {
	    addQueryPrefix: false,
	    allowDots: false,
	    charset: 'utf-8',
	    charsetSentinel: false,
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    formatter: formats.formatters[formats['default']],
	    // deprecated
	    indices: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly,
	    charset
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
	        obj = obj.join(',');
	    }

	    if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset) : prefix;
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        if (isArray(obj)) {
	            pushToArray(values, stringify(
	                obj[key],
	                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly,
	                charset
	            ));
	        } else {
	            pushToArray(values, stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly,
	                charset
	            ));
	        }
	    }

	    return values;
	};

	var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
	    if (!opts) {
	        return defaults;
	    }

	    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var charset = opts.charset || defaults.charset;
	    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
	        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
	    }

	    var format = formats['default'];
	    if (typeof opts.format !== 'undefined') {
	        if (!has.call(formats.formatters, opts.format)) {
	            throw new TypeError('Unknown format option provided.');
	        }
	        format = opts.format;
	    }
	    var formatter = formats.formatters[format];

	    var filter = defaults.filter;
	    if (typeof opts.filter === 'function' || isArray(opts.filter)) {
	        filter = opts.filter;
	    }

	    return {
	        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
	        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
	        charset: charset,
	        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
	        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
	        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
	        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
	        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
	        filter: filter,
	        formatter: formatter,
	        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
	        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
	        sort: typeof opts.sort === 'function' ? opts.sort : null,
	        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
	    };
	};

	module.exports = function (object, opts) {
	    var obj = object;
	    var options = normalizeStringifyOptions(opts);

	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = opts.arrayFormat;
	    } else if (opts && 'indices' in opts) {
	        arrayFormat = opts.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (options.sort) {
	        objKeys.sort(options.sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (options.skipNulls && obj[key] === null) {
	            continue;
	        }
	        pushToArray(keys, stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            options.strictNullHandling,
	            options.skipNulls,
	            options.encode ? options.encoder : null,
	            options.filter,
	            options.sort,
	            options.allowDots,
	            options.serializeDate,
	            options.formatter,
	            options.encodeValuesOnly,
	            options.charset
	        ));
	    }

	    var joined = keys.join(options.delimiter);
	    var prefix = options.addQueryPrefix === true ? '?' : '';

	    if (options.charsetSentinel) {
	        if (options.charset === 'iso-8859-1') {
	            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
	            prefix += 'utf8=%26%2310003%3B&';
	        } else {
	            // encodeURIComponent('✓')
	            prefix += 'utf8=%E2%9C%93&';
	        }
	    }

	    return joined.length > 0 ? prefix + joined : '';
	};

	},{"./formats":1,"./utils":5}],5:[function(require,module,exports){

	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }

	    return array;
	}());

	var compactQueue = function compactQueue(queue) {
	    while (queue.length > 1) {
	        var item = queue.pop();
	        var obj = item.obj[item.prop];

	        if (isArray(obj)) {
	            var compacted = [];

	            for (var j = 0; j < obj.length; ++j) {
	                if (typeof obj[j] !== 'undefined') {
	                    compacted.push(obj[j]);
	                }
	            }

	            item.obj[item.prop] = compacted;
	        }
	    }
	};

	var arrayToObject = function arrayToObject(source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	var merge = function merge(target, source, options) {
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (isArray(target)) {
	            target.push(source);
	        } else if (target && typeof target === 'object') {
	            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (!target || typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (isArray(target) && !isArray(source)) {
	        mergeTarget = arrayToObject(target, options);
	    }

	    if (isArray(target) && isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                var targetItem = target[i];
	                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
	                    target[i] = merge(targetItem, item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (has.call(acc, key)) {
	            acc[key] = merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	var assign = function assignSingleSource(target, source) {
	    return Object.keys(source).reduce(function (acc, key) {
	        acc[key] = source[key];
	        return acc;
	    }, target);
	};

	var decode = function (str, decoder, charset) {
	    var strWithoutPlus = str.replace(/\+/g, ' ');
	    if (charset === 'iso-8859-1') {
	        // unescape never throws, no try...catch needed:
	        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
	    }
	    // utf-8
	    try {
	        return decodeURIComponent(strWithoutPlus);
	    } catch (e) {
	        return strWithoutPlus;
	    }
	};

	var encode = function encode(str, defaultEncoder, charset) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = typeof str === 'string' ? str : String(str);

	    if (charset === 'iso-8859-1') {
	        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
	            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
	        });
	    }

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D // -
	            || c === 0x2E // .
	            || c === 0x5F // _
	            || c === 0x7E // ~
	            || (c >= 0x30 && c <= 0x39) // 0-9
	            || (c >= 0x41 && c <= 0x5A) // a-z
	            || (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)]
	            + hexTable[0x80 | ((c >> 12) & 0x3F)]
	            + hexTable[0x80 | ((c >> 6) & 0x3F)]
	            + hexTable[0x80 | (c & 0x3F)];
	    }

	    return out;
	};

	var compact = function compact(value) {
	    var queue = [{ obj: { o: value }, prop: 'o' }];
	    var refs = [];

	    for (var i = 0; i < queue.length; ++i) {
	        var item = queue[i];
	        var obj = item.obj[item.prop];

	        var keys = Object.keys(obj);
	        for (var j = 0; j < keys.length; ++j) {
	            var key = keys[j];
	            var val = obj[key];
	            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
	                queue.push({ obj: obj, prop: key });
	                refs.push(val);
	            }
	        }
	    }

	    compactQueue(queue);

	    return value;
	};

	var isRegExp = function isRegExp(obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	var isBuffer = function isBuffer(obj) {
	    if (!obj || typeof obj !== 'object') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};

	var combine = function combine(a, b) {
	    return [].concat(a, b);
	};

	module.exports = {
	    arrayToObject: arrayToObject,
	    assign: assign,
	    combine: combine,
	    compact: compact,
	    decode: decode,
	    encode: encode,
	    isBuffer: isBuffer,
	    isRegExp: isRegExp,
	    merge: merge
	};

	},{}]},{},[2])(2)
	});
	}(qs$1));

	var qs = qs$1.exports;

	Vue.use(VueRouter$1);
	var router = new VueRouter$1({
	  mode: 'history',
	  routes: [{
	    path: '/programs',
	    name: 'programs',
	    props: [Array]
	  }],

	  parseQuery(query) {
	    let q = qs.parse(query);
	    Object.keys(q).forEach(function (key) {
	      if (!Array.isArray(q[key])) {
	        q[key] = q[key].split();
	      }
	    });
	    return q;
	  }

	});

	class Programs {
	  constructor() {
	    const baseUrl = window.location.origin + '/wp-json/wp/v2/';
	    const lang = document.documentElement.lang;
	    const element = document.querySelector('[id*="vue"]');
	    const elementId = element.getAttribute('id');
	    const postType = elementId.replace('vue-', '');
	    const filters = element.getAttribute('data-filters');
	    new Vue({
	      delimiters: ['v{', '}'],
	      el: `#${elementId}`,
	      router,
	      data: {
	        baseUrl: baseUrl,
	        lang: lang,
	        postType: postType,
	        programsURL: `${baseUrl}${postType}?lang=${lang}&orderby=menu_order&order=asc`,
	        posts: null,
	        labels: Programs.setTaxObj(filters, true),
	        taxonomies: Programs.setTaxObj(filters, false),
	        filters: [],
	        checkedFilters: [],
	        totalFilters: 0,
	        totalPosts: 0,
	        totalVisible: 0,
	        perPage: 6,
	        page: 1
	      },
	      watch: {
	        // checkedFilters: 'getPrograms',
	        checkedFilters: function () {
	          this.page = 1;
	          this.getPrograms();
	        },
	        page: 'getPrograms'
	      },
	      methods: {
	        getPrograms: Programs.getPrograms,
	        getTax: Programs.getTax,
	        postUrl: Programs.postUrl,
	        updateScroll: Programs.updateScroll
	      },
	      created: function () {
	        /**
	         * Get the taxonomies
	         */
	        let vals = this.getTax();
	        axios.all(vals.map(l => axios.get(l))).then(axios.spread((...res) => {
	          this.filters = res.map(value => value.data);

	          if (Object.keys(this.$route.query).length > 0) {
	            Programs.parseQuery(this);
	          }
	        }));
	      },
	      mounted: function () {
	        if (Object.keys(this.$route.query).length == 0) {
	          this.getPrograms();
	        }
	      },
	      filters: {
	        stripHtml: function (str) {
	          return str.replace(/<\/?[^>]+>/ig, '');
	        },
	        combineStr: function (arr, tax, bool) {
	          if (!arr) {
	            return;
	          }

	          if (bool) {
	            let names = arr.map(value => `<b class="text-alt" data-program="taxonomy.${tax}">${value.name}</b>`);
	            let joined = names.join(', ').replace(/, ([^,]*)$/, ', and $1');
	            return joined;
	          } else {
	            let names = arr.map(value => `<span data-program="taxonomy.${tax}">${value.name}</span>`);
	            let joined = names.join(', ');
	            return joined;
	          }
	        }
	      }
	    });
	  }

	}
	/**
	 * Update the router based on the filters and returns the filters
	 * @param {object} obj 
	 */


	Programs.generateFilters = function (obj) {
	  let checked = obj.checkedFilters;
	  obj.totalFilters = checked.length; // generate the query params

	  var params = {};
	  var ids = {};
	  checked.forEach(function (term) {
	    var key = term.taxonomy;
	    params[key] = params[key] || [];
	    params[key] = params[key].concat(term.slug);
	    ids[key] = ids[key] || [];
	    ids[key] = ids[key].concat(term.id);
	  }); // update the router based on the filters

	  if (JSON.stringify(obj.$route.query) != JSON.stringify(params)) {
	    obj.$router.push({
	      query: params
	    });
	  } // generate the string for the api call


	  let combinedFilter = [];
	  Object.keys(ids).forEach(function (key) {
	    combinedFilter.push(`${key}[]=${ids[key].join(`&${key}[]=`)}`);
	  });
	  combinedFilter = combinedFilter.join('&');
	  return combinedFilter;
	};
	/**
	 * Extracts the filters in the URL and updates the checkedFilters
	 * @param {object} obj 
	 */


	Programs.parseQuery = function (obj) {
	  let query = obj.$route.query;
	  const filters = obj.filters; // find the slugs in the taxonomies and add them to checkedFilters

	  let checked = [];
	  let terms = [].concat.apply([], filters);
	  Object.keys(query).forEach(function (key) {
	    if (Array.isArray(query[key])) {
	      query[key].forEach(function (term) {
	        checked.push(terms.filter(x => x.slug === term)[0]);
	      });
	    } else {
	      checked.push(terms.find(item => item.slug === query[key]));
	    }
	  }); // reassigns the checked filters

	  obj.checkedFilters = checked;
	};
	/**
	 * Request to get the programs and update router
	 **/


	Programs.getPrograms = function () {
	  let filters = Programs.generateFilters(this);
	  let url = `${this.programsURL}&per_page=${this.perPage}&page=${this.page}&${filters}`;
	  axios.get(url).then(response => {
	    this.totalPosts = response.headers['x-wp-total'];

	    if (this.posts != null && this.page > 1) {
	      this.posts = this.posts.concat(response.data);
	    } else {
	      this.posts = response.data;
	    }

	    this.totalVisible = this.posts.length;
	  }).catch(error => {
	    console.log('Error on request: ' + error);
	  });
	};
	/**
	 * Creates an object with keys that will be populated when the user filters
	 * OR creates an array of labels
	 * @param {string} str 
	 * @param {boolean} labels 
	 */


	Programs.setTaxObj = function (str, labels) {
	  const arr = str.split(',');
	  let taxonomies = [];
	  arr.map(function (i) {
	    let arrStr = i.split(':');

	    if (labels) {
	      taxonomies.push(arrStr[1]);
	    } else {
	      let obj = {};
	      obj[arrStr[0]] = null;
	      taxonomies.push(obj);
	    }
	  });
	  return taxonomies;
	};
	/** 
	 * Creates the array of URLS to get the taxonomies
	 */


	Programs.getTax = function () {
	  let promises = this.taxonomies.map(x => `${this.baseUrl}${Object.keys(x)[0]}?hide_empty=true&per_page=100`);
	  return promises;
	};
	/**
	 * Returns the correct url for the programs detail
	 * @param {string} slug 
	 */


	Programs.postUrl = function (slug) {
	  let url = '';

	  if (this.lang != 'en') {
	    url = [this.lang, this.postType, slug].join('/');
	  } else {
	    url = [this.postType, slug].join('/');
	  }

	  return '/' + url;
	};
	/**
	 * Update location of scroll on Show ore
	 */


	Programs.updateScroll = function () {
	  let cur = window.pageYOffset;
	  window.setTimeout(function () {
	    window.scrollTo(0, cur);
	  }, 1000);
	};

	class Questionnaire {
	  constructor() {
	    const baseUrl = window.location.origin + '/wp-json/wp/v2/';
	    const lang = document.documentElement.lang;
	    const element = document.querySelector(Questionnaire.selector);
	    const elementId = element.getAttribute('id');
	    const postType = element.getAttribute('data-post-type');
	    const threshold = element.getAttribute('data-post-threshold');
	    const taxAttrs = Array.from(document.querySelectorAll('[data-taxonomy]'));
	    const filters = taxAttrs.map(function (i) {
	      return i.getAttribute('data-taxonomy');
	    });
	    new Vue({
	      delimiters: ['v{', '}'],
	      el: `#${elementId}`,
	      data: {
	        baseUrl: baseUrl,
	        lang: lang,
	        postType: postType,
	        programsURL: `${baseUrl}${postType}?lang=${lang}`,
	        taxonomies: Questionnaire.setTaxObj(filters),
	        filters: [],
	        checkedFilters: [],
	        totalPosts: 0,
	        success: null,
	        error: false,
	        query: '',
	        threshold: threshold
	      },
	      watch: {
	        checkedFilters: function () {
	          this.getPrograms();
	        }
	      },
	      methods: {
	        getPrograms: Questionnaire.getPrograms,
	        getTax: Questionnaire.getTax
	      },
	      created: function () {
	        /**
	         * Get the taxonomies
	         */
	        let vals = this.getTax();
	        axios.all(vals.map(l => axios.get(l))).then(axios.spread((...res) => {
	          this.filters = res.map(value => value.data);
	        }));
	      }
	    });
	  }

	}
	/**
	 * Makes Rest API call for programs
	 */


	Questionnaire.getPrograms = function () {
	  this.success = null;
	  let filters = Questionnaire.generateFilters(this);
	  let url = `${this.baseUrl}${this.postType}?lang=${this.lang}&${filters}`;
	  axios.get(url).then(response => {
	    this.totalPosts = response.headers['x-wp-total']; // total posts is less than threshold, show no more questions

	    if (this.totalPosts > 0 && this.totalPosts <= this.threshold) {
	      this.success = true;
	    } else if (this.totalPosts > this.threshold) {
	      Questionnaire.revealFieldset(this.checkedFilters.length - 1);
	    } else {
	      this.success = false;
	      this.query = '';
	    }
	  }).catch(error => {
	    console.log('Error on request: ' + error);
	    this.error = true;
	    this.success = null;
	  });
	};
	/**
	 * Updates the fieldset classes based on index
	 * @param {*} index 
	 */


	Questionnaire.revealFieldset = function (index) {
	  const element = document.querySelector(Questionnaire.selector);
	  const fieldset = element.getElementsByTagName('fieldset');

	  if (fieldset[index]) {
	    fieldset[index].classList.remove("hidden");
	    fieldset[index].classList.add("active");
	    fieldset[index].setAttribute("aria-hidden", false);
	  }
	};
	/**
	 * Creates strings of filters for the API and for the form action
	 * @param {object} obj vue data object
	 */


	Questionnaire.generateFilters = function (obj) {
	  let checked = obj.checkedFilters; // generate the query params

	  var params = {};
	  var ids = {};
	  checked.forEach(function (term) {
	    var key = term.taxonomy;
	    params[key] = params[key] || [];
	    params[key] = params[key].concat(term.slug);
	    ids[key] = ids[key] || [];
	    ids[key] = ids[key].concat(term.id);
	  }); // generate the string for the api call

	  let combinedFilter = [];
	  Object.keys(ids).forEach(function (key) {
	    combinedFilter.push(`${key}[]=${ids[key].join(`&${key}[]=`)}`);
	  });
	  combinedFilter = combinedFilter.join('&');
	  let stringFilter = [];
	  Object.keys(params).forEach(function (key) {
	    stringFilter.push(`${key}=${params[key].join(`&${key}=`)}`);
	  });
	  stringFilter = '?' + stringFilter.join('&');
	  obj.query = stringFilter;
	  return combinedFilter;
	};
	/**
	 * Creates an object with keys that will be populated when the user selects a term
	 * @param {string} str
	 */


	Questionnaire.setTaxObj = function (arr) {
	  let taxonomies = [];
	  arr.map(function (i) {
	    let arrStr = i.split(':');
	    let obj = {};
	    obj[arrStr[0]] = null;
	    taxonomies.push(obj);
	  });
	  return taxonomies;
	};
	/**
	 * Creates the array of URLS to get the taxonomies
	 */


	Questionnaire.getTax = function () {
	  let promises = this.taxonomies.map(x => `${this.baseUrl}${Object.keys(x)[0]}?hide_empty=true`);
	  return promises;
	};

	Questionnaire.selector = '[id*="answer-a-few-questions"]';

	/**
	 * Patterns
	 */
	// import headerIds from 'modules/header-ids'

	(function (window) {

	  const icons = document.querySelector('#icons').textContent;
	  new Icons(icons != undefined ? icons : ''); // new Icons('/wp-content/themes/workingnyc/assets/svg/icons.svg');

	  new Toggle();
	  new Accordion();
	  new Copy();
	  new Menu();
	  new Track();
	  new WindowVh(); // headerIds();

	  new WebShare({
	    fallback: () => {
	      new Toggle({
	        selector: WebShare.selector
	      });
	    }
	  }); // Removing the WPML classes

	  const wpmlClasses = '.wpml-ls-statics-shortcode_actions.wpml-ls.wpml-ls-legacy-list-horizontal';
	  document.querySelector(wpmlClasses).removeAttribute('class'); // Add tabindex=-1 to wpml language links

	  const wpmlLinks = document.querySelectorAll('.wpml-ls-link');
	  wpmlLinks.forEach(function (link) {
	    link.setAttribute('tabindex', '-1');
	  });

	  if (document.querySelector('[id*=vue]')) {
	    new Programs();
	  }

	  if (document.querySelector('[id*=answer-a-few-questions]')) {
	    new Questionnaire();
	  }

	  new Dropdown();
	  /**
	   * Newsletter Archive Landing
	  */

	  let element = document.querySelector('[data-js="newsletter-form"]');
	  let params = new URLSearchParams(window.location.search);
	  let response = params.get('response');
	  let newsletter = null;

	  if (element) {
	    let submit = element.querySelector('[type=submit]');
	    let error = element.querySelector('[data-js="alert-error"]');
	    newsletter = new Newsletter(element);
	    newsletter.form.selectors.ERROR_MESSAGE_PARENT = '.c-question__container'; // display error on invalid form

	    submit.addEventListener('click', function () {
	      if (response == null) {
	        error.setAttribute('aria-hidden', 'false');
	        error.classList.remove('hidden');
	      }
	    });
	  }

	  if (response && newsletter) {
	    let email = params.get('email');
	    let input = element.querySelector('input[name="EMAIL"]');
	    input.value = email;
	    newsletter._data = {
	      'result': params.get('result'),
	      'msg': params.get('msg'),
	      'EMAIL': email
	    };

	    newsletter._callback(newsletter._data);
	  }
	  /**
	   * Initialize Google Translate Widget
	   */


	  if (document.documentElement.lang != 'en') {
	    googleTranslateElementInit();
	  }
	  /**
	   * Scrolling Jump Navigation
	   */


	  const jumpClassToggle = item => {
	    for (let i = 0; i < item.parentNode.children.length; i++) {
	      const sibling = item.parentNode.children[i];
	      if (sibling.classList.contains('no-underline')) sibling.classList.remove('no-underline', 'text-alt');
	    }

	    item.classList.add('no-underline', 'text-alt');
	  };

	  (element => {
	    if (element) {
	      let activeNavigation = element.querySelectorAll('a[href]');

	      for (let i = 0; i < activeNavigation.length; i++) {
	        const a = activeNavigation[i];
	        a.addEventListener('click', event => {
	          setTimeout(() => {
	            jumpClassToggle(event.target);
	          }, 200);
	        });
	      }
	    }
	  })(document.querySelector('[data-js*="active-navigation"]'));

	  (elements => {
	    elements.forEach(element => {
	      new Observe({
	        element: element,
	        trigger: entry => {
	          if (!entry.isIntersecting) return;
	          let jumpItem = document.querySelector(`a[href="#${entry.target.id}"]`);
	          jumpItem.parentNode.scrollTo({
	            left: jumpItem.offsetLeft,
	            top: 0,
	            behavior: 'smooth'
	          });
	          jumpClassToggle(jumpItem);
	        }
	      });
	    });
	  })(document.querySelectorAll(Observe.selector));
	})(window);

}());