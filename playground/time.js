// Jan 1st 1970 00:00:00am

/* var date = new Date();
var months = ['Jan', 'Feb'];
console.log(date.getMonth()); */

var moment = require('moment');

/* var date = moment();
// console.log(date.format());
date.add(100, 'year').subtract(9, 'month');
console.log(date.format('MMM Do, YYYY')); */

// 6:01 am
var date = moment();
console.log(date.format('h:mm a'));

var createdAt = 1234;
var date2 = moment(createdAt);
console.log(date2.format('h:mm a'));

// same to new Date().getTime()
var someTimestamp = moment().valueOf();
console.log(someTimestamp);