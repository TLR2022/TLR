//Constant Variables **** Change Per Store
//Currently Set For Nashville
const storeId = 73175160;
const token = "public_BTNfDsq3gAQa6rztRGyuGm6cu8yJqGmq";
const ptoken = "secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1";
const barCodePrefix = "ORDER-";
//dont edit the following variable
var orderId;
var qTickets;
var fStatus;
var orderNumber;
var aNotes;
var barCode;

//scanner
function onScanSuccess(decodedText, decodedResult) {
    barCode = (`Code scanned = ${decodedText}`, decodedResult);
    //check if the barcode meets the format of 
    if (String(barCode.decodedText.slice(0, 6)) == barCodePrefix) {
        console.log(barCode.decodedText+" Is Proper Barcode");
        $("#qrCode").text(barCode.decodedText.slice(6));
        $("#orderNum").val(barCode.decodedText.slice(6));
        searchOrders();
        setTimeout(function(){
        console.log("Scanning Again");
        },2000);
    }
    else {
        console.log("Error Reading BarCode");
    }
}

//qrbox: 250 OLD VALUE
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 300 });
html5QrcodeScanner.render(onScanSuccess);

//clean on screen variables *** Initial Load *** Remove NULL
$("#firstName").text("");
$("#lastName").text("");
$("#email").text("");
$("#fStatus").text("");

//Function to take what is in the Search Box into the search function
function searchOrders() {
    orderNumber = $("#orderNum").val();
    orderId = orderNumber;
    var requestURL = "https://app.ecwid.com/api/v3/" + storeId + "/orders?ids=" + orderId + "&token=" + ptoken;
    var settings = {
        async: true,
        crossDomain: true,
        url: requestURL,
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    };
    $.ajax(settings).done(function (response) {
        if (response["count"] == 0) {
            console.log("NO ITEMS FOUND");
            $("#showName").text("Please Re-Run Bar Code Scan");
            $("#firstName").text("Cleared Value");
            $("#lastName").text("Cleared Value");
            $("#email").text("Cleared Value");
            $("#fStatus").text("Cleared Value");
            $("#qrCode").text("Cleared Value");
            $("#notes").text("Cleared Value");
            $("#tickets").text("#");
            $("#quant").empty();
        } 
        
        else if (response["count"] > 0) {
            console.log(response);
            $("#firstName").text(response["items"]["0"]["shippingPerson"]["firstName"]);
            $("#lastName").text(response["items"]["0"]["shippingPerson"]["lastName"]);
            $("#email").text(response["items"]["0"]["email"]);
            $("#notes").text(response["items"]["0"]["privateAdminNotes"]);
            $("#tickets").text(response["items"]["0"]["items"]["0"]["quantity"]);
            $("#showName").text(response["items"]["0"]["items"]["0"]["name"]);
            $("#qrCode").text(orderId);
            //set global variables
            qTickets = (response["items"]["0"]["items"]["0"]["quantity"]);
            fStatus  = (response["items"]["0"]["fulfillmentStatus"]);
            //see what the fulfillment status is, and edit accordingly
            var fulfillment = (response["items"]["0"]["fulfillmentStatus"]);
            if (fulfillment == "AWAITING_PROCESSING") {
                $("#fStatus").text("Some or none of the tickets have been admitted.");
            }
            else if (fulfillment == "DELIVERED") {
                $("#fStatus").text("ALL of the tickets have been admitted.");
            }
            else {
                $("#fStatus").text(response["items"]["0"]["fulfillmentStatus"]);
            }
            //set the quantity selection field
            $("#quant").empty();
            for (let i = 0; i < (response["items"]["0"]["items"]["0"]["quantity"]); i++)
            {
                optionValue = (i+1);
                $('#quant').append(`<option value="${optionValue}">${optionValue}</option>`);
            };
            
        }
        else {
            console.log("Did not run search");
        }
    });
}

//run search function on button click
$("#search").click(function () {
    searchOrders();
});

//function to edit the order and PUT back to the ecwid server
function editOrders() {

    var updatedQuant = $( "#quant option:selected" ).text().toString();
    var qdata = String("" + updatedQuant + " out of " + qTickets + " Tickets Admitted");
    //changing fulfillment status depending on the quantity of tickets used
    if (updatedQuant == qTickets) {
        fStatus = "DELIVERED";
    }
    else {
        fStatus = "AWAITING_PROCESSING";
    }

    var PUTsettings = {
        async: true,
        crossDomain: true,
        url: "https://app.ecwid.com/api/v3/"+storeId+"/orders/"+orderId+"?token="+ptoken,
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        processData: true,
        data: "{privateAdminNotes: " + qdata + ", fulfillmentStatus: " + fStatus + "}",
    };
    $.ajax(PUTsettings).done(function (response) {
        console.log(qdata);
        console.log(response);
        //Update Information on screen
        searchOrders();
    });
}

//run the editOrders function on button click
$("#edit").click(function () {
    editOrders();
});
