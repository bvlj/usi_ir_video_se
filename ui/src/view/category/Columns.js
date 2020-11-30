import {FontIcon} from "office-ui-fabric-react/lib/Icon";
import React from "react";

export default function (onColumnClick) {
    return [
        {
            key: "column0",
            name: "Title",
            fieldName: "title",
            ariaLabel: "Video title",
            minWidth: 210,
            maxWidth: 350,
            data: "string",
            isPadded: true,
            isRowHeader: true,
            isSorted: true,
            isResizable: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: 'Sorted A to Z',
            sortDescendingAriaLabel: 'Sorted Z to A',
            onColumnClick: onColumnClick,
        },
        {
            key: "column1",
            name: "Author",
            fieldName: "author",
            ariaLabel: "Video author",
            minWidth: 210,
            maxWidth: 350,
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
            key: "column2",
            name: "Topic",
            fieldName: "topic",
            ariaLabel: "Video topic",
            minWidth: 150,
            maxWidth: 350,
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
            name: "Source",
            fieldName: "source",
            ariaLabel: "Video source",
            minWidth: 50,
            maxWidth: 150,
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
            key: "column4",
            name: "Open video",
            fieldName: "url",
            ariaLabel: "View the video",
            iconName: "MSNVideos",
            isPadded: true,
            isIconOnly: true,
            isResizable: false,
            onRender: (item) => {
                return <a href={item.url} target="_blank" rel="noreferrer">
                    <FontIcon iconName="OpenInNewWindow"/>
                </a>
            }
        }
    ]
}