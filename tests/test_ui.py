from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import pytest
import subprocess

class TestClass:
    app = subprocess.Popen(["npm", "start"])
    time.sleep(5)
    browser = webdriver.Chrome()
    browser.get("http://localhost:3000")
    time.sleep(10)

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

    @pytest.mark.last
    def test_close(self):
        self.browser.close()
        self.app.terminate()