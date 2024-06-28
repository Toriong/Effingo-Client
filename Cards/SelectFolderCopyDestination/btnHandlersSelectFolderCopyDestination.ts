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

// CASE: the user presses the next button. the user will go to a card that they have been before

// CASE: the user presses then next button. The user will go to a new card that they have never been before.

// WHAT DO I HAVE WITH THE CURRENT FUNCTION:
// -the selectedFolderToCopyParsable parameter
// -the next page token
// -the update method

// WHAT DO I WANT WITH THIS FUNCTION:
// -push a new card that will display the latest folders received from the server
// -increment the current index by one for 'selectableCopyFolderDestinations' object, use the id of selectedFolderToCopyParsable
// to retrieve the target property from property service object in order to get the index of the selectable folders for the copy destination for
// for the target folder

// WHY AM I DOING THIS? In order to update the correct sub array when the user clicks on the "See More Folders" button

function handleNextFolderPgBtnClick(event: IGScriptAppEvent) {
  // GOAL: check if the user is going to a new card page that will contain folders that have not seen before
  // FINAL STEP: a new card has been pushed onto the nav stack with the newly received selectable folders for the copy
  // -folder destination

  // -cardUpdateMethod (to push the new card onto the nav stack)
  // -selectedFolderToCopyParsable (in order to query the selectableCopyFolderDestinations)
  // -gdriveNextPageToken (to get the next page of selectable folders)
  // pass the above values for the 'renderSelectCopyFolderDestinationCardPg' function:
  // store the new index value for the currentIndex property
  // the value is not there
  // check if that index exists in the selectableCopyFolderDestinations property of x
  // increment the current index by one, store it into a separate variable
  // get the current index
  // the property that contains the already seen selectable folders and the current index has been received via
  // -the id of the folder to copy, call this object that contains this property x
  // query the selectableCopyFolderDestinations object via the id of the folder to copy
  // get the id of parsable result
  // selectedFolderToCopyParsable is parsable, so parse it
  // check if selectedFolderToCopyParsable can be parsed
  // the following parameters are received: gdriveNextPageToken,
  // selectedFolderToCopyParsable,
  const { getIsParsable, getUserPropertyParsed, setUserProperty } = GLOBAL_FNS;
  let selectableCopyFolderDestinations =
    getUserPropertyParsed<TSelectableCopyFolderDestinations>(
      "selectableCopyFolderDestinations"
    );

  if (
    !event.parameters ||
    !event.parameters.gdriveNextPageToken ||
    !event.parameters.selectedFolderToCopyParsable ||
    (event.parameters.selectedFolderToCopyParsable &&
      !getIsParsable(event.parameters.selectedFolderToCopyParsable)) ||
    !selectableCopyFolderDestinations
  ) {
    return;
  }

  const { selectedFolderToCopyParsable } = event.parameters;
  const selectedFolderToCopy = JSON.parse(
    selectedFolderToCopyParsable
  ) as ISelectedItem;
  const copyFolderDestinationForTargetFolder:
    | TTargetSelectableFolder
    | undefined = selectableCopyFolderDestinations[selectedFolderToCopy.id];

  if (!copyFolderDestinationForTargetFolder) {
    return;
  }

  const { currentIndex, displayedSelectableFoldersAll } =
    copyFolderDestinationForTargetFolder;

  copyFolderDestinationForTargetFolder.currentIndex += 1;
  event.parameters = { ...event.parameters, cardUpdateMethod: "push" };
  selectableCopyFolderDestinations = { ...selectableCopyFolderDestinations, [selectedFolderToCopy.id]: copyFolderDestinationForTargetFolder }

  setUserProperty("selectableCopyFolderDestinations", selectableCopyFolderDestinations);

  // The user wants to view folders that they have not seen (will make a query to the server to get folders)
  if (!displayedSelectableFoldersAll[currentIndex + 1]) {
    return renderSelectCopyFolderDestinationCardPg(event);
  }

  // The user wants to view folders that they have seen already.
  const viewedSelectableCopyFolderDestinations =
    displayedSelectableFoldersAll[currentIndex + 1];

  event.parameters = {
    ...event.parameters,
    displayedSelectableFolders: JSON.stringify(
      viewedSelectableCopyFolderDestinations
    ),
  };

  return renderSelectCopyFolderDestinationCardPg(event);
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
