import * as React from 'react';
import Navbar from './navbar';

interface ILayoutProps {
    user: EvolutionUsers.IUser;
    children: any;
}

export default class Layout extends React.PureComponent<ILayoutProps, {}> {
    render() {
        return (
            <div>
                <Navbar />

                <div className="container">
                    { this.props.children }
                </div>
            </div>
        );
    }
}