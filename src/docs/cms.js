(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["cms"] = factory(require("react"));
	else
		root["cms"] = factory(root["react"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var State = __webpack_require__(5)
var tokenize = __webpack_require__(4)

var tokenizedCache = {}

module.exports = function jsonQuery (query, options) {

  // extract params for ['test[param=?]', 'value'] type queries
  var params = options && options.params || null
  if (Array.isArray(query)) {
    params = query.slice(1)
    query = query[0]
  }

  if (!tokenizedCache[query]) {
    tokenizedCache[query] = tokenize(query, true)
  }

  return handleQuery(tokenizedCache[query], options, params)
}


module.exports.lastParent = function (query) {
  var last = query.parents[query.parents.length - 1]
  if (last) {
    return last.value
  } else {
    return null
  }
}


function handleQuery (tokens, options, params) {
  var state = new State(options, params, handleQuery)

  for (var i = 0; i < tokens.length; i++) {
    if (handleToken(tokens[i], state)) {
      break
    }
  }

  // flush
  handleToken(null, state)

  // set databind hooks
  if (state.currentItem instanceof Object) {
    state.addReference(state.currentItem)
  } else {
    var parentObject = getLastParentObject(state.currentParents)
    if (parentObject) {
      state.addReference(parentObject)
    }
  }

  return {
    value: state.currentItem,
    key: state.currentKey,
    references: state.currentReferences,
    parents: state.currentParents
  }
}

function handleToken (token, state) {
  // state: setCurrent, getValue, getValues, resetCurrent, deepQuery, rootContext, currentItem, currentKey, options, filters

  if (token == null) {
    // process end of query
    if (!state.currentItem && state.options.force) {
      state.force(state.options.force)
    }
  } else if (token.values) {
    if (state.currentItem) {
      var keys = Object.keys(state.currentItem)
      var values = []
      keys.forEach(function (key) {
        if (token.deep && Array.isArray(state.currentItem[key])) {
          state.currentItem[key].forEach(function (item) {
            values.push(item)
          })
        } else {
          values.push(state.currentItem[key])
        }
      })
      state.setCurrent(keys, values)
    } else {
      state.setCurrent(keys, [])
    }
  } else if (token.get) {
    var key = state.getValue(token.get)
    if (shouldOverride(state, key)) {
      state.setCurrent(key, state.override[key])
    } else {
      if (state.currentItem || (state.options.force && state.force({}))) {
        if (isDeepAccessor(state.currentItem, key) || token.multiple) {
          var values = state.currentItem.map(function (item) {
            return item[key]
          }).filter(isDefined)

          values = Array.prototype.concat.apply([], values) // flatten

          state.setCurrent(key, values)
        } else {
          state.setCurrent(key, state.currentItem[key])
        }
      } else {
        state.setCurrent(key, null)
      }
    }
  } else if (token.select) {
    if (Array.isArray(state.currentItem) || (state.options.force && state.force([]))) {
      var match = (token.boolean ? token.select : [token]).map(function (part) {
        if (part.op === ':') {
          var key = state.getValue(part.select[0])
          return {
            func: function (item) {
              if (key) {
                item = item[key]
              }
              return state.getValueFrom(part.select[1], item)
            },
            negate: part.negate,
            booleanOp: part.booleanOp
          }
        } else {
          var selector = state.getValues(part.select)
          if (!state.options.allowRegexp && part.op === '~' && selector[1] instanceof RegExp) throw new Error('options.allowRegexp is not enabled.')
          return {
            key: selector[0],
            value: selector[1],
            negate: part.negate,
            booleanOp: part.booleanOp,
            op: part.op
          }
        }
      })

      if (token.multiple) {
        var keys = []
        var value = []
        state.currentItem.forEach(function (item, i) {
          if (matches(item, match)) {
            keys.push(i)
            value.push(item)
          }
        })
        state.setCurrent(keys, value)
      } else {
        if (!state.currentItem.some(function (item, i) {
          if (matches(item, match)) {
            state.setCurrent(i, item)
            return true
          }
        })) {
          state.setCurrent(null, null)
        }
      }
    } else {
      state.setCurrent(null, null)
    }
  } else if (token.root) {
    state.resetCurrent()
    if (token.args && token.args.length) {
      state.setCurrent(null, state.getValue(token.args[0]))
    } else {
      state.setCurrent(null, state.rootContext)
    }
  } else if (token.parent) {
    state.resetCurrent()
    state.setCurrent(null, state.options.parent)
  } else if (token.or) {
    if (state.currentItem) {
      return true
    } else {
      state.resetCurrent()
      state.setCurrent(null, state.context)
    }
  } else if (token.filter) {
    var helper = state.getLocal(token.filter) || state.getGlobal(token.filter)
    if (typeof helper === 'function') {
      // function(input, args...)
      var values = state.getValues(token.args || [])
      var result = helper.apply(state.options, [state.currentItem].concat(values))
      state.setCurrent(null, result)
    } else {
      // fallback to old filters
      var filter = state.getFilter(token.filter)
      if (typeof filter === 'function') {
        var values = state.getValues(token.args || [])
        var result = filter.call(state.options, state.currentItem, {args: values, state: state, data: state.rootContext})
        state.setCurrent(null, result)
      }
    }
  } else if (token.deep) {
    if (state.currentItem) {
      if (token.deep.length === 0) {
        return
      }

      var result = state.deepQuery(state.currentItem, token.deep, state.options)
      if (result) {
        state.setCurrent(result.key, result.value)
        for (var i = 0; i < result.parents.length; i++) {
          state.currentParents.push(result.parents[i])
        }
      } else {
        state.setCurrent(null, null)
      }
    } else {
      state.currentItem = null
    }
  }
}

function matches (item, parts) {
  var result = false
  for (var i = 0; i < parts.length; i++) {
    var opts = parts[i]
    var r = false
    if (opts.func) {
      r = opts.func(item)
    } else if (opts.op === '~') {
      if (opts.value instanceof RegExp) {
        r = item[opts.key] && !!item[opts.key].match(opts.value)
      } else {
        r = item[opts.key] && !!~item[opts.key].indexOf(opts.value)
      }
    } else if (opts.op === '=') {
      if ((item[opts.key] === true && opts.value === 'true') || (item[opts.key] === false && opts.value === 'false')) {
        r = true
      } else {
        r = item[opts.key] == opts.value
      }
    } else if (opts.op === '>') {
      r = item[opts.key] > opts.value
    } else if (opts.op === '<') {
      r = item[opts.key] < opts.value
    } else if (opts.op === '>=') {
      r = item[opts.key] >= opts.value
    } else if (opts.op === '<=') {
      r = item[opts.key] <= opts.value
    }

    if (opts.negate) {
      r = !r
    }
    if (opts.booleanOp === '&') {
      result = result && r
    } else if (opts.booleanOp === '|') {
      result = result || r
    } else {
      result = r
    }
  }

  return result
}

function isDefined(value) {
  return typeof value !== 'undefined'
}

function shouldOverride (state, key) {
  return state.override && state.currentItem === state.rootContext && state.override[key] !== undefined
}

function isDeepAccessor (currentItem, key) {
  return currentItem instanceof Array && parseInt(key) != key
}

function getLastParentObject (parents) {
  for (var i = 0; i < parents.length; i++) {
    if (!(parents[i + 1]) || !(parents[i + 1].value instanceof Object)) {
      return parents[i].value
    }
  }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/lib/Components/CmsComponentRegistry.ts
var ComponentRegistry = /** @class */ (function () {
    function ComponentRegistry() {
        this.components = new Map();
    }
    ComponentRegistry.prototype.register = function (name, component) {
        this.components.set(name, component);
    };
    ComponentRegistry.prototype.get = function (name) {
        return this.components.get(name);
    };
    return ComponentRegistry;
}());
var componentRegistry = new ComponentRegistry();

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/json-query/index.js
var json_query = __webpack_require__(1);

// CONCATENATED MODULE: ./src/lib/Helpers/PropBindingHelper.ts

var PropBindingType;
(function (PropBindingType) {
    PropBindingType[PropBindingType["Dynamic"] = 0] = "Dynamic";
    PropBindingType[PropBindingType["Static"] = 1] = "Static";
})(PropBindingType || (PropBindingType = {}));
function resolveBindingExpression(bindingExpression, context) {
    var result = json_query(bindingExpression, {
        data: context
    });
    return result.value;
}
function getBinding(bindingConfig, context) {
    switch (bindingConfig.type) {
        case PropBindingType.Static: {
            return function () { return bindingConfig.bindingExpression; };
        }
        case PropBindingType.Dynamic: {
            return function () { return resolveBindingExpression(bindingConfig.bindingExpression, context); };
        }
    }
}
function resolvePropBindings(propBindings, context) {
    var props = {};
    propBindings.forEach(function (propBinding) {
        props[propBinding.propertyName] = getBinding(propBinding, context)();
    });
    return props;
}

// CONCATENATED MODULE: ./src/lib/Components/CmsComponent.tsx
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};



//resolves the componentClass against set of registered widgets and instances it with given props
function ReactComponent(_a) {
    var componentClass = _a.componentClass, props = _a.props, children = _a.children;
    return external_react_["createElement"](componentClass, props, children);
}
function BoundReactComponent(_a) {
    var componentClass = _a.componentClass, propBindings = _a.propBindings, bindingContext = _a.bindingContext, children = _a.children, key = _a.key;
    if (!componentClass)
        return null;
    propBindings = propBindings || [];
    var resolvedProps = resolvePropBindings(propBindings, bindingContext || {});
    return ReactComponent({ componentClass: componentClass, props: __assign({ key: key }, resolvedProps), children: children });
}
function ResolveComponentClass(wrappedComponent) {
    return function (_a) {
        var componentClassName = _a.componentClassName, props = __rest(_a, ["componentClassName"]);
        if (!componentClassName)
            return null;
        var componentClass = componentRegistry.get(componentClassName);
        if (!componentClass)
            return null;
        return wrappedComponent(__assign({}, props, { componentClass: componentClass }));
    };
}
var CmsComponent = ResolveComponentClass(BoundReactComponent);
var CmsStaticComponent = ResolveComponentClass(ReactComponent);
function CmsComponentFromConfig(_a) {
    var config = _a.config, bindingContext = _a.bindingContext, props = __rest(_a, ["config", "bindingContext"]);
    if (!config)
        return null;
    return CmsComponent(__assign({}, props, { componentClassName: config.className, propBindings: config.propBindings, bindingContext: bindingContext }));
}

// CONCATENATED MODULE: ./src/lib/Components/CmsComponentContext.tsx
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CmsComponentContext_assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CmsComponentContext_rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};


var CmsComponentContext = external_react_["createContext"]({
    data: {},
    componentConfig: {},
    setData: function (name, newData) { }
});
var CmsComponentContext_CmsComponentContextContainer = /** @class */ (function (_super) {
    __extends(CmsComponentContextContainer, _super);
    function CmsComponentContextContainer(props) {
        var _this = _super.call(this, props) || this;
        _this.updateData = function (name, newData) {
            _this.setState(function (prevState) {
                var _a;
                var newstate = {
                    data: CmsComponentContext_assign({}, prevState.data, (_a = {}, _a[name] = newData, _a))
                };
                return newstate;
            });
        };
        _this.state = {
            componentConfig: props.baseContext ? props.baseContext.componentConfig : {},
            setData: _this.updateData,
            data: props.baseContext ? CmsComponentContext_assign({}, props.baseContext.data) : {}
        };
        return _this;
    }
    CmsComponentContextContainer.prototype.render = function () {
        return (external_react_["createElement"](CmsComponentContext.Provider, { value: this.state }, this.props.children));
    };
    return CmsComponentContextContainer;
}(external_react_["Component"]));

function CmsComponentFromContext(_a) {
    var componentId = _a.componentId, componentContext = _a.componentContext, props = CmsComponentContext_rest(_a, ["componentId", "componentContext"]);
    if (!componentId)
        return null;
    var config = componentContext.componentConfig[componentId];
    return CmsComponentFromConfig(CmsComponentContext_assign({}, props, { config: config, bindingContext: componentContext }));
}
function CmsComponentFromId(props) {
    if (!props.componentId)
        return null;
    return (external_react_["createElement"](CmsComponentContext.Consumer, null, function (context) { return CmsComponentFromContext(CmsComponentContext_assign({}, props, { componentContext: context })); }));
}
function CmsComponentList(_a) {
    var childComponentIds = _a.childComponentIds, props = CmsComponentContext_rest(_a, ["childComponentIds"]);
    if (!childComponentIds || childComponentIds.length == 0)
        return null;
    return (external_react_["createElement"](CmsComponentContext.Consumer, null, function (context) { return childComponentIds.map(function (id, idx) { return external_react_["createElement"](CmsComponentFromContext, { componentId: id, componentContext: context, key: idx }); }); }));
}

// CONCATENATED MODULE: ./src/lib/Components/CmsComponentSlot.tsx
var CmsComponentSlot_assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CmsComponentSlot_rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};



function CmsComponentFromSlot(_a) {
    var slotId = _a.slotId, componentContext = _a.componentContext, props = CmsComponentSlot_rest(_a, ["slotId", "componentContext"]);
    if (!slotId)
        return null;
    var componentToRender = componentContext.componentConfig["slot/" + slotId];
    if (!componentToRender)
        return external_react_["createElement"]("div", CmsComponentSlot_assign({ "data-slotid": slotId }, props));
    return external_react_["createElement"](CmsComponentFromConfig, CmsComponentSlot_assign({ config: componentToRender, bindingContext: componentContext }, props));
}
function CmsComponentSlot(_a) {
    var slotId = _a.slotId, props = CmsComponentSlot_rest(_a, ["slotId"]);
    return (external_react_["createElement"](CmsComponentContext.Consumer, null, function (context) { return CmsComponentFromSlot(CmsComponentSlot_assign({ slotId: slotId, componentContext: context }, props)); }));
}

// CONCATENATED MODULE: ./src/lib/Components/index.ts





// CONCATENATED MODULE: ./src/lib/Datasources/IndexedDatasource.ts
var IndexedDatasource_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var IndexedDatasource = /** @class */ (function (_super) {
    IndexedDatasource_extends(IndexedDatasource, _super);
    function IndexedDatasource(props) {
        return _super.call(this, props) || this;
    }
    IndexedDatasource.prototype.componentDidUpdate = function (prevProps) {
        if (this.props.data != prevProps.data || this.props.index != prevProps.index) {
            this.updateContext();
        }
    };
    IndexedDatasource.prototype.updateContext = function () {
        var data = this.props.data;
        var index = this.props.index;
        try {
            var val = data ? data[index] : {};
            this.props.setData(this.props.name, val);
        }
        catch (_a) {
        }
    };
    IndexedDatasource.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { setTimeout(resolve, 1); })];
                    case 1:
                        _a.sent();
                        this.updateContext();
                        return [2 /*return*/];
                }
            });
        });
    };
    IndexedDatasource.prototype.render = function () {
        return null;
    };
    return IndexedDatasource;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/lib/Datasources/StaticDatasource.ts
