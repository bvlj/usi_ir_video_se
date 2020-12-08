import axios from "axios";

import {channelsList} from "../config/defaultChannels";
import {queryUrl, suggestUrl} from "../config/urlConfig";
import {IChannel} from "../model/IChannel";
import {IVideo} from "../model/IVideo";
import {firstUpperCase, sanitize} from "../util/string";
import {getExpandedQuery} from "../util/prf";

interface ISuggestion {
    term: string,
}

interface IVideoItem {
    author: string,
    category: string,
    image: string,
    source: string,
    title: string,
    url: string,
}

export default class ChannelPresenter {

    getChannel(link: string): IChannel | undefined {
        return channelsList.find(channel => channel.link === link);
    }

    getSuggestions(query: string): Promise<string[]> {
        const url = `${suggestUrl}${query}`;
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.suggest ||
                    !res.data.suggest.mainSuggester) {
                    throw Error();
                }
                const suggester = res.data.suggest.mainSuggester;
                const keys = Object.keys(suggester);
                if (keys.length === 0) {
                    throw Error();
                }
                // @ts-ignore
                const suggestions: ISuggestion[] = suggester[keys].suggestions;
                if (!suggestions) {
                    throw Error();
                }
                const queryLc = query.replaceAll(" ", "").toLowerCase();
                return suggestions.map(it => sanitize(it.term))
                    .filter(it => it.replaceAll(" ", "").toLowerCase() !== queryLc);
            });
    }

    getVideosFromChannel(channel: IChannel, limit = 400): Promise<IVideo[]> {
        const topics = channel.topics.map(it => `${it}*`).join(" OR ");
        const exclude = channel.exclude.join(" ");
        const url = `${queryUrl}q=${topics} ${exclude}&rows=${limit}`;
        return this.getVideos(url);
    }

    getVideosFromQuery(
        queryChannel: IChannel,
        resultsLimit = 400,
        pseudoRelevanceCount = 5
    ): Promise<IVideo[]> {
        const query = queryChannel.topics.join(" ");
        const url = `${queryUrl}q=${query}&fl=title&rows=${pseudoRelevanceCount}`;

        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    throw Error()
                }
                return this.getRelevantVideos(res.data.response.docs, query, queryChannel.exclude, resultsLimit);
            });
    }

    private getRelevantVideos(originalResults: IVideo[], query: string,
                              excludeList: string[], limit: number): Promise<IVideo[]> {
        const newQuery = getExpandedQuery(query, originalResults.map(it => it.title));
        const excluded = excludeList.join(" ");
        const url = `${queryUrl}q=${newQuery} ${excluded}&rows=${limit}`;
        return this.getVideos(url);
    }

    private getVideos(url: string): Promise<IVideo[]> {
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    throw Error()
                }
                return this.extractVideos(res.data.response.docs);
            });
    }

    private extractVideos(list: IVideoItem[]): IVideo[] {
        const obj: any = {};
        // Convert and make unique by "title+author" (some videos may appear multiple times)
        list.forEach(it => {
            const video: IVideo = {
                author: it.author && it.author.length > 0 ? it.author[0] : "",
                image: it.image,
                source: firstUpperCase(sanitize(it.source)),
                title: it.title,
                topic: firstUpperCase(sanitize(it.category)),
                url: it.url,
            };
            const key = video.title + video.author
            if (!obj[key]) {
                obj[key] = video;
            }
        });
        return Object.values(obj);
    }
}