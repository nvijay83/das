
		function FoodItems(foodCategoryArr){
			this.foodArr = foodCategoryArr;
			this.getFoodItems = getFoodItemsObj;
			}
		
		function getFoodItemsObj(){
			var obj = {'foodItems':this.foodArr};
			return obj;
		}
		
		
		var deliveryCost = 'NA';
		
		var deliveryDistance = 'NA';
		
		function getParameterByName(name) {
		    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		        results = regex.exec(location.search);
		    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		
	$(document).ready(
			
		
			function() {

			
				var query = window.location.search;
				var qryParam = query.split('=');
				
				
				var ruuid = getParameterByName('restaurantuuid');
				
				var restName = getParameterByName('restaurantname');
				
				var region = getParameterByName('restaurantregion')
				
				var days = 30;
				var date = new Date();
				date.setTime(date.getTime()
						+ (days * 24 * 60 * 60 * 1000));
				var expires = "; expires="
						+ date.toGMTString();

				
				if(ruuid != null){
				document.cookie = 'esfrestuid_url'+"="
						+ ruuid +expires;

				}
				var referringURL = document.referrer;
				
		
				document.cookie = 'esfrestname'
						+ "="
						+ restName
						+ expires;

				document.cookie = 'esfrestregion'
						+ "="
						+ region
						+ expires;
				
			
				var jqxhr = $
						.getJSON(
								"http://1.easysmartfood.appspot.com/restaurant"
										+ query, function() {
									console.log("success");
								}).done(function() {

							
							var restArr = jqxhr.responseJSON;

							var source = $("#foodmenuTemplate").html();
							var template = Handlebars.compile(source);
							

							var html = template(restArr[0]);
							
							$('div#restaurantDetails').append(html);

							var restImg = $("#resturantImgTemplate").html();
							
							var restImgTemplate = Handlebars.compile(restImg);

							var html = restImgTemplate(restArr[0]);
							$('div#restaurantImg').html(html);

						}).fail(function() {
							console.log("error");
						}).always(function() {
							console.log("complete");
						});

						var foodItemReq = $.getJSON(
						"http://1.easysmartfood.appspot.com/fooditems/restaurant"
								+ query, function() {
							console.log("success");
						}).done(function() {

					<!-- test binding -->
					
					var nonVegArr = new Array();
					var vegArr = new Array();
					var popularArr = new Array();
					var beverageArr = new Array();
					
					var foodItems = foodItemReq.responseJSON.foodItems;


					for ( var k = 0; k < foodItems.length; k++) {

						var tempFoodItemObj = foodItems[k];
						
						var tempFoodCategory = tempFoodItemObj.foodCategory;
						
						if((tempFoodCategory == 'Non Veg' || tempFoodCategory == 'Veg' || tempFoodCategory == 'Beverages') && tempFoodItemObj.popular == 'Yes'){
							popularArr.push(tempFoodItemObj);
							console.log(popularArr);
						}
						if(tempFoodCategory == 'Non Veg'){
							nonVegArr.push(tempFoodItemObj);
						}else if(tempFoodCategory == 'Veg'){
							vegArr.push(tempFoodItemObj);
						}else if(tempFoodCategory == 'Beverages'){
							beverageArr.push(tempFoodItemObj);
						}
					
					}
					
						var popularFood = new FoodItems(popularArr);
						var vegFood = new FoodItems(vegArr);
						var nonVegFood = new FoodItems(nonVegArr);
						var beverage = new FoodItems(beverageArr);
						
						var foodSource = $("#foodMenu").html();
						var vegSource = $('#vegMenu').html();
						var nonVegSource = $('#nonVegMenu').html();
						var beverageSource = $('#beverageMenu').html();
					
					try {
						
						var foodTemplate = Handlebars.compile(foodSource);
						var popularHtml = foodTemplate(popularFood.getFoodItems());
						
						console.log(popularHtml);
						
						var vegTemplate = Handlebars.compile(vegSource);
						var vegHtml = vegTemplate(vegFood.getFoodItems());
						
						var nonVegTemplate = Handlebars.compile(nonVegSource);
						var nonVegHtml = nonVegTemplate(nonVegFood.getFoodItems());
				
						var beverageTemplate = Handlebars.compile(beverageSource);
						var beverageHtml = beverageTemplate(beverage.getFoodItems());
				
						
						
					} catch (err) {
						console.log('Handle Bars' + err);
					}
					
				$('div#home').html(popularHtml);
				$('div#profile').html(vegHtml);
				$('div#nv').html(nonVegHtml);
				$('div#beverages').html(beverageHtml);
				
				}).fail(function(err) {
					console.log("error" + err);
				}).always(function() {
					console.log("complete");
				});

				
						var esfuuid = getCookie('esfuuid');
						var esfCookieValues;
						if (esfuuid != null) {
							esfCookieValues = esfuuid.split('|');

						}else{
							
							$('#checkoutbutton').text('Guest Checkout');
							
							
							$('#checkoutsection').append('<a href="login.html" class="col-lg-12 col-xs-12" id="search"><h3 class="text-center">Login ?</h3></a>');
							
							
							
						}

			});
	
	
	
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

