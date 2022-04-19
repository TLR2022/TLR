# TLR
FOR THE QR CODE / BAR CODE SCANNING TO LOOK UP AND EDIT ORDERS
Starting off, you will need a private API key from Ecwid. There are plenty of instructions on Ecwids documentation on how to do this. 
The next most important thing to do is to edit the ticket that comes to the user to deliminate the "ORDER-" prefix that comes on the barcode by default. 
You will do this on the Ecwid control panel > Settings > Invoice
Under "Invoice Template", click "Edit Template"
Scroll down to the bottom to where you see the HTML comment tag of <!-- Barcode -->
Paste the following code over the <tr> element containing the barcode:
(Ignore the comment tags (they are <!-- and -->))
<!--

<tr style="padding:40px">
      	<td style="text-align: center; vertical-align: middle;" >
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${order.number}" height="100" style="max-height: 100px; padding-right: 30px; padding-top: 20px; padding-bottom: 20px" alt="ORDER<#if order.number?has_content>-${order.number}</#if>" />
          <img src="https://dyn4vbig664n8.cloudfront.net/code128?text=${order.encodedVendorOrderNumber}&format=png&zoom=2" height="100" style="max-height: 100px; padding-left: 30px; padding-top: 20px; padding-bottom: 20px" alt="ORDER<#if order.number?has_content>-${order.number}</#if>" />
      	</td>
		
	</tr>

-->
  
You will now need to paste the code of the project into the body of the webpage using the <script> tags, or you can import the code using jsdeliver and <script> src=
make sure you place the correct STORE ID and PRIVATE API KEY for the store you are wanting to search into the top variables of the code. Minify the code after this to help load time.
