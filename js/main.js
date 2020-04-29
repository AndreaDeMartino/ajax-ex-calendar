/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {

	/**
	 * SETUP
	 */
	alert('** ATTENZIONE **V1.0: PROGETTO ATTUALMENTE COMPATIBILE SOLO PER LE SEGUENTI RISOLUZIONI: IPHONE X - IPHONE 6/7/8 - GALAXY S5 - MOTO G4')
	// Punto di partenza
	var baseMonth = moment('2018-01-01');
	var left = $('.left');
	var right = $('.right')
	// Init Hndlenars
	var source = $('#day--template').html();
	var template = Handlebars.compile(source);

	// print giorno
	printMonth(template, baseMonth);

	// ottieni festività mese corrente
	printHoliday(baseMonth);

	// Left Click
	left.click(function(){
		if (baseMonth.month() > 0){
			baseMonth = baseMonth.subtract(1,'M');
			$('.month--list').children().remove();
			printMonth(template, baseMonth);
			printHoliday(baseMonth);
		} 
	})

	// Right Click
	right.click(function(){
		if (baseMonth.month() < 11){
		baseMonth = baseMonth.add(1,'M');
		$('.month--list').children().remove();
		printMonth(template, baseMonth);
		printHoliday(baseMonth);
		}
	})

}); // <-- End doc ready


/*************************************
    FUNCTIONS
 *************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
	// numero giorni nel mese
	var daysInMonth = date.daysInMonth();

	//  setta header
	// $('h1').html( date.format('MMMM YYYY') );
	$('.header--years--year').html( date.format('YYYY') );
	$('.month').html( date.format('MMMM') );
	// Imposta data attribute data visualizzata

	// genera giorni mese
	for (var i = 0; i < daysInMonth; i++) {
		// genera data con moment js
		var thisDate = moment({
			year: date.year(),
			month: date.month(),
			day: i + 1
		});

		// imposta dati template
		var context = {
			class: 'day',
			day: thisDate.format('DD'),
			completeDate: thisDate.format('YYYY-MM-DD')
		};

		//compilare e aggiungere template
		var html = template(context);
		$('.month--list').append(html);
	}
}

// Ottieni e stampa festività
function printHoliday(date) {
	// chiamo API
	$.ajax({
		url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
		method: 'GET',
		data: {
				year: date.year(),
				month: date.month()
		},
		success: function(res) {
			var holidays = res.response;

			for (var i = 0; i < holidays.length; i++) {
				var thisHoliday = holidays[i];

				var listItem = $('.day-box[data-complete-date="' + thisHoliday.date + '"]');

				if(listItem) {
					listItem.addClass('holiday');
					// listItem.text( listItem.text() + ' - ' + thisHoliday.name );
				}
			}
		},
		error: function() {
			console.log('Errore chiamata festività');
		}
	});
}