import expressApp from "express";
import bodyParser from "body-parser";
import "dotenv/config";

const { text, urlencoded } = bodyParser;
class routerWeb {
  static defaultUri = {
    tokenUri: "https://discord.com/api/oauth2/token",
    apiUri: "https://discord.com/api/v9",
    apiRedirectUri: "http://localhost:8080/discord-auOth2",
    discordUri: "https://discord.com/",
  };
  constructor() {
    this.expressApp = expressApp();
    this.expressApp.use(
      urlencoded({
        extended: true,
      })
    );
    this.expressApp.use(expressApp.json());
    this.expressApp.use(text());
    this.expressApp.use((err, req, res, next) => {
      switch (err.message) {
        case "NoCodeProvided":
          return res.status(400).send({
            status: "ERROR",
            error: err.message,
          });
        default:
          return res.status(500).send({
            status: "ERROR",
            error: err.message,
          });
      }
    });
    this.expressApp.listen(8080);
  }
  startListeners() {
    this.expressApp.get("/", (req, res) => {
      res.status(300).redirect(routerWeb.defaultUri?.discordUri);
    });

    this.expressApp.get("/discord-auOth2", async (req, res) => {
      let rawCode = req?.query?.code;
      if (!rawCode)
        return res.status(300).redirect(routerWeb.defaultUri?.discordUri);
      let cookedTokens = await this.#getTokens(rawCode, "oauth");
      if (!cookedTokens?.access_token) throw new Error("NoTokenProvided");
      let apiResponse = await this.#getApiUri("users/@me/guilds", "GET", {
        authorization: "Bearer " + cookedTokens?.access_token,
      });
      console.log(apiResponse);
      res.status(300).redirect(routerWeb.defaultUri?.discordUri);
    });
  }
}

new routerWeb().startListeners();
