// if the user presses the DELETE WHEN DONE button, have the following to occur:
// -render the following text:
// We will immediately delete this job once its done.
// Back To Home (button)

function renderCopyFolderProgressCardPg(event: IGScriptAppEvent) {
  const card = CardService.newCardBuilder();
  const foldersSelected =
    getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  const {
    folderToCopyErrMsg,
    folderToCopyId,
    folderNameToCopy,
    folderCopyStatus,
    lastRefresh,
    txtIsCopyingTheSamePermissions,
    txtIsCopyingOnlyFolders,
  } = event.parameters;

  request.post({ map: JSON.stringify({ parameters: event.parameters }) });
  request.post({ map: JSON.stringify({ foldersSelected: foldersSelected }) });

  if (
    !foldersSelected ||
    folderToCopyErrMsg ||
    !folderToCopyId ||
    !folderNameToCopy ||
    (folderToCopyId && foldersSelected && !foldersSelected[folderToCopyId])
  ) {
    const errMsg =
      event.parameters.folderToCopyErrMsg ??
      "We're copying your folder, but we are unable show its progress.<br><br>Please view the 'View your past copy jobs' card if the job appears there.";
    const errMsgTxt = CardService.newTextParagraph().setText(errMsg);
    const section = CardService.newCardSection().addWidget(errMsgTxt);

    card.addSection(section);

    const navigation = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(navigation);

    return actionResponse.build();
  }

  const { copyDestinationFolderName } = foldersSelected[folderToCopyId];
  const cardHeader = CardService.newCardHeader()
    .setTitle("Folder Copy Results")
    .setImageUrl(IMGS.COPY_ICON);
  const folderToCopy = CardService.newTextParagraph().setText(
    `<b>Folder To Copy</b>: ${folderNameToCopy}`
  );
  const folderCopyDestination = CardService.newTextParagraph().setText(
    `<b>Folder Copy Destination</b>: ${copyDestinationFolderName}`
  );
  const statusTxt = CardService.newTextParagraph().setText(
    `Status: ${folderCopyStatus}`
  );
  const txtParagraphIsCopyingOnlyFolders =
    CardService.newTextParagraph().setText(
      `Copying only the folders?   ${txtIsCopyingOnlyFolders}`
    );
  const txtParagraphIsCopyingTheSamePermissions =
    CardService.newTextParagraph().setText(
      `Copying the same permissions?   ${txtIsCopyingTheSamePermissions}`
    );
  const lastRefreshTxt = CardService.newTextParagraph();

  if (lastRefresh) {
    lastRefreshTxt.setText(lastRefresh);
  }

  const folderCopyJobDescriptionSec = CardService.newCardSection();
  const deleteWhenDoneBtnAction = CardService.newAction().setFunctionName(
    "handleFolderCopyAbortJobBtnClick"
  );
  const deleteWhenDoneBtn = CardService.newTextButton()
    .setText("DELETE WHEN DONE")
    .setBackgroundColor(COLORS.WARNING_ORANGE)
    .setOnClickAction(deleteWhenDoneBtnAction);
  const refreshCopyJobResultsBtnAction =
    CardService.newAction().setFunctionName(
      "handleRefreshCopyJobResultsBtnClick"
    );
  const refreshCopyJobResultsBtn = CardService.newTextButton()
    .setText("REFRESH")
    .setBackgroundColor(COLORS.SMOKEY_GREY)
    .setOnClickAction(refreshCopyJobResultsBtnAction);
  const btnSet = CardService.newButtonSet()
    .addButton(refreshCopyJobResultsBtn)
    .addButton(deleteWhenDoneBtn);
  const copyFolderJobDescriptionBtnsSec =
    CardService.newCardSection().addWidget(btnSet);

  folderCopyJobDescriptionSec
    .addWidget(folderToCopy)
    .addWidget(folderCopyDestination)
    .addWidget(txtParagraphIsCopyingOnlyFolders)
    .addWidget(txtParagraphIsCopyingTheSamePermissions)
    .addWidget(statusTxt);

  if (lastRefreshTxt) {
    folderCopyJobDescriptionSec.addWidget(lastRefreshTxt);
  }

  card
    .setHeader(cardHeader)
    .addSection(folderCopyJobDescriptionSec)
    .addSection(copyFolderJobDescriptionBtnsSec);

  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}
