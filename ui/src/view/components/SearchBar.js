import React from 'react';

import {PrimaryButton} from 'office-ui-fabric-react/lib/Button';
import {SearchBox} from 'office-ui-fabric-react/lib/SearchBox';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: ""
        };
    }

    onQueryChanged = (query) => {
        this.setState({query: query});
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