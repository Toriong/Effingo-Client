const helperFnsSelectFolderCopyDestination = (() => {
	function addFolderSections(
		selectableFoldersCard: GoogleAppsScript.Card_Service.CardBuilder,
		folders: TGdriveItemsFromServer[],
		selectedFolderToCopy: ISelectedItem,
	) {
		const selectedFolderToCopyParsable = JSON.stringify(selectedFolderToCopy);

		for (const folder of folders) {
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

			selectableFoldersCard.addSection(folderCardSection);
		}
	}

	function constructSelectableCopyFolderDestinationCard(
		displayedSelectableFolders: TGdriveItemsFromServer[],
		nextPageToken: string,
		selectedFolderToCopyParsable: string,
		selectableFolderCopyDestinationCard: GoogleAppsScript.Card_Service.CardBuilder,
		currentIndex: number,
		displayedSelectableFoldersAllLength: number,
		cardUpdateMethod: IParameters["cardUpdateMethod"],
	) {
		const hasReachedSelectableFoldersMaxForCard =
			displayedSelectableFolders.length === 30;

		if (nextPageToken && !hasReachedSelectableFoldersMaxForCard) {
			// stringify the cards and pass it as a parameter for the object below
			const parameters: TSetParametersArg = {
				selectedFolderToCopyParsable,
				displayedSelectableFolders: JSON.stringify(displayedSelectableFolders),
				gdriveNextPageToken: nextPageToken,
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

			selectableFolderCopyDestinationCard.addSection(viewMoreFolderSection);
		}

		const selectedFolderToCopy = JSON.parse(
			selectedFolderToCopyParsable,
		) as ISelectedItem;
		const gdriveNextPageToken = nextPageToken ?? "";
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
					currentIndex === displayedSelectableFoldersAllLength - 1 &&
					!!gdriveNextPageToken,
			);
		const footer = CardService.newFixedFooter()
			.setSecondaryButton(prevBtn)
			.setPrimaryButton(nextBtn);

		selectableFolderCopyDestinationCard.setFixedFooter(footer);

		if (
			!hasReachedSelectableFoldersMaxForCard &&
			cardUpdateMethod === "update"
		) {
			const nav = CardService.newNavigation().updateCard(
				selectableFolderCopyDestinationCard.build(),
			);
			const actionResponse =
				CardService.newActionResponseBuilder().setNavigation(nav);

			return actionResponse.build();
		}

		const nav = CardService.newNavigation().pushCard(
			selectableFolderCopyDestinationCard.build(),
		);
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
	}

	return {
		constructSelectableCopyFolderDestinationCard,
		addFolderSections,
	};
})();
