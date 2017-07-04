import * as React from 'react';
import { Panel } from 'react-bootstrap';

interface IPanel {
    title?: string;
    children: any;
}

const makePanelTitle = (title: string)=> <h3>{title}</h3>;

const EvolutionPanel = ({ title, children }: IPanel) => (
    <Panel header={title ? makePanelTitle(title) : null}>
        { children }
    </Panel>
);

export default EvolutionPanel;
