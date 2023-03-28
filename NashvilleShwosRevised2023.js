var productSearchResults,searchCustomers,searchCounter,searchResults,funcMonth,funcDate,funcYear,product,search,storeId="73175160",key="secret_N8VmHUJgBESRMA2ihnJUawPVkLRjdgM1",checked=0;const months=["January","February","March","April","May","June","July","August","September","October","November","December"],d=new Date;let todayMonth=months[d.getMonth()];function showSearch(e,t,s,a){$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching...");var i=[],r=(t+"/"+s+"/"+a).toUpperCase();for(let o=0;o<e.items.length;o++){var c,l=e.items[o].sku.replace(/\s/g,""),p=l.split(",")[0].replace(/\D/g,"");r===(l.split(",")[0].replace(/[0-9]/g,"").toUpperCase()+"/"+p+"/"+l.split("-")[0].split(",")[1]).toUpperCase()&&i.push(e.items[o])}var h=[];if($('[show="list"]').empty(),$('[party="list"]').empty(),0===i.length)$('[show="heading"]').text("No Shows On "+t+" "+s+", "+a),$('[party="heading"]').text("Make New Search");else if(i.length>0){for(let u=0;u<i.length;u++){searchOrders(i[u].id);let v={name:i[u].name,id:i[u].id,month:i[u].sku.replace(/\s/g,"").split(",")[0].replace(/[0-9]/g,"").toUpperCase(),day:i[u].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""),year:i[u].sku.replace(/\s/g,"").split("-")[0].split(",")[1],time:i[u].sku.replace(/\s/g,"").split("-")[1].toUpperCase(),remaining:i[u].quantity,purchased:searchCounter,customers:searchCustomers};h.push(v)}for(let m=0;m<h.length;m++){var g=`
            <div id="show-div" ct="${m}" class="show-div">
                <h2 show="title" class="show-heading">${h[m].name}</h2>
                <div class="show-time-div">
                    <div class="date-container">
                        <div show="month" class="show-date">${h[m].month}</div>
                        <div show="day" class="show-date">${h[m].day}</div>
                        <div class="show-date">,</div>
                        <div show="year" class="show-date">${h[m].year}</div>
                    </div>
                    <div class="show-time">${h[m].time}</div>
                </div>
                <div class="show-time-info-div"></div>
                <div class="info-wrapper">
                    <div class="info-div">
                        <div class="info-container">
                            <div class="info-text">Tickets Available: </div>
                            <div show="available" class="info-text">${h[m].remaining}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Tickets Purchased:</div>
                            <div show="purchased" class="info-text">${h[m].purchased}</div>
                        </div>
                        <div class="info-container">
                            <div class="info-text">Initial Total:</div>
                            <div show="first-stock" class="info-text">${parseInt(h[m].purchased)+parseInt(h[m].remaining)}</div>
                        </div>
                    </div>
                    <div class="btn-div">
                        <div class="info-container">
                            <div class="info-text"># of Parties:</div>
                            <div show="parties" class="info-text">${h[m].customers.length}</div>
                        </div>
                        <a show="button" ct="${m}" href="#" class="show-btn w-button">View Parties</a>
                    </div>
                </div>
            </div>
            `;$('[show="list"]').append(g)}searchResults=h,$('[show="heading"]').text("Shows On "+t+" "+s+", "+a),$('[party="heading"]').text("Select A Show")}else console.log("Unknown Error")}function searchProducts(e){$.ajax({async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products?keyword="+e+"?enabled=true",method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}}).done(function(e){productSearchResults=e,checkPastProducts()})}function searchOrders(e){$.ajax({async:!1,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/orders?productId="+e,method:"GET",headers:{Accept:"application/json",Authorization:"Bearer "+key}}).done(function(t){var s=0,a=[];for(let i=0;i<t.items.length;i++){let r={party:n=void 0!==t.items[i].shippingPerson?t.items[i].shippingPerson.name:"No Name",orderNum:t.items[i].id};for(let o=0;o<t.items[i].items.length;o++)parseInt(t.items[i].items[o].productId)==parseInt(e)&&(r.tickets=t.items[i].items[o].quantity,s+=parseInt(t.items[i].items[o].quantity));a.push(r)}searchCustomers=a,searchCounter=s})}function checkPastProducts(){if(0==checked){var e=[];dateChecker=productSearchResults;for(let t=0;t<dateChecker.items.length;t++){var s,a=parseInt(dateChecker.items[t].sku.replace(/\s/g,"").split("-")[1].split(":")[1].replace(/([a-zA-Z])/g,""));s="PM"===dateChecker.items[t].sku.replace(/\s/g,"").split("-")[1].split(":")[1].replace(/[0-9]/g,"").toUpperCase()?parseInt(dateChecker.items[t].sku.replace(/\s/g,"").split("-")[1].split(":")[0])+12:parseInt(dateChecker.items[t].sku.replace(/\s/g,"").split("-")[1].split(":")[0]),parseInt(dateChecker.items[t].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""))<d.getDate()?!0===dateChecker.items[t].enabled&&e.push(dateChecker.items[t].id):parseInt(dateChecker.items[t].sku.replace(/\s/g,"").split(",")[0].replace(/\D/g,""))==d.getDate()&&s<d.getHours()&&a<d.getMinutes()&&!0===dateChecker.items[t].enabled&&e.push(dateChecker.items[t].id)}for(let i=0;i<e.length;i++)hideProduct(e[i].toString());checked=1}else 1==checked?console.log("check run"):console.log("error checking")}function hideProduct(e){$.ajax({async:!0,crossDomain:!0,url:"https://app.ecwid.com/api/v3/"+storeId+"/products/"+e,method:"PUT",data:"{enabled: false}",headers:{Accept:"application/json",Authorization:"Bearer "+key,"Content-Type":"application/json"}}).done(function(e){console.log(e)})}$("#select-month").change(function(){if(["January","March","May","July","August","October","December"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let e=0;e<31;e++){var t=`<option value="${e+1}">${e+1}</option>`;$("#select-day").append(t)}}else if(["April","June","September","November"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let s=0;s<30;s++){var t=`<option value="${s+1}">${s+1}</option>`;$("#select-day").append(t)}}else if(["February"].includes($("#select-month").val())){$("#select-day").empty(),$("#custom-search").removeClass("grey");for(let a=0;a<29;a++){var t=`<option value="${a+1}">${a+1}</option>`;$("#select-day").append(t)}}else{$("#custom-search").addClass("grey"),$("#select-day").empty();var t=`
        <option value="Select Day">Select Day</option>
        `;$("#select-day").append(t)}}),$("#custom-search").click(function(){if("Select Day"===$("#select-day").val())console.log("No proper date");else{var e=$("#select-month").val().toUpperCase(),t=$("#select-day").val().toString();$("#select-month").val(""),$("#select-month").trigger("change"),$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text("Searching..."),setTimeout(function(){searchProducts(e),showSearch(productSearchResults,e,t,d.getFullYear().toString())},100)}}),$(function(){$('[show="list"]').empty(),$('[party="list"]').empty(),$('[show="heading"]').text("Searching..."),$('[party="heading"]').text(""),setTimeout(function(){searchProducts(todayMonth),showSearch(productSearchResults,todayMonth.toUpperCase(),d.getDate().toString(),d.getFullYear().toString())},100)}),$("body").on("click",'[show="button"]',function(e){$('[party="list"]').empty();var t=$(this).attr("ct"),s=searchResults[t].customers;s.sort(function(e,t){return t.tickets-e.tickets});for(let a=0;a<s.length;a++){var i=`
        <div id="party-div" class="party-div w-node-_8d0f08c4-d1dd-5322-5862-e203fbf256bc-ee1bbea5">
            <div class="party-heading-container">
                <h2 class="party-heading">Party:&nbsp;</h2>
                <h2 party="name" class="party-heading">${s[a].party}</h2>
            </div>
            <div class="party-info">
                <div party="quant" class="party-size">${s[a].tickets}</div>
                <div class="party-order-div">
                    <div class="num-text">Order #:&nbsp;</div>
                    <div party="order" class="party-order">${s[a].orderNum}</div>
                </div>
            </div>
        </div>
        `;$('[party="list"]').append(i)}$('[party="heading"]').text(searchResults[t].name+" Parties")});
