function renderSelectCopyFolderDestinationCardPg(event: IGScriptAppEvent) {
  const { getIsParsable } = GLOBAL_FNS;

  if (
    !event.parameters?.selectedFolderToCopyParsable ||
    !getIsParsable(event.parameters?.selectedFolderToCopyParsable)
  ) {
    return;
  }

  const {
    gdriveNextPageToken,
    displayedSelectableFolders: displayedSelectableFoldersStringified,
    selectedFolderToCopyParsable,
    willUpdateCard,
  } = event.parameters;
  const displayedSelectableFolders = getIsParsable(
    displayedSelectableFoldersStringified
  )
    ? (JSON.parse(
        displayedSelectableFoldersStringified
      ) as TGdriveItemsFromServer[])
    : [];
  const headerTxtParagraph = CardService.newTextParagraph().setText(
    "<b>Select the copy destination folder: </b>"
  );
  const headerSection =
    CardService.newCardSection().addWidget(headerTxtParagraph);
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
      "No folders are present."
    );
    const txtSection = CardService.newCardSection().addWidget(txt);

    card.addSection(txtSection);

    const nav = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(nav);

    return actionResponse.build();
  }

  displayedSelectableFolders.push(...getGdriveItemsResult.data.gdrive_items);

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

  if (getGdriveItemsResult.data.gdrive_next_page_token) {
    // create a function that will create and return the parameters
    const parameters: TSetParametersArg = {
      selectedFolderToCopyParsable,
      displayedSelectableFolders: JSON.stringify(displayedSelectableFolders),
      gdriveNextPageToken: getGdriveItemsResult.data.gdrive_next_page_token,
      willUpdateCard: JSON.stringify(true),
    };
    const action = CardService.newAction()
      .setFunctionName("renderSelectCopyFolderDestinationCardPg")
      .setParameters(parameters);
    // PUT THE ABOVE INTO A FUNCTION
    const viewMoreFoldersBtn = CardService.newTextButton()
      .setText("See More Folders")
      .setOnClickAction(action);
    const viewMoreFolderSection =
      CardService.newCardSection().addWidget(viewMoreFoldersBtn);
    card.addSection(viewMoreFolderSection);
  }

  if (
    willUpdateCard &&
    getIsParsable(willUpdateCard) &&
    JSON.parse(willUpdateCard)
  ) {
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
