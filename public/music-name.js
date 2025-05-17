let length = document.getElementById('song_name');
let rightPoint = length;

document.addEventListener('keydown', function(event){
    if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault(); // Prevent scrolling
        const player = document.getElementById('audio-player');
        
        if (player.paused) {
          player.play();
        } else {
          player.pause();
        }
    }
})