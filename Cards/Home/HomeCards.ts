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
		const cardAction = CardService.newAction();
		// GOAL: when the user is on the folder selection card, and selects a folder,
		// have the following to occur:
		// -don't show the back button

		// WHAT YOU ARE ABLE TO DO:
		// -present the home card?
		// -call the function that renders the home page

		cardAction.setFunctionName("renderCopyFolderCardPg").setParameters({
			headerTxt: "The selected folder to copy will appear below: ",
		});

		const copyFolderContentOptBtn = CardService.newTextButton()
			.setText("Copy items")
			.setBackgroundColor("#7AC4FB")
			.setOnClickAction(cardAction);
		const copyFolderItemsSection = CardService.newCardSection()
			.setHeader(
				"Copy the contents (the sub files/folders) of the selected folders.",
			)
			.addWidget(copyFolderContentOptBtn);
		const copyFolderStructureSection = createHomeCardSection(
			"Copy only the sub folders of the selected parent folders (structure).",
			"Copy structures",
			"#7AC4FB",
			"renderCopyFolderCardPg",
			{
				headerTxt:
					"The selected folders to copy their structure will appear below: ",
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
			"Share multiple folders/files at once regardless if they are nested.",
		);
		const shareCard = CardService.newCardBuilder()
			.setHeader(shareCardHeader)
			.build();

		return [titleCardForToolsSec, folderCopyCard, permissionsCard, shareCard];
	}

	function createHomePgCards() {
		const { SQUARE } = CARDSERVICE_VARS;
		const headerSection = CardService.newCardSection();
		const headerTxtParagraph = CardService.newTextParagraph().setText(
			"Permissions & Folder Copy",
		);

		headerSection.addWidget(headerTxtParagraph);

		const permissionsAndFolderHeader = CardService.newCardHeader()
			.setTitle("CLICK A FOLDER OR FILE")
			.setImageUrl(IMGS.HOME)
			.setSubtitle(
				"Click the folder that you want to copy or update its permissions.",
			);
		const permissionsCardHeaderTxt = CardService.newDecoratedText()
			.setText(
				"See what permissions that users have for your folders and files.",
			)
			.setWrapText(true);
		const ultraShareSectionTxt = CardService.newDecoratedText()
			.setText(
				"Share multiple folders and files at once regardless if they are nested. <i>This feature is only available for our chrome extension version.</i>",
			)
			.setWrapText(true);
		const hoverPermissionsTxt = CardService.newDecoratedText()
			.setText(
				"View the permissions of the files or folders when you hover over them. <i>This feature is only available for our chrome extension version.</i>",
			)
			.setWrapText(true);
		const moreToolsHeaderTxt = CardService.newDecoratedText()
			.setText("<b>More Tools: </b>")
			.setWrapText(true);
		const pastAndCurrentJobsTxt = CardService.newDecoratedText()
			.setText("<b>Past And Ongoing Copy Jobs: </b>")
			.setWrapText(true);
		const currentJobsTxt = CardService.newDecoratedText()
			.setText("View your ongoing copy jobs.")
			.setWrapText(true);
		const pastJobsTxt = CardService.newDecoratedText()
			.setText("View your past copy jobs.")
			.setWrapText(true);
		const searchIconBtnAction = CardService.newAction().setFunctionName(
			"handlePermissionsSearchBtnClick",
		);
		const searchIconBtn = CardService.newImageButton()
			.setIconUrl(IMGS.SEARCH)
			.setAltText("Search For Permissions.")
			.setOnClickAction(searchIconBtnAction);
		const viewPastJobBtn = CardService.newImageButton()
			.setIconUrl(IMGS.JOBS_PAST)
			.setAltText("View past jobs.")
			.setOnClickAction(searchIconBtnAction);
		const currentJobsImageBtn = CardService.newImageButton()
			.setIconUrl(IMGS.JOBS_CURRENT)
			.setAltText("View ongoing jobs.")
			.setOnClickAction(searchIconBtnAction);
		const linkIconBtn = CardService.newImageButton()
			.setIconUrl(IMGS.LINK)
			.setAltText("Open or download extension.")
			.setOnClickAction(searchIconBtnAction);
		const moreToolsSection =
			CardService.newCardSection().addWidget(moreToolsHeaderTxt);
		const pastAndCurrentCopyJobsHeaderSec =
			CardService.newCardSection().addWidget(pastAndCurrentJobsTxt);
		const permissionsSec = CardService.newCardSection()
			.setHeader("Permissions Search")
			.addWidget(permissionsCardHeaderTxt)
			.addWidget(searchIconBtn);
		const pastJobsSec = CardService.newCardSection()
			.addWidget(pastJobsTxt)
			.addWidget(viewPastJobBtn);
		const currentJobsSec = CardService.newCardSection()
			.addWidget(currentJobsTxt)
			.addWidget(currentJobsImageBtn);
		const ultraShareSection = CardService.newCardSection()
			.setHeader("Ultra Share!")
			.addWidget(ultraShareSectionTxt)
			.addWidget(linkIconBtn);
		const permissionsOnHoverSection = CardService.newCardSection()
			.setHeader("Hover Permissions")
			.addWidget(hoverPermissionsTxt)
			.addWidget(linkIconBtn);
		const primaryBtnAction = CardService.newAction().setFunctionName(
			"handlePrimaryBtnClick",
		);
		const primaryBtn = CardService.newTextButton()
			.setText("Review us!")
			.setOnClickAction(primaryBtnAction);
		const secondaryBtnAction = CardService.newAction().setFunctionName(
			"handleSecondaryBtnClick",
		);
		const secondaryBtn = CardService.newTextButton()
			.setText("Contact/Feedback.")
			.setOnClickAction(secondaryBtnAction);
		const footer = CardService.newFixedFooter()
			.setPrimaryButton(primaryBtn)
			.setSecondaryButton(secondaryBtn);
		const permissionsAndFolderCopyCard = CardService.newCardBuilder()
			.setHeader(permissionsAndFolderHeader)
			.setName("Home")
			.addSection(moreToolsSection)
			.addSection(permissionsSec)
			.addSection(ultraShareSection)
			.addSection(permissionsOnHoverSection)
			.addSection(pastAndCurrentCopyJobsHeaderSec)
			.addSection(pastJobsSec)
			.addSection(currentJobsSec)
			.setFixedFooter(footer)
			.build();
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

		return permissionsAndFolderCopyCard;
	}

	return {
		createHomePgCards,
	};
})();
