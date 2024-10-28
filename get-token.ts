import {loadToken} from "./src/spotify";

loadToken().then(() => console.log("You'll have the token in token.json"))