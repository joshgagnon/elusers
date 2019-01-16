import * as React from 'react';
import Navbar from './navbar';
import { connect } from 'react-redux';
import Modals from './modals';
import * as HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DropTarget } from 'react-dnd';
//import { CSSTransition } from 'react-transition-group';

@(connect((state: EL.State) => ({uploads: state.uploads})) as any)
export class Uploads extends React.PureComponent<{uploads?: EL.Uploads}> {
    render() {
        return <React.Fragment>
        { Object.keys(this.props.uploads).map(key => {
            const document = this.props.uploads[key];
          // return <CSSTransition key={key} transitionName="progress" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
            return document.uploadStatus === EL.DocumentUploadStatus.InProgress &&
                <Notification key={key} isError={false}>
                    <div className="" style={{textAlign: 'center', marginBottom: 12}}>Uploading: { document.files[0].name }</div>
                    <div className="progress" key="progress">
                        <div className="progress-bar progress-bar-striped active" style={{width: `${document.progress*100}%`}}></div>
                    </div>
                </Notification>
                
          //  </CSSTransition>
        }) }
        </React.Fragment>
    }
}

interface ILayoutProps {
    user: EL.User;
    notifications: EL.INotifications;
    routes: any
}

@(DragDropContext(HTML5Backend) as any)
export class Layout extends React.PureComponent<ILayoutProps> {
    render() {
        const fluid = this.props.routes.some(c => c.component && c.component.FLUID_CONTAINER);

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
                    <Uploads />
                </div>
                <Modals />
            </div>
        );
    }
}

export default connect((state: EL.State) => ({ notifications: state.notifications, user: state.user }))(Layout);

interface INotificationProps {
    isError: boolean;
    children: string | JSX.Element | JSX.Element[];
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