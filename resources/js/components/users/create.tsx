import * as React from 'react';
import PanelHOC from '../hoc/panelHoc';

@PanelHOC('Create User')
export default class CreateUser extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <h1>Create User</h1>;
    }
}