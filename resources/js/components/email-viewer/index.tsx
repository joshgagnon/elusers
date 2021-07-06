import * as React from 'react';
import axios from 'axios';
import { formatDateTime } from 'components/utils';

const enum Status {
    NotStarted,
    InProgress,
    Complete,
    Failed
}

interface EmailViewerProps {
    src: string;
    loading: JSX.Element
}


 function formatEmail(data) {
    return data.name ? data.name + " [" + data.address + "]" : data.address;
}

export default class EmailViewer extends React.PureComponent<EmailViewerProps> {

    state = {data: null, status: Status.NotStarted}

    constructor(props: EmailViewerProps) {
        super(props);
    }

    componentDidMount() {
        this.setState({status: Status.InProgress})
        axios.get(this.props.src, { responseType: 'application/json' })
            .then(response => {
                this.setState({status: Status.Complete, data: response.data});
            })
            .catch(() => {
                this.setState({status: Status.Failed});
            })
    }

    renderFields() {
        const fileData = this.state.data;
        return <dl>
        <dt>From</dt>
        <dd>{ formatEmail(fileData.from) } </dd>

        <dt>To</dt>
        <dd>{ fileData.to.map((recipient, i) => <div key={i}>{ formatEmail(recipient) }</div>) } </dd>


        <dt>Date</dt>
        <dd>{ formatDateTime(fileData.date) }</dd>

        <dt>Subject</dt>
        <dd>{ fileData.subject }</dd>

        <dt>Body</dt>
        <dd>
        { (fileData.body || []).map((section, index) => {
            if(section.contentType === 'text/html') {
                return <div key={index}  dangerouslySetInnerHTML={{__html: section.value }} />
            }
            if(section.contentType === 'text/plain') {
                return <pre key={index}>{ section.value }</pre>
            }
            if(section.contentType.startsWith('image/')) {
                return null;
            }

        } ).filter(Boolean)}
        </dd>
        </dl>

    }

    renderMsGraphPreview() {
        const fileData = this.state.data;
        return <div  dangerouslySetInnerHTML={{__html: fileData.body.content }} /> ;
    }

    render() {
        const { loading } = this.props;
        return <div>
            { this.state.status === Status.NotStarted || this.state.status === Status.InProgress && loading}
            { this.state.status === Status.Failed && <div className="alert alert-danger">Failed to load document</div> }
            { this.state.status === Status.Complete && !this.state.data['@odata.etag'] && this.renderFields() }
            { this.state.status === Status.Complete && this.state.data['@odata.etag'] && this.renderMsGraphPreview() }
        </div>
    }
}



