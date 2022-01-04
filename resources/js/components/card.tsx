import * as React from 'react';
import { Card } from 'react-bootstrap';

interface ICard {
    title?: string;
    formattedTitle?: JSX.Element;
    className?: string;
    children: any;
}

const EvolutionCard = ({ title, formattedTitle, className, children }: ICard) => {
    const t = formattedTitle || title;
    return <Card className={className} >
        { t && <Card.Header >{ t }</Card.Header> }
        <Card.Body>{ children }</Card.Body>
    </Card>
};

export default EvolutionCard;
