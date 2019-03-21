import * as React from 'react';
import { connect } from 'react-redux';
import { toggleSomething } from '../actions/index';
import Panel from 'components/panel';
import { Row, Col } from 'react-bootstrap';
import { UserHOC } from 'components/hoc/resourceHOCs';
import { name } from 'components/utils';
import { hasPermission } from 'components/utils/permissions';
import { Link } from 'react-router';
import Icon from 'components/icon';
import Deadlines from 'components/deadlines';

const HomeActions = (props: {user: EL.User}) => {
    return <div className="text-center">
    <div className="btn-group" >
        { hasPermission(props.user, 'create matter')  && <Link to="/matters/create" className="btn btn-primary"><Icon iconName="plus" />Create Matter</Link> }
        { hasPermission(props.user, 'create contact')  && <Link to="/contacts/create" className="btn btn-success"><Icon iconName="plus" />Create Contact</Link> }
        { <Link to="/cpdpr/create" className="btn btn-warning"><Icon iconName="plus" />Add CPDPR</Link> }
    </div>
    </div>
}

class Home extends React.PureComponent<{user: EL.User}> {


    render() {
        return <Row className="sea-foreground">
            <Col md={6}>
            <Panel title={`Hello ${name(this.props.user)}`}>
                <HomeActions {...this.props} />
            </Panel>
            </Col>
            <Col md={6}>
                <Deadlines />
            </Col>
        </Row>
    }
}



const ConnectedHome = connect((state: EL.State) => ({user: state.user}))(Home);


(ConnectedHome as any).BG_COMPONENT = (props) => <div className="sea-background" />;

export default ConnectedHome;