let eid = document.getElementById('videoIframe').getAttribute('vidData');
let tag = document.createElement('script');
tag.id = 'iframeVideoId';
tag.src = 'https://www.youtube.com/iframe_api';
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoIframe', {
        events: {
            'onReady': onPlayerReady,
        }
    });
}
function onPlayerReady() {
    window.addEventListener('beforeunload', async () => {
        const currentTime = player.getCurrentTime();
        const data = await fetch("/saveProgress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                timestamp: currentTime,
                enrollId: eid
            })
        });
    });
}