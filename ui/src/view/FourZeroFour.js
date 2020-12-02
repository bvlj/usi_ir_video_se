import React from 'react';

import FourZeroFourPresenter from "../presenter/FourZeroFourPresenter";
import ChannelsList from "./components/ChannelsList";
import SearchBar from "./components/SearchBar";

export default class FourZeroFour extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            suggestions: [],
        };
    }

    componentDidMount() {
        const suggestions = new FourZeroFourPresenter().getSuggestions();
        this.setState({suggestions: suggestions});
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
                    <h1 className="logo">(Not) Ok Video</h1>
                    <h3>Error 404 • It looks like the resource you're trying to access does not exist</h3>

                    <SearchBar
                        hint="Let's get back on track"
                        onSearch={this.onSearch}/>
                </div>

                <h2>Or find some inspiration:</h2>

                <ChannelsList
                    channels={this.state.suggestions}/>
            </div>
        )
    }
}