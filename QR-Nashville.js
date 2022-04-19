//Constant Variables **** Change Per Store
//Currently Set For Nashville
const storeId = 73175160;
const token = "public_BTNfDsq3gAQa6rztRGyuGm6cu8yJqGmq";
const ptoken = "secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1";
//dont edit the following variable
var orderId;
var qTickets;
var fStatus;
var tktArray;
var barCode;
var qChecker;
//scanner
$("#orderNum").focus();
function onScanSuccess(decodedText, decodedResult) 
    {
        barCode = (`Code scanned = ${decodedText}`, decodedResult);
        $("#qrCode").text(barCode.decodedText);
        $("#orderNum").val(barCode.decodedText);
        $(".ecwid-search-btn").css('background', '#4f8d18');
    }
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {fps: 10, qrbox: {width: 220, height: 220}, rememberLastUsedCamera: true, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]});
html5QrcodeScanner.render(onScanSuccess);

//clean on screen variables *** Initial Load *** Remove NULL
$("#firstName").text("Run");
$("#lastName").text("Search");
$("#email").text("Pending...");
$("#fStatus").text("Pending Search");
$("#qrCode").text("#####");
$("#tickets").text("#");
$("#list-container").empty();

//Function to take what is in the Search Box into the search function
function searchOrders() 
    {
            if($("#orderNum").val().length > 5)
          {
            var slt = $("#orderNum").val();
            $("#orderNum").val(slt.slice(-5));
          }
        $(".ecwid-search-btn").css('background', '#8d1d18');
        orderId = $("#orderNum").val().toUpperCase();
        var requestURL = "https://app.ecwid.com/api/v3/" + storeId + "/orders?ids=" + orderId + "&token=" + ptoken;
        var settings = 
            {
                async: true,
                crossDomain: true,
                url: requestURL,
                method: "GET",
                headers: 
                    {
                        Accept: "application/json",
                    },
            };
    $.ajax(settings).done(function (response) 
        {
            if (response["count"] == 0) 
                {
                    console.log("NO ITEMS FOUND");
                    $("#firstName").text("Run");
                    $("#lastName").text("Search");
                    $("#email").text("Pending...");
                    $("#fStatus").text("Pending Search");
                    $("#qrCode").text("#####");
                    $("#tickets").text("#");
                    $("#list-container").empty();
                } 
        
            else if (response["count"] > 0) 
                {
                    //console.log(response);
                    $("#firstName").text(response["items"]["0"]["shippingPerson"]["firstName"]);
                    $("#lastName").text(response["items"]["0"]["shippingPerson"]["lastName"]);
                    $("#email").text(response["items"]["0"]["email"]);
                    var qNotes = response["items"]["0"]["privateAdminNotes"];
                    $("#tickets").text(response["items"]["0"]["items"].length);
                    $("#qrCode").text(orderId);
                    //set global variables
                    qTickets = (response["items"]["0"]["items"].length);
                    fStatus  = (response["items"]["0"]["fulfillmentStatus"]);
                    //see what the fulfillment status is, and edit accordingly
                    var quantities = "";
                    if (typeof qNotes === 'undefined')
                        {
                            for (n = 0; n < response["items"]["0"]["items"].length; n++)
                                {
                                    quantities += "0&";
                                }
                            quantities = quantities.split("&");
                        }
                    else if (qNotes.slice(-1) === "&")
                        {
                            quantities = qNotes.split("&");
                        }
                    else
                        {
                            for (n = 0; n < response["items"]["0"]["items"].length; n++)
                            {
                                quantities += "0&";
                            }
                            quantities = quantities.split("&");
                        }
                    var fulfillment = (response["items"]["0"]["fulfillmentStatus"]);
                    if (fulfillment == "AWAITING_PROCESSING") 
                        {
                            $("#fStatus").text("Some or none of the tickets have been admitted.");
                        }
                    else if (fulfillment == "DELIVERED") 
                        {
                            $("#fStatus").text("ALL of the tickets have been admitted.");
                        }
                    else 
                        {
                            $("#fStatus").text(response["items"]["0"]["fulfillmentStatus"]);
                        }
                    //set the quantity selection field
                    var tempQChecker = "";
                    var showHtml ='';
                    for (let i = 0; i < (response["items"]["0"]["items"].length); i++)
                        {
                            var usedTickets = quantities[i];
                            var storesHtml ='';
                            var showName = response["items"]["0"]["items"][i]["name"];
                            var showQuant = response["items"]["0"]["items"][i]["quantity"];
                            tempQChecker += ""+showQuant+"&";
                            var optionHtml ='';
                            var fClass ="";
                            if (usedTickets == showQuant)
                                {
                                    fClass += " finished";
                                }
                            for (let r = 0; r <= (showQuant); r++)
                                {
                                    optionHtml +=   `
                                                    <option value="${r}">${r}</option> 
                                    `
                                }
                                showHtml += `
                                <div class="list-item${fClass}">
                                    <div class="list-item-title">${showName}</div>
                                    <div class="list-item-status">${usedTickets} of ${showQuant} tickets admitted</div>
                                    <div class="list-admissions-change-div">
                                    <div class="list-admissions-text">Admitted</div>
                                    <div class="admissions-select w-embed">
                                        <select name="currentQuant" id="quant-${i}" style="padding-left: 10px; padding-right: 10px; width: 50px; height: 36px;">
                                            ${optionHtml}
                                        </select>
                                    </div>
                                    <div class="list-admissions-text">Out Of</div><div class="list-total-admissions">${showQuant}</div><div class="list-admissions-text">Tickets</div></div>
                                </div>    
                                `
                        }
                    qChecker = tempQChecker;
                    document.querySelector('.list-container').innerHTML = showHtml;
                    for (q = 0; q < (response["items"]["0"]["items"].length); q++)
                        {
                            var selectId = "#quant-"+q+"";
                            var value = quantities[q].toString();
                            $(selectId).val(value).change();
                        }

                }
            else 
                {
                    console.log("Did not run search");
                }
        });
    $("#orderNum").focus();
}

//run search function on button click
$("#search").click(function () 
    {
        searchOrders();
    });
//run search when enter is pressed on field
$("#orderNum").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#search").click();
    }
});



sampleJson = '[{color: "red",value: "#f00"},{color: "magenta",value: "#f0f"},{color: "yellow",value: "#ff0"},{color: "black",value: "#000"}]';




//function to edit the order and PUT back to the ecwid server
function editOrders() 
    {
        var qdata = "";
        for (let i = 0; i < qTickets; i++)
            {   
                var num = "#quant-"+i+" option:selected";
                var selectedData = $(num).text().toString();
                qdata += (selectedData+"&").toString();
            }



        if (qChecker === qdata) 
            {
                fStatus = "DELIVERED";
            }
        else 
            {
                fStatus = "AWAITING_PROCESSING";
            }

        var PUTsettings = 
            {
                async: true,
                crossDomain: true,
                url: "https://app.ecwid.com/api/v3/"+storeId+"/orders/"+orderId+"?token="+ptoken,
                method: "PUT",
                headers: 
                    {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    },
                processData: true,
                data: "{privateAdminNotes: " + qdata + ", fulfillmentStatus: " + fStatus + "}",
            };
        $.ajax(PUTsettings).done(function (response) 
            {
                console.log(response);
                //Update Information on screen
                searchOrders();
            });
        $("#orderNum").focus();
    }

//run the editOrders function on button click
$("#edit").click(function () 
    {
        editOrders();
    });
