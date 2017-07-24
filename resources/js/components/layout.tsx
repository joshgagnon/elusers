import * as React from 'react';
import Navbar from './navbar';
import { connect } from 'react-redux';

interface ILayoutProps {
    user: EL.User;
    notifications: EL.INotifications;
}

@connect((state: EL.State) => ({ notifications: state.notifications }))
export default class Layout extends React.PureComponent<ILayoutProps, {}> {
    render() {
        const fluid = this.props.route.childRoutes.some(c => c.component.FLUID_CONTAINER);
        return (
            <div>
                <Navbar />

                <div className={fluid ? 'container-fluid' : 'container'}>
                    { this.props.children }
                </div>

                <div className="notifications">
                    {Object.keys(this.props.notifications).map(notificationKey =>
                        <Notification key={notificationKey} isError={this.props.notifications[notificationKey].isError}>
                            {this.props.notifications[notificationKey].message}
                        </Notification>)
                    }
                </div>
            </div>
        );
    }
}

interface INotificationProps {
    isError: boolean;
    children: string;
}

class Notification extends React.PureComponent<INotificationProps, EL.Stateless> {
    render() {
        return (
            <div className={`alert ${this.props.isError ? 'alert-danger' : 'alert-success'}`}>
                {this.props.children}
            </div>
        );
    }
}