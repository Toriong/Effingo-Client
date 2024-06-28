function renderSelectCopyFolderDestinationCardPg(event: IGScriptAppEvent) {
  const { getIsParsable, getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;

  // CASE: the user selects the See More button, and has reached the max of thirty folders to be displayed to the user
  // GOAL: push a new card on the navigation stack with the received folders from the server, and enable the back button
  // the new card is presented to the user
  // the new card is push onto the navigation with the new folders to be presented to the user
  // add the folders as sectinos for the new card
  // get the new folders data from the server
  // push them into the user property service in the following format: { the id of the folder to copy: [[the array of folders, its
  // its index corresponds with the pagination number]]  }
  // get the current folders that were presented to the user
  // the user has reached total amount of folders for the current card (30)

  // CASE: the user clicks the See More button, and has not reach the max of thiryt folders
  // GOAL: add the new folders to be displayed to the user on the current card

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

  const {
    gdriveNextPageToken,
    displayedSelectableFolders: displayedSelectableFoldersStringified,
    selectedFolderToCopyParsable,
    willNotDisplaySeeMoreFoldersBtn,
    cardUpdateMethod,
  } = event.parameters;
  const selectedFolderToCopy = JSON.parse(
    selectedFolderToCopyParsable
  ) as ISelectedItem;
  let selectableCopyFolderDestinations =
    getUserPropertyParsed<TSelectableCopyFolderDestinations>(
      "selectableCopyFolderDestinations"
    ) ?? {};
  const selectableCopyFolderDestinationsForTargetFolder =
    selectableCopyFolderDestinations[selectedFolderToCopy.id] ??
    ({
      currentIndex: 0,
      displayedSelectableFoldersAll: [],
    } as TTargetSelectableFolder);
  let displayedSelectableFolders = getIsParsable(
    displayedSelectableFoldersStringified
  )
    ? (JSON.parse(
        displayedSelectableFoldersStringified
      ) as TGdriveItemsFromServer[])
    : [];
  const hasReachedSelectableFoldersMaxForCard =
    displayedSelectableFolders.length === 30;

  if (hasReachedSelectableFoldersMaxForCard) {
    selectableCopyFolderDestinationsForTargetFolder.displayedSelectableFoldersAll.push(
      displayedSelectableFolders
    );
    selectableCopyFolderDestinationsForTargetFolder.currentIndex += 1;
    selectableCopyFolderDestinations = {
      ...selectableCopyFolderDestinations,
      [selectedFolderToCopy.id]:
        selectableCopyFolderDestinationsForTargetFolder,
    };

    setUserProperty(
      "selectableCopyFolderDestinations",
      selectableCopyFolderDestinations
    );
  }

  const headerTxtParagraph = CardService.newTextParagraph().setText(
    "<b>Select the copy destination folder: </b>"
  );
  const headerSection =
    CardService.newCardSection().addWidget(headerTxtParagraph);
  // get the next gdrive items to be presented to the user
  // determine if the user has reached the total amount of folders to be presented to the user
  const getGdriveItemsResult = apiServices.getGdriveItems<{
    gdrive_items: TGdriveItemsFromServer[];
    gdrive_next_page_token: string;
  }>(
    event.parameters.parentFolderId || "root",
    5,
    5,
    gdriveNextPageToken ?? ""
  );
  const card = CardService.newCardBuilder()
    .setName("selectCopyFolderDestination")
    .addSection(headerSection);

  // There are no child folders present for the selected gdrive folder
  if (
    getGdriveItemsResult.errMsg ||
    !getGdriveItemsResult?.data?.gdrive_items?.length
  ) {
    const txt = CardService.newTextParagraph().setText(
      `${getGdriveItemsResult.errMsg} yo there!` ?? "No folders are present."
    );
    const txtSection = CardService.newCardSection().addWidget(txt);

    card.addSection(txtSection);

    const nav = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(nav);

    return actionResponse.build();
  }

  if (hasReachedSelectableFoldersMaxForCard) {
    displayedSelectableFolders = getGdriveItemsResult.data.gdrive_items;
  } else {
    displayedSelectableFolders.push(...getGdriveItemsResult.data.gdrive_items);
  }

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

  if (
    getGdriveItemsResult.data.gdrive_next_page_token &&
    !willNotDisplaySeeMoreFoldersBtn
  ) {
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

  const newSelectableFolderIndexPage =
    selectableCopyFolderDestinationsForTargetFolder.currentIndex <= 0
      ? 0
      : selectableCopyFolderDestinationsForTargetFolder.currentIndex - 1;
  const handlePrevBtnParameters: Partial<TMakeTypeValsIntoStr<TParameters>> = {
    selectedFolderToCopyParsable,
    cardUpdateMethod: "popAndUpdate",
    indexOfSelectableCopyFolderDestinationsPg:
      newSelectableFolderIndexPage.toString(),
  };
  // pop the current card, then with the new card on the stack, update it by not showing the see more button
  const prevBtnAction = CardService.newAction()
    .setFunctionName("handlePrevBtnClick")
    .setParameters(handlePrevBtnParameters);
  const prevBtn = CardService.newTextButton()
    .setText("Prev")
    .setOnClickAction(prevBtnAction)
    .setDisabled(
      selectableCopyFolderDestinationsForTargetFolder.currentIndex == 0
    );
  const nextBtnClickAction = CardService.newAction()
    .setFunctionName("handlePrevBtnClick")
    .setParameters(handlePrevBtnParameters);
  const nextBtn = CardService.newTextButton()
    .setText("Next")
    .setOnClickAction(nextBtnClickAction)
    .setDisabled(
      displayedSelectableFolders.length == 0 ||
        displayedSelectableFolders.length - 1 ==
          selectableCopyFolderDestinationsForTargetFolder.currentIndex
    );
  const footer = CardService.newFixedFooter()
    .setSecondaryButton(prevBtn)
    .setPrimaryButton(nextBtn);

  card.setFixedFooter(footer);

  if (
    !hasReachedSelectableFoldersMaxForCard &&
    ["update", "popAndUpdate"].includes(cardUpdateMethod)
  ) {
    let nav = CardService.newNavigation();

    if (cardUpdateMethod === "popAndUpdate") {
      nav = nav.popCard();
    }

    nav = nav.updateCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(nav);

    return actionResponse.build();
  }

  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}
