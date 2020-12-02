import React from 'react';

import {DetailsList, DetailsListLayoutMode, SelectionMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {FontIcon} from "office-ui-fabric-react/lib/Icon";
import {SearchBox} from "office-ui-fabric-react/lib/SearchBox";

import ChannelPresenter from "../../presenter/ChannelPresenter";
import ColumnsManager from "./ColumnsManager";
import SearchBar from "../components/SearchBar";

export default class Channel extends React.Component {

    constructor(props) {
        super(props);

        this.presenter = new ChannelPresenter();

        const columnsManager = new ColumnsManager({
            updateData: this.updateColumnsData,
            getData: this.getColumnsData,
        })

        this.state = {
            channel: {name: "", icon: ""},
            columns: columnsManager.getDefaultColumns(),
            hints: [],
            limit: 100,
            filter: "",
            videos: [],
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        const {query, filter} = params;
        const channel = this.presenter.getChannel(query);

        if (channel) {
            this.onLoadChannel(channel, filter)
        } else {
            this.onLoadQuery(query, filter);
        }
    }

    onLoadChannel = (channel, filter) => {
        this.presenter.getVideosFromTopics(channel.topics, this.state.limit)
            .then(videos => this.setState({
                channel: channel,
                filter: filter,
                videos: videos,
            }))
    }

    onLoadQuery = (query, filter) => {
        const channel = {
            name: query,
            link: query,
            icon: "VideoSearch",
        };
        this.presenter.getVideosFromQuery(query, this.state.limit)
            .then(videos => this.setState({
                channel: channel,
                filter: filter,
                videos: videos,
            }))
    }

    onFilterChanged = (filter) => {
        this.setState({filter: filter});
    }

    onSearch = (query) => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = `/${query}`
        a.click();
        a.remove();
    }

    onVideoSelected = (item) => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.href = item.url;
        a.click();
        a.remove();
    }

    filterItems = (items) => {
        const q = this.state.filter;
        if (q === "") {
            return items;
        }

        const regex = new RegExp(q, "i");
        return items.filter(it => regex.test(it.title) || regex.test(it.topic) || regex.test(it.author))
    }

    getColumnsData = () => {
        return {
            columns: this.state.columns,
            items: this.state.videos,
        }
    }

    updateColumnsData = (data) => {
        this.setState({
            columns: data.columns,
            videos: data.items,
        });
    }

    render() {
        const items = this.filterItems(this.state.videos);
        return (
            <div className="container">
                <div className="centered_container">

                    <SearchBar
                        placeholder="Find more videos"
                        onSearch={this.onSearch}/>

                    <div
                        style={{marginTop: "2em"}}
                        className="horizontal channel_header">
                        <FontIcon iconName={this.state.channel.icon}/>
                        <h1>{this.state.channel.name}</h1>
                    </div>

                    <SearchBox
                        styles={{root: {width: "30vw"}}}
                        iconProps={{iconName: "Filter"}}
                        placeholder="Filter"
                        value={this.state.filter}
                        onChanged={this.onFilterChanged}/>
                </div>


                {
                    items.length === 0 ?
                        <div className="centered_container">
                            <h2>Oh no!</h2>
                            <p>Couldn't find any result for /{this.state.channel.link}/{this.state.filter}</p>
                        </div> :
                        <DetailsList
                            items={items}
                            columns={this.state.columns}
                            isHeaderVisible={true}
                            layoutMode={DetailsListLayoutMode.justified}
                            onItemInvoked={this.onVideoSelected}
                            selectionMode={SelectionMode.none}
                            setKey="multiple"/>
                }

            </div>
        );
    }
}