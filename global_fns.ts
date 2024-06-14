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

function handleOnDriveItemsSelected(event: IGdriveItemSelectedEvent) {
	// SET THE local storage to determine where the user is at in the application
	const url = "https://776358c34440d0285e0bbe28061ed078.serveo.net";
	const n = CardService.newNavigation().popCard();
	const userCache = CacheService.getUserCache();
	const x = userCache.get("isUserOnCopyPg");



	UrlFetchApp.fetch(url, {
		method: "post",
		payload: {
			map: JSON.stringify(x),
		},
	});

	// CASE: the user is not on copy folder page.

	// PRESENT THE CURRENT PAGE TO THE USER.
}

function setCurrentUserCardPg(currentPg: TCardPgs) {
	const userCache = CacheService.getUserCache();

	userCache.put("currentPgCard", currentPg);
}

function getCacheVal(cacheKeyName: TCacheKeyName){
	const userCache = CacheService.getUserCache();

	return userCache.get(cacheKeyName);
}
