# Information Retrieval Course Project: Ok Video

A search engine that allows users to search for videos by submitting some
keywords. The search engine shall provide the user an interface for searching,
browsing and presenting the results using a basic pseudo-relevance-feedback implementation.

## Setup

The following tools are required:

- `python3` (for the crawler)
- `firefox` (for the vimeo crawler)
- `solr` 8.6.2+ (for indexing)
- `yarn` 1.22.10+ (for the ui)

### Crawler

To run the crawlers (found in the [crawler directory](crawler))
you need to first install the dependencies:

```bash
# From the `crawler` directory
pip3 install  -r requirements.txt
```
Then for `talks_at_google_scra.py`, `ted_scra.py` and `the_rsa_scra.py`
execute the following commands to run the Scrapy web-spiders:

```bash
# You may want to clear old data with `rm ../data/*.json`
# before you start to crawl new data
scrapy runspider talks_at_google_scra.py -o ../data/google.json
scrapy runspider ted_scra.py -o ../data/ted.json
scrapy runspider the_rsa_scra.py -o ../data/rsa.json
```

For the Vimeo website, it is necessary to use Selenium webdriver:
make sure Firefox is installed on your machine and download the
latest version of [geckodriver](https://github.com/mozilla/geckodriver/releases)
and place it in the `crawler/` directory with the exact name `geckodriver`.

To run the crawler, then run:

```bash
python3 vimeo.py
mv vimeo.json ../data/vimeo.json
```

### Solr

A pre-made collection can be found in the `solr/ok_video` directory.

Otherwise you can create a new collection with the `_default` configuration
and insert the data manually:

```bash
# From your solr installation directory
bin/solr start
bin/solr create -c ok_video
# Now create the fields as specified below
bin/post -c $(path_to_this_repo)/data/*.json
```

#### Solr fields

| Field name | Type                             |
| ---------- | -------------------------------- |
| author     | text_general                     |
| category   | string                           |
| image      | string                           |
| source     | string                           |
| title      | text_en                          |
| url        | string                           |
| _text_     | text_general (copy field from *) |

## Web UI

The web ui of the search engine can be run with `yarn`:

```bash
# From the `ui` directory
yarn install
yarn start
```

## Report

See `report/report.tex` for the project report. It can be compiled
using the `pdflatex` command:

```bash
# From the `report` directory
pdflatex report.tex
```