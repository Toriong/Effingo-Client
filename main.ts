/**
 * All renders will be placed in this file.
 */
type TRenders = keyof typeof Renders;

const Renders = { handleHomePgRender };

function handleHomePgRender() {
  return HomeCards.createHomePgCards();
}
