import {FontIcon} from "office-ui-fabric-react/lib/Icon";

export default class ColumnsManager {

    constructor(callback) {
        this.updateData = callback.updateData;
        this.getCurrentData = callback.getData;
    }

    // noinspection JSPrimitiveTypeWrapperUsage
    onColumnClick = (ev, column) => {
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

        const newItems = this.copyAndSort(items, currColumn.fieldName, currColumn.isSortedDescending);
        this.updateData({
            columns: newColumns,
            items: newItems,
        });
    }

    copyAndSort = (items, key, isSortedDescending) => {
        return items.slice(0).sort((a, b) =>
            (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1);
    }

    getDefaultColumns() {
        return [
            {
                key: "column0",
                name: "Title",
                fieldName: "title",
                ariaLabel: "Video title",
                minWidth: 260,
                maxWidth: 400,
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
                key: "column1",
                name: "Author",
                fieldName: "author",
                ariaLabel: "Video author",
                minWidth: 200,
                maxWidth: 350,
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
                onColumnClick: this.onColumnClick,
            },
            {
                key: "column3",
                name: "Source",
                fieldName: "source",
                ariaLabel: "Video source",
                minWidth: 50,
                maxWidth: 100,
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
                key: "column4",
                name: "Open video",
                fieldName: "url",
                ariaLabel: "View the video",
                minWidth: 50,
                iconName: "",
                isPadded: true,
                isIconOnly: true,
                isResizable: false,
                onRender: (item) => {
                    return <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <FontIcon iconName="MSNVideos"/>
                    </a>
                }
            }
        ]
    }
}