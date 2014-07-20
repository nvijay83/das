var opts = {
	lines : 13, // The number of lines to draw
	length : 20, // The length of each line
	width : 10, // The line thickness
	radius : 30, // The radius of the inner circle
	corners : 1, // Corner roundness (0..1)
	rotate : 0, // The rotation offset
	direction : 1, // 1: clockwise, -1: counterclockwise
	color : '#000', // #rgb or #rrggbb or array of colors
	speed : 1, // Rounds per second
	trail : 60, // Afterglow percentage
	shadow : false, // Whether to render a shadow
	hwaccel : false, // Whether to use hardware acceleration
	className : 'spinner', // The CSS class to assign to the spinner
	zIndex : 2e9, // The z-index (defaults to 2000000000)
	top : '50%', // Top position relative to parent in px
	left : '50%' // Left position relative to parent in px
};

var spinner = null;
var spinner_div = 0;

var regex = /=(.+)/;
var username;
var password;
var address1;
var address2;
var landmark;
var city;
var email;
var contactnumber;
var region;
var deliveryCost;
var packageCostAmt;
var totalStr;
var company;
var fullname;

var userResponse;
var esfuuid;
var esfCookieValues;
var regionArr;

var foodArr = new Array();

var jqxhr = $.getJSON("http://easysmartfood.appspot.com/region", function() {

	regionArr = jqxhr.responseJSON;

	populateRegions();

}).done(function() {

}).fail(function() {
	console.log("error");
});

function updateTotalAmt(){
	
	totalStr = $('.simpleCart_total').text();

	totalStr = totalStr.substring(2, totalStr.length);

	totalStr = totalStr.replace(/,/g, "");

	totalStr = parseFloat(totalStr);

	var delivery = $('.simpleCart_shippingCost').text();

	deliveryCost = delivery.substring(2, delivery.length);

	deliveryCost = parseFloat(deliveryCost);
	
	var packageCost = $('.simpleCart_packingCost ').text();

	packageCostAmt = packageCost.substring(2, packageCost.length);

	packageCostAmt = parseFloat(packageCostAmt);

	var totalCost = deliveryCost + totalStr + packageCostAmt;

	$('.simpleCart_finalTotal').text(totalCost);
	
}

function calculateDeliveryCost(restName, region) {
	var url = 'http://easysmartfood.appspot.com/getdeliverycharge?restaurantname='
			+ restName + '&userregion=' + region;

	var deliveryDtls = $.getJSON(url, function() {

	}).done(
			function() {

//				var totalStr = $('.simpleCart_total').text();

				if (deliveryDtls.responseJSON.deliveryCost != '') {

					$('.simpleCart_shippingCost').text(
							'$ ' + deliveryDtls.responseJSON.deliveryCost);
				} else {

					$('.simpleCart_shippingCost').text('$ 10');
				}
				

				if (deliveryDtls.responseJSON.deliveryDistance != '') {

					$('.simpleCart_shippingDistance').text(
							  deliveryDtls.responseJSON.deliveryDistance);
				} else {

					$('.simpleCart_shippingDistance').text('5 km');
				}

//				totalStr = totalStr.substring(2, totalStr.length);
//
//				totalStr = totalStr.replace(/,/g, "");
//
//				totalStr = parseFloat(totalStr);
//
//				var delivery = $('.simpleCart_shippingCost').text();
//
//				deliveryCost = delivery.substring(2, delivery.length);
//
//				deliveryCost = parseFloat(deliveryCost);
//
//				var totalCost = deliveryCost + totalStr;
//
//				$('.simpleCart_finalTotal').text(totalCost);
				
				updateTotalAmt();

			}).fail(function() {

	});

}

