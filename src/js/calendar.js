(function() {
	// TODO: move all this to backend

	var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		MONTH_NAMES_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
		DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	var timeMin = getDateString(0),
		timeMax = getDateString(3);

	var now = new Date(),
		currentMonth = now.getMonth(),
		currentDate = now.getDate(),
		currentYear = now.getFullYear();

	$.ajax({
		url: "https://clients6.google.com/calendar/v3/calendars/goodforgary@yahoo.com/events?calendarId=goodforgary%40yahoo.com&singleEvents=true&timeZone=America%2FChicago&maxResults=250&sanitizeHtml=true&timeMin="+timeMin+"&timeMax="+timeMax+"&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs&orderBy=startTime",
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
			shows = response.items.filter(filter).map(format);

		calendar.push({
			month: MONTH_NAMES[currentMonth % 12], 
			shows: getShowsByMonth(currentMonth)
		}, {
			month: MONTH_NAMES[(currentMonth + 1) % 12], 
			shows: getShowsByMonth((currentMonth + 1) % 12)
		}, {
			month: MONTH_NAMES[(currentMonth + 2) % 12], 
			shows: getShowsByMonth((currentMonth + 2) % 12)
		});

		function getShowsByMonth(month) {
			return shows.filter(function(show) {
				return Number(show.month) === month + 1;
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

	function isAcoustic(show) {
		return show.summary.toLowerCase().indexOf('acoustic') !== -1;
	}

	function getTimeString(show) {
		var partial = show.summary.split('@')[0],
			start = partial.indexOf('('),
			end = partial.indexOf(')'),
			timeStr = "9:00pm";

			if (start !== -1 && end !== -1) {
				timeStr = partial.substring(start + 1, end) + "pm";
			}

		return timeStr;
	}

	function isInPast(parsedDate) {
		return parsedDate[1] <= (currentMonth + 1) && parsedDate[2] < currentDate && Number(parsedDate[0]) <= currentYear;
	}

	function format(show) {
		var date = new Date(show.start.date),
			parsedDate = show.start.date.split('-');
		return { 
			venue: getVenueName(show),
			time: getTimeString(show),
			day: parsedDate[2],
			month: parsedDate[1],
			isAcoustic: isAcoustic(show),
			isInPast: isInPast(parsedDate),
			dateObj: date 
		};
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
		$('.calendar-content').html(html);
	}

	function setFilter(filter) {
		$('.calendar').removeClass('hide-shows').attr('data-filter', filter);
	}

	function setActiveState(button) {
		$('#calendarFilters button').removeClass('active');
		$(button).addClass('active');
	}

	$('#calendarFilters').on('click', 'button', function() {
		setActiveState(this);
		setFilter($(this).data('filter'));
	});

})();