const HomeCards = (() => {
	const { createHeader } = CardServices;

	type TParameters = { [key: string]: string };

	function handleCardClick(fnName: TRenders, parameters: TParameters = {}) {
		return CardService.newCardAction().setOnClickAction(
			CardService.newAction().setFunctionName(fnName).setParameters(parameters),
		);
	}

	/**
	 *
	 * @remarks
	 * Creates all of the cards that is displayed on the main menu of the home page.
	 *
	 * @returns Retruns each card of the home page.
	 *
	 * @beta
	 */
	function createHomePgCards() {
		// GOAL: when the user clicks on the folder copy card, present the follwoing cards:
		// -Deep Copy
		// -Structure Copy
		const { SQUARE } = CARDSERVICE_VARS;
		const mainMenuHeader = CardService.newCardBuilder()
			.setHeader(CardService.newCardHeader().setTitle("Tools"))
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
		const folderCopyCardHeader = createHeader(
			"Folder Copy",
			IMGS.COPY_ICON,
			"folder_copy_icon",
			SQUARE,
			"Copy all or some items of a folder or just its structure.",
		);
		const action = CardService.newAction().setFunctionName(
			"handleCopyFolderPgRender",
		);
		const cardAction = CardService.newCardAction().setOnClickAction(action);
		const folderCopyCard = CardService.newCardBuilder()
			.addCardAction(cardAction)
			.setHeader(folderCopyCardHeader)
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
		const tools = [mainMenuHeader, folderCopyCard, shareCard, permissionsCard];
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
