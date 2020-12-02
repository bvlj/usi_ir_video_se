import React from 'react';

import {BrowserRouter, Route, Switch} from "react-router-dom";
import { initializeIcons } from '@fluentui/react/lib/Icons';

import Home from "./view/home/Home";
import Channel from "./view/channel/Channel";

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
                        component={Channel}
                        exact
                        path="/:query"/>
                </Switch>
                <Switch>
                    <Route
                        component={Channel}
                        exact
                        path="/:query/:filter"/>
                </Switch>
            </BrowserRouter>
        )
    }
}