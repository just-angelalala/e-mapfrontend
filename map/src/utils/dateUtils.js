import moment from 'moment';

/**
 * Converts a date string to the format 'Sept 09, 2002 (Sun) 2:30 pm'.
 * @param {string} dateString - The date string to convert.
 * @return {string} - The formatted date string.
 */
export function convertToCustomFormat(dateString) {
    return moment(dateString).format('MMM DD, YYYY (ddd)') + '<br>' + moment(dateString).format('h:mm a');
}