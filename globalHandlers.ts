function handleOnDriveItemsSelected(event: IGScriptAppEvent) {
	request.post({ map: JSON.stringify({ yoThere: event }) });

	const { getUserPropertyParsed, setUserProperty, getUserProperty } =
		GLOBAL_FNS;
	let copyFoldersInfo =
		getUserPropertyParsed<TFoldersToCopyInfo>("foldersToCopyInfo");
	copyFoldersInfo =
		copyFoldersInfo && Object.keys(copyFoldersInfo).length > 0
			? copyFoldersInfo
			: {};
	let copyFolderDestinationName = `${event.drive.activeCursorItem?.title} COPY`;

	if (
		copyFoldersInfo &&
		event.drive.activeCursorItem?.id &&
		copyFoldersInfo[event.drive.activeCursorItem.id]
	) {
		// the user has already selected the copy folder destination
		// present the name of the copy folder destination
		copyFolderDestinationName =
			copyFoldersInfo[event.drive.activeCursorItem.id]
				.copyDestinationFolderName;
	} else if (
		event.drive.activeCursorItem?.id &&
		!copyFoldersInfo[event.drive.activeCursorItem.id]
	) {
		// the user has not selected the copy folder destination
		const folderCopyDestination = {
			[event.drive.activeCursorItem.id]: {
				copyDestinationFolderName: copyFolderDestinationName,
			},
		} as TFoldersToCopyInfo;
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
