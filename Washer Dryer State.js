// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: magic;
/* Adapted from m33x: https://gist.github.com/m33x/62f6e8f6eab546e4b3a854695ea8c3a8 */


let widget = await createWidget();
if (!config.runsInWidget) {
    await widget.presentSmall();
}

Script.setWidget(widget);
Script.complete();

async function createWidget(items) {
    /* Get data from API */

    let req = new Request("http://homeassistant.local:8123/api/states")
    
    req.headers = { "Authorization": "Bearer ***REMOVED***", "content-type": "application/json" }
    let json = await req.loadJSON();
    //console.log(json) // for debugging

    /* Parse data received from API */
    let data = {washer: {}, dryer: {}}

    data.washer = addData(json, data.washer, 'sensor.washer');
    
    data.dryer = addData(json, data.dryer, 'sensor.dryer');

    /* Create the widget */
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#A3C1D6", 0.5);//Color("#03a9f4", 1.0);
    widget.setPadding(0, 0, 0, 0);

    /* Design the widget header */
    let headerStack = widget.addStack();
    const titleStack = headerStack.addStack();
    headerStack.addSpacer(5);

    /* Add the name of this Home Assistant widget */
    const titleLabel = titleStack.addText("WASHER/DRYER STATUS");
    titleStack.setPadding(0, 4, 0, 0);
    titleLabel.font = Font.regularMonospacedSystemFont(12);
    titleLabel.textColor = new Color("#5C5776")

    widget.addSpacer(25)

    /* Add the sensor entries */
    const bodyStack = widget.addStack();

    /* First, the label column */
    const labelStack = bodyStack.addStack();
    labelStack.setPadding(0, 4, 0, 0);
    labelStack.borderWidth = 0;
    labelStack.layoutVertically();

    addLabel(labelStack, " Washer:")
    addLabel(labelStack, " Remaining:")

    labelStack.addSpacer(10)

    addLabel(labelStack, " Dryer:")
    addLabel(labelStack, " Remaining:")

    /* Second, the temperature column */
    const dataStack = bodyStack.addStack();
    dataStack.setPadding(0, 14, 0, 0);
    dataStack.borderWidth = 0;
    dataStack.layoutVertically();

    addDataField(dataStack, data.washer.state)
    addDataField(dataStack, data.washer.remain_time)

    dataStack.addSpacer(10)

    addDataField(dataStack, data.dryer.state)
    addDataField(dataStack, data.dryer.remain_time)

    widget.addSpacer(20)

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
async function addDataField(dataStack, data) {
    const mytext = dataStack.addText(data);
    mytext.font = Font.mediumMonospacedSystemFont(12);
    mytext.textColor = Color.black();
}

/* Searches for the respective sensor values ('state') in the API response of 
Home Assistant and gets attribute values*/
function addData(json, device, sensor) {
    device.state = "Off";
    device.remain_time = "-"
    var i;
    for (i = 0; i < json.length; i++) {
        if (json[i]['entity_id'] == sensor) {
            state = json[i]['state'];
            if (state == "on"){
                if (json[i]['attributes']['run_completed'] == "on") {
                    device.state = "Complete";
                }
                else {
                    device.state = json[i]['attributes']['run_state'];
                }
            }
            else {
                device.state = "Off"
            }

            device.remain_time = json[i]['attributes']['remain_time'];
        }
    }
    return device;
}
