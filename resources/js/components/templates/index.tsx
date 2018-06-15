import * as React from 'react';
import { connect } from 'react-redux';
import { SimpleFormLoader as FormLoader } from 'jasons-formal/lib/components/formLoader';
import Modals from 'jasons-formal/lib/components/modals';
import { UsersHOC, UserHOC, ContactsHOC } from '../hoc/resourceHOCs';
import Loading from '../loading';
import { Field as ReduxField } from 'redux-form';
import DocumentComponent from '../form-fields/documents';

class FileList extends React.PureComponent<{values: any}> {
    render() {
        if((this.props.values || {}).fileType === 'pdf'){
            return <ReduxField label="Documents to Append" name="documentsToAppend" component={DocumentComponent} />
        }
        return false;
    }
}

@(connect((state: EL.State) => ({user: state.user})) as any)
@UsersHOC()
@ContactsHOC()
export default class Templates extends React.PureComponent<any> {
    render() {
        if(!this.props.users.data || !this.props.contacts.data){
             return <Loading />
        }

        return (
            <div>
                <FormLoader
                    initialValues={{category: 'Evolution Templates', schema: 'letter'}}
                    formValues={{senders: [this.props.user]}}
                    context={{
                        users: this.props.users.data.map(user => {
                            return {value: user, title: `${user.firstName} ${user.surname}`}
                        }),

                        'recipients.individuals': this.props.contacts.data
                            .filter(contact => contact.type === 'individual')
                            .map((contact) => {
                                return {value: {...contact, "recipientType": "individuals"}, title: `${contact.firstName} ${contact.surname}`}
                            }),

                        'recipients.organisations': this.props.contacts.data
                            .filter(contact => contact.type === 'organisation')
                            .map((contact) => {
                                return {value: {...contact, "recipientType": "company", companyName: contact.name}, title: `${contact.name}`}
                            })

                    }} />
                <Modals fileFormatExtras={FileList} />
            </div>
        );
    }
}
