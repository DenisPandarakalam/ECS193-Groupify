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

  public static getProfileInfo = async (accessToken: string) => {
    if (accessToken === "") return;
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  public static getPlayerQueue = async (accessToken: string) => {
    if (accessToken === "") return;
    const response = await fetch("https://api.spotify.com/v1/me/player/queue", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  public static playSong = async (accessToken: string, uris: string[]) => {
    if (accessToken === "") return;

    let body = {
      uris
    };

    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log(data);
    return data;
  };
}