var StaticDatasource_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var StaticDatasource_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var StaticDatasource_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var StaticDatasource = /** @class */ (function (_super) {
    StaticDatasource_extends(StaticDatasource, _super);
    function StaticDatasource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticDatasource.prototype.componentDidMount = function () {
        return StaticDatasource_awaiter(this, void 0, void 0, function () {
            return StaticDatasource_generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) { setTimeout(resolve, 1); })];
                    case 1:
                        _a.sent();
                        this.props.setData(this.props.name, this.props.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    StaticDatasource.prototype.render = function () {
        return null;
    };
    return StaticDatasource;
}(external_react_["Component"]));


// CONCATENATED MODULE: ./src/lib/Datasources/index.ts



// CONCATENATED MODULE: ./src/lib/cms.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "componentRegistry", function() { return componentRegistry; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentContext", function() { return CmsComponentContext; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentContextContainer", function() { return CmsComponentContext_CmsComponentContextContainer; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentFromContext", function() { return CmsComponentFromContext; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentFromId", function() { return CmsComponentFromId; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentList", function() { return CmsComponentList; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ReactComponent", function() { return ReactComponent; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "BoundReactComponent", function() { return BoundReactComponent; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponent", function() { return CmsComponent; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsStaticComponent", function() { return CmsStaticComponent; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentFromConfig", function() { return CmsComponentFromConfig; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentFromSlot", function() { return CmsComponentFromSlot; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "CmsComponentSlot", function() { return CmsComponentSlot; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "IndexedDatasource", function() { return IndexedDatasource; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "StaticDatasource", function() { return StaticDatasource; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "PropBindingType", function() { return PropBindingType; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "resolveBindingExpression", function() { return resolveBindingExpression; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "resolvePropBindings", function() { return resolvePropBindings; });




// Register all the components
var registry = componentRegistry;
//base components
registry.register("CmsComponentFromConfig", CmsComponentFromConfig);
registry.register("CmsComponent", CmsComponent);
registry.register("CmsStaticComponent", CmsStaticComponent);
//components requiring knowledge of context
registry.register("CmsComponentSlot", CmsComponentSlot);
registry.register("CmsComponentFromSlot", CmsComponentFromSlot);
registry.register("CmsComponentFromContext", CmsComponentFromContext);
registry.register("CmsComponentFromId", CmsComponentFromId);
registry.register("CmsComponentList", CmsComponentList);

//data sources
registry.register("IndexedDatasource", IndexedDatasource);
registry.register("StaticDatasource", StaticDatasource);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = depthSplit

function depthSplit (text, delimiter, opts) {
  var max = opts && opts.max || Infinity
  var includeDelimiters = opts && opts.includeDelimiters || false

  var depth = 0
  var start = 0
  var result = []
  var zones = []

  text.replace(/([\[\(\{])|([\]\)\}])/g, function (current, open, close, offset) {
    if (open) {
      if (depth === 0) {
        zones.push([start, offset])
      }
      depth += 1
    } else if (close) {
      depth -= 1
      if (depth === 0) {
        start = offset + current.length
      }
    }
  })

  if (depth === 0 && start < text.length) {
    zones.push([start, text.length])
  }

  start = 0

  for (var i = 0; i < zones.length && max > 0; i++) {
    for (
      var pos = zones[i][0], match = delimiter.exec(text.slice(pos, zones[i][1]));
      match && max > 1;
      pos += match.index + match[0].length, start = pos, match = delimiter.exec(text.slice(pos, zones[i][1]))
    ) {
      result.push(text.slice(start, match.index + pos))
      if (includeDelimiters) {
        result.push(match[0])
      }
      max -= 1
    }
  }

  if (start < text.length) {
    result.push(text.slice(start))
  }

  return result
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// todo: syntax checking
// todo: test handle args
var depthSplit = __webpack_require__(3)

module.exports = function(query, shouldAssignParamIds){
  if (!query) return []

  var result = []
    , prevChar, char
    , nextChar = query.charAt(0)
    , bStart = 0
    , bEnd = 0
    , partOffset = 0
    , pos = 0
    , depth = 0
    , mode = 'get'
    , deepQuery = null

  // if query contains params then number them
  if (shouldAssignParamIds){
    query = assignParamIds(query)
  }

  var tokens = {
    '.': {mode: 'get'},
    ':': {mode: 'filter'},
    '|': {handle: 'or'},
    '[': {open: 'select'},
    ']': {close: 'select'},
    '{': {open: 'meta'},
    '}': {close: 'meta'},
    '(': {open: 'args'},
    ')': {close: 'args'}
  }

  function push(item){
    if (deepQuery){
      deepQuery.push(item)
    } else {
      result.push(item)
    }
  }

  var handlers = {
    get: function(buffer){
      var trimmed = typeof buffer === 'string' ? buffer.trim() : null
      if (trimmed){
        push({get:trimmed})
      }
    },
    select: function(buffer){
      if (buffer){
        push(tokenizeSelect(buffer))
      } else {
        // deep query override
        var x = {deep: []}
        result.push(x)
        deepQuery = x.deep
      }
    },
    filter: function(buffer){
      if (buffer){
        push({filter:buffer.trim()})
      }
    },
    or: function(){
      deepQuery = null
      result.push({or:true})
      partOffset = i + 1
    },
    args: function(buffer){
      var args = tokenizeArgs(buffer)
      result[result.length-1].args = args
    }
  }

  function handleBuffer(){
    var buffer = query.slice(bStart, bEnd)
    if (handlers[mode]){
      handlers[mode](buffer)
    }
    mode = 'get'
    bStart = bEnd + 1
  }

  for (var i = 0;i < query.length;i++){

    // update char values
    prevChar = char; char = nextChar; nextChar = query.charAt(i + 1);
    pos = i - partOffset

    // root query check
    if (pos === 0 && (char !== ':' && char !== '.')){
      result.push({root:true})
    }

    // parent query check
    if (pos === 0 && (char === '.' && nextChar === '.')){
      result.push({parent:true})
    }

    var token = tokens[char]
    if (token){

      // set mode
      if (depth === 0 && (token.mode || token.open)){
        handleBuffer()
        mode = token.mode || token.open
      }

      if (depth === 0 && token.handle){
        handleBuffer()
        handlers[token.handle]()
      }

      if (token.open){
        depth += 1
      } else if (token.close){
        depth -= 1
      }

      // reset mode to get
      if (depth === 0 && token.close){
        handleBuffer()
      }

    }

    bEnd = i + 1

  }

  handleBuffer()
  return result
}

function tokenizeArgs(argsQuery){
  if (argsQuery === ',') return [',']
  return depthSplit(argsQuery, /,/).map(function(s){
    return handleSelectPart(s.trim())
  })
}

function tokenizeSelect (selectQuery) {
  if (selectQuery === '*') {
    return {
      values: true
    }
  } else if (selectQuery === '**') {
    return {
      values: true,
      deep: true
    }
  }

  var multiple = false
  if (selectQuery.charAt(0) === '*') {
    multiple = true
    selectQuery = selectQuery.slice(1)
  }

  var booleanParts = depthSplit(selectQuery, /&|\|/, { includeDelimiters: true })
  if (booleanParts.length > 1) {
    var result = [
      getSelectPart(booleanParts[0].trim())
    ]
    for (var i = 1; i < booleanParts.length; i += 2) {
      var part = getSelectPart(booleanParts[i + 1].trim())
      if (part) {
        part.booleanOp = booleanParts[i]
        result.push(part)
      }
    }
    return {
      multiple: multiple,
      boolean: true,
      select: result
    }
  } else {
    var result = getSelectPart(selectQuery.trim())
    if (!result) {
      return {
        get: handleSelectPart(selectQuery.trim())
      }
    } else {
      if (multiple) {
        result.multiple = true
      }
      return result
    }
  }
}

function getSelectPart (selectQuery) {
  var parts = depthSplit(selectQuery, /(!)?(=|~|\:|<=|>=|<|>)/, { max: 2, includeDelimiters: true })
  if (parts.length === 3) {
    var negate = parts[1].charAt(0) === '!'
    var key = handleSelectPart(parts[0].trim())
    var result = {
      negate: negate,
      op: negate ? parts[1].slice(1) : parts[1]
    }
    if (result.op === ':') {
      result.select = [key, {_sub: module.exports(':' + parts[2].trim())}]
    } else if (result.op === '~') {
      var value = handleSelectPart(parts[2].trim())
      if (typeof value === 'string') {
        var reDef = parts[2].trim().match(/^\/(.*)\/([a-z]?)$/)
        if (reDef) {
          result.select = [key, new RegExp(reDef[1], reDef[2])]
        } else {
          result.select = [key, value]
        }
      } else {
        result.select = [key, value]
      }
    } else {
      result.select = [key, handleSelectPart(parts[2].trim())]
    }
    return result
  }
}

function isInnerQuery (text) {
  return text.charAt(0) === '{' && text.charAt(text.length-1) === '}'
}

function handleSelectPart(part){
  if (isInnerQuery(part)){
    var innerQuery = part.slice(1, -1)
    return {_sub: module.exports(innerQuery)}
  } else {
    return paramToken(part)
  }
}

function paramToken(text){
  if (text.charAt(0) === '?'){
    var num = parseInt(text.slice(1))
    if (!isNaN(num)){
      return {_param: num}
    } else {
      return text
    }
  } else {
    return text
  }
}



function assignParamIds(query){
  var index = 0
  return query.replace(/\?/g, function(match){
    return match + (index++)
  })
}

function last (array) {
  return array[array.length - 1]
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = State

function State(options, params, handleQuery){

  options = options || {}

  //this.options = options
  this.handleQuery = handleQuery
  this.options = options
  this.locals = this.options.locals || {}
  this.globals = this.options.globals || {}
  this.rootContext = firstNonNull(options.data, options.rootContext, options.context, options.source)
  this.parent = options.parent
  this.override = options.override
  this.filters = options.filters || {}
  this.params = params || options.params || []
  this.context = firstNonNull(options.currentItem, options.context, options.source)
  this.currentItem = firstNonNull(this.context, options.rootContext, options.data)
  this.currentKey = null
  this.currentReferences = []
  this.currentParents = []
}

State.prototype = {

  // current manipulation
  setCurrent: function(key, value){
    if (this.currentItem || this.currentKey || this.currentParents.length>0){
      this.currentParents.push({key: this.currentKey, value: this.currentItem})
    }
    this.currentItem = value
    this.currentKey = key
  },

  resetCurrent: function(){
    this.currentItem = null
    this.currentKey = null
    this.currentParents = []
  },

  force: function(def){
    var parent = this.currentParents[this.currentParents.length-1]
    if (!this.currentItem && parent && (this.currentKey != null)){
      this.currentItem = def || {}
      parent.value[this.currentKey] = this.currentItem
    }
    return !!this.currentItem
  },

  getLocal: function(localName){
    if (~localName.indexOf('/')){
      var result = null
      var parts = localName.split('/')

      for (var i=0;i<parts.length;i++){
        var part = parts[i]
        if (i == 0){
          result = this.locals[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.locals[localName]
    }
  },

  getGlobal: function(globalName){
    if (~globalName.indexOf('/')){
      var result = null
      var parts = globalName.split('/')

      for (var i=0;i<parts.length;i++){
        var part = parts[i]
        if (i == 0){
          result = this.globals[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.globals[globalName]
    }
  },

  getFilter: function(filterName){
    if (~filterName.indexOf('/')){
      var result = null
      var filterParts = filterName.split('/')

      for (var i=0;i<filterParts.length;i++){
        var part = filterParts[i]
        if (i == 0){
          result = this.filters[part]
        } else if (result && result[part]){
          result = result[part]
        }
      }

      return result
    } else {
      return this.filters[filterName]
    }
  },

  addReferences: function(references){
    if (references){
      references.forEach(this.addReference, this)
    }
  },

  addReference: function(ref){
    if (ref instanceof Object && !~this.currentReferences.indexOf(ref)){
      this.currentReferences.push(ref)
    }
  },

  // helper functions
  getValues: function(values, callback){
    return values.map(this.getValue, this)
  },

  getValue: function (value) {
    return this.getValueFrom(value, null)
  },

  getValueFrom: function (value, item) {
    if (value._param != null){
      return this.params[value._param]
    } else if (value._sub){

      var options = copy(this.options)
      options.force = null
      options.currentItem = item

      var result = this.handleQuery(value._sub, options, this.params)
      this.addReferences(result.references)
      return result.value

    } else {
      return value
    }
  },

  deepQuery: function(source, tokens, options, callback){
    var keys = Object.keys(source)

    for (var key in source){
      if (key in source){

        var options = copy(this.options)
        options.currentItem = source[key]

        var result = this.handleQuery(tokens, options, this.params)

        if (result.value){
          return result
        }
      }
    }

    return null
  }

}

function firstNonNull(args){
  for (var i=0;i<arguments.length;i++){
    if (arguments[i] != null){
      return arguments[i]
    }
  }
}

function copy(obj){
  var result = {}
  if (obj){
    for (var key in obj){
      if (key in obj){
        result[key] = obj[key]
      }
    }
  }
  return result
}


/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbXMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2Ntcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jbXMvZXh0ZXJuYWwgXCJyZWFjdFwiIiwid2VicGFjazovL2Ntcy8uL25vZGVfbW9kdWxlcy9qc29uLXF1ZXJ5L2luZGV4LmpzIiwid2VicGFjazovL2Ntcy8uL3NyYy9saWIvQ29tcG9uZW50cy9DbXNDb21wb25lbnRSZWdpc3RyeS50cyIsIndlYnBhY2s6Ly9jbXMvLi9zcmMvbGliL0hlbHBlcnMvUHJvcEJpbmRpbmdIZWxwZXIudHMiLCJ3ZWJwYWNrOi8vY21zLy4vc3JjL2xpYi9Db21wb25lbnRzL0Ntc0NvbXBvbmVudC50c3giLCJ3ZWJwYWNrOi8vY21zLy4vc3JjL2xpYi9Db21wb25lbnRzL0Ntc0NvbXBvbmVudENvbnRleHQudHN4Iiwid2VicGFjazovL2Ntcy8uL3NyYy9saWIvQ29tcG9uZW50cy9DbXNDb21wb25lbnRTbG90LnRzeCIsIndlYnBhY2s6Ly9jbXMvLi9zcmMvbGliL0NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY21zLy4vc3JjL2xpYi9EYXRhc291cmNlcy9JbmRleGVkRGF0YXNvdXJjZS50cyIsIndlYnBhY2s6Ly9jbXMvLi9zcmMvbGliL0RhdGFzb3VyY2VzL1N0YXRpY0RhdGFzb3VyY2UudHMiLCJ3ZWJwYWNrOi8vY21zLy4vc3JjL2xpYi9EYXRhc291cmNlcy9pbmRleC50cyIsIndlYnBhY2s6Ly9jbXMvLi9zcmMvbGliL2Ntcy50cyIsIndlYnBhY2s6Ly9jbXMvLi9ub2RlX21vZHVsZXMvanNvbi1xdWVyeS9saWIvZGVwdGgtc3BsaXQuanMiLCJ3ZWJwYWNrOi8vY21zLy4vbm9kZV9tb2R1bGVzL2pzb24tcXVlcnkvbGliL3Rva2VuaXplLmpzIiwid2VicGFjazovL2Ntcy8uL25vZGVfbW9kdWxlcy9qc29uLXF1ZXJ5L2xpYi9zdGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7OztBQ2xGQSxnRDs7Ozs7O0FDQUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQSxpQkFBaUIsbUJBQW1CO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLFNBQVM7QUFDVDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLHFFQUFxRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQSxXQUFXOztBQUVYOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLG9EQUFvRDtBQUN4SDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDJCQUEyQjtBQUNsRDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixrQkFBa0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUIsb0JBQW9CO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDalJBO0lBQUE7UUFDSSxlQUFVLEdBQTBDLElBQUksR0FBRyxFQUFFO0lBU2pFLENBQUM7SUFQRyxvQ0FBUSxHQUFSLFVBQVMsSUFBWSxFQUFFLFNBQW1DO1FBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxTQUFTLENBQUM7SUFDdkMsQ0FBQztJQUVELCtCQUFHLEdBQUgsVUFBSSxJQUFZO1FBQ1osT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFDcEMsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0FBQztBQUNNLElBQUksaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDOzs7Ozs7Ozs7QUNiaEI7QUFFdkMsSUFBWSxlQUdYO0FBSEQsV0FBWSxlQUFlO0lBQ3ZCLDJEQUFPO0lBQ1AseURBQU07QUFDVixDQUFDLEVBSFcsZUFBZSxLQUFmLGVBQWUsUUFHMUI7QUFVSyxrQ0FBbUMsaUJBQXlCLEVBQUUsT0FBWTtJQUM1RSxJQUFJLE1BQU0sR0FBRyxVQUFTLENBQUMsaUJBQWlCLEVBQUM7UUFDckMsSUFBSSxFQUFFLE9BQU87S0FDaEIsQ0FBQztJQUNGLE9BQU8sTUFBTSxDQUFDLEtBQUs7QUFDdkIsQ0FBQztBQUVELG9CQUFvQixhQUFnQyxFQUFFLE9BQVk7SUFDOUQsUUFBUSxhQUFhLENBQUMsSUFBSSxFQUFFO1FBQ3hCLEtBQUssZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sY0FBTSxvQkFBYSxDQUFDLGlCQUFpQixFQUEvQixDQUErQixDQUFDO1NBQ2hEO1FBQ0QsS0FBSyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUIsT0FBTyxjQUFNLCtCQUF3QixDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsRUFBbEUsQ0FBa0U7U0FDbEY7S0FDSjtBQUNMLENBQUM7QUFFSyw2QkFBOEIsWUFBaUMsRUFBRSxPQUFZO0lBQy9FLElBQUksS0FBSyxHQUEwQixFQUFFO0lBQ3JDLFlBQVksQ0FBQyxPQUFPLENBQUMscUJBQVc7UUFDNUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsR0FBRyxVQUFVLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxFQUFFO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2QzhCO0FBQ3dDO0FBQ2U7QUFPdEYsaUdBQWlHO0FBQzNGLHdCQUF5QixFQUF3STtRQUF2SSxrQ0FBYyxFQUFFLGdCQUFLLEVBQUUsc0JBQVE7SUFDNUQsT0FBTyxnQ0FBbUIsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQztBQUM5RCxDQUFDO0FBRUssNkJBQThCLEVBQTJNO1FBQTFNLGtDQUFjLEVBQUUsOEJBQVksRUFBRSxrQ0FBYyxFQUFFLHNCQUFRLEVBQUUsWUFBRztJQUM1RixJQUFJLENBQUMsY0FBYztRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ2pDLFlBQVksR0FBRyxZQUFZLElBQUksRUFBRSxDQUFDO0lBQ2xDLElBQUksYUFBYSxHQUFHLG1CQUFtQixDQUFDLFlBQVksRUFBRSxjQUFjLElBQUksRUFBRSxDQUFDO0lBQzNFLE9BQU8sY0FBYyxDQUFDLEVBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxLQUFLLGFBQUcsR0FBRyxFQUFFLEdBQUcsSUFBSyxhQUFhLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztBQUNySCxDQUFDO0FBRUQsK0JBQStCLGdCQUFtRDtJQUM5RSxPQUFPLFVBQVMsRUFBdUQ7UUFBckQsOENBQWtCLEVBQUUsMENBQVE7UUFDMUMsSUFBSSxDQUFDLGtCQUFrQjtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ3JDLElBQUksY0FBYyxHQUFHLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxjQUFjO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDakMsT0FBTyxnQkFBZ0IsY0FBTSxLQUFLLElBQUUsY0FBYyxFQUFFLGNBQWMsSUFBRztJQUN6RSxDQUFDO0FBQ0wsQ0FBQztBQUVNLElBQU0sWUFBWSxHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDaEUsSUFBTSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUVsRSxnQ0FBaUMsRUFBMEY7SUFBeEYsc0JBQU0sRUFBRSxrQ0FBYyxFQUFFLGdEQUFRO0lBQ3JFLElBQUksQ0FBQyxNQUFNO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDekIsT0FBTyxZQUFZLGNBQU0sS0FBSyxJQUFHLGtCQUFrQixFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLGNBQWMsSUFBSTtBQUNoSixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQzhCO0FBQzhDO0FBVXRFLElBQU0sbUJBQW1CLEdBQUcsZ0NBQW1CLENBQXVCO0lBQ3pFLElBQUksRUFBRSxFQUFFO0lBQ1IsZUFBZSxFQUFFLEVBQUU7SUFDbkIsT0FBTyxFQUFFLFVBQUMsSUFBWSxFQUFFLE9BQVksSUFBTSxDQUFDO0NBQzlDLENBQUM7QUFFRjtJQUFrRCxnREFBNEU7SUFHMUgsc0NBQVksS0FBNEM7UUFBeEQsWUFDSSxrQkFBTSxLQUFLLENBQUMsU0FtQmY7UUFqQkcsS0FBSSxDQUFDLFVBQVUsR0FBRyxVQUFDLElBQVksRUFBRSxPQUFZO1lBQ3pDLEtBQUksQ0FBQyxRQUFRLENBQUMsbUJBQVM7O2dCQUNuQixJQUFJLFFBQVEsR0FBRztvQkFDWCxJQUFJLGlDQUNHLFNBQVMsQ0FBQyxJQUFJLGVBQ2hCLElBQUksSUFBRyxPQUFPLE1BQ2xCO2lCQUNKO2dCQUNELE9BQU8sUUFBUSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVELEtBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxlQUFlLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDM0UsT0FBTyxFQUFFLEtBQUksQ0FBQyxVQUFVO1lBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsZ0NBQU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUcsQ0FBQyxDQUFDLEVBQUU7U0FDL0Q7O0lBQ0wsQ0FBQztJQUVELDZDQUFNLEdBQU47UUFDSSxPQUFPLENBQ0gsaUNBQUMsbUJBQW1CLENBQUMsUUFBUSxJQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBNkIsSUFDdEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQ1csQ0FDbEM7SUFDTCxDQUFDO0lBQ0wsbUNBQUM7QUFBRCxDQUFDLENBaENpRCw0QkFBZSxHQWdDaEU7O0FBRUssaUNBQWtDLEVBQTZHO0lBQTNHLGdDQUFXLEVBQUUsc0NBQWdCLEVBQUUseUVBQVE7SUFDN0UsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLElBQUksQ0FBQztJQUM5QixJQUFJLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDM0QsT0FBTyxzQkFBc0IsZ0NBQU0sS0FBSyxJQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixJQUFHO0FBQ2pHLENBQUM7QUFFSyw0QkFBOEIsS0FBOEI7SUFDOUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDcEMsT0FBTyxDQUNILGlDQUFDLG1CQUFtQixDQUFDLFFBQVEsUUFDdkIsaUJBQU8sSUFBSSw4QkFBdUIsZ0NBQUssS0FBSyxJQUFFLGdCQUFnQixFQUFFLE9BQU8sSUFBRSxFQUE5RCxDQUE4RCxDQUNoRCxDQUNsQztBQUNMLENBQUM7QUFFSywwQkFBMkIsRUFBNEQ7SUFBM0QsNENBQWlCLEVBQUUsMkRBQVE7SUFDekQsSUFBSSxDQUFDLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sSUFBRSxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFDbkUsT0FBTyxDQUNILGlDQUFDLG1CQUFtQixDQUFDLFFBQVEsUUFDdkIsaUJBQU8sSUFBSSx3QkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFLEVBQUMsR0FBRyxJQUFJLHdDQUFDLHVCQUF1QixJQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBaEYsQ0FBZ0YsQ0FBQyxFQUFsSCxDQUFrSCxDQUNwRyxDQUNsQztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekU4QjtBQUNtRDtBQUMxQjtBQUVsRCw4QkFBK0IsRUFBZ0c7SUFBL0Ysc0JBQU0sRUFBRSxzQ0FBZ0IsRUFBRSxpRUFBUTtJQUNwRSxJQUFJLENBQUMsTUFBTTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQ3pCLElBQUksaUJBQWlCLEdBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLFVBQVEsTUFBUSxDQUFDLENBQUM7SUFDM0UsSUFBSSxDQUFDLGlCQUFpQjtRQUNsQixPQUFPLGlGQUFrQixNQUFNLElBQU0sS0FBSyxFQUFHO0lBQ2pELE9BQU8saUNBQUMsc0JBQXNCLDRCQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLElBQU0sS0FBSyxFQUFJLENBQUM7QUFDOUcsQ0FBQztBQUVLLDBCQUEyQixFQUF1QztJQUFyQyxzQkFBTSxFQUFFLDZDQUFRO0lBQy9DLE9BQU8sQ0FDSCxpQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLFFBQ3ZCLGlCQUFPLElBQUksMkJBQW9CLDJCQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxJQUFLLEtBQUssRUFBRyxFQUE3RSxDQUE2RSxDQUMvRCxDQUNsQztBQUNMLENBQUM7OztBQ2xCcUM7QUFDRDtBQUNQO0FBQ0k7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0hIO0FBUy9CO0lBQXVDLHFEQUF3QztJQUUzRSwyQkFBWSxLQUE4QjtlQUN0QyxrQkFBTSxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUNELDhDQUFrQixHQUFsQixVQUFtQixTQUFrQztRQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksU0FBUyxDQUFDLEtBQUssRUFBRTtZQUMxRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7SUFDTCxDQUFDO0lBRUQseUNBQWEsR0FBYjtRQUNJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzdCLElBQUk7WUFDQSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNqQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7U0FDM0M7UUFBQyxXQUFNO1NBQ1A7SUFDTCxDQUFDO0lBRUssNkNBQWlCLEdBQXZCOzs7OzRCQUNJLHFCQUFNLElBQUksT0FBTyxDQUFDLGlCQUFPLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDOzt3QkFBckQsU0FBcUQ7d0JBQ3JELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7Ozs7S0FDeEI7SUFFRCxrQ0FBTSxHQUFOO1FBQ0ksT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0FBQyxDQTdCc0MsNEJBQWUsR0E2QnJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEM4QjtBQVEvQjtJQUFzQyxtREFBdUM7SUFBN0U7O0lBVUEsQ0FBQztJQVJTLDRDQUFpQixHQUF2Qjs7Ozs0QkFDSSxxQkFBTSxJQUFJLE9BQU8sQ0FBQyxpQkFBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQzs7d0JBQXJELFNBQXFEO3dCQUNyRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7Ozs7S0FDdkQ7SUFFRCxpQ0FBTSxHQUFOO1FBQ0ksT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUNMLHVCQUFDO0FBQUQsQ0FBQyxDQVZxQyw0QkFBZSxHQVVwRDs7OztBQ2xCa0M7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRE47QUFDQztBQUNjO0FBRUQ7QUFFMUMsOEJBQThCO0FBQzlCLElBQUksUUFBUSxHQUFHLGlCQUE0QixDQUFDO0FBRTVDLGlCQUFpQjtBQUNqQixRQUFRLENBQUMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLHNCQUFpQyxDQUFDO0FBQzlFLFFBQVEsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLFlBQXVCLENBQUM7QUFDMUQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBNkIsQ0FBQztBQUV0RSwyQ0FBMkM7QUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxnQkFBMkIsQ0FBQztBQUNsRSxRQUFRLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLG9CQUErQixDQUFDO0FBQzFFLFFBQVEsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEVBQUUsdUJBQWtDLENBQUM7QUFDaEYsUUFBUSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBNkIsQ0FBQztBQUN0RSxRQUFRLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLGdCQUEyQixDQUFDO0FBRXRCO0FBRTVDLGNBQWM7QUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLGlCQUE2QixDQUFDO0FBQ3JFLFFBQVEsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsZ0JBQTRCLENBQUM7Ozs7Ozs7QUN6Qm5FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0IsV0FBVztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxpQkFBaUIsNkJBQTZCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVUsWUFBWTtBQUN0QixVQUFVLGVBQWU7QUFDekIsVUFBVSxhQUFhO0FBQ3ZCLFVBQVUsZUFBZTtBQUN6QixVQUFVLGdCQUFnQjtBQUMxQixNQUFNLElBQUksYUFBYTtBQUN2QixNQUFNLElBQUksY0FBYztBQUN4QixVQUFVLGFBQWE7QUFDdkIsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFlBQVk7QUFDMUI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsY0FBYyxxQkFBcUI7QUFDbkM7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsaUJBQWlCOztBQUVsQztBQUNBLG9CQUFvQixpQkFBaUI7QUFDckM7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixVQUFVO0FBQzdCOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsWUFBWTtBQUMvQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzREFBc0QsMEJBQTBCO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLHlCQUF5QjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpRUFBaUUsa0NBQWtDO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsNENBQTRDO0FBQ3pFLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLHNDQUFzQztBQUNwRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1osR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwUUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDhDQUE4QztBQUM5RTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixxQkFBcUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxlQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY21zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wicmVhY3RcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiY21zXCJdID0gZmFjdG9yeShyZXF1aXJlKFwicmVhY3RcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImNtc1wiXSA9IGZhY3Rvcnkocm9vdFtcInJlYWN0XCJdKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9fMF9fKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX18wX187IiwidmFyIFN0YXRlID0gcmVxdWlyZSgnLi9saWIvc3RhdGUnKVxudmFyIHRva2VuaXplID0gcmVxdWlyZSgnLi9saWIvdG9rZW5pemUnKVxuXG52YXIgdG9rZW5pemVkQ2FjaGUgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGpzb25RdWVyeSAocXVlcnksIG9wdGlvbnMpIHtcblxuICAvLyBleHRyYWN0IHBhcmFtcyBmb3IgWyd0ZXN0W3BhcmFtPT9dJywgJ3ZhbHVlJ10gdHlwZSBxdWVyaWVzXG4gIHZhciBwYXJhbXMgPSBvcHRpb25zICYmIG9wdGlvbnMucGFyYW1zIHx8IG51bGxcbiAgaWYgKEFycmF5LmlzQXJyYXkocXVlcnkpKSB7XG4gICAgcGFyYW1zID0gcXVlcnkuc2xpY2UoMSlcbiAgICBxdWVyeSA9IHF1ZXJ5WzBdXG4gIH1cblxuICBpZiAoIXRva2VuaXplZENhY2hlW3F1ZXJ5XSkge1xuICAgIHRva2VuaXplZENhY2hlW3F1ZXJ5XSA9IHRva2VuaXplKHF1ZXJ5LCB0cnVlKVxuICB9XG5cbiAgcmV0dXJuIGhhbmRsZVF1ZXJ5KHRva2VuaXplZENhY2hlW3F1ZXJ5XSwgb3B0aW9ucywgcGFyYW1zKVxufVxuXG5cbm1vZHVsZS5leHBvcnRzLmxhc3RQYXJlbnQgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgdmFyIGxhc3QgPSBxdWVyeS5wYXJlbnRzW3F1ZXJ5LnBhcmVudHMubGVuZ3RoIC0gMV1cbiAgaWYgKGxhc3QpIHtcbiAgICByZXR1cm4gbGFzdC52YWx1ZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsXG4gIH1cbn1cblxuXG5mdW5jdGlvbiBoYW5kbGVRdWVyeSAodG9rZW5zLCBvcHRpb25zLCBwYXJhbXMpIHtcbiAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKG9wdGlvbnMsIHBhcmFtcywgaGFuZGxlUXVlcnkpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoaGFuZGxlVG9rZW4odG9rZW5zW2ldLCBzdGF0ZSkpIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgLy8gZmx1c2hcbiAgaGFuZGxlVG9rZW4obnVsbCwgc3RhdGUpXG5cbiAgLy8gc2V0IGRhdGFiaW5kIGhvb2tzXG4gIGlmIChzdGF0ZS5jdXJyZW50SXRlbSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgIHN0YXRlLmFkZFJlZmVyZW5jZShzdGF0ZS5jdXJyZW50SXRlbSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgcGFyZW50T2JqZWN0ID0gZ2V0TGFzdFBhcmVudE9iamVjdChzdGF0ZS5jdXJyZW50UGFyZW50cylcbiAgICBpZiAocGFyZW50T2JqZWN0KSB7XG4gICAgICBzdGF0ZS5hZGRSZWZlcmVuY2UocGFyZW50T2JqZWN0KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHN0YXRlLmN1cnJlbnRJdGVtLFxuICAgIGtleTogc3RhdGUuY3VycmVudEtleSxcbiAgICByZWZlcmVuY2VzOiBzdGF0ZS5jdXJyZW50UmVmZXJlbmNlcyxcbiAgICBwYXJlbnRzOiBzdGF0ZS5jdXJyZW50UGFyZW50c1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVRva2VuICh0b2tlbiwgc3RhdGUpIHtcbiAgLy8gc3RhdGU6IHNldEN1cnJlbnQsIGdldFZhbHVlLCBnZXRWYWx1ZXMsIHJlc2V0Q3VycmVudCwgZGVlcFF1ZXJ5LCByb290Q29udGV4dCwgY3VycmVudEl0ZW0sIGN1cnJlbnRLZXksIG9wdGlvbnMsIGZpbHRlcnNcblxuICBpZiAodG9rZW4gPT0gbnVsbCkge1xuICAgIC8vIHByb2Nlc3MgZW5kIG9mIHF1ZXJ5XG4gICAgaWYgKCFzdGF0ZS5jdXJyZW50SXRlbSAmJiBzdGF0ZS5vcHRpb25zLmZvcmNlKSB7XG4gICAgICBzdGF0ZS5mb3JjZShzdGF0ZS5vcHRpb25zLmZvcmNlKVxuICAgIH1cbiAgfSBlbHNlIGlmICh0b2tlbi52YWx1ZXMpIHtcbiAgICBpZiAoc3RhdGUuY3VycmVudEl0ZW0pIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3RhdGUuY3VycmVudEl0ZW0pXG4gICAgICB2YXIgdmFsdWVzID0gW11cbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICh0b2tlbi5kZWVwICYmIEFycmF5LmlzQXJyYXkoc3RhdGUuY3VycmVudEl0ZW1ba2V5XSkpIHtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50SXRlbVtrZXldLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhbHVlcy5wdXNoKGl0ZW0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZXMucHVzaChzdGF0ZS5jdXJyZW50SXRlbVtrZXldKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgc3RhdGUuc2V0Q3VycmVudChrZXlzLCB2YWx1ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnNldEN1cnJlbnQoa2V5cywgW10pXG4gICAgfVxuICB9IGVsc2UgaWYgKHRva2VuLmdldCkge1xuICAgIHZhciBrZXkgPSBzdGF0ZS5nZXRWYWx1ZSh0b2tlbi5nZXQpXG4gICAgaWYgKHNob3VsZE92ZXJyaWRlKHN0YXRlLCBrZXkpKSB7XG4gICAgICBzdGF0ZS5zZXRDdXJyZW50KGtleSwgc3RhdGUub3ZlcnJpZGVba2V5XSlcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXRlLmN1cnJlbnRJdGVtIHx8IChzdGF0ZS5vcHRpb25zLmZvcmNlICYmIHN0YXRlLmZvcmNlKHt9KSkpIHtcbiAgICAgICAgaWYgKGlzRGVlcEFjY2Vzc29yKHN0YXRlLmN1cnJlbnRJdGVtLCBrZXkpIHx8IHRva2VuLm11bHRpcGxlKSB7XG4gICAgICAgICAgdmFyIHZhbHVlcyA9IHN0YXRlLmN1cnJlbnRJdGVtLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1ba2V5XVxuICAgICAgICAgIH0pLmZpbHRlcihpc0RlZmluZWQpXG5cbiAgICAgICAgICB2YWx1ZXMgPSBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCB2YWx1ZXMpIC8vIGZsYXR0ZW5cblxuICAgICAgICAgIHN0YXRlLnNldEN1cnJlbnQoa2V5LCB2YWx1ZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhdGUuc2V0Q3VycmVudChrZXksIHN0YXRlLmN1cnJlbnRJdGVtW2tleV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnNldEN1cnJlbnQoa2V5LCBudWxsKVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0b2tlbi5zZWxlY3QpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdGF0ZS5jdXJyZW50SXRlbSkgfHwgKHN0YXRlLm9wdGlvbnMuZm9yY2UgJiYgc3RhdGUuZm9yY2UoW10pKSkge1xuICAgICAgdmFyIG1hdGNoID0gKHRva2VuLmJvb2xlYW4gPyB0b2tlbi5zZWxlY3QgOiBbdG9rZW5dKS5tYXAoZnVuY3Rpb24gKHBhcnQpIHtcbiAgICAgICAgaWYgKHBhcnQub3AgPT09ICc6Jykge1xuICAgICAgICAgIHZhciBrZXkgPSBzdGF0ZS5nZXRWYWx1ZShwYXJ0LnNlbGVjdFswXSlcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnVuYzogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtW2tleV1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gc3RhdGUuZ2V0VmFsdWVGcm9tKHBhcnQuc2VsZWN0WzFdLCBpdGVtKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG5lZ2F0ZTogcGFydC5uZWdhdGUsXG4gICAgICAgICAgICBib29sZWFuT3A6IHBhcnQuYm9vbGVhbk9wXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWxlY3RvciA9IHN0YXRlLmdldFZhbHVlcyhwYXJ0LnNlbGVjdClcbiAgICAgICAgICBpZiAoIXN0YXRlLm9wdGlvbnMuYWxsb3dSZWdleHAgJiYgcGFydC5vcCA9PT0gJ34nICYmIHNlbGVjdG9yWzFdIGluc3RhbmNlb2YgUmVnRXhwKSB0aHJvdyBuZXcgRXJyb3IoJ29wdGlvbnMuYWxsb3dSZWdleHAgaXMgbm90IGVuYWJsZWQuJylcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAga2V5OiBzZWxlY3RvclswXSxcbiAgICAgICAgICAgIHZhbHVlOiBzZWxlY3RvclsxXSxcbiAgICAgICAgICAgIG5lZ2F0ZTogcGFydC5uZWdhdGUsXG4gICAgICAgICAgICBib29sZWFuT3A6IHBhcnQuYm9vbGVhbk9wLFxuICAgICAgICAgICAgb3A6IHBhcnQub3BcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGlmICh0b2tlbi5tdWx0aXBsZSkge1xuICAgICAgICB2YXIga2V5cyA9IFtdXG4gICAgICAgIHZhciB2YWx1ZSA9IFtdXG4gICAgICAgIHN0YXRlLmN1cnJlbnRJdGVtLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICBpZiAobWF0Y2hlcyhpdGVtLCBtYXRjaCkpIHtcbiAgICAgICAgICAgIGtleXMucHVzaChpKVxuICAgICAgICAgICAgdmFsdWUucHVzaChpdGVtKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgc3RhdGUuc2V0Q3VycmVudChrZXlzLCB2YWx1ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghc3RhdGUuY3VycmVudEl0ZW0uc29tZShmdW5jdGlvbiAoaXRlbSwgaSkge1xuICAgICAgICAgIGlmIChtYXRjaGVzKGl0ZW0sIG1hdGNoKSkge1xuICAgICAgICAgICAgc3RhdGUuc2V0Q3VycmVudChpLCBpdGVtKVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgc3RhdGUuc2V0Q3VycmVudChudWxsLCBudWxsKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnNldEN1cnJlbnQobnVsbCwgbnVsbClcbiAgICB9XG4gIH0gZWxzZSBpZiAodG9rZW4ucm9vdCkge1xuICAgIHN0YXRlLnJlc2V0Q3VycmVudCgpXG4gICAgaWYgKHRva2VuLmFyZ3MgJiYgdG9rZW4uYXJncy5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLnNldEN1cnJlbnQobnVsbCwgc3RhdGUuZ2V0VmFsdWUodG9rZW4uYXJnc1swXSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnNldEN1cnJlbnQobnVsbCwgc3RhdGUucm9vdENvbnRleHQpXG4gICAgfVxuICB9IGVsc2UgaWYgKHRva2VuLnBhcmVudCkge1xuICAgIHN0YXRlLnJlc2V0Q3VycmVudCgpXG4gICAgc3RhdGUuc2V0Q3VycmVudChudWxsLCBzdGF0ZS5vcHRpb25zLnBhcmVudClcbiAgfSBlbHNlIGlmICh0b2tlbi5vcikge1xuICAgIGlmIChzdGF0ZS5jdXJyZW50SXRlbSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucmVzZXRDdXJyZW50KClcbiAgICAgIHN0YXRlLnNldEN1cnJlbnQobnVsbCwgc3RhdGUuY29udGV4dClcbiAgICB9XG4gIH0gZWxzZSBpZiAodG9rZW4uZmlsdGVyKSB7XG4gICAgdmFyIGhlbHBlciA9IHN0YXRlLmdldExvY2FsKHRva2VuLmZpbHRlcikgfHwgc3RhdGUuZ2V0R2xvYmFsKHRva2VuLmZpbHRlcilcbiAgICBpZiAodHlwZW9mIGhlbHBlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gZnVuY3Rpb24oaW5wdXQsIGFyZ3MuLi4pXG4gICAgICB2YXIgdmFsdWVzID0gc3RhdGUuZ2V0VmFsdWVzKHRva2VuLmFyZ3MgfHwgW10pXG4gICAgICB2YXIgcmVzdWx0ID0gaGVscGVyLmFwcGx5KHN0YXRlLm9wdGlvbnMsIFtzdGF0ZS5jdXJyZW50SXRlbV0uY29uY2F0KHZhbHVlcykpXG4gICAgICBzdGF0ZS5zZXRDdXJyZW50KG51bGwsIHJlc3VsdClcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZmFsbGJhY2sgdG8gb2xkIGZpbHRlcnNcbiAgICAgIHZhciBmaWx0ZXIgPSBzdGF0ZS5nZXRGaWx0ZXIodG9rZW4uZmlsdGVyKVxuICAgICAgaWYgKHR5cGVvZiBmaWx0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IHN0YXRlLmdldFZhbHVlcyh0b2tlbi5hcmdzIHx8IFtdKVxuICAgICAgICB2YXIgcmVzdWx0ID0gZmlsdGVyLmNhbGwoc3RhdGUub3B0aW9ucywgc3RhdGUuY3VycmVudEl0ZW0sIHthcmdzOiB2YWx1ZXMsIHN0YXRlOiBzdGF0ZSwgZGF0YTogc3RhdGUucm9vdENvbnRleHR9KVxuICAgICAgICBzdGF0ZS5zZXRDdXJyZW50KG51bGwsIHJlc3VsdClcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodG9rZW4uZGVlcCkge1xuICAgIGlmIChzdGF0ZS5jdXJyZW50SXRlbSkge1xuICAgICAgaWYgKHRva2VuLmRlZXAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB2YXIgcmVzdWx0ID0gc3RhdGUuZGVlcFF1ZXJ5KHN0YXRlLmN1cnJlbnRJdGVtLCB0b2tlbi5kZWVwLCBzdGF0ZS5vcHRpb25zKVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBzdGF0ZS5zZXRDdXJyZW50KHJlc3VsdC5rZXksIHJlc3VsdC52YWx1ZSlcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQucGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHN0YXRlLmN1cnJlbnRQYXJlbnRzLnB1c2gocmVzdWx0LnBhcmVudHNbaV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnNldEN1cnJlbnQobnVsbCwgbnVsbClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUuY3VycmVudEl0ZW0gPSBudWxsXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKGl0ZW0sIHBhcnRzKSB7XG4gIHZhciByZXN1bHQgPSBmYWxzZVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG9wdHMgPSBwYXJ0c1tpXVxuICAgIHZhciByID0gZmFsc2VcbiAgICBpZiAob3B0cy5mdW5jKSB7XG4gICAgICByID0gb3B0cy5mdW5jKGl0ZW0pXG4gICAgfSBlbHNlIGlmIChvcHRzLm9wID09PSAnficpIHtcbiAgICAgIGlmIChvcHRzLnZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgIHIgPSBpdGVtW29wdHMua2V5XSAmJiAhIWl0ZW1bb3B0cy5rZXldLm1hdGNoKG9wdHMudmFsdWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gaXRlbVtvcHRzLmtleV0gJiYgISF+aXRlbVtvcHRzLmtleV0uaW5kZXhPZihvcHRzLnZhbHVlKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3B0cy5vcCA9PT0gJz0nKSB7XG4gICAgICBpZiAoKGl0ZW1bb3B0cy5rZXldID09PSB0cnVlICYmIG9wdHMudmFsdWUgPT09ICd0cnVlJykgfHwgKGl0ZW1bb3B0cy5rZXldID09PSBmYWxzZSAmJiBvcHRzLnZhbHVlID09PSAnZmFsc2UnKSkge1xuICAgICAgICByID0gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgciA9IGl0ZW1bb3B0cy5rZXldID09IG9wdHMudmFsdWVcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdHMub3AgPT09ICc+Jykge1xuICAgICAgciA9IGl0ZW1bb3B0cy5rZXldID4gb3B0cy52YWx1ZVxuICAgIH0gZWxzZSBpZiAob3B0cy5vcCA9PT0gJzwnKSB7XG4gICAgICByID0gaXRlbVtvcHRzLmtleV0gPCBvcHRzLnZhbHVlXG4gICAgfSBlbHNlIGlmIChvcHRzLm9wID09PSAnPj0nKSB7XG4gICAgICByID0gaXRlbVtvcHRzLmtleV0gPj0gb3B0cy52YWx1ZVxuICAgIH0gZWxzZSBpZiAob3B0cy5vcCA9PT0gJzw9Jykge1xuICAgICAgciA9IGl0ZW1bb3B0cy5rZXldIDw9IG9wdHMudmFsdWVcbiAgICB9XG5cbiAgICBpZiAob3B0cy5uZWdhdGUpIHtcbiAgICAgIHIgPSAhclxuICAgIH1cbiAgICBpZiAob3B0cy5ib29sZWFuT3AgPT09ICcmJykge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ICYmIHJcbiAgICB9IGVsc2UgaWYgKG9wdHMuYm9vbGVhbk9wID09PSAnfCcpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCByXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHJcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGlzRGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJ1xufVxuXG5mdW5jdGlvbiBzaG91bGRPdmVycmlkZSAoc3RhdGUsIGtleSkge1xuICByZXR1cm4gc3RhdGUub3ZlcnJpZGUgJiYgc3RhdGUuY3VycmVudEl0ZW0gPT09IHN0YXRlLnJvb3RDb250ZXh0ICYmIHN0YXRlLm92ZXJyaWRlW2tleV0gIT09IHVuZGVmaW5lZFxufVxuXG5mdW5jdGlvbiBpc0RlZXBBY2Nlc3NvciAoY3VycmVudEl0ZW0sIGtleSkge1xuICByZXR1cm4gY3VycmVudEl0ZW0gaW5zdGFuY2VvZiBBcnJheSAmJiBwYXJzZUludChrZXkpICE9IGtleVxufVxuXG5mdW5jdGlvbiBnZXRMYXN0UGFyZW50T2JqZWN0IChwYXJlbnRzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGlmICghKHBhcmVudHNbaSArIDFdKSB8fCAhKHBhcmVudHNbaSArIDFdLnZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuICAgICAgcmV0dXJuIHBhcmVudHNbaV0udmFsdWVcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiXHJcblxyXG5jbGFzcyBDb21wb25lbnRSZWdpc3RyeSAge1xyXG4gICAgY29tcG9uZW50czogTWFwPHN0cmluZywgUmVhY3QuQ29tcG9uZW50VHlwZTxhbnk+PiA9IG5ldyBNYXAoKVxyXG5cclxuICAgIHJlZ2lzdGVyKG5hbWU6IHN0cmluZywgY29tcG9uZW50OiBSZWFjdC5Db21wb25lbnRUeXBlPGFueT4pIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHMuc2V0KG5hbWUsY29tcG9uZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGdldChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzLmdldChuYW1lKVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB2YXIgY29tcG9uZW50UmVnaXN0cnkgPSBuZXcgQ29tcG9uZW50UmVnaXN0cnkoKTtcclxuIiwiaW1wb3J0ICogYXMgSnNvblF1ZXJ5IGZyb20gJ2pzb24tcXVlcnknXHJcblxyXG5leHBvcnQgZW51bSBQcm9wQmluZGluZ1R5cGUge1xyXG4gICAgRHluYW1pYyxcclxuICAgIFN0YXRpY1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFByb3BCaW5kaW5nQ29uZmlnIHtcclxuICAgIHR5cGU6IFByb3BCaW5kaW5nVHlwZVxyXG4gICAgcHJvcGVydHlOYW1lOiBzdHJpbmdcclxuICAgIGJpbmRpbmdFeHByZXNzaW9uOiBzdHJpbmdcclxufVxyXG5cclxudHlwZSBCaW5kaW5nID0gKCkgPT4gYW55XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZUJpbmRpbmdFeHByZXNzaW9uKGJpbmRpbmdFeHByZXNzaW9uOiBzdHJpbmcsIGNvbnRleHQ6IGFueSkge1xyXG4gICAgdmFyIHJlc3VsdCA9IEpzb25RdWVyeShiaW5kaW5nRXhwcmVzc2lvbix7XHJcbiAgICAgICAgZGF0YTogY29udGV4dFxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHQudmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0QmluZGluZyhiaW5kaW5nQ29uZmlnOiBQcm9wQmluZGluZ0NvbmZpZywgY29udGV4dDogYW55KTogQmluZGluZyB7XHJcbiAgICBzd2l0Y2ggKGJpbmRpbmdDb25maWcudHlwZSkge1xyXG4gICAgICAgIGNhc2UgUHJvcEJpbmRpbmdUeXBlLlN0YXRpYzoge1xyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gYmluZGluZ0NvbmZpZy5iaW5kaW5nRXhwcmVzc2lvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FzZSBQcm9wQmluZGluZ1R5cGUuRHluYW1pYzoge1xyXG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gcmVzb2x2ZUJpbmRpbmdFeHByZXNzaW9uKGJpbmRpbmdDb25maWcuYmluZGluZ0V4cHJlc3Npb24sIGNvbnRleHQpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVByb3BCaW5kaW5ncyhwcm9wQmluZGluZ3M6IFByb3BCaW5kaW5nQ29uZmlnW10sIGNvbnRleHQ6IGFueSk6IGFueSB7XHJcbiAgICB2YXIgcHJvcHM6e1tpbmRleDogc3RyaW5nXTogYW55fSA9IHt9XHJcbiAgICBwcm9wQmluZGluZ3MuZm9yRWFjaChwcm9wQmluZGluZyA9PiB7XHJcbiAgICAgICAgcHJvcHNbcHJvcEJpbmRpbmcucHJvcGVydHlOYW1lXSA9IGdldEJpbmRpbmcocHJvcEJpbmRpbmcsIGNvbnRleHQpKClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHByb3BzO1xyXG59XHJcblxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGNvbXBvbmVudFJlZ2lzdHJ5IH0gZnJvbSAnLi4vQ29tcG9uZW50cy9DbXNDb21wb25lbnRSZWdpc3RyeSc7XHJcbmltcG9ydCB7IHJlc29sdmVQcm9wQmluZGluZ3MsIFByb3BCaW5kaW5nQ29uZmlnIH0gZnJvbSAnLi4vSGVscGVycy9Qcm9wQmluZGluZ0hlbHBlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDbXNDb21wb25lbnRDb25maWcge1xyXG4gICAgY2xhc3NOYW1lOiBzdHJpbmdcclxuICAgIHByb3BCaW5kaW5nczogUHJvcEJpbmRpbmdDb25maWdbXVxyXG59XHJcblxyXG4vL3Jlc29sdmVzIHRoZSBjb21wb25lbnRDbGFzcyBhZ2FpbnN0IHNldCBvZiByZWdpc3RlcmVkIHdpZGdldHMgYW5kIGluc3RhbmNlcyBpdCB3aXRoIGdpdmVuIHByb3BzXHJcbmV4cG9ydCBmdW5jdGlvbiBSZWFjdENvbXBvbmVudCh7Y29tcG9uZW50Q2xhc3MsIHByb3BzLCBjaGlsZHJlbn06IHtjb21wb25lbnRDbGFzczogUmVhY3QuQ29tcG9uZW50VHlwZTxhbnk+LCBwcm9wczoge1tpbmRleDogc3RyaW5nXTogYW55fSwgY2hpbGRyZW4/OiBSZWFjdC5SZWFjdE5vZGV9KSB7XHJcbiAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGNvbXBvbmVudENsYXNzLCBwcm9wcywgY2hpbGRyZW4pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBCb3VuZFJlYWN0Q29tcG9uZW50KHtjb21wb25lbnRDbGFzcywgcHJvcEJpbmRpbmdzLCBiaW5kaW5nQ29udGV4dCwgY2hpbGRyZW4sIGtleX06ICB7Y29tcG9uZW50Q2xhc3M6IFJlYWN0LkNvbXBvbmVudFR5cGU8YW55PiwgcHJvcEJpbmRpbmdzPzogUHJvcEJpbmRpbmdDb25maWdbXSwgYmluZGluZ0NvbnRleHQ/OiBhbnksIGNoaWxkcmVuPzogUmVhY3QuUmVhY3ROb2RlLCBrZXk/OiBhbnl9KSB7XHJcbiAgICBpZiAoIWNvbXBvbmVudENsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgIHByb3BCaW5kaW5ncyA9IHByb3BCaW5kaW5ncyB8fCBbXTtcclxuICAgIHZhciByZXNvbHZlZFByb3BzID0gcmVzb2x2ZVByb3BCaW5kaW5ncyhwcm9wQmluZGluZ3MsIGJpbmRpbmdDb250ZXh0IHx8IHt9KVxyXG4gICAgcmV0dXJuIFJlYWN0Q29tcG9uZW50KHtjb21wb25lbnRDbGFzczogY29tcG9uZW50Q2xhc3MsIHByb3BzOiB7a2V5OiBrZXksIC4uLnJlc29sdmVkUHJvcHN9LCBjaGlsZHJlbjogY2hpbGRyZW59KTtcclxufVxyXG5cclxuZnVuY3Rpb24gUmVzb2x2ZUNvbXBvbmVudENsYXNzKHdyYXBwZWRDb21wb25lbnQ6IFJlYWN0LlNGQzx7W2luZGV4OiBzdHJpbmddOiBhbnl9Pikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHsgY29tcG9uZW50Q2xhc3NOYW1lLCAuLi5wcm9wcyB9OntbaW5kZXg6IHN0cmluZ106IGFueX0pIHtcclxuICAgICAgICBpZiAoIWNvbXBvbmVudENsYXNzTmFtZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgdmFyIGNvbXBvbmVudENsYXNzID0gY29tcG9uZW50UmVnaXN0cnkuZ2V0KGNvbXBvbmVudENsYXNzTmFtZSk7XHJcbiAgICAgICAgaWYgKCFjb21wb25lbnRDbGFzcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIHdyYXBwZWRDb21wb25lbnQoeyAuLi5wcm9wcywgY29tcG9uZW50Q2xhc3M6IGNvbXBvbmVudENsYXNzIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBDbXNDb21wb25lbnQgPSBSZXNvbHZlQ29tcG9uZW50Q2xhc3MoQm91bmRSZWFjdENvbXBvbmVudCk7XHJcbmV4cG9ydCBjb25zdCBDbXNTdGF0aWNDb21wb25lbnQgPSBSZXNvbHZlQ29tcG9uZW50Q2xhc3MoUmVhY3RDb21wb25lbnQpO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIENtc0NvbXBvbmVudEZyb21Db25maWcoeyBjb25maWcsIGJpbmRpbmdDb250ZXh0LCAuLi5wcm9wcyB9OiB7IGNvbmZpZzogSUNtc0NvbXBvbmVudENvbmZpZywgYmluZGluZ0NvbnRleHQ6IGFueSB9KSB7XHJcbiAgICBpZiAoIWNvbmZpZykgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gQ21zQ29tcG9uZW50KHsgLi4ucHJvcHMsICBjb21wb25lbnRDbGFzc05hbWU6IGNvbmZpZy5jbGFzc05hbWUsIHByb3BCaW5kaW5nczogY29uZmlnLnByb3BCaW5kaW5ncywgYmluZGluZ0NvbnRleHQ6IGJpbmRpbmdDb250ZXh0ICB9KVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBJQ21zQ29tcG9uZW50Q29uZmlnLCBDbXNDb21wb25lbnRGcm9tQ29uZmlnIH0gZnJvbSBcIi4vQ21zQ29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgdHlwZSBDb250ZXh0RGF0YSA9IHtbaW5kZXg6IHN0cmluZ106IGFueSB9XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDbXNDb21wb25lbnRDb250ZXh0IHtcclxuICAgIGRhdGE6IENvbnRleHREYXRhXHJcbiAgICBjb21wb25lbnRDb25maWc6IHtbaW5kZXg6IHN0cmluZ106IElDbXNDb21wb25lbnRDb25maWcgfVxyXG4gICAgc2V0RGF0YShuYW1lOiBzdHJpbmcsIG5ld0RhdGE6IGFueSk6IHZvaWRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IENtc0NvbXBvbmVudENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0PElDbXNDb21wb25lbnRDb250ZXh0Pih7XHJcbiAgICBkYXRhOiB7fSxcclxuICAgIGNvbXBvbmVudENvbmZpZzoge30sXHJcbiAgICBzZXREYXRhOiAobmFtZTogc3RyaW5nLCBuZXdEYXRhOiBhbnkpID0+IHt9XHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgQ21zQ29tcG9uZW50Q29udGV4dENvbnRhaW5lciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx7IGJhc2VDb250ZXh0OiBJQ21zQ29tcG9uZW50Q29udGV4dCB9LCBJQ21zQ29tcG9uZW50Q29udGV4dD4ge1xyXG4gICAgdXBkYXRlRGF0YToobmFtZTogc3RyaW5nLCBuZXdEYXRhOiBhbnkpID0+IHZvaWRcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogeyBiYXNlQ29udGV4dDogSUNtc0NvbXBvbmVudENvbnRleHQgfSkge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVEYXRhID0gKG5hbWU6IHN0cmluZywgbmV3RGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdzdGF0ZSA9IHsgXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogeyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucHJldlN0YXRlLmRhdGEsIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmFtZV06IG5ld0RhdGFcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3c3RhdGU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBjb21wb25lbnRDb25maWc6IHByb3BzLmJhc2VDb250ZXh0ID8gcHJvcHMuYmFzZUNvbnRleHQuY29tcG9uZW50Q29uZmlnIDoge30sXHJcbiAgICAgICAgICAgIHNldERhdGE6IHRoaXMudXBkYXRlRGF0YSxcclxuICAgICAgICAgICAgZGF0YTogcHJvcHMuYmFzZUNvbnRleHQgPyB7IC4uLnByb3BzLmJhc2VDb250ZXh0LmRhdGEgfSA6IHt9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Q21zQ29tcG9uZW50Q29udGV4dC5Qcm92aWRlciB2YWx1ZT17dGhpcy5zdGF0ZSBhcyBJQ21zQ29tcG9uZW50Q29udGV4dH0+XHJcbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICAgICAgICA8L0Ntc0NvbXBvbmVudENvbnRleHQuUHJvdmlkZXI+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ21zQ29tcG9uZW50RnJvbUNvbnRleHQoeyBjb21wb25lbnRJZCwgY29tcG9uZW50Q29udGV4dCwgLi4ucHJvcHMgfSA6IHsgY29tcG9uZW50SWQ6IHN0cmluZywgY29tcG9uZW50Q29udGV4dDogSUNtc0NvbXBvbmVudENvbnRleHQgfSkge1xyXG4gICAgaWYgKCFjb21wb25lbnRJZCkgcmV0dXJuIG51bGw7XHJcbiAgICB2YXIgY29uZmlnID0gY29tcG9uZW50Q29udGV4dC5jb21wb25lbnRDb25maWdbY29tcG9uZW50SWRdO1xyXG4gICAgcmV0dXJuIENtc0NvbXBvbmVudEZyb21Db25maWcoeyAuLi5wcm9wcywgY29uZmlnOiBjb25maWcsIGJpbmRpbmdDb250ZXh0OiBjb21wb25lbnRDb250ZXh0IH0pXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDbXNDb21wb25lbnRGcm9tSWQoIHByb3BzOiB7IGNvbXBvbmVudElkOiBzdHJpbmcgfSkge1xyXG4gICAgaWYgKCFwcm9wcy5jb21wb25lbnRJZCkgcmV0dXJuIG51bGw7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxDbXNDb21wb25lbnRDb250ZXh0LkNvbnN1bWVyPlxyXG4gICAgICAgICAgICB7IGNvbnRleHQgPT4gQ21zQ29tcG9uZW50RnJvbUNvbnRleHQoey4uLnByb3BzLCBjb21wb25lbnRDb250ZXh0OiBjb250ZXh0fSl9XHJcbiAgICAgICAgPC9DbXNDb21wb25lbnRDb250ZXh0LkNvbnN1bWVyPlxyXG4gICAgKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ21zQ29tcG9uZW50TGlzdCh7Y2hpbGRDb21wb25lbnRJZHMsIC4uLnByb3BzfToge2NoaWxkQ29tcG9uZW50SWRzOiBzdHJpbmdbXX0pIHtcclxuICAgIGlmICghY2hpbGRDb21wb25lbnRJZHMgfHwgY2hpbGRDb21wb25lbnRJZHMubGVuZ3RoPT0wKSByZXR1cm4gbnVsbDtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPENtc0NvbXBvbmVudENvbnRleHQuQ29uc3VtZXI+XHJcbiAgICAgICAgICAgIHsgY29udGV4dCA9PiBjaGlsZENvbXBvbmVudElkcy5tYXAoKGlkLGlkeCk9PiA8Q21zQ29tcG9uZW50RnJvbUNvbnRleHQgY29tcG9uZW50SWQ9e2lkfSBjb21wb25lbnRDb250ZXh0PXtjb250ZXh0fSBrZXk9e2lkeH0vPil9XHJcbiAgICAgICAgPC9DbXNDb21wb25lbnRDb250ZXh0LkNvbnN1bWVyPlxyXG4gICAgKVxyXG59XHJcblxyXG4iLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IENtc0NvbXBvbmVudENvbnRleHQsIElDbXNDb21wb25lbnRDb250ZXh0IH0gZnJvbSBcIi4vQ21zQ29tcG9uZW50Q29udGV4dFwiO1xyXG5pbXBvcnQgeyBDbXNDb21wb25lbnRGcm9tQ29uZmlnIH0gZnJvbSBcIi4vQ21zQ29tcG9uZW50XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ21zQ29tcG9uZW50RnJvbVNsb3Qoe3Nsb3RJZCwgY29tcG9uZW50Q29udGV4dCwgLi4ucHJvcHN9IDoge3Nsb3RJZDogc3RyaW5nLCBjb21wb25lbnRDb250ZXh0OiBJQ21zQ29tcG9uZW50Q29udGV4dCB9KSB7XHJcbiAgICBpZiAoIXNsb3RJZCkgcmV0dXJuIG51bGw7XHJcbiAgICB2YXIgY29tcG9uZW50VG9SZW5kZXIgPSBjb21wb25lbnRDb250ZXh0LmNvbXBvbmVudENvbmZpZ1tgc2xvdC8ke3Nsb3RJZH1gXTtcclxuICAgIGlmICghY29tcG9uZW50VG9SZW5kZXIpIFxyXG4gICAgICAgIHJldHVybiA8ZGl2IGRhdGEtc2xvdGlkPXtzbG90SWR9IHsuLi5wcm9wc30vPlxyXG4gICAgcmV0dXJuIDxDbXNDb21wb25lbnRGcm9tQ29uZmlnIGNvbmZpZz17Y29tcG9uZW50VG9SZW5kZXJ9IGJpbmRpbmdDb250ZXh0PXtjb21wb25lbnRDb250ZXh0fSB7Li4ucHJvcHN9IC8+O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQ21zQ29tcG9uZW50U2xvdCh7IHNsb3RJZCwgLi4ucHJvcHMgfTp7IHNsb3RJZDogc3RyaW5nIH0pIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPENtc0NvbXBvbmVudENvbnRleHQuQ29uc3VtZXI+XHJcbiAgICAgICAgICAgIHsgY29udGV4dCA9PiBDbXNDb21wb25lbnRGcm9tU2xvdCh7IHNsb3RJZDogc2xvdElkLCBjb21wb25lbnRDb250ZXh0OiBjb250ZXh0LCAuLi5wcm9wcyB9KX1cclxuICAgICAgICA8L0Ntc0NvbXBvbmVudENvbnRleHQuQ29uc3VtZXI+XHJcbiAgICApXHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSBcIi4vQ21zQ29tcG9uZW50UmVnaXN0cnlcIlxyXG5leHBvcnQgKiBmcm9tIFwiLi9DbXNDb21wb25lbnRDb250ZXh0XCJcclxuZXhwb3J0ICogZnJvbSBcIi4vQ21zQ29tcG9uZW50XCJcclxuZXhwb3J0ICogZnJvbSBcIi4vQ21zQ29tcG9uZW50U2xvdFwiXHJcblxyXG5cclxuIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcblxyXG5pbnRlcmZhY2UgSUluZGV4ZWREYXRhc291cmNlUHJvcHMge1xyXG4gICAgc2V0RGF0YShuYW1lOiBzdHJpbmcsIG5ld0RhdGE6IGFueSk6IHZvaWRcclxuICAgIGRhdGE6IGFueVxyXG4gICAgaW5kZXg6IGFueVxyXG4gICAgbmFtZTogc3RyaW5nXHJcbn0gXHJcblxyXG5leHBvcnQgY2xhc3MgSW5kZXhlZERhdGFzb3VyY2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8SUluZGV4ZWREYXRhc291cmNlUHJvcHM+e1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wczogSUluZGV4ZWREYXRhc291cmNlUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcylcclxuICAgIH1cclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHM6IElJbmRleGVkRGF0YXNvdXJjZVByb3BzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMuZGF0YSAhPSBwcmV2UHJvcHMuZGF0YSB8fCB0aGlzLnByb3BzLmluZGV4ICE9IHByZXZQcm9wcy5pbmRleCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUNvbnRleHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlQ29udGV4dCgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucHJvcHMuZGF0YTtcclxuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnByb3BzLmluZGV4O1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSBkYXRhID8gZGF0YVtpbmRleF0gOiB7fVxyXG4gICAgICAgICAgICB0aGlzLnByb3BzLnNldERhdGEodGhpcy5wcm9wcy5uYW1lLCB2YWwpXHJcbiAgICAgICAgfSBjYXRjaCB7ICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZT0+IHtzZXRUaW1lb3V0KHJlc29sdmUsIDEpfSlcclxuICAgICAgICB0aGlzLnVwZGF0ZUNvbnRleHQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbiIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5cclxuaW50ZXJmYWNlIElTdGF0aWNEYXRhc291cmNlUHJvcHMge1xyXG4gICAgc2V0RGF0YShuYW1lOiBzdHJpbmcsIG5ld0RhdGE6IGFueSk6IHZvaWRcclxuICAgIGRhdGE6IGFueVxyXG4gICAgbmFtZTogc3RyaW5nXHJcbn0gXHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGljRGF0YXNvdXJjZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxJU3RhdGljRGF0YXNvdXJjZVByb3BzPntcclxuXHJcbiAgICBhc3luYyBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlPT4ge3NldFRpbWVvdXQocmVzb2x2ZSwgMSl9KVxyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0RGF0YSh0aGlzLnByb3BzLm5hbWUsIHRoaXMucHJvcHMuZGF0YSlcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKTogSlNYLkVsZW1lbnQge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICB9XHJcbn1cclxuXHJcbiIsImV4cG9ydCAqIGZyb20gXCIuL0luZGV4ZWREYXRhc291cmNlXCJcclxuZXhwb3J0ICogZnJvbSBcIi4vU3RhdGljRGF0YXNvdXJjZVwiIiwiZXhwb3J0ICogZnJvbSBcIi4vQ29tcG9uZW50c1wiXHJcbmV4cG9ydCAqIGZyb20gXCIuL0RhdGFzb3VyY2VzXCJcclxuZXhwb3J0ICogZnJvbSBcIi4vSGVscGVycy9Qcm9wQmluZGluZ0hlbHBlclwiXHJcblxyXG5pbXBvcnQgKiBhcyBDb21wb25lbnRzIGZyb20gXCIuL0NvbXBvbmVudHNcIlxyXG5cclxuLy8gUmVnaXN0ZXIgYWxsIHRoZSBjb21wb25lbnRzXHJcbnZhciByZWdpc3RyeSA9IENvbXBvbmVudHMuY29tcG9uZW50UmVnaXN0cnk7XHJcblxyXG4vL2Jhc2UgY29tcG9uZW50c1xyXG5yZWdpc3RyeS5yZWdpc3RlcihcIkNtc0NvbXBvbmVudEZyb21Db25maWdcIiwgQ29tcG9uZW50cy5DbXNDb21wb25lbnRGcm9tQ29uZmlnKVxyXG5yZWdpc3RyeS5yZWdpc3RlcihcIkNtc0NvbXBvbmVudFwiLCBDb21wb25lbnRzLkNtc0NvbXBvbmVudClcclxucmVnaXN0cnkucmVnaXN0ZXIoXCJDbXNTdGF0aWNDb21wb25lbnRcIiwgQ29tcG9uZW50cy5DbXNTdGF0aWNDb21wb25lbnQpXHJcblxyXG4vL2NvbXBvbmVudHMgcmVxdWlyaW5nIGtub3dsZWRnZSBvZiBjb250ZXh0XHJcbnJlZ2lzdHJ5LnJlZ2lzdGVyKFwiQ21zQ29tcG9uZW50U2xvdFwiLCBDb21wb25lbnRzLkNtc0NvbXBvbmVudFNsb3QpXHJcbnJlZ2lzdHJ5LnJlZ2lzdGVyKFwiQ21zQ29tcG9uZW50RnJvbVNsb3RcIiwgQ29tcG9uZW50cy5DbXNDb21wb25lbnRGcm9tU2xvdClcclxucmVnaXN0cnkucmVnaXN0ZXIoXCJDbXNDb21wb25lbnRGcm9tQ29udGV4dFwiLCBDb21wb25lbnRzLkNtc0NvbXBvbmVudEZyb21Db250ZXh0KVxyXG5yZWdpc3RyeS5yZWdpc3RlcihcIkNtc0NvbXBvbmVudEZyb21JZFwiLCBDb21wb25lbnRzLkNtc0NvbXBvbmVudEZyb21JZClcclxucmVnaXN0cnkucmVnaXN0ZXIoXCJDbXNDb21wb25lbnRMaXN0XCIsIENvbXBvbmVudHMuQ21zQ29tcG9uZW50TGlzdClcclxuXHJcbmltcG9ydCAqIGFzIERhdGFzb3VyY2VzIGZyb20gXCIuL0RhdGFzb3VyY2VzXCJcclxuXHJcbi8vZGF0YSBzb3VyY2VzXHJcbnJlZ2lzdHJ5LnJlZ2lzdGVyKFwiSW5kZXhlZERhdGFzb3VyY2VcIiwgRGF0YXNvdXJjZXMuSW5kZXhlZERhdGFzb3VyY2UpXHJcbnJlZ2lzdHJ5LnJlZ2lzdGVyKFwiU3RhdGljRGF0YXNvdXJjZVwiLCBEYXRhc291cmNlcy5TdGF0aWNEYXRhc291cmNlKSIsIm1vZHVsZS5leHBvcnRzID0gZGVwdGhTcGxpdFxuXG5mdW5jdGlvbiBkZXB0aFNwbGl0ICh0ZXh0LCBkZWxpbWl0ZXIsIG9wdHMpIHtcbiAgdmFyIG1heCA9IG9wdHMgJiYgb3B0cy5tYXggfHwgSW5maW5pdHlcbiAgdmFyIGluY2x1ZGVEZWxpbWl0ZXJzID0gb3B0cyAmJiBvcHRzLmluY2x1ZGVEZWxpbWl0ZXJzIHx8IGZhbHNlXG5cbiAgdmFyIGRlcHRoID0gMFxuICB2YXIgc3RhcnQgPSAwXG4gIHZhciByZXN1bHQgPSBbXVxuICB2YXIgem9uZXMgPSBbXVxuXG4gIHRleHQucmVwbGFjZSgvKFtcXFtcXChcXHtdKXwoW1xcXVxcKVxcfV0pL2csIGZ1bmN0aW9uIChjdXJyZW50LCBvcGVuLCBjbG9zZSwgb2Zmc2V0KSB7XG4gICAgaWYgKG9wZW4pIHtcbiAgICAgIGlmIChkZXB0aCA9PT0gMCkge1xuICAgICAgICB6b25lcy5wdXNoKFtzdGFydCwgb2Zmc2V0XSlcbiAgICAgIH1cbiAgICAgIGRlcHRoICs9IDFcbiAgICB9IGVsc2UgaWYgKGNsb3NlKSB7XG4gICAgICBkZXB0aCAtPSAxXG4gICAgICBpZiAoZGVwdGggPT09IDApIHtcbiAgICAgICAgc3RhcnQgPSBvZmZzZXQgKyBjdXJyZW50Lmxlbmd0aFxuICAgICAgfVxuICAgIH1cbiAgfSlcblxuICBpZiAoZGVwdGggPT09IDAgJiYgc3RhcnQgPCB0ZXh0Lmxlbmd0aCkge1xuICAgIHpvbmVzLnB1c2goW3N0YXJ0LCB0ZXh0Lmxlbmd0aF0pXG4gIH1cblxuICBzdGFydCA9IDBcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHpvbmVzLmxlbmd0aCAmJiBtYXggPiAwOyBpKyspIHtcbiAgICBmb3IgKFxuICAgICAgdmFyIHBvcyA9IHpvbmVzW2ldWzBdLCBtYXRjaCA9IGRlbGltaXRlci5leGVjKHRleHQuc2xpY2UocG9zLCB6b25lc1tpXVsxXSkpO1xuICAgICAgbWF0Y2ggJiYgbWF4ID4gMTtcbiAgICAgIHBvcyArPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCwgc3RhcnQgPSBwb3MsIG1hdGNoID0gZGVsaW1pdGVyLmV4ZWModGV4dC5zbGljZShwb3MsIHpvbmVzW2ldWzFdKSlcbiAgICApIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRleHQuc2xpY2Uoc3RhcnQsIG1hdGNoLmluZGV4ICsgcG9zKSlcbiAgICAgIGlmIChpbmNsdWRlRGVsaW1pdGVycykge1xuICAgICAgICByZXN1bHQucHVzaChtYXRjaFswXSlcbiAgICAgIH1cbiAgICAgIG1heCAtPSAxXG4gICAgfVxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgdGV4dC5sZW5ndGgpIHtcbiAgICByZXN1bHQucHVzaCh0ZXh0LnNsaWNlKHN0YXJ0KSlcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiIsIi8vIHRvZG86IHN5bnRheCBjaGVja2luZ1xuLy8gdG9kbzogdGVzdCBoYW5kbGUgYXJnc1xudmFyIGRlcHRoU3BsaXQgPSByZXF1aXJlKCcuL2RlcHRoLXNwbGl0JylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxdWVyeSwgc2hvdWxkQXNzaWduUGFyYW1JZHMpe1xuICBpZiAoIXF1ZXJ5KSByZXR1cm4gW11cblxuICB2YXIgcmVzdWx0ID0gW11cbiAgICAsIHByZXZDaGFyLCBjaGFyXG4gICAgLCBuZXh0Q2hhciA9IHF1ZXJ5LmNoYXJBdCgwKVxuICAgICwgYlN0YXJ0ID0gMFxuICAgICwgYkVuZCA9IDBcbiAgICAsIHBhcnRPZmZzZXQgPSAwXG4gICAgLCBwb3MgPSAwXG4gICAgLCBkZXB0aCA9IDBcbiAgICAsIG1vZGUgPSAnZ2V0J1xuICAgICwgZGVlcFF1ZXJ5ID0gbnVsbFxuXG4gIC8vIGlmIHF1ZXJ5IGNvbnRhaW5zIHBhcmFtcyB0aGVuIG51bWJlciB0aGVtXG4gIGlmIChzaG91bGRBc3NpZ25QYXJhbUlkcyl7XG4gICAgcXVlcnkgPSBhc3NpZ25QYXJhbUlkcyhxdWVyeSlcbiAgfVxuXG4gIHZhciB0b2tlbnMgPSB7XG4gICAgJy4nOiB7bW9kZTogJ2dldCd9LFxuICAgICc6Jzoge21vZGU6ICdmaWx0ZXInfSxcbiAgICAnfCc6IHtoYW5kbGU6ICdvcid9LFxuICAgICdbJzoge29wZW46ICdzZWxlY3QnfSxcbiAgICAnXSc6IHtjbG9zZTogJ3NlbGVjdCd9LFxuICAgICd7Jzoge29wZW46ICdtZXRhJ30sXG4gICAgJ30nOiB7Y2xvc2U6ICdtZXRhJ30sXG4gICAgJygnOiB7b3BlbjogJ2FyZ3MnfSxcbiAgICAnKSc6IHtjbG9zZTogJ2FyZ3MnfVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaChpdGVtKXtcbiAgICBpZiAoZGVlcFF1ZXJ5KXtcbiAgICAgIGRlZXBRdWVyeS5wdXNoKGl0ZW0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pXG4gICAgfVxuICB9XG5cbiAgdmFyIGhhbmRsZXJzID0ge1xuICAgIGdldDogZnVuY3Rpb24oYnVmZmVyKXtcbiAgICAgIHZhciB0cmltbWVkID0gdHlwZW9mIGJ1ZmZlciA9PT0gJ3N0cmluZycgPyBidWZmZXIudHJpbSgpIDogbnVsbFxuICAgICAgaWYgKHRyaW1tZWQpe1xuICAgICAgICBwdXNoKHtnZXQ6dHJpbW1lZH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKGJ1ZmZlcil7XG4gICAgICBpZiAoYnVmZmVyKXtcbiAgICAgICAgcHVzaCh0b2tlbml6ZVNlbGVjdChidWZmZXIpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZGVlcCBxdWVyeSBvdmVycmlkZVxuICAgICAgICB2YXIgeCA9IHtkZWVwOiBbXX1cbiAgICAgICAgcmVzdWx0LnB1c2goeClcbiAgICAgICAgZGVlcFF1ZXJ5ID0geC5kZWVwXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGJ1ZmZlcil7XG4gICAgICBpZiAoYnVmZmVyKXtcbiAgICAgICAgcHVzaCh7ZmlsdGVyOmJ1ZmZlci50cmltKCl9KVxuICAgICAgfVxuICAgIH0sXG4gICAgb3I6IGZ1bmN0aW9uKCl7XG4gICAgICBkZWVwUXVlcnkgPSBudWxsXG4gICAgICByZXN1bHQucHVzaCh7b3I6dHJ1ZX0pXG4gICAgICBwYXJ0T2Zmc2V0ID0gaSArIDFcbiAgICB9LFxuICAgIGFyZ3M6IGZ1bmN0aW9uKGJ1ZmZlcil7XG4gICAgICB2YXIgYXJncyA9IHRva2VuaXplQXJncyhidWZmZXIpXG4gICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aC0xXS5hcmdzID0gYXJnc1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUJ1ZmZlcigpe1xuICAgIHZhciBidWZmZXIgPSBxdWVyeS5zbGljZShiU3RhcnQsIGJFbmQpXG4gICAgaWYgKGhhbmRsZXJzW21vZGVdKXtcbiAgICAgIGhhbmRsZXJzW21vZGVdKGJ1ZmZlcilcbiAgICB9XG4gICAgbW9kZSA9ICdnZXQnXG4gICAgYlN0YXJ0ID0gYkVuZCArIDFcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwO2kgPCBxdWVyeS5sZW5ndGg7aSsrKXtcblxuICAgIC8vIHVwZGF0ZSBjaGFyIHZhbHVlc1xuICAgIHByZXZDaGFyID0gY2hhcjsgY2hhciA9IG5leHRDaGFyOyBuZXh0Q2hhciA9IHF1ZXJ5LmNoYXJBdChpICsgMSk7XG4gICAgcG9zID0gaSAtIHBhcnRPZmZzZXRcblxuICAgIC8vIHJvb3QgcXVlcnkgY2hlY2tcbiAgICBpZiAocG9zID09PSAwICYmIChjaGFyICE9PSAnOicgJiYgY2hhciAhPT0gJy4nKSl7XG4gICAgICByZXN1bHQucHVzaCh7cm9vdDp0cnVlfSlcbiAgICB9XG5cbiAgICAvLyBwYXJlbnQgcXVlcnkgY2hlY2tcbiAgICBpZiAocG9zID09PSAwICYmIChjaGFyID09PSAnLicgJiYgbmV4dENoYXIgPT09ICcuJykpe1xuICAgICAgcmVzdWx0LnB1c2goe3BhcmVudDp0cnVlfSlcbiAgICB9XG5cbiAgICB2YXIgdG9rZW4gPSB0b2tlbnNbY2hhcl1cbiAgICBpZiAodG9rZW4pe1xuXG4gICAgICAvLyBzZXQgbW9kZVxuICAgICAgaWYgKGRlcHRoID09PSAwICYmICh0b2tlbi5tb2RlIHx8IHRva2VuLm9wZW4pKXtcbiAgICAgICAgaGFuZGxlQnVmZmVyKClcbiAgICAgICAgbW9kZSA9IHRva2VuLm1vZGUgfHwgdG9rZW4ub3BlblxuICAgICAgfVxuXG4gICAgICBpZiAoZGVwdGggPT09IDAgJiYgdG9rZW4uaGFuZGxlKXtcbiAgICAgICAgaGFuZGxlQnVmZmVyKClcbiAgICAgICAgaGFuZGxlcnNbdG9rZW4uaGFuZGxlXSgpXG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlbi5vcGVuKXtcbiAgICAgICAgZGVwdGggKz0gMVxuICAgICAgfSBlbHNlIGlmICh0b2tlbi5jbG9zZSl7XG4gICAgICAgIGRlcHRoIC09IDFcbiAgICAgIH1cblxuICAgICAgLy8gcmVzZXQgbW9kZSB0byBnZXRcbiAgICAgIGlmIChkZXB0aCA9PT0gMCAmJiB0b2tlbi5jbG9zZSl7XG4gICAgICAgIGhhbmRsZUJ1ZmZlcigpXG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBiRW5kID0gaSArIDFcblxuICB9XG5cbiAgaGFuZGxlQnVmZmVyKClcbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiB0b2tlbml6ZUFyZ3MoYXJnc1F1ZXJ5KXtcbiAgaWYgKGFyZ3NRdWVyeSA9PT0gJywnKSByZXR1cm4gWycsJ11cbiAgcmV0dXJuIGRlcHRoU3BsaXQoYXJnc1F1ZXJ5LCAvLC8pLm1hcChmdW5jdGlvbihzKXtcbiAgICByZXR1cm4gaGFuZGxlU2VsZWN0UGFydChzLnRyaW0oKSlcbiAgfSlcbn1cblxuZnVuY3Rpb24gdG9rZW5pemVTZWxlY3QgKHNlbGVjdFF1ZXJ5KSB7XG4gIGlmIChzZWxlY3RRdWVyeSA9PT0gJyonKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlczogdHJ1ZVxuICAgIH1cbiAgfSBlbHNlIGlmIChzZWxlY3RRdWVyeSA9PT0gJyoqJykge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZXM6IHRydWUsXG4gICAgICBkZWVwOiB0cnVlXG4gICAgfVxuICB9XG5cbiAgdmFyIG11bHRpcGxlID0gZmFsc2VcbiAgaWYgKHNlbGVjdFF1ZXJ5LmNoYXJBdCgwKSA9PT0gJyonKSB7XG4gICAgbXVsdGlwbGUgPSB0cnVlXG4gICAgc2VsZWN0UXVlcnkgPSBzZWxlY3RRdWVyeS5zbGljZSgxKVxuICB9XG5cbiAgdmFyIGJvb2xlYW5QYXJ0cyA9IGRlcHRoU3BsaXQoc2VsZWN0UXVlcnksIC8mfFxcfC8sIHsgaW5jbHVkZURlbGltaXRlcnM6IHRydWUgfSlcbiAgaWYgKGJvb2xlYW5QYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtcbiAgICAgIGdldFNlbGVjdFBhcnQoYm9vbGVhblBhcnRzWzBdLnRyaW0oKSlcbiAgICBdXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBib29sZWFuUGFydHMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgIHZhciBwYXJ0ID0gZ2V0U2VsZWN0UGFydChib29sZWFuUGFydHNbaSArIDFdLnRyaW0oKSlcbiAgICAgIGlmIChwYXJ0KSB7XG4gICAgICAgIHBhcnQuYm9vbGVhbk9wID0gYm9vbGVhblBhcnRzW2ldXG4gICAgICAgIHJlc3VsdC5wdXNoKHBhcnQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBtdWx0aXBsZTogbXVsdGlwbGUsXG4gICAgICBib29sZWFuOiB0cnVlLFxuICAgICAgc2VsZWN0OiByZXN1bHRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJlc3VsdCA9IGdldFNlbGVjdFBhcnQoc2VsZWN0UXVlcnkudHJpbSgpKVxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBnZXQ6IGhhbmRsZVNlbGVjdFBhcnQoc2VsZWN0UXVlcnkudHJpbSgpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobXVsdGlwbGUpIHtcbiAgICAgICAgcmVzdWx0Lm11bHRpcGxlID0gdHJ1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRTZWxlY3RQYXJ0IChzZWxlY3RRdWVyeSkge1xuICB2YXIgcGFydHMgPSBkZXB0aFNwbGl0KHNlbGVjdFF1ZXJ5LCAvKCEpPyg9fH58XFw6fDw9fD49fDx8PikvLCB7IG1heDogMiwgaW5jbHVkZURlbGltaXRlcnM6IHRydWUgfSlcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMykge1xuICAgIHZhciBuZWdhdGUgPSBwYXJ0c1sxXS5jaGFyQXQoMCkgPT09ICchJ1xuICAgIHZhciBrZXkgPSBoYW5kbGVTZWxlY3RQYXJ0KHBhcnRzWzBdLnRyaW0oKSlcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgbmVnYXRlOiBuZWdhdGUsXG4gICAgICBvcDogbmVnYXRlID8gcGFydHNbMV0uc2xpY2UoMSkgOiBwYXJ0c1sxXVxuICAgIH1cbiAgICBpZiAocmVzdWx0Lm9wID09PSAnOicpIHtcbiAgICAgIHJlc3VsdC5zZWxlY3QgPSBba2V5LCB7X3N1YjogbW9kdWxlLmV4cG9ydHMoJzonICsgcGFydHNbMl0udHJpbSgpKX1dXG4gICAgfSBlbHNlIGlmIChyZXN1bHQub3AgPT09ICd+Jykge1xuICAgICAgdmFyIHZhbHVlID0gaGFuZGxlU2VsZWN0UGFydChwYXJ0c1syXS50cmltKCkpXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICB2YXIgcmVEZWYgPSBwYXJ0c1syXS50cmltKCkubWF0Y2goL15cXC8oLiopXFwvKFthLXpdPykkLylcbiAgICAgICAgaWYgKHJlRGVmKSB7XG4gICAgICAgICAgcmVzdWx0LnNlbGVjdCA9IFtrZXksIG5ldyBSZWdFeHAocmVEZWZbMV0sIHJlRGVmWzJdKV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHQuc2VsZWN0ID0gW2tleSwgdmFsdWVdXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdC5zZWxlY3QgPSBba2V5LCB2YWx1ZV1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0LnNlbGVjdCA9IFtrZXksIGhhbmRsZVNlbGVjdFBhcnQocGFydHNbMl0udHJpbSgpKV1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbmZ1bmN0aW9uIGlzSW5uZXJRdWVyeSAodGV4dCkge1xuICByZXR1cm4gdGV4dC5jaGFyQXQoMCkgPT09ICd7JyAmJiB0ZXh0LmNoYXJBdCh0ZXh0Lmxlbmd0aC0xKSA9PT0gJ30nXG59XG5cbmZ1bmN0aW9uIGhhbmRsZVNlbGVjdFBhcnQocGFydCl7XG4gIGlmIChpc0lubmVyUXVlcnkocGFydCkpe1xuICAgIHZhciBpbm5lclF1ZXJ5ID0gcGFydC5zbGljZSgxLCAtMSlcbiAgICByZXR1cm4ge19zdWI6IG1vZHVsZS5leHBvcnRzKGlubmVyUXVlcnkpfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXJhbVRva2VuKHBhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyYW1Ub2tlbih0ZXh0KXtcbiAgaWYgKHRleHQuY2hhckF0KDApID09PSAnPycpe1xuICAgIHZhciBudW0gPSBwYXJzZUludCh0ZXh0LnNsaWNlKDEpKVxuICAgIGlmICghaXNOYU4obnVtKSl7XG4gICAgICByZXR1cm4ge19wYXJhbTogbnVtfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGV4dFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGV4dFxuICB9XG59XG5cblxuXG5mdW5jdGlvbiBhc3NpZ25QYXJhbUlkcyhxdWVyeSl7XG4gIHZhciBpbmRleCA9IDBcbiAgcmV0dXJuIHF1ZXJ5LnJlcGxhY2UoL1xcPy9nLCBmdW5jdGlvbihtYXRjaCl7XG4gICAgcmV0dXJuIG1hdGNoICsgKGluZGV4KyspXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGxhc3QgKGFycmF5KSB7XG4gIHJldHVybiBhcnJheVthcnJheS5sZW5ndGggLSAxXVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBTdGF0ZVxuXG5mdW5jdGlvbiBTdGF0ZShvcHRpb25zLCBwYXJhbXMsIGhhbmRsZVF1ZXJ5KXtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIC8vdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB0aGlzLmhhbmRsZVF1ZXJ5ID0gaGFuZGxlUXVlcnlcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB0aGlzLmxvY2FscyA9IHRoaXMub3B0aW9ucy5sb2NhbHMgfHwge31cbiAgdGhpcy5nbG9iYWxzID0gdGhpcy5vcHRpb25zLmdsb2JhbHMgfHwge31cbiAgdGhpcy5yb290Q29udGV4dCA9IGZpcnN0Tm9uTnVsbChvcHRpb25zLmRhdGEsIG9wdGlvbnMucm9vdENvbnRleHQsIG9wdGlvbnMuY29udGV4dCwgb3B0aW9ucy5zb3VyY2UpXG4gIHRoaXMucGFyZW50ID0gb3B0aW9ucy5wYXJlbnRcbiAgdGhpcy5vdmVycmlkZSA9IG9wdGlvbnMub3ZlcnJpZGVcbiAgdGhpcy5maWx0ZXJzID0gb3B0aW9ucy5maWx0ZXJzIHx8IHt9XG4gIHRoaXMucGFyYW1zID0gcGFyYW1zIHx8IG9wdGlvbnMucGFyYW1zIHx8IFtdXG4gIHRoaXMuY29udGV4dCA9IGZpcnN0Tm9uTnVsbChvcHRpb25zLmN1cnJlbnRJdGVtLCBvcHRpb25zLmNvbnRleHQsIG9wdGlvbnMuc291cmNlKVxuICB0aGlzLmN1cnJlbnRJdGVtID0gZmlyc3ROb25OdWxsKHRoaXMuY29udGV4dCwgb3B0aW9ucy5yb290Q29udGV4dCwgb3B0aW9ucy5kYXRhKVxuICB0aGlzLmN1cnJlbnRLZXkgPSBudWxsXG4gIHRoaXMuY3VycmVudFJlZmVyZW5jZXMgPSBbXVxuICB0aGlzLmN1cnJlbnRQYXJlbnRzID0gW11cbn1cblxuU3RhdGUucHJvdG90eXBlID0ge1xuXG4gIC8vIGN1cnJlbnQgbWFuaXB1bGF0aW9uXG4gIHNldEN1cnJlbnQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgIGlmICh0aGlzLmN1cnJlbnRJdGVtIHx8IHRoaXMuY3VycmVudEtleSB8fCB0aGlzLmN1cnJlbnRQYXJlbnRzLmxlbmd0aD4wKXtcbiAgICAgIHRoaXMuY3VycmVudFBhcmVudHMucHVzaCh7a2V5OiB0aGlzLmN1cnJlbnRLZXksIHZhbHVlOiB0aGlzLmN1cnJlbnRJdGVtfSlcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50SXRlbSA9IHZhbHVlXG4gICAgdGhpcy5jdXJyZW50S2V5ID0ga2V5XG4gIH0sXG5cbiAgcmVzZXRDdXJyZW50OiBmdW5jdGlvbigpe1xuICAgIHRoaXMuY3VycmVudEl0ZW0gPSBudWxsXG4gICAgdGhpcy5jdXJyZW50S2V5ID0gbnVsbFxuICAgIHRoaXMuY3VycmVudFBhcmVudHMgPSBbXVxuICB9LFxuXG4gIGZvcmNlOiBmdW5jdGlvbihkZWYpe1xuICAgIHZhciBwYXJlbnQgPSB0aGlzLmN1cnJlbnRQYXJlbnRzW3RoaXMuY3VycmVudFBhcmVudHMubGVuZ3RoLTFdXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRJdGVtICYmIHBhcmVudCAmJiAodGhpcy5jdXJyZW50S2V5ICE9IG51bGwpKXtcbiAgICAgIHRoaXMuY3VycmVudEl0ZW0gPSBkZWYgfHwge31cbiAgICAgIHBhcmVudC52YWx1ZVt0aGlzLmN1cnJlbnRLZXldID0gdGhpcy5jdXJyZW50SXRlbVxuICAgIH1cbiAgICByZXR1cm4gISF0aGlzLmN1cnJlbnRJdGVtXG4gIH0sXG5cbiAgZ2V0TG9jYWw6IGZ1bmN0aW9uKGxvY2FsTmFtZSl7XG4gICAgaWYgKH5sb2NhbE5hbWUuaW5kZXhPZignLycpKXtcbiAgICAgIHZhciByZXN1bHQgPSBudWxsXG4gICAgICB2YXIgcGFydHMgPSBsb2NhbE5hbWUuc3BsaXQoJy8nKVxuXG4gICAgICBmb3IgKHZhciBpPTA7aTxwYXJ0cy5sZW5ndGg7aSsrKXtcbiAgICAgICAgdmFyIHBhcnQgPSBwYXJ0c1tpXVxuICAgICAgICBpZiAoaSA9PSAwKXtcbiAgICAgICAgICByZXN1bHQgPSB0aGlzLmxvY2Fsc1twYXJ0XVxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCAmJiByZXN1bHRbcGFydF0pe1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwYXJ0XVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMubG9jYWxzW2xvY2FsTmFtZV1cbiAgICB9XG4gIH0sXG5cbiAgZ2V0R2xvYmFsOiBmdW5jdGlvbihnbG9iYWxOYW1lKXtcbiAgICBpZiAofmdsb2JhbE5hbWUuaW5kZXhPZignLycpKXtcbiAgICAgIHZhciByZXN1bHQgPSBudWxsXG4gICAgICB2YXIgcGFydHMgPSBnbG9iYWxOYW1lLnNwbGl0KCcvJylcblxuICAgICAgZm9yICh2YXIgaT0wO2k8cGFydHMubGVuZ3RoO2krKyl7XG4gICAgICAgIHZhciBwYXJ0ID0gcGFydHNbaV1cbiAgICAgICAgaWYgKGkgPT0gMCl7XG4gICAgICAgICAgcmVzdWx0ID0gdGhpcy5nbG9iYWxzW3BhcnRdXG4gICAgICAgIH0gZWxzZSBpZiAocmVzdWx0ICYmIHJlc3VsdFtwYXJ0XSl7XG4gICAgICAgICAgcmVzdWx0ID0gcmVzdWx0W3BhcnRdXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nbG9iYWxzW2dsb2JhbE5hbWVdXG4gICAgfVxuICB9LFxuXG4gIGdldEZpbHRlcjogZnVuY3Rpb24oZmlsdGVyTmFtZSl7XG4gICAgaWYgKH5maWx0ZXJOYW1lLmluZGV4T2YoJy8nKSl7XG4gICAgICB2YXIgcmVzdWx0ID0gbnVsbFxuICAgICAgdmFyIGZpbHRlclBhcnRzID0gZmlsdGVyTmFtZS5zcGxpdCgnLycpXG5cbiAgICAgIGZvciAodmFyIGk9MDtpPGZpbHRlclBhcnRzLmxlbmd0aDtpKyspe1xuICAgICAgICB2YXIgcGFydCA9IGZpbHRlclBhcnRzW2ldXG4gICAgICAgIGlmIChpID09IDApe1xuICAgICAgICAgIHJlc3VsdCA9IHRoaXMuZmlsdGVyc1twYXJ0XVxuICAgICAgICB9IGVsc2UgaWYgKHJlc3VsdCAmJiByZXN1bHRbcGFydF0pe1xuICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFtwYXJ0XVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tmaWx0ZXJOYW1lXVxuICAgIH1cbiAgfSxcblxuICBhZGRSZWZlcmVuY2VzOiBmdW5jdGlvbihyZWZlcmVuY2VzKXtcbiAgICBpZiAocmVmZXJlbmNlcyl7XG4gICAgICByZWZlcmVuY2VzLmZvckVhY2godGhpcy5hZGRSZWZlcmVuY2UsIHRoaXMpXG4gICAgfVxuICB9LFxuXG4gIGFkZFJlZmVyZW5jZTogZnVuY3Rpb24ocmVmKXtcbiAgICBpZiAocmVmIGluc3RhbmNlb2YgT2JqZWN0ICYmICF+dGhpcy5jdXJyZW50UmVmZXJlbmNlcy5pbmRleE9mKHJlZikpe1xuICAgICAgdGhpcy5jdXJyZW50UmVmZXJlbmNlcy5wdXNoKHJlZilcbiAgICB9XG4gIH0sXG5cbiAgLy8gaGVscGVyIGZ1bmN0aW9uc1xuICBnZXRWYWx1ZXM6IGZ1bmN0aW9uKHZhbHVlcywgY2FsbGJhY2spe1xuICAgIHJldHVybiB2YWx1ZXMubWFwKHRoaXMuZ2V0VmFsdWUsIHRoaXMpXG4gIH0sXG5cbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlRnJvbSh2YWx1ZSwgbnVsbClcbiAgfSxcblxuICBnZXRWYWx1ZUZyb206IGZ1bmN0aW9uICh2YWx1ZSwgaXRlbSkge1xuICAgIGlmICh2YWx1ZS5fcGFyYW0gIT0gbnVsbCl7XG4gICAgICByZXR1cm4gdGhpcy5wYXJhbXNbdmFsdWUuX3BhcmFtXVxuICAgIH0gZWxzZSBpZiAodmFsdWUuX3N1Yil7XG5cbiAgICAgIHZhciBvcHRpb25zID0gY29weSh0aGlzLm9wdGlvbnMpXG4gICAgICBvcHRpb25zLmZvcmNlID0gbnVsbFxuICAgICAgb3B0aW9ucy5jdXJyZW50SXRlbSA9IGl0ZW1cblxuICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuaGFuZGxlUXVlcnkodmFsdWUuX3N1Yiwgb3B0aW9ucywgdGhpcy5wYXJhbXMpXG4gICAgICB0aGlzLmFkZFJlZmVyZW5jZXMocmVzdWx0LnJlZmVyZW5jZXMpXG4gICAgICByZXR1cm4gcmVzdWx0LnZhbHVlXG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICB9LFxuXG4gIGRlZXBRdWVyeTogZnVuY3Rpb24oc291cmNlLCB0b2tlbnMsIG9wdGlvbnMsIGNhbGxiYWNrKXtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSlcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2Upe1xuICAgICAgaWYgKGtleSBpbiBzb3VyY2Upe1xuXG4gICAgICAgIHZhciBvcHRpb25zID0gY29weSh0aGlzLm9wdGlvbnMpXG4gICAgICAgIG9wdGlvbnMuY3VycmVudEl0ZW0gPSBzb3VyY2Vba2V5XVxuXG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmhhbmRsZVF1ZXJ5KHRva2Vucywgb3B0aW9ucywgdGhpcy5wYXJhbXMpXG5cbiAgICAgICAgaWYgKHJlc3VsdC52YWx1ZSl7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIGZpcnN0Tm9uTnVsbChhcmdzKXtcbiAgZm9yICh2YXIgaT0wO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspe1xuICAgIGlmIChhcmd1bWVudHNbaV0gIT0gbnVsbCl7XG4gICAgICByZXR1cm4gYXJndW1lbnRzW2ldXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvcHkob2JqKXtcbiAgdmFyIHJlc3VsdCA9IHt9XG4gIGlmIChvYmope1xuICAgIGZvciAodmFyIGtleSBpbiBvYmope1xuICAgICAgaWYgKGtleSBpbiBvYmope1xuICAgICAgICByZXN1bHRba2V5XSA9IG9ialtrZXldXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=