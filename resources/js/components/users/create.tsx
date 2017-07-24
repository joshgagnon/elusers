import * as React from 'react';
import PanelHOC from '../hoc/panelHoc';
import { Form } from 'react-bootstrap';
import { BasicDetailsFormFields } from '../my-profile/basicDetails';

@PanelHOC('Create User')
@reduxForm()
export default class CreateUser extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return (
            <Form>
                <BasicDetailsFormFields />
            </Form>
        );
    }
}