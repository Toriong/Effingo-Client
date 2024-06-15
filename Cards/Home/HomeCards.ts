const HomeCards = (() => {
	const { createHeader } = CardServices;

	type TParameters = { [key: string]: string };

	function handleCardClick(fnName: string, parameters: TParameters = {}) {
		return CardService.newCardAction().setOnClickAction(
			CardService.newAction().setFunctionName(fnName).setParameters(parameters),
		);
	}

	function createHomeCardSection(
		headerTxt: string,
		btnTxt: string,
		backgroundColor: string,
		fnName: string,
		fnParameters: TParameters = {},
	) {
		const cardAction = CardService.newAction()
			.setFunctionName(fnName)
			.setParameters(fnParameters);
		const textButton = CardService.newTextButton()
			.setText(btnTxt)
			.setBackgroundColor(backgroundColor)
			.setOnClickAction(cardAction);
		const cardSection = CardService.newCardSection()
			.setHeader(headerTxt)
			.addWidget(textButton);

		return cardSection;
	}

	function createCopyFoldersSec() {
		const cardAction = CardService.newAction()
			.setFunctionName("renderSelectedGdriveItemsPg")
			.setParameters({ headerTxt: "Copy all items of selected folder." });
		const copyFolderContentOpt = CardService.newTextButton()
			.setText("Copy items")
			.setBackgroundColor("#7AC4FB")
			.setOnClickAction(cardAction);
		const copyFolderItemsSection = CardService.newCardSection()
			.setHeader(
				"Copy the contents (the sub files/folders) of the selected folders.",
			)
			.addWidget(copyFolderContentOpt);
		const copyFolderStructureSection = createHomeCardSection(
			"Copy only the sub folders of the selected parent folders (structure).",
			"Copy structures",
			"#7AC4FB",
			"handleCopyFolderStructureBtn",
			{
				headerTxt:
					"Copy the structure (just the folders) of the selected folders.",
			},
		);

		return {
			copyFolderItemsSection,
			copyFolderStructureSection,
		};
	}

	function createPermissionsSec() {
		const revokePermissionsSec = createHomeCardSection(
			"Revoke all or some permissions for a file or folder.",
			"Revoke permissions.",
			COLORS.ACTION_BTN_COLOR,
			"handleCopyFolderStructureBtn",
		);
		const permissionsSearchSec = createHomeCardSection(
			"Search for a specific permission.",
			"Permissions search.",
			COLORS.ACTION_BTN_COLOR,
			"handleCopyFolderStructureBtn",
		);

		return { permissionsSearchSec, revokePermissionsSec };
	}

	function createToolCards() {
		const { SQUARE } = CARDSERVICE_VARS;
		const { copyFolderItemsSection, copyFolderStructureSection } =
			createCopyFoldersSec();
		const { permissionsSearchSec, revokePermissionsSec } =
			createPermissionsSec();
		const folderCopyCardHeader = createHeader(
			"Folder Copy",
			IMGS.COPY_ICON,
			"folder_copy_icon",
			SQUARE,
			"Copy all or some items of a folder or just its structure.",
		);
		const folderCopyCard = CardService.newCardBuilder()
			.setHeader(folderCopyCardHeader)
			.addSection(copyFolderItemsSection)
			.addSection(copyFolderStructureSection)
			.build();
		const titleHeaderForToolsSec = createHeader("Tools", "", "", SQUARE, "");
		const titleCardForToolsSec = CardService.newCardBuilder()
			.setHeader(titleHeaderForToolsSec)
			.addSection(copyFolderItemsSection)
			.addSection(copyFolderStructureSection)
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
			.addSection(revokePermissionsSec)
			.addSection(permissionsSearchSec)
			.build();
		const shareCardHeader = createHeader(
			"Ultra-Share",
			IMGS.SHARE_ICON,
			"share_icon",
			SQUARE,
			"Share multiple folders/files regardless if they are nested.",
		);
		const shareCard = CardService.newCardBuilder()
			.setHeader(shareCardHeader)
			.build();

		return [titleCardForToolsSec, folderCopyCard, permissionsCard, shareCard];
	}

	function createHomePgCards() {
		const { SQUARE } = CARDSERVICE_VARS;
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
		const subscriptionVals = [titleCardForSubscriptionSec, subscriptionSecCard];
		const feedbackAndReview = [
			reviewAndFeedbackTitleCard,
			feedbackCard,
			reviewCard,
		];
		const toolsCards = createToolCards();

		return [...toolsCards, ...subscriptionVals, ...feedbackAndReview];
	}

	return {
		createHomePgCards,
	};
})();
