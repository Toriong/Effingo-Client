/**
 * This simple Google Workspace Add-on shows a random image of a cat in the
 * sidebar. When opened manually (the homepage card), some static text is
 * overlayed on the image, but when contextual cards are opened a new cat image
 * is shown with the text taken from that context (such as a message's subject
 * line) overlaying the image. There is also a folderButtonCopy that updates the card with
 * a new random cat image.
 *
 * Click "File > Make a copy..." to copy the script, and "Publish > Deploy from
 * manifest > Install add-on" to install it.
 */

/**
 * Returns the cards of the main menu.
 *
 * @remarks
 * Handles the render of the home page.
 *
 * @returns Retruns the cards to display on the home page.
 *
 * @beta
 */
function handleHomePgRender() {
	const message = "";

	return createHomePgCards(message, true);
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
function createHomePgCards(text: string, isHomepage: boolean) {
	// Explicitly set the value of isHomepage as false if null or undefined.

	// Use the "Cat as a service" API to get the cat image. Add a "time" URL
	// parameter to act as a cache buster.
	const now = new Date();
	const caption = text.replace(/\//g, " ");
	const imageUrl = Utilities.formatString(
		"https://cataas.com/cat/says/%s?time=%s",
		encodeURIComponent(caption),
		now.getTime(),
	);
	const image = CardService.newImage().setImageUrl(imageUrl).setAltText("Meow");
	const action = CardService.newAction()
		.setFunctionName("onChangeCat")
		.setParameters({ text: text, isHomepage: isHomepage.toString() });
	const folderCopyBtn = CardService.newTextButton()
		.setText("Folder Copy")
		.setOnClickAction(action)
		.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
	const shareBtn = CardService.newTextButton()
		.setText("Share")
		.setOnClickAction(action)
		.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
	const permissionsBtn = CardService.newTextButton()
		.setText("Permissions")
		.setOnClickAction(action)
		.setTextButtonStyle(CardService.TextButtonStyle.FILLED);
	const buttonSet = CardService.newButtonSet()
		.addButton(folderCopyBtn)
		.addButton(shareBtn)
		.addButton(permissionsBtn);

	// Create a footer to be shown at the bottom.
	const footer = CardService.newFixedFooter().setPrimaryButton(
		CardService.newTextButton()
			.setText("Powered by cataas.com")
			.setOpenLink(CardService.newOpenLink().setUrl("https://cataas.com")),
	);

	// Assemble the widgets and return the card.
	const section = CardService.newCardSection()
		.addWidget(image)
		.addWidget(buttonSet);
	const card = CardService.newCardBuilder()
		.addSection(section)
		.setFixedFooter(footer);

	if (!isHomepage) {
		// Create the header shown when the card is minimized,
		// but only when this card is a contextual card. Peek headers
		// are never used by non-contexual cards like homepages.
		const peekHeader = CardService.newCardHeader()
			.setTitle("Contextual Cat")
			.setImageUrl(
				"https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
			)
			.setSubtitle(text);
		card.setPeekCardHeader(peekHeader);
	}

	const btnsSection = CardService.newCardSection().addWidget(buttonSet);
	const homeCard = CardService.newCardBuilder().addSection(btnsSection);

	// Folder:
	// -Copy all items in a folder
	// -Copy folder structure

	// Share:
	// "Select the folders and files that you want to share."

	// Permissions:
	// -Revoke access
	// -Update permissions
	// -Search for user

	const headerCard = CardService.newCardBuilder()
		.setHeader(CardService.newCardHeader().setTitle("Tools"))
		.build();
	const { SQUARE } = CARDSERVICE_VARS;
	const folderCopyCardHeader = createHeader(
		"Folder Copy",
		IMGS.COPY_ICON,
		"folder_copy_icon",
		SQUARE,
		"Copy all or some items of a folder or just its structure.",
	);
	const folderCopyCard = CardService.newCardBuilder()
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

	return [headerCard, folderCopyCard, shareCard, permissionsCard];
}

type TImageStyle =
	| typeof CardService.ImageStyle.CIRCLE
	| typeof CardService.ImageStyle.SQUARE;

function createHeader(
	title: string,
	imgUrl: string,
	imgAlt: string,
	imgStyle: TImageStyle = CardService.ImageStyle.SQUARE,
	subTitle = "",
) {
	const header = CardService.newCardHeader()
		.setTitle(title)
		.setSubtitle(subTitle)
		.setImageUrl(imgUrl)
		.setImageAltText(imgAlt)
		.setImageStyle(imgStyle);

	return header;
}

/**
 * Callback for the "Change cat" folderButtonCopy.
 * @param {Object} e The event object, documented {@link
 *     https://developers.google.com/gmail/add-ons/concepts/actions#action_event_objects
 *     here}.
 * @return {CardService.ActionResponse} The action response to apply.
 */
function onChangeCat() {}

/**
 * Truncate a message to fit in the cat image.
 * @param {string} message The message to truncate.
 * @return {string} The truncated message.
 */
function truncate(message: string) {}
