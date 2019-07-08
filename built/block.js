"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var Block = /** @class */ (function (_super) {
    __extends(Block, _super);
    function Block() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Block.prototype.render = function () {
        return (<react_native_1.Animated.View style={[styles.blockContainer, this.props.style, this.props.dragStartAnimationStyle]} {...this.props.panHandlers}>
        <react_native_1.Animated.View>
          <react_native_1.TouchableWithoutFeedback onPress={this.props.onPress} onLongPress={this.props.onLongPress}>
            {this.props.children}
          </react_native_1.TouchableWithoutFeedback>
        </react_native_1.Animated.View>
      </react_native_1.Animated.View>);
    };
    return Block;
}(React.Component));
exports.Block = Block;
var styles = react_native_1.StyleSheet.create({
    blockContainer: {
        alignItems: 'center',
    },
});
//# sourceMappingURL=block.js.map