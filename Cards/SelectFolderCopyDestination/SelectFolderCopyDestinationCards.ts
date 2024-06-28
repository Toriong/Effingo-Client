function renderSelectCopyFolderDestinationCardPg(event: IGScriptAppEvent) {
	const { getIsParsable, getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;

	if (
		!event.parameters?.selectedFolderToCopyParsable ||
		!getIsParsable(event.parameters?.selectedFolderToCopyParsable)
	) {
		return;
	}

	// WHAT IS HAPPENING, BUG:
	// when all of the folders that the user can view has been retrieved from the backend
	// -and the next page of folders are displayed to the user, and if the user goes back to the previous
	// -page, only the first ten folders are displayed to the user

	// NEXT STEPS: check how you are saving the folders into the user property service object

	let {
		gdriveNextPageToken,
		displayedSelectableFolders: displayedSelectableFoldersStringified,
		selectedFolderToCopyParsable,
		cardUpdateMethod,
	} = event.parameters;
	const selectedFolderToCopy = JSON.parse(
		selectedFolderToCopyParsable,
	) as ISelectedItem;
	let selectableCopyFolderDestinations =
		getUserPropertyParsed<TSelectableCopyFolderDestinations>(
			"selectableCopyFolderDestinations",
		) ?? {};
	const selectableCopyFolderDestinationsForTargetFolder =
		selectableCopyFolderDestinations[selectedFolderToCopy.id] ??
		({
			currentIndex: 0,
			displayedSelectableFoldersAll: [],
		} as TTargetSelectableFolder);
	const { displayedSelectableFoldersAll, currentIndex, stringifiedCard } =
		selectableCopyFolderDestinationsForTargetFolder;
	const headerTxtParagraph = CardService.newTextParagraph().setText(
		"<b>Select the copy destination folder: </b>",
	);
	const headerSection =
		CardService.newCardSection().addWidget(headerTxtParagraph);
	const card = CardService.newCardBuilder()
		.setName(`selectCopyFolderDestination ${currentIndex}`)
		.addSection(headerSection);
	const storedCard = stringifiedCard ? JSON.parse(stringifiedCard) : null;
	const displayedSelectableFolders = getIsParsable(
		displayedSelectableFoldersStringified,
	)
		? (JSON.parse(
				displayedSelectableFoldersStringified,
			) as TGdriveItemsFromServer[])
		: [];

	// get the next gdrive items to be presented to the user
	// determine if the user has reached the total amount of folders to be presented to the user
	// CASE: there are more than 30 folders for a givene sub folder
	// send the parentFolderId to the server to get the rest of folders for the user
	const getGdriveItemsResult = apiServices.getGdriveItems<{
		gdrive_items: TGdriveItemsFromServer[];
		gdrive_next_page_token: string;
	}>(
		event.parameters.parentFolderId || "root",
		5,
		5,
		gdriveNextPageToken ?? "",
	);

	// There are no child folders present for the selected gdrive folder
	if (
		getGdriveItemsResult.errMsg ||
		!getGdriveItemsResult?.data?.gdrive_items?.length
	) {
		const txt = CardService.newTextParagraph().setText(
			`${getGdriveItemsResult.errMsg}` ?? "No folders are present.",
		);
		const txtSection = CardService.newCardSection().addWidget(txt);

		card.addSection(txtSection);

		const nav = CardService.newNavigation().pushCard(card.build());
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	displayedSelectableFolders.push(...getGdriveItemsResult.data.gdrive_items);

	selectableCopyFolderDestinationsForTargetFolder.displayedSelectableFoldersAll[
		currentIndex
	] = displayedSelectableFolders;

	selectableCopyFolderDestinations = {
		...selectableCopyFolderDestinations,
		[selectedFolderToCopy.id]: selectableCopyFolderDestinationsForTargetFolder,
	};

	setUserProperty(
		"selectableCopyFolderDestinations",
		selectableCopyFolderDestinations,
	);

	for (const folder of displayedSelectableFolders) {
		const folderName = CardService.newTextParagraph().setText(folder.name);
		const viewChildrenBtnAction = CardService.newAction()
			.setFunctionName("renderSelectCopyFolderDestinationCardPg")
			.setParameters({
				parentFolderId: folder.id,
				selectedFolderToCopyParsable: selectedFolderToCopyParsable,
			});
		const selectBtnAction = CardService.newAction()
			.setFunctionName("handleSelectFolderBtnClick")
			.setParameters({
				copyDestinationFolderId: folder.id,
				selectedFolderToCopyParsable: selectedFolderToCopyParsable,
				// put the path to the target folder here
				copyDestinationFolderName: folder.name,
			});
		const selectFolderForCopyDestinationBtn = CardService.newTextButton()
			.setText("Select")
			.setOnClickAction(selectBtnAction);
		const viewFolderChildrenBtn = CardService.newTextButton()
			.setText("View Children")
			.setBackgroundColor(COLORS.SMOKEY_GREY)
			.setOnClickAction(viewChildrenBtnAction);
		const folderCardSection = CardService.newCardSection()
			.addWidget(folderName)
			.addWidget(selectFolderForCopyDestinationBtn)
			.addWidget(viewFolderChildrenBtn);

		card.addSection(folderCardSection);
	}

	const hasReachedSelectableFoldersMaxForCard =
		displayedSelectableFolders.length === 30;

	if (
		getGdriveItemsResult.data.gdrive_next_page_token &&
		!hasReachedSelectableFoldersMaxForCard
	) {
		// stringify the cards and pass it as a parameter for the object below
		const parameters: TSetParametersArg = {
			selectedFolderToCopyParsable,
			displayedSelectableFolders: JSON.stringify(displayedSelectableFolders),
			gdriveNextPageToken: getGdriveItemsResult.data.gdrive_next_page_token,
			willUpdateCard: JSON.stringify(true),
		};
		const seeMoreFolderBtnAction = CardService.newAction()
			.setFunctionName("renderSelectCopyFolderDestinationCardPg")
			.setParameters(parameters);
		const viewMoreFoldersBtn = CardService.newTextButton()
			.setText("See More Folders")
			.setOnClickAction(seeMoreFolderBtnAction);
		const viewMoreFolderSection =
			CardService.newCardSection().addWidget(viewMoreFoldersBtn);

		card.addSection(viewMoreFolderSection);
	}

	gdriveNextPageToken = getGdriveItemsResult.data?.gdrive_next_page_token ?? "";
	const prevBtnParameters: Partial<TMakeTypeValsIntoStr<TParameters>> = {
		folderToCopyId: selectedFolderToCopy.id,
	};
	// pop the current card, then with the new card on the stack, update it by not showing the see more button
	const prevBtnAction = CardService.newAction()
		.setFunctionName("handlePrevBtnClick")
		.setParameters(prevBtnParameters);
	const prevBtn = CardService.newTextButton()
		.setText("Prev Pg")
		.setOnClickAction(prevBtnAction)
		.setDisabled(currentIndex === 0);
	const nextBtnParameters: Partial<TMakeTypeValsIntoStr<TParameters>> = {
		gdriveNextPageToken,
		selectedFolderToCopyParsable,
	};
	const nextFolderPgBtnClickAction = CardService.newAction()
		.setFunctionName("handleNextFolderPgBtnClick")
		.setParameters(nextBtnParameters);
	const nextBtn = CardService.newTextButton()
		.setText("Next Pg")
		.setOnClickAction(nextFolderPgBtnClickAction)
		.setDisabled(
			!hasReachedSelectableFoldersMaxForCard &&
				currentIndex === displayedSelectableFoldersAll.length - 1 &&
				!!gdriveNextPageToken,
		);
	const footer = CardService.newFixedFooter()
		.setSecondaryButton(prevBtn)
		.setPrimaryButton(nextBtn);

	card.setFixedFooter(footer);

	if (!hasReachedSelectableFoldersMaxForCard && cardUpdateMethod === "update") {
		const nav = CardService.newNavigation().updateCard(card.build());
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	const nav = CardService.newNavigation().pushCard(card.build());
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return actionResponse.build();
}
