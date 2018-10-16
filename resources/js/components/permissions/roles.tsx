import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { connect } from 'react-redux';
import { RolesAndPermissionsHOC } from '../hoc/resourceHOCs';
import HasPermission from '../hoc/hasPermission';
import { Form, ButtonToolbar, Button, Col, FormGroup, ControlLabel, Alert, FormControl } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { createNotification, createResource, deleteResource, updateResource, confirmAction } from '../../actions';
import { push } from 'react-router-redux';

interface IRolesProps {
    rolesAndPermissions: EL.Resource<EL.RolesAndPermissions>;
}

const HEADINGS = ['Role', 'Actions']

@HasPermission('administer organisation roles')
@RolesAndPermissionsHOC()
@PanelHOC<IRolesProps>('Roles', props => props.rolesAndPermissions)
export default class Roles extends React.PureComponent<{rolesAndPermissions: EL.Resource<EL.RolesAndPermissions>}> {
    render() {
        const data : EL.Role[] = (this.props.rolesAndPermissions.data || {roles: []}).roles;
        const baseUrl = '/my-profile/organisation/roles';
        return <div>
                <ButtonToolbar>
                    <Link to={`${baseUrl}/create`} className="btn btn-primary"><Icon iconName="plus" />Create Role</Link>
                </ButtonToolbar>
                <Table headings={HEADINGS} lastColIsActions>
                    { data.map((role: EL.Role, index: number) => {
                        return <tr key={index}>
                            <td>{role.name}</td>
                            <td>
                                <Link to={`${baseUrl}/${role.id}/edit`} className="btn btn-sm btn-warning"><Icon iconName="pencil" />Edit</Link>
                            </td>
                        </tr> }) }
                </Table>



        </div>
    }
}





interface RoleFormProps {
    handleSubmit?: (data: React.FormEvent<Form>) => void;
    onSubmit: (data: React.FormEvent<Form>) => void;
    saveButtonText: string;
    form: string;
    permissions: EL.Permission[]
}

interface CreateRoleProps {
    submit: (data: React.FormEvent<Form>) => void;
    rolesAndPermissions?: EL.Resource<EL.RolesAndPermissions>;
}

interface EditRoleProps {
    submit: (data: React.FormEvent<Form>) => void;
}

class RoleForm extends React.PureComponent<RoleFormProps> {


    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
            <InputField name="name" label="Name" type="text"/>
                { this.props.permissions.map(permission => {
                    return <CheckboxField name={permission.name}  key={permission.name}>
                    { permission.name }
                    </CheckboxField>
                })}
            </Form>
        );
    }
}
const CreateRoleForm = (reduxForm({
    form: EL.FormNames.CREATE_ROLE_FORM,
})(RoleForm as any) as any);

const EditRoleForm = (reduxForm({
    form: EL.FormNames.EDIT_ROLE_FORM,
})(RoleForm as any) as any);
@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const url = 'roles';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Role created.'), (response) => push(`/roles/${response.id}`)],
                onFailure: [createNotification('Role creation failed. Please try again.', true)],
            };

            return createResource(url, data, meta)
        }
    }
) as any)
@RolesAndPermissionsHOC()
@PanelHOC<CreateRoleProps>('Create Role', props => props.rolesAndPermissions)
export class CreateRole extends React.PureComponent<CreateRoleProps> {
    render() {
        const data = {};
        return <CreateRoleForm initialValues={data} onSubmit={this.props.submit} saveButtonText="Create Role" permissions={this.props.rolesAndPermissions.data.permissions}/>
    }
}

interface UnwrappedEditRoleProps {
    submit?: (RoleId: number, data: React.FormEvent<Form>) => void;
    roleId: number;
    rolesAndPermissions?: EL.Resource<EL.RolesAndPermissions>;
}

@(connect(
    undefined,
    {
        submit: (roleId: number, data: React.FormEvent<Form>) => {
            const url = `roles/${roleId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Role updated.'), (response) => push(`/Roles/${roleId}`)],
                onFailure: [createNotification('Role update failed. Please try again.', true)],
            };

            return updateResource(url, data, meta);
        }
    }
) as any)
@RolesAndPermissionsHOC()
@PanelHOC<UnwrappedEditRoleProps>('Edit Role', props => props.rolesAndPermissions)
class UnwrappedEditRole extends React.PureComponent<UnwrappedEditRoleProps> {
    render() {
        const data = {};
        return <EditRoleForm initialValues={data} onSubmit={data => this.props.submit(this.props.roleId, data)} saveButtonText="Save Role" permissions={this.props.rolesAndPermissions.data.permissions}/>
    }
}

export class EditRole extends React.PureComponent<{ params: { roleId: number; } }> {
    render() {
        return <UnwrappedEditRole  roleId={this.props.params.roleId}  />
    }
}

