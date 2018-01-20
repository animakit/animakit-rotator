import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { isEqual, is3DSupported, transitionEventName, getNeighbors } from './utils';

import styles from './styles';

const MAXCOUNT = 6;

export default class AnimakitRotator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: false,

      sidesCount: 0,
      currentSide: 0,
      prevSide: 0,

      width: 0,
      height: 0,
      winHeight: 0,
      perspective: 0,

      sideOffset: 0,
      figureAngle: 0,
      sidesAngles: [],

      turnover: 0,
    };

    this.setFigureNode = this.setFigureNode.bind(this);
  }

  componentWillMount() {
    this.figureNode = null;
    this.sidesNodes = [];
    this.sidesDimensions = [];

    this.is3DSupported = is3DSupported();
    this.transitionEventName = transitionEventName();

    this.listeners = this.getListeners();

    this.animationReset = false;
    this.animationResetTO = null;
    this.resizeCheckerRAF = null;

    this.onWinResize();
  }

  componentDidMount() {
    this.repaint(this.props);

    this.toggleAnimationListener(true);
  }

  componentWillReceiveProps(nextProps) {
    this.repaint(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !isEqual(nextState, this.state);

    const childrenChanged = !isEqual(nextProps.children, this.props.children);

    const propsChanged = ['background', 'shadow'].some(
      name => nextProps[name] !== this.props[name]
    );

    return stateChanged || childrenChanged || propsChanged;
  }

  componentWillUpdate() {
    this.toggleResizeChecker(false);
  }

  componentDidUpdate() {
    this.toggleResizeChecker(true);
  }

  componentWillUnmount() {
    this.toggleResizeChecker(false);
    this.toggleAnimationReset(false);
    this.toggleAnimationListener(false);
    this.toggleWinResizeListener(false);
  }

  onTransitionEnd() {
    if (!this.animationReset) return;

    this.setState({
      animation: false,
    });
  }

  onCheckResize() {
    this.toggleResizeChecker(false);

    this.softRepaint();

    this.toggleResizeChecker(true);
  }

  onWinResize() {
    this.setState({
      winHeight: window.innerHeight,
    });
  }

  getListeners() {
    return {
      onTransitionEnd: this.onTransitionEnd.bind(this),
      onCheckResize: this.onCheckResize.bind(this),
      onWinResize: this.onWinResize.bind(this),
    };
  }

  toggleResizeChecker(start) {
    if (typeof requestAnimationFrame === 'undefined') return;

    if (start) {
      this.resizeCheckerRAF = requestAnimationFrame(this.listeners.onCheckResize);
    } else if (this.resizeCheckerRAF) {
      cancelAnimationFrame(this.resizeCheckerRAF);
    }
  }

  toggleAnimationReset(add) {
    if (this.animationResetTO) clearTimeout(this.animationResetTO);

    if (add) {
      this.animationResetTO = setTimeout(() => {
        this.animationReset = true;
      }, this.props.duration);
    } else {
      this.animationReset = false;
    }
  }

  toggleAnimationListener(add) {
    const method = add ? 'addEventListener' : 'removeEventListener';
    this.figureNode[method](this.transitionEventName, this.listeners.onTransitionEnd, false);
  }

  toggleWinResizeListener(add) {
    const method = add ? 'addEventListener' : 'removeEventListener';
    window[method]('resize', this.listeners.onWinResize, false);
  }

  getSceneStyles() {
    const { width, height, perspective } = this.state;

    if (!width || !height) return null;

    if (!this.is3DSupported) return { ...styles.scene, width, height };

    return { ...styles.scene, width, height, perspective };
  }

  getContainerStyles() {
    if (!this.is3DSupported) return null;

    const { width, height, sideOffset } = this.state;

    if (!width || !height) return null;

    const transform = `translateZ(${sideOffset * -1}px)`;

    return { ...styles.container, transform };
  }

  getFigureStyles() {
    if (!this.is3DSupported) return null;

    const { width, height, figureAngle, turnover, axis, animation } = this.state;

    if (!width || !height) return null;

    const angle = figureAngle + (turnover * 360);
    const transform = `rotate${axis}(${angle}deg)`;

    if (!animation) return { ...styles.figure, transform };

    const { duration, easing } = this.props;
    const transition = `transform ${duration}ms ${easing}`;

    return { ...styles.figure, transform, transition };
  }

  getSideStyles(num) {
    const { width, height, axis, sidesAngles, sideOffset, currentSide, animation } = this.state;

    if (!width || !height) return null;

    const background = this.props.background || 'transparent';
    const transform = `rotate${axis}(${sidesAngles[num]}deg) translateZ(${sideOffset}px)`;

    if (this.is3DSupported) return { ...styles.side, transform, background };

    const opacity = num === currentSide ? 1 : 0;
    const zIndex = num === currentSide ? 2 : 1;

    if (!animation) return { ...styles.side, opacity, zIndex, background };

    const { duration, easing } = this.props;
    const transition = `opacity ${duration}ms ${easing}`;

    return { ...styles.side, opacity, zIndex, transition, background };
  }

  getShadowStyles(num) {
    const { currentSide, sidesCount, animation } = this.state;

    if (!sidesCount) return {};

    const opacity = num === currentSide ? 0 : 2 / sidesCount;

    if (!animation) return { ...styles.sideShadow, opacity };

    const { duration, easing } = this.props;
    const transition = `opacity ${duration}ms ${easing}`;

    return { ...styles.sideShadow, opacity, transition };
  }

  getChildVisibility(num) {
    if (num >= MAXCOUNT) return false;

    if (!this.state.width || !this.state.height) return true;

    const { currentSide, prevSide, sidesCount, animation } = this.state;

    if (num === currentSide) return true;

    if (animation && (sidesCount > 4 || Math.abs(currentSide - num) > 1)) {
      if (num === prevSide) return true;

      const [neighbor1, neighbor2] = getNeighbors(prevSide, sidesCount - 1);

      if (num === neighbor1 || num === neighbor2) return true;
    }

    const [neighbor1, neighbor2] = getNeighbors(currentSide, sidesCount - 1);

    return (num === neighbor1 || num === neighbor2) && (animation || sidesCount > 4);
  }

  getSideNum(sideKey) {
    let sideNum = sideKey;

    React.Children.forEach(this.props.children, (child, num) => {
      if (child.key === sideKey) sideNum = num;
    });

    return sideNum;
  }

  calcDimensions() {
    let maxWidth = 0;
    let maxHeight = 0;

    React.Children.map(this.props.children, (child, num) => {
      let width = 0;
      let height = 0;

      if (this.sidesDimensions[num]) {
        width = this.sidesDimensions[num].width;
        height = this.sidesDimensions[num].height;
      }

      if (this.getChildVisibility(num)) {
        const node = this.sidesNodes[num];

        if (node) {
          const newWidth = node.offsetWidth;
          const newHeight = node.offsetHeight;

          width = (Math.abs(newWidth - width) <= 1) ? width : newWidth;
          height = (Math.abs(newHeight - height) <= 1) ? height : newHeight;
        }

        this.sidesDimensions[num] = { width, height };
      }

      if (width > maxWidth) maxWidth = width;
      if (height > maxHeight) maxHeight = height;
    });

    return [maxWidth, maxHeight];
  }

  calcChildrenLength(children) {
    let length = Array.isArray(children) ? children.length : 1;

    if (length > MAXCOUNT) length = MAXCOUNT;

    return length;
  }

  calcRotateAngle(num, sidesCount) {
    return (360 / sidesCount) * num;
  }

  calcSideOffset(size, sidesCount) {
    if (!sidesCount || sidesCount < 3) return 0;

    const count = sidesCount > MAXCOUNT ? MAXCOUNT : sidesCount;

    const circleRadius = [0.289, 0.5, 0.688, 0.866];

    return size * circleRadius[count - 3];
  }

  calcPerspective(mainDimension, sidesCount) {
    if (!sidesCount || sidesCount < 2) return null;
    if (sidesCount === 2) return this.state.winHeight;
    return mainDimension * 4;
  }

  resetDimensionsState(stateChunk) {
    const { width, height, perspective } = stateChunk;

    if (
      width === this.state.width &&
      height === this.state.height &&
      perspective === this.state.perspective
    ) return {};

    return stateChunk;
  }

  resetAxisState(stateChunk) {
    const axis = stateChunk.axis;

    if (axis === this.state.axis) return {};

    return stateChunk;
  }

  resetSidesCountState(stateChunk) {
    const sidesCount = stateChunk.sidesCount;

    if (sidesCount === this.state.sidesCount) return {};

    this.toggleWinResizeListener(sidesCount === 2);

    if (sidesCount < this.state.sidesCount) {
      this.sidesDimensions.splice(sidesCount - 1, 1);
    }

    return stateChunk;
  }

  resetCurrentSideState(stateChunk) {
    const { currentSide, sidesCount, axisSign, figureAngle } = stateChunk;
    const prevSide = this.state.currentSide;

    if (currentSide === prevSide) return {};

    const animation = true;
    let turnover = this.state.turnover;

    if (currentSide === 0 && prevSide === sidesCount - 1) {
      turnover += axisSign;
    }
    if (sidesCount > 2 && currentSide === sidesCount - 1 && prevSide === 0) {
      turnover -= axisSign;
    }

    return { currentSide, prevSide, figureAngle, turnover, animation };
  }

  softRepaint() {
    const sidesCount = this.state.sidesCount;

    const [width, height] = this.calcDimensions();
    const mainDimension = this.state.axis === 'X' ? height : width;
    const perspective = this.calcPerspective(mainDimension, sidesCount);
    const sideOffset = this.calcSideOffset(mainDimension, sidesCount);

    const state = this.resetDimensionsState({ width, height, perspective, sideOffset });

    if (Object.keys(state).length) this.setState(state);
  }

  repaint(nextProps) {
    const sidesCount = this.calcChildrenLength(nextProps.children);

    const axis = nextProps.axis !== 'X' ? 'Y' : 'X';
    const [width, height] = this.calcDimensions();
    const mainDimension = axis === 'X' ? height : width;
    const perspective = this.calcPerspective(mainDimension, sidesCount);
    const sideOffset = this.calcSideOffset(mainDimension, sidesCount);

    const nextSide = this.getSideNum(nextProps.side);
    const currentSide = nextSide < sidesCount ? nextSide : sidesCount - 1;

    const axisSign = axis === 'X' ? 1 : -1;
    const figureAngle = this.calcRotateAngle(currentSide, sidesCount) * axisSign;
    const sides = Array(sidesCount).fill(0);
    const sidesAngles = sides.map((_, num) => (this.calcRotateAngle(num, sidesCount) * -axisSign));

    const state = Object.assign(
      {},
      this.resetDimensionsState({ width, height, perspective, sideOffset }),
      this.resetAxisState({ axis, perspective, sideOffset, figureAngle, sidesAngles }),
      this.resetSidesCountState({ sidesCount, sideOffset, figureAngle, sidesAngles }),
      this.resetCurrentSideState({ currentSide, sidesCount, axisSign, figureAngle })
    );

    this.applyState(state);
  }

  applyState(state) {
    if (!Object.keys(state).length) return;

    if (state.animation) {
      this.toggleAnimationReset(false);
    }

    this.setState(state);

    if (state.animation) {
      this.toggleAnimationReset(true);
    }
  }

  renderShadow(num) {
    if (!this.props.shadow) return null;
    if (!this.is3DSupported) return null;

    return (
      <div style={ this.getShadowStyles(num) } />
    );
  }

  setFigureNode(c) {
    this.figureNode = c;
  }

  render() {
    const hasBackground = this.props.background !== null;

    return (
      <div style={ this.getSceneStyles() }>
        <div style={ this.getContainerStyles() }>
          <div style={ this.getFigureStyles() } ref={ this.setFigureNode }>
            { React.Children.map(this.props.children, (child, num) => {
              if (num >= MAXCOUNT) return null;

              return (
                <div style={ this.getSideStyles(num) }>
                  <div
                    style={ styles.sideWrapper }
                    ref={ (c) => { this.sidesNodes[num] = c; } }
                  >
                    { this.getChildVisibility(num) ? child : null }
                    { !hasBackground && this.renderShadow(num) }
                  </div>
                  { hasBackground && this.renderShadow(num) }
                </div>
              );
            }) }
          </div>
        </div>
      </div>
    );
  }
}

AnimakitRotator.propTypes = {
  children: PropTypes.any,
  sheet: PropTypes.any,
  axis: PropTypes.string,
  side: PropTypes.any,
  duration: PropTypes.number,
  easing: PropTypes.string,
  shadow: PropTypes.bool,
  background: PropTypes.string,
};

AnimakitRotator.defaultProps = {
  axis: 'X',
  side: 0,
  duration: 1000,
  easing: 'cubic-bezier(.165,.84,.44,1)',
  shadow: false,
  background: null,
};
