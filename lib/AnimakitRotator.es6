import React        from 'react';
import AnimakitBase from 'animakit-core';

import styles       from './styles';

const MAX_COUNT = 6;

export default class AnimakitRotator extends AnimakitBase {
  static propTypes = {
    children:   React.PropTypes.any,
    sheet:      React.PropTypes.any,
    axis:       React.PropTypes.string,
    side:       React.PropTypes.any,
    duration:   React.PropTypes.number,
    easing:     React.PropTypes.string,
    shadow:     React.PropTypes.bool,
    background: React.PropTypes.string,
  };

  static defaultProps = {
    axis:       'X',
    side:       0,
    duration:   1000,
    easing:     'cubic-bezier(.165,.84,.44,1)',
    shadow:     false,
    background: null,
  };

  state = {
    animation:   false,
    sidesCount:  0,
    currentSide: 0,
    prevSide:    0,
    width:       0,
    height:      0,
    winHeight:   0,
    perspective: 0,
    sideOffset:  0,
    figureAngle: 0,
    sidesAngles: [],
    turnover:    0,
  };

  init() {
    this.sidesNodes      = [];
    this.sidesDimensions = [];

    this.is3DSupported = this.get3DSupport();

    this.changingProps = ['background', 'shadow'];
    this.useWinResize = true;
  }

  getSceneStyles() {
    if (!this.state.width || !this.state.height) return null;

    const { width, height, perspective } = this.state;

    if (!this.is3DSupported) return { ...styles.scene, width, height };

    return { ...styles.scene, width, height, perspective };
  }

  getContainerStyles() {
    if (!this.is3DSupported) return null;
    if (!this.state.width || !this.state.height) return null;

    const transform = `translateZ(${this.state.sideOffset * -1}px)`;

    return { ...styles.container, transform };
  }

  getFigureStyles() {
    if (!this.is3DSupported) return null;
    if (!this.state.width || !this.state.height) return null;

    const angle     = this.state.figureAngle + (this.state.turnover * 360);
    const transform = `rotate${this.state.axis}(${angle}deg)`;

    if (!this.state.animation) return { ...styles.figure, transform };

    const transition = `transform ${this.props.duration}ms ${this.props.easing}`;

    return { ...styles.figure, transform, transition };
  }

  getSideStyles(num) {
    if (!this.state.width || !this.state.height) return null;

    const background = this.props.background || 'transparent';
    const transform  = `rotate${this.state.axis}(${this.state.sidesAngles[num]}deg) `
                     + `translateZ(${this.state.sideOffset}px)`;

    if (this.is3DSupported) return { ...styles.side, transform, background };

    const opacity = num === this.state.currentSide ? 1 : 0;
    const zIndex  = num === this.state.currentSide ? 2 : 1;

    if (!this.state.animation) return { ...styles.side, opacity, zIndex, background };

    const transition = `opacity ${this.props.duration}ms ${this.props.easing}`;

    return { ...styles.side, opacity, zIndex, transition, background };
  }

  getShadowStyles(num) {
    const opacity = num === this.state.currentSide ? 0 : 2 / this.state.sidesCount;

    if (!this.state.animation) return { ...styles.sideShadow, opacity };

    const transition = `opacity ${this.props.duration}ms ${this.props.easing}`;

    return { ...styles.sideShadow, opacity, transition };
  }

  getNeighborSides(side) {
    const sidesCount = this.state.sidesCount;

    let neighbor1 = side - 1;
    if (neighbor1 === -1) neighbor1 = sidesCount - 1;

    let neighbor2 = side + 1;
    if (neighbor2 === sidesCount) neighbor2 = 0;

    return [neighbor1, neighbor2];
  }

