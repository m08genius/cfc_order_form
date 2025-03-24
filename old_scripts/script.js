let billing_address_obj = {
    promise_var: null,
    timeout_var: null,
    event_source_var: null,
    datalist_id: "bill_to_address_entries",
    proximity_lat: 35.454432,
    proximity_lon: -82.524087,
};

function ClearObject(var_obj) {
    console.log("Clearing Object.");

    if (var_obj.timeout_var != null) {
        clearTimeout(var_obj.timeout_var);
    }
    var_obj.timeout_var = null;

    if (var_obj.promise_var != null) {
        var_obj.promise_var({
            canceled: true
        });
    }
    var_obj.promise_var = null;

    event_source_var = null;
}

// function KeyDown(object) {
//     billing_address_eventSource = object.key ? 'input' : 'list';
// }

function SendRequest(entry, var_obj) {
    /* Create a new promise and send geocoding request */
    const promise = new Promise((resolve, reject) => {
        console.log("Sending Request for Entry: " + entry);

        var_obj.promise_var = reject;

        const apiKey = "caf99b293bde4567b12d6db979a188c4";

        let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(entry)}&format=json&limit=5&apiKey=${apiKey}&filter=countrycode:us&lang=en&bias=proximity:${var_obj.proximity_lon},${var_obj.proximity_lat}`;

        fetch(url)
          .then(response => {
            var_obj.promise_var = null;

            // check if the call was successful
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
    });

    console.log("Created a promise for entry: " + entry);

    promise.then((data) => {
        currentItems = data.results;
        console.log("Got the results for entry: " + entry);
        datalist_entry = document.getElementById(var_obj.datalist_id);
        while (datalist_entry.firstChild) {
            datalist_entry.removeChild(datalist_entry.firstChild);
        }

        currentItems.forEach((value, _index, _entire_array) => {
            console.log("Adding Element: " + value.formatted);
            console.log("Lat: " + value.lat);
            console.log("Lon: " + value.lon);

            element = document.createElement("option");
            element.setAttribute("value", value.formatted);
            datalist_entry.appendChild(element);
        });
    }).catch((e) => { console.log("Cancelled Request for Entry: " + entry); });
}

function AddressInput(new_entry, var_obj) {
    const TIMEOUT_TIME = 300;
    const MIN_ADDRESS_LENGTH = 3;
    
    if (var_obj.event_source_var == 'list' || new_entry.length < MIN_ADDRESS_LENGTH) {
        ClearObject(var_obj);
        return;
    }
    ClearObject(var_obj);

    console.info("Creating a timeout for entry: " + new_entry);
    var_obj.timeout_var = setTimeout(SendRequest, TIMEOUT_TIME, new_entry, var_obj);
}

function BillingAddressInput(object) {
    let new_entry = object.value;

    console.log("BillingAddressInput Activated for entry: " + new_entry);

    AddressInput(new_entry, billing_address_obj);
    
    let dynamic_text = document.getElementById("dynamic_text");
    dynamic_text.innerHTML = "Wrote: " + new_entry;

    return;
}
