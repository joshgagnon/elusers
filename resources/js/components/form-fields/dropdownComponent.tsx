import * as React from 'react';
import BaseFieldComponent, {IFieldComponentProps, NakedBaseFieldComponent} from './baseFieldComponent';
import DropdownList from 'react-widgets/DropdownList';
import * as  ReactList from 'react-list';
import {Fade} from 'components/animations';
import cn from 'classnames'
/*import PropTypes from 'prop-types'
import React, {
    useCallback,
    useImperativeHandle,
    useMemo,
    MutableRefObject,
} from 'react'*//*
import ListOption, {ListOptionProps} from 'react-widgets/ListOption'
import ListOptionGroup from 'react-widgets/ListOptionGroup'
import {UserProvidedMessages, useMessagesWithDefaults} from 'react-widgets/messages'
// import { WidgetHTMLProps } from './shared'
import {DataItem, RenderProp, Value} from 'react-widgets/types'
import * as CustomPropTypes from 'react-widgets/PropTypes'
import {groupBySortedKeys, makeArray, toItemArray} from 'react-widgets/_'
import {Accessors} from 'react-widgets/Accessors'
import {useInstanceId} from 'react-widgets/WidgetHelpers'
import useMutationObserver from '@restart/hooks/useMutationObserver'
import useCallbackRef from '@restart/hooks/useCallbackRef'
import useMergedRefs from '@restart/hooks/useMergedRefs'

const whitelist = [
    'style',
    'className',
    'role',
    'id',
    'autocomplete',
    'size',
    'tabIndex',
    'maxLength',
    'name',
]

const whitelistRegex = [/^aria-/, /^data-/, /^on[A-Z]\w+/]

function pickElementProps<T>(props: T): Partial<T> {
    const result: Partial<T> = {}
    Object.keys(props).forEach((key) => {
        if (
            whitelist.indexOf(key) !== -1 ||
            whitelistRegex.some((r) => !!key.match(r))
        )
            (result as any)[key] = (props as any)[key]
    })

    return result
}


export type GroupBy<TDataItem = unknown> =
    | ((item: TDataItem) => unknown)
    | string

export interface ListHandle {
    scrollIntoView(): void
}

export type RenderItemProp<TDataItem> = RenderProp<{
    item: TDataItem
    searchTerm?: string
    index: number
    text: string
    value: unknown
    disabled: boolean
}>

export type RenderGroupProp = RenderProp<{
    group: any
}>

export type OptionComponentProp = React.ComponentType<ListOptionProps<any>>

export type ChangeHandler<TDataItem> = (
    dataItem: TDataItem | TDataItem[],
    metadata: {
        action?: 'insert' | 'remove'
        dataItem?: TDataItem
        lastValue: Value
        originalEvent?: React.SyntheticEvent
    },
) => void

export interface ListProps<TDataItem> {
    data: readonly TDataItem[]
    value?: readonly TDataItem[] | TDataItem
    accessors: Accessors
    focusedItem?: TDataItem
    className?: string
    multiple?: boolean
    disabled?: boolean | readonly TDataItem[]
    messages?: UserProvidedMessages
    renderItem?: RenderItemProp<TDataItem>
    renderGroup?: RenderGroupProp
    searchTerm?: string
    groupBy?: GroupBy<TDataItem>
    optionComponent?: React.ElementType
    onChange: ChangeHandler<TDataItem>
    elementRef?: MutableRefObject<HTMLDivElement | null>

    [key: string]: any
}

declare interface List {
    <TDataItem = DataItem>(
        props: ListProps<TDataItem> & React.RefAttributes<ListHandle>,
    ): React.ReactElement | null

    displayName?: string
    propTypes?: any
}

export const useScrollFocusedIntoView = (
    element: HTMLElement | null,
    observeChanges = false,
) => {
    const scrollIntoView = useCallback(() => {
        if (!element) return

        let selectedItem = element.querySelector('[data-rw-focused]')

        if (selectedItem && selectedItem.scrollIntoView) {
            selectedItem.scrollIntoView({block: 'nearest', inline: 'nearest'})
        }
    }, [element])

    useMutationObserver(
        observeChanges ? element : null,
        {
            subtree: true,
            attributes: true,
            attributeFilter: ['data-rw-focused'],
        },
        scrollIntoView,
    )

    return scrollIntoView
}

export function useHandleSelect<TDataItem>(
    multiple: boolean,
    dataItems: TDataItem[],
    onChange: ChangeHandler<TDataItem>,
) {
    return (dataItem: TDataItem, event: React.SyntheticEvent) => {
        if (multiple === false) {
            onChange(dataItem, {
                dataItem,
                lastValue: dataItems[0],
                originalEvent: event,
            })
            return
        }

        const checked = dataItems.includes(dataItem)
        onChange(
            checked
                ? dataItems.filter((d) => d !== dataItem)
                : [...dataItems, dataItem],
            {
                dataItem,
                lastValue: dataItems,
                action: checked ? 'remove' : 'insert',
                originalEvent: event,
            },
        )
    }
}

const List: List = React.forwardRef(function List<TDataItem>(
    {
        multiple = false,
        data = [],

        value,
        onChange,
        accessors,

        className,
        messages,
        disabled,
        renderItem,
        renderGroup,
        searchTerm,
        groupBy,
        elementRef,
        optionComponent: Option = ListOption,
        renderList,
        // onKeyDown,
        ...props
    }: ListProps<TDataItem>,
    outerRef: React.Ref<ListHandle>,
) {
    const id = useInstanceId()

    const dataItems = makeArray(value, multiple)

    const groupedData = useMemo(
        () => (groupBy ? groupBySortedKeys<TDataItem>(groupBy, data) : undefined),
        [data, groupBy],
    )
    const [element, ref] = useCallbackRef<HTMLDivElement>()
    const disabledItems = toItemArray(disabled)
    const {emptyList} = useMessagesWithDefaults(messages)

    const divRef = useMergedRefs(ref, elementRef)

    const handleSelect = useHandleSelect(multiple, dataItems, onChange)

    const scrollIntoView = useScrollFocusedIntoView(element, true)

    let elementProps = pickElementProps(props)

    useImperativeHandle(outerRef, () => ({scrollIntoView}), [scrollIntoView])

    function renderOption(item: TDataItem, idx: number) {
        const textValue = accessors.text(item)
        const itemIsDisabled = disabledItems.includes(item)
        const itemIsSelected = dataItems.includes(item)

        return (
            <Option
                dataItem={item}
                key={`item_${idx}`}
                searchTerm={searchTerm}
                onSelect={handleSelect}
                disabled={itemIsDisabled}
                selected={itemIsSelected}
            >
                {renderItem
                    ? renderItem({
                        item,
                        searchTerm,
                        index: idx,
                        text: textValue,
                        // TODO: probably remove
                        value: accessors.value(item),
                        disabled: itemIsDisabled,
                    })
                    : textValue}
            </Option>
        )
    }

    const items = groupedData
        ? groupedData.map(([group, items], idx) => (
            <div role="group" key={`group_${idx}`}>
                <ListOptionGroup>
                    {renderGroup ? renderGroup({group}) : (group as string)}
                </ListOptionGroup>
                {items.map(renderOption)}
            </div>
        ))
        : data.map(renderOption)

    const rootProps = {
        id,
        tabIndex: 0,
        ref: divRef,
        ...elementProps,
        'aria-multiselectable': !!multiple,
        className: cn(className, 'rw-list'),
        role: elementProps.role ?? 'listbox',
        children: React.Children.count(items) ? (
            items
        ) : (
            <div className="rw-list-empty">{emptyList()}</div>
        ),
    }

    return renderList ? renderList(rootProps) : <div {...rootProps} />
})




/*
class LazyList extends React.PureComponent {
    itemRenderer = (index) => {
        return this.renderOption(this.props.data[index], index)
    }
    renderOption = (item: DataItem, idx: number) => {
        const textValue = this.props.accessors.text(item)
        const itemIsDisabled = (this.props.disabledItems || []).includes(item)
        const itemIsSelected = this.props.dataItems.includes(item)

        return (
            <Option
                dataItem={item}
                key={`item_${idx}`}
                searchTerm={this.props.searchTerm}
                onSelect={this.props.handleSelect}
                disabled={itemIsDisabled}
                selected={itemIsSelected}
            >
                {this.props.renderItem
                    ? this.props.renderItem({
                        item,
                        searchTerm,
                        index: idx,
                        text: textValue,
                        // TODO: probably remove
                        value: this.props.accessors.value(item),
                        disabled: itemIsDisabled,
                    })
                    : textValue}
            </Option>
        )
    }
    render() {
        const initialIndex = this.props.selectedItem ?
            this.props.data.findIndex((item) => this.props.valueAccessor(item) === this.props.valueAccessor(this.props.selectedItem)) : 0;
        return <ul className="rw-list">
            <ReactList
               initialIndex={initialIndex}
                useStaticSize={true}
                itemRenderer={this.itemRenderer}
                length={this.props.data.length}
                type='uniform'
              />
         </ul>
    }
}*/

