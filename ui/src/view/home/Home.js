import React from 'react';

import {SearchBox} from 'office-ui-fabric-react/lib/SearchBox';
import {List} from 'office-ui-fabric-react/lib/List';
import HomePresenter from "../../presenter/HomePresenter";

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.presenter = new HomePresenter();
        this.state = {
            categories: [],
            userQuery: "",
        };
    }

    componentDidMount() {
        this.presenter.getCategories()
            .then(categories => this.setState({categories: categories}));
    }

    onUserSearch = (query) => {
        this.setState({userQuery: query});
    }

    onRenderCell = (item) => {
        return (
            <a href={`/c/${item.name}`}>
                <div className="category_item" data-is-focusable={true}>{item.name}</div>
            </a>
        )
    }

    filterByUserQuery = (items) => {
        const q = this.state.userQuery;
        console.log(q);
        if (q === "") {
            return items;
        }
        const regex = new RegExp(q, "i");
        return items.filter(it => regex.test(it.name));
    }

    render() {
        return (
            <div className="container">
                <div className="search_container">
                    <h1 className="logo">Video Search Engine</h1>
                    <SearchBox onChanged={this.onUserSearch}/>
                </div>

                <List
                    items={this.filterByUserQuery(this.state.categories)}
                    onRenderCell={this.onRenderCell}/>
            </div>
        )
    }
}