//reverses playback from wherever the playhead currently is:
myAnimation.reverse();
 
//reverses playback from exactly 2 seconds into the animation:
myAnimation.reverse(2);

//reverses playback from exactly 2 seconds into the animation but doesn't suppress events during the initial move:
myAnimation.reverse(2, false);

//reverses playback from the very END of the animation:
myAnimation.reverse(0);
 
//reverses playback starting from exactly 1 second before the end of the animation:
myAnimation.reverse(-1);

//flips the orientation (if it's forward, it will go backward, if it is backward, it will go forward):
if (myAnimation.reversed()) {
   myAnimation.play();
} else {
   myAnimation.reverse();
}

//flips the orientation using the reversed() method instead (shorter version of the code above):
myAnimation.reversed( !myAnimation.reversed() );