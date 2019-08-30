import * as React from 'react';
import UsersTable from './usersTable';
import { UsersHOC } from '../hoc/resourceHOCs';
import { name } from '../utils';
import { DropdownListField } from '../form-fields';

@UsersHOC()
export class UserSelector extends React.PureComponent<{users?: EL.Resource<EL.User[]>; name: string, label: string, required?: boolean}> {
    render() {
        if(!this.props.users.data){
            return false;
        }
        const renderName = user => user ? name(user) : 'None';
        return <DropdownListField
            name={this.props.name}
            label={this.props.label}
            data={this.props.users.data}
            placeholder="None"
            required={this.props.required}
            textField={renderName} valueField='id' />
    }
}

export default class Users extends React.PureComponent {
    render() {
        return <UsersTable />
    }
}