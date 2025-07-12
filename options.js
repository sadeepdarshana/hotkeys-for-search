// In MV3, we can't access the background page directly, so we use messaging
var currentSettings = {}; // Make this global to the file

document.addEventListener('DOMContentLoaded', function()
{
	var eventNewTabChecked = new Event("change");

	// Get current hotkeys for displaying on the page
	chrome.commands.getAll(function(commands)
	{
		document.getElementById("shortcut1").textContent = commands[1].shortcut;
		document.getElementById("shortcut2").textContent = commands[2].shortcut;
		document.getElementById("shortcut3").textContent = commands[3].shortcut;
		document.getElementById("shortcut4").textContent = commands[4].shortcut;
	});

	// Get settings from background service worker
	chrome.runtime.sendMessage({action: "getSettings"}, function(response) {
		if (response && response.settings) {
			currentSettings = response.settings;

			// Populate options page with current values
			document.getElementById("search1").value = currentSettings["search1"] || "";
			document.getElementById("search2").value = currentSettings["search2"] || "";
			document.getElementById("search3").value = currentSettings["search3"] || "";
			document.getElementById("search4").value = currentSettings["search4"] || "";
			document.getElementById("openNewTab").checked = currentSettings["openNewTab"] || false;
			document.getElementById("openOnLeft").checked = currentSettings["openOnLeft"] || false;
			document.getElementById("openInBackground").checked = currentSettings["openInBackground"] || false;
			document.getElementById("openURLDirectly").checked = currentSettings["openURLDirectly"] || false;
			document.getElementById("openNewTab").dispatchEvent(eventNewTabChecked);
			enableNewTabSettings();
		}
	});

	// Get default values if Defaults button is clicked
	document.getElementById("Defaults").addEventListener("click", defaults, false);

	function defaults()
	{
		chrome.runtime.sendMessage({action: "getDefaultSettings"}, function(response) {
			if (response && response.settings) {
				// Update currentSettings with default values
				currentSettings = response.settings;

				// Update form with default values
				document.getElementById("search1").value = currentSettings.search1;
				document.getElementById("search2").value = currentSettings.search2;
				document.getElementById("search3").value = currentSettings.search3;
				document.getElementById("search4").value = currentSettings.search4;
				document.getElementById("openNewTab").checked = currentSettings.openNewTab;
				document.getElementById("openOnLeft").checked = currentSettings.openOnLeft;
				document.getElementById("openInBackground").checked = currentSettings.openInBackground;
				document.getElementById("openURLDirectly").checked = currentSettings.openURLDirectly;
				document.getElementById("openNewTab").dispatchEvent(eventNewTabChecked);
			}
		});
	}

	// Link to Chrome extensions page
	document.getElementById('shortcutsLink').addEventListener('click', function()
	{
		chrome.tabs.update(
		{
			url: 'chrome://extensions/shortcuts'
		});
		window.close();
	});

	// Save settings when closing options page
	addEventListener("unload", function(event)
	{
		// Update currentSettings with form values
		currentSettings["search1"] = document.getElementById("search1").value;
		currentSettings["search2"] = document.getElementById("search2").value;
		currentSettings["search3"] = document.getElementById("search3").value;
		currentSettings["search4"] = document.getElementById("search4").value;
		currentSettings["openNewTab"] = document.getElementById("openNewTab").checked;
		currentSettings["openOnLeft"] = document.getElementById("openOnLeft").checked;
		currentSettings["openInBackground"] = document.getElementById("openInBackground").checked;
		currentSettings["openURLDirectly"] = document.getElementById("openURLDirectly").checked;

		// Send settings to background service worker
		chrome.runtime.sendMessage({
			action: "saveSettings",
			settings: currentSettings
		});
	}, true);

	document.getElementById("openNewTab").addEventListener("change", enableNewTabSettings, false);

	function enableNewTabSettings()
	{
		if (document.getElementById("openNewTab").checked == true)
		{
			document.getElementById("openOnLeft").disabled = false;
			document.getElementById("openOnLeftLabel").className = "";
			document.getElementById("openInBackground").disabled = false;
			document.getElementById("openInBackgroundLabel").className = "";
		}
		else
		{
			document.getElementById("openOnLeft").disabled = true;
			document.getElementById("openOnLeftLabel").className = "disabled";
			document.getElementById("openInBackground").disabled = true;
			document.getElementById("openInBackgroundLabel").className = "disabled";
		}
	}

});
