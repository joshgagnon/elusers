import * as React from 'react';
import axios from 'axios';
import MSGReader from '@freiraum/msgreader'

const enum Status {
    NotStarted,
    InProgress,
    Complete,
    Failed
}

interface EmailViewerProps {
    src: string;
    format: 'eml' | 'msg';
    loading: JSX.Element
}

function parseHeaders(headers) {
    var parsedHeaders = {};
    if (!headers) {
      return parsedHeaders;
    }
    var headerRegEx = /(.*)\: (.*)/g, m;
    while (m = headerRegEx.exec(headers)) {
      // todo: Pay attention! Header can be presented many times (e.g. Received). Handle it, if needed!
      parsedHeaders[m[1]] = m[2];
    }
    return parsedHeaders;
}

function getMsgDate(rawHeaders) {
    // Example for the Date header
    var headers = parseHeaders(rawHeaders);
    if (!headers['Date']){
      return '-';
    }
    return new Date(headers['Date']).toString();
}

 function formatEmail(data) {
    return data.name ? data.name + " [" + data.email + "]" : data.email;
}

export default class EmailViewer extends React.PureComponent<EmailViewerProps> {

    state = {data: null, status: Status.NotStarted}

    constructor(props: EmailViewerProps) {
        super(props);
    }

    componentDidMount() {
        this.setState({status: Status.InProgress})
        axios.get(this.props.src, { responseType: this.props.format === 'msg' ? 'arraybuffer' : undefined})
            .then(response => {
                if(this.props.format === 'msg') {
                    const msgReader = new MSGReader(response.data);
                    const fileData = msgReader.getFileData();
                    this.setState({status: Status.Complete, data: fileData});
                }
                else{
                    this.setState({status: Status.Complete, data: response.data});
                }
            })
            .catch(() => {
                this.setState({status: Status.Failed});
            })
    }

    renderMSGFields() {
        const fileData = this.state.data;
        return <dl>
        <dt>From</dt>
        <dd>{ formatEmail({name: fileData.senderName, email: fileData.senderEmail}) } </dd>

        <dt>Recipients</dt>
        <dd>{ fileData.recipients.map((recipient, i) => <div key={i}>{ formatEmail(recipient) }</div>) } </dd>


        <dt>Date</dt>
        <dd>{ getMsgDate(fileData.headers) }</dd>

        <dt>Subject</dt>
        <dd>{ fileData.subject }</dd>

        <dt>Body</dt>
        <dd>
            { fileData.body }
        </dd>
        </dl>

    }

    renderEMLFields() {
        return <pre>
            { this.state.data }
        </pre>
    }

    render() {
        const { loading } = this.props;
        return <div>
            { this.state.status === Status.NotStarted || this.state.status === Status.InProgress && loading}
            { this.state.status === Status.Failed && <div className="alert alert-danger">Failed to load document</div> }
            { this.state.status === Status.Complete && this.props.format === 'eml' && this.renderEMLFields() }
            { this.state.status === Status.Complete && this.props.format === 'msg' && this.renderMSGFields() }
        </div>
    }
}



