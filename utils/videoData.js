const axios = require('axios');

module.exports.getVideoData = async function getVideoData(vidId) {
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
            part: 'contentDetails,snippet', // Request both contentDetails and snippet parts
            id: vidId,
            key: process.env.YOUTUBE_KEY
        }
    });
    const videoDetails = result.data.items[0];
    const thumbnails = videoDetails.snippet.thumbnails;
    const rawDuration = videoDetails.contentDetails.duration;

    const match = rawDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
    const hrs = match[1] ? parseInt(match[1]) : 0;
    const mins = match[2] ? parseInt(match[2]) : 0;
    const secs = match[3] ? parseInt(match[3]) : 0;
    const duration = {
        hours: hrs,
        minutes: mins,
        seconds: secs
    }

    const thumbnail = thumbnails.high.url;

    return { duration, thumbnail };
}