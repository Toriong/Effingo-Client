/**
 * All renders will be placed in this file.
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
	const { createHomePgCards } = HomeCards;

	return createHomePgCards();
}