function populateRegions() {
	$("#regselector").append(
			'<option value="' + 'Please Select' + '">' + 'Select Your Region'
					+ '</option>')

	for ( var regIndex = 0; regIndex < regionArr.length; regIndex++) {

		var obj = regionArr[regIndex];

		$("#regselector").append(
				'<option value="' + obj.region + '">' + obj.region
						+ '</option>')

	}

}
var editAddrForm = '<form class="form-horizontal" role="form" id="usereditform" style="margin:50px;">'

		+ '<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Full Name</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Full name" id="fullname" name="fullname">'
		+ '</div>'
		+ '</div>'

		+ '<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Region'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+

		'<select id="regselector" style="width:100%;height:100%;">'
		+

		'</select>'
		+ '</div>'
		+ '</div>'

		+ '<div class="form-group"><label for="inputPassword3" class="col-lg-4 control-label">Address1</label><div class="col-lg-6"><input type="text" class="form-control" placeholder="Address1" id="address1" name="address1"></div></div>'

		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Address2'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Address2"'
		+ 'id="address2" name="address2">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Landmark'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Landmark"'
		+ 'id="landmark" name="landmark">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">City'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="City"'
		+ 'id="city" name="city">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Email'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Email"'
		+ 'id="email" name="email">'
		+ '</div>'
		+ '</div>'
		+

		'<div class="form-group">'
		+ '<label for="inputPassword3" class="col-lg-4 control-label">Phone'
		+ '</label>'
		+ '<div class="col-lg-6">'
		+ '<input type="text" class="form-control" placeholder="Phone"'
		+ 'id="contactnumber" name="contactnumber">'
		+ '</div>'
		+ '</div>'

		+ ' <script>$("#regselector").change(function() {var restname = getCookie(\'esfrestname\');var region = $(\'#regselector\').val();calculateDeliveryCost(restname,region);});</script>'
		+ '</form>';

