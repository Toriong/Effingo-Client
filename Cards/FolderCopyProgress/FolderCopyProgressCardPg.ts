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
  const cardHeader = CardService.newCardHeader().setTitle(
    `Folder Copy Results For <i>${folderNameToCopy}</i>`
  );
  const folderCopyDestination = CardService.newTextParagraph().setText(
    `<b>Folder Copy Destination</b>: ${copyDestinationFolderName}`
  );
  const statusTxt = CardService.newTextParagraph().setText(
    `Status: ${folderCopyStatus}`
  );
  const lastRefreshTxt = CardService.newTextParagraph();

  if (lastRefresh) {
    lastRefreshTxt.setText(lastRefresh);
  }

  const folderCopyJobDescriptionSec = CardService.newCardSection();
  const abortCopyJobAction = CardService.newAction().setFunctionName(
    "handleFolderCopyAbortJobBtnClick"
  );
  const abortCopyJobBtn =
    CardService.newTextButton().setOnClickAction(abortCopyJobAction);
  const refreshCopyJobResultsBtnAction =
    CardService.newAction().setFunctionName(
      "handleRefreshCopyJobResultsBtnClick"
    );
  const refreshCopyJobResultsBtn = CardService.newTextButton().setOnClickAction(
    refreshCopyJobResultsBtnAction
  );

  const folderCopyJobBtnsSet = CardService.newButtonSet()
    .addButton(refreshCopyJobResultsBtn)
    .addButton(abortCopyJobBtn);

  const copyFolderJobDescriptionBtnsSec =
    CardService.newCardSection().addWidget(folderCopyJobBtnsSet);

  folderCopyJobDescriptionSec
    .addWidget(folderCopyDestination)
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
