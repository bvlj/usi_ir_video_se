import React, {useState} from 'react';

import {PrimaryButton} from '@fluentui/react/lib/Button';
import {SearchBox} from '@fluentui/react/lib/SearchBox';

type SearchBarProps = {
    hint?: string,
    value?: string,
    onSearch: (query: string) => void,
};

export default function SearchBar(props: SearchBarProps): JSX.Element {

    const [hasUserInput, setHasUserInput] = useState(false);
    const [query, setQuery] = useState("");

    const onQueryChanged = (query: string) => {
        setHasUserInput(true);
        setQuery(query);
    };

    const onSearch = () => {
        const searchQuery = query.replace(/(\/\/\/)|(\/\/)/g, "/")
            .replace(/^\/|\/$/g, ""); // begin + end slashes
        props.onSearch(searchQuery);
    };

    return (
        <div className="horizontal">
            <SearchBox
                className="search_bar"
                placeholder={props.hint}
                value={hasUserInput ? query : props.value}
                onChanged={onQueryChanged}
                onSearch={onSearch}/>
            <PrimaryButton
                className="search_button"
                onClick={onSearch}
                text="Search"/>
        </div>
    )
}