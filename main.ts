/**
 * All renders will be placed in this file.
 */
type TRenders = keyof typeof Renders;

const Renders = { handleHomePgRender };

function handleHomePgRender() {
  const token = ScriptApp.getOAuthToken();
  request.post({ map: token });

  return HomeCards.createHomePgCards();
}
