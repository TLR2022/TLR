var productSearchResults,searchCustomers,searchCounter,searchResults,funcMonth,funcDate,funcYear,product,search,storeId="73175160",key="secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1",checked=0;const months=["January","February","March","April","May","June","July","August","September","October","November","December"],d=new Date;let todayMonth=months[d.getMonth()];function showSearch(h,i,j,k){console.log("running showSearch.........."),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching...");var a=[],o=(i+"/"+j+"/"+k).toUpperCase();for(let f=0;f<h.items.length;f++){var l=h.items[f].sku.replace(/\s/g,""),p=l.split(",")[0].replace(/\D/g,""),q=l.split(",")[0].replace(/[0-9]/g,"").toUpperCase(),r=l.split("-")[0].split(",")[1],s=(q+"/"+p+"/"+r).toUpperCase();o===s&&a.push(h.items[f])}console.log("results Array: "),console.log(a);var b=[];if($('[show="list"]').empty(),$('[party="list"]').empty(),0===a.length)$('[show="heading"]').text("No Shows On "+i+" "+j+", "+k),$('[party="heading"]').text("Make New Search");else if(a.length>0){for(let e=0;e<a.length;e++){searchOrders(a[e].id);let t={name:a[e].name,id:a[e].id,month:a[e].sku.replace(/\s/g,"").split(",")[0].replace(/[0-9]/g,"").toUpperCase(),day:a[e].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""),year:a[e].sku.replace(/\s/g,"").split("-")[0].split(",")[1],time:a[e].sku.replace(/\s/g,"").split("-")[1].toUpperCase(),remaining:a[e].quantity,purchased:searchCounter,customers:searchCustomers,status:a[e].enabled};b.push(t)}console.log("simple array: "),console.log(b);for(let c=0;c<b.length;c++){var g,m="error",n="error";!1===status?(m="Hidden",n="Enable Show In Shop",g=0):!0===status&&(m="Visible",n="Hide Show From Shop",g=1);var u=`
            <div id="show-div" ct="${c}" class="show-div">
                <h2 show="title" class="show-heading">${b[c].name}</h2>
                <div class="show-time-div">
                    <div class="date-container">
                        <div show="month" class="show-date">${b[c].month}</div>
                        <div show="day" class="show-date">${b[c].day}</div>
                        <div class="show-date">,</div>
                        <div show="year" class="show-date">${b[c].year}</div>
                    </div>
                    <div class="show-time">${b[c].time}</div>
                </div>
                <div class="show-time-info-div"></div>
                <div class="info-wrapper">
                    <div class="info-div">
                        <div class="info-container">
                            <div class="info-text">Tickets Available: </div>
                            <div show="available" class="info-text">${b[c].remaining}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Tickets Purchased:</div>
                            <div show="purchased" class="info-text">${b[c].purchased}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Initial Total:</div>
                            <div show="first-stock" class="info-text">${parseInt(b[c].purchased)+parseInt(b[c].remaining)}</div>
                        </div>
                    </div>
                    <div class="btn-div">
                        <div class="info-container">
                            <div class="info-text"># of Parties:</div>
                            <div show="parties" class="info-text">${b[c].customers.length}</div>
                        </div>
                        <a show="button" ct="${c}" href="#" class="show-btn w-button">View Parties</a>
                    </div>
                </div>
                <div class="status-div">
                    <div class="status-text">SHOW&nbsp;STATUS:</div>
                    <div show="status" status="${g}" oId="${id}" class="status-text">${m}</div>
                </div>
                <a show="statusBtn" status="${g}" oId="${id}" href="#" class="status-btn w-button">${n}</a>
            </div>
            `;$('[show="list"]').append(u)}searchResults=b,console.log("searchResults array: "),console.log(searchResults),$('[show="heading"]').text("Shows On "+i+" "+j+", "+k),$('[party="heading"]').text("Select A Show")}else console.log("Unknown Error")}function searchProducts(a){$.ajax({async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+a,method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}}).done(function(a){productSearchResults=a})}function searchOrders(a){$.ajax({async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/orders?productId="+a,method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}}).done(function(c){var g=0,h=[];for(let b=0;b<c.items.length;b++){let f={party:n=void 0!==c.items[b].shippingPerson?c.items[b].shippingPerson.name:"No Name",orderNum:c.items[b].id};for(let e=0;e<c.items[b].items.length;e++)if(parseInt(c.items[b].items[e].productId)==parseInt(a)){if(f.tickets=c.items[b].items[e].quantity,g+=parseInt(c.items[b].items[e].quantity),void 0===c.items[b].privateAdminNotes)f.quant="0";else{var i=c.items[b].privateAdminNotes.split("&");f.quant=i[e]}}h.push(f)}searchCustomers=h,searchCounter=g})}function checkPastProducts(){if(0==checked){var b=[];dateChecker=productSearchResults;for(let a=0;a<dateChecker.items.length;a++){var e,f=parseInt(dateChecker.items[a].sku.replace(/\s/g,"").split("-")[1].split(":")[1].replace(/([a-zA-Z])/g,""));e="PM"===dateChecker.items[a].sku.replace(/\s/g,"").split("-")[1].split(":")[1].replace(/[0-9]/g,"").toUpperCase()?parseInt(dateChecker.items[a].sku.replace(/\s/g,"").split("-")[1].split(":")[0])+12:parseInt(dateChecker.items[a].sku.replace(/\s/g,"").split("-")[1].split(":")[0]),parseInt(dateChecker.items[a].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""))<=d.getDate()&&e<d.getHours()&&f<d.getMinutes()&& !0===dateChecker.items[a].enabled&&b.push(dateChecker.items[a].id)}for(let c=0;c<b.length;c++)hideProduct(b[c].toString());checked=1}else 1==checked?console.log("check run"):console.log("error checking")}function hideProduct(a){$.ajax({async:!0,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products/"+a,method:"PUT",data:"{enabled: false}",headers:{Accept:"application/json",Authorization:"Bearer "+key,"Content-Type":"application/json"}}).done(function(a){console.log(a)})}$("body").on("click",'[party="order"]',function(a){$("#orderNum").val($(this).text()),searchTicketOrders()}),$("#select-month").change(function(){if(["January","March","May","July","August","October","December"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let b=0;b<31;b++){var a=`<option value="${b+1}">${b+1}</option>`;$("#select-day").append(a)}}else if(["April","June","September","November"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let c=0;c<30;c++){var a=`<option value="${c+1}">${c+1}</option>`;$("#select-day").append(a)}}else if(["February"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let e=0;e<29;e++){var a=`<option value="${e+1}">${e+1}</option>`;$("#select-day").append(a)}}else{$("#custom-search").addClass("grey"),$("#select-day").empty();var a=`
        <option value="Select Day">Select Day</option>
        `;$("#select-day").append(a)}}),$("#custom-search").click(function(){if("Select Day"===$("#select-day").val())console.log("No proper date");else{var a=$("#select-month").val().toUpperCase(),b=$("#select-day").val().toString();$("#select-month").val(""),$("#select-month").trigger("change"),$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching..."),setTimeout(function(){searchProducts(a),showSearch(productSearchResults,a,b,d.getFullYear().toString())},100)}}),$(function(){console.log("running onload function"),console.log(todayMonth.toUpperCase()),console.log(d.getDate().toString()),console.log(d.getFullYear().toString()),$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text(""),setTimeout(function(){searchProducts(todayMonth),showSearch(productSearchResults,todayMonth.toUpperCase(),d.getDate().toString(),d.getFullYear().toString())},200)}),$("body").on("click",'[show="button"]',function(j){$('[party="list"]').empty();var i=$(this).attr("ct"),a=searchResults[i].customers;a.sort(function(a,b){return b.tickets-a.tickets});var c=[],e=[];for(let b=0;b<a.length;b++)parseInt(a[b].quant)==a[b].tickets?c.push(a[b]):e.push(a[b]);for(let f=0;f<e.length;f++){var h=`
        <div id="party-div" class="party-div w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${e[f].party}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${e[f].tickets}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <div party="order" class="party-order">${e[f].orderNum}</div>
                </div>
            </div>
        </div>
        `;$('[party="list"]').append(h)}for(let g=0;g<c.length;g++){var h=`
        <div id="party-div" class="party-div checked w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${c[g].party}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${c[g].tickets}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <div party="order" class="party-order">${c[g].orderNum}</div>
                </div>
            </div>
        </div>
        `;$('[party="list"]').append(h)}$('[party="heading"]').text(searchResults[i].name+" Parties")})