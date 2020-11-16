import json
import urllib.request

from selenium import webdriver
from selenium.webdriver.firefox.options import Options

def get_driver():
    options = Options()
    options.add_argument("-headless")
    # TODO move this to env variable
    return webdriver.Firefox(executable_path="./geckodriver", options=options)


def fetch_category(driver, category, num_pages=5):
    results = []

    for i in range(1, num_pages + 1):
        driver.get(f"https://vimeo.com/categories/{category}/videos/page:{i}")
        video_list = driver.find_elements_by_class_name("iris_p_infinite__item")
        for item in video_list:
            title = item.find_element_by_class_name("iris_video-vital__title").text
            url = item.find_element_by_class_name("iris_link-box").get_attribute('href')
            results.append({
                "title": title,
                "url": url,
                "category": category
            })
    return results


def fetch_categories(driver):
    results = dict()
    driver.get("https://vimeo.com/categories")
    categories_list = driver.find_elements_by_class_name("category_cell_title_link")
    for item in categories_list:
        category = item.get_attribute("href").split("/")[-1]
        results[category] = fetch_category(driver, category)

    return results


def fetch():
    driver = get_driver()
    driver.set_page_load_timeout(60)

    categories = fetch_categories(driver)
    results = dict()

    for category in categories:
        print(f"Fetching {category}")
        results[category] = fetch_category(driver, category)

    with open("./vimeo.json", "w") as f_out:
        json.dump(results, f_out)


if __name__ == "__main__":
    fetch()
