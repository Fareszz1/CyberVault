// Function to Insert Data
async function InsertData() {
    var DataName
    var DataType
    var DATA


    try {

        const { value: dataname } = await Swal.fire({
            title: "Enter your data name",
            input: "text",
            inputLabel: "Any name longer than 20 full lengths will not appear",
            inputPlaceholder: "Data name",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        });



        if (dataname) {
            DataName = dataname;
        }

        const { value: datatype } = await Swal.fire({
            title: "Select field validation",
            input: "select",
            inputOptions: {
                Datatype: {
                    text: "text",
                    email: "email",
                    url: "url",
                    password: "password",
                    textarea: "textarea",
                    date: "date"
                }
            },
            inputPlaceholder: "Select a data type",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (!value) {
                        resolve("You need to select a data type :)");
                    } else {
                        resolve();
                    }
                });
            }
        });

        if (datatype) {
            DataType = datatype
        }

        if (DataType == "text") {

            const { value: Text } = await Swal.fire({
                title: "Enter your Data",
                input: "text",
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return "You need to write something!";
                    }
                }
            });
            if (Text) {
                DATA = Text
            }

        } else if (DataType == "email") {

            const { value: email } = await Swal.fire({
                title: "Input email address",
                input: "email",
                inputPlaceholder: "Enter your email address"
            });
            if (email) {
                DATA = email
            }

        }
        else if (DataType == "url") {

            const { value: url } = await Swal.fire({
                input: "url",
                inputLabel: "URL address",
                inputPlaceholder: "Enter the URL"
            });
            if (url) {
                DATA = url
            }

        }
        else if (DataType == "password") {

            const { value: password } = await Swal.fire({
                title: "Enter your password",
                input: "password",
                inputPlaceholder: "Maximum 48 length",
                inputAttributes: {
                    maxlength: "48",
                    autocapitalize: "off",
                    autocorrect: "off"
                }
            });
            if (password) {
                DATA = password
            }

        }
        else if (DataType == "textarea") {

            const { value: text } = await Swal.fire({
                input: "textarea",
                inputLabel: "Message",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here"
                },
                showCancelButton: true
            });
            if (text) {
                DATA = text
            }

        }
        else if (DataType == "date") {

            const { value: date } = await Swal.fire({
                title: "select departure date",
                input: "date",
                didOpen: () => {
                    const today = (new Date()).toISOString();
                    Swal.getInput().min = today.split("T")[0];
                }
            });
            if (date) {
                DATA = date
            }

        } else {
            Swal.fire({
                title: "Error!",
                text: "Error In Data Type",
                icon: "error"
            });
            return;
        }


        if (!DataName) {
            Swal.fire({
                title: "Error!",
                text: "You need to fill data name",
                icon: "error"
            });
            return;
        }

        if (!DataType) {
            Swal.fire({
                title: "Error!",
                text: "You need to fill data type",
                icon: "error"
            });
            return;
        }

        if (!DATA) {
            Swal.fire({
                title: "Error!",
                text: "You need to fill data",
                icon: "error"
            });
            return;
        }

        var existingData = localStorage.getItem('Database');
        var data = existingData ? JSON.parse(existingData) : {};

        // Get current date and time
        var currentDatea = new Date();

        // Extract year, month, day, hour, minute, and second
        var year = currentDatea.getFullYear();
        var month = ('0' + (currentDatea.getMonth() + 1)).slice(-2); // Adding 1 to month because months are zero-indexed
        var day = ('0' + currentDatea.getDate()).slice(-2);
        var hour = ('0' + currentDatea.getHours()).slice(-2);
        var minute = ('0' + currentDatea.getMinutes()).slice(-2);
        var second = ('0' + currentDatea.getSeconds()).slice(-2);

        // Concatenate the components into the desired format
        var formattedDate = year + month + day + hour + minute + second;

        var newDataKey = formattedDate; // Using a timestamp as a unique key
        data[newDataKey] = {
            DataName: DataName,
            DataType: DataType,
            Data: DATA
        };

        localStorage.setItem('Database', JSON.stringify(data));

        Swal.fire({
            title: "successfully!",
            text: "Your data has been saved successfully.",
            html: 'Data name: ' + DataName + '<br/>' + 'Data type: ' + DataType + '<br/>' + 'Data: ' + DATA + '<br/>',
            icon: "success"
        });

        loadData();


    }
    catch (error) {
        Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
        });
        return;
    }

}


