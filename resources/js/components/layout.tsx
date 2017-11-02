import * as React from 'react';
import Navbar from './navbar';
import { connect } from 'react-redux';
import Modals from './modals';
import * as HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DropTarget } from 'react-dnd';



interface ILayoutProps {
    user: EL.User;
    notifications: EL.INotifications;
    routes: any
}

@DragDropContext(HTML5Backend)
@(connect((state: EL.State) => ({ notifications: state.notifications, user: state.user })) as any)
export default class Layout extends React.PureComponent<ILayoutProps> {
    render() {
        const fluid = this.props.routes.some(c => c.component.FLUID_CONTAINER);

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

                <Modals />
            </div>
        );
    }
}

interface INotificationProps {
    isError: boolean;
    children: string;
}

class Notification extends React.PureComponent<INotificationProps> {
    render() {
        return (
            <div className={`alert ${this.props.isError ? 'alert-danger' : 'alert-success'}`}>
                {this.props.children}
            </div>
        );
    }
}