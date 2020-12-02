import scrapy
import time

from config import headers
from scrapy import Request
from scrapy import Selector

class TedSpider(scrapy.Spider):
    name = "ted"
    start_urls = ["https://www.ted.com/topics"]
    base_url = "https://www.ted.com"

    def parse(self, response):
        categories = response.css(".sa::attr('href')").getall()
 
        for item in categories:
            category = item.split("/")[-1]
            time.sleep(2)
            yield Request(f"{TedSpider.base_url}/talks?topics%5B%5D={category}",
                          headers=headers,
                          callback=self.parse_category_page,
                          cb_kwargs={"category": category})


    def parse_category_page(self, response, category):
        video_list = response.css(".talk-link").getall()

        for video in video_list:
            if isinstance(video, str):
                video = Selector(text=video)

            title = video.xpath("//div/div[2]/h4[2]/a//text()").extract_first()
            author = video.xpath("//div/div[2]/h4[1]//text()").extract_first()
            title = title.replace("\n", "")
            image = video.css(".thumb__image::attr('src')").extract_first()
            url = video.css(".ga-link::attr('href')").extract_first()

            yield {
                "title": title,
                "author": author,
                "url": TedSpider.base_url + url,
                "image": image,
                "category": category,
                "source": "ted"
            }

