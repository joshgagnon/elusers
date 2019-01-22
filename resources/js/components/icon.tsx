import * as React from 'react';


interface IIconProps {
    iconName: string;
    className?: string;
    onClick?: any;
}

export default class Icon extends React.PureComponent<IIconProps> {
    render() {
        const { iconName, className, ...rest } = this.props;
        return <i {...rest} className={`fa fa-${iconName} ${className || '' }`} aria-hidden="true"></i>;
    }
}