import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { reduxForm } from 'redux-form';
import { Combobox, DatePicker, InputField } from '../form-fields';
import { connect } from 'react-redux';

interface IMyProfileProps {
    user: EL.User;
}

interface IMyProfileFormProps {
    handleSubmit: (data: object) => void;
}

export default class MyProfileWrapper extends React.PureComponent<IMyProfileProps, EL.Stateless> {
    render() {
        return (
            <div>
                <h2>My Profile</h2>

                <MyProfile />
            </div>
        );
    }
}

@connect((state: EL.State) => ({ user: state.user }))
@PanelHOC()
class MyProfile extends React.PureComponent<IMyProfileFormProps, EL.Stateless> {
    render() {
        return (
            <div>
                <MyProfileForm handleSubmit={(data: object) => console.log(data)} initialValues={this.props.user} />

                <hr />
            </div>
        );
    }
}

@reduxForm({ form: 'my-profile-form', validate: validateMyProfileForm })
class MyProfileForm extends React.PureComponent<IMyProfileFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit } horizontal>
                <Combobox name="title" label="Title" data={["Mr", "Mrs", "Ms"]} />
                
                <InputField name="firstName" label="First Name" type="text" />
                <InputField name="middleName" label="Middle Name" type="text" />
                <InputField name="surname" label="Surname" type="text" />

                <InputField name="preferredName" label="Preferred Name" type="text" />

                <InputField name="email" label="Email" type="email" />

                <DatePicker name="lawAdmissionDate" label="Law Admission Date" />
                <InputField name="irdNumber" label="IRD Number" type="text" />
                <InputField name="bankAccountNumber" label="Bank Account Number" type="text" />

                <Button bsStyle="primary" className="pull-right" type="submit">Save</Button>
            </Form>
        );
    }
}

function validateMyProfileForm(values: any) {
    let errors: EL.ValidationErrors = {};

    // Title
    if (!values.title) {
        errors.title = 'Required';
    } else if (values.title.length > 255) {
        errors.title = 'Must be 255 characters or less';
    }

    return errors
}