/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	const { createHomePgCards } = HomeCards;

	setUserProperty("isOnItemSelectedResultPg", false);

	return createHomePgCards();
}

function deleteGdriveItemSelection() {
	// store all selected items into the user property
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	if (!event.parameters) {
		return;
	}

	const { headerTxt, hasIsOnItemSelectedResultPgBeenSet } = event.parameters;

	if (!headerTxt) {
		return;
	}

	if (!hasIsOnItemSelectedResultPgBeenSet) {
		setUserProperty("isOnItemSelectedResultPg", true);
	}

	const selectedGdriveItemSection = CardService.newCardSection();
	const cardAction = CardService.newAction();

	cardAction.setFunctionName("deletGdriveItemSelectionn");

	const deleteBtn = CardService.newImageButton()
		.setIconUrl(IMGS.ICON_BIN)
		.setOnClickAction(cardAction);
	const divider = CardService.newDivider();

	if (!getUserProperty("headerTxtForGdriveSelectedResultsPg")) {
		setUserProperty("headerTxtForGdriveSelectedResultsPg", headerTxt);
	}

	const headerTxtParagraph = CardService.newTextParagraph().setText(headerTxt);
	const selectedItems = event.drive.selectedItems;

	selectedGdriveItemSection.addWidget(headerTxtParagraph);

	if (!selectedItems?.length) {
		event.drive.selectedItems = [];
		event.drive.activeCursorItem = null;
		const card = CardService.newCardBuilder()
			.addSection(selectedGdriveItemSection)
			.build();
		const nav = CardService.newNavigation().popToRoot().updateCard(card);
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	for (const { title, mimeType } of selectedItems) {
		if (!mimeType.includes("folder")) {
			continue;
		}

		const selectedGdriveItemName =
			CardService.newTextParagraph().setText(title);

		selectedGdriveItemSection.addWidget(selectedGdriveItemName);
		selectedGdriveItemSection.addWidget(deleteBtn);
		selectedGdriveItemSection.addWidget(divider);
	}

	const card = CardService.newCardBuilder()
		.addSection(selectedGdriveItemSection)
		.build();
	const nav = CardService.newNavigation().updateCard(card);
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return actionResponse.build();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
