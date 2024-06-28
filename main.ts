/**
 * All renders will be placed in this file.
 */
type TRenders = keyof typeof Renders;

const Renders = { handleHomePgRender };

function handleHomePgRender() {
  // GLOBAL_FNS.deleteUserProperties(["selectableCopyFolderDestinations"]);
  GLOBAL_FNS.resetUserProperties();

  return HomeCards.createHomePgCards();
}
