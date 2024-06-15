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
	const { createHomePgCards } = HomeCards;
	// SET THE local storage to determine where the user is at in the application
	// const url = "https://b7985f7eb0fe9981e5625226ce34da80.serveo.net";
	const currentCardPg = getCacheVal<TCardPgs>("currentCardPg");

	// UrlFetchApp.fetch(url, {
	// 	method: "post",
	// 	payload: {
	// 		map: currentCardPg,
	// 	},
	// });

	if (!currentCardPg || currentCardPg === "home") {
		const nav = CardService.newNavigation().popToRoot();

		return nav;
	}

	// notes:
	// -present the folders that were selected by the user
	// -the user clicks on a folder
	// -call 'renderCopyFolderCardPg'
}

function setCurrentUserCardPg(currentPg: TCardPgs) {
	const userProperties = PropertiesService.getUserProperties();
	const currentUserCardPg: {
		[key in TSelectedUserPropertyKey<"currentCardPg">]: string;
	} = { currentCardPg: currentPg };

	userProperties.setProperties(currentUserCardPg);
}

function setCurrentUserCardPgOnClick(event: IGScriptAppEvent) {
	if (
		!event.parameters?.currentCardPg &&
		typeof event.parameters?.currentCardPg !== "string"
	) {
		return;
	}

	const userProperties = PropertiesService.getUserProperties();
	const currentUserCardPg: {
		[key in TSelectedUserPropertyKey<"currentCardPg">]: string;
	} = { currentCardPg: event.parameters.currentCardPg };

	userProperties.setProperties(currentUserCardPg);
}

function getCacheVal<TData>(cacheKeyName: TUserPropertyKeys): TData | null {
	const userProperties = PropertiesService.getUserProperties();

	const cacheVal = userProperties.getProperty(cacheKeyName);

	if (!cacheVal) {
		return null;
	}
	return cacheVal as TData;
}
