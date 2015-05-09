(function() {

	var timeMin = getDateString(0),
		timeMax = getDateString(3);

	$.ajax({
		url: "https://clients6.google.com/calendar/v3/calendars/goodforgary@yahoo.com/events?calendarId=goodforgary%40yahoo.com&singleEvents=true&timeZone=America%2FChicago&maxResults=250&sanitizeHtml=true&timeMin="+timeMin+"&timeMax="+timeMax+"&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs",
		dataType: "json",
		success: processCalendarEvents
	});

	function getDateString(monthsFromToday) {
		var date = new Date();
		
		date.setDate(1);
		date.setMonth(monthsFromToday + date.getMonth());

		return date.toISOString();
	}

	function processCalendarEvents(response) {
		var shows = response.items.filter(filter).map(format).sort(sort);

		console.log(shows);
		render(shows);
	}

	function filter(show) {
		return show.summary && show.summary.indexOf("@") !== -1;
	}

	function getVenueName(show) {
		return (/(wedding|private)/i).test(show.summary) ? "Private Event" : show.summary.split("@")[1].trim();
	}

	function format(show) {
		return { venue: getVenueName(show), date: show.start.date };
	}

	function sort(a, b) {
		return b.date < a.date ? 1 : -1;
	}

	function render(shows) {
		var tpl = $('#template').html();
		var html = Mustache.render(tpl, {shows: shows});
		console.log(Mustache, html);
		$('#calendar .content').html(html);
	}

})();