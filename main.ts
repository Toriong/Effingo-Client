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

// GOAL: create two functions:
// function 1: will handle the first render of the page

// function 2: will update the results page of clicked gdrive items

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	if (!event.parameters) {
		return;
	}

	const {
		headerTxt,
		hasIsOnItemSelectedResultPgBeenSet,
		selectedFoldersParsable,
	} = event.parameters;

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

	const headerTxtParagraph = CardService.newTextParagraph().setText(
		`<b>${headerTxt}</b>`,
	);
	const selectedItems: ISelectedItem[] =
		selectedFoldersParsable && getIsParsable(selectedFoldersParsable)
			? JSON.parse(selectedFoldersParsable)
			: [];

	selectedGdriveItemSection.addWidget(headerTxtParagraph).addWidget(divider);

	if (!selectedItems?.length) {
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

		const titleWidget = CardService.newTextParagraph().setText(title);

		selectedGdriveItemSection.addWidget(titleWidget);
		selectedGdriveItemSection.addWidget(deleteBtn);
		selectedGdriveItemSection.addWidget(divider);
	}

	const card = CardService.newCardBuilder()
		.addSection(selectedGdriveItemSection)
		.build();

	return card;
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
