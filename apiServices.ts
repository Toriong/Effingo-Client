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
      const responseResult = request.post(
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

      if (responseResult.errMsg) {
        throw new Error(
          `Failed to get the gdrive items of the target folder. Error message from server: ${responseResult.errMsg}`
        );
      }

      if (!responseResult.parsableData) {
        throw new Error("Did not receive a body from the server response.");
      }

      const responseBody = JSON.parse(responseResult.parsableData) as {
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
    try {
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
      const responseResult = request.post(
        { ...reqBody },
        `/${API_PATHS.copyFolders}`
      );

      if (responseResult.errMsg) {
        throw new Error(
          `Failed to get the gdrive items of the target folder. Error message from server: ${responseResult.errMsg}`
        );
      }

      if (
        !responseResult.parsableData ||
        !GLOBAL_FNS.getIsParsable(responseResult.parsableData)
      ) {
        throw new Error(
          "Did not receive either a body or parsable body from the server response."
        );
      }
      const responseBody = JSON.parse(responseResult.parsableData) as {
        copyFolderJobStatus: string;
      };

      return {
        copyFolderJobId,
        copyFolderJobStatus: responseBody.copyFolderJobStatus,
      };
    } catch (error) {
      return {
        copyFolderJobStatus: "failedToSendCopyFolderReq",
        errMsg: `Failed to start the folder copy job. Error message: ${error}`,
      };
    }
  }

  return {
    getGdriveItems,
    sendCopyFolderReq,
  };
})();
