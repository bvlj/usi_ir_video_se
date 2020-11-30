import React from 'react';

import {BrowserRouter, Route, Switch} from "react-router-dom";
import { initializeIcons } from '@fluentui/react/lib/Icons';

import Home from "./view/home/Home";
import Category from "./view/category/Category";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        initializeIcons()
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        component={Home}
                        exact
                        path="/"/>
                </Switch>
                <Switch>
                    <Route
                        component={Category}
                        exact
                        path="/c/:category"/>
                </Switch>
            </BrowserRouter>
        )
    }
}