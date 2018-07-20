import * as React from 'react';
import { connect } from 'react-redux';
import { ContactSelector } from '../contacts/contactSelector';
import { UserSelector } from '../users';
import { SelectField } from '../form-fields';

interface ReferrerOwnProps {
    selector: (state: EL.State, ...field: string[]) => any;
}

interface ReferrerStateProps {
    referrerType: string;
}

type ReferrerProps = ReferrerOwnProps & ReferrerStateProps;


class Referrer extends React.PureComponent<ReferrerProps>{
    referrerTypes = [{
        value: 'Contact', text: 'Contact'
    }, {
        value: 'User', text: 'User'
    }];

    render() {
        return <React.Fragment>
                <SelectField name="referrerType" label="Referrer Type" options={this.referrerTypes} prompt/>
                { this.props.referrerType === 'Contact' && <ContactSelector name="referrerId" label="Contact" />}
                { this.props.referrerType === 'User' && <UserSelector name="referrerId" label="User" /> }
        </React.Fragment>
    }
}


const mapStateToProps = (state: EL.State, ownProps: ReferrerOwnProps) : ReferrerStateProps => {
    return {referrerType: ownProps.selector(state, 'referrerType')};
};

export default connect<ReferrerStateProps, void, ReferrerOwnProps>(mapStateToProps)(Referrer);
