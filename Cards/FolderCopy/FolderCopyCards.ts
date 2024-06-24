function renderSelectGdriveItemCardPg(event: IGScriptAppEvent) {
  if (!event.parameters) {
    return;
  }

  const { selectedFolderToCopyParsable, copyDestinationFolderName } =
    event.parameters;

  if (!selectedFolderToCopyParsable) {
    return;
  }

  const { getIsParsable, getUserProperty } = GLOBAL_FNS;
  const selectedFolder =
    selectedFolderToCopyParsable && getIsParsable(selectedFolderToCopyParsable)
      ? (JSON.parse(selectedFolderToCopyParsable) as ISelectedItem)
      : null;

  if (!selectedFolder) {
    return;
  }

  // Send the copy folder request here

  const txtIsCopyingOnlyFolders =
    getUserProperty("txtIsCopyingOnlyFolders") ?? "No";
  const txtIsCopyingTheSamePermissions =
    getUserProperty("txtIsCopyingTheSamePermissions") ?? "No";
  const selectedGdriveItemToolsCard = CardService.newCardBuilder();
  const copyFolderCardSection = CardService.newCardSection();
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
    .setFunctionName("renderSelectGdriveItemCardPg")
    .setParameters({
      selectedFolderToCopyParsable: selectedFolderToCopyParsable,
    });
  const copyFolderDestinationBtnAction = CardService.newAction()
    .setFunctionName("renderSelectCopyFolderDestinationCardPg")
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

  cardServiceOptionsTxtSec
    .addWidget(copyDestinationFolderTxtWidget)
    .addWidget(copyFolderDestinationBtn)
    .addWidget(resetCopyFolderDestinationBtn);

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
  const parameters = {
    txtIsCopyingOnlyFolders,
    txtIsCopyingTheSamePermissions,
    // create a function that generate the correct text color based on the text that you receive from the server
    folderCopyStatus: '<font color="#808080">ONGOING</font>',
    folderToCopyId: selectedFolder.id,
    folderNameToCopy: selectedFolder.title,
  };
  const copyFolderAction = CardService.newAction()
    .setFunctionName("renderCopyFolderProgressCardPg")
    .setParameters(parameters);
  const copyFolderTxtBtn = CardService.newTextButton()
    .setOnClickAction(copyFolderAction)
    .setText("COPY FOLDER")
    .setBackgroundColor("#1877F2");
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

  copyFolderCardSection
    .addWidget(selectedFolderToCopyTxtWidget)
    .addWidget(includeTheSamePermissionsSwitch)
    .addWidget(copyOnlyFoldersSwitch)
    .addWidget(copyFolderTxtBtn);

  selectedGdriveItemToolsCard
    .setHeader(cardHeader)
    .addSection(cardServiceOptionsTxtSec)
    .addSection(copyFolderCardSection);

  const nav = CardService.newNavigation().pushCard(
    selectedGdriveItemToolsCard.build()
  );
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}
