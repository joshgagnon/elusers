import * as React from 'react';
import Transition from 'react-transition-group/Transition';


const duration = 200;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  position: 'absolute',
  zIndex: 20
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered:  { opacity: 1},
  exited: {display:'none'}
};

export const Fade = (props) => {
   const { in: inProp, children, ...rest} = props;

  return <Transition in={inProp} timeout={duration}>
    {(state) => {
      return <div className={`fade-transition ${props.fullSize ? 'full-size': ''}`} style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        { children }
      </div>
    }}
  </Transition>
};
