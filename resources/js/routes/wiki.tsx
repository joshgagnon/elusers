import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';
import { WikiHOC, WikiIndexHOC } from '../components/hoc/resourceHOCs';
import PanelHOC from '../components/hoc/panelHOC';
import Panel from '../components/panel';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Form } from 'react-bootstrap';
import { InputField } from '../components/form-fields';
import { Field as ReduxField } from 'redux-form';
import { Markdown } from 'react-showdown';
import { IFieldComponentProps } from '../components/baseFieldComponent';
import { Button } from 'react-bootstrap';

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

interface WikiPageEditFormProps {
    handleSubmit: React.EventHandler<React.FormEvent<HTMLFormElement>>;
    handleDelete: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

class Wiki extends React.PureComponent<WikiProps, EL.Stateless> {
    static readonly FLUID_CONTAINER = true;
    render() {
        return <div>
        { this.props.children }
        </div>
    }
}

@PanelHOC('Knowledge Base')
class WikiRootPanel extends React.PureComponent<WikiRootProps, EL.Stateless> {
    render() {
        return <div>
            <h2>Index of all Articles</h2>

            </div>
    }
}

@WikiIndexHOC()
class WikiRoot extends React.PureComponent<WikiRootProps, EL.Stateless> {
    render() {
        return <div className="container">
            <WikiRootPanel wiki={this.props.wiki} />
            </div>
    }
}


class WikiPageDetailsForm extends React.PureComponent<WikiPageEditFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="title" label="Title" type="text" />
                <InputField name="keywords" label="Keywords" type="text" />
                <InputField name="categories" label="Categories" type="text" />
                <div className="text-center">
                    <Button bsStyle="danger" onClick={this.props.handleDelete}>Delete</Button>
                    <Button bsStyle="primary" type="submit">Save</Button>
                </div>
            </Form>
        );
    }
}


class WikiPageBodyForm extends React.PureComponent<WikiPageEditForm, EL.Stateless> {
    render() {
        return (<div className="markdown-editor">
                <a href="https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax" target="_blank">Documentation</a>
                <ReduxField name="data" component={'textarea'} />
                </div>
        );
    }
}

class RenderMarkdown extends React.PureComponent<IFieldComponentProps, EL.Stateless>{
    render() {
        return <Markdown markup={ this.props.input.value } />
    }
}

class WikiPagePreview extends React.PureComponent<WikiPageEditFormProps, EL.Stateless> {
    render() {
        return (
                <ReduxField name="data" component={RenderMarkdown} />
        );
    }
}

@WikiHOC()
@reduxForm({
    form: 'wiki-edit'
})
class WikiPageWithPath extends React.PureComponent<WikiPageWithPathProps, EL.Stateless> {
    render() {
        return <div>
         <div className="container">
             <Row>
                 <Col md={12}>
                     <Panel title="Edit Page">
                         <WikiPageDetailsForm />
                     </Panel>
                 </Col>
                </Row>
         </div>
             <Row>
                 <Col md={6}>
                     <Panel title="Markdown">
                         <WikiPageBodyForm />
                     </Panel>
                </Col>
                 <Col md={6}>
                     <Panel title="Preview">
                         <WikiPagePreview />
                     </Panel>
                </Col>
            </Row>
        </div>
    }
}

class WikiPage extends React.PureComponent<WikiPageProps, EL.Stateless> {
    render() {
        return <WikiPageWithPath wikiPath={this.props.routeParams.splat} edit={false}/>
    }
}

const WikiRoutes = (<Route path='wiki' component={ Wiki } >
                    <IndexRoute component={ WikiRoot } />
                    <Route path="*" component={ WikiPage } />
   </Route>
);

export default WikiRoutes;

