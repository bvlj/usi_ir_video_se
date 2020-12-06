import {useState} from 'react';

import {PrimaryButton} from '@fluentui/react/lib/Button';
import {SearchBox} from '@fluentui/react/lib/SearchBox';

export default function SearchBar(props) {

    const [hasUserInput, setHasUserInput] = useState(false);
    const [query, setQuery] = useState("");

    const onQueryChanged = (query) => {
        setHasUserInput(true);
        setQuery(query);
    };

    const onSearch = () => {
        const searchQuery = query.replaceAll(/(\/\/\/)|(\/\/)/g, "/")
            .replaceAll(/^\/|\/$/g, ""); // begin + end slashes
        props.onSearch(searchQuery);
    }

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