(function() {
	
	// TODO: move all this to backend

	var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		MONTH_NAMES_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
		DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	var timeMin = getDateString(0),
		timeMax = getDateString(3);

	$.ajax({
		url: "https://clients6.google.com/calendar/v3/calendars/goodforgary@yahoo.com/events?calendarId=goodforgary%40yahoo.com&singleEvents=true&timeZone=America%2FChicago&maxResults=250&sanitizeHtml=true&timeMin="+timeMin+"&timeMax="+timeMax+"&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs",
		dataType: "json",
		success: processCalendarEvents
	});

	function getDateString(monthsFromToday) {
		var date = new Date();
		
		date.setDate(0);
		date.setMonth(monthsFromToday + date.getMonth());

		return date.toISOString();
	}

	function processCalendarEvents(response) {
		var calendar = [], 
			currentMonth = new Date().getMonth(),
			shows = response.items.filter(filter).map(format).sort(sort);

		calendar.push({
			month: MONTH_NAMES_ABBR[currentMonth], 
			shows: getShowsByMonth(currentMonth)
		}, {
			month: MONTH_NAMES_ABBR[currentMonth + 1], 
			shows: getShowsByMonth(currentMonth + 1)
		}, {
			month: MONTH_NAMES_ABBR[currentMonth + 2], 
			shows: getShowsByMonth(currentMonth + 2)
		});

		function getShowsByMonth(month) {
			return shows.filter(function(show) {
				return show.dateObj.getMonth() === month;
			});
		}

		render(calendar);
	
	}

	function filter(show) {
		return show.summary && show.summary.indexOf("@") !== -1;
	}

	function getVenueName(show) {
		return (/(wedding|private)/i).test(show.summary) ? "Private Event" : show.summary.split("@")[1].trim();
	}

	function format(show) {
		var date = new Date(show.start.date);
		date.setHours(21);
		return { venue: getVenueName(show), dateString: formatDayString(date.getDate() + 1), dateObj: date };
	}

	function formatDateString(date) {
		var day = formatDayString(date.getDate() + 1);
		return DAY_NAMES[(date.getDay() + 1) % 7] + ", " + day;
	}

	function formatDayString(day) {
		var dayString = day % 10;

		switch (dayString) {
			case 1:
				dayString = (day === 11) ? "th" : "st";
			break;
			case 2:
				dayString = (day === 12) ? "th" : "nd";
			break;
			case 3: 
				dayString = (day === 13) ? "th" : "rd";
			break;
			default:
				dayString = "th";
			break;
		}

		return day + dayString;

	}

	function sort(a, b) {
		return b.dateObj < a.dateObj ? 1 : -1;
	}

	function render(calendar) {
		var tpl = $('#template').html(),
			html = Mustache.render(tpl, {calendar: calendar});
		$('#calendar .content').html(html);
	}

})();