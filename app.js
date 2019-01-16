const MbedCloudSDK = require("mbed-cloud-sdk");

// Note that worksheet is identified by a progressive number then user cannot rename it (otherwise subscription will fail
// to write new values).
let sheetIndex = 1;
let connect;

(function () {
    // Make sure that we're running with a recent version of the Excel.js API.
	Office.onReady().then(function() {
        $(document).ready(function () {
            if (!Office.context.requirements.isSetSupported("ExcelApi", 1.7)) {
                console.log("Sorry, the Portal add-in uses Excel.js APIs that are not available in your version of Office.");
            }

            $("#subscribe").click(createSubscription);
        });
    });

    // This function creates a new worksheet and subscribes for changes in the specified resource.
    function createSubscription() {
        // We connect to the Mbed server when we first try to subscribe, in this way the user can enter
        // its own API Key and API host address. After the first initialization these values cannot be changed.
        if (!connect) {
            connect = new MbedCloudSDK.ConnectApi({
                apiKey: $("#api-key").val(),
                host: $("#host").val()
            });

            $("#api-key").attr("disabled", true);
            $("#host").attr("disabled", true);
        }

        // Let's get the device ID and URL for the resource to monitor: we create a new worksheet for each
        // subscription: we first read the current value and then wait for changes. While reading the initial value
        // we restrict the user from trying to add new subscription.
        const deviceId = $("#device-id").val();
        const resourceURI = $("#resource-uri").val();
        $("#subscribe").attr("disabled", true);

        Excel.run(function (context) {
            const currentWorksheet = context.workbook.worksheets.add(getWorksheetName(sheetIndex++, deviceId, resourceURI));

            // getResourceValue() returns a promise with the value read from the resource.
            return connect.getResourceValue(deviceId, resourceURI).then(function(data) {
                // Now that we're done we can let the user add new subscription
                $("#subscribe").removeAttr("disabled");

                // Log the received value and start observing for changes
                return logValue(context, currentWorksheet, sheetIndex - 1, deviceId, resourceURI, JSON.stringify(data)).then(function () {
                    return context.sync().then(function () {
                        return subscribe(sheetIndex - 1, deviceId, resourceURI);
                    });
                });
            }).catch(function (error) {
                console.error("getResourceValue: ", error);
            });
        }).catch(function (error) {
            $("#subscribe").removeAttr("disabled");
            console.error("Error: ", error);
            if (error instanceof OfficeExtension.Error) {
                console.error("Debug info: " + JSON.stringify(error.debugInfo));
            }
        });
    }

    // This function subscribe for changes of a specified resource.
    function subscribe(sheetIndex, deviceId, resourceURI) {
        return connect.addResourceSubscription(deviceId, resourceURI, function (changedData) {
            return Excel.run(function (context) {
                context.workbook.worksheets.load();
                return context.sync().then(function () {
                    const worksheetName = getWorksheetName(sheetIndex, deviceId, resourceURI);
                    const currentWorksheet = context.workbook.worksheets.items.find(x => x.name === worksheetName);
                    return logValue(context, currentWorksheet, sheetIndex, deviceId, resourceURI, changedData);
                });
            });
        });
    }

    // Adds a new line in the table that contains the values for the specified resource.
    // Note (again) that the worksheet is identifgied with its index (sheetIndex) and the
    // name of the resource (resourceURI) then user cannot rename it. If user is editing
    // something (Excel is in editing mode) then this function will fail to update the table.
    function logValue(context, currentWorksheet, sheetIndex, deviceId, resourceURI, value) {
        currentWorksheet.tables.load();

        const name = "ResourceTable_" + sheetIndex;
        return context.sync().then(function () {
            let resourceTable = currentWorksheet.tables.items.find(x => x.name === name);
            let justCreated = false;
            if (!resourceTable) {
                resourceTable = currentWorksheet.tables.add("A1:C1", true);
                resourceTable.name = name;
                resourceTable.getHeaderRowRange().values = [["Device ID", "Resource URL", "Value"]];
                justCreated = true;
            }

            resourceTable.rows.add(null, [
                [deviceId, resourceURI, value],
            ]);

            if (justCreated) {
                resourceTable.getRange().format.autofitColumns();
                resourceTable.getRange().format.autofitRows();
            }
        });
    }

    // It might be nice to have the device ID in the name but
    // there are limitations on the maximum length.
    function getWorksheetName(sheetIndex, deviceId, resourceURI) {
        return sheetIndex + resourceURI.replace(/\//g, "-");
    }
})();