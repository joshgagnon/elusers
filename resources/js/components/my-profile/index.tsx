import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';

@PanelHOC()
export default class MyProfile extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <h1>Profile</h1>;
    }
}