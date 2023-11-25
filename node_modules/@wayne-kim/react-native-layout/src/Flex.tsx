import React from 'react';
import { View } from 'react-native';

import type { ReactElement } from 'react';
import type { ViewStyle, FlexStyle } from 'react-native';
import type { EdgeInsets } from './EdgeInsets';

export interface FlexProps {
  direction?: 'column' | 'row';
  style?: ViewStyle | ViewStyle[];
  children?: Element | Element[] | ReactElement | ReactElement[] | undefined;
  justifyContent?: FlexStyle['justifyContent'];
  alignItems?: FlexStyle['alignItems'];
  flex?: FlexStyle['flex'];
  flexGrow?: FlexStyle['flexGrow'];
  flexShrink?: FlexStyle['flexShrink'];
  flexBasis?: FlexStyle['flexBasis'];
  flexWrap?: FlexStyle['flexWrap'];
  edgeInsets?: EdgeInsets;
}

export function Flex(props: FlexProps) {
  const {
    direction = 'column',
    style,
    edgeInsets = {},
    justifyContent,
    alignItems,
    flexBasis,
    flexGrow,
    flexShrink,
    flexWrap,
    ...otherProps
  } = props;

  const viewStyle: ViewStyle = {
    flexDirection: direction,
    justifyContent,
    alignItems,
    flexBasis,
    flexGrow,
    flexShrink,
    flexWrap,
    ...edgeInsets,
  };

  // @ts-ignore
  return <View style={[viewStyle, style]} {...otherProps} />;
}
