function handleOnDriveItemsSelected(event: IGScriptAppEvent) {
  const { getUserPropertyParsed, setUserProperty, getUserProperty } =
    GLOBAL_FNS;
  let copyFoldersInfo =
    getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
  copyFoldersInfo =
    copyFoldersInfo && Object.keys(copyFoldersInfo).length > 0
      ? copyFoldersInfo
      : {};
  let copyFolderDestinationName = `${event.drive.activeCursorItem?.title} COPY`;
  request.post({
    map: JSON.stringify({
      activieCursorId: event.drive?.activeCursorItem?.id,
      copyFoldersInfo: copyFoldersInfo,
    }),
  });
  if (
    copyFoldersInfo &&
    event.drive.activeCursorItem?.id &&
    copyFoldersInfo[event.drive.activeCursorItem.id]
  ) {
    copyFolderDestinationName =
      copyFoldersInfo[event.drive.activeCursorItem.id]
        .copyDestinationFolderName;
  } else if (
    event.drive.activeCursorItem?.id &&
    !copyFoldersInfo[event.drive.activeCursorItem.id]
  ) {
    const folderCopyDestination = {
      [event.drive.activeCursorItem.id]: {
        copyDestinationFolderName: copyFolderDestinationName,
      },
    } as TFoldersToCopyInfo;
    request.post({ map: JSON.stringify("YO") });
    copyFoldersInfo = { ...copyFoldersInfo, ...folderCopyDestination };
    setUserProperty("foldersToCopyInfo", copyFoldersInfo);
  }
  const headerTxt = getUserProperty("headerTxtForGdriveSelectedResultsPg");

  if (!event.parameters) {
    event.parameters = {};
  }

  Object.assign(event.parameters, {
    headerTxt: JSON.parse(headerTxt as string),
    selectedFolderToCopyParsable: JSON.stringify(event.drive.activeCursorItem),
    copyDestinationFolder: copyFolderDestinationName,
  });

  return renderSelectGdriveItemCardPg(event);
}
