/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	return HomeCards.createHomePgCards();
}

function deleteGdriveItemSelection() {
	// store all selected items into the user property
}

// for the ui, give the user two options:
// -text input search
// -or show all available folders that the user can choose from

// DO FIRST: show all available folders to the user, and perform a pagination.
// WHAT TO SEND TO THE SERVER:
// -the page token for the listing function on the server
// -get all of the root folders
// -if the user clicks on the root folder, then get the immediate children folders for that folder

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
		"<b>Select the copy destination folder.</b>",
	);
	// when the user clicks on the View Children Button, have the following to occur:
	// -get the children for that specific folder
	// -test how the ui will be displayed
	const action = CardService.newAction().setFunctionName("handleOnClick");
	const testFolderASectionTitle =
		CardService.newTextParagraph().setText("Folder A");
	const testFolderAViewChildrenBtn = CardService.newTextButton()
		.setText("View Children")
		.setBackgroundColor(COLORS.SMOKEY_GREY)
		.setOnClickAction(action);
	const testFolderASelectedFolderBtn = CardService.newTextButton()
		.setText("Select Folder")
		.setOnClickAction(action);
	const testFolderBSectionTitle =
		CardService.newTextParagraph().setText("Folder A");
	const testFolderBViewChildrenBtn = CardService.newTextButton()
		.setText("View Children")
		.setBackgroundColor(COLORS.SMOKEY_GREY)
		.setOnClickAction(action);
	const testFolderBSelectedFolderBtn = CardService.newTextButton()
		.setText("Select Folder")
		.setOnClickAction(action);
	const headerSection =
		CardService.newCardSection().addWidget(headerTxtParagraph);
	const testCardSection1 = CardService.newCardSection();
	const testCardSection2 = CardService.newCardSection();

	testCardSection1.addWidget(testFolderASectionTitle);

	testCardSection1.addWidget(testFolderAViewChildrenBtn);

	testCardSection1.addWidget(testFolderASelectedFolderBtn);

	testCardSection2.addWidget(testFolderBSectionTitle);

	testCardSection2.addWidget(testFolderBViewChildrenBtn);

	testCardSection2.addWidget(testFolderBSelectedFolderBtn);

	// folder:
	// view children
	// select folder
	// each folder will be a section
	const footer = CardService.newFixedFooter().setPrimaryButton(
		CardService.newTextButton()
			.setText("Back To Selected Folder.")
			.setOnClickAction(action),
	);
	const card = CardService.newCardBuilder()
		.addSection(headerSection)
		.addSection(testCardSection1)
		.addSection(testCardSection2)
		.setFixedFooter(footer);
	const nav = CardService.newNavigation().pushCard(card.build());
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return card.build();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	request.post({ map: JSON.stringify(event) });

	if (!event.parameters) {
		return;
	}

	const {
		hasIsOnItemSelectedResultPgBeenSet,
		selectedFolderToCopyParsable,
		copyDestinationFolder,
	} = event.parameters;

	if (!hasIsOnItemSelectedResultPgBeenSet) {
		setUserProperty("isOnItemSelectedResultPg", true);
	}

	const headerSection = CardService.newCardSection();
	const divider = CardService.newDivider();
	const headerTxtParagraph = CardService.newTextParagraph().setText(
		"<b>The selected folder to copy will appear below: </b>",
	);
	const selectedFolder: ISelectedItem =
		selectedFolderToCopyParsable && getIsParsable(selectedFolderToCopyParsable)
			? JSON.parse(selectedFolderToCopyParsable)
			: null;

	headerSection.addWidget(headerTxtParagraph);

	if (!selectedFolder) {
		headerSection.addWidget(divider);

		const card = CardService.newCardBuilder().addSection(headerSection).build();
		const nav = CardService.newNavigation().pushCard(card);
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
		.setBackgroundColor(COLORS.SMOKEY_GREY)
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

	const nav = CardService.newNavigation().pushCard(card.build());
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
