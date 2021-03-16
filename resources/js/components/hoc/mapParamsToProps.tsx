import * as React from 'react';

export default function mapParamsToProps(paramNames: string[]) {
    return function<T extends React.Component<any, any>>(ComposedComponent: () => T) {
        class PanelWithContent extends React.PureComponent<any, any> {
            render() {
                let paramProps = {};

                paramNames.map(paramName => paramProps[paramName] = this.props.params[paramName]);

                // @ts-ignore
                return <ComposedComponent {...this.props} {...paramProps} /> ; //React.cloneElement(ComposedComponent, props);
            }
        }

        return PanelWithContent;
    } as any
}