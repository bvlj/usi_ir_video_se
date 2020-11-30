import axios from "axios";
import {QUERY_BASE_URL} from "../config";

export default class HomePresenter {

    constructor() {
        this.queryUrl = QUERY_BASE_URL;
    }

    getCategories() {
        const url = `${this.queryUrl}facet.field=category&facet.limit=-1&facet=on&q=*%3A*&rows=0`
        return axios.post(url, {}, {})
            .then(res => {
                if (!res.data || !res.data.facet_counts ||
                    !res.data.facet_counts.facet_fields ||
                    !res.data.facet_counts.facet_fields.category) {
                    return [];
                }
                const rawData = res.data.facet_counts.facet_fields.category;
                const categories = [];
                let i = 0;
                while (i < rawData.length) {
                    categories.push({name: this.firstUpperCase(rawData[i]), count: rawData[i + 1]});
                    i += 2
                }
                return categories.sort((a, b) => b.count - a.count);
            })
            .catch(err => {
                console.error(err);
                return [];
            });
    }

    firstUpperCase = (str) => {
        return str.substring(0, 1).toUpperCase() + str.substring(1, this.length).toLowerCase();
    }
}