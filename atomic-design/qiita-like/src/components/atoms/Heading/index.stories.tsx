import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {QiiHeading} from './index';

export default {
  title: 'Atoms/Heading',
  component: QiiHeading,
  argTypes: {
    level: {
      control: 'number',
    },
  },
} as ComponentMeta<typeof QiiHeading>;

const Template: ComponentStory<typeof QiiHeading> = (args) => <QiiHeading {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'デフォルト',
};

export const Level1 = Template.bind({});
Level1.args = {
  children: 'レベル1',
  level: 1,
};

export const Level2 = Template.bind({});
Level2.args = {
  level: 2,
  children: 'レベル2',
};
export const Level3 = Template.bind({});
Level3.args = {
  children: 'レベル3',
  level: 3,
};
export const Level1WithVariant4 = Template.bind({});
Level1WithVariant4.args = {
  children: 'レベル1 Variant h4',
  level: 1,
  variant: 'h4',
};
