/**
 * WELCOME TO MOMENT JS
 */
$(document).ready(function () {

	/**
	 * SETUP
	 */
	// alert('** ATTENZIONE **V1.0: PROGETTO ATTUALMENTE COMPATIBILE SOLO PER LE SEGUENTI RISOLUZIONI: IPHONE X - IPHONE 6/7/8 - GALAXY S5 - MOTO G4')
	// Punto di partenza
	var baseMonth = moment('2018-01-01');
	var left = $('.header--months--left');
	var right = $('.header--months--right')
	// Init Hndlenars
	var source = $('#day--template').html();
	var template = Handlebars.compile(source);
	var firstDay = 1;

	// print giorno
	printMonth(template, baseMonth);

	// ottieni festività mese corrente
	printHoliday(baseMonth);

	// Left Click
	left.click(function(){
		if (baseMonth.month() > 0){
			left.find('i').css('opacity','1');
			setTimeout(function(){
				left.find('i').css('opacity','0.3');
			}, 300)	
			baseMonth = baseMonth.subtract(1,'M');
			$('.month--list').children().remove();
			printMonth(template, baseMonth);
			printHoliday(baseMonth);
			$('.holiday--name').fadeOut('fast');
		} 
	})

	// Right Click
	right.click(function(){
		if (baseMonth.month() < 11){
		right.find('i').css('opacity','1');
		setTimeout(function() {
        right.find('i').css('opacity','0.3');
    }, 300);
		
		
		baseMonth = baseMonth.add(1,'M');
		$('.month--list').children().remove();
		printMonth(template, baseMonth);
		printHoliday(baseMonth);
		$('.holiday--name').fadeOut();
		}
	})

	
	$('#app').on('click', '.holiday', function(){
		var holidayClicked = moment($(this).attr('data-complete-date'));
		$('.holiday--name').hide();
		$.ajax({
			url: 'https://flynn.boolean.careers/exercises/api/holidays' ,
			method: 'GET',
			data: {
					year: holidayClicked.year(),
					month: holidayClicked.month(),
			},
			success: function(res) {
				var holidayName = res.response;

				for (var i = 0; i < holidayName.length; i++){
					if (holidayName[i].date == holidayClicked.format('YYYY-MM-DD')){
						var holidayToShow = (holidayName[i].name);
						console.log(holidayToShow);
						$('.holiday--name').text(holidayToShow).slideDown();
					};
				}
			},
			error: function() {
				console.log('Errore chiamata festività');
			}
		});
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
	$('.header--years--year').html( date.format('YYYY') );
	$('.month').html( date.format('MMMM') );

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
		if (i == 0){
			firstDay = 50 * (thisDate.format('d'));
		}
	}
	$('.day-box').first().css('margin-left',firstDay);
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

				var listItem = $('.day-box[data-complete-date="' + holidays[i].date + '"]');

				if(listItem) {
					listItem.addClass('holiday');
				}
			}
		},
		error: function() {
			console.log('Errore chiamata festività');
		}
	});
}