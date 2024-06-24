const apiServices = (() => {
  const API_PATHS = {
    copyFolders: "copy-files",
  } as const;

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

  interface ISendCopyFolderReqBody {
    access_token: string;
    folder_id_to_copy_from: string;
    copy_to_folder_id: string;
    name_of_folder_to_create: string;
    folder_copy_procedure_id: string;
    copy_from_folder_name: string;
    date_of_copy: string;
    recipient_email: string;
    recipient_email_greetings_name: string;
    copy_destination_folder_name: string;
  }

  function sendCopyFolderReq(
    folderToCopyId: string,
    folderToCopyName: string,
    nameOfFolderToCreate?: string,
    copyDestinationFolderName?: string,
    copyToFolderId?: string
  ) {
    const userEmail = Session.getActiveUser().getEmail();
    const emailGreetingName = Drive.About.get().user.displayName;
    const copyFolderJobId = Utilities.getUuid();
    const dateOfCopy = GLOBAL_FNS.getCurrentDate({
      willFormatHours: true,
      willFormatMins: true,
      willFormatSeconds: true,
    });
    const reqBody: ISendCopyFolderReqBody = {
      copy_destination_folder_name: copyDestinationFolderName,
      copy_to_folder_id: copyToFolderId ?? "",
      date_of_copy: dateOfCopy,
      recipient_email: userEmail,
      recipient_email_greetings_name: emailGreetingName,
      access_token: ScriptApp.getOAuthToken(),
      folder_id_to_copy_from: folderToCopyId,
      copy_from_folder_name: folderToCopyName,
      name_of_folder_to_create: nameOfFolderToCreate,
      folder_copy_procedure_id: copyFolderJobId,
    };
  }

  // GOAL: this function will send the request that will copy the target folder for the user.
  // function name: sendCopyFolderReq
  // parameters:
  // folder_id_copy_from: string
  // copy_to_folder_id: string (present if the folder already exist)
  // copy_destination_folder_name: string (present if the folder already exist)
  // name_of_folder_to_create: (not present if the copy folder destination already exist)
  // folderToCopyName: string (the folder that is being copied)
  // recipient_email_greetings_name: string

  // function body:
  // will generate the folder_copy_procedure_id
  // will generate the date of the folder copy
  // the name of the user
  // will send the request to the following url: '{server_url}/start-copy-folder-job'
  // the post request will have the following body:
  // access_token: string
  // folder_id_copy_from: string
  // copy_to_folder_id: string (present if the folder already exist)
  // copy_destination_folder_name: string (present if the folder already exist)
  // name_of_folder_to_create: (not present if the copy folder destination already exist)
  // copy_from_folder_name: string (the folder that is being copied)
  // date_of_copy: string
  // recipient_email: string
  // folder_copy_procedure_id: string
  // recipient_email_greetings_name: string

  // the return value:
  // folder_copy_procedure_id

  // NOTES:
  // where do I get the email of the user who is using my app?

  return {
    getGdriveItems,
  };
})();
