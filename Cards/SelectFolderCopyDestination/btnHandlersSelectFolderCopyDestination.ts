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
