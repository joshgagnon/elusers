import * as React from 'react';
import { connect } from 'react-redux';
import { SimpleFormLoader as FormLoader } from 'jasons-formal/lib/components/formLoader';
import Modals from 'jasons-formal/lib/components/modals';
import { UsersHOC, UserHOC, ContactsHOC } from '../hoc/resourceHOCs';
import Loading from '../loading';


@(connect((state: EL.State) => ({user: state.user})) as any)
@UsersHOC()
@ContactsHOC()
export default class Templates extends React.PureComponent<any> {
    render() {
        if(!this.props.users.data || !this.props.contacts.data){
             return <Loading />
        }
        console.log(this.props.user);
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
                            .filter(contact => contact.type === 'organisations')
                            .map((contact) => {
                                return {value: {...contact, "recipientType": "company"}, title: `${contact.name}`}
                            })

                    }} />
                <Modals />
            </div>
        );
    }
}