$(document)
		.ready(
				function() {

					
					// check if the user is logged in
					esfuuid = getCookie('esfuuid');
					if (esfuuid != null) {

						esfCookieValues = esfuuid.split('|');

						bindUser();

					} else {

						$('div#shipmentdetails').html(editAddrForm);
						// Not needed for guest checkout
						$('#editaddressbutton').remove();

					}

					var restName = getCookie('esfrestname');

					var esfuserCookie = getCookie('esfuuid');
					
					//Initialize Delivery charge
					$('.simpleCart_shippingCost').text('$ 0');
					$('.simpleCart_shippingDistance').text('5 km');
					$('.simpleCart_packingCost').text('$ 20');
					//Update Amounts
					updateTotalAmt();
					

					if (esfuserCookie != null) {
						var region = esfuserCookie.split('|');

						calculateDeliveryCost(restName, region[2]);

					}
					
					

					$('#orderbutton')
							.on(
									'click',
									function() {
										var amount = parseInt(totalStr);
										if( amount < 300) 
											{
											 alert("Minimum order Amount is $ 300. Please add fooditems to your order to meet the minimum Order amount");
									         return;
											}

										var data = unescape(
												getCookie('simpleCart')).split(
												'++');

										for ( var x = 0, xlen = data.length; x < xlen; x++) {

											var custOrder = data[x].split('||');

											var id = custOrder[0].match(regex);
											var name = custOrder[1]
													.match(regex);
											var price = custOrder[2]
													.match(regex);
											var quantity = custOrder[3]
													.match(regex);
											var item = new Food(id[1], name[1],
													price[1], quantity[1]);

											foodArr.push(item);

										}

										esfuuid = getCookie('esfuuid');

										var createdBy = 'guest';

										if (esfuuid != null) {

											userResponse.userType = 'login';
											createdBy = userResponse.username;
											userResponse.foodComments = $(
													'#foodcomments').val();

										} else {

											userResponse = new UserResponse();
											userResponse.fullname = $(
													'#fullname').val();
											userResponse.username = 'guest';
											userResponse.password = 'NA';
											userResponse.uuid = 'NA';
											userResponse.createDate = new Date();
											userResponse.updateDate = new Date();
											userResponse.contactnumber = $(
													'#contactnumber').val();
											userResponse.email = $('#email')
													.val();
										//	alert("Region::" + $('#regselector').val());
										//	userResponse.region = '';
											userResponse.region =  $('#regselector').val();
											userResponse.address1 = $(
													'#address1').val();
											userResponse.address2 = $(
													'#address2').val();
											userResponse.landmark = $(
													'#landmark').val();
											userResponse.city = $('#city')
													.val();
											userResponse.zip = 'NA';
											userResponse.foodComments = $(
													'#foodcomments').val();

											$('#city').val('Kochi');
											$("#city").attr("disabled",
													"disabled");

											var email = $('#email').val();

											var contactnumber = $(
													'#contactnumber').val()

											var address1 = $('#address1').val();

											var fullname = $('#fullname').val();

											var result = validateInputs(
													fullname, email,
													contactnumber, address1);

											if (!result) {

												return;
											}

										}

										var delivery = $(
												'.simpleCart_shippingCost')
												.text();
										
								

										var totalCost = $(
												'.simpleCart_finalTotal')
												.text();

										this.orderStatus = orderStatus;
										this.createTs = createTs;
										this.createdBy = createdBy;
										this.updatedTs = updatedTs;
										this.updatedBy = updatedBy;

										var orderStatus = 'Order Created';
										var createTs = new Date();
										var updatedTs = 'NA';
										var updatedBy = '';

										var priceSummaryData = new PriceSummaryData(
												totalStr, '0.0', '0',
												deliveryCost, packageCostAmt, totalCost,
												'$');

										userResponse.foodComments = $(
												'#foodcomments').val();

										var restaurantName = getCookie('esfrestname');

										var orderData = new Order(orderStatus,
												createTs, createdBy, updatedTs,
												updatedBy, userResponse,
												foodArr, priceSummaryData,
												restaurantName);

										orderStrData = JSON
												.stringify(orderData);

										spinner_div = $('#spinner').get(0);

										if (spinner == null) {
											spinner = new Spinner(opts)
													.spin(spinner_div);
										} else {
											spinner.spin(spinner_div);
										}

										var response = $
												.ajax(
														{
															type : "POST",
															url : "http://easysmartfood.appspot.com/order",
															data : orderStrData
														})
												.fail(
														function(msg) {

															$(
																	'#confirmationheader')
																	.text(
																			'Order Creation failed. Please contact Phone: +917558943030, +919388803073');

															spinner
																	.stop(spinner_div);

														})
												.done(
														function(msg) {

															simpleCart.cartHeaders = [
																	"Name",
																	"Price",
																	"Quantity",
																	"Total" ];

															username = userResponse.username;
															fullname = userResponse.fullname;
															region = userResponse.region;
															address1 = userResponse.address1;
															address2 = userResponse.address2;
															landmark = userResponse.landmark;
															city = userResponse.city;
															contactnumber = userResponse.contactnumber;
															email = userResponse.email;
															company = userResponse.company;

															var afterUpdateHtml = '<div class="col-lg-6 col-xs-12" style="padding:50px;"><h4>'
																	+ fullname
																	+ '</h4><h4>'
																	+ address1
																	+ '</h4><h4>'
																	+ address2
																	+ '</h4><h4>'
																	+ city
																	+ '</h4><h4>'
																	+ landmark
																	+ '</h4></div><div class="col-lg-4 col-xs-12" style="padding:50px;"><h5>'
																	+ email
																	+ '</h5><h5>'
																	+ contactnumber
																	+ '</h5></div>';

															$(
																	'div#shipmentdetails')
																	.html(
																			afterUpdateHtml);

															$(
																	'#confirmationheader')
																	.text(
																			'Your Order has been Successfully Created. Order Number :'
																					+ msg.orderNumber);

															$(
																	'#foodconfirmationheader')
																	.text(
																			'Food Will be Delivered To Below address:');

															$(
																	'#checkoutcontainer')
																	.html('');
															$(
																	'#editaddressbutton')
																	.remove();

															$('#orderbutton')
																	.remove();

															spinner
																	.stop(spinner_div);

														});

									});

					$('#editaddressbutton')
							.on(
									'click',
									function() {

										var buttonText = $('#editaddressbutton')
												.text();

										if (buttonText == 'Change Delivery Address') {

											$('div#shipmentdetails').html(
													editAddrForm);

											if (esfuuid != null) {
												$('#fullname').val(fullname);
												$('#address1').val(address1);
												$('#address2').val(address2);
												$('#landmark').val(landmark);
												$('#city').val(city);
												$('#email').val(email);
												$('#contactnumber').val(
														contactnumber);

												populateRegions();

												$('#editaddressbutton')
														.text(
																'Update Delivery Address');

											}
										} else {

											var updaddress1 = $('#address1')
													.val();

											var updaddress2 = $('#address2')
													.val();

											var updlandmark = $('#landmark')
													.val();

											var updcity = $('#city').val();

											var updemail = $('#email').val();

											var updcontactnumber = $(
													'#contactnumber').val();

											var updatedUserData = new Profile(
													updcontactnumber, updemail,
													updaddress1, updaddress2,
													updlandmark, updcity);

											var updateStrData = JSON
													.stringify(updatedUserData);

											updateUser(esfCookieValues[1],
													esfCookieValues[0],
													updateStrData);

										}

									});

					function Profile(contactnumber, email, address1, address2,
							landmark, city) {

						this.contactnumber = contactnumber;
						this.email = email;
						this.address1 = address1;
						this.address2 = address2;
						this.landmark = landmark;
						this.city = city;

					}

					function bindUser() {

						var jqxhr = $.get(
								"https://easysmartfood.appspot.com/user?useruuid="
										+ esfCookieValues[0], function() {

								}).done(function() {

							userResponse = jqxhr.responseJSON;

							var source = $("#shiptotemplate").html();

							var template = Handlebars.compile(source);
							username = userResponse.username;
							fullname = userResponse.fullname;
							region = userResponse.region;
							address1 = userResponse.address1;
							address2 = userResponse.address2;
							landmark = userResponse.landmark;
							city = userResponse.city;
							contactnumber = userResponse.contactnumber;
							email = userResponse.email;
							company = userResponse.company;

							var html = template(userResponse);

							$('div#shipmentdetails').html(html);

						}).fail(function() {
							alert("error");
						}).always(function() {
						});
					}

				});

