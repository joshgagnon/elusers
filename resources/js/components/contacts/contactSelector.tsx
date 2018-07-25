import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import { DropdownListField  } from '../form-fields';
import { fullname } from '../utils';





@ContactsHOC()
export class ContactSelector extends React.PureComponent<{contacts?: EL.Resource<EL.Contact[]>; name: string; label?: string; required?: boolean; naked?: boolean}> {
    render() {
        const data = this.props.contacts.data || [];

        const renderName = contact => {
            if(!contact){
                return "None";
            }
           return fullname(contact);
       };
    return <DropdownListField name={this.props.name} label={this.props.label} naked={this.props.naked} busy={!this.props.contacts.data}
        placeholder="None" data={data} textField={renderName} valueField='id' required={this.props.required}/>
    }
}

