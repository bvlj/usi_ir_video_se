import scrapy
import time

from scrapy import Request

class VimeoSpider(scrapy.Spider):
    name = "vimeo"
    start_urls = ["https://vimeo.com/categories"]

    def parse(self, response):
        headers = {"User-Agent": "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:82.0) Gecko/20100101 Firefox/82.0"}

        categories = response.css(".category_cell_title_link::attr('href')").getall()
        for item in categories:
            category = item.split("/")[-1]
            for i in range(1, 3):
                time.sleep(2)
                yield Request(f"https://vimeo.com/categories/{category}/videos/page:{i}",
                              headers=headers,
                              callback=self.parse_category_page,
                              cb_kwargs={"category": category})


    def parse_category_page(self, response, category):
        video_list = response.css(".iris_p_infinite__item").getall()

        print(f"Found {len(video_list)} videos in {response.request.url}")
        for video in video_list:
            title = video.css(".iris_video-vital__title::text").extract_first()
            url = video.css(".iris_link-box::attr(href)").get()
            yield {
                "title": title,
                "url": url,
                "category": category
            }

