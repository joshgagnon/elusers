import * as React from 'react';
import PanelHOC from '../hoc/panelHOC';
import { connect } from 'react-redux';
import { RolesAndPermissionsHOC, UserHOC } from '../hoc/resourceHOCs';
import HasPermission from '../hoc/hasPermission';
import { Form, ButtonToolbar, Button, Col, FormGroup, ControlLabel, Alert, FormControl } from 'react-bootstrap';
import Table from '../dataTable';
import { Link } from 'react-router';
import Icon from '../icon';
import { InputField, SelectField, DropdownListField, DocumentList, DatePicker, CheckboxField, TextArea } from '../form-fields';
import { reduxForm, formValueSelector, FieldArray, FormSection } from 'redux-form';
import { createNotification, createResource, deleteResource, updateResource, confirmAction } from '../../actions';
import { push } from 'react-router-redux';
import { validate } from '../utils/validation';
import mapParamsToProps from '../hoc/mapParamsToProps';

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
    delete?: () => void;
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
    rolesAndPermissions?: EL.Resource<EL.RolesAndPermissions>;
}

class RoleForm extends React.PureComponent<RoleFormProps> {


    render() {
        const categories = this.props.permissions.reduce((acc: any, permission: EL.Permission) => {
            const cat = permission.category || 'administration';
            acc[cat] = [...(acc[cat] || []), permission];
            return acc;
        }, {});

        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
            <InputField name="name" label="Role Name" type="text" required/>
            <FormSection name="permissions">
            { Object.keys(categories).sort().map(key => {
                return <fieldset key={key}>
                    <h4 className="text-center">{ key }</h4>
                    { categories[key].sort(function (a, b) {
                          return a.name.localeCompare(b.name);
                        }).map(permission => {
                        return <CheckboxField name={permission.name}  key={permission.name}>
                        { permission.name }
                        </CheckboxField>
                    }) }

                    </fieldset>
            }) }
            </FormSection>
                <div className="button-row">
                    { this.props.delete && <Button bsStyle="danger" onClick={this.props.delete}>Delete</Button> }
                    <Button bsStyle="primary"  type="submit">{ this.props.saveButtonText }</Button>
                </div>
            </Form>
        );
    }
}

const roleValidationRules: EL.IValidationFields = {
    name: { name: 'Name', required: true },
}

const validateRole = values => {
    const errors = validate(roleValidationRules, values);
    return errors;
}

const CreateRoleForm = (reduxForm({
    form: EL.FormNames.CREATE_ROLE_FORM,
    validate: validateRole
})(RoleForm as any) as any);

const EditRoleForm = (reduxForm({
    form: EL.FormNames.EDIT_ROLE_FORM,
    validate: validateRole
})(RoleForm as any) as any);


const formatRoleForm = (data: any) => {
    return {
        name: data.name,
        permissions: Object.keys(data.permissions || {}).map(key => {
            if(data.permissions[key]){
                return key;
            }
        })
        .filter(permission => !!permission)
    }
}

@(connect(
    undefined,
    {
        submit: (data: React.FormEvent<Form>) => {
            const roleData = formatRoleForm(data);
            const url = 'roles';
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Role created.'), (response) => push(`/my-profile/organisation/roles`)],
                onFailure: [createNotification('Role creation failed. Please try again.', true)],
            };

            return createResource(url, roleData, meta)
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
    submit?: (roleId: number, data: React.FormEvent<Form>) => void;
    delete?: (roleId: number) => void;
    roleId: number;
    rolesAndPermissions?: EL.Resource<EL.RolesAndPermissions>;
}

@(connect(
    undefined,
    {
        submit: (roleId: number, data: React.FormEvent<Form>) => {
            const roleData = formatRoleForm(data);
            const url = `roles/${roleId}`;
            const meta: EL.Actions.Meta = {
                onSuccess: [createNotification('Role updated.'), (response) => push(`/my-profile/organisation/roles`)],
                onFailure: [createNotification('Role update failed. Please try again.', true)],
            };

            return updateResource(url, roleData, meta);
        },
        delete: (roleId: string) => {
            const deleteAction = deleteResource(`role/${roleId}`, {
                onSuccess: [createNotification('Role deleted.'), (response) => push('/my-profile/organisation/roles')],
                onFailure: [createNotification('Role deletion failed. Please try again.', true)],
            });

            return confirmAction({
                title: 'Confirm Delete this Role',
                content: 'Are you sure you want to delete this role?',
                acceptButtonText: 'Delete',
                declineButtonText: 'Cancel',
                onAccept: deleteAction
            });
        }
    }
) as any)
@RolesAndPermissionsHOC()
@PanelHOC<UnwrappedEditRoleProps>('Edit Role', props => props.rolesAndPermissions)
class UnwrappedEditRole extends React.PureComponent<UnwrappedEditRoleProps> {
    render() {
        const data = {...this.props.rolesAndPermissions.data.roles.find(r => r.id === this.props.roleId)};
        if(!data) {
            return <div className="alert alert-danger">Not Found</div>
        }
        data.permissions = data.permissions.reduce((acc: any, perm: EL.Permission) => {
            acc[perm.name] = true;
            return acc;
        }, {});
        return <EditRoleForm initialValues={data} delete={() => this.props.delete(this.props.roleId)}
            onSubmit={data => this.props.submit(this.props.roleId, data)} saveButtonText="Save Role"
            permissions={this.props.rolesAndPermissions.data.permissions} />
    }
}

export class EditRole extends React.PureComponent<{ params: { roleId: number; } }> {
    render() {
        return <UnwrappedEditRole  roleId={parseInt(this.props.params.roleId as any, 10)}  />
    }
}




@mapParamsToProps(['userId'])
@UserHOC()
@RolesAndPermissionsHOC()
@PanelHOC<any>('Roles', props => [props.user, props.rolesAndPermissions])
export class UserRoles extends React.PureComponent<{user?: EL.Resource<EL.User>}> {
    render() {
        return <div>WIP</div> /*<EditUserRolesForm initialValues={this.props.user.data.roles}
            onSubmit={data => this.props.submit(data)}
            permissions={this.props.rolesAndPermissions.data.roles} />*/
    }
}


