import {useEffect, useMemo, useState} from 'react';

import {DetailsList, DetailsListLayoutMode, SelectionMode,} from '@fluentui/react/lib/DetailsList';
import {Link} from "@fluentui/react/lib/Link";
import {SearchBox} from "@fluentui/react/lib/SearchBox";

import ChannelPresenter from "../presenter/ChannelPresenter";
import ColumnsManager from "./channel/ColumnsManager";
import SearchBar from "./components/SearchBar";
import {openUrl} from "../util/Navigation";

export default function Channel(props) {
    const presenter = useMemo(() => new ChannelPresenter(), []);
    const [channel, setChannel] = useState({name: "", icon: ""});
    const [filter, setFilter] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [videos, setVideos] = useState([]);

    const columnManager = new ColumnsManager({
        updateData: (data) => {
            setColumns(data.columns);
            setVideos(data.items);
        },
        getData: () => {
            return {columns: columns, items: videos}
        },
    });
    const [columns, setColumns] = useState(columnManager.getDefaultColumns());

    useEffect(() => {
        const {match: {params}} = props;
        const {query, filter} = params;
        setFilter(filter);

        const channel = presenter.getChannel(query);
        if (channel) {
            presenter.getVideosFromChannel(channel)
                .then(videos => {
                    setChannel(channel);
                    setVideos(videos);
                });
        } else {
            const topics = [];
            const exclude = [];
            query.split(" ").forEach(it => it.match(/^-.*/) ? exclude.push(it) : topics.push(it));
            const queryChannel = {
                name: query,
                icon: "/icons/video.svg",
                topics: topics,
                exclude: exclude,
            };
            setChannel(queryChannel);
            presenter.getVideosFromQuery(queryChannel)
                .then(setVideos);
            presenter.getSuggestions(query)
                .then(setSuggestions);
        }
    }, [presenter, props]);

    const filterItems = (items) => {
        if (filter === "") {
            return items;
        }
        const regex = new RegExp(filter, "i");
        return items.filter(it => regex.test(it.title) || regex.test(it.topic) || regex.test(it.author));
    };

    const items = filterItems(videos);
    return (
        <div className="container">
            <div className="centered_container">

                <SearchBar
                    placeholder="Find more videos"
                    onSearch={(query) => openUrl(`/${query}`)}/>

                <div
                    style={{marginTop: "2em"}}
                    className="horizontal channel_header">
                    <a href="/">
                        <img
                            alt={channel.name}
                            src={process.env.PUBLIC_URL + channel.icon}/>
                    </a>
                    <h1>{channel.name}</h1>
                </div>

                <SearchBox
                    className="search_filter"
                    iconProps={{iconName: "Filter"}}
                    placeholder="Filter"
                    value={filter}
                    onChanged={setFilter}/>
            </div>

            {
                items.length === 0 ?
                    <div className="centered_container">
                        <h2>Oh no!</h2>
                        <p>Couldn't find any result for /{channel.link || channel.name}/{filter}</p>
                    </div> :
                    <DetailsList
                        items={items}
                        columns={columns}
                        isHeaderVisible={true}
                        layoutMode={DetailsListLayoutMode.justified}
                        onItemInvoked={(item) => openUrl(item.url, true)}
                        selectionMode={SelectionMode.none}
                        setKey="multiple"/>
            }

            <div className="centered_container">
                <p>Found {items.length} results.</p>

                {
                    suggestions.length === 0 ?
                        "" :
                        <p>
                            <span>Try searching one of these: </span>
                            {
                                suggestions.map(it =>
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