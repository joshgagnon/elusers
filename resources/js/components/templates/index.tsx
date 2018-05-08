import * as React from 'react';
import { SimpleFormLoader as FormLoader } from 'jasons-formal/lib/components/formLoader';
import Modals from 'jasons-formal/lib/components/modals';

export default class Templates extends React.PureComponent<any> {
    render() {
        return (
            <div>
                <FormLoader initialValues={{category: 'Evolution Templates', schema: 'letter'}} />
                <Modals />
            </div>
        );
    }
}
