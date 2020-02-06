'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var shallowequal = require('shallowequal');
var NODE_ENV = process.env.NODE_ENV;
var EventKeys = {};
if (NODE_ENV !== 'production') {
  // Gated behind flag so bundlers can strip the import
  EventKeys = require('./events'); // arrays of event names
}

var DocumentEvents = function (_React$Component) {
  _inherits(DocumentEvents, _React$Component);

  // propTypes are generated below from all possible events

  function DocumentEvents(props) {
    _classCallCheck(this, DocumentEvents);

    var _this = _possibleConstructorReturn(this, (DocumentEvents.__proto__ || Object.getPrototypeOf(DocumentEvents)).call(this, props));

    _this._allHandlers = {};
    return _this;
  }

  _createClass(DocumentEvents, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.enabled) this.bindHandlers(this.props);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindHandlers(this.props);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!shallowequal(Object.keys(this.props).sort(), Object.keys(nextProps).sort())) {
        this.unbindHandlers(this.props);
        this.bindHandlers(nextProps);
      } else if (this.props.enabled && !nextProps.enabled) {
        this.unbindHandlers(this.props);
      } else if (!this.props.enabled && nextProps.enabled) {
        this.bindHandlers(nextProps);
      }
    }
  }, {
    key: 'getKeys',
    value: function getKeys(props) {
      props = props || this.props;
      var isWindow = props.target === window;
      return Object.keys(props).filter(function (k) {
        return k.slice(0, 2) === 'on';
      }).map(function (k) {
        if (NODE_ENV !== 'production' && EventKeys.windowEvents.indexOf(k) !== -1 && !isWindow) {
          // eslint-disable-next-line
          console.warn("You attached the handler " + k + ", but this handler is only valid on the Window object.");
        }
        return [k, k.slice(2).toLowerCase()];
      });
    }
  }, {
    key: 'getTarget',
    value: function getTarget(props) {
      props = props || this.props;
      var target = typeof props.target === 'function' ? props.target() : props.target;
      // Ensure that, by default, we get the ownerDocument of our render target
      // Useful if we render into <iframe>s or new windows.
      if (!target) target = this.node && this.node.ownerDocument;
      return target;
    }
  }, {
    key: 'bindHandlers',
    value: function bindHandlers(props) {
      this._adjustHandlers(on, props);
    }
  }, {
    key: 'unbindHandlers',
    value: function unbindHandlers(props) {
      this._adjustHandlers(off, props);
    }
  }, {
    key: '_adjustHandlers',
    value: function _adjustHandlers(fn, props) {
      var _this2 = this;

      var target = this.getTarget(props);
      if (!target) return;
      // If `passive` is not supported, the third param is `useCapture`, which is a bool - and we won't
      // be able to use passive at all. Otherwise, it's safe to use an object.
      var options = SUPPORTS_PASSIVE ? { passive: props.passive, capture: props.capture } : props.capture;
      this.getKeys(props).forEach(function (keyArr) {
        var handler = _this2._allHandlers[keyArr[0]] || function (event) {
          return _this2.props[keyArr[0]](event);
        };
        _this2._allHandlers[keyArr[0]] = handler;
        fn(target, keyArr[1], handler, options);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (this.props.target) return null;

      // If no target, we'll have to render an el to figure out which document we're in.
      return React.createElement('noscript', { ref: function ref(c) {
          _this3.node = c;
        } });
    }
  }]);

  return DocumentEvents;
}(React.Component);

DocumentEvents.displayName = 'DocumentEvents';

DocumentEvents.defaultProps = {
  capture: false,
  enabled: true,
  passive: false
};

function on(element, event, callback, options) {
  !element.addEventListener && (event = 'on' + event);
  (element.addEventListener || element.attachEvent).call(element, event, callback, options);
  return callback;
}

function off(element, event, callback, options) {
  !element.removeEventListener && (event = 'on' + event);
  (element.removeEventListener || element.detachEvent).call(element, event, callback, options);
  return callback;
}

var SUPPORTS_PASSIVE = function passiveFeatureTest() {
  try {
    var support = false;
    document.createElement("div").addEventListener("test", function () {}, { get passive() {
        support = true;
      } });
    return support;
  } catch (e) {
    return false;
  }
}();

// Generate and assign propTypes from all possible events
if (NODE_ENV !== 'production') {
  var propTypes = EventKeys.allEvents.reduce(function (result, key) {
    result[key] = PropTypes.func;
    return result;
  }, {});
  propTypes.enabled = PropTypes.bool;
  propTypes.target = PropTypes.oneOfType([PropTypes.object, PropTypes.func]);
  propTypes.passive = PropTypes.bool;
  propTypes.capture = PropTypes.bool;
  DocumentEvents.propTypes = propTypes;
}

module.exports = DocumentEvents;