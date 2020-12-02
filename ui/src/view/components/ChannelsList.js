import React from 'react';

import {FocusZone} from 'office-ui-fabric-react/lib/FocusZone';
import {FontIcon} from "office-ui-fabric-react/lib/Icon";
import {Link} from 'office-ui-fabric-react/lib/Link';


export default class ChannelsList extends React.Component {

    render() {
        return (
            <FocusZone>
                <div className="home_channels">
                    {
                        this.props.channels.map(it =>
                            <Link
                                className="item"
                                key={`channel_${it.link}`}
                                href={`/${it.link}`}>
                                <FontIcon
                                    className="icon"
                                    iconName={it.icon}/>
                                <span className="label">{it.name}</span>
                            </Link>
                        )
                    }
                </div>
            </FocusZone>
        )
    }
}