import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';

class Wiki extends React.PureComponent<EL.Propless, EL.Stateless> {
    render() {
        return <h2></h2>;
    }
}


const WikiRoutes = (<Route path='wiki' component={ Wiki }>
   </Route>
);

export default WikiRoutes;

