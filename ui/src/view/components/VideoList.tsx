import React from "react";
import {DetailsList, DetailsListLayoutMode, IColumn, SelectionMode} from "@fluentui/react/lib/DetailsList";
import {openUrl} from "../../util/navigation";
import getDefaultColumns from "../../util/defaultColumns";
import {IVideo} from "../../model/IVideo";
import {copyAndSort} from "../../util/collection";

type Props = {
    videos: IVideo[],
};
type State = {
    columns: IColumn[],
    items: IVideo[],
    videos: IVideo[],
};

export default class VideoList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.onColumnsClick.bind(this);
        this.state = {
            columns: [] as IColumn[],
            items: [] as IVideo[],
            videos: [] as IVideo[],
        }
    }

    componentDidMount() {
        this.setState({
            columns: getDefaultColumns((ev, column) => this.onColumnsClick(ev, column))
        })
    }

    private onColumnsClick(_: React.MouseEvent<HTMLElement>, column: IColumn) {
        const newColumns = this.state.columns.slice();
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
        const sortedVideos = copyAndSort(this.state.videos, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            items: sortedVideos,
        });
    }

    private static getDerivedStateFromProps(props: Props, state: State) {
        if (props.videos !== state.videos) {
            return {
                items: props.videos,
                videos: props.videos,
            };
        }
        return {};
    }

    render() {
        return (
            <DetailsList
                items={this.state.items}
                columns={this.state.columns}
                isHeaderVisible={true}
                layoutMode={DetailsListLayoutMode.justified}
                onItemInvoked={(item) => openUrl(item.url, true)}
                selectionMode={SelectionMode.none}
                setKey="multiple"/>
        );
    }
}