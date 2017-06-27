import * as React from 'react';
import { Panel } from 'react-bootstrap';

const makePanelTitle = (title: string)=> <h3>Title</h3>;

interface IPanel {
    title?: string;
    children: any;
}

const EvolutionPanel = ({ title, children }: IPanel) => (
    <Panel header={title ? makePanelTitle(title) : null}>
        { children }
    </Panel>
);

export default EvolutionPanel;