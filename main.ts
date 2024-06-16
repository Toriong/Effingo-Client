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
	apiServices.post({ map: JSON.stringify(event) });

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

	selectedGdriveItemSection.addWidget(headerTxtParagraph);
	selectedItemsParsed = selectedItemsParsed.length
		? selectedItemsParsed.filter((item) => item.mimeType.includes("folder"))
		: [];

	if (!selectedItemsParsed?.length) {
		selectedGdriveItemSection.addWidget(divider);

		const card = CardService.newCardBuilder()
			.addSection(selectedGdriveItemSection)
			.build();
		const nav = CardService.newNavigation().popToRoot().updateCard(card);
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	const card = CardService.newCardBuilder();

	card.addSection(selectedGdriveItemSection);

	let selectedItems = selectedItemsParsed.map((item) => ({
		...item,
		cardSection: CardService.newCardSection(),
	}));
	// create a card section for folder
	// go through the value in the array of selectedItems, and create a cardSection
	// -implement the map method on selectedItems, and return the CardSection for the field
	// after the array is created, loop through using for of and add the widgets
	selectedItems = selectedItems.map((item) => {
		const { title, cardSection } = item;
		const titleWidget = CardService.newTextParagraph().setText(title);

		cardSection.addWidget(titleWidget);
		cardSection.addWidget(deleteBtn);
		// cardSection.addWidget(divider);

		return { ...item, cardSection: cardSection };
	});

	apiServices.post({ map: JSON.stringify(selectedItems) });

	for (const { cardSection } of selectedItems) {
		card.addSection(cardSection);
	}

	// card.addSection(selectedItems[0].cardSection);

	const nav = CardService.newNavigation().popToRoot().pushCard(card.build());
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav).setStateChanged(true);

	return card.build();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