function Food(foodUuid, displayName, price, quantity) {

	this.foodUuid = foodUuid;
	this.displayName = displayName;
	this.price = price;
	this.quantity = quantity;

}

function UserResponse() {

}

function PriceSummaryData(totalWithoutTax, taxAmt, taxPercent, deliveryCharge,
		packingCharge, grandTotal, currency) {

	this.totalWithoutTax = totalWithoutTax;
	this.taxAmt = taxAmt;
	this.taxPercent = taxPercent;
	this.deliveryCharge = deliveryCharge;
	this.packingCharge = packingCharge;
	this.grandTotal = grandTotal;
	this.currency = currency;
}

function updateUser(username, userid, updateStrData) {
	var response = $
			.ajax(
					{
						type : "PUT",
						url : "http://easysmartfood.appspot.com/user?username="
								+ username + "&useruuid=" + userid,
						data : updateStrData
					})
			.fail(function(msg) {

				console.log('Error Occured');
			})
			.done(
					function(msg) {

						var jqxhr = $
								.get(
										"https://easysmartfood.appspot.com/user?useruuid="
												+ userid, function() {

										})
								.done(
										function() {

											userResponse = jqxhr.responseJSON;
											fullname = userResponse.fullname;
											address1 = userResponse.address1;
											address2 = userResponse.address2;
											region = userResponse.region;
											landmark = userResponse.landmark;
											city = userResponse.city;
											contactnumber = userResponse.contactnumber;
											email = userResponse.email;
											company = userResponse.company;

											var afterUpdateHtml = '<div class="col-lg-6 col-xs-12" style="padding:50px;"><h4>'
													+ address1
													+ '</h4><h4>'
													+ address2
													+ '</h4><h4>'
													+ city
													+ '</h4><h4>'
													+ landmark
													+ '</h4></div><div class="col-lg-4 col-xs-12" style="padding:50px;"><h5>'
													+ email
													+ '</h5><h5>'
													+ contactnumber
													+ '</h5></div>';

											$('div#shipmentdetails').html(
													afterUpdateHtml);

											$('#editaddressbutton').text(
													'Change Delivery Address');

										}).fail(function() {
									alert("error");
								}).always(function() {
								});

					});
}

function Order(orderStatus, createTs, createdBy, updatedTs, updatedBy,
		userData, foodItems, priceSummaryData, restaurantName) {

	this.orderStatus = orderStatus;
	this.createTs = createTs;
	this.createdBy = createdBy;
	this.updatedTs = updatedTs;
	this.updatedBy = updatedBy;
	// object
	this.userData = userData;
	// array
	this.foodItems = foodItems;
	// object
	this.priceSummaryData = priceSummaryData;
	this.restaurantName = restaurantName;

}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) {
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1) {
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start, c_end));
	}
	return c_value;
}

function validateInputs(fullname, email, contactnumber, address1) {

	var valid = false;

	if (fullname == '') {

		$('#fullname').css({
			"border-color" : "red"
		});

	} else {

		$('#fullname').css({
			"border-color" : ""
		});
	}

	if (email == '' || !validateEmail(email)) {
		$('#email').css({
			"border-color" : "red"
		});
	} else {

		$('#email').css({
			"border-color" : ""
		});
	}

	if (contactnumber == '') {

		$('#contactnumber').css({
			"border-color" : "red"
		});

	} else {

		$('#contactnumber').css({
			"border-color" : ""
		});
	}

	if (address1 == '') {

		$('#address1').css({
			"border-color" : "red"
		});

	} else {

		$('#address1').css({
			"border-color" : ""
		});
	}

	if (fullname != '' && validateEmail(email) && address1 != ''
			&& contactnumber != '') {
		valid = true;
		return valid;
	}

}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}