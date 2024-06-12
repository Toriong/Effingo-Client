const FolderCopyCards = (() => {
	const { createHeader } = CardServices;

	function createFolderCopyCards() {
		// create the Copy Folder card
		const copyFolderHeader = createHeader(
			"Deep Copy",
			IMGS.ICON_COPY_FOLDER_OPT,
			"copy_folder_opt_icon",
			CardService.ImageStyle.SQUARE,
			"Select a folder and copy all or some of its sub files and folders.",
		);
		const copyFolderItemsOptCard = CardService.newCardBuilder()
			.setHeader(copyFolderHeader)
			.build();
		const copyFolderStructureHeader = createHeader(
			"Structure copy",
			IMGS.ICON_FOLDER_STRUCTURE,
			"copy_folder_structure_icon",
			CardService.ImageStyle.SQUARE,
			"Copy only the folder's sub folders.",
		);
		const copyFolderStructureOptCard = CardService.newCardBuilder()
			.setHeader(copyFolderStructureHeader)
			.build();
		const navigation = CardService.newNavigation().updateCard(
			copyFolderStructureOptCard,
		);
		const actionResponse = CardService.newActionResponseBuilder()
			.setNavigation(navigation)
			.build();

		return actionResponse;
	}

	return { createFolderCopyCards };
})();
