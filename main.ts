/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
  return HomeCards.createHomePgCards();
}

function deleteGdriveItemSelection() {
  // store all selected items into the user property
}

// this button will only be displayed if a folder has been selected and the
// -copy destionation folder ui is presented onto the ui
function handleOnClick(event: IGScriptAppEvent) {
  // when a folder is clicked, get the copy destintion folder from the object that contains the following:
  // the id of the folder that was clicked: { the name of the folder to copy to, the id of the folder }

  // the user clicks on a folder
  // get its id
  // query the cache to check if there are any folder selected for the copy destination of the target folder
  // get that folder and its name,
  // update the current selected folder in the userPropertyState service

  // when the user selects a folder for the copy folder destination do the following:
  // THIS ASSUMES THE USER SELECTED THE FOLDER TO COPY BY PRESSING THE BUTTON THAT
  // -HAS THIS HANDLER ON THE UI OF THE GOOGLE DRIVE ADD ON SIDE PANEL
  // when the user clicks on the button, get the current active item from the userProperty service
  // -after it has been recieved, get its id and its name
  // -pass it as the selected item
  // -pass the name and the id of the copy folder destination for this function

  // simulate the user selecting a folder to be used for the folder copy

  return renderCopyFolderCardPg(event);
}

function handleSelectFolderForCopyDestinationBtnClick(event: IGScriptAppEvent) {
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

  return renderCopyFolderCardPg(event);
}

function getGdriveItems<TData>(
  parentFolderId = "root",
  gdriveItemType: TGdriveItemTypes = "application/vnd.google-apps.folder"
) {
  try {
    const token = ScriptApp.getOAuthToken();
    const responseBodyStringified = request.post(
      {
        gdrive_item_type: gdriveItemType,
        parent_folder_id: parentFolderId,
        gdrive_access_token: token,
      },
      "get-gdrive-items"
    );

    if (!responseBodyStringified) {
      throw new Error("Failed to get the gdrive items of the target folder.");
    }

    const responseBody = JSON.parse(responseBodyStringified) as {
      data: string;
    };
    const responseBodyData = JSON.parse(responseBody.data) as TData;

    return { data: responseBodyData };
  } catch (error) {
    const errMsg = `Failed to get target gdrive items. Reason: ${error}`;

    return { errMsg };
  }
}

function handleChangeCopyDestinationFolderBtnClick(event: IGScriptAppEvent) {
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
  const getGdriveItemsResult = getGdriveItems<{
    gdrive_items: TGdriveItemsFromServer[];
  }>(event.parameters.parentFolderId || "root");
  const card = CardService.newCardBuilder()
    .setName("selectCopyFolderDestination")
    .addSection(headerSection);

  // Root folders are not present
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

  for (const folder of getGdriveItemsResult?.data?.gdrive_items) {
    const folderName = CardService.newTextParagraph().setText(folder.name);
    const viewChildrenBtnAction = CardService.newAction()
      .setFunctionName("handleChangeCopyDestinationFolderBtnClick")
      .setParameters({
        parentFolderId: folder.id,
        selectedFolderToCopyParsable:
          event.parameters.selectedFolderToCopyParsable,
      });
    const selectBtnAction = CardService.newAction()
      .setFunctionName("handleSelectFolderForCopyDestinationBtnClick")
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

  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
  // request.post({ map: JSON.stringify(event) });

  if (!event.parameters) {
    return;
  }

  const { selectedFolderToCopyParsable, copyDestinationFolderName } =
    event.parameters;

  if (!selectedFolderToCopyParsable) {
    return;
  }

  const selectedFolder =
    selectedFolderToCopyParsable && getIsParsable(selectedFolderToCopyParsable)
      ? (JSON.parse(selectedFolderToCopyParsable) as ISelectedItem)
      : null;

  if (!selectedFolder) {
    return;
  }

  const card = CardService.newCardBuilder();
  const cardSection = CardService.newCardSection();

  const selectedFolderToCopyTxtWidget = CardService.newTextParagraph().setText(
    `<b>Selected Folder</b>: <i>${selectedFolder.title}</i>`
  );
  const copyDestinationFolderTxt =
    copyDestinationFolderName ?? `My Drive/${selectedFolder.title} COPY`;
  const copyDestinationFolderTxtWidget = CardService.newTextParagraph().setText(
    `Copy Folder Destination: <i>${copyDestinationFolderTxt}</i>`
  );
  const copyFolderOpt = CardService.newTextParagraph().setText(
    "<b><u>Copy Folder Options</u></b>"
  );
  const cardServiceOptionsTxtSec =
    CardService.newCardSection().addWidget(copyFolderOpt);
  const resetCopyFolderDestinationBtnAction = CardService.newAction()
    .setFunctionName("renderCopyFolderCardPg")
    .setParameters({
      selectedFolderToCopyParsable: selectedFolderToCopyParsable,
      isResetting: "true",
    });
  const copyFolderDestinationBtnAction = CardService.newAction()
    .setFunctionName("handleChangeCopyDestinationFolderBtnClick")
    .setParameters({
      selectedFolderToCopyParsable: selectedFolderToCopyParsable,
    });
  const copyFolderDestinationBtn = CardService.newTextButton()
    .setText("Change Copy Folder Destination.")
    .setBackgroundColor(COLORS.SMOKEY_GREY)
    .setOnClickAction(copyFolderDestinationBtnAction);
  const resetCopyFolderDestinationBtn = CardService.newTextButton()
    .setText("Reset Copy Folder Destination.")
    .setBackgroundColor(COLORS.WARNING_ORANGE)
    .setOnClickAction(resetCopyFolderDestinationBtnAction);

  cardServiceOptionsTxtSec.addWidget(copyDestinationFolderTxtWidget);

  cardServiceOptionsTxtSec.addWidget(copyFolderDestinationBtn);

  cardServiceOptionsTxtSec.addWidget(resetCopyFolderDestinationBtn);

  const willCopyFoldersOnly = false;
  const willIncludesTheSamePermissions = false;
  const copyOnlyFoldersSwitch = CardService.newDecoratedText()
    .setText("Copy only the folder structure.")
    .setWrapText(true)
    .setSwitchControl(
      CardService.newSwitch()
        .setFieldName("willCopyFoldersOnly")
        .setValue(JSON.stringify(willCopyFoldersOnly))
        .setOnChangeAction(
          CardService.newAction().setFunctionName("handleSwitchChange")
        )
    );
  const includeTheSamePermissionsSwitch = CardService.newDecoratedText()
    .setText(
      "Include the same permissions (the folders and files will be shared with the same users)."
    )
    .setWrapText(true)
    .setSwitchControl(
      CardService.newSwitch()
        .setFieldName("willCopyOnlyTheFiles")
        .setValue(JSON.stringify(willIncludesTheSamePermissions))
        .setOnChangeAction(
          CardService.newAction().setFunctionName("handleSwitchChange")
        )
    );
  const cardHeader = CardService.newCardHeader()
    .setTitle("Copy & Permissions")
    .setSubtitle("Your selected item will appear below.")
    .setImageUrl(IMGS.TOOLS);

  cardSection.addWidget(selectedFolderToCopyTxtWidget);
  cardServiceOptionsTxtSec.addWidget(includeTheSamePermissionsSwitch);
  cardServiceOptionsTxtSec.addWidget(copyOnlyFoldersSwitch);

  card.setHeader(cardHeader);

  card.addSection(cardSection);

  card.addSection(cardServiceOptionsTxtSec);

  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}

function handleCopyFolderPgRender() {
  const { createFolderCopyCards } = FolderCopyCards;

  return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
