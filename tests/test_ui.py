from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import pytest
import subprocess
import json

def get_debug_data(browser):
    action = webdriver.ActionChains(browser).key_down('d').key_up('d')
    action.perform()
    data = browser.find_element(By.ID, "debugConsole").text
    json_data = json.loads(data)
    return json_data

def increase_currency_hack(browser):
    action = webdriver.ActionChains(browser).key_down(Keys.ALT).key_down(Keys.SHIFT).key_down('c').key_up('c').key_up(Keys.SHIFT).key_up(Keys.ALT)
    action.perform()

class TestClass:
    # app = subprocess.Popen(["npm", "start"])
    # time.sleep(5)
    browser = webdriver.Chrome()
    browser.get("http://localhost:3000")

    # Wait for Chromedriver to load
    timeout = 5
    try:
        element_present = EC.presence_of_element_located((By.ID, 'defaultCanvas0'))
        WebDriverWait(browser, timeout).until(element_present)
    except TimeoutException:
        print("Timed out waiting for page to load")

    @pytest.mark.dependency()
    def test_title_screen(self):
        """Test that the title screen is displayed"""
        elem = self.browser.find_element(By.CLASS_NAME, "startButton")
        assert elem.is_displayed(), "Start button not displayed"
        elem.click()
        time.sleep(1)
        assert not elem.is_displayed(), "Start button still displayed"

    @pytest.mark.dependency(depends=["test_title_screen"])
    def test_settings_menu(self):
        """Test that the settings menu is displayed"""

        settingButton = self.browser.find_element(By.ID, "settingsButton")
        loadButton = self.browser.find_element(By.ID, "loadButton")
        saveButton = self.browser.find_element(By.ID, "saveButton")
        audioButton = self.browser.find_element(By.ID, "audioButton")
        assert settingButton.is_displayed(), "Settings button not displayed"
        assert not loadButton.is_displayed(), "Load button displayed"
        assert not saveButton.is_displayed(), "Save button displayed"
        assert not audioButton.is_displayed(), "Audio button displayed"
        settingButton.click()
        time.sleep(1)
        assert loadButton.is_displayed(), "Load button not displayed"
        assert saveButton.is_displayed(),  "Save button not displayed"
        assert audioButton.is_displayed(), "Audio button not displayed"
        settingButton.click()
        time.sleep(1)
        assert settingButton.is_displayed(), "Settings button not displayed"
        assert not loadButton.is_displayed(), "Load button displayed"
        assert not saveButton.is_displayed(), "Save button displayed"
        assert not audioButton.is_displayed(), "Audio button displayed"

    def test_debug(self):
        action = webdriver.ActionChains(self.browser).key_down('d').key_up('d')
        action.perform()

        debugConsole = self.browser.find_element(By.ID, "debugConsole")
        assert debugConsole.is_displayed(), "Debug console not displayed"
        time.sleep(2)
        assert "towers" in debugConsole.text, "Towers not in game data"
        assert "enemies" in debugConsole.text, "Enemies not in game data"
        print(debugConsole.text)

    @pytest.mark.dependency(depends=["test_title_screen", "test_debug"])
    def test_place_tower(self):
        debug_console_old = get_debug_data(self.browser)
        time.sleep(2)

        action = webdriver.ActionChains(self.browser).move_to_element_with_offset(self.browser.find_element(By.ID, "defaultCanvas0"), 200, 200).click()
        action.perform()

        time.sleep(2)
        debug_console_new = get_debug_data(self.browser)

        assert len(debug_console_new["towers"]) == len(debug_console_old["towers"]) + 1, "Tower not placed"
        assert debug_console_new["towers"][0]["x"] == 200, "Tower x position incorrect"
        assert debug_console_new["towers"][0]["y"] == 178, "Tower y position incorrect"
        assert debug_console_new["totalCurrency"] == debug_console_old["totalCurrency"] - 400, "Currency not deducted"

    @pytest.mark.dependency(depends=["test_title_screen", "test_debug"])
    def test_wave_spawn(self):
        """Test that the wave spawns enemies"""

        wave_button = self.browser.find_element(By.ID, "nextWaveButton")

        actions = webdriver.ActionChains(self.browser)
        actions.move_to_element(wave_button)

        actions.perform()
        wave_button.click()

        time.sleep(4)
        debug_console = get_debug_data(self.browser)
        assert len(debug_console["enemies"]) > 0, "Enemies not spawned"

        time.sleep(4)
        debug_console_new = get_debug_data(self.browser)
        assert debug_console_new["enemies"][0]["x"] > debug_console["enemies"][0]["x"], "Enemy has not moved"
        assert debug_console["currentWave"] == 1, "Wave not incremented"

    @pytest.mark.dependency(depends=["test_place_tower", "test_debug"])
    def test_tower_upgrades(self):

        increase_currency_hack(self.browser)
        increase_currency_hack(self.browser)

        # Create another tower
        action = webdriver.ActionChains(self.browser).move_to_element_with_offset(self.browser.find_element(By.ID, "defaultCanvas0"), 400, 400).click()
        action.perform()

        upgrade_range_button = self.browser.find_element(By.ID, "upgradeRangeButton")
        upgrade_fire_rate_button = self.browser.find_element(By.ID, "upgradeFireRateButton")
        upgrade_fire_speed_button = self.browser.find_element(By.ID, "upgradeFireSpeedButton")

        debug_console_old = get_debug_data(self.browser)
        time.sleep(2)
        upgrade_range_button.click()
        time.sleep(2)
        action = webdriver.ActionChains(self.browser).move_to_element_with_offset(self.browser.find_element(By.ID, "defaultCanvas0"), 200, 200).click()
        action.perform()
        time.sleep(2)
        debug_console_new = get_debug_data(self.browser)
        assert debug_console_new["towers"][0]["range"] > debug_console_old["towers"][0]["range"], "Range not upgraded"
        assert debug_console_new["towers"][1]["range"] == debug_console_old["towers"][1]["range"], "Range upgraded on wrong tower"

        debug_console_old = debug_console_new
        time.sleep(2)
        upgrade_fire_rate_button.click()
        time.sleep(2)
        action = webdriver.ActionChains(self.browser).move_to_element_with_offset(self.browser.find_element(By.ID, "defaultCanvas0"), 400, 400).click()
        action.perform()
        time.sleep(2)
        debug_console_new = get_debug_data(self.browser)
        assert debug_console_new["towers"][1]["fireRate"] > debug_console_old["towers"][1]["fireRate"], "Fire rate not upgraded"
        assert debug_console_new["towers"][0]["fireRate"] == debug_console_old["towers"][0]["fireRate"], "Fire rate upgraded on wrong tower"

        debug_console_old = debug_console_new
        time.sleep(2)
        upgrade_fire_speed_button.click()
        time.sleep(2)
        action = webdriver.ActionChains(self.browser).move_to_element_with_offset(self.browser.find_element(By.ID, "defaultCanvas0"), 200, 200).click()
        action.perform()
        time.sleep(2)
        debug_console_new = get_debug_data(self.browser)
        assert debug_console_new["towers"][0]["fireSpeed"] > debug_console_old["towers"][0]["fireSpeed"], "Fire speed not upgraded"
        assert debug_console_new["towers"][1]["fireSpeed"] == debug_console_old["towers"][1]["fireSpeed"], "Fire speed upgraded on wrong tower"



    @pytest.mark.last
    def test_close(self):
        self.browser.close()
        # self.app.terminate()