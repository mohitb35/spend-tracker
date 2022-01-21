/**
 * Returns a range of months between a minimum and maximum date to populate a month picker.
 * Also indicates a selected/current month based on fromDate
 * @param {Date} minDate 
 * @param {Date} maxDate
 * @param {Date} fromDate 
 * @returns {Array} List of months with selected month indicated
 */
function getMonths(minDate, maxDate, fromDate){
	let minMonth = minDate.getMonth();
	let minYear = minDate.getFullYear();
	let maxMonth = maxDate.getMonth();
	let maxYear = maxDate.getFullYear();
	
	const monthRef = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const monthRange = [];

	let isMonthSelected = false;

	for(let year = minYear; year<=maxYear; year++){
		let firstMonth = (year === minYear) ? minMonth : 0;
		let lastMonth = (year === maxYear) ? maxMonth : 11;

		for(let month = firstMonth; month<=lastMonth; month++){
			let dateObj = {};
			dateObj.text = `${monthRef[month]} ${year}`;
			dateObj.date = new Date(year, month, 1).toLocaleDateString();

			if (dateObj.date == fromDate.toLocaleDateString()) {
				dateObj.selected = true;
				isMonthSelected = true;
			} else {
				dateObj.selected = false;
			}
			monthRange.push(dateObj);
		} 
	}
	if(!isMonthSelected){
		monthRange[monthRange.length-1].selected = true;
	}

	return monthRange;
}

/**
 * Returns first and last date of a month based on an input filterDate
 * @param {string} filterDate 
 * @returns {Object} month object with first and last day
 */
function monthBounds(filterDate) {
	let date = new Date(filterDate);
	let firstDay = new Date(date.getFullYear(), date.getMonth(), 1); 
	let lastDay =  new Date(date.getFullYear(), date.getMonth() + 1, 0); 
	return {
		firstDay: toDateString(firstDay),
		lastDay: toDateString(lastDay)
	}
}

/**
 * Formats date into a string to be used in API call
 * @param {Date} date 
 * @returns {string} formatted date
 */
function toDateString(date) {
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = {
	getMonths,
	monthBounds
}