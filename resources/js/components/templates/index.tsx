import * as React from 'react';
import { SimpleFormLoader as FormLoader } from 'jasons-formal/lib/components/formLoader';
import Modals from 'jasons-formal/lib/components/modals';
import { UsersHOC } from '../hoc/resourceHOCs';
import Loading from '../loading';


@UsersHOC()
export default class Templates extends React.PureComponent<any> {
    render() {
        if(!this.props.users.data){
             return <Loading />
        }
        return (
            <div>
                <FormLoader initialValues={{category: 'Evolution Templates', schema: 'letter'}} context={{users: this.props.users.data.map(user => {
                    return {value: user, title: `${user.firstName} ${user.surname}`}
                })}} />
                <Modals />
            </div>
        );
    }
}
