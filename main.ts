/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	resetUserProperties();

	setUserProperty("isOnItemSelectedResultPg", false);

	return HomeCards.createHomePgCards();
}

function deleteGdriveItemSelection() {
	// store all selected items into the user property
}

function handleChangeCopyDestinationFolderBtn(event: IGScriptAppEvent) {
	if (!event.parameters?.selectedFolderToCopyParsable) {
		return;
	}

	const { selectedFolderToCopyParsable } = event.parameters;

	if (
		!getIsParsable(selectedFolderToCopyParsable) &&
		parseToObj<ISelectedItem>(selectedFolderToCopyParsable) === null
	) {
		return;
	}

	const selectedFolderToCopy = parseToObj<ISelectedItem>(
		event.parameters.selectedFolderToCopyParsable,
	);

	setUserProperty("isChangingTheCopyFolderDestination", true);
	setUserProperty("selectedFolderToCopyParsable", selectedFolderToCopy);
	const headerTxtParagraph = CardService.newTextParagraph().setText(
		`<b>Select the copy desintation folder. It must not be '${selectedFolderToCopy.title}' and it must be empty.</b>`,
	);
	const headerSection = CardService.newCardSection();

	headerSection.addWidget(headerTxtParagraph);

	const card = CardService.newCardBuilder().addSection(headerSection).build();
	const nav = CardService.newNavigation().popToRoot().updateCard(card);
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return actionResponse.build();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	if (!event.parameters) {
		return;
	}

	const {
		headerTxt,
		hasIsOnItemSelectedResultPgBeenSet,
		selectedFolderToCopyParsable,
		copyDestinationFolder,
	} = event.parameters;

	// apiServices.post({ map: selectedFolderToCopyParsable ?? "" });

	if (!headerTxt) {
		return;
	}

	if (!hasIsOnItemSelectedResultPgBeenSet) {
		setUserProperty("isOnItemSelectedResultPg", true);
	}

	const headerSection = CardService.newCardSection();
	const divider = CardService.newDivider();

	if (!getUserProperty("headerTxtForGdriveSelectedResultsPg")) {
		setUserProperty("headerTxtForGdriveSelectedResultsPg", headerTxt);
	}

	const headerTxtParagraph = CardService.newTextParagraph().setText(
		`<b>${headerTxt}</b>`,
	);
	const selectedFolder: ISelectedItem =
		selectedFolderToCopyParsable && getIsParsable(selectedFolderToCopyParsable)
			? JSON.parse(selectedFolderToCopyParsable)
			: null;

	headerSection.addWidget(headerTxtParagraph);

	if (!selectedFolder) {
		headerSection.addWidget(divider);

		const card = CardService.newCardBuilder().addSection(headerSection).build();
		const nav = CardService.newNavigation().popToRoot().updateCard(card);
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	const deleteBtnCardAction = CardService.newAction();

	deleteBtnCardAction.setFunctionName("deletGdriveItemSelectionn");

	const deleteBtn = CardService.newImageButton()
		.setIconUrl(IMGS.ICON_BIN)
		.setOnClickAction(deleteBtnCardAction);
	const changeCopyDestinationFolderBtnAction = CardService.newAction();

	// create a function for this logic
	changeCopyDestinationFolderBtnAction
		.setFunctionName("handleChangeCopyDestinationFolderBtn")
		.setParameters({
			selectedFolderToCopyParsable: JSON.stringify(selectedFolder),
		});

	const changeCopyDestinationFolderBtn = CardService.newTextButton()
		.setText("Change The Copy Destination Folder.")
		.setBackgroundColor("#F0F0F0")
		.setOnClickAction(changeCopyDestinationFolderBtnAction);
	const card = CardService.newCardBuilder();
	const cardSection = CardService.newCardSection();

	card.addSection(headerSection);

	const selectedFolderToCopyTxtWidget = CardService.newTextParagraph().setText(
		`<b>Selected Folder</b>: <i>${selectedFolder.title}</i>`,
	);
	const copyDestinationFolderTxt =
		typeof copyDestinationFolder === "string" &&
		getIsParsable(copyDestinationFolder)
			? `My Drive/${parseToObj<ISelectedItem>(copyDestinationFolder).title}`
			: `My Drive/${selectedFolder.title} COPY`;
	const copyDestinationFolderTxtWidget = CardService.newTextParagraph().setText(
		`<b>Copy Folder Destination</b>: <i>${copyDestinationFolderTxt}</i>`,
	);

	cardSection.addWidget(selectedFolderToCopyTxtWidget);
	cardSection.addWidget(copyDestinationFolderTxtWidget);

	if (!copyDestinationFolder) {
		const headerTxtParagraph = CardService.newTextParagraph().setText(
			"*We will create this folder for you.",
		);
		cardSection.addWidget(headerTxtParagraph);
	}

	cardSection.addWidget(divider);
	cardSection.addWidget(changeCopyDestinationFolderBtn);
	cardSection.addWidget(deleteBtn);
	card.addSection(cardSection);

	return card.build();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
