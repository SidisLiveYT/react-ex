import fetch from "node-fetch";
import { URLSearchParams } from "url";
import Axios from "axios";
import "dotenv/config";

class discordApp {
  appCache = {};
  constructor(configs) {
    this.cache = {
      accessToken: configs?.access_token,
      oauthCode: configs?.oauthCode,
      tokenScopes: configs?.scopes?.join(" "),
      refreshToken: configs?.refresh_token,
    };
  }
  async getTokens(oauthCode, grantType = "oauth") {
    if (!oauthCode) throw new Error("NoCodeProvided");
    this.cache.oauthCode = oauthCode ?? this.cache.oauthCode;
    let queryData = {
        client_id: process.env.BOT_CLIENT_ID,
        client_secret: process.env.BOT_CLIENT_SECRET,
        redirect_uri: process.env.API_REDIRECT_URI,
        scope:
          "identify email guilds guilds.members.read messages.read connections",
        grant_type:
          grantType?.toLowerCase()?.trim() === "oauth"
            ? "authorization_code"
            : "refresh_token",
      },
      queryHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
      };

    if (grantType?.toLowerCase()?.trim() === "oauth")
      queryData.code = oauthCode;
    else queryData.refresh_token = oauthCode;
    let rawResponse = await fetch(routerWeb.defaultUri?.tokenUri, {
      method: "POST",
      body: new URLSearchParams(queryData),
      headers: queryHeaders,
    })?.catch((error) => {
      throw error;
    });
    let jsonResult = await rawResponse?.json();
    this.cache.accessToken =
      jsonResult?.access_token ?? this.cache?.accessToken;
    this.cache.refreshToken =
      jsonResult?.refresh_token ?? this.cache?.refreshToken;
    return jsonResult;
  }

  async getApiUri(subUri, rawParams, rawMethod = "GET", queryHeaders = {}) {
    if (!(subUri && typeof subUri === "string" && subUri !== ""))
      throw new Error("sub Api EndPoint is Invalid");
    let rawResponse = await Axios(routerWeb.defaultUri?.apiUri + subUri, {
      method: rawMethod,
      params: rawParams,
      headers: queryHeaders,
    })?.catch((error) => {
      throw error;
    });
    return rawResponse?.data;
  }
}

export default discordApp;
