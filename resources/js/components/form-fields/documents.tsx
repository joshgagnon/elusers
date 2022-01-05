import * as React from 'react';
import { NativeTypes } from 'react-dnd-html5-backend-filedrop';
import { DropTarget } from 'react-dnd';
import BaseFieldComponent from './baseFieldComponent';
import {FormControl,  InputGroup, Button, ButtonGroup} from 'react-bootstrap';
import { DropdownList } from 'react-widgets';
import Icon from '../icon';

const fileTarget = {
    drop(props, monitor) {
        props.onDrop(Array.from(monitor.getItem().dataTransfer.files));
    }
};

class DropZone extends React.PureComponent<any> {
    isFileDialogActive;
    fileInputEl;

    open() {
        this.isFileDialogActive = true;
        this.fileInputEl.value = null;
        this.fileInputEl.click();
    }
    onDrop(e) {
        this.props.onDrop(e);
    }

    onFileDialogCancel() {
        // timeout will not recognize context of this method
        const { onFileDialogCancel } = this.props;
        const { fileInputEl } = this;
        let { isFileDialogActive } = this;
        // execute the timeout only if the onFileDialogCancel is defined and FileDialog
        // is opened in the browser
        if (onFileDialogCancel && isFileDialogActive) {
          setTimeout(() => {
            // Returns an object as FileList
            const FileList = fileInputEl.files;
            if (!FileList.length) {
              isFileDialogActive = false;
              onFileDialogCancel();
            }
          }, 300);
        }
    }

    onInput(e) {
        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : Array.from(e.target.files);
        this.onDrop(droppedFiles);
    }

    render() {
        const { connectDropTarget, isOver, canDrop, children } = this.props;
        let className="dropzone";
        if(isOver && !canDrop){
            className += ' reject';
        }
        else if(isOver && canDrop){
            className += ' accept';
        }
        const inputAttributes = {
            type: 'file',
            style: { display: 'none' },
            multiple: true,
            ref: el => this.fileInputEl = el,
            onChange: (e) => this.onInput(e)
        };

        return connectDropTarget(<div className="dropzone" onClick={() => this.open()}>
                { children }
                <input {...inputAttributes} />
                </div>);

        }

}

export const DocumentDropZone = DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(DropZone);


class DocumentComponent extends React.PureComponent<any> {
    isFileDialogActive;
    fileInputEl;

    constructor(props: any) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(droppedFiles) {
        this.props.input.onChange([...(this.props.input.value || []), ...droppedFiles]);
    }

    existingDocuments(docs) {
        return <div style={{paddingBottom: '20px'}}>
             <DropdownList
              filter="contains"
              data={docs}
              textField={'filename'}
              value={''}
              onSelect={(value) => {
                  this.props.input.onChange([...(this.props.input.value || []), value]);
              }}
            />
            </div>
    }

    render() {
        const documents = this.props.input.value || [];
        const { connectDropTarget, isOver, canDrop, existingDocuments } = this.props;
        let className="dropzone";
        if(isOver && !canDrop){
            className += ' reject';
        }
        else if(isOver && canDrop){
            className += ' accept';
        }
        const { label, type, value, input, meta, help } = this.props;

        return <BaseFieldComponent {...{ label, type, value, input, meta, help }}>
                { existingDocuments && existingDocuments.length > 1 && this.existingDocuments(existingDocuments) }
                <div>
                {(documents).map((file, i) => {
                    return <div key={`${file.name || file.filename}-${i}`} className="file-row">
                    <InputGroup>
                    <FormControl type="static" defaultValue={file.name || file.filename}/>
                        <ButtonGroup>

                             <Button disabled={!(documents.length > 1 && i > 0)} onClick={(e) => {
                                e.preventDefault();
                                if(documents.length > 1 && i > 0){
                                    const clone = documents.slice();
                                    const temp = clone[i-1];
                                    clone[i-1] = clone[i];
                                    clone[i] = temp;
                                    this.props.input.onChange(clone);
                                }
                              }}>
                              <Icon iconName="arrow-up"/>
                              </Button>
                             <Button disabled={!(documents.length > 1 && i < documents.length - 1)} onClick={(e) => {
                                e.preventDefault();
                                if(documents.length > 1 && i < documents.length - 1){
                                    const clone = documents.slice();
                                    const temp = clone[i+1];
                                    clone[i+1] = clone[i];
                                    clone[i] = temp;
                                    this.props.input.onChange(clone);
                                }
                              }}>
                              <Icon iconName="arrow-down"/>
                              </Button>
                            <Button className="btn-icon-only" onClick={(e) => {
                                e.preventDefault();
                                const clone = documents.slice();
                                clone.splice(i, 1);
                                this.props.input.onChange(clone);
                              }}>

                              <Icon iconName="trash-o" />
                              </Button>
                             {file.id && <a target="_blank" className="btn btn-default" href={`/api/files/${file.id}`}>
                              <Icon iconName="new-window" />
                              </a> }
                            </ButtonGroup>
                    </InputGroup>
                    </div>
                }) }

                <DocumentDropZone onDrop={this.onDrop}>
                    <div>Drop files here to upload or <span className="vanity-link">click to browse</span> your device</div>
                    </DocumentDropZone>
                </div>
            </BaseFieldComponent>

        }
}





export default DocumentComponent;