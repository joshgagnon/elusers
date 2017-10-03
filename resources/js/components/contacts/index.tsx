import * as React from 'react';
import { ContactsHOC } from '../hoc/resourceHOCs';
import Table from '../dataTable';
import PanelHOC from '../hoc/panelHOC';

interface ContactsProps {
    contacts: EL.Resource<EL.Contact[]>;
}

const HEADINGS = ['ID', 'Name', 'Email', 'Phone'];

@ContactsHOC()
@(PanelHOC('Contacts', [(props: ContactsProps) => props.contacts]) as any)
export default class Contacts extends React.PureComponent<ContactsProps> {
    render() {
        return (
            <div>
                <Table headings={HEADINGS}>
                    { this.props.contacts.data.map(contact => (
                        <tr key={contact.id}>
                            <td>{contact.id}</td>
                            <td>{contact.name}</td>
                            <td><a href={ 'mailto:' + contact.email }>{contact.email}</a></td>
                            <td>{contact.phone}</td>
                        </tr>
                    )) }
                </Table>
            </div>
        );
    }
}