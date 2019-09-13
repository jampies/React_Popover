import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, select, number } from '@storybook/addon-knobs/react';
import Popover from './Popover';
import { withInfo } from '@storybook/addon-info';
import ExampleContainer from '../../../.storybook/storybook-example';

class Story extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};

    this.setAnchorRef = this.setAnchorRef.bind(this);
  }

  setAnchorRef (ref) {
    this.setState({
      anchorRef: ref
    });
  }

  render () {
    let isOpen = boolean('Is Open?', true);
    let direction = select('Direction', ['top', 'bottom', 'left', 'right'], 'right');
    let anchorTop = number('Anchor Top', 0);
    let anchorLeft = number('Anchor Left', 0);

    return (
      <ExampleContainer>
        <div ref={this.setAnchorRef} style={{
          width: '150px',
          height: '100px',
          border: '1px solid black',
          backgroundColor: 'white',
          position: 'relative',
          top: `${anchorTop}px`,
          left: `${anchorLeft}px`
        }}>
          This is the anchor tag where the popover will attach to.
        </div>
        <Popover anchor={this.state.anchorRef} direction={direction} open={isOpen}>
          <h3>Heading text</h3>
          <p>Some paragraph text... Some paragraph text... Some paragraph text... Some paragraph text...</p>
        </Popover>
      </ExampleContainer>
    );
  }
}

storiesOf('Miscellaneous', module)
  .add('Popover', withInfo(`A bespoke Popover`)(() => (<Story />)));
