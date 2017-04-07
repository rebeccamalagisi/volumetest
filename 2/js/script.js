/*

It's Oh So Quiet
Pippin Barr

The script gets access to the user's microphone with getUserMedia
and then relies on audio code by Chris Wilson in volume-meter.js.
https://webaudiodemos.appspot.com/volume-meter/index.html
to get access to the current volume level in the microphone.

It then uses the volume to set the visibility of page's content, which
means you can only see the content if it's nice and quiet.

*/

// How often to check the current volume
const CHECK_INTERVAL = 100;

// An audiocontext is used to work with audio
var audioContext;
// We will create an audio meter and put it in here
var meter;
// A place to store the output stream of the microphone
var microphone;

/////////////////////////////////////////////////////////////////////////////


$(document).ready(function() {

  // Do the getUserMedia stuff
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {     
    // Note that this time we use {audio: true} to get the microphone,
    // otherwise it's the same as getting video.
    navigator.getUserMedia({audio: true}, handleAudio, audioError);
  }

  // We're going to repeatedly check the current audio volume
  // in order to update the visibilty of the page content,
  // so we need an interval
  setInterval(update,CHECK_INTERVAL);

});


/////////////////////////////////////////////////////////////////////////////

// handleAudio (stream)
//
// Called when we have access to the microphone's audio stream
function handleAudio (stream) {
  // Create our AudioContext for working with audio...
  audioContext = new AudioContext();

  // Store the audio stream from the microphone in our microphone variable
  microphone = audioContext.createMediaStreamSource(stream);

  // Create an audio meter for checking the volume
  meter = createAudioMeter(audioContext);

  // Connect the meter and the microphone so the meter has access
  // the microphone stream
  microphone.connect(meter);
}

// audioError ()
//
// If something goes wrong, panic!

function audioError(e) {
  $('#volume').css({
    'background-color': 'red'
  })
}

// update ()
//
// Called every CHECK_INTERVAL milliseconds.
// Checks to make sure the meter exists, and then sets the opacity
// of our content div to be relative to the current volume.
function update () {
  if (meter) {
    // meter.volume gives us a number between 0 (silence) and 1 (loudest possible)
    // If you look at the value of meter.volume, it's often very, very small
    // for ambient noise, so we multiple by 10000 to make our webpage more
    // sensitive to noise
    //
    // We subtract that value from 1 because we want the opacity to get LOWER
    // when the volume gets HIGHER.
    var newOpacity = meter.volume*500 - 1;
    if (newOpacity > 1) {
      newOpacity = 1;
    }
    // Could also use: var newOpacity = Math.max(0, 1 - meter.volume*10000)
    // if we don't want the if statement

    // Now set the opacity
    $('#quiet').css({
      opacity: Math.max(0, newOpacity)
    });

    // TRY THIS: just set newOpacity to be meter.volume instead,
    // what does this do? How does it change your experience of the page?
  }

}


// function update () {
//   if (meter) {
//     // meter.volume gives us a number between 0 (silence) and 1 (loudest possible)
//     // If you look at the value of meter.volume, it's often very, very small
//     // for ambient noise, so we multiple by 10000 to make our webpage more
//     // sensitive to noise
//     //
//     // We subtract that value from 1 because we want the opacity to get LOWER
//     // when the volume gets HIGHER.
//     var newOpacity = meter.volume*10000 - 1;
//     if (newOpacity < 0) {
//       newOpacity = 0;
//     }
//     // Could also use: var newOpacity = Math.max(0, 1 - meter.volume*10000)
//     // if we don't want the if statement
//
//     // Now set the opacity
//     $('#quiet').css({
//       opacity: Math.max(0, newOpacity)
//     });
//
//     // TRY THIS: just set newOpacity to be meter.volume instead,
//     // what does this do? How does it change your experience of the page?
//   }
//
// }