// Function to Download Data
async function DownloadData() {
    try {
        const key = "Database";
        // Get the item from localStorage
        const itemValue = localStorage.getItem(key);

        // Check if localStorage is empty
        if (!itemValue) {
            Swal.fire({
                title: "Error!",
                text: "The database is empty :( try to add data",
                icon: "error"
            });
            return;
        }

        // Parse the localStorage data
        const localStorageData = JSON.parse(itemValue);

        // Create an object to store the data in the desired format
        const formattedData = {};

        // Iterate through the localStorageData and format it
        for (const id in localStorageData) {
            const dataObject = localStorageData[id];
            formattedData[id] = {
                "DataName": dataObject.DataName,
                "DataType": dataObject.DataType,
                "Data": dataObject.Data
            };
        }

        // Convert the formatted data object to JSON
        const jsonData = JSON.stringify(formattedData, null, 2);

        // Create a Blob object from the JSON data
        const blob = new Blob([jsonData], { type: "application/json" });

        // Create a link element
        const a = document.createElement("a");

        // Set the link's href attribute to the Blob object
        a.href = URL.createObjectURL(blob);

        // Prompt user for file name
        const { value: fileName, dismiss } = await Swal.fire({
            title: "Enter file name",
            input: "text",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            }
        });

        // Check if user clicked cancel
        if (dismiss === Swal.DismissReason.cancel) {
            return; // or return some specific value, if needed
        }

        // Set the file name
        a.download = fileName ? fileName + ".json" : key + ".json";

        // Append the link to the document body
        document.body.appendChild(a);

        // Programmatically click the link to trigger the download
        a.click();

        // Remove the link from the document body
        document.body.removeChild(a);
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
        });
        return;
    }
}


window.onload = loadData;

function copyTextToClipboard(text) {
    // Create a temporary input element
    var tempInput = document.createElement("input");
    // Set the value of the input to the text you want to copy
    tempInput.value = text;
    // Append the input to the body
    document.body.appendChild(tempInput);
    // Select the text in the input
    tempInput.select();
    // Execute the copy command
    document.execCommand("copy");
    // Remove the temporary input
    document.body.removeChild(tempInput);
}

