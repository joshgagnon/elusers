import * as React from 'react';
import { Route, IndexRoute} from 'react-router';
import { WikiHOC, WikiIndexHOC } from '../components/hoc/resourceHOCs';
import Card from '../components/Card';
import {  reduxForm } from 'redux-form';
import { Row, Col, Form, ListGroup } from 'react-bootstrap';
import { InputField } from '../components/form-fields';
import { Field as ReduxField } from 'redux-form';
import { Markdown } from 'react-showdown';
import { Button } from 'react-bootstrap';
import { validate } from '../components/utils/validation';
import { connect } from 'react-redux';
import { createResource, updateResource } from '../actions/index';
import { Link } from 'react-router';


interface WikiProps {
    children: any;
}

interface Article {
    title: string,
    path: string
}
interface WikiData {
    articles: Article[],
    category: string
}

interface WikiRootProps {
    wiki: {
        data: WikiData[]
    },
}

interface WikiPage {
    title: string,
    data: string,
    keywords: string,
    categories: string
}

interface WikiPageForm {
    title?: string,
    data?: string,
    keywords?: string,
    categories?: string
}

interface WikiPageWithPathProps {
    wikiPath: string,
    edit?: boolean,
}

interface InjectedWikiPageWithPathProps extends WikiPageWithPathProps {
    wikiPage?: {
        data: WikiPage,
        isFetching: boolean
    }
}


interface WikiPageUpdateProps {
    update?: Function,
    create?: Function,
    values?: WikiPageForm,
    wikiData?: WikiData,
}

interface WikiPagePreviewProps {
    values: WikiPageForm
}

interface WikiPageProps {
    routeParams: any
    location: any,
}

interface Category {
    title: string,
    value: string,
    path: string,
}

interface CategoryProps {
    items: Category[],
    title: string,
}


type EditPageProps = InjectedWikiPageWithPathProps & WikiPageUpdateProps;

interface WikiPageEditFormProps {
    handleSubmit?: (data: React.FormEvent<typeof Form>) => void;
    initialValues?: WikiPageForm,
    wikiPath: string
}

interface WrappedWikiPageEditFormProps extends WikiPageEditFormProps{
    onSubmit: (values: WikiPageForm) => void;
}


class Wiki extends React.PureComponent<WikiProps> {
    static readonly FLUID_CONTAINER = true;
    render() {
        return <div>
        { this.props.children }
        </div>
    }
}


class WikiRootCard extends React.PureComponent<WikiRootProps> {
    render() {
        return <div>
            { (this.props.wiki.data || []).map((e: WikiData, i: number) => {
                return <Card title={e.category || 'No Category'} key={i}>
                    <ul>
                        { e.articles.map((a, j) => <li key={j}><Link to={`/wiki/${a.path}`}>{ a.title }</Link></li>) }
                    </ul>
                      </Card>
                   }) }
            </div>
    }
}

@WikiIndexHOC()
class WikiRoot extends React.PureComponent<WikiRootProps> {
    render() {
        return <div className="container">
            <WikiRootCard wiki={this.props.wiki} />
        </div>
    }
}



@(reduxForm<WikiPageEditFormProps>({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values)
}) as any)
class WikiPageDetailsForm extends React.PureComponent<WrappedWikiPageEditFormProps> {
    render() {
        return (
            <Form onSubmit={this.props.handleSubmit as any} horizontal>
                <InputField name="title" label="Title" type="text" required />
                <InputField name="keywords" label="Keywords" type="text" />
                <InputField name="categories" label="Categories" type="text"/>
                <div className="text-center">
                <Link className="btn btn-default" to={`/wiki/${this.props.wikiPath}`}>Close</Link>
                    { /** <Button variant="danger" onClick={this.props.handleDelete}>Delete</Button> */ }
                    <Button variant="primary" type="submit">Save</Button>
                </div>
            </Form>
        );
    }
}

