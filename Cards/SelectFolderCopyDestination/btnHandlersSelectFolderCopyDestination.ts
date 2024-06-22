function handleSelectFolderBtnClick(event: IGScriptAppEvent) {
  if (
    !event?.parameters?.copyDestinationFolderName ||
    !event.parameters.copyDestinationFolderId
  ) {
    return;
  }

  const { copyDestinationFolderId, copyDestinationFolderName } =
    event.parameters;
  const selectedFolderToCopyParsable =
    event.parameters.selectedFolderToCopyParsable;

  if (!selectedFolderToCopyParsable) {
    return;
  }

  const selectedFolderToCopy = JSON.parse(
    selectedFolderToCopyParsable
  ) as ISelectedItem;
  let foldersToCopyInfo =
    getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo") ?? {};
  let targetFolderToCopyInfo: ICopyDestinationFolder | null =
    foldersToCopyInfo[selectedFolderToCopy.id];

  if (!targetFolderToCopyInfo) {
    targetFolderToCopyInfo = {
      copyDestinationFolderId,
      copyDestinationFolderName,
      willCopyPermissions: false,
      willCopyStructureOnly: false,
    };
  } else {
    targetFolderToCopyInfo = {
      ...targetFolderToCopyInfo,
      copyDestinationFolderId,
      copyDestinationFolderName,
    };
  }

  foldersToCopyInfo[selectedFolderToCopy.id] = targetFolderToCopyInfo;

  setUserProperty("foldersToCopyInfo", foldersToCopyInfo);

  Object.assign(event.parameters, {
    selectedFolderToCopyParsable,
    copyDestinationFolderName: copyDestinationFolderName,
  });

  return renderSelectGdriveItemCardPg(event);
}

function handleSeeMoreBtnClick(event: Required<IGScriptAppEvent>) {
  // GOAL: get the next page of folders based on the next page token
  // the next page of folders is displayed to the user
  // add the new page of folders to the vector that holds the current folders being displayed
  // the next page of folders has been received from the server
  // execute the getGdriveItems function to get the next page of folders, pass the next page token for its argument
  // get the following parameters from the handleSeeMoreBtnClick function: { gdriveNextPageToken, displayedSelectableFolders }

  const {
    gdriveNextPageToken,
    displayedSelectableFolders,
    selectedParentFolderId,
  } = event.parameters;

  if (
    !selectedParentFolderId ||
    !displayedSelectableFolders ||
    !gdriveNextPageToken
  ) {
    return;
  }

  const currentDisplaySelectableFoldersParsed = JSON.parse(
    displayedSelectableFolders
  ) as ISelectedItem[];
  const getGdriveItemsResult = apiServices.getGdriveItems<{
    gdrive_items: TGdriveItemsFromServer[];
    gdrive_next_page_token: string;
  }>(selectedParentFolderId, 5, 5, gdriveNextPageToken);

  // GOAL: add the new folders to the current folders that is being displayed onto the ui
  if (!getGdriveItemsResult.data.gdrive_items) {
    return;
  }

  // after adding the new items received from the server set the parameters of the event object that will be passed in for the
}

function addSectionsToFolderCard(
  folderCard: GoogleAppsScript.Card_Service.CardBuilder
) {}

function renderSelectCopyFolderDestinationCardPg(event: IGScriptAppEvent) {
  // GOAL: call this function again when the user clicks on the "See More Folder" button
  // -get the folders from the server
  // -for the event object, pass the nextPageToken, and pass the current displayed folders
  // -after the folders from the server is received, add them to the array of currentDisplayedFolders
  // -create a variable called 'currentDisplayedFolders' set it equal to the folders that was passed for event object
  // -if there is no such array passed for the event object, then set 'currentDisplayedFolders' to an empty array
  // -get the folders received from the server
  // -push those folders into the var: currentDisplayedFolders
  // -use that as the loop to create the card sections for the ui
  request.post({
    map: JSON.stringify({
      parameters: event.parameters,
    }),
  });

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
