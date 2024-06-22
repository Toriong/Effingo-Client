/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
  return HomeCards.createHomePgCards();
}

function deleteGdriveItemSelection() {
  // store all selected items into the user property
}

const Renders = { handleHomePgRender };

type TRenders = keyof typeof Renders;
