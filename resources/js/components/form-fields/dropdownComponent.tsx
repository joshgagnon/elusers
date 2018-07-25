import * as React from 'react';
import BaseFieldComponent, { IFieldComponentProps, NakedBaseFieldComponent } from './baseFieldComponent';
import * as DropdownList from 'react-widgets/lib/DropdownList';
import * as ReactList from 'react-list';
import * as List from 'react-widgets/lib/List';
import Transition from 'react-transition-group/Transition';

const duration = 100;

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

const Fade = (props) => {
   const { in: inProp, children, ...rest} = props;
  return <Transition in={inProp} timeout={duration}>
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        { children }
      </div>
    )}
  </Transition>
};




interface IDropdownComponentProps extends IFieldComponentProps {
    data: any;
    textField: string | ((any) => string);
    valueField: string | ((any) => string);
    placeholder?: string;
    busy?: boolean;

    allowCreate?: boolean | string;
    onCreate?: (value: string) => void;
}



class LazyList extends (List as any) {
    itemRenderer(index) {
        return this.renderOption(this.props.data[index], index)
    }
    render() {
        const initialIndex = this.props.selectedItem ?
            this.props.data.findIndex((item) => this.props.valueAccessor(item) === this.props.valueAccessor(this.props.selectedItem)) : 0;
        return <ul className="rw-list">
            <ReactList
               initialIndex={initialIndex}
                useStaticSize={true}
                itemRenderer={this.itemRenderer.bind(this)}
                length={this.props.data.length}
                type='uniform'
              />
         </ul>
    }
}

class DropdownNakedComponent extends React.PureComponent<any> {
    render() {
        const { data } = this.props;
        const DList = DropdownList  as any;
        return (
                <DList {...this.props.input} data={this.props.data} textField={this.props.textField} placeholder={this.props.placeholder}
                busySpinner={
                  <span className="fa fa-spinner fa-spin" />
                }
                busy={this.props.busy}
                valueField={this.props.valueField}
                onChange={o => this.props.input.onChange(o[this.props.valueField as string] )}
                listComponent={LazyList}
                popupTransition={Fade}
                allowCreate={this.props.allowCreate}
                onCreate={this.props.onCreate}
                delay={0}
                filter/>
        );
    }
}

export default class DropdownComponent extends React.PureComponent<IDropdownComponentProps & {naked?: boolean}> {
    render() {
        const { data, ...baseFieldComponentProps } = this.props;
        const DList = DropdownList  as any;
        const dropdown =  <DropdownNakedComponent input={this.props.input} data={this.props.data} busy={this.props.busy}
        textField={this.props.textField} placeholder={this.props.placeholder} valueField={this.props.valueField}
        allowCreate={this.props.allowCreate}
        onCreate={this.props.onCreate}
        />;
        if(this.props.naked){
            return <NakedBaseFieldComponent {...baseFieldComponentProps}>
                  { dropdown }
            </NakedBaseFieldComponent>
        }
        return (
            <BaseFieldComponent {...baseFieldComponentProps}>
               { dropdown }
            </BaseFieldComponent>
        );
    }
}