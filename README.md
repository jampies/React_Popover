# React_Popover
A React Popover component that adds an overlay but highlights the anchor element

Example available here: https://reactpopover.murrayleroux.now.sh

NPM Package: https://www.npmjs.com/package/simple-react-popover

## Dependencies

* Node v8+ and NPM

## Starting it up

* `npm install` to install any other necessary dependencies
* `npm run build` exports storybook as a static app to the `public` folder
* `npm start` will start up storybook locally to demo the component
* `npm test` runs the unit tests
* `npm run deploy` deploys the latest to the example on zeit

Any push to github will trigger a Travis build, which will update the npm package and deploy the latest version to now here: https://reactpopover.murrayleroux.now.sh

## Usage

Install using `npm i simple-react-popover`

### API

* `anchor` - Required. A React Ref to attach the Popover to.
* `direction` - Required. String. One of `['top', 'bottom', 'left', 'right']`
* `open` - Required. Boolean. Is the Popover showing or not.

### Example

```
import Popover from 'simple-react-popover'

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.setAnchorRef = this.setAnchorRef.bind(this);
  }

  setAnchorRef(ref) {
    this.setState({
      anchorRef: ref
    });
  }

  render() {
    let isOpen = boolean('Is Open?', true);
    let direction = select('Direction', ['top', 'bottom', 'left', 'right'], 'right');
    let anchorTop = number('Anchor Top', 200);
    let anchorLeft = number('Anchor Left', 700);

    return (
      <div>
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
      </div>
    );
  }
}
```

## Conventions

* Tests are located in the same folder as the component tested and has `.spec.js` extensions
* Stories are located in the same folder as the component described and has `.story.js` extensions

## Authored by
Murray le Roux
