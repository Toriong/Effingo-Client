function handlePrevBtnClick(event: IGScriptAppEvent) {
  if (!event.parameters) {
    return;
  }

  const { getUserPropertyParsed, getIsParsable } = GLOBAL_FNS;
  const { cardUpdateMethod, selectedFolderToCopyParsable } = event.parameters;

  if (!cardUpdateMethod || !selectedFolderToCopyParsable) {
    return;
  }

  if (!getIsParsable(selectedFolderToCopyParsable)) {
    return;
  }

  const selectedFolderToCopy = JSON.parse(
    selectedFolderToCopyParsable
  ) as ISelectedItem;
  const selectableCopyFolderDestinations =
    getUserPropertyParsed<TSelectableCopyFolderDestinations>(
      "selectableCopyFolderDestinations"
    );
  const selectedCopyFolderDestinationsForTargetFolder =
    selectableCopyFolderDestinations[selectedFolderToCopy.id];

  if (!selectedCopyFolderDestinationsForTargetFolder) {
    return;
  }

  const { displayedSelectableFoldersAll, currentIndex } =
    selectedCopyFolderDestinationsForTargetFolder;

  if (currentIndex - 1 < 0) {
    return;
  }

  const targetSelectableFolders =
    displayedSelectableFoldersAll[currentIndex - 1];

  request.post({
    map: JSON.stringify({
      yo: targetSelectableFolders.length,
      sup: selectedCopyFolderDestinationsForTargetFolder,
    }),
  });

  event.parameters = {
    displayedSelectableFolders: JSON.stringify(targetSelectableFolders),
    selectedFolderToCopyParsable,
    willNotDisplaySeeMoreFoldersBtn: JSON.stringify(true),
    cardUpdateMethod: "popAndUpdate",
  };

  return renderSelectCopyFolderDestinationCardPg(event);

  // GOAL: get the previous page of the copy folder destination to be shown to the user

  // GOAL: disable the previous card page of folders to be displayed to the user

  // BRAIN DUMP:
  // this function will take new index to query all folders array
  // will update the currentIndex field with that value
  // get the new folders to display to the user
  // will pass willNotDisplaySeeMoreFoldersBtn as an argument for the render function
  // render the  page
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
