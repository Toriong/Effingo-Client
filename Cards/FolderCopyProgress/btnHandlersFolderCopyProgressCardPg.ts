function handleFolderCopyAbortJobBtnClick() {}

function handleRefreshCopyJobResultsBtnClick(event: IGScriptAppEvent) {
  // GOAL: get the status of the current copy folder job
  // the id of the copy folder job, will_get_status_only will be set to true
  // create fn a api service that will send a request to your server that will get the status
  // call it getCopyFolderJobStatus
  // -it will return one of the following strings: "ongoing" | "succes" | "failure" | "statusRetrievalFailure"
  const foldersSelected =
    GLOBAL_FNS.getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  const {
    folderToCopyErrMsg,
    folderToCopyId,
    folderNameToCopy,
    folderCopyStatus,
    txtIsCopyingTheSamePermissions,
    txtIsCopyingOnlyFolders,
    copyFolderJobId,
  } = event.parameters;

  if (
    !folderToCopyId ||
    !folderNameToCopy ||
    folderToCopyErrMsg ||
    (folderToCopyId && foldersSelected && !foldersSelected[folderToCopyId]) ||
    !folderCopyStatus ||
    !txtIsCopyingOnlyFolders ||
    !txtIsCopyingTheSamePermissions
  ) {
    return;
  }

  const { status } = apiServices.getCopyFolderJobResult(copyFolderJobId);
  event.parameters = {
    ...event.parameters,
    folderCopyStatus: status,
    cardUpdateMethod: "update",
  };

  return renderCopyFolderProgressCard(event);
}
