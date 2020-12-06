import {channelsList} from "../config/defaultChannels";
import {IChannel} from "../model/IChannel";

export default class HomePresenter {

    getChannels(): IChannel[] {
        return channelsList;
    }
}