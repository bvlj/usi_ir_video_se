import axios from "axios";
import {QUERY_BASE_URL} from "../config";
import {extract as extractKeyWords} from "keyword-extractor";

const PSEUDO_RELEVANCE_LIMIT = 5

export default class CategoryPresenter {

    constructor() {
        this.queryUrl = QUERY_BASE_URL;
    }

    getVideos(query, limit) {
        const url = `${this.queryUrl}q=${query.replace(" ", "%20")}&fl=title&rows=${PSEUDO_RELEVANCE_LIMIT}`
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    return [];
                }
                return this.getRelevantVideos(res.data.response.docs, limit);
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    getRelevantVideos(originalResults, limit) {
        console.log("original: ", originalResults);
        const titles = this.extractKeywords(originalResults.map(video => video.title)).join(" ");
        console.log("titles: ", titles);
        let url = `${this.queryUrl}q=${titles}&rows=${limit}`
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    return []
                }
                return res.data.response.docs.map(this.mapToVideoObject);
            })
    }

    mapToVideoObject = (it) => {
        return {
            author: it.author ? it.author : "",
            source: this.firstUpperCase(this.sanitize(it.source)),
            title: it.title,
            topic: this.firstUpperCase(this.sanitize(it.category)),
            url: it.url,
        }
    }

    extractKeywords = (titles) => {
        return extractKeyWords(
            titles.join(". "),
            {language: "english",}
        )
    }

    sanitize = (str) => {
        return str.replaceAll(/_|-|(\+)/g, " ")
    }

    firstUpperCase = (str) => {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    }
}