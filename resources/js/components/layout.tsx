import * as React from 'react';
import Navbar from './navbar';

interface ILayoutProps {
    user: EL.User;
    children: any;
}

export default class Layout extends React.PureComponent<ILayoutProps, {}> {
    render() {
        const fluid = this.props.route.childRoutes.some(c => c.component.FLUID_CONTAINER);
        return (
            <div>
                <Navbar />

                <div className={fluid ? 'container-fluid' : 'container'}>
                    { this.props.children }
                </div>
            </div>
        );
    }
}