import React from 'react';

import {FocusZone} from '@fluentui/react/lib/FocusZone';
import {Link} from '@fluentui/react/lib/Link';


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
                                <img
                                    alt={it.name}
                                    className="icon"
                                    src={process.env.PUBLIC_URL + it.icon}/>
                                <span className="label">{it.name}</span>
                            </Link>
                        )
                    }
                </div>
            </FocusZone>
        )
    }
}