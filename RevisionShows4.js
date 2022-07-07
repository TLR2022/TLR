//Pigeon Forge
//var storeId = "73177391";
//var key = "secret_bQZqubGJryLCVhPgf6yEEjvnasrQqz7u"

//Nashville
var storeId = "73175160";
var key = "secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1"

var productSearchResults;
var searchCustomers;
var searchCounter;
var searchResults;
var funcMonth;
var funcDate;
var funcYear;
var product;
var checked = 0;
var search;


//for other page
/*$('body').on('click', '[party="order"]', function(event) {
    localStorage.setItem('sItem', $(this).text());
    console.log(localStorage.getItem('sItem'));
    window.location.href = "https://www.listeningroomcafe.com/pigeon-forge-tickets";
});*/

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const d = new Date();
let todayMonth = months[d.getMonth()];

$('body').on('click', '[party="order"]', function(event) {
    $("#orderNum").val($(this).text());
    searchTicketOrders();
});

$("#select-month").change(function () {
    if(["January","March","May","July","August","October","December"].includes($('#select-month').val())) {
    $('#select-day').empty();
    $("#custom-search").removeClass("grey");
    for (let i = 0; i < 31; i++)
        {
            var option = `<option value="${i+1}">${i+1}</option>`
            $('#select-day').append(option);
        }
    }
    else if(["April","June","September","November"].includes($('#select-month').val())) {
    $('#select-day').empty();
    $("#custom-search").removeClass("grey");
    for (let i = 0; i < 30; i++)
        {
            var option = `<option value="${i+1}">${i+1}</option>`
            $('#select-day').append(option);
        }
    }
    else if(["February"].includes($('#select-month').val())) {
    $('#select-day').empty();
    $("#custom-search").removeClass("grey");
    for (let i = 0; i < 29; i++)
        {
            var option = `<option value="${i+1}">${i+1}</option>`
            $('#select-day').append(option);
        }
    }
    else {
        $("#custom-search").addClass("grey");
        $('#select-day').empty();
        var option = 
        `
        <option value="Select Day">Select Day</option>
        `
        $('#select-day').append(option);
    }
});

$("#custom-search").click(function() {
  if ($('#select-day').val() === "Select Day")
  {
    console.log("No proper date");
  }
  else
  {
    var sMonth = $("#select-month").val().toUpperCase();
    var sDate = $("#select-day").val().toString();
    $("#select-month").val("");
    $("#select-month").trigger("change");
    $('[show="list"]').empty();
    $('[party="list"]').empty();
    $('[show="heading"]').text("Searching...");
    $('[party="heading"]').text("Searching...");
    setTimeout(
      function() 
          {
            searchProducts(sMonth);
            showSearch(productSearchResults, sMonth, sDate, d.getFullYear().toString());
          }, 100);
  }
});

$(function() {
    console.log("running onload function");
    console.log(todayMonth.toUpperCase());
    console.log(d.getDate().toString());
    console.log(d.getFullYear().toString());
    $('[show="list"]').empty();
    $('[party="list"]').empty();
    $('[show="heading"]').text("Searching...");
    $('[party="heading"]').text("");
    setTimeout(
      function() 
          {
            searchProducts(todayMonth);
            showSearch(productSearchResults, todayMonth.toUpperCase(), d.getDate().toString(), d.getFullYear().toString());
          }, 200);
});

