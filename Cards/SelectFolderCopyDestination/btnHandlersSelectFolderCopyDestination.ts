function handlePrevBtnClick(event: IGScriptAppEvent) {
  if (!event.parameters || !event.parameters.folderToCopyId) {
    return;
  }

  const { getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;
  const selectableCopyFolderDestinations =
    getUserPropertyParsed<TSelectableCopyFolderDestinations>(
      "selectableCopyFolderDestinations"
    );
  const selectableFolderCopyDestination =
    selectableCopyFolderDestinations[event.parameters.folderToCopyId];

  if (!selectableFolderCopyDestination) {
    return;
  }

  selectableFolderCopyDestination.currentIndex -= 1;

  setUserProperty("selectableCopyFolderDestinations", {
    ...selectableCopyFolderDestinations,
    [event.parameters.folderToCopyId]: selectableFolderCopyDestination,
  });

  const nav = CardService.newNavigation().popCard();
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}

// NOTES:
//

// CASE: the user is on the last page cards, can get the next page of folders
// GOAL: push a new card with the new folders retrieved from the backend
// -

function handleNextFolderPgBtnClick(event: IGScriptAppEvent) {
  if (!event.parameters || !event.parameters.folderToCopyId) {
    return;
  }

  const { getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;
  const selectableCopyFolderDestinations =
    getUserPropertyParsed<TSelectableCopyFolderDestinations>(
      "selectableCopyFolderDestinations"
    );
  const selectableFolderCopyDestination =
    selectableCopyFolderDestinations[event.parameters.folderToCopyId];

  if (!selectableFolderCopyDestination) {
    return;
  }

  const newCurrentIndex = selectableFolderCopyDestination.currentIndex + 1;
}

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

  const { getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;
  const selectedFolderToCopy = JSON.parse(
    selectedFolderToCopyParsable
  ) as ISelectedItem;
  const foldersToCopyInfo =
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
