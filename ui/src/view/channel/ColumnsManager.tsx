import React from "react";
import {IColumn} from "@fluentui/react/lib/DetailsList";

import {IVideo} from "../../model/IVideo";
import {copyAndSort} from "../../util/collection";

interface IColumnsManagerData {
    columns: IColumn[],
    items: IVideo[],
}

type ColumnsManagerCallback = {
    updateData: (data: IColumnsManagerData) => void,
    getData: () => IColumnsManagerData,
};

export default class ColumnsManager {
    private readonly updateData: (data: IColumnsManagerData) => void;
    private readonly getCurrentData: () => IColumnsManagerData;

    constructor(callback: ColumnsManagerCallback) {
        this.updateData = callback.updateData;
        this.getCurrentData = callback.getData;
    }

    getDefaultColumns(): IColumn[] {
        return [
            {
                key: "column0",
                name: "Open video",
                fieldName: "url",
                ariaLabel: "View the video",
                maxWidth: 250,
                minWidth: 250,
                iconName: "",
                isPadded: true,
                isIconOnly: true,
                isResizable: false,
                onRender: (item: IVideo) => <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <img className="thumbnail" src={item.image} alt={item.title}/>
                </a>
            },
            {
                key: "column1",
                name: "Title",
                fieldName: "title",
                ariaLabel: "Video title",
                minWidth: 260,
                data: "string",
                isPadded: true,
                isRowHeader: true,
                isSorted: false,
                isResizable: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: 'Sorted A to Z',
                sortDescendingAriaLabel: 'Sorted Z to A',
                onColumnClick: this.onColumnClick,
            },
            {
                key: "column2",
                name: "Author",
                fieldName: "author",
                ariaLabel: "Video author",
                minWidth: 200,
                data: "string",
                isPadded: true,
                isRowHeader: true,
                isSorted: false,
                isResizable: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: "A - Z",
                sortDescendingAriaLabel: "Z - A",
                onColumnClick: this.onColumnClick,
            },
            {
                key: "column3",
                name: "Topic",
                fieldName: "topic",
                ariaLabel: "Video topic",
                minWidth: 150,
                data: "string",
                isPadded: true,
                isRowHeader: true,
                isSorted: false,
                isResizable: true,
                isSortedDescending: false,
                sortAscendingAriaLabel: "A - Z",
                sortDescendingAriaLabel: "Z - A",
                onColumnClick: this.onColumnClick,
            },
        ]
    }

    // noinspection JSPrimitiveTypeWrapperUsage
    private onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn) => {
        const {columns, items} = this.getCurrentData();
        const newColumns = columns.slice();
        const currColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach(newCol => {
            if (newCol === currColumn) {
                currColumn.isSortedDescending = !currColumn.isSortedDescending;
                currColumn.isSorted = true;
            } else {
                newCol.isSorted = false;
                newCol.isSortedDescending = true;
            }
        });

        const newItems = copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
        this.updateData({
            columns: newColumns,
            items: newItems,
        });
    }
}