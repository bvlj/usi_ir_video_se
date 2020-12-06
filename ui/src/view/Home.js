import {useEffect, useState} from 'react';

import ChannelsList from "./components/ChannelsList";
import SearchBar from "./components/SearchBar";
import HomePresenter from "../presenter/HomePresenter";
import {openUrl} from "../util/Navigation";

export default function Home() {

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        const presenter = new HomePresenter();
        const channels = presenter.getChannels();
        setChannels(channels);
    }, []);

    return (
        <div className="container">
            <div className="centered_container">
                <h1 className="logo">OK Video</h1>

                <SearchBar
                    hint="What are you watching today?"
                    onSearch={(query) => openUrl(`/${query}`)}/>
            </div>

            <ChannelsList
                channels={channels}/>
        </div>
    )
}