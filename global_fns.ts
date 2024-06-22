//FOR THE HOME CARD FUNCTIONS
function handleCopyFolderStructureBtn() {}

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

function displayFolderCards() {
  const { createHeader } = CardServices;
  const copyFolderStructureHeader = createHeader(
    "Structure copy",
    IMGS.ICON_FOLDER_STRUCTURE,
    "copy_folder_structure_icon",
    CardService.ImageStyle.SQUARE,
    "Copy only the folder's sub folders."
  );
  const copyFolderStructureOptCard = CardService.newCardBuilder()
    .setHeader(copyFolderStructureHeader)
    .build();
  const deepCopyHeader = createHeader(
    "Deep Copy",
    IMGS.ICON_COPY_FOLDER_OPT,
    "deep_copy_icon",
    CardService.ImageStyle.SQUARE,
    "Copy folders and their contents."
  );
  const deepCopyCard = CardService.newCardBuilder()
    .setHeader(deepCopyHeader)
    .build();
  const navigation = CardService.newNavigation()
    .pushCard(copyFolderStructureOptCard)
    .pushCard(deepCopyCard);

  const actionResponse = CardService.newActionResponseBuilder()
    .setNavigation(navigation)
    .build();

  return actionResponse;
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
  const copyFoldersInfo =
    getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  let copyFolderDestinationName = `${event.drive.activeCursorItem?.title} COPY`;

  if (
    copyFoldersInfo &&
    event.drive.activeCursorItem?.id &&
    copyFoldersInfo[event.drive.activeCursorItem.id]
  ) {
    copyFolderDestinationName =
      copyFoldersInfo[event.drive.activeCursorItem.id]
        .copyDestinationFolderName;
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

  userPropertyKeys.forEach((key) => {
    userProperties.deleteProperty(key);
  });
}

function getUserProperty(cacheKeyName: TUserPropertyKeys) {
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

  if (!targetVal || getIsParsable(targetVal)) {
    return null;
  }

  return JSON.parse(targetVal);
}

const request = (() => {
  class Request {
    #origin: string;

    constructor() {
      this.#origin = "https://0cb915414e4a331e4c3979851f78c690.serveo.net";
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
