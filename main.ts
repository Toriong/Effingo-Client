/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	const { createHomePgCards } = HomeCards;

	setCurrentUserCardPg("home");

	return createHomePgCards();
}

function renderSelectedGdriveItemsPg(
	headerTxt = "",
	gdriveItemNames?: string[],
) {
	const selectedGdriveItemSection = CardService.newCardSection();
	const deleteBtn = CardService.newImageButton().setIconUrl(IMGS.ICON_BIN);
	const divider = CardService.newDivider();
	const headerTxtParagraph = CardService.newTextParagraph().setText(headerTxt);

	selectedGdriveItemSection.addWidget(headerTxtParagraph);

	if (!gdriveItemNames?.length) {
		return CardService.newCardBuilder()
			.addSection(selectedGdriveItemSection)
			.build();
	}

	for (const gdriveItemName of gdriveItemNames) {
		const selectedGdriveItemName =
			CardService.newTextParagraph().setText(gdriveItemName);

		selectedGdriveItemSection.addWidget(selectedGdriveItemName);
		selectedGdriveItemSection.addWidget(deleteBtn);
		selectedGdriveItemSection.addWidget(divider);
	}

	return CardService.newCardBuilder()
		.addSection(selectedGdriveItemSection)
		.build();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
