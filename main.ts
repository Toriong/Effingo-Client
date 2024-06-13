/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
	const { createHomePgCards } = HomeCards;

	const triggers = ScriptApp.getProjectTriggers();

	for (const trigger of triggers) {
		ScriptApp.deleteTrigger(trigger);
	}

	return createHomePgCards();
}

function handleCopyFolderPgRender() {
	const { createFolderCopyCards } = FolderCopyCards;

	return createFolderCopyCards();
}

const Renders = { handleHomePgRender, handleCopyFolderPgRender };

type TRenders = keyof typeof Renders;
