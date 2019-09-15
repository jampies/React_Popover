import { configure, addDecorator } from '@storybook/react';
import '@storybook/addon-knobs/register';
import { withKnobs } from '@storybook/addon-knobs/react'

function loadStories() {
    require('../src/Popover.story');
}

addDecorator(withKnobs);

configure(loadStories, module);