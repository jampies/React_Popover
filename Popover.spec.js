import React from 'react';
import { shallow } from 'enzyme';
import Popover, { getHorizontalAlignment, getPopoverPosition, restoreStyles, TIP_DIRECTIONAL_POSITIONING } from './Popover';
import assert from 'assert';
import td from 'testdouble';

describe('Popover component', () => {
  let cachedWindow, cachedDocument, mockHtmlElement;
  const anchorPosition = {
    width: 100,
    left: 200,
    top: 300,
    height: 50
  };
  const defaultProps = {
    anchor: {
      style: {},
      getBoundingClientRect: () => anchorPosition
    },
    open: true,
    direction: 'right'
  };
  let component;

  const getComponent = (propOverides = {}) => {
    const props = { ...defaultProps, ...propOverides };
    return shallow(<Popover {...props}><span className='fooBody'>foo</span></Popover>);
  };

  before(() => {
    cachedWindow = global.window;
    cachedDocument = global.document;
  });

  beforeEach(() => {
    global.window = { innerWidth: 400, innerHeight: 400 };
    global.document = {
      getElementsByTagName: td.func()
    };
    mockHtmlElement = {
      style: {
        overflow: 'auto'
      }
    };
    td.when(global.document.getElementsByTagName('html')).thenReturn([
      mockHtmlElement
    ]);
    component = null;
  });

  after(() => {
    global.window = cachedWindow;
    global.document = cachedDocument;
  });

  it('should render the children as the body of the popover', () => {
    component = getComponent();
    assert.equal(component.find('.fooBody').text(), 'foo');
  });

  it('should not render anything when not open', () => {
    component = getComponent({ open: false });
    assert.equal(component.html(), null);
  });

  it('should not render anything when no anchor exists', () => {
    component = getComponent({ anchor: null });
    assert.equal(component.html(), null);
  });

  describe('Caching and restoring the old styles', () => {
    it('should set the anchor to relative positioning', () => {
      let anchor = { ...defaultProps.anchor, style: { position: 'static' } };
      component = getComponent({ anchor });
      assert.equal(anchor.style.position, 'relative');
      assert.equal(mockHtmlElement.style.overflow, 'hidden');
    });

    it('should not set the anchor to relative positioning when it already is absolute', () => {
      let anchor = { ...defaultProps.anchor, style: { position: 'absolute' } };
      component = getComponent({ anchor });
      assert.equal(anchor.style.position, 'absolute');
      assert.equal(mockHtmlElement.style.overflow, 'hidden');
    });

    it('should restore the anchor\'s original positioning', () => {
      let anchor = { ...defaultProps.anchor, style: { position: 'absolute' } };
      component = getComponent({ anchor });
      component.setState({ initialised: true });
      component.setProps({ open: false });
      assert.equal(anchor.style.position, 'absolute');
      assert.equal(mockHtmlElement.style.overflow, 'auto');
    });
  });

  describe('getHorizontalAlignment()', () => {
    it('should align the middle of two boxes', () => {
      component = getComponent();
      assert.equal(getHorizontalAlignment(anchorPosition, 50), 225);
    });
  });

  describe('getPopoverPosition()', () => {
    const windowBox = {
      height: 1000,
      width: 2300
    };

    const anchorBox = {
      height: 200,
      width: 500,
      top: 400,
      left: 650
    };

    it('should display to the left', () => {
      assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'left'), {
        top: '400px',
        right: '1670px'
      });
    });

    it('should display to the right', () => {
      assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'right'), {
        top: '400px',
        left: '1170px'
      });
    });

    it('should display to the top', () => {
      assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'top'), {
        bottom: '620px',
        left: '600px'
      });
    });

    it('should display to the bottom', () => {
      assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'bottom'), {
        top: '620px',
        left: '600px'
      });
    });

    describe('when too close to the left side', () => {
      const anchorBox = {
        height: 200,
        width: 100,
        top: 400,
        left: 50
      };

      it('should fix to the left when the direction is top', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'top'), {
          bottom: '620px',
          left: '20px'
        });
      });

      it('should fix to the left when the direction is bottom', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'bottom'), {
          top: '620px',
          left: '20px'
        });
      });

      it('should fix to the left when the direction is left', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'left'), {
          top: '400px',
          right: '1680px'
        });
      });
    });

    describe('when too close to the right side', () => {
      const anchorBox = {
        height: 200,
        width: 100,
        top: 400,
        left: 1950
      };

      it('should fix to the right when the direction is top', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'top'), {
          bottom: '620px',
          left: '1680px'
        });
      });

      it('should fix to the right when the direction is bottom', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'bottom'), {
          top: '620px',
          left: '1680px'
        });
      });

      it('should fix to the right when the direction is right', () => {
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'right'), {
          top: '400px',
          left: '1680px'
        });
      });

      it('should fix to the right when the direction is left', () => {
        const anchorBox = {
          height: 200,
          width: 100,
          top: 400,
          left: 2400
        };
        assert.deepEqual(getPopoverPosition(anchorBox, windowBox, 'left'), {
          top: '400px',
          right: '20px'
        });
      });
    });
  });

  describe('restoreStyles()', () => {
    it('be able to handle null values', () => {
      assert.doesNotThrow(() => restoreStyles());
    });
  });

  describe('TIP_DIRECTIONAL_POSITIONING', () => {
    const windowBox = {
      height: 1000,
      width: 2000
    };

    const anchorBox = {
      height: 200,
      width: 500,
      top: 400,
      left: 500
    };

    it('should calculate left', () => {
      assert.deepEqual(TIP_DIRECTIONAL_POSITIONING.left(anchorBox, windowBox), {
        left: 480,
        top: 415
      });
    });

    it('should calculate right', () => {
      assert.deepEqual(TIP_DIRECTIONAL_POSITIONING.right(anchorBox, windowBox), {
        left: 1000,
        top: 415
      });
    });

    it('should calculate top', () => {
      assert.deepEqual(TIP_DIRECTIONAL_POSITIONING.top(anchorBox, windowBox), {
        left: 725,
        bottom: 600
      });
    });

    it('should calculate bottom', () => {
      assert.deepEqual(TIP_DIRECTIONAL_POSITIONING.bottom(anchorBox, windowBox), {
        left: 725,
        top: 600
      });
    });
  });
});
