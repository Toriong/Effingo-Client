/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	const { createHomePgCards } = HomeCards;

	// UrlFetchApp.fetch("https://c018f0e68a78c327e38baaf541e682c9.serveo.net", {
	// 	method: "post",
	// 	payload: {
	// 		map: JSON.stringify("hey"),
	// 	},
	// });

	setCurrentUserCardPg("home");

	return createHomePgCards();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	if (!event.parameters?.headerTxt) {
		return;
	}

	const { headerTxt, gdriveItemNamesParsable } = event.parameters;
	const selectedGdriveItemSection = CardService.newCardSection();
	const deleteBtn = CardService.newImageButton().setIconUrl(IMGS.ICON_BIN);
	const divider = CardService.newDivider();
	const headerTxtParagraph = CardService.newTextParagraph().setText(headerTxt);
	const gdriveItemNames: string[] | null = getIsParsable(
		gdriveItemNamesParsable,
	)
		? JSON.parse(gdriveItemNamesParsable)
		: null;

	selectedGdriveItemSection.addWidget(headerTxtParagraph);

	if (!gdriveItemNames?.length) {
		const card = CardService.newCardBuilder()
			.addSection(selectedGdriveItemSection)
			.build();
		const nav = CardService.newNavigation().popToRoot().updateCard(card);
		const actionresponse =
			CardService.newActionResponseBuilder().setNavigation(nav);
		// const nav = CardService.newNavigation().updateCard(card);

		return actionresponse.build();
	}

	for (const gdriveItemName of gdriveItemNames) {
		const selectedGdriveItemName =
			CardService.newTextParagraph().setText(gdriveItemName);

		selectedGdriveItemSection.addWidget(selectedGdriveItemName);
		selectedGdriveItemSection.addWidget(deleteBtn);
		selectedGdriveItemSection.addWidget(divider);
	}

	const card = CardService.newCardBuilder()
		.addSection(selectedGdriveItemSection)
		.build();
	const nav = CardService.newNavigation().updateCard(card);

	return nav;
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
