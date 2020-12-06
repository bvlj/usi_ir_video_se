import axios from "axios";
import {extract as extractKeyWords} from "keyword-extractor";

import {QUERY_BASE_URL, SUGGEST_BASE_URL} from "../config";
import {channelsList} from "../model/Channels";

const PSEUDO_RELEVANCE_LIMIT = 5

export default class ChannelPresenter {

    constructor() {
        this.queryUrl = QUERY_BASE_URL;
        this.suggestUrl = SUGGEST_BASE_URL;
    }

    getChannel(link) {
        return channelsList.find(channel => channel.link === link);
    }

    getSuggestions(query) {
        const url = `${this.suggestUrl}${query}`;
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.suggest ||
                    !res.data.suggest.mainSuggester) {
                    throw Error();
                }
                const suggester = res.data.suggest.mainSuggester;
                const keys = Object.keys(suggester);
                if (keys.length === 0 || !suggester[keys].suggestions) {
                    throw Error();
                }
                const queryLc = query.replaceAll(" ", "").toLowerCase();
                return suggester[keys].suggestions.map(it => this.sanitize(it.term))
                    .filter(it => it.replaceAll(" ", "").toLowerCase() !== queryLc);
            })
            .catch(err => {
                console.error(err);
                return [];
            })
    }

    getVideosFromChannel(channel, limit = 400) {
        const topics = channel.topics.map(it => `${it}*`).join(" OR ");
        const exclude = channel.exclude.join(" ");
        const url = `${this.queryUrl}q=${topics} ${exclude}&rows=${limit}`;
        return this.getVideos(url);
    }

    getVideosFromQuery(queryChannel, limit = 400) {
        const query = queryChannel.topics.join(" ");
        const url = `${this.queryUrl}q=${query}&fl=title&rows=${PSEUDO_RELEVANCE_LIMIT}`;

        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    throw Error()
                }
                return this.getRelevantVideos(res.data.response.docs, queryChannel.exclude, limit);
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    getRelevantVideos(originalResults, excludeList, limit) {
        const keywords = this.extractKeywords(originalResults.map(video => video.title))
            .slice(0, 8)
            .join(" ");
        const excluded = excludeList.join(" ");
        const url = `${this.queryUrl}q=${keywords} ${excluded}&rows=${limit}`;
        return this.getVideos(url);
    }

    getVideos(url) {
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    throw Error()
                }
                return this.extractVideos(res.data.response.docs);
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    extractVideos = (list) => {
        const obj = {};
        // Convert and make unique by "title+author" (some videos may appear multiple times)
        list.forEach(it => {
            const video = {
                author: it.author ? it.author : "",
                image: it.image,
                source: this.firstUpperCase(this.sanitize(it.source)),
                title: it.title,
                topic: this.firstUpperCase(this.sanitize(it.category)),
                url: it.url,
            };
            const key = video.title + video.author
            if (!obj[key]) {
                obj[key] = video;
            }
        })

        return Object.values(obj);
    }

    extractKeywords = (titles) => {
        return extractKeyWords(
            titles.join(". "),
            {
                language: "english",
                remove_digits: true,
                remove_duplicates: true,
            }
        )
    }

    sanitize = (str) => {
        return str.replaceAll(/_|-|(\+)/g, " ")
    }

    firstUpperCase = (str) => {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    }
}