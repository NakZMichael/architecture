import {Typography, TypographyProps} from '@material-ui/core';
import React from 'react';

type HeadingVariations = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'

interface HeadingPresenterProps extends TypographyProps<'h1'>{
  component:HeadingVariations
}

const HeadingPresenter = ({
  component,
  children,
  ...props
}:HeadingPresenterProps) => (
  <Typography component={component} {...props} >{children}</Typography>
);

const HeadingContainer = ({
  level,
  presenter,
  variant,
  ...props
}:HeadingProps&{
  presenter:typeof HeadingPresenter
}) => {
  const component = `h${level}` as HeadingVariations;
  const visualVariant = variant?variant:component;
  console.log(component);
  return presenter({component, variant: visualVariant, ...props});
};

export interface HeadingProps extends TypographyProps<'h1'>{
  /** 見出しのレベル level=3 ならh3になる。 */
  level?:1|2|3|4|5|6
  /** 見た目の大きさ。タグはlevelが優先される。設定されていなければlevelのものと同じになる。 */
  variant?:TypographyProps['variant']
}

/**
 * 見出し要素
 */
export const QiiHeading = ({
  level = 2,
  ...props
}:HeadingProps) => (
  <HeadingContainer
    presenter={HeadingPresenter}
    {...{level, ...props}}
  />
);
