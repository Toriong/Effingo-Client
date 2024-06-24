function parseToObj<TData extends object>(stringifiedObj: string): TData {
  return JSON.parse(stringifiedObj);
}

function handleFolderItemsCopy() {
  const { SQUARE } = CARDSERVICE_VARS;
  const { createHeader } = CardServices;
  const folderCopyCardHeader = createHeader(
    "Folder Copy",
    IMGS.COPY_ICON,
    "folder_copy_icon",
    SQUARE,
    "yo thereeee!."
  );
  const card = CardService.newCardBuilder()
    .setHeader(folderCopyCardHeader)
    .build();
  const newNavigationStack = CardService.newNavigation().pushCard(card);

  return newNavigationStack;
}

function getIsParsable<TData extends string>(val: TData) {
  try {
    JSON.parse(val);

    return true;
  } catch (error) {
    console.error("Not parsable. Reason: ", error);
  }
}

function handleOnDriveItemsSelected(event: IGScriptAppEvent) {
  let copyFoldersInfo =
    getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  copyFoldersInfo =
    copyFoldersInfo && Object.keys(copyFoldersInfo).length > 0
      ? copyFoldersInfo
      : {};
  let copyFolderDestinationName = `${event.drive.activeCursorItem?.title} COPY`;
  request.post({
    map: JSON.stringify({
      activieCursorId: event.drive?.activeCursorItem?.id,
      copyFoldersInfo: copyFoldersInfo,
    }),
  });
  if (
    copyFoldersInfo &&
    event.drive.activeCursorItem?.id &&
    copyFoldersInfo[event.drive.activeCursorItem.id]
  ) {
    copyFolderDestinationName =
      copyFoldersInfo[event.drive.activeCursorItem.id]
        .copyDestinationFolderName;
  } else if (
    event.drive.activeCursorItem?.id &&
    !copyFoldersInfo[event.drive.activeCursorItem.id]
  ) {
    const folderCopyDestination = {
      [event.drive.activeCursorItem.id]: {
        copyDestinationFolderName: copyFolderDestinationName,
      },
    } as TFoldersToCopyInfo;
    request.post({ map: JSON.stringify("YO") });
    copyFoldersInfo = { ...copyFoldersInfo, ...folderCopyDestination };
    setUserProperty("foldersToCopyInfo", copyFoldersInfo);
  }
  const headerTxt = getUserProperty("headerTxtForGdriveSelectedResultsPg");

  if (!event.parameters) {
    event.parameters = {};
  }

  Object.assign(event.parameters, {
    headerTxt: JSON.parse(headerTxt as string),
    selectedFolderToCopyParsable: JSON.stringify(event.drive.activeCursorItem),
    copyDestinationFolder: copyFolderDestinationName,
  });

  return renderSelectGdriveItemCardPg(event);
}

function setIsUserOnItemSelectedResultsPg(isOnItemSelectedResultPg: boolean) {
  const userProperties = PropertiesService.getUserProperties();
  const currentUserCardPg: {
    [key in TSelectedUserPropertyKey<"isOnItemSelectedResultPg">]: string;
  } = { isOnItemSelectedResultPg: JSON.stringify(isOnItemSelectedResultPg) };

  userProperties.setProperties(currentUserCardPg);
}

function getIsBool(boolStr: string) {
  try {
    JSON.parse(boolStr);

    return true;
  } catch (error) {
    return false;
  }
}

function setUserProperty<
  TDataA extends TUserPropertyKeys,
  TDataB extends TDynamicCacheVal<TDataA>
>(keyName: TDataA, val: TDataB) {
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty(keyName, JSON.stringify(val));
}

function resetUserProperties() {
  const userProperties = PropertiesService.getUserProperties();

  userProperties.deleteAllProperties();
}

function resetSpecifiedUserProperties(userPropertyKeys: TUserPropertyKeys[]) {
  const userProperties = PropertiesService.getUserProperties();

  for (const key of userPropertyKeys) {
    userProperties.deleteProperty(key);
  }
}

function getUserProperty(cacheKeyName: TUserPropertyKeys): string | null {
  const userProperties = PropertiesService.getUserProperties();
  const cacheVal = userProperties.getProperty(cacheKeyName);

  if (!cacheVal) {
    return null;
  }

  return cacheVal;
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

function addParameterForBtnHandlerEvent<
  TDataA extends keyof TAvailableParametersForHandlerFn,
  TDataB extends TAvailableParametersForHandlerFn[TDataA]
>(
  parameterKey: TDataA,
  valForCorrespondingKey: TDataB,
  parameters: { [key: string]: string } = {}
) {
  return {
    ...parameters,
    [parameterKey]: JSON.stringify(valForCorrespondingKey),
  };
}

function stringifyParameters<
  TDataA extends keyof TAvailableParametersForHandlerFn,
  TDataB extends TAvailableParametersForHandlerFn[TDataA]
>(parameters: { [key in TDataA]: TDataB }) {
  return Object.values(parameters).reduce(
    (
      finalParametersObj: { [key in TDataA]: string },
      [key, val]: [TDataA, TDataB]
    ) => {
      return Object.assign(finalParametersObj, {
        [key]: typeof val === "string" ? val : JSON.stringify(val),
      });
    },
    {}
  ) as { [key in TDataA]: string };
}

const request = (() => {
  class Request {
    #origin: string;

    constructor() {
      this.#origin = "https://25d44406316bc6ca1629e8840e340d4b.serveo.net";
    }

    get(path = "") {
      UrlFetchApp.fetch(`${this.#origin}/${path}`);
    }
    // throw a compiler error if the string start with "/"
    post(payload: { [key: string]: string }, path = "") {
      try {
        const response = UrlFetchApp.fetch(`${this.#origin}/${path}`, {
          method: "post",
          payload,
        });
        const responseCode = response.getResponseCode();

        if (responseCode !== 200) {
          throw new Error(
            `Recieved a error ${responseCode} response from the server.`
          );
        }

        return response.getContentText();
      } catch (error) {
        const failedToSendPostReq = `Something went wrong. Application code error: ${error}`;

        console.error(failedToSendPostReq);

        return null;
      }
    }
  }

  return new Request();
})();
