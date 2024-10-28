import schedule from "node-schedule";
import {getRandomSong} from "./spotify.js";
import {postSong} from "./bsky.js";

schedule.scheduleJob("0 0 9 * * *", async () => {
    const song = await getRandomSong()
    await postSong(song);
    console.log("Song posted")
})