function deleteRow(button) {
    // Traverse up to the table row and remove it
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function GetTimeFromKey(dateString) {
    // Extract individual components
    var year = dateString.substring(0, 4);
    var month = dateString.substring(4, 6);
    var day = dateString.substring(6, 8);
    var hour = dateString.substring(8, 10);
    var minute = dateString.substring(10, 12);
    var second = dateString.substring(12, 14);

    var formattedDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    return formattedDate;
}

// Function to Load Data
function loadData() {
    try {
        var savedData = localStorage.getItem('Database');
        if (savedData) {
            var tableBody = document.getElementById("DataTableBody");
            //Clear existing rows
            tableBody.innerHTML = '';

            var dataObject = JSON.parse(savedData);

            // Convert the data object into an array
            var tableData = Object.keys(dataObject).map(function (key) {
                return dataObject[key];
            });

            var DataNumber = 0;
            if (Array.isArray(tableData)) { // Check if tableData is an array
                tableData.forEach(function (data, key) {
                    DataNumber = DataNumber + 1;
                    var table = document.getElementById('DataTableBody');
                    var row = table.insertRow(table.rows.length);

                    var cell1 = row.insertCell(0);

                    var divElementData = document.createElement("div");
                    divElementData.className = "containerCell";

                    var truncatedDataName
                    if (data.DataName.length > 20) {
                        truncatedDataName = data.DataName.substring(0, 15) + " ...";
                    }
                    else {
                        truncatedDataName = data.DataName;
                    }

                    random4DigitNumber = generateRandomNumber();
                    var labelElementDataName = document.createElement("label");
                    labelElementDataName.id = "DataName" + random4DigitNumber;
                    labelElementDataName.textContent = truncatedDataName; // Use textContent here
                    labelElementDataName.className = "labelT";
                    random4DigitNumber = generateRandomNumber();
                    labelElementDataName.name = "DataName" + random4DigitNumber;

                    divElementData.appendChild(labelElementDataName);

                    //cell1.appendChild(divElementData);

                    // Create a button for row show
                    var ShowButton = document.createElement("button");
                    ShowButton.textContent = "SHOW";
                    ShowButton.className = "btnSHOW";
                    random4DigitNumber = generateRandomNumber();
                    ShowButton.name = "SHOWBtn" + random4DigitNumber;
                    ShowButton.onclick = async function () {
                        // code
                        var currentKey = Object.keys(dataObject)[key];
                        var DateStr = GetTimeFromKey(currentKey); //YYYY-MM-DD HH-MM-SS
                        const inputValue = data.Data;

                        const { value: ipAddress } = await Swal.fire({
                            title: "Information!",
                            input: "textarea",
                            html: 'Data name: ' + data.DataName + '<br/>' + 'Data type: ' + data.DataType + '<br/>' + 'Created at: ' + DateStr + '<br/>',
                            inputLabel: "Your Data",
                            inputValue,
                            icon: "info"
                        });

                    };

                    divElementData.appendChild(ShowButton);

                    // Create a button for row Delete
                    var DeleteButton = document.createElement("button");
                    DeleteButton.textContent = "DELETE";
                    DeleteButton.className = "btnDELETE";
                    random4DigitNumber = generateRandomNumber();
                    DeleteButton.name = "DELETEBtn" + random4DigitNumber;
                    DeleteButton.onclick = function () {
                        // code
                        if (tableBody.rows.length > 1) {
                            Swal.fire({
                                title: "Are you sure to delete " + data.DataName + " ?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Yes, delete it!"
                            }).then((result) => {
                                if (result.isConfirmed) {

                                    deleteRow(this);

                                    var currentKeyD = Object.keys(dataObject)[key];
                                    // Retrieve the JSON string from localStorage
                                    let localStorageData = localStorage.getItem('Database');

                                    // Parse the JSON string into a JavaScript object
                                    let dataObjectD = JSON.parse(localStorageData);

                                    // Delete the specific key
                                    delete dataObjectD[currentKeyD];

                                    // Stringify the updated object
                                    let updatedLocalStorageData = JSON.stringify(dataObjectD);

                                    // Store the updated JSON string back into localStorage
                                    localStorage.setItem('Database', updatedLocalStorageData);

                                    Swal.fire({
                                        icon: "warning",
                                        title: "Deleted!",
                                        text: data.DataName + " deleted !",
                                        timer: 1000,
                                        timerProgressBar: true,
                                        toast: true,
                                        position: "top-end",
                                        showConfirmButton: false
                                    });

                                }
                            });
                        }
                        else {
                            Swal.fire({
                                title: "Error!",
                                text: "You cannot delete a single row, please use the reset button.",
                                icon: "error"
                            });
                            return;
                        }
                    };


                    divElementData.appendChild(DeleteButton);

                    // Create a button for row Copy
                    var CopyButton = document.createElement("button");
                    CopyButton.textContent = "COPY";
                    CopyButton.className = "btnCOPY";
                    random4DigitNumber = generateRandomNumber();
                    CopyButton.name = "COPYBtn" + random4DigitNumber;
                    CopyButton.onclick = function () {
                        // code
                        copyTextToClipboard(data.Data)
                        Swal.fire({
                            icon: "info",
                            title: "Copied!",
                            text: "From: " + data.DataName,
                            timer: 1000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false
                        });
                    };

                    divElementData.appendChild(CopyButton);


                    // Show The Number of data
                    random4DigitNumber = generateRandomNumber();
                    var labelElementDataNumber = document.createElement("label");
                    labelElementDataNumber.id = "DataNumber" + random4DigitNumber;
                    labelElementDataNumber.textContent = DataNumber; // Use textContent here
                    labelElementDataNumber.className = "labelCell";
                    random4DigitNumber = generateRandomNumber();
                    labelElementDataNumber.name = "DataNumber" + random4DigitNumber;

                    divElementData.appendChild(labelElementDataNumber);

                    cell1.appendChild(divElementData);

                });
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Data retrieved from database is not an array.",
                    icon: "error"
                });
                return;
            }
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
        });
        return;
    }
}


//Generate a random decimal between 0 (inclusive) and 1 (exclusive)
function generateRandomNumber() {
    // Generate a random decimal between 0 (inclusive) and 1 (exclusive)
    const randomDecimal = Math.random();

    // Scale the decimal to a 4-digit integer
    const randomNumber = Math.floor(randomDecimal * 9000) + 1000;

    return randomNumber;
}

