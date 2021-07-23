import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {MyEditor} from './index';

export default {
  title: 'Molecules/MyEditor',
  component: MyEditor,
  argTypes: {
    backgroundColor: {
      control: 'color',
    },
  },
} as ComponentMeta<typeof MyEditor>;

const Template: ComponentStory<typeof MyEditor> = (args) => <MyEditor />;

export const Default = Template.bind({});
