import * as React from 'react';

interface IIconProps {
    iconName: string;
}

export default class Icon extends React.PureComponent<IIconProps> {
    render() {
        return <i className={`fa fa-${this.props.iconName}`} aria-hidden="true"></i>;
    }
}