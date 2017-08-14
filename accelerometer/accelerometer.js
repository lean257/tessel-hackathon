// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var Twitter = require('node-twitter');

var old;
var limit = 1;
var movement = false;
var doorClosed = true;
// var start = 0;
// var end = 0;
var countClosed = 0;
var stallNum = 3;

var twitterRestClient = new Twitter.RestClient(
    'Mv47rer0BKmpd9myeekPFi0Nn',
    'N2tIwq66rv7wEOV7s1jfQAtvkYnlWSld5hbSMj48dVhEbcjGZ7',
    '897199934272929792-QmeDQeFhFDLuATJ3ZjDLU2C0fN9IkYv',
    'NH4Xp9F6tH5T3jgrAtdIUkLAVFT8xWWH3QaefJY61QuIN'
);

// Initialize the accelerometer.
accel.on('ready', function () {
// Stream accelerometer data
accel.on('data', function (xyz) {

  //start = new Date().getTime()
  //door is opening
  if (hasChanged(xyz) && !movement && doorClosed) {
    console.log('door is opened')
    movement = true
    // start = new Date().getTime()
    doorClosed = false
  }

  if (!hasChanged(xyz) && movement && !doorClosed) {
    console.log('door is closed -hello')
    countClosed++;
    console.log(countClosed)
    // end = new Date().getTime()
    movement = false
    doorClosed = true
  }

  //var end = new Date().getTime()``
  if(countClosed > stallNum) {
    // twitterRestClient.statusesUpdateWithMedia(
    //     {
    //         'status': 'Bathroom is busy',
    //         'media[]': '/Users/lean/Fullstack/tessel/accelerometer/robot.gif'
    //     },
    //     function(error, result) {
    //         if (error)
    //         {
    //             console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
    //         }
    //
    //         if (result)
    //         {
    //             console.log(result);
    //         }
    //     }
    // );
    twitterRestClient.statusesUpdate(
      {status: 'bathroom busy helllo'},
      function (err, data) {
        if (err) {
          console.error(err);
        } else {
          console.log(data);
        }
      }
    )
    countClosed = 0;
  }

  old = xyz
});

// if ((end-start === 3000) && countClosed > 4) {
//   console.log('Bathroom is busy!')
// } else {
//   console.log('Bathroom is free')
// }
});


function hasChanged (xyz) {
  if (old) {
    if ((Math.abs(xyz[0]) - old[0]) > limit) return true;
    if ((Math.abs(xyz[1]) - old[1]) > limit) return true;
    if ((Math.abs(xyz[2]) - old[2]) > limit) return true;
  }
  return false;
}



// twitterRestClient.statusesUpdateWithMedia(
//     {
//         'status': 'Posting a tweet w/ attached media.',
//         'media[]': '/some/absolute/file/path.jpg'
//     },
//     function(error, result) {
//         if (error)
//         {
//             console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
//         }
//
//         if (result)
//         {
//             console.log(result);
//         }
//     };
// );

accel.on('error', function(err){
  console.log('Error:', err);
});
