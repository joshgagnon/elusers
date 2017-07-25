import * as React from 'react';
import { Route, IndexRoute, RouteComponent } from 'react-router';
import { WikiHOC, WikiIndexHOC } from '../components/hoc/resourceHOCs';
import PanelHOC from '../components/hoc/panelHOC';
import Panel from '../components/panel';
import { Field, reduxForm } from 'redux-form';
import { Row, Col, Form, ListGroup } from 'react-bootstrap';
import { InputField } from '../components/form-fields';
import { Field as ReduxField } from 'redux-form';
import { Markdown } from 'react-showdown';
import { IFieldComponentProps } from '../components/form-fields/baseFieldComponent';
import { Button } from 'react-bootstrap';
import { validate } from '../components/utils/validation';
import { connect } from 'react-redux';
import { createResource, updateResource } from '../actions/index';
import { Link } from 'react-router';


interface WikiProps {
    children: any;
}
interface WikiRootProps {
    wiki: any;
}

interface WikiPageWithPathProps {
    wikiPath: string,
    edit: boolean,
    create: Function,
    update: Function
}


interface WikiPageProps {
    routeParams: any;
}

interface WikiPageEditFormProps {
    handleSubmit: (data: React.FormEvent<Form>) => void;
   // handleDelete: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

class Wiki extends React.PureComponent<WikiProps, EL.Stateless> {
    static readonly FLUID_CONTAINER = true;
    render() {
        return <div>
        { this.props.children }
        </div>
    }
}


class WikiRootPanel extends React.PureComponent<WikiRootProps, EL.Stateless> {
    render() {
        return <div>
            { (this.props.wiki.data || []).map((e, i) => {
                return <Panel title={e.category || 'No Category'} key={i}>
                    <ul>
                        { e.articles.map((a, j) => <li key={j}><Link to={`/wiki/${a.path}`}>{ a.title }</Link></li>) }
                    </ul>
                      </Panel>
                   }) }
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

@reduxForm({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values) }
})
class WikiPageDetailsForm extends React.PureComponent<WikiPageEditFormProps, EL.Stateless> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit} horizontal>
                <InputField name="title" label="Title" type="text" />
                <InputField name="keywords" label="Keywords" type="text" />
                <InputField name="categories" label="Categories" type="text"/>
                <div className="text-center">
                <Link className="btn btn-default" to={`/wiki/${this.props.wikiPath}`}>Close</Link>
                    { /** <Button bsStyle="danger" onClick={this.props.handleDelete}>Delete</Button> */ }
                    <Button bsStyle="primary" type="submit">Save</Button>
                </div>
            </Form>
        );
    }
}

@reduxForm({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values) }
})
class WikiPageBodyForm extends React.PureComponent<WikiPageEditFormProps, EL.Stateless> {
    render() {
        return (<div className="markdown-editor">
                <div className="text-right"><a href="https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax" target="_blank">View Documentation <i className="glyphicon glyphicon-new-window"/></a></div>
                <ReduxField name="data" component={'textarea'} />
                </div>
        );
    }
}

class RenderMarkdown extends React.PureComponent<IFieldComponentProps, EL.Stateless>{
    render() {
        return <div className="markdown"><Markdown markup={ this.props.input.value } /></div>
    }
}

@reduxForm({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values) }
})
class WikiPagePreview extends React.PureComponent<WikiPageEditFormProps, EL.Stateless> {
    render() {
        return (
             <ReduxField name="data" component={RenderMarkdown} />
        );
    }
}
const validationRules: EL.IValidationFields = {
    title:  { name: 'Title',  required: true },
};


@connect(undefined, {
    create: (url, data) => createResource(url, data),
    update: (url, data) => updateResource(url, data)
})
class EditWikiPageWithPath extends React.PureComponent<WikiPageWithPathProps, EL.Stateless> {

    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    submit(values) {
        values = {
            title: values.title,
            data: values.data || '',
            keywords: JSON.stringify((values.keywords || '').split(' | ')),
            categories: JSON.stringify((values.categories || '').split(' | '))
        };
        (this.props.wikiPage.data ? this.props.update : this.props.create)(`wiki/${this.props.wikiPath}`, values)
    }

    render() {
        return <div>
         <div className="container">
             <Panel title="Edit Page">
                 <WikiPageDetailsForm onSubmit={this.submit} initialValues={this.props.values} wikiPath={this.props.wikiPath}/>
             </Panel>
         </div>
             <Row>
                 <Col md={6}>
                     <Panel title="Markdown">
                         <WikiPageBodyForm />
                     </Panel>
                </Col>
                 <Col md={6}>
                     <Panel title="Preview">
                         <WikiPagePreview  />
                     </Panel>
                </Col>
            </Row>
        </div>
    }
}

class Categories extends React.PureComponent<CategoryProps, EL.Stateless> {
    render() {
        return <Panel title={this.props.title}>

            { this.props.items.map((item, i) => {
                return <div key={i}><Link to={`/wiki/${item.path}/`}>{item.title}</Link></div>
            })
            }

         </Panel>
    }
}

@WikiHOC()
class WikiPageWithPath extends React.PureComponent<WikiPageWithPathProps, EL.Stateless> {

    renderBody(title, value) {
        return <Panel title={title}>
             <RenderMarkdown input={{value: value}} />
             <hr />
             <div className="text-right"><Link className="btn btn-primary" to={{query: {edit: true}, pathname: `/wiki/${this.props.wikiPath}`}}>Edit Page</Link></div>
         </Panel>
    }

    render() {
        if(this.props.wikiPage.isFetching){
            return false;
        }
        let values = {...this.props.wikiPage.data};
        if(values.categories){
            values.categories = JSON.parse(values.categories).join(" | ");
         }
        if(values.keywords){
            values.keywords = JSON.parse(values.keywords).join(" | ");
        }
        else{
            values = {};
        }
        if(this.props.edit){
            return <EditWikiPageWithPath wikiPage={this.props.wikiPage} values={values} wikiPath={this.props.wikiPath}/>
        }
        const title = values.title || 'New Page';
        if(values.categoryGroup){
            return <div className="container">
            <Row>
                <Col md={3}>
                    <Categories items={values.categoryGroup} title={values.categories}  />
                </Col>
                <Col md={9}>
                    { this.renderBody(title, values.data) }
                </Col>
                </Row>
            </div>
        }
        return <div className="container">
              { this.renderBody(title, values.data) }
         </div>
    }
}

class WikiPage extends React.PureComponent<WikiPageProps, EL.Stateless> {
    render() {
        return <WikiPageWithPath wikiPath={this.props.routeParams.splat} edit={this.props.location.query.edit === 'true'}/>
    }
}

const WikiRoutes = (<Route path='wiki' component={ Wiki } >
                    <IndexRoute component={ WikiRoot } />
                    <Route path="*" component={ WikiPage } />
   </Route>
);

export default WikiRoutes;

