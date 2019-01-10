import * as React from 'react';
import { Panel } from 'react-bootstrap';

interface IPanel {
    title?: string;
    formattedTitle?: string;
    className?: string;
    children: any;
}

const makePanelTitle = (title: string)=> <h3>{ title }</h3>;

const EvolutionPanel = ({ title, formattedTitle, className, children }: IPanel) => (
    <Panel className={className} header={formattedTitle || (title ? makePanelTitle(title) : null) }>
        { children }
    </Panel>
);

export default EvolutionPanel;
