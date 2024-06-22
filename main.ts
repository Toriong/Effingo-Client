/**
 * All renders will be placed in this file.
 */
type TRenders = keyof typeof Renders;

const Renders = { handleHomePgRender };

function handleHomePgRender() {
  return HomeCards.createHomePgCards();
}

function example() {
  let response = UrlFetchApp.fetch("URL", { payload: "HI" });
  const userPropertyService = PropertiesService.getUserProperties();
  const userCache = CacheService.getUserCache();
}
