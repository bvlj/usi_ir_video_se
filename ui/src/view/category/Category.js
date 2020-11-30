import React from 'react';
import CategoryPresenter from "../../presenter/CategoryPresenter";
import Columns from "./Columns";

import {DetailsList, DetailsListLayoutMode, SelectionMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {SearchBox} from "office-ui-fabric-react/lib/SearchBox";

export default class Category extends React.Component {

    constructor(props) {
        super(props);

        this.presenter = new CategoryPresenter();
        this.state = {
            columns: Columns(this.onColumnClick),
            limit: 100,
            topic: "",
            userQuery: "",
            videos: [],
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        const topic = params.category;
        this.presenter.getVideos(topic, this.state.limit)
            .then(videos => {
                const sorted = videos.sort((a, b) => a.title > b.title ? 1 : -1);
                this.setState({
                    topic: topic,
                    videos: sorted
                });
            })
    }

    // noinspection JSPrimitiveTypeWrapperUsage
    onColumnClick = (ev, column) => {
        const {columns, videos} = this.state;
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
        const newItems = this.copyAndSort(videos, currColumn.fieldName, currColumn.isSortedDescending);
        this.setState({
            columns: newColumns,
            videos: newItems,
        });
    }

    onUserSearch = (query) => {
        this.setState({userQuery: query});
    }

    copyAndSort = (items, key, isSortedDescending) => {
        return items.slice(0).sort((a, b) =>
            (isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1);
    }

    filterByUserQuery = (items) => {
        const q = this.state.userQuery;
        if (q === "") {
            return items;
        }

        const regex = new RegExp(q, "i");
        return items.filter(it => regex.test(it.title) || regex.test(it.topic) || regex.test(it.author))
    }

    render() {
        return (
            <div className="container">
                <div className="search_container">
                    <h1>{this.presenter.firstUpperCase(this.state.topic)}</h1>
                    <SearchBox onChanged={this.onUserSearch}/>
                </div>

                <DetailsList
                    items={this.filterByUserQuery(this.state.videos)}
                    columns={this.state.columns}
                    selectionMode={SelectionMode.none}
                    getKey={this._getKey}
                    setKey="multiple"
                    layoutMode={DetailsListLayoutMode.justified}
                    enableShimmer={this.state.videos.length === 0}
                    isHeaderVisible={true}/>
            </div>
        );
    }
}