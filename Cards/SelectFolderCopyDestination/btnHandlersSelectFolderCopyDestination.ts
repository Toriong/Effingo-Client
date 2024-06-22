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
  // get the following parameters from the handleSeeMoreBtnClick function: { gdriveNextPageToken, currentDisplaySelectableFolders }

  const {
    gdriveNextPageToken,
    currentDisplaySelectableFolders,
    selectedParentFolderId,
  } = event.parameters;

  if (
    !selectedParentFolderId ||
    !currentDisplaySelectableFolders ||
    !gdriveNextPageToken
  ) {
    return;
  }

  const getGdriveItemsResult = apiServices.getGdriveItems<{
    gdrive_items: TGdriveItemsFromServer[];
    gdrive_next_page_token: string;
  }>(selectedParentFolderId, 5, 5, gdriveNextPageToken);
}

function renderSelectCopyFolderDestinationCardPg(event: IGScriptAppEvent) {
  // make a request to the server to get the root folders of the user's drive.
  // send the post request to get the root folders of the user's drive

  if (
    !event.parameters?.selectedFolderToCopyParsable ||
    !getIsParsable(event.parameters?.selectedFolderToCopyParsable)
  ) {
    return;
  }

  const headerTxtParagraph = CardService.newTextParagraph().setText(
    "<b>Select the copy destination folder: </b>"
  );
  const headerSection =
    CardService.newCardSection().addWidget(headerTxtParagraph);
  const getGdriveItemsResult = apiServices.getGdriveItems<{
    gdrive_items: TGdriveItemsFromServer[];
    gdrive_next_page_token: string;
  }>(event.parameters.parentFolderId || "root", 5, 5);
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

  // cache these folders in order to display them for the next render when the user clicks on the "see more folders" button
  for (const folder of getGdriveItemsResult?.data?.gdrive_items) {
    const folderName = CardService.newTextParagraph().setText(folder.name);
    const viewChildrenBtnAction = CardService.newAction()
      .setFunctionName("renderSelectCopyFolderDestinationCardPg")
      .setParameters({
        parentFolderId: folder.id,
        selectedFolderToCopyParsable:
          event.parameters.selectedFolderToCopyParsable,
      });
    const selectBtnAction = CardService.newAction()
      .setFunctionName("handleSelectFolderBtnClick")
      .setParameters({
        copyDestinationFolderId: folder.id,
        selectedFolderToCopyParsable:
          event.parameters.selectedFolderToCopyParsable,
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
    const action = CardService.newAction()
      .setFunctionName("handleSeeMoreFoldersBtnClick")
      .setParameters({
        currentFolders: JSON.stringify(getGdriveItemsResult.data.gdrive_items),
        gdriveNextPageToken: getGdriveItemsResult.data.gdrive_next_page_token,
      });
    const viewMoreFoldersBtn = CardService.newTextButton()
      .setText("See More Folders")
      .setOnClickAction(action);
    const viewMoreFolderSection =
      CardService.newCardSection().addWidget(viewMoreFoldersBtn);
    card.addSection(viewMoreFolderSection);
  }
  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}
