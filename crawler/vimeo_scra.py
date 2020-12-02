import scrapy
import time

from config import headers
from scrapy import Request
from scrapy import Selector

class VimeoSpider(scrapy.Spider):
    name = "vimeo"
    start_urls = ["https://vimeo.com/categories"]
    base_url = "https://vimeo.com"

    def parse(self, response):
        categories = response.css(".category_cell_title_link::attr('href')").getall()
       
        for item in categories:
            category = item.split("/")[-1]
          
            for i in range(1, 3):
                time.sleep(2)
                yield Request(f"{VimeoSpider.base_url}/categories/{category}/videos/page:{i}",
                              headers=headers,
                              callback=self.parse_category_page,
                              cb_kwargs={"category": category})


    def parse_category_page(self, response, category):
        video_list = response.css(".iris_p_infinite div div .iris_video-vital").getall()

        for video in video_list:
            if isinstance(video, str):
                video = Selector(text=video)

            title = video.xpath("//a/div[2]/h5/span//text()").extract_first()
            author = video.xpath("//div//text()").extract_first()
            image = video.css(".iris_thumbnail div img::attr('src')").extract_first()
            url = video.xpath("//a/@href").extract_first()
            yield {
                "title": title,
                "author": author,
                "image": image,
                "url": url,
                "category": category,
                "source": VimeoSpider.name
            }

