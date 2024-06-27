const GLOBAL_FNS = (() => {
  type TDateFields = "willFormatMins" | "willFormatSeconds" | "willFormatHours";
  type TZeroFill = Partial<Record<TDateFields, boolean>>;

  function formatNum(num: number) {
    return num.toString().length === 1 ? `0${num}` : `${num}`;
  }

  function getCurrentDate(
    zeroFill: TZeroFill = {},
    isMilitary?: boolean,
    willGetOnlyDate?: boolean
  ) {
    const dateObj = new Date();
    const month = formatNum(dateObj.getUTCMonth() + 1);
    const day = formatNum(dateObj.getUTCDay() + 1);
    const year = dateObj.getFullYear();

    if (willGetOnlyDate) {
      return `${month}/${day}/${year}`;
    }

    let hours: string | number = dateObj.getHours();
    hours = hours > 12 ? hours - 12 : hours;
    hours = zeroFill.willFormatHours ? formatNum(hours) : hours;
    const minutes = formatNum(dateObj.getMinutes());

    if (isMilitary) {
      return `${month}/${day}/${year} ${hours}:${minutes}`;
    }

    const timeOfDay = dateObj.getHours() > 12 ? "pm" : "am";

    return `${month}/${day}/${year} ${hours}:${minutes}${timeOfDay}`;
  }

  function parseToObj<TData extends object>(stringifiedObj: string): TData {
    return JSON.parse(stringifiedObj);
  }

  function getIsParsable<TData extends string>(val: TData) {
    try {
      JSON.parse(val);

      return true;
    } catch (error) {
      console.error("Not parsable. Reason: ", error);
    }
  }

  function getUserPropertyParsed<TData>(
    cacheKeyName: TUserPropertyKeys
  ): TData | null {
    const targetVal = getUserProperty(cacheKeyName);

    if (!targetVal || !getIsParsable(targetVal)) {
      return null;
    }

    return JSON.parse(targetVal);
  }

  function setUserProperty<
    TDataA extends TUserPropertyKeys,
    TDataB extends TDynamicCacheVal<TDataA>
  >(keyName: TDataA, val: TDataB) {
    const userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(keyName, JSON.stringify(val));
  }

  function getUserProperty(cacheKeyName: TUserPropertyKeys): string | null {
    const userProperties = PropertiesService.getUserProperties();
    const cacheVal = userProperties.getProperty(cacheKeyName);

    if (!cacheVal) {
      return null;
    }

    return cacheVal;
  }

  return {
    parseToObj,
    getIsParsable,
    getUserPropertyParsed,
    setUserProperty,
    getUserProperty,
    getCurrentDate,
  };
})();

const request = (() => {
  type TApiPaths =
    (typeof apiServices.API_PATHS)[keyof typeof apiServices.API_PATHS];

  class Request {
    #serverOrigin: string;

    constructor() {
      this.#serverOrigin = "https://97aad8dddf06b1.lhr.life";
    }

    get(path: TApiPaths) {
      UrlFetchApp.fetch(`${this.#serverOrigin}/${path}`);
    }
    // throw a compiler error if the string start with "/"
    post<TData extends object>(payload: TData, path: TApiPaths = "/") {
      try {
        const payloadValsStringified = Object.entries(payload).reduce(
          (ObjAccumulated, keyAndVal) => {
            const [key, val] = keyAndVal;
            const valUpdated =
              typeof val === "string" ? val : JSON.stringify(val);

            return Object.assign(ObjAccumulated, { [key]: valUpdated });
          },
          {} as { [key: string]: string }
        );
        const response = UrlFetchApp.fetch(`${this.#serverOrigin}/${path}`, {
          method: "post",
          payload: payloadValsStringified,
        });
        const responseCode = response.getResponseCode();
        const contextTxt = response.getContentText();

        if (responseCode !== 200) {
          throw new Error(
            `Recieved a ${responseCode} error response from the server. Error message: ${contextTxt}.`
          );
        }

        return { parsableData: response.getContentText() };
      } catch (error) {
        return { errMsg: JSON.stringify(error) };
      }
    }
  }

  return new Request();
})();
