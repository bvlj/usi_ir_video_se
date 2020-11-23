import scrapy
import time

from config import headers
from scrapy import Request
from scrapy import Selector

class TalksAtGoogleSpider(scrapy.Spider):
    name = "talks_at_google"
    start_urls = ["https://talksat.withgoogle.com/explore"]

    def parse(self, response):
        categories = response.css(".explore-categories div a::attr('href')").getall()
        for item in categories:
            category = item.split("/")[-1]
            time.sleep(2)
            yield Request(f"https://talksat.withgoogle.com/{item}",
                          headers=headers,
                          callback=self.parse_category_page,
                          cb_kwargs={"category": category})


    def parse_category_page(self, response, category):
        video_list = response.css("#latest-panel div a").getall()
        for video in video_list:
            if isinstance(video, str):
                video = Selector(text=video)
            title = video.xpath("//div/div[2]/div/h5//text()").extract_first()
            author = video.xpath("//div/div[2]/div/h4//text()").extract_first()
            url = video.xpath("//@href").extract_first()

            if title is None:
                # Link to their search engine, ignore
                continue

            yield {
                "title": title,
                "author": author,
                "url": f"https://talksat.withgoogle.com{url}",
                "category": category,
                "source": "talks_at_google"
            }


