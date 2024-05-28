// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
/* Adapted from m33x: https://gist.github.com/m33x/62f6e8f6eab546e4b3a854695ea8c3a8 */


let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

async function createWidget(items) {
    /* Get data from API */
    /*const tempImg = await getImage('temperature.png');
    const humidImg = await getImage('humidity.png');
    const logoImg = await getImage('hass-favicon.png');*/

    let req = new Request("http://homeassistant.local:8123/api/states")
    
    req.headers = { "Authorization": "Bearer ***REMOVED***", "content-type": "application/json" }
    let json = await req.loadJSON();
    //console.log(json) // for debugging

    /* Parse data received from API */
    let data = {stair: {}, front: {}, left: {}, right: {}, rear: {}, nursery: {}, office: {}}

    data.stair = addData(json, data.stair, 'sensor.stair_window_battery');
    
    data.front = addData(json, data.front, 'sensor.front_slider_battery');
    
    data.left = addData(json, data.left, 'sensor.left_window_battery')
    
    data.right = addData(json, data.right, 'sensor.right_window_battery')
    
    data.rear = addData(json, data.rear, 'sensor.rollerblind_0008_battery')
    
    data.nursery = addData(json, data.nursery, 'sensor.nursery_window_battery')
    
    data.office = addData(json, data.office, 'sensor.office_window_battery')

    /* Create the widget */
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#A3C1D6", 0.5);
    widget.setPadding(0, 0, 0, 0);

    /* Design the widget header */
    let headerStack = widget.addStack();

    const titleStack = headerStack.addStack();
    headerStack.addSpacer(7);

    /* Add the name of this Home Assistant */
    const titleLabel = titleStack.addText("SHADE BATTERIES");
    titleStack.setPadding(0, 4, 0, 0);
    titleLabel.font = Font.regularMonospacedSystemFont(12);
    titleLabel.textColor = new Color("#5C5776")

    /* Add a temperature icon */
    /*tempImageStack.backgroundColor = new Color("#03a9f4", 1.0)
    tempImageStack.cornerRadius = 1
    const wimgTemp = tempImageStack.addImage(tempImg)
    wimgTemp.imageSize = new Size(20, 20)
    wimgTemp.rightAlignImage()*/

    widget.addSpacer(10)

    /* Add the sensor entries */
    const bodyStack = widget.addStack();

    /* First, the label column */
    const labelStack = bodyStack.addStack();
    labelStack.setPadding(0, 0, 0, 0);
    labelStack.borderWidth = 0;
    labelStack.layoutVertically();

    addLabel(labelStack, " Stair Window:")
    addLabel(labelStack, " Front Slider:")
    addLabel(labelStack, " Left Window:")
    addLabel(labelStack, " Right Window:")
    addLabel(labelStack, " Rear Slider:")
    addLabel(labelStack, " Nursery:")
    addLabel(labelStack, " Office:")

    /* Second, the temperature column */
    const batteryStack = bodyStack.addStack();
    batteryStack.setPadding(0, 3, 0, 0);
    batteryStack.borderWidth = 0;
    batteryStack.layoutVertically();

    addBattery(batteryStack, data.stair)
    addBattery(batteryStack, data.front)
    addBattery(batteryStack, data.left)
    addBattery(batteryStack, data.right)
    addBattery(batteryStack, data.rear)
    addBattery(batteryStack, data.nursery)
    addBattery(batteryStack, data.office)
    
    widget.addSpacer(5)

    /* Done: Widget is now ready to be displayed */
    return widget;
}

/* Adds the entries to the label column */
async function addLabel(labelStack, label) {
    const mytext = labelStack.addText(label);
    mytext.font = Font.mediumSystemFont(12);
    mytext.textColor = new Color("#5C5776");
}

/* Adds the entries to the temperature column */
async function addBattery(batteryStack, data) {
    const mytext = batteryStack.addText(data.battery + "%");
    mytext.font = Font.mediumMonospacedSystemFont(12);
    if (data.battery < 10) {
        mytext.textColor = Color.red();
    }
    else if (data.battery >= 10 && data.battery < 20) {
        mytext.textColor = Color.orange();
    }
    else {
        mytext.textColor = Color.green();
    }
}

/* Searches for the respective sensor values ('state') in the API response of Home Assistant */
function addData(json, shade, sensor) {
    shade.battery = "N/A";
    var i;
    for (i = 0; i < json.length; i++) {
        if (json[i]['entity_id'] == sensor) {
            shade.battery = Math.round(json[i]['state']);
        }
    }
    return shade;
}

// The following functions are for getting images (not currently used in this widget)

/*
The following function is "borrowed" from:
https://gist.github.com/marco79cgn/23ce08fd8711ee893a3be12d4543f2d2
Retrieves the image from the local file store or downloads it once
*/
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'temperature.png':
                imageUrl = "https://<YOU NEED TO HOST THIS>/temperature.png"
                break
            case 'humidity.png':
                imageUrl = "https://<YOU NEED TO HOST THIS>/humidity.png"
                break
            case 'hass-favicon.png':
                imageUrl = "https://<HASS IP>/static/icons/favicon-192x192.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let iconImage = await loadImage(imageUrl)
        fm.writeImage(path, iconImage)
        return iconImage
    }
}

/*
The following function is "borrowed" from:
https://gist.github.com/marco79cgn/23ce08fd8711ee893a3be12d4543f2d2
Downloads an image from a given URL
*/
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}


