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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var block_1 = require("./block");
var utils_1 = require("./utils");
;
var DraggableGrid = /** @class */ (function (_super) {
    __extends(DraggableGrid, _super);
    function DraggableGrid(props) {
        var _this = _super.call(this, props) || this;
        _this.orderMap = {};
        _this.items = [];
        _this.blockPositions = [];
        _this.activeBlockOffset = { x: 0, y: 0 };
        _this.resetGridHeight = function () {
            var props = _this.props;
            var rowCount = Math.ceil(props.data.length / props.numColumns);
            _this.state.gridHeight.setValue(rowCount * _this.state.blockHeight);
        };
        _this.addItem = function (item, index) {
            _this.blockPositions.push(_this.getBlockPositionByOrder(_this.items.length));
            _this.orderMap[item.key] = {
                order: index,
            };
            _this.items.push({
                key: item.key,
                itemData: item,
                currentPosition: new react_native_1.Animated.ValueXY(_this.getBlockPositionByOrder(index)),
            });
        };
        _this.removeItem = function (item) {
            var itemIndex = utils_1.findIndex(_this.items, function (curItem) { return curItem.key === item.key; });
            _this.items.splice(itemIndex, 1);
            _this.blockPositions.pop();
            delete _this.orderMap[item.key];
        };
        _this.getBlockStyle = function (itemIndex) {
            return [
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                _this.state.hadInitBlockSize && {
                    width: _this.state.blockWidth,
                    height: _this.state.blockHeight,
                    position: 'absolute',
                    top: _this.items[itemIndex].currentPosition.getLayout().top,
                    left: _this.items[itemIndex].currentPosition.getLayout().left,
                },
            ];
        };
        _this.setActiveBlock = function (itemIndex) {
            _this.panResponderCapture = true;
            _this.setState({
                activeItemIndex: itemIndex,
            }, function () {
                _this.startDragStartAnimation();
            });
        };
        _this.getDragStartAnimation = function (itemIndex) {
            if (_this.state.activeItemIndex != itemIndex) {
                return;
            }
            var dragStartAnimation;
            if (_this.props.dragStartAnimation) {
                dragStartAnimation = _this.props.dragStartAnimation;
            }
            else {
                dragStartAnimation = _this.getDefaultDragStartAnimation();
            }
            return __assign({ zIndex: 3 }, dragStartAnimation);
        };
        _this.getDefaultDragStartAnimation = function () {
            return {
                transform: [
                    {
                        scale: _this.state.dragStartAnimatedValue,
                    }
                ],
                shadowColor: '#000000',
                shadowOpacity: 0.2,
                shadowRadius: 6,
                shadowOffset: {
                    width: 1,
                    height: 1,
                },
            };
        };
        _this.startDragStartAnimation = function () {
            if (!_this.props.dragStartAnimation) {
                _this.state.dragStartAnimatedValue.setValue(1);
                react_native_1.Animated.timing(_this.state.dragStartAnimatedValue, {
                    toValue: 1.1,
                    duration: 100,
                }).start();
            }
        };
        _this.getBlockPositionByOrder = function (order) {
            if (_this.blockPositions[order]) {
                return _this.blockPositions[order];
            }
            var _a = _this.state, blockWidth = _a.blockWidth, blockHeight = _a.blockHeight;
            var columnOnRow = order % _this.props.numColumns;
            var y = blockHeight * Math.floor(order / _this.props.numColumns);
            var x = columnOnRow * blockWidth;
            return {
                x: x, y: y
            };
        };
        _this.assessGridSize = function (event) {
            if (!_this.state.hadInitBlockSize) {
                var blockWidth = void 0, blockHeight = void 0;
                blockWidth = event.nativeEvent.layout.width / _this.props.numColumns;
                blockHeight = _this.props.itemHeight || blockWidth;
                _this.setState({
                    blockWidth: blockWidth,
                    blockHeight: blockHeight,
                    gridLayout: event.nativeEvent.layout,
                }, function () {
                    _this.initBlockPositions();
                    _this.resetGridHeight();
                });
            }
        };
        _this.initBlockPositions = function () {
            _this.items.forEach(function (item, index) {
                _this.blockPositions[index] = _this.getBlockPositionByOrder(index);
            });
            _this.items.forEach(function (item) {
                item.currentPosition.setOffset(_this.blockPositions[_this.orderMap[item.key].order]);
            });
            _this.setState({ hadInitBlockSize: true });
        };
        _this.getActiveItem = function () {
            if (_this.state.activeItemIndex === undefined)
                return false;
            return _this.items[_this.state.activeItemIndex];
        };
        _this.getDistance = function (startOffset, endOffset) {
            var xDistance = startOffset.x + _this.activeBlockOffset.x - endOffset.x;
            var yDistance = startOffset.y + _this.activeBlockOffset.y - endOffset.y;
            return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        };
        _this.resetBlockPositionByOrder = function (startOrder, endOrder) {
            if (startOrder > endOrder) {
                for (var i = startOrder - 1; i >= endOrder; i--) {
                    var key = _this.getKeyByOrder(i);
                    _this.orderMap[key].order++;
                    _this.moveBlockToBlockOrderPosition(key);
                }
            }
            else {
                for (var i = startOrder + 1; i <= endOrder; i++) {
                    var key = _this.getKeyByOrder(i);
                    _this.orderMap[key].order--;
                    _this.moveBlockToBlockOrderPosition(key);
                }
            }
        };
        _this.moveBlockToBlockOrderPosition = function (itemKey) {
            var itemIndex = utils_1.findIndex(_this.items, function (item) { return item.key === itemKey; });
            _this.items[itemIndex].currentPosition.flattenOffset();
            react_native_1.Animated.timing(_this.items[itemIndex].currentPosition, {
                toValue: _this.blockPositions[_this.orderMap[itemKey].order],
                duration: 0,
            }).start();
        };
        _this.getKeyByOrder = function (order) {
            return utils_1.findKey(_this.orderMap, function (item) { return item.order === order; });
        };
        _this.panResponderCapture = false;
        _this.panResponder = react_native_1.PanResponder.create({
            onStartShouldSetPanResponder: function () { return true; },
            onStartShouldSetPanResponderCapture: function () { return false; },
            onMoveShouldSetPanResponder: function () { return _this.panResponderCapture; },
            onMoveShouldSetPanResponderCapture: function () { return _this.panResponderCapture; },
            onShouldBlockNativeResponder: function () { return false; },
            onPanResponderTerminationRequest: function () { return false; },
            onPanResponderGrant: _this.onStartDrag.bind(_this),
            onPanResponderMove: _this.onHandMove.bind(_this),
            onPanResponderRelease: _this.onHandRelease.bind(_this),
        });
        _this.state = {
            blockHeight: 0,
            blockWidth: 0,
            gridHeight: new react_native_1.Animated.Value(0),
            hadInitBlockSize: false,
            dragStartAnimatedValue: new react_native_1.Animated.Value(1),
            gridLayout: {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
        };
        return _this;
    }
    DraggableGrid.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        nextProps.data.forEach(function (item, index) {
            if (_this.orderMap[item.key]) {
                if (_this.orderMap[item.key].order != index) {
                    _this.orderMap[item.key].order = index;
                    _this.moveBlockToBlockOrderPosition(item.key);
                }
                var currentItem = _this.items.find(function (i) { return i.key === item.key; });
                if (currentItem) {
                    currentItem.itemData = item;
                }
            }
            else {
                _this.addItem(item, index);
            }
        });
        var deleteItems = utils_1.differenceBy(this.items, nextProps.data, 'key');
        deleteItems.forEach(function (item) {
            _this.removeItem(item);
        });
    };
    DraggableGrid.prototype.componentDidUpdate = function () {
        this.resetGridHeight();
    };
    DraggableGrid.prototype.componentWillMount = function () {
        var _this = this;
        this.items = this.props.data.map(function (item, index) {
            _this.orderMap[item.key] = {
                order: index,
            };
            return {
                key: item.key,
                itemData: item,
                currentPosition: new react_native_1.Animated.ValueXY()
            };
        });
    };
    DraggableGrid.prototype.render = function () {
        var _this = this;
        return (<react_native_1.Animated.View style={[
            styles.draggableGrid,
            this.props.style,
            {
                height: this.state.gridHeight,
            },
        ]} onLayout={this.assessGridSize}>
        {this.state.hadInitBlockSize
            &&
                this.items.map(function (item, itemIndex) {
                    return (<block_1.Block onPress={_this.onBlockPress.bind(_this, itemIndex)} onLongPress={_this.setActiveBlock.bind(_this, itemIndex)} panHandlers={_this.panResponder.panHandlers} style={_this.getBlockStyle(itemIndex)} dragStartAnimationStyle={_this.getDragStartAnimation(itemIndex)} key={item.key}>
                {_this.props.renderItem(item.itemData, _this.orderMap[item.key].order)}
              </block_1.Block>);
                })}
      </react_native_1.Animated.View>);
    };
    DraggableGrid.prototype.onBlockPress = function (itemIndex) {
        this.props.onItemPress && this.props.onItemPress(this.items[itemIndex].itemData);
    };
    DraggableGrid.prototype.onStartDrag = function (nativeEvent, gestureState) {
        var activeItem = this.getActiveItem();
        if (!activeItem)
            return false;
        this.props.onDragStart && this.props.onDragStart(activeItem.itemData);
        var x0 = gestureState.x0, y0 = gestureState.y0, moveX = gestureState.moveX, moveY = gestureState.moveY;
        var activeOrigin = this.blockPositions[this.orderMap[activeItem.key].order];
        var x = activeOrigin.x - x0;
        var y = activeOrigin.y - y0;
        activeItem.currentPosition.setOffset({
            x: x,
            y: y,
        });
        this.activeBlockOffset = {
            x: x,
            y: y
        };
        activeItem.currentPosition.setValue({
            x: moveX,
            y: moveY,
        });
    };
    DraggableGrid.prototype.onHandMove = function (nativeEvent, gestureState) {
        var _this = this;
        var activeItem = this.getActiveItem();
        if (!activeItem)
            return false;
        var moveX = gestureState.moveX, moveY = gestureState.moveY;
        var xChokeAmount = Math.max(0, (this.activeBlockOffset.x + moveX) - (this.state.gridLayout.width - this.state.blockWidth));
        var xMinChokeAmount = Math.min(0, this.activeBlockOffset.x + moveX);
        var dragPosition = {
            x: moveX - xChokeAmount - xMinChokeAmount,
            y: moveY,
        };
        var originPosition = this.blockPositions[this.orderMap[activeItem.key].order];
        var dragPositionToActivePositionDistance = this.getDistance(dragPosition, originPosition);
        activeItem.currentPosition.setValue(dragPosition);
        var closetItemIndex = this.state.activeItemIndex;
        var closetDistance = dragPositionToActivePositionDistance;
        this.items.forEach(function (item, index) {
            if (index != _this.state.activeItemIndex) {
                var dragPositionToItemPositionDistance = _this.getDistance(dragPosition, _this.blockPositions[_this.orderMap[item.key].order]);
                if (dragPositionToItemPositionDistance < closetDistance
                    && dragPositionToItemPositionDistance < _this.state.blockWidth) {
                    closetItemIndex = index;
                    closetDistance = dragPositionToItemPositionDistance;
                }
            }
        });
        if (this.state.activeItemIndex != closetItemIndex) {
            var closetOrder = this.orderMap[this.items[closetItemIndex].key].order;
            this.resetBlockPositionByOrder(this.orderMap[activeItem.key].order, closetOrder);
            this.orderMap[activeItem.key].order = closetOrder;
        }
    };
    DraggableGrid.prototype.onHandRelease = function () {
        var _this = this;
        var activeItem = this.getActiveItem();
        if (!activeItem)
            return false;
        if (this.props.onDragRelease) {
            var dragReleaseResult_1 = [];
            this.items.forEach(function (item) {
                dragReleaseResult_1[_this.orderMap[item.key].order] = item.itemData;
            });
            this.props.onDragRelease(dragReleaseResult_1);
        }
        this.panResponderCapture = false;
        activeItem.currentPosition.flattenOffset();
        this.moveBlockToBlockOrderPosition(activeItem.key);
        this.setState({
            activeItemIndex: undefined,
        });
    };
    return DraggableGrid;
}(React.Component));
exports.DraggableGrid = DraggableGrid;
var styles = react_native_1.StyleSheet.create({
    draggableGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
//# sourceMappingURL=draggable-grid.js.map