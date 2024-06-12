function execute() {
	const { SQUARE } = CARDSERVICE_VARS;
	const { createHeader } = CardServices;
	const folderCopyCardHeader = createHeader(
		"Folder Copy",
		IMGS.COPY_ICON,
		"folder_copy_icon",
		SQUARE,
		"yo thereeee!.",
	);
	const card = CardService.newCardBuilder()
		.setHeader(folderCopyCardHeader)
		.build();
	const x = CardService.newNavigation().pushCard(card);

	return x;
}

function displayFolderCards() {
	const { createHeader } = CardServices;

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

	const deepCopyHeader = createHeader(
		"Deep Copy",
		IMGS.ICON_COPY_FOLDER_OPT,
		"deep_copy_icon",
		CardService.ImageStyle.SQUARE,
		"Copy folders and their contents.",
	);
	const deepCopyCard = CardService.newCardBuilder()
		.setHeader(deepCopyHeader)
		.build();

	const navigation = CardService.newNavigation()
		.pushCard(copyFolderStructureOptCard)
		.pushCard(deepCopyCard);

	const actionResponse = CardService.newActionResponseBuilder()
		.setNavigation(navigation)
		.build();

	return actionResponse;
}

const HomeCards = (() => {
	const { createHeader } = CardServices;

	type TParameters = { [key: string]: string };

	function handleCardClick(fnName: string, parameters: TParameters = {}) {
		return CardService.newCardAction().setOnClickAction(
			CardService.newAction().setFunctionName(fnName).setParameters(parameters),
		);
	}

	function createHomePgCards() {
		const { SQUARE } = CARDSERVICE_VARS;

		const mainMenuHeader = CardService.newCardHeader().setTitle("Tools");

		const reviewAndFeedbackHeader = createHeader(
			"Feedback & Review",
			"",
			"",
			SQUARE,
			"",
		);
		const reviewAndFeedbackTitleCard = CardService.newCardBuilder()
			.setHeader(reviewAndFeedbackHeader)
			.build();

		const feedbackHeader = createHeader(
			"Feedback",
			IMGS.FEEDBACK_ICON,
			"subscription_icon",
			SQUARE,
			"Give us feedback or contact us. We want to improve!",
		);
		const reviewHeader = createHeader(
			"Review",
			IMGS.FIVE_STAR_ICON,
			"review_icon",
			SQUARE,
			"Give us a rating 👍!",
		);
		const reviewCard = CardService.newCardBuilder()
			.setHeader(reviewHeader)
			.build();
		const feedbackCard = CardService.newCardBuilder()
			.setHeader(feedbackHeader)
			.build();

		const titleHeaderForSubscriptionSec = createHeader(
			"Subscription",
			"",
			"",
			SQUARE,
			"",
		);
		const titleCardForSubscriptionSec = CardService.newCardBuilder()
			.setHeader(titleHeaderForSubscriptionSec)
			.build();

		const subscriptionSecHeader = createHeader(
			"Your Subscription",
			IMGS.SUBSCRIPTION_ICON,
			"SUBSCRIPTION_ICON",
			SQUARE,
			"View or update your subscription.",
		);
		const subscriptionSecCard = CardService.newCardBuilder()
			.setHeader(subscriptionSecHeader)
			.build();

		const folderCopyCardHeader = createHeader(
			"Folder Copy",
			IMGS.COPY_ICON,
			"folder_copy_icon",
			SQUARE,
			"Copy all or some items of a folder or just its structure.",
		);
		const cardAction = CardService.newAction().setFunctionName("execute");
		const copyFolderContentOpt = CardService.newTextButton()
			.setText("Copy items.")
			.setBackgroundColor("#7AC4FB")
			.setOnClickAction(cardAction);
		const copyFolderStructureOpt = CardService.newTextButton()
			.setText("Copy structures.")
			.setBackgroundColor("#7AC4FB")
			.setOnClickAction(cardAction);
		const header = createHeader(
			"Deep Copy",
			IMGS.ICON_COPY_FOLDER_OPT,
			"deep_copy_icon",
			SQUARE,
			"Copy all items.",
		);
		const txt = CardService.newTextParagraph().setText(
			"Copy the content (the sub files/folders) of the selected folders.",
		);
		const copyFolderStructureTxt = CardService.newTextParagraph().setText(
			"Copy only the sub folders of the parent folders (structure).",
		);
		const copyFolderItemsSection = CardService.newCardSection()
			.setHeader(
				"Copy the contents (the sub files/folders) of the selected folders.",
			)
			.addWidget(copyFolderContentOpt);
		// RESPOND TO THE USER CLICKING ON A FOLDER
		// GET ITS ID
		// SEND A REQUEST TO COPY THAT FOLDER TO YOUR RUST SERVER
		const copyFolderStructureSection = CardService.newCardSection()
			.setHeader("Copy only the sub folders of the parent folders (structure).")
			.addWidget(copyFolderStructureOpt);
		const folderCopyCard = CardService.newCardBuilder()
			.setHeader(folderCopyCardHeader)
			.addSection(copyFolderItemsSection)
			.addSection(copyFolderStructureSection)
			.build();
		const shareCardHeader = createHeader(
			"Share",
			IMGS.SHARE_ICON,
			"share_icon",
			SQUARE,
			"Share multiple folders/files regardless if they are nested.",
		);
		const shareCard = CardService.newCardBuilder()
			.setHeader(shareCardHeader)
			.build();
		const permissionsCardHeader = createHeader(
			"Permissions",
			IMGS.PERMISSIONS_ICON,
			"permissions_icon",
			SQUARE,
			"Revoke access for multiple users. Search permissions by email.",
		);
		const permissionsCard = CardService.newCardBuilder()
			.setHeader(permissionsCardHeader)
			.build();
		const tools = [folderCopyCard, shareCard, permissionsCard];
		const subscriptionVals = [titleCardForSubscriptionSec, subscriptionSecCard];
		const feedbackAndReview = [
			reviewAndFeedbackTitleCard,
			feedbackCard,
			reviewCard,
		];

		return [...tools, ...subscriptionVals, ...feedbackAndReview];
	}

	return {
		createHomePgCards,
	};
})();
