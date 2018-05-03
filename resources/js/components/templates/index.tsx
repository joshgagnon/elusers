import * as React from 'react';
import FormLoader from 'jasons-formal/lib/components/formLoader';

export default class Templates extends React.PureComponent<any> {
    render() {
        return (
            <div>
                <FormLoader initialValues={{category: 'Evolution Templates', schema: 'letter'}} />
            </div>
        );
    }
}
