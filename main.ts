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
	let selectedItemsParsed: ISelectedItem[] =
		selectedFoldersParsable && getIsParsable(selectedFoldersParsable)
			? JSON.parse(selectedFoldersParsable)
			: [];

	selectedGdriveItemSection.addWidget(headerTxtParagraph).addWidget(divider);
	selectedItemsParsed = selectedItemsParsed.length
		? selectedItemsParsed.filter((item) => item.mimeType.includes("folder"))
		: [];

	if (!selectedItemsParsed?.length) {
		const card = CardService.newCardBuilder()
			.addSection(selectedGdriveItemSection)
			.build();
		const nav = CardService.newNavigation().popToRoot().updateCard(card);
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	const card = CardService.newCardBuilder();
	let selectedItems = selectedItemsParsed.map((item) => ({
		...item,
		cardSection: CardService.newCardSection(),
	}));
	// create a card section for folder
	// go through the value in the array of selectedItems, and create a cardSection
	// -implement the map method on selectedItems, and return the CardSection for the field
	// after the array is created, loop through using for of and add the widgets
	selectedItems = selectedItems.map(({ title, mimeType, cardSection }) => {
		cardSection.addWidget;
	});

	for (const { title, mimeType, cardSection } of selectedItems) {
		if (!mimeType.includes("folder")) {
			continue;
		}

		const titleWidget = CardService.newTextParagraph().setText(title);

		cardSection.addWidget(titleWidget);
		cardSection.addWidget(deleteBtn);
		cardSection.addWidget(divider);
	}

	return card;
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
