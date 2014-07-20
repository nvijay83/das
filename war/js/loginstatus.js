		var delete_cookie = function(name) {
			document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		};

		var loggedin = getCookie('esfuuid');

		if (loggedin != null && loggedin.trim() != '') {
			$('#loginmenu').append(
					'<li><a href="/index.html" id="logout">Logout</a></li>');

		} else {

			$('#loginmenu').append('<li><a href="/login.html">Login</a></li>');

		}

		$('a[href="/index.html"]').click(function() {
			delete_cookie('esfuuid');
			$('#loginmenu').append('<li><a href="/login.html">Login</a></li>');
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