function showSearch(searchArray, searchMonth, searchDate, SearchYear)
{
    console.log("running showSearch..........");
    $('[show="heading"]').text("Searching...");
    $('[party="heading"]').text("Searching...");
    var results = [];
    var testingChecker = (searchMonth + "/" + searchDate + "/" + SearchYear).toUpperCase();
    for (let i = 0; i < searchArray['items'].length; i++)
    {
        var date = searchArray['items'][i]['sku'].replace(/\s/g, '');
        var day = date.split(',')[0].replace(/\D/g, "");
        var month = date.split(',')[0].replace(/[0-9]/g,'').toUpperCase();
        var year = date.split('-')[0].split(',')[1];
        var itemChecker = (month + "/" + day + "/" + year).toUpperCase();
        if (testingChecker === itemChecker)
        {
            results.push(searchArray['items'][i]);
        }
    }
    console.log("results Array: ");
    console.log(results);

    var simpArray = [];
    $('[show="list"]').empty();
    $('[party="list"]').empty();
    if (results.length === 0)
    {
        $('[show="heading"]').text("No Shows On "+searchMonth+" "+searchDate+", "+SearchYear);
        $('[party="heading"]').text("Make New Search");
    }

    else if (results.length > 0)
    {
        for (let i = 0; i < results.length; i++)
        {
            searchOrders(results[i]['id']);
            let show = 
                {   
                    name: results[i]['name'],
                    id: results[i]['id'],
                    month: results[i]['sku'].replace(/\s/g, '').split(',')[0].replace(/[0-9]/g,'').toUpperCase(),
                    day: results[i]['sku'].replace(/\s/g, '').split(',')[0].replace(/\D/g, ""),
                    year: results[i]['sku'].replace(/\s/g, '').split('-')[0].split(',')[1],
                    time: results[i]['sku'].replace(/\s/g,'').split('-')[1].toUpperCase(),
                    remaining: results[i]['quantity'],
                    purchased: searchCounter,
                    customers: searchCustomers,
                    status: results[i]['enabled'],
                }
            simpArray.push(show);
        }
        console.log("simple array: ");
        console.log(simpArray);
        for (let i = 0; i < simpArray.length; i++)
        {
            var statusText = "error";
            var btnText = "error";
            var sStatus;
            if (simpArray[i]['status'] === false)
                {
                    statusText = "Hidden";
                    btnText = "Enable Show In Shop";
                    sStatus = 0;
                }
            else if (simpArray[i]['status'] === true)
                {
                    statusText = "Visible";
                    btnText = "Hide Show From Shop";
                    sStatus = 1;
                }
            var showHTML = 
            `
            <div id="show-div" ct="${i}" class="show-div">
                <h2 show="title" class="show-heading">${simpArray[i]['name']}</h2>
                <div class="show-time-div">
                    <div class="date-container">
                        <div show="month" class="show-date">${simpArray[i]['month']}</div>
                        <div show="day" class="show-date">${simpArray[i]['day']}</div>
                        <div class="show-date">,</div>
                        <div show="year" class="show-date">${simpArray[i]['year']}</div>
                    </div>
                    <div class="show-time">${simpArray[i]['time']}</div>
                </div>
                <div class="show-time-info-div"></div>
                <div class="info-wrapper">
                    <div class="info-div">
                        <div class="info-container">
                            <div class="info-text">Tickets Available: </div>
                            <div show="available" class="info-text">${simpArray[i]['remaining']}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Tickets Purchased:</div>
                            <div show="purchased" class="info-text">${simpArray[i]['purchased']}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Initial Total:</div>
                            <div show="first-stock" class="info-text">${parseInt(simpArray[i]['purchased'])+parseInt(simpArray[i]['remaining'])}</div>
                        </div>
                    </div>
                    <div class="btn-div">
                        <div class="info-container">
                            <div class="info-text"># of Parties:</div>
                            <div show="parties" class="info-text">${simpArray[i]['customers'].length}</div>
                        </div>
                        <a show="button" ct="${i}" href="#" class="show-btn w-button">View Parties</a>
                    </div>
                </div>
                <div class="status-div">
                    <div class="status-text">SHOW&nbsp;STATUS:</div>
                    <div show="status" status="${sStatus}" oid="${simpArray[i]['id']}" class="status-text">${statusText}</div>
                </div>
                <a show="statusBtn" status="${sStatus}" oid="${simpArray[i]['id']}" href="#" class="status-btn w-button">${btnText}</a>
            </div>
            `
            $('[show="list"]').append(showHTML);
        }
        searchResults = simpArray;
        console.log("searchResults array: ");
        console.log(searchResults);
        $('[show="heading"]').text("Shows On "+searchMonth+" "+searchDate+", "+SearchYear);
        $('[party="heading"]').text("Select A Show");
    }
    else
    {
        console.log("Unknown Error")
    }
}

