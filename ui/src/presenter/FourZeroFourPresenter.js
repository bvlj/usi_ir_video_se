import {channelsList} from "../model/Channels";

export default class FourZeroFourPresenter {

    getSuggestions() {
        return this.shuffle(channelsList).slice(0, 4);
    }

    shuffle(list) {
        return list.sort((_, __) => Math.random() - 0.5);
    }
}