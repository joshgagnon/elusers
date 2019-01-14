import * as React from 'react';

export class LoadingSmall extends React.PureComponent {
    render() {
        return <div className='loading-small' />;
    }
}

export default class Loading extends React.PureComponent {
    render() {
        return <div className='loading' />;
    }
}