import {Bot} from "@skyware/bot";
import {PlaylistedTrack, Track} from "@spotify/web-api-ts-sdk";

export async function postSong(song: PlaylistedTrack<Track>) {
    const bot = new Bot();
    await bot.login({
        identifier: process.env.BSKY_USER || "",
        password: process.env.BSKY_PASSWORD || ""
    })
    console.log(JSON.stringify(song, null, 2))

    await bot.post({
        text: `La canción de hoy es:\n${song.track.artists.map(v => v.name).join(",")} - ${song.track.name} (${song.track.external_urls.spotify})`,
        external: {
            uri: song.track.external_urls.spotify,
            title: song.track.name,
            description: song.track.artists.map(v => v.name).join(","),
            thumb: {
                data: song.track.album.images.sort((a, b) => b.height - a.height)[0].url
            }
        }
    })
}