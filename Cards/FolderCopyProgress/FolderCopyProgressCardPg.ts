// if the user presses the DELETE WHEN DONE button, have the following to occur:
// -render the following text:
// We will immediately delete this job once its done.
// Back To Home (button)

function renderCopyFolderProgressCard(event: IGScriptAppEvent) {
  const card = CardService.newCardBuilder();
  const foldersSelected: TFoldersToCopyInfo | null =
    GLOBAL_FNS.getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");

  const {
    folderNameToCopy,
    folderToCopyId,
    folderCopyStatus,
    txtIsCopyingOnlyFolders,
    txtIsCopyingTheSamePermissions,
    copyFolderJobId,
    cardUpdateMethod,
    copyFolderJobTimeCompletionMs,
  } = event.parameters;

  const folderCopyJobInfo = foldersSelected[folderToCopyId];
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
    `Status: ${folderCopyStatus.toUpperCase()}`
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
  const deleteWhenDoneBtnAction = CardService.newAction()
    .setFunctionName("handleFolderCopyAbortJobBtnClick")
    .setParameters({
      copyFolderJobId: copyFolderJobId,
    });
  const deleteWhenDoneBtn = CardService.newTextButton()
    .setText("DELETE WHEN DONE")
    .setBackgroundColor(COLORS.WARNING_ORANGE)
    .setOnClickAction(deleteWhenDoneBtnAction);
  const refreshCopyJobResultsBtnAction = CardService.newAction()
    .setFunctionName("handleRefreshCopyJobResultsBtnClick")
    .setParameters({
      copyFolderJobId: copyFolderJobId,
      folderToCopyId,
      folderNameToCopy,
      folderCopyStatus:
        folderCopyStatus.toUpperCase() ?? "UNABLE TO RETRIEVE STATUS",
      txtIsCopyingTheSamePermissions,
      txtIsCopyingOnlyFolders,
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

  if (copyFolderJobTimeCompletionMs) {
    const copyFolderJobTimeCompletiontTxt =
      CardService.newTextParagraph().setText(
        `Completion Time: ${copyFolderJobTimeCompletionMs}`
      );

    folderCopyJobDescriptionSec.addWidget(copyFolderJobTimeCompletiontTxt);
  }

  if (lastRefreshTxt) {
    folderCopyJobDescriptionSec.addWidget(lastRefreshTxt);
  }

  card
    .setHeader(cardHeader)
    .addSection(folderCopyJobDescriptionSec)
    .addSection(copyFolderJobDescriptionBtnsSec);

  if (cardUpdateMethod === "update") {
    const nav = CardService.newNavigation().updateCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(nav);

    return actionResponse.build();
  }

  const nav = CardService.newNavigation().pushCard(card.build());
  const actionResponse =
    CardService.newActionResponseBuilder().setNavigation(nav);

  return actionResponse.build();
}

function renderCopyFolderProgressCardPgWithErrorHandling(
  event: IGScriptAppEvent
) {
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

  const { copyDestinationFolderId, copyDestinationFolderName } =
    folderCopyJobInfo;
  const startCopyJobResponseResult = apiServices.sendCopyFolderReq(
    folderToCopyId,
    folderNameToCopy,
    copyDestinationFolderName,
    copyDestinationFolderId ? "" : copyDestinationFolderName,
    copyDestinationFolderId ?? ""
  );

  if (
    startCopyJobResponseResult.errMsg ||
    startCopyJobResponseResult.copyFolderJobStatus ===
      "failedToSendCopyFolderReq" ||
    !startCopyJobResponseResult?.copyFolderJobId
  ) {
    const errMsg = startCopyJobResponseResult.errMsg
      ? `Sorry we're unable to start the copy job for this folder.<br>Reason: ${startCopyJobResponseResult.errMsg}.`
      : "Sorry we're unable to satrt the copy job for this folder. Please try again.";
    const errMsgTxt = CardService.newTextParagraph().setText(errMsg);
    const section = CardService.newCardSection().addWidget(errMsgTxt);

    card.addSection(section);

    const navigation = CardService.newNavigation().pushCard(card.build());
    const actionResponse =
      CardService.newActionResponseBuilder().setNavigation(navigation);

    return actionResponse.build();
  }

  // PUT THIS INTO A FUNCTION TO render the card again with the status updated
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
    `Status: ${folderCopyStatus.toUpperCase()}`
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
  const deleteWhenDoneBtnAction = CardService.newAction()
    .setFunctionName("handleFolderCopyAbortJobBtnClick")
    .setParameters({
      copyFolderJobId: startCopyJobResponseResult.copyFolderJobId,
    });
  const deleteWhenDoneBtn = CardService.newTextButton()
    .setText("DELETE WHEN DONE")
    .setBackgroundColor(COLORS.WARNING_ORANGE)
    .setOnClickAction(deleteWhenDoneBtnAction);
  const refreshCopyJobResultsBtnAction = CardService.newAction()
    .setFunctionName("handleRefreshCopyJobResultsBtnClick")
    .setParameters({
      copyFolderJobId: startCopyJobResponseResult.copyFolderJobId,
      folderToCopyId,
      folderNameToCopy,
      folderCopyStatus,
      txtIsCopyingTheSamePermissions,
      txtIsCopyingOnlyFolders,
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
