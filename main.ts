/**
 * All renders will be placed in this file.
 */

function handleHomePgRender() {
  return HomeCards.createHomePgCards();
}

function deleteGdriveItemSelection() {
  // store all selected items into the user property
}

function getGdriveItems<TData>(
  parentFolderId = "root",
  queryLimit = 100,
  pageSize = 100,
  gdriveNextPageToken = "",
  gdriveItemType: TGdriveItemTypes = "application/vnd.google-apps.folder"
) {
  try {
    const token = ScriptApp.getOAuthToken();
    const responseBodyStringified = request.post(
      {
        gdrive_item_type: gdriveItemType,
        parent_folder_id: parentFolderId,
        gdrive_access_token: token,
        gdrive_next_page_token: gdriveNextPageToken,
        page_size: pageSize.toString(),
        query_limit: queryLimit.toString(),
      },
      "get-gdrive-items"
    );

    if (!responseBodyStringified) {
      throw new Error("Failed to get the gdrive items of the target folder.");
    }

    const responseBody = JSON.parse(responseBodyStringified) as {
      data: string;
    };
    const responseBodyData = JSON.parse(responseBody.data) as TData;

    return { data: responseBodyData };
  } catch (error) {
    const errMsg = `Failed to get target gdrive items. Reason: ${error}`;

    return { errMsg };
  }
}

const Renders = { handleHomePgRender };

type TRenders = keyof typeof Renders;
