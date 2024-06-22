function renderSelectGdriveItemCardPg(event: IGScriptAppEvent) {
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
    .setFunctionName("renderSelectGdriveItemCardPg")
    .setParameters({
      selectedFolderToCopyParsable: selectedFolderToCopyParsable,
      isResetting: "true",
    });
  const copyFolderDestinationBtnAction = CardService.newAction()
    .setFunctionName("renderSelectCopyFolderDestinationCardPg")
    .setParameters({
      selectedFolderToCopyParsable: selectedFolderToCopyParsable,
    });
  // CHANGE SOMETHING?
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
