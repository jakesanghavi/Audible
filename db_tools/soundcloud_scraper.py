from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException, ElementNotInteractableException
import time
import re
import json
from wakepy import keepawake


class ArtistNotFoundError(Exception):
    pass


# Create a new instance of the Chrome driver
driver = webdriver.Chrome(ChromeDriverManager().install())

# Open SoundCloud
driver.get('https://soundcloud.com/discover')

wait = WebDriverWait(driver, 5)  # Maximum wait time of 10 seconds
song_list = []
success = {}
failed = {}


def submit_search_input(artist, attempts):
    if attempts > 3:
        raise ArtistNotFoundError("Artist could not be found.")
    driver.get(driver.current_url)
    search_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'input.headerSearch__input.sc-input.g-all-transitions-300')))
    search_input.send_keys(artist)
    try:
        search_input.submit()
    except StaleElementReferenceException:
        submit_search_input(artist, attempts+1)
    except ElementNotInteractableException:
        submit_search_input(artist, attempts+1)
    except:
        raise ArtistNotFoundError("Artist could not be found.")


def do_all(artist):
    # Perform the search input submission
    submit_search_input(artist, 0)
    # Wait for the search results to load
    search_results = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'li.searchList__item.sc-mt-3x')))

    # Find the first search result link
    first_result = search_results[0].find_element(By.CSS_SELECTOR,
                                                  'div.userItem.sc-media.g-flex-row-centered.sc-px-2x.sc-py-1x.m-horizontal.m-verified a')

    # Click the link using ActionChains
    actions = ActionChains(driver)
    actions.move_to_element(first_result).click().perform()
    profile_tabs = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'ul.profileTabs.g-tabs.g-tabs-medium')))

    # Find the second tab link and click it
    second_tab_link = profile_tabs.find_elements(By.CSS_SELECTOR, 'li')[1].find_element(By.CSS_SELECTOR, 'a')
    driver.execute_script("arguments[0].click();", second_tab_link)

    for x in range(0, 10):
        ul_element = wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'ul.lazyLoadingList__list.sc-list-nostyle.sc-clearfix')))
        li = ul_element.find_elements(By.CSS_SELECTOR, 'li.soundList__item')[x]
        # Click the specified button inside the li element
        try:
            button = WebDriverWait(li, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR,
                                                                             'button.sc-button-share.sc-button-secondary.sc-button-secondary.sc-button.sc-button-small.sc-button-responsive')))
        except:
            actions.send_keys(Keys.ESCAPE)
            continue
        #         button.click()
        driver.execute_script("arguments[0].click();", button)

        # Find the modal content
        modal_content = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'div.modal__content')))

        if len(modal_content.find_elements(By.CSS_SELECTOR, '.sc-button-disabled')) == 0:

            title = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,
                                                               '.modal__content .soundTitle__usernameTitleContainer .sc-link-primary span'))).get_attribute(
                'innerHTML')

            # Click the specified link inside the modal content
            link = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'ul.g-tabs.g-tabs-large li:nth-of-type(2) a')))
            link.click()

            # Find the input element and get its value
            input_element = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'p.widgetCustomization__codeContainer input')))
            time.sleep(1.5)
            input_value = input_element.get_attribute('value')

            # regex
            input_value = re.search(r'src="([^"]+)"', input_value).group(0)
            input_value = re.sub(r'true', 'false', input_value)
            input_value = input_value[5:-1]

            data = {}

            share = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'ul.g-tabs.g-tabs-large li:nth-of-type(1) a')))
            share.click()

            modal_cover = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, 'div.modal__content a.sound__coverArt')))
            modal_cover.click()

            driver.get(driver.current_url)

            try:
                album_name = wait.until(EC.presence_of_element_located(
                    (By.CSS_SELECTOR, '.l-sidebar-right article:nth-of-type(3) span.sc-truncate'))).get_attribute(
                    "innerHTML")
                album_year = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR,
                                                                        '.l-sidebar-right article:nth-of-type(3) span.releaseDateCompact .sc-font-light'))).get_attribute(
                    "innerHTML")
            except:
                driver.execute_script("window.history.go(-1)")
                driver.get(driver.current_url)
                continue

            album_cover = wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, 'div.image.image__lightOutline.interactive.sc-artwork span'))).get_attribute('style')
            album_cover_link = re.search(r'"(.*?)"', album_cover).group()[1:-1]

            data['song_title'] = title
            data['artist'] = artist
            data['album_name'] = album_name
            data['album_year'] = album_year
            data['soundcloud_link'] = input_value
            data['album_cover'] = album_cover_link

            song_list.append(data)

            driver.execute_script("window.history.go(-1)")
            driver.get(driver.current_url)
        else:
            try:
                close = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '.modal__closeButton')))
                #                 close.click()
                driver.get(driver.current_url)
                actions.send_keys(Keys.ESCAPE)
                driver.get(driver.current_url)
            except:
                time.sleep(0.5)
                driver.get(driver.current_url)
                close = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, '.modal__closeButton')))
                actions.send_keys(Keys.ESCAPE)
                driver.get(driver.current_url)
#                 close.click()


artists = ['Elton John', 'Billie Eilish', 'Taylor Swift', 'Banners', 'Lewis Capaldi', 'Kanye West', 'Drake',
           'Harry Styles',
           'Katy Perry', 'Jay-Z']

with keepawake(keep_screen_awake=True):
    for artist in artists:
        do_all(artist)
        success[artist] = 1
    #         try:
    #             do_all(artist)
    #             success[artist] = 1
    #         except Exception as e:
    #             print(type(e))
    #             print(e)
    #             failed[artist] = 1
    #             continue

    with open('output_test.json', 'w') as file:
        json.dump(song_list, file)

# Close the browser
driver.quit()