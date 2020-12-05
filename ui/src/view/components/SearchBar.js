import React from 'react';

import {PrimaryButton} from '@fluentui/react/lib/Button';
import {SearchBox} from '@fluentui/react/lib/SearchBox';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userInput: false,
            query: ""
        };
    }

    onQueryChanged = (query) => {
        this.setState({
            userInput: true,
            query: query
        });
    }

    onSearch = () => {
        const query = this.state.query
            .replaceAll("//", "/") // Even number of slashes
            .replaceAll("//", "/") // Odd number of slashes
            .replaceAll(/^\/|\/$/g, ""); // begin + end slashes
        this.props.onSearch(query);
    }

    render() {
        return (
            <div className="horizontal">
                <SearchBox
                    className="search_bar"
                    placeholder={this.props.hint}
                    value={this.state.userInput ? this.state.query : this.props.value}
                    onChanged={this.onQueryChanged}
                    onSearch={this.onSearch}/>
                <PrimaryButton
                    className="search_button"
                    onClick={this.onSearch}
                    text="Search"/>
            </div>
        )
    }
}