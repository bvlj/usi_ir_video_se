import {BrowserRouter, Route, Switch} from "react-router-dom";

import Channel from "./view/Channel";
import FourZeroFour from "./view/FourZeroFour";
import Home from "./view/Home";

export default function App(): JSX.Element {

    return (
        <BrowserRouter>
            <Switch>
                <Route
                    component={Home}
                    exact
                    path="/"/>
                <Route
                    component={Channel}
                    exact
                    path="/:query"/>
                <Route
                    component={Channel}
                    exact
                    path="/:query/:filter"/>
                <Route component={FourZeroFour}/>
            </Switch>
        </BrowserRouter>
    )
}