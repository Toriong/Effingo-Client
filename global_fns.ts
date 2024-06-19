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
		"yo thereeee!.",
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
		"Copy only the folder's sub folders.",
	);
	const copyFolderStructureOptCard = CardService.newCardBuilder()
		.setHeader(copyFolderStructureHeader)
		.build();
	const deepCopyHeader = createHeader(
		"Deep Copy",
		IMGS.ICON_COPY_FOLDER_OPT,
		"deep_copy_icon",
		CardService.ImageStyle.SQUARE,
		"Copy folders and their contents.",
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
	request.post({ map: JSON.stringify(event) });

	// MAIN GOAL: the user has selcted the following for copying a folder:
	// -copy just the folders
	// -copy the same permissions

	// CASE: the user selects a folder to copy
	// MAIN GOAL: store the id of the folder into the user property service as the key
	// the following is stored in the user property service:
	// { [the folder id]: { folder name, options: { willCopyFoldersOnly: bool, willCopySamePermissions: bool }, mimeType, and the rest of the interface  } }

	// use 'clickedGdriveItems' property to get the target gdrive item that was select via its id

	// using the id of the select gdrive item, get the target gdrive

	const selectedGdriveItemProperty = getUserPropertyParsed<TClickedGdriveItems>(
		"selectedGdriveItems",
	);
	const isChangingTheCopyFolderDestinationStr = getUserProperty(
		"isChangingTheCopyFolderDestination",
	);

	const isChangingTheCopyFolderDestination =
		isChangingTheCopyFolderDestinationStr &&
		getIsParsable(isChangingTheCopyFolderDestinationStr)
			? JSON.parse(isChangingTheCopyFolderDestinationStr)
			: null;
	const headerTxt = getUserProperty("headerTxtForGdriveSelectedResultsPg");

	if (!event.parameters) {
		event.parameters = {};
	}

	const selctedGdriveItemKey = event.drive?.activeCursorItem?.id ?? "";

	if (
		isChangingTheCopyFolderDestination !== null &&
		isChangingTheCopyFolderDestination &&
		selectedGdriveItemProperty?.[selctedGdriveItemKey]
	) {
		Object.assign(event.parameters, {
			hasIsOnItemSelectedResultPgBeenSet: true,
			headerTxt: JSON.parse(headerTxt as string),
			selectedFolderToCopyParsable:
				selectedGdriveItemProperty[selctedGdriveItemKey],
			copyDestinationFolder: JSON.stringify(event.drive.activeCursorItem),
		});

		setUserProperty("isChangingTheCopyFolderDestination", false);
		setUserProperty("selectedFolderToCopyParsable", null);

		return renderCopyFolderCardPg(event);
	}

	Object.assign(event.parameters, {
		hasIsOnItemSelectedResultPgBeenSet: true,
		headerTxt: JSON.parse(headerTxt as string),
		selectedFolderToCopyParsable: JSON.stringify(event.drive.activeCursorItem),
	});

	return renderCopyFolderCardPg(event);
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

function setIsUserOnItemSelectedResultsPgOnClick(event: IGScriptAppEvent) {
	const isOnItemSelectedResultPg = event.parameters?.isOnItemSelectedResultPg;

	if (
		!isOnItemSelectedResultPg ||
		(!isOnItemSelectedResultPg &&
			typeof (isOnItemSelectedResultPg !== "string")) ||
		(typeof isOnItemSelectedResultPg === "string" &&
			!getIsBool(isOnItemSelectedResultPg))
	) {
		return;
	}

	const userProperties = PropertiesService.getUserProperties();
	const currentUserCardPg: {
		[key in TSelectedUserPropertyKey<"isOnItemSelectedResultPg">]: string;
	} = { isOnItemSelectedResultPg: isOnItemSelectedResultPg };

	userProperties.setProperties(currentUserCardPg);
}

function setUserProperty<
	TDataA extends TUserPropertyKeys,
	TDataB extends TDynamicCacheVal<TDataA>,
>(keyName: TDataA, val: TDataB) {
	const userProperties = PropertiesService.getUserProperties();
	userProperties.setProperty(keyName, JSON.stringify(val));
}

function resetUserProperties() {
	const userProperties = PropertiesService.getUserProperties();

	userProperties.deleteAllProperties();
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
	cacheKeyName: TUserPropertyKeys,
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
			this.#origin = "https://brown-colts-sneeze.loca.lt";
		}
		get(path = "") {
			UrlFetchApp.fetch(`${this.#origin}/${path}`);
		}
		post(payload: { [key: string]: string }, path = "") {
			UrlFetchApp.fetch(`${this.#origin}/${path}`, { payload });
		}
	}

	return new Request();
})();
