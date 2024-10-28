import "dotenv/config";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import * as querystring from "node:querystring";
import * as process from "node:process";
import * as fs from "node:fs/promises";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

export async function loadToken() {
    const URL = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: "playlist-read-private playlist-read-collaborative",
            redirect_uri: process.env.REDIRECT_URI
        })
    console.log(URL)
    const code = await rl.question("code: ")
    const resp = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        body: querystring.stringify({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.REDIRECT_URI
        })
    })
    const token = (await resp.json())
    await fs.writeFile("token.json", JSON.stringify(token))
}

async function getSpotifyApi() {
    let token
    if (!process.env.TOKEN) {
        const tokenFile = await fs.readFile("token.json")
        token = JSON.parse(tokenFile.toString())
    } else {
        token = JSON.parse(process.env.TOKEN)
    }
    return SpotifyApi.withAccessToken(process.env.CLIENT_ID || "", token)
}

async function getSpotifyPlaylist() {
    const sdk = await getSpotifyApi()
    return sdk.playlists.getPlaylist(process.env.PLAYLIST_ID || "")
}

export async function getRandomSong() {
    const playlist = await getSpotifyPlaylist()
    return playlist.tracks.items[Math.floor(Math.random() * playlist.tracks.items.length)]
}