import {useEffect, useMemo, useState} from 'react';

import {DetailsList, DetailsListLayoutMode, SelectionMode,} from '@fluentui/react/lib/DetailsList';
import {Link} from "@fluentui/react/lib/Link";
import {SearchBox} from "@fluentui/react/lib/SearchBox";
import {TeachingBubble} from '@fluentui/react/lib/TeachingBubble';

import ChannelPresenter from "../presenter/ChannelPresenter";
import ColumnsManager from "./channel/ColumnsManager";
import SearchBar from "./components/SearchBar";
import {openUrl} from "../util/navigation";
import {IVideo} from "../model/IVideo";
import {IChannel} from "../model/IChannel";

type NavigationParams = {
    query: string,
    filter?: string,
};

type ChannelProps = {
    match: { params: NavigationParams },
};

type TeachingData = {
    targetId: string,
    title: string,
    content: JSX.Element,
};

const TEACHING_HINTS: TeachingData[] = [
    {
        targetId: "#filter_bar",
        title: "Filter",
        content: (
            <p>Filter the results by title, author or topic</p>
        ),
    },
    {
        targetId: "#search_bar",
        title: "Better results",
        content: (
            <p>Exclude certain words by prepending a dash. Searching <b>tech -blockchain</b> will remove
                all the results about blockchain.</p>
        ),
    },
    {
        targetId: "#search_bar",
        title: "Quick filter",
        content: (
            <p>You can also filter when searching here.
                Try writing <b>l/Dante</b> to find literature videos about Dante</p>
        ),
    },
];


export default function Channel(props: ChannelProps) {
    const presenter = useMemo(() => new ChannelPresenter(), []);
    const [channel, setChannel] = useState({name: "", icon: ""} as IChannel);
    const [filter, setFilter] = useState("");
    const [suggestions, setSuggestions] = useState([] as string[]);
    const [teachingBubble, setTeachingBubble] = useState(0);
    const [userSearch, setUserSearch] = useState("");
    const [videos, setVideos] = useState([] as IVideo[]);

    const columnManager: ColumnsManager = new ColumnsManager({
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
        setFilter(filter || "");

        const channel = presenter.getChannel(query);
        if (channel) {
            setChannel(channel);
            presenter.getVideosFromChannel(channel)
                .then(setVideos)
                .catch(console.error);
        } else {
            const topics = [] as string[];
            const exclude = [] as string[];
            query.split(" ").forEach(it => it.match(/^-.*/) ? exclude.push(it) : topics.push(it));
            const queryChannel: IChannel = {
                name: query,
                icon: "/icons/video.svg",
                link: query,
                topics: topics,
                exclude: exclude,
            };
            setChannel(queryChannel);
            presenter.getVideosFromQuery(queryChannel)
                .then(setVideos)
                .catch(console.error);
            presenter.getSuggestions(query)
                .then(setSuggestions)
                .catch(console.error);
        }

        setTeachingBubble(parseInt(localStorage.getItem("channel_teaching") || "0"))
    }, [presenter, props]);

    const filterItems = (items: IVideo[]): IVideo[] => {
        if (filter === "") {
            return items;
        }
        const regex = new RegExp(filter, "i");
        return items.filter(it => regex.test(it.title) || regex.test(it.topic) || regex.test(it.author));
    };

    const onTeachingDone = (currentValue: number) => {
        if (currentValue >= TEACHING_HINTS.length) {
            return;
        }
        const newValue = currentValue + 1;
        localStorage.setItem("channel_teaching", newValue.toString())
        setTeachingBubble(newValue);
    };

    const items = filterItems(videos);
    return (
        <div className="container">
            <div className="centered_container">

                <SearchBar
                    id="search_bar"
                    hint="Find more videos"
                    value={userSearch}
                    onSearch={(query) => openUrl(`/${query}`)}/>

                <div
                    style={{marginTop: "2em"}}
                    className="horizontal channel_header">
                    <a href="/">
                        <img
                            alt={channel.name}
                            src={process.env.PUBLIC_URL + channel.icon}/>
                    </a>
                    <h1 onClick={() => setUserSearch(channel.link)}>{channel.name}</h1>
                </div>

                <SearchBox
                    id="filter_bar"
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
                    suggestions.length > 0 &&
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

            {
                teachingBubble < TEACHING_HINTS.length &&
                <TeachingBubble
                    closeButtonAriaLabel="Close"
                    footerContent={`${teachingBubble + 1} of ${TEACHING_HINTS.length}`}
                    hasCloseButton={true}
                    headline={TEACHING_HINTS[teachingBubble].title}
                    target={TEACHING_HINTS[teachingBubble].targetId}
                    primaryButtonProps={{
                        children: "Got it",
                        onClick: () => onTeachingDone(teachingBubble),
                    }}
                    onDismiss={() => onTeachingDone(teachingBubble)}>
                    {TEACHING_HINTS[teachingBubble].content}
                </TeachingBubble>
            }
        </div>
    );
}