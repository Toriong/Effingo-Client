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

function handleChangeCopyDestinationFolderBtnClick(event: IGScriptAppEvent) {
	// GOAL: when the user selects a google drive folder that is being listed
	// when the user selects a google drive folder
	// -display the name of that folder onto the ui 
	// -that folder will be the copy destination 
	// -store it into the property service, when the copy folder drive gets render,
	// -display as the copy folder destination and delete that value from the 
	// -cache

	// GOAL: display all of the root folders to the user


	


	const headerTxtParagraph = CardService.newTextParagraph().setText(
		"<b>Select the copy destination folder.</b>",
	);
	const folder1Example = CardService.newTextParagraph().setText(
		"Folder 1",
	);
	const action = CardService.newAction().setFunctionName("handleOnClick")
	const folder1ExampleSelectBtn = CardService.newTextButton().setText(
		"Select",
	).setOnClickAction(action);
	const folder2ExampleChildrenFolders = CardService.newTextButton().setText(
		"View Children",
	).setOnClickAction(action);
	const headerSection =
		CardService.newCardSection().addWidget(headerTxtParagraph);
	const cardSection =
		CardService.newCardSection()
			.addWidget(folder1Example)
			.addWidget(folder1ExampleSelectBtn)
			.addWidget(folder2ExampleChildrenFolders);
	const card = CardService.newCardBuilder()
		.setName("selectCopyFolderDestination")
		.addSection(headerSection)
		.addSection(cardSection)
	const nav = CardService.newNavigation().pushCard(card.build());
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return actionResponse.build();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	// request.post({ map: JSON.stringify(event) });

	if (!event.parameters) {
		return;
	}

	const { selectedFolderToCopyParsable, copyDestinationFolder } =
		event.parameters;

	const selectedFolder: ISelectedItem =
		selectedFolderToCopyParsable && getIsParsable(selectedFolderToCopyParsable)
			? JSON.parse(selectedFolderToCopyParsable)
			: null;

	const card = CardService.newCardBuilder();
	const cardSection = CardService.newCardSection();

	const selectedFolderToCopyTxtWidget = CardService.newTextParagraph().setText(
		`<b>Selected Folder</b>: <i>${selectedFolder.title}</i>`,
	);
	const copyDestinationFolderTxt =
		typeof copyDestinationFolder === "string" &&
		getIsParsable(copyDestinationFolder)
			? `My Drive/${parseToObj<ISelectedItem>(copyDestinationFolder).title}`
			: `My Drive/${selectedFolder.title} COPY`;
	const copyDestinationFolderTxtWidget = CardService.newTextParagraph().setText(
		`Copy Folder Destination: <i>${copyDestinationFolderTxt}</i>`,
	);
	const copyFolderOpt = CardService.newTextParagraph().setText(
		"<b><u>Copy Folder Options</u></b>",
	);
	const cardServiceOptionsTxtSec =
		CardService.newCardSection().addWidget(copyFolderOpt);
	const copyFolderAction = CardService.newAction()
		.setFunctionName("handleChangeCopyDestinationFolderBtnClick")
		.setParameters({
			selectedFolderToCopyParsable: JSON.stringify(selectedFolder),
		});
	const copyFolderDestinationBtn = CardService.newTextButton()
		.setText("Change Copy Folder Destination.")
		.setBackgroundColor(COLORS.SMOKEY_GREY)
		.setOnClickAction(copyFolderAction);

	cardServiceOptionsTxtSec.addWidget(copyDestinationFolderTxtWidget);

	cardServiceOptionsTxtSec.addWidget(copyFolderDestinationBtn);

	const willCopyFoldersOnly = false;
	const willIncludesTheSamePermissions = false;
	const copyOnlyFoldersSwitch = CardService.newDecoratedText()
		.setText("Copy only the folder structure.")
		.setWrapText(true)
		.setSwitchControl(
			CardService.newSwitch()
				.setFieldName("willCopyFoldersOnly")
				.setValue(JSON.stringify(willCopyFoldersOnly))
				.setOnChangeAction(
					CardService.newAction().setFunctionName("handleSwitchChange"),
				),
		);
	const includeTheSamePermissionsSwitch = CardService.newDecoratedText()
		.setText(
			"Include the same permissions (the folders and files will be shared with the same users).",
		)
		.setWrapText(true)
		.setSwitchControl(
			CardService.newSwitch()
				.setFieldName("willCopyOnlyTheFiles")
				.setValue(JSON.stringify(willIncludesTheSamePermissions))
				.setOnChangeAction(
					CardService.newAction().setFunctionName("handleSwitchChange"),
				),
		);
	const cardHeader = CardService.newCardHeader()
		.setTitle("Copy & Permissions")
		.setSubtitle("Your selected item will appear below.")
		.setImageUrl(IMGS.TOOLS);

	cardSection.addWidget(selectedFolderToCopyTxtWidget);
	cardServiceOptionsTxtSec.addWidget(includeTheSamePermissionsSwitch);
	cardServiceOptionsTxtSec.addWidget(copyOnlyFoldersSwitch);

	card.setHeader(cardHeader);

	card.addSection(cardSection);

	card.addSection(cardServiceOptionsTxtSec);

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