$('body').on('click', '[show="statusBtn"]', function(event) {
    if (parseInt($(this).attr('status')) == 0)
    {
        showProduct($(this).attr('oid'));
        $(this).text("Hide Show From Shop");
        $('[show="status"][oid="'+$(this).attr('oid')+'"]').text("Visible");
        $(this).attr('status','1');
    }
    else if (parseInt($(this).attr('status')) == 1)
    {
        hideProduct($(this).attr('oid'));
        $(this).text("Enable Show In Shop");
        $('[show="status"][oid="'+$(this).attr('oid')+'"]').text("Hidden");
        $(this).attr('status','0');
    }
});

$('body').on('click', '[show="button"]', function(event) {
    $('[party="list"]').empty();
    var iNum = $(this).attr("ct");
    var parties = searchResults[iNum]['customers'];
    parties.sort(function(a, b) {
      return b.tickets - a.tickets;
    });
    var setParties = [];
    var allParties = [];
    for (let i = 0; i < parties.length; i++)
    {
        if (parseInt(parties[i]['quant']) == parties[i]['tickets'])
            {
                setParties.push(parties[i]);
            }
        else
            {
                allParties.push(parties[i]);
            }
    }

    for (let i = 0; i < allParties.length; i++)
    {
        var partyHTML =
        `
        <div id="party-div" class="party-div w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${allParties[i]['party']}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${allParties[i]['tickets']}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <div party="order" class="party-order">${allParties[i]['orderNum']}</div>
                </div>
            </div>
        </div>
        `
        $('[party="list"]').append(partyHTML);
    }

    for (let i = 0; i < setParties.length; i++)
    {
        var partyHTML =
        `
        <div id="party-div" class="party-div checked w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${setParties[i]['party']}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${setParties[i]['tickets']}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <div party="order" class="party-order">${setParties[i]['orderNum']}</div>
                </div>
            </div>
        </div>
        `
        $('[party="list"]').append(partyHTML);
    }
    $('[party="heading"]').text(searchResults[iNum]['name']+" Parties");
});

function searchProducts(keywords)
{
    var settings = {
      "async": false,
      "crossDomain": true,
      "url": "https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+keywords+"",
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer "+key+""
      }
    };
    $.ajax(settings).done(function (response) {
      productSearchResults = response;
    });
}

function searchOrders(productId)
{
    var settings = {
      "async": false,
      "crossDomain": true,
      "url": "https://app.ecwid.com/api/v3/"+storeId+"/orders?productId="+productId+"",
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer "+key+""
      }
    };
    $.ajax(settings).done(function (response) {
      var counter = 0;
      var customers = [];
      for (let i = 0; i < response['items'].length; i++)
      {
        if (typeof(response['items'][i]['shippingPerson']) != "undefined")
        {
            n = response['items'][i]['shippingPerson']['name'];
        }
        else
        {
            n = "No Name";
        }
        let customer = 
        {
            party: n,
            orderNum: response['items'][i]['id']
        }
        for (let j = 0; j < response['items'][i]['items'].length; j++)
        {
            if (parseInt(response['items'][i]['items'][j]['productId']) == parseInt(productId))
            {   
                customer['tickets'] = response['items'][i]['items'][j]['quantity'];
                counter += parseInt(response['items'][i]['items'][j]['quantity']);
                if (typeof response['items'][i]['privateAdminNotes'] === 'undefined')
                    {
                        customer['quant'] = '0';
                    }
                else
                    {
                        var quants = response['items'][i]['privateAdminNotes'].split("&");
                        customer['quant'] = quants[j]; 
                    }
            }
        }
        customers.push(customer);
      }
      searchCustomers = customers;
      searchCounter = counter;
    });
}

function hideProduct(productNum)
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://app.ecwid.com/api/v3/"+storeId+"/products/"+productNum+"",
        "method": "PUT",
        "data": "{enabled: false}",
        "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer "+key+"",
        "Content-Type": "application/json"
        }
    };
    $.ajax(settings).done(function (response) 
    {
      console.log(response);
    });
}

function showProduct(productNum)
{
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://app.ecwid.com/api/v3/"+storeId+"/products/"+productNum+"",
        "method": "PUT",
        "data": "{enabled: true}",
        "headers": {
        "Accept": "application/json",
        "Authorization": "Bearer "+key+"",
        "Content-Type": "application/json"
        }
    };
    $.ajax(settings).done(function (response) 
    {
      console.log(response);
    });
}
