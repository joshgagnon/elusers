import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { Row, Col, Form } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import FieldComponent from '../form-fields/fieldComponent';
import { connect } from 'react-redux';

interface IMyProfileProps {
    user: EL.User;
}

interface IMyProfileFormProps {
    handleSubmit: (data: object) => void;
}

@connect((state: EL.State) => ({ user: state.user }))
export default class MyProfile extends React.PureComponent<IMyProfileProps, EL.Stateless> {
    render() {
        return (
            <div>
                <h2>My Profile</h2>
                <MyProfileForm handleSubmit={(data: object) => console.log(data)} initialValues={this.props.user} />
            </div>
        );
    }
}

@PanelHOC()
@reduxForm({ form: 'my-profile-form', validate: validateMyProfileForm })
class MyProfileForm extends React.PureComponent<IMyProfileFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={ this.props.handleSubmit }>
                <Field name="title" label="Title" component={FieldComponent} type="text" />
                
                <Field name="firstName" label="First Name" component={FieldComponent} type="text" />
                <Field name="middleName" label="Middle Name" component={FieldComponent} type="text" />
                <Field name="surname" label="Surname" component={FieldComponent} type="text" />

                <Field name="preferredName" label="Preferred Name" component={FieldComponent} type="text" />

                <Field name="email" label="Email" component={FieldComponent} type="email" />

                <Field name="lawAdmissionDate" label="Law Admission Date" component={FieldComponent} type="date" />
                <Field name="irdNumber" label="IRD Number" component={FieldComponent} type="text" />
                <Field name="bankAccountNumber" label="Bank Account Number" component={FieldComponent} type="text" />
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