import {channelsList} from "../config/defaultChannels";
import {IChannel} from "../model/IChannel";
import {shuffle} from "../util/collection";

export default class FourZeroFourPresenter {

    getSuggestions(): IChannel[] {
        return shuffle(channelsList).slice(0, 4);
    }
}