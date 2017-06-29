import * as React from 'react';
import Panel from '../panel';

interface IEditOrganisationProps {}
interface IEditOrganisationState {}

export default class EditOrganisation extends React.PureComponent<IEditOrganisationProps, IEditOrganisationState> {
    render() {
        return (
            <Panel title="Edit Organisation">
                <h1>Edit Org</h1>
            </Panel>
        );
    }
}
