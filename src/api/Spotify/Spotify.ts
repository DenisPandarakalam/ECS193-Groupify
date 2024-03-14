export default class Spotify {
  private static instance: Spotify;

  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): Spotify {
    if (!Spotify.instance) {
      Spotify.instance = new Spotify();
    }
    return Spotify.instance;
  }

  public static getProfileInfo = async (credentials: any) => {
    if (!credentials || !credentials.tokens || !credentials.tokens.access_token) return;
    console.log(credentials);
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + credentials.tokens.access_token,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  public static getPlayerQueue = async (credentials: any) => {
    if (!credentials || !credentials.tokens || !credentials.tokens.access_token) return;
    const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
      headers: {
        Authorization: "Bearer " + credentials.tokens.access_token,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  public static playSong = async (credentials: any, uris: string[]) => {
    if (!credentials || !credentials.tokens || !credentials.tokens.access_token) return;

    let body = {
      uris
    };

    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + credentials.tokens.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);
    return data;
  };
}
