import React from 'react';

import {DetailsList, DetailsListLayoutMode, SelectionMode,} from '@fluentui/react/lib/DetailsList';
import {Link} from "@fluentui/react/lib/Link";
import {SearchBox} from "@fluentui/react/lib/SearchBox";

import ChannelPresenter from "../presenter/ChannelPresenter";
import ColumnsManager from "./channel/ColumnsManager";
import SearchBar from "./components/SearchBar";

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
            filter: "",
            limit: 400,
            searchQuery: "",
            suggestions: [],
            videos: [],
        }
    }

    componentDidMount() {
        const {match: {params}} = this.props;
        const {query, filter} = params;
        const channel = this.presenter.getChannel(query);

        this.setState({
            filter: filter,
        });

        // Load videos
        if (channel) {
            this.onLoadChannel(channel, filter)
        } else {
            this.onLoadQuery(query, filter);

            // Load suggestions
            this.presenter.getSuggestions(channel ? channel.name : query)
                .then(suggestions => this.setState({
                    suggestions: suggestions,
                }));
        }
    }

    onLoadChannel = (channel) => {
        this.presenter.getVideosFromChannel(channel, this.state.limit)
            .then(videos => this.setState({
                channel: channel,
                videos: videos,
            }))
    }

    onLoadQuery = (query) => {
        const topics = [];
        const exclude = [];
        query.split(" ").forEach(it => it.match(/^-.*/) ? exclude.push(it) : topics.push(it));
        const queryChannel = {
            name: query,
            icon: "/icons/video.svg",
            topics: topics,
            exclude: exclude,
        };
        this.presenter.getVideosFromQuery(queryChannel, this.state.limit)
            .then(videos => this.setState({
                channel: queryChannel,
                searchQuery: query,
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

    setSearchQuery = (channel) => {
        if (!channel.link) {
            return;
        }
        this.setState({
            searchQuery: channel.link + "/",
        });
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
                        value={this.state.searchQuery}
                        onSearch={this.onSearch}/>

                    <div
                        style={{marginTop: "2em"}}
                        className="horizontal channel_header">
                        <a href="/">
                            <img
                                alt={this.state.channel.name}
                                src={process.env.PUBLIC_URL + this.state.channel.icon}/>
                        </a>
                        <h1 onClick={() => this.setSearchQuery(this.state.channel)}>
                            {this.state.channel.name}
                            {this.state.channel.link ? <span>{this.state.channel.link}/</span> : ""}
                        </h1>
                    </div>

                    <SearchBox
                        className="search_filter"
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

                <div className="centered_container">
                    <p>Found {items.length} results.</p>

                    {
                        this.state.suggestions.length === 0 ?
                            "" :
                            <p>
                                <span>Try searching one of these: </span>
                                {
                                    this.state.suggestions.map(it =>
                                        <Link
                                            key={`hint_${it}`}
                                            style={{marginRight: 16}}
                                            href={`/${it}`}>{it}</Link>)
                                }
                            </p>
                    }
                </div>
            </div>
        );
    }
}