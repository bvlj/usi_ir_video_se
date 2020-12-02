import React from 'react';

import ChannelsList from "../components/ChannelsList";
import SearchBar from "../components/SearchBar";
import HomePresenter from "../../presenter/HomePresenter";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: [],
        };
    }

    componentDidMount() {
        const channels = new HomePresenter().getChannels();
        this.setState({channels: channels});
    }

    onSearch = (query) => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = `/${query}`
        a.click();
        a.remove();
    }

    render() {
        return (
            <div className="container">
                <div className="centered_container">
                    <h1 className="logo">OK Video</h1>

                    <SearchBar
                        hint="What are you watching today?"
                        onSearch={this.onSearch}/>
                </div>

                <ChannelsList
                    channels={this.state.channels}/>
            </div>
        )
    }
}