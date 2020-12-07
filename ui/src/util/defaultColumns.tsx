import React from "react";
import {IColumn} from "@fluentui/react/lib/DetailsList";

import {IVideo} from "../model/IVideo";

export default function getDefaultColumns(
    onColumnClick: (ev: React.MouseEvent<HTMLElement>, column: IColumn) => void
): IColumn[] {
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
            onColumnClick: onColumnClick,
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
            onColumnClick: onColumnClick,
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
            onColumnClick: onColumnClick,
        },
    ]
};
