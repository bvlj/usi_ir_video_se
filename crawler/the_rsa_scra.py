import scrapy
import time

from config import headers
from scrapy import Request
from scrapy import Selector

class TheRsaSpider(scrapy.Spider):
    name = "the_rsa"
    start_urls = ["https://www.thersa.org/video"]
    base_url = "https://www.thersa.org"

    def parse(self, response):
        categories = response.css("#topicsDialog div ul li a").getall()
        
        for item in categories:
            if isinstance(item, str):
                item = Selector(text=item)

            url = item.xpath("//@href").extract_first()
            if url is None:
                continue

            time.sleep(2)
            category = item.xpath("//span/span[1]//text()").extract_first()
            category = category.strip().replace("\r", "").replace("\n", "")
            yield Request(TheRsaSpider.base_url + url,
                          headers=headers,
                          callback=self.parse_category_page,
                          cb_kwargs={"category": category})


    def parse_category_page(self, response, category):
        video_list = response.css("#contentHolder li .promoBlock .promoBlockWrap").getall()
        print(f"Found {len(video_list)} videos")

        for video in video_list:
            if isinstance(video, str):
                video = Selector(text=video)

            title = video.css(".text .textWrap h3 a::text").extract_first()
            title = title.strip().replace("\r", "").replace("\n", "")
            url = video.css(".text .textWrap h3 a::attr('href')").extract_first()
            image = video.css(".image a img::attr('src')").extract_first()

            yield {
                "title": title,
                "author": "",
                "url": TheRsaSpider.base_url + url,
                "image": TheRsaSpider.base_url + image,
                "category": category,
                "source": TheRsaSpider.name
            }