// Function to Import Data
async function ImportData() {
    try {
        const result = await Swal.fire({
            title: 'Select JSON File',
            input: 'file',
            inputAttributes: {
                accept: 'application/json',
                'aria-label': 'Upload JSON file'
            },
            showCancelButton: true,
            confirmButtonText: 'Import',
            showLoaderOnConfirm: true,
            preConfirm: (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const parsedData = JSON.parse(e.target.result);
                            // Convert parsedData to string
                            const parsedDataString = JSON.stringify(parsedData);


                            for (const keys in parsedData) {
                                if (parsedData.hasOwnProperty(keys)) {
                                    // Check if parsedDataString contains the text "Database"
                                    if (keys.includes("Database")) {
                                        Swal.fire({
                                            title: "Error!",
                                            text: "JSON data does not contain the expected key.",
                                            icon: "error"
                                        });
                                        return;
                                    }
                                }
                            }

                            for (const key in parsedData) {
                                if (parsedData.hasOwnProperty(key)) {
                                    // Check if any value is null
                                    if (parsedData[key] === null || parsedData[key] == null || parsedData[key] === "null" || parsedData[key] == "null") {
                                        Swal.fire({
                                            title: "Error!",
                                            text: "Value for key " + key + " is null.",
                                            icon: "error"
                                        });
                                        return;
                                    }
                                }
                            }

                            // Check if parsedData is null or undefined
                            if (parsedData === null || parsedData === undefined || parsedData == null || parsedData == undefined || parsedData === "null" || parsedData === "undefined" || parsedData == "undefined" || parsedData == "null") {
                                Swal.fire({
                                    title: "Error!",
                                    text: "JSON data is null or undefined.",
                                    icon: "error"
                                });
                                return;
                            }

                            // Check if parsedData is not an object
                            if (typeof parsedData !== "object") {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Invalid JSON data format.",
                                    icon: "error"
                                });
                                return;
                            }

                            // Get the current data from localStorage
                            const currentData = JSON.parse(localStorage.getItem("Database")) || {};

                            // Merge parsedData with currentData
                            const newData = { ...currentData, ...parsedData };

                            // Convert newData to JSON string
                            const newDataJson = JSON.stringify(newData);

                            // Update the localStorage with the merged data
                            localStorage.setItem("Database", newDataJson);

                            resolve();
                        } catch (error) {
                            Swal.showValidationMessage(`Error reading file: ${error}`);
                        }
                    };
                    reader.readAsText(file);
                });
            }
        });

        if (result.isConfirmed) {
            Swal.fire(
                'Successfully!',
                'Data imported successfully.',
                'success'
            );
            loadData();
        }
    } catch (error) {
        Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error"
        });
    }
}

// Function to merge two JSON objects
function mergeJSON(json1, json2) {
    var mergedJSON = {};

    // Copy properties from json1 to mergedJSON
    for (var key in json1) {
        if (json1.hasOwnProperty(key)) {
            mergedJSON[key] = json1[key];
        }
    }

    // Copy properties from json2 to mergedJSON
    for (var key in json2) {
        if (json2.hasOwnProperty(key)) {
            mergedJSON[key] = json2[key];
        }
    }

    return mergedJSON;
}



// Function to Delete Data
function DeleteData() {
    Swal.fire({
        title: "Are you sure to delete all saved data?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                // To remove a specific item from local storage
                localStorage.removeItem('Database');
                Swal.fire({
                    title: "Deleted!",
                    text: "Your data has been deleted.",
                    icon: "success"
                });
                var tableBody = document.getElementById("DataTableBody");
                tableBody.innerHTML = '';
            }
            catch (error) {
                Swal.fire({
                    title: "Error!",
                    text: error.message,
                    icon: "error"
                });
                return;
            }
        }
    });
}

// Function to filter table rows based on input text
function filterTableRows() {
    var inputText = document.querySelector('.inputSearchBar').value.toLowerCase(); // Get the input text and convert it to lowercase
    var tableRows = document.querySelectorAll('#DataTableBody tr'); // Get all table rows in the tbody

    tableRows.forEach(function (row) {
        var dataName = row.querySelector('.labelT').textContent.toLowerCase(); // Get the data name in lowercase

        // If the input text is empty or matches the data name, show the row; otherwise, hide it
        if (inputText === '' || dataName.includes(inputText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add event listener to input field to trigger filtering on input change
document.querySelector('.inputSearchBar').addEventListener('input', filterTableRows);
