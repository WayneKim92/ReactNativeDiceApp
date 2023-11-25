import { Component, SyntheticEvent } from 'react';
import { ViewProps } from 'react-native';
export interface NativeEngineViewProps extends ViewProps {
    isTransparent: boolean;
    antiAliasing: number;
    androidView: string;
    onSnapshotDataReturned?: (event: SyntheticEvent) => void;
}
export declare const NativeEngineView: {
    prototype: Component<NativeEngineViewProps>;
    new (props: Readonly<NativeEngineViewProps>): Component<NativeEngineViewProps>;
};
