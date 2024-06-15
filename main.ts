/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	const { createHomePgCards } = HomeCards;

	setUserProperty("isOnItemSelectedResultPg", false);

	return createHomePgCards();
}

function renderCopyFolderCardPg(event: IGScriptAppEvent) {
	if (!event.parameters) {
		return;
	}

	const {
		headerTxt,
		gdriveItemNamesParsable,
		hasIsOnItemSelectedResultPgBeenSet,
	} = event.parameters;

	if (!hasIsOnItemSelectedResultPgBeenSet) {
		setUserProperty("isOnItemSelectedResultPg", true);
	}

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
		const actionResponse =
			CardService.newActionResponseBuilder().setNavigation(nav);

		return actionResponse.build();
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
	const actionResponse =
		CardService.newActionResponseBuilder().setNavigation(nav);

	return actionResponse.build();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