@(reduxForm<{}>({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values)
}) as any)
class WikiPageBodyForm extends React.PureComponent<{}> {
    render() {
        return (<div className="markdown-editor">
                <div className="text-right"><a href="https://github.com/showdownjs/showdown/wiki/Showdown's-Markdown-syntax" target="_blank">View Documentation <i className="glyphicon glyphicon-new-window"/></a></div>
                <ReduxField name="data" component={'textarea'} />
                </div>
        );
    }
}

class RenderMarkdown extends React.PureComponent<{ input: {value: string} }>{
    render() {
        return <div className="markdown"><Markdown markup={ this.props.input.value } /></div>
    }
}

@(reduxForm({
    form: 'wiki-edit',
    validate: (values) => validate(validationRules, values)
}) as any)
class WikiPagePreview extends React.PureComponent<{}> {
    render() {
        return (
             <ReduxField name="data" component={RenderMarkdown as any} />
        );
    }
}

const validationRules: EL.IValidationFields = {
    title:  { name: 'Title',  required: true },
};




@(connect<{}, {}, InjectedWikiPageWithPathProps>(undefined, {
    create: (url, data) => createResource(url, data),
    update: (url, data) => updateResource(url, data)
}) as any)
class EditWikiPageWithPath extends React.PureComponent<EditPageProps> {

    constructor(props: EditPageProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    submit(values: WikiPageForm): void {
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
             <Card title="Edit Page">
                 <WikiPageDetailsForm onSubmit={this.submit} initialValues={this.props.values} wikiPath={this.props.wikiPath}/>
             </Card>
         </div>
             <Row>
                 <Col md={6}>
                     <Card title="Markdown">
                         <WikiPageBodyForm />
                     </Card>
                </Col>
                 <Col md={6}>
                     <Card title="Preview">
                         <WikiPagePreview  />
                     </Card>
                </Col>
            </Row>
        </div>
    }
}



class Categories extends React.PureComponent<CategoryProps> {
    render() {
        return <Card title={this.props.title}>

            { this.props.items.map((item: Category, i: number) => {
                return <div key={i}><Link to={`/wiki/${item.path}/`}>{item.title}</Link></div>
            })
            }

         </Card>
    }
}

@WikiHOC()
class WikiPageWithPath extends React.PureComponent<InjectedWikiPageWithPathProps> {

    renderBody(title: string, value: string) {
        return <Card title={title}>
             <RenderMarkdown input={{value: value}}  />
             <hr />
             <div className="text-right"><Link className="btn btn-primary" to={{query: {edit: true}, pathname: `/wiki/${this.props.wikiPath}`}}>Edit Page</Link></div>
         </Card>
    }

    render() {
        if(!this.props.wikiPage.data){
            return false;
        }
        let values : WikiPageForm = {title: this.props.wikiPage.data.title, data: this.props.wikiPage.data.data};
        if(this.props.wikiPage.data.categories){
            values.categories = JSON.parse(this.props.wikiPage.data.categories).join(" | ");
         }
        if(this.props.wikiPage.data.keywords){
            values.keywords = JSON.parse(this.props.wikiPage.data.keywords).join(" | ");
        }
        else{
            values = {};
        }
        if(this.props.edit){
            return <EditWikiPageWithPath wikiPage={this.props.wikiPage} values={values} wikiPath={this.props.wikiPath}/>
        }
        const title = values.title || 'New Page';
        /*if(values.categoryGroup){
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
        }*/
        return <div className="container">
              { this.renderBody(title, values.data) }
         </div>
    }
}

class WikiPage extends React.PureComponent<WikiPageProps> {
    render() {
        return <WikiPageWithPath wikiPath={this.props.routeParams.splat} edit={this.props.location.query.edit === 'true'} />
    }
}

const WikiRoutes = (<Route path='wiki' component={ Wiki } >
                    <IndexRoute component={ WikiRoot } />
                    <Route path="*" component={ WikiPage } />
   </Route>
);

export default WikiRoutes;

