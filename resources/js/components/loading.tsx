import * as React from 'react';
import { Fade } from 'components/animations';


export class LoadingSmall extends React.PureComponent {
    render() {
        return <div className='loading-small' />;
    }
}

export default class Loading extends React.PureComponent<{overlay?: boolean, show?: boolean}> {
    render() {
        if(this.props.overlay) {
            return <Fade in={this.props.show} fullSize>
                <div className="loading-overlay">
                <div className="loading-offset">
                <div className='loading' />
                </div>
                </div>
                </Fade>
        }
        return <div className='loading' />;
    }
}