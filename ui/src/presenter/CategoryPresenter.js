import axios from "axios";
import {QUERY_BASE_URL} from "../config";

const OR = "%20OR%20"

export default class CategoryPresenter {

    constructor() {
        this.queryUrl = QUERY_BASE_URL;
    }

    getVideos(query, limit) {
        const q = query.replace(" ", "%20");
        const url = `${this.queryUrl}q=category%3A*${q}*${OR}title%3A*${q}*&rows=${limit}`
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    return [];
                }
                // TODO: return this.getRelevantVideos(res.data.response.docs, limit);
                return res.data.response.docs.map(this.mapToVideoObject);
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    /* TODO: complete this part
    getRelevantVideos(originalResults, limit) {
        const tags = new Set(originalResults.map(video => video.category[0]));
        let url = `${this.queryUrl}q=`
        tags.forEach(tag => url += `category%3A*${tag.replace(" ", "%20")}*${OR}`);
        url = url.substr(0, url.length - OR.length);
        url += `&rows=${limit}`
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.response ||
                    !res.data.response.docs) {
                    return []
                }
                return res.data.response.docs.map(this.mapToVideoObject);
            })
    }
     */

    mapToVideoObject = (it) => {
        return {
            author: it.author ? it.author[0] : "",
            source: this.firstUpperCase(this.sanitize(it.source[0])),
            title: it.title[0],
            topic: this.firstUpperCase(this.sanitize(it.category[0])),
            url: it.url[0],
        }
    }

    sanitize = (str) => {
        return str.replaceAll(/_|-|(\+)/g, " ")
    }

    firstUpperCase = (str) => {
        return str.substring(0, 1).toUpperCase() + str.substring(1, str.length).toLowerCase();
    }
}