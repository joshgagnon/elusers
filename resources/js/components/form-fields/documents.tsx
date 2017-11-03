"use strict";
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { NativeTypes } from 'react-dnd-html5-backend';
import { DropTarget } from 'react-dnd';
import BaseFieldComponent, { IFieldComponentProps } from './baseFieldComponent';
import { FormControl, FormGroup, InputGroup, Glyphicon, Button } from 'react-bootstrap';



const fileTarget = {
    drop(props, monitor) {
        if(props.input.value){
            props.input.onChange([...props.input.value, ...monitor.getItem().files]);
        }
        else{
            props.input.onChange(monitor.getItem().files);
        }
    }
};


class DocumentBase extends React.PureComponent<any> {
    isFileDialogActive;
    fileInputEl;

    open() {
        this.isFileDialogActive = true;
        this.fileInputEl.value = null;
        this.fileInputEl.click();
    }

    onDrop(e) {
        const droppedFiles = e.dataTransfer ? e.dataTransfer.files : Array.from(e.target.files);
        this.props.input.onChange([...(this.props.input.value || []), ...droppedFiles]);
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

    render() {
        const documents = this.props.input.value || [];;
        const { connectDropTarget, isOver, canDrop } = this.props;
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
            onChange: (e) => this.onDrop(e)
        };
        return <BaseFieldComponent {...this.props}>
                <div>
                {(documents).map((file, i) => {
                    return <div key={`${file.name || file.filename}-${i}`} className="file-row">
                    <InputGroup>
                    <FormControl type="static" defaultValue={file.name || file.filename}/>
                        <InputGroup.Button>
                            <Button onClick={(e) => {
                                e.preventDefault();
                                const clone = documents.slice();
                                clone.splice(i, 1);
                                this.props.input.onChange(clone);
                              }}>
                              <Glyphicon glyph="trash"/>
                              </Button>
                            </InputGroup.Button>
                    </InputGroup>
                    </div>
                }) }

                { connectDropTarget(<div className="dropzone" onClick={() => this.open()}>
                     <div>Drop files here to upload or <span className="vanity-link">click to browse</span> your device</div>
                      <input {...inputAttributes} />
                </div>) }
                </div>
            </BaseFieldComponent>

        }
}


const DocumentComponent = DropTarget(NativeTypes.FILE, fileTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(DocumentBase);


export default DocumentComponent;