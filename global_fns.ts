//FOR THE HOME CARD FUNCTIONS
function handleCopyFolderStructureBtn() {}

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
	const isOnItemSelectedResultPgStr = getUserProperty(
		"isOnItemSelectedResultPg",
	);

	if (
		!isOnItemSelectedResultPgStr ||
		(getIsBool(isOnItemSelectedResultPgStr) &&
			!JSON.parse(isOnItemSelectedResultPgStr))
	) {
		const nav = CardService.newNavigation().popToRoot();

		return nav;
	}

	if (!event.drive.activeCursorItem?.mimeType.includes("folder")) {
		return;
	}

	const selectedFoldersStr = getUserProperty("selectedFolders");
	const headerTxt = getUserProperty("headerTxtForGdriveSelectedResultsPg");
	const selectedFolders: ISelectedItem[] =
		selectedFoldersStr && getIsParsable(selectedFoldersStr)
			? JSON.parse(selectedFoldersStr)
			: [];

	selectedFolders.push(event.drive.activeCursorItem);

	setUserProperty("selectedFolders", selectedFolders);

	// CASE: 'selectedFoldersStr' is null
	// create a new array that will hold of the selcted items and put the selected gdrive item
	// -into that array

	// CASE: 'selectedFoldersStr' is not null, it is a string
	// parse in order to get the saved gdrive items that were saved, push the selected item

	if (!event.parameters) {
		event.parameters = {};
	}

	Object.assign(event.parameters, {
		hasIsOnItemSelectedResultPgBeenSet: true,
		headerTxt: JSON.parse(headerTxt as string),
		selectedFoldersParsable: JSON.stringify(selectedFolders),
	});

	// UrlFetchApp.fetch("https://sixty-bushes-shine.loca.lt/", {
	// 	payload: { map: JSON.stringify(event) },
	// });

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





function getUserProperty(cacheKeyName: TUserPropertyKeys) {
	const userProperties = PropertiesService.getUserProperties();
	const cacheVal = userProperties.getProperty(cacheKeyName);

	if (!cacheVal) {
		return null;
	}
	return cacheVal;
}
const apiServices = (() => {
	class API_SERVICES {
		#origin: string;

		constructor() {
			this.#origin = "https://angry-moles-dream.loca.lt";
		}
		get(path = "") {
			UrlFetchApp.fetch(`${this.#origin}/${path}`);
		}
		post(payload: { [key: string]: string }, path = "") {
			UrlFetchApp.fetch(`${this.#origin}/${path}`, { payload });
		}
	}

	return new API_SERVICES();
})();