  getChildVisibility(num) {
    if (num >= MAX_COUNT) return false;

    if (!this.state.width || !this.state.height) return true;

    const currentSide = this.state.currentSide;
    const prevSide    = this.state.prevSide;
    const sidesCount  = this.state.sidesCount;
    const animation   = this.state.animation;

    if (num === currentSide) return true;

    if (animation && (sidesCount > 4 || Math.abs(currentSide - num) > 1)) {
      if (num === prevSide) return true;

      const [neighbor1, neighbor2] = this.getNeighborSides(prevSide);

      if (num === neighbor1 || num === neighbor2) return true;
    }

    const [neighbor1, neighbor2] = this.getNeighborSides(currentSide);

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
    let maxWidth  = 0;
    let maxHeight = 0;

    React.Children.map(this.props.children, (child, num) => {
      let width  = 0;
      let height = 0;

      if (this.sidesDimensions[num]) {
        width  = this.sidesDimensions[num].width;
        height = this.sidesDimensions[num].height;
      }

      if (this.getChildVisibility(num)) {
        const node = this.sidesNodes[num];

        if (node) {
          width  = node.offsetWidth;
          height = node.offsetHeight;
        }

        this.sidesDimensions[num] = { width, height };
      }

      if (width > maxWidth)   maxWidth  = width;
      if (height > maxHeight) maxHeight = height;
    });

    return [maxWidth, maxHeight];
  }

  calcChildrenLength(children) {
    let length = Array.isArray(children) ? children.length : 1;

    if (length > MAX_COUNT) length = MAX_COUNT;

    return length;
  }

  calcRotateAngle(num, sidesCount) {
    return (360 / sidesCount) * num;
  }

  calcSideOffset(size, sidesCount) {
    if (!sidesCount || sidesCount < 3) return 0;

    const count = sidesCount > MAX_COUNT ? MAX_COUNT : sidesCount;

    const circleRadius = {
      3: 0.289,
      4: 0.5,
      5: 0.688,
      6: 0.866,
    };

    return size * circleRadius[count];
  }

  calcPerspective(mainDimension, sidesCount) {
    if (!sidesCount || sidesCount < 2) return null;
    if (sidesCount === 2) return this.state.winHeight;
    return mainDimension * 4;
  }

  resetDimensionsState(stateChunk) {
    const { width, height, perspective } = stateChunk;

    if (
      width       === this.state.width &&
      height      === this.state.height &&
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
    const mainDimension   = this.state.axis === 'X' ? height : width;
    const perspective     = this.calcPerspective(mainDimension, sidesCount);
    const sideOffset      = this.calcSideOffset(mainDimension, sidesCount);

    const state = this.resetDimensionsState({ width, height, perspective, sideOffset });

    if (Object.keys(state).length) this.setState(state);
  }

  repaint(nextProps) {
    const sidesCount      = this.calcChildrenLength(nextProps.children);

    const axis            = nextProps.axis !== 'X' ? 'Y' : 'X';
    const [width, height] = this.calcDimensions();
    const mainDimension   = axis === 'X' ? height : width;
    const perspective     = this.calcPerspective(mainDimension, sidesCount);

    const sideOffset      = this.calcSideOffset(mainDimension, sidesCount);

    const nextSide        = this.getSideNum(nextProps.side);
    const currentSide     = nextSide < sidesCount ? nextSide : sidesCount - 1;

    const axisSign        = axis === 'X' ? 1 : -1;
    const figureAngle     = this.calcRotateAngle(currentSide, sidesCount) * axisSign;
    const sides           = Array(sidesCount).fill(0);
    const sidesAngles     = sides.map((_, num) => (this.calcRotateAngle(num, sidesCount) * -axisSign));

    const state = Object.assign(
      {},
      this.resetDimensionsState({ width, height, perspective, sideOffset }),
      this.resetAxisState({ axis, perspective, sideOffset, figureAngle, sidesAngles }),
      this.resetSidesCountState({ sidesCount, sideOffset, figureAngle, sidesAngles }),
      this.resetCurrentSideState({ currentSide, sidesCount, axisSign, figureAngle })
    );

    this.applyState(state);
  }

  renderShadow(num) {
    if (!this.props.shadow) return null;
    if (!this.is3DSupported) return null;

    return (
      <div style = { this.getShadowStyles(num) } />
    );
  }

  render() {
    return (
      <div style = { this.getSceneStyles() }>
        <div style = { this.getContainerStyles() }>
          <div style = { this.getFigureStyles() }>
            { React.Children.map(this.props.children, (child, num) => {
              if (num >= MAX_COUNT) return null;

              return (
                <div style = { this.getSideStyles(num) }>
                  <div style = { styles.sideWrapper } ref = { (c) => { this.sidesNodes[num] = c; } }>
                    { this.getChildVisibility(num) ? child : null }
                    { !this.props.background && this.renderShadow(num) }
                  </div>
                  { this.props.background && this.renderShadow(num) }
                </div>
              );
            }) }
          </div>
        </div>
      </div>
    );
  }
}