interface IDropdownComponentProps extends IFieldComponentProps {
    data: any;
    textField: string | ((any) => string);
    valueField: string | ((any) => string);
    placeholder?: string;
    busy?: boolean;

    allowCreate?: boolean | string;
    onCreate?: (value: string) => void;
}

class DropdownNakedComponent extends React.PureComponent<any> {
    render() {
        const {data} = this.props;
        const DList = DropdownList as any;
        return (
            <DList {...this.props.input} data={this.props.data} textField={this.props.textField}
                   placeholder={this.props.placeholder}
                   busySpinner={
                       <span className="fa fa-spinner fa-spin"/>
                   }
                   busy={this.props.busy}
                   valueField={this.props.valueField}
                   onChange={o => this.props.input.onChange(o[this.props.valueField as string])}
                //listComponent={LazyList}
                   popupTransition={Fade}
                   allowCreate={this.props.allowCreate}
                   onCreate={this.props.onCreate}
                   delay={0}
                   filter/>
        );
    }
}

export default class DropdownComponent extends React.PureComponent<IDropdownComponentProps & { naked?: boolean }> {
    render() {
        const {data, ...baseFieldComponentProps} = this.props;
        const DList = DropdownList as any;
        const dropdown = <DropdownNakedComponent input={this.props.input} data={this.props.data} busy={this.props.busy}
                                                 textField={this.props.textField} placeholder={this.props.placeholder}
                                                 valueField={this.props.valueField}
                                                 allowCreate={this.props.allowCreate}
                                                 onCreate={this.props.onCreate}
        />;
        if (this.props.naked) {
            return <NakedBaseFieldComponent {...baseFieldComponentProps}>
                {dropdown}
            </NakedBaseFieldComponent>
        }
        return (
            <BaseFieldComponent {...baseFieldComponentProps}>
                {dropdown}
            </BaseFieldComponent>
        );
    }
}