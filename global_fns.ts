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
	const url = "https://b7985f7eb0fe9981e5625226ce34da80.serveo.net";
	const currentPgCard = getCacheVal<TCardPgs>("currentPgCard");

	UrlFetchApp.fetch(url, {
		method: "post",
		payload: {
			map: currentPgCard,
		},
	});

	if (!currentPgCard || currentPgCard === "home") {
		const nav = CardService.newNavigation().popToRoot();

		return nav;
	}

	// notes:
	// -set the current page to the folderCopy
	// -get the user's location
	// -if the user is on the copy folder structure

	// GOAL: take the user to the copy folders page from the copy folders options page.

	// GOAL: display the selected folders to the user, when the user is on the copy folder page

	// if the user is on the share folders ui, then display the selected folders and files as
	// -cards.
}

function setCurrentUserCardPg(currentPg: TCardPgs) {
	const userProperties = PropertiesService.getUserProperties();
	const currentUserCardPg: {
		[key in TSelectedUserPropertyKey<"currentPgCard">]: string;
	} = { currentPgCard: currentPg };

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
