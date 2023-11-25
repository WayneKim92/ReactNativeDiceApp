/**
 * If you non-experienced jsDoc, refer to https://devhints.io/jsdoc
 */

import React from 'react';
import { View,  } from 'react-native';

import type { ViewStyle  } from 'react-native';

interface SpacerDirection {
  /**
   * direction prop determines the direction of the Spacer.
   * @default: 'both'
   */
  direction?: 'both' | 'vertical' | 'horizontal';
}

interface FlexSpacerProps extends SpacerDirection {
  /**
   * flex type is joint 1st place priority. Strictly speaking, this is First.
   * If you don't know flex layout, Reference https://reactnative.dev/docs/flexbox.
   */
  flex: number;
  size?: never;
}

interface SizeSpacerProps extends SpacerDirection {
  /**
   * size has the lowest priority.
   * because The use of size is not recommended because UI & UX quality is often poor.
   */
  size?: number;
  flex?: never;
}

type SpacerProps = FlexSpacerProps | SizeSpacerProps;

/**
 * The Spacer component is responsible for handling the space UI.
 * This component can create 2 types of spaces that are flex and size type.
 */
export function Spacer(props: SpacerProps) {
  const { direction = 'both', flex, size: pixelSize, ...rest } = props;

  const value = pixelSize;

  const style: ViewStyle = {
    flex: flex !== null ? flex : undefined,
    width: direction === 'both' || direction === 'horizontal' ? value : undefined,
    height: direction === 'both' || direction === 'vertical' ? value : undefined,
  };

  return <View style={style} {...rest} />;
}
