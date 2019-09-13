import React from 'react';
import styles from './Popover.scss';
import classnames from 'classnames';

const TIP_LENGTH = 20;
const TIP_WIDTH = 50;
const POPOVER_WIDTH = 600;
const PADDING = 20;

export const cacheStyles = (anchor, htmlTag) => {
  if (!anchor.cachedStyles) {
    anchor.cachedStyles = {
      position: anchor.style.position,
      zIndex: anchor.style.zIndex,
      htmlScrolling: htmlTag.style.overflow
    };
  }
};

export const restoreStyles = (anchor, htmlTag) => {
  if (anchor && anchor.cachedStyles) {
    anchor.style.position = anchor.cachedStyles.position;
    anchor.style.zIndex = anchor.cachedStyles.zIndex;
    htmlTag.style.overflow = anchor.cachedStyles.htmlScrolling;
    delete anchor.cachedStyles;
  }
};

export const getHorizontalAlignment = (anchorBox, itemWidth) => anchorBox.left + (anchorBox.width / 2) - (itemWidth / 2);

export const POPOVER_DIRECTIONAL_POSITIONING = {
  top: (anchorBox, windowBox) => ({
    bottom: windowBox.height - anchorBox.top + TIP_LENGTH,
    left: getHorizontalAlignment(anchorBox, POPOVER_WIDTH)
  }),
  bottom: anchorBox => ({
    top: anchorBox.top + anchorBox.height + TIP_LENGTH,
    left: getHorizontalAlignment(anchorBox, POPOVER_WIDTH)
  }),
  left: (anchorBox, windowBox) => ({
    top: anchorBox.top,
    right: windowBox.width - anchorBox.left + TIP_LENGTH
  }),
  right: anchorBox => ({
    top: anchorBox.top,
    left: anchorBox.left + anchorBox.width + TIP_LENGTH
  })
};

export const TIP_DIRECTIONAL_POSITIONING = {
  top: (anchorBox, windowBox) => ({
    bottom: windowBox.height - anchorBox.top,
    left: getHorizontalAlignment(anchorBox, TIP_WIDTH)
  }),
  bottom: anchorBox => ({
    top: anchorBox.top + anchorBox.height,
    left: getHorizontalAlignment(anchorBox, TIP_WIDTH)
  }),
  left: anchorBox => ({
    top: anchorBox.top + 15,
    left: anchorBox.left - TIP_LENGTH
  }),
  right: anchorBox => ({
    top: anchorBox.top + 15,
    left: anchorBox.left + anchorBox.width
  })
};

export const fixPositioning = (position, windowBox) => {
  let fixedPosition = { ...position };
  let maxWidth = windowBox.width - PADDING;
  if (position.left) {
    if (position.left + POPOVER_WIDTH > maxWidth) {
      fixedPosition.left = maxWidth - POPOVER_WIDTH;
    } else if (position.left < PADDING) {
      fixedPosition.left = PADDING;
    }
  } else {
    if (position.right + POPOVER_WIDTH > maxWidth) {
      fixedPosition.right = maxWidth - POPOVER_WIDTH;
    } else if (position.right < PADDING) {
      fixedPosition.right = PADDING;
    }
  }
  return fixedPosition;
};

export const stringifyStyleProps = position => {
  let strigifiedPosition = {};
  Object.keys(position).forEach(key => {
    strigifiedPosition[key] = `${position[key]}px`;
  });
  return strigifiedPosition;
};

export const getPopoverPosition = (anchorBox, windowBox, direction) => {
  let position = POPOVER_DIRECTIONAL_POSITIONING[direction](anchorBox, windowBox);
  let fixedPositioning = fixPositioning(position, windowBox);
  return stringifyStyleProps(fixedPositioning);
};

export const getTipPosition = (anchorBox, windowBox, direction) => {
  let position = TIP_DIRECTIONAL_POSITIONING[direction](anchorBox, windowBox);
  return stringifyStyleProps(position);
};

export const getPosition = (anchor, direction) => {
  let anchorBox = anchor.getBoundingClientRect();
  let windowBox = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  return {
    popover: getPopoverPosition(anchorBox, windowBox, direction),
    tip: getTipPosition(anchorBox, windowBox, direction)
  };
};

class Popover extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      initialised: false
    };

    this.init = this.init.bind(this);
  }

  componentDidMount () {
    this.timeout = setTimeout(this.init, 1000);
  }

  /* istanbul ignore next */
  componentWillUnmount () {
    clearTimeout(this.timeout);
  }

  init () {
    this.setState({
      initialised: true
    });
  }

  /* istanbul ignore next */
  componentDidUpdate () {
    if (this.state.initialised && !this.props.open) {
      this.setState({
        initialised: false
      });
    } else if (!this.state.initialised && this.props.open) {
      this.setState({
        initialised: true
      });
    }
  }

  render () {
    const { children, direction, open, anchor } = this.props;
    if (!anchor) {
      return null;
    }
    const htmlTag = document.getElementsByTagName('html')[0];
    if (!open) {
      restoreStyles(anchor, htmlTag);
      return null;
    }
    cacheStyles(anchor, htmlTag);
    if (anchor.style.position !== 'absolute') {
      anchor.style.position = 'relative';
    }
    anchor.style.zIndex = '10001';
    htmlTag.style.overflow = 'hidden';

    let position = getPosition(anchor, direction);
    return (
      <div className={classnames(styles.PopoverOverlay, { [styles.transitioned]: this.state.initialised }, direction)}>
        <div data-selector='popover-body' className={styles.Popover} style={position.popover}>
          {children}
        </div>
        <div className={styles.PopoverTip} style={position.tip} />
      </div>
    );
  }
}

export default Popover;
