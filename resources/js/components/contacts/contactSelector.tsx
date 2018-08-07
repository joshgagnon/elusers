import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import { DropdownListField  } from '../form-fields';
import { fullname } from '../utils';
import { showCreateContactModal } from '../../actions';
import { connect } from 'react-redux';
import { FormName } from 'redux-form';


@(connect(undefined, {
    showCreateContactModal
}) as any)
@ContactsHOC()
class ContactSelectorDropdown extends React.PureComponent<{contacts?: EL.Resource<EL.Contact[]>; form: string, name: string; label?: string; required?: boolean; naked?: boolean, showCreateContactModal?: ({form, name}) => void}> {
    render() {
        const data = this.props.contacts.data || [];
        const renderName = contact => {
            if(!contact || typeof contact !== 'object'){
                return "None";
            }
           return fullname(contact);
       };
    return <DropdownListField name={this.props.name} label={this.props.label} naked={this.props.naked} busy={!this.props.contacts.data}
        allowCreate={true}
        onCreate={() => this.props.showCreateContactModal({form: this.props.form, name: this.props.name}) }
        placeholder="None" data={data} textField={renderName} valueField='id' required={this.props.required}/>
    }
}

export const ContactSelector = (props) => {
    return  <FormName children={(formProps) => {
        return <ContactSelectorDropdown {...props} form={formProps.form} />
    }} />
}