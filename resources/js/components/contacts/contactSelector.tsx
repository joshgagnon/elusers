import * as React from 'react';
import { ContactsHOC, ContactHOC } from '../hoc/resourceHOCs';
import { DropdownListField  } from '../form-fields';
import { fullname } from '../utils';





@ContactsHOC()
export class ContactSelector extends React.PureComponent<{contacts?: EL.Resource<EL.Contact[]>; name?: string; label?: string; required?: boolean; naked?: boolean}> {
    render() {
        if(!this.props.contacts.data){
            return false;
        }
        const renderName = contact => {
            if(!contact){
                return "None";
            }
           return fullname(contact);
       };
        return <DropdownListField name={this.props.name || "agentId"} label={this.props.label || "Agent"} naked={this.props.naked}
            placeholder="None" data={[...this.props.contacts.data]} textField={renderName} valueField='id' required={this.props.required}/>
    }
}

