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
	// request.post({ map: JSON.stringify(event.drive.selectedItems) });
	const isChangingTheCopyFolderDestinationStr = getUserProperty(
		"isChangingTheCopyFolderDestination",
	);
	const selectedFolderToCopyParsable = getUserProperty(
		"selectedFolderToCopyParsable",
	);
	const isChangingTheCopyFolderDestination =
		isChangingTheCopyFolderDestinationStr &&
		getIsParsable(isChangingTheCopyFolderDestinationStr)
			? JSON.parse(isChangingTheCopyFolderDestinationStr)
			: null;

	// GOAL: store the value for 'event.drive.activeCursorItem' into 'event.parameters.copyDestinationFolder' when

	// EXECUTION PLAN:
	// execute renderCopyFolderCardPg(event)
	// -set 'isChangingTheCopyFolderDestination' to false
	// -set selectedFolderToCopyParsable to a empty string
	// -pass the below value for event.parameters.selectedFolderToCopyParsable
	// -get the value for selectedFolderToCopyParsable from the UserProperty state
	// -the value of event.drive.activeCursorItem stored for 'event.parameters.copyDestinationFolder'
	// -isChangingTheCopyFolderDestination is true

	// if isChangingTheCopyFolderDestination is true, then the do following:
	// set the field of 'selectedFolderToCopyParsable' of the parameters objecte to the value stored
	// -for 'selectedFolderToCopyParsable' for the user properties state

	// GOAL #A: when the user clicks on the "Change Copy Folder Destination" present the ui without the back button

	// GOAL #B: when the user clicks on copy folder destination, present the ui again with the copy folder destination updated
	// -The folder selected must not match the current folder that was selected.
	// -store the following to the userProperty service:  isChangingTheCopyFolderDestination = true

	// IN ORDER TO CHANGE THE COPY DESTINATION FOLDER, PRESENT THE FOLLOWING BUTTON TO THE USER:
	// CHANGE COPY DESTINATION

	// when clicked, have the following to occur:
	// -change the text to CLICK COPY DESTINATION FOLDER
	// -store the following property: isChangingTheCopyFolderDestination: true

	// thet next click for a folder, pass the following parameter for the parameter object:
	// -copyDestinationFolder: the ISelectItem folder
	// -change 'isChangingTheCopyFolderDestination' to false

	const headerTxt = getUserProperty("headerTxtForGdriveSelectedResultsPg");

	if (!event.parameters) {
		event.parameters = {};
	}

	if (
		isChangingTheCopyFolderDestination !== null &&
		isChangingTheCopyFolderDestination &&
		selectedFolderToCopyParsable &&
		getIsParsable(selectedFolderToCopyParsable)
	) {
		Object.assign(event.parameters, {
			hasIsOnItemSelectedResultPgBeenSet: true,
			headerTxt: JSON.parse(headerTxt as string),
			selectedFolderToCopyParsable: selectedFolderToCopyParsable,
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
const request = (() => {
	class Request {
		#origin: string;

		constructor() {
			this.#origin = "https://eight-mugs-report.loca.lt";
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
