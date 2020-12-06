import {useEffect, useState} from 'react';

import ChannelsList from "./components/ChannelsList";
import SearchBar from "./components/SearchBar";
import {IChannel} from "../model/IChannel";
import FourZeroFourPresenter from "../presenter/FourZeroFourPresenter";
import {openUrl} from "../util/navigation";

export default function FourZeroFour(): JSX.Element {

    const [suggestedChannels, setSuggestedChannels] = useState([] as IChannel[]);

    useEffect(() => {
        const presenter = new FourZeroFourPresenter();
        const suggestions = presenter.getSuggestions();
        setSuggestedChannels(suggestions);
    }, []);

    return (
        <div className="container">
            <div className="centered_container">
                <h1 className="logo">(Not) Ok Video</h1>
                <h3>Error 404 • It looks like the resource you're trying to access does not exist</h3>

                <SearchBar
                    hint="Let's get back on track"
                    onSearch={query => openUrl(`/${query}`)}/>
            </div>

            <h2>Or find some inspiration:</h2>

            <ChannelsList
                channels={suggestedChannels}/>
        </div>
    )
}