import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';
import { WikiHOC, WikiIndexHOC } from '../components/hoc/resourceHOCs';
import PanelHOC from '../components/hoc/panelHOC';

interface WikiProps {
    children: any;
}
interface WikiRootProps {
    wiki: any;
}

interface WikiPageWithPathProps {
    wikiPath: string,
    edit: boolean
}


interface WikiPageProps {
    routeParams: any;
}


class Wiki extends React.PureComponent<WikiProps, EL.Stateless> {
    render() {
        return <div>
        { this.props.children }
        </div>
    }
}

@PanelHOC('Knowledge Base')
@WikiIndexHOC()
class WikiRoot extends React.PureComponent<WikiRootProps, EL.Stateless> {
    render() {
        return <h2>Index of all Articles</h2>;
    }
}

@WikiHOC()
class WikiPageWithPath extends React.PureComponent<WikiPageWithPathProps, EL.Stateless> {
    render() {
        return <div>

        </div>
    }
}

class WikiPage extends React.PureComponent<WikiPageProps, EL.Stateless> {
    render() {
        return <WikiPageWithPath wikiPath={this.props.routeParams.splat} edit={false}/>
    }
}

const WikiRoutes = (<Route path='wiki' component={ Wiki }>
                    <IndexRoute component={ WikiRoot } />
                    <Route path="*" component={ WikiPage } />
   </Route>
);

export default WikiRoutes;

