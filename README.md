# ha-scriptable-widgets
Scripts for creating iOS widgets to display Home Assistant sensors via the [Scriptable app](https://scriptable.app/).

1. Add script to Scriptable app (either copy/paste or save .js file to Scriptable folder in your iCloud drive).
2. Replace `<HASS IP>` with the IP address of your Home Assistant instance (default is `homeassistant.local:8123`).
3. Replace `<YOUR Long-Lived Access Token at http://<HASS IP>/profile>` with an access token you generate in Home Assistant.
4. Modify script to get the state and/or attributes from sensor entity you're interested in.
5. Add Scriptable widget in iOS and select your script.

# Examples

1. Washer/Dryer Status
   - Displays state and time remaining of LG ThinQ connected washer and dryer
2. Shade Batteries
   - Displays battery percentage of Smart Shades (3 Day Blinds)

![IMG_9255](https://github.com/ianabshire/ha-scriptable-widgets/assets/7064594/abc486e8-7082-4da7-8517-84270b83e473)
