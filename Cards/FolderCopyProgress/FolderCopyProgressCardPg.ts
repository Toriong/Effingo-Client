// if the user presses the DELETE WHEN DONE button, have the following to occur:
// -render the following text:
// We will immediately delete this job once its done.
// Back To Home (button)

function renderCopyFolderProgressCardPgUpdated() {}

function renderCopyFolderProgressCardPg(event: IGScriptAppEvent) {
  const card = CardService.newCardBuilder();
  const foldersSelected =
    GLOBAL_FNS.getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  const {
    folderToCopyErrMsg,
    folderToCopyId,
    folderNameToCopy,
    folderCopyStatus,
    txtIsCopyingTheSamePermissions,
    txtIsCopyingOnlyFolders,
  } = event.parameters;

  if (
    !folderToCopyId ||
    !folderNameToCopy ||
    folderToCopyErrMsg ||
    (folderToCopyId && foldersSelected && !foldersSelected[folderToCopyId])
  ) {
    const unableToStartFolderCopyJobErrMsg =
      folderToCopyErrMsg ?? "Couldn't copy your folder. Please try again.";
    const errMsgTxt = CardService.newTextParagraph().setText(
      unableToStartFolderCopyJobErrMsg
    );
    const section = CardService.newCardSection().addWidget(errMsgTxt);

    card.addSection(section);

    const navigation = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(navigation);

    return actionResponse.build();
  }

  const folderCopyJobInfo = foldersSelected[folderToCopyId];

  if (!folderCopyJobInfo.copyDestinationFolderName) {
    const errMsgTxt = CardService.newTextParagraph().setText(
      "Sorry, but we couldn't start the copy folder job for you. We were unable to retrieve the name of folder to copy the content to. Please try again."
    );
    const section = CardService.newCardSection().addWidget(errMsgTxt);

    card.addSection(section);

    const navigation = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(navigation);

    return actionResponse.build();
  }

  const startCopyJobResponseResult = apiServices.sendCopyFolderReq(
    folderToCopyId,
    folderNameToCopy,
    folderCopyJobInfo.copyDestinationFolderName,
    folderCopyJobInfo.copyDestinationFolderName,
    folderCopyJobInfo.copyDestinationFolderId ?? ""
  );

  if (
    startCopyJobResponseResult.errMsg ||
    startCopyJobResponseResult.copyFolderJobStatus ===
      "failedToSendCopyFolderReq" ||
    !startCopyJobResponseResult?.copyFolderJobId
  ) {
    const errMsg = startCopyJobResponseResult.errMsg
      ? `Sorry we're unable to start the copy job for this folder. Reason: ${startCopyJobResponseResult.errMsg}.`
      : "Sorry we're unable to satrt the copy job for this folder. Please try again.";
    const errMsgTxt = CardService.newTextParagraph().setText(errMsg);
    const section = CardService.newCardSection().addWidget(errMsgTxt);

    card.addSection(section);

    const navigation = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(navigation);

    return actionResponse.build();
  }

  const cardHeader = CardService.newCardHeader()
    .setTitle("Folder Copy Results")
    .setImageUrl(IMGS.COPY_ICON);
  const folderToCopy = CardService.newTextParagraph().setText(
    `<b>Folder To Copy</b>: ${folderNameToCopy}`
  );
  const folderCopyDestination = CardService.newTextParagraph().setText(
    `<b>Folder Copy Destination</b>: ${folderCopyJobInfo.copyDestinationFolderName}`
  );
  const statusTxt = CardService.newTextParagraph().setText(
    `Status: ${folderCopyStatus}`
  );
  const txtParagraphIsCopyingOnlyFolders =
    CardService.newTextParagraph().setText(
      `Copying only the folders?   ${txtIsCopyingOnlyFolders ?? "unknown"}`
    );
  const txtParagraphIsCopyingTheSamePermissions =
    CardService.newTextParagraph().setText(
      `Copying the same permissions?   ${
        txtIsCopyingTheSamePermissions ?? "unknown"
      }`
    );
  const lastRefreshTxt = CardService.newTextParagraph();

  const folderCopyJobDescriptionSec = CardService.newCardSection();
  // send a request to the server, get the id of the folder copy job, insert the following:
  // wasAborted: true
  const deleteWhenDoneBtnAction = CardService.newAction()
    .setFunctionName("handleFolderCopyAbortJobBtnClick")
    .setParameters({
      copyFolderJobId: startCopyJobResponseResult.copyFolderJobId,
    });
  const deleteWhenDoneBtn = CardService.newTextButton()
    .setText("ABORT JOB")
    .setBackgroundColor(COLORS.WARNING_ORANGE)
    .setOnClickAction(deleteWhenDoneBtnAction);
  const refreshCopyJobResultsBtnAction = CardService.newAction()
    .setFunctionName("renderCopyFolderProgressCardPgUpdated")
    .setParameters({
      copyFolderJobId: startCopyJobResponseResult.copyFolderJobId,
    });
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
