const apiServices = (() => {
  interface ISendCopyFolderReqBody {
    folder_copy_procedure_id: string;
    access_token: string;
    copy_to_folder_id: string;
    folder_id_to_copy_from: string;
    name_of_folder_to_create: string;
    copy_from_folder_name: string;
    date_of_copy: string;
    recipient_email: string;
    recipient_email_greetings_name: string;
    copy_destination_folder_name: string;
  }
  interface IGetCopyFolderJobResultReqBody {
    copy_folder_job_id: string;
    will_get_status_only: boolean;
    will_skip_cache_query: boolean;
    will_query_db_if_job_not_present_in_cache: boolean;
  }
  interface ICopyFolderJobResult {
    status: TFolderCopyStatus;
    copy_folder_job_results?: { [key: string]: string }[];
    copy_folder_job_total_time_ms?: number;
  }
  type ISendCopyFolderReqReturnVal = {
    copyFolderJobId?: string;
    copyFolderJobStatus:
      | "attemptingToSendCopyFolderJobReq"
      | "failedToSendCopyFolderReq";
    errMsg?: string;
  };

  const API_PATHS = {
    startCopyFolderJob: "/start-copy-folder-job",
    getCopyFolderJobResults: "/get-copy-folder-job-result",
    getGdriveItems: "/get-gdrive-items",
    copyFolder: "/copy-files",
    main: "/",
  } as const;

  function getCopyFolderJobResult(
    copyFolderJobId: string,
    willGetStatusOnly = false,
    willSkipCacheQuery = false,
    willQueryDbIfJobIsntCache = false
  ): ICopyFolderJobResult {
    const reqBody: IGetCopyFolderJobResultReqBody = {
      copy_folder_job_id: copyFolderJobId,
      will_get_status_only: willGetStatusOnly,
      will_skip_cache_query: willSkipCacheQuery,
      will_query_db_if_job_not_present_in_cache: willQueryDbIfJobIsntCache,
    };
    const responseBody = request.post(
      { ...reqBody },
      API_PATHS.getCopyFolderJobResults
    );

    if (
      responseBody.errMsg ||
      !responseBody.parsableData ||
      (responseBody.parsableData &&
        !GLOBAL_FNS.getIsParsable(responseBody.parsableData))
    ) {
      return { status: "UNABLE TO RETRIEVE STATUS" };
    }

    const folderCopyResultsParsable = JSON.parse(responseBody.parsableData) as {
      data: string;
    };

    return JSON.parse(folderCopyResultsParsable.data) as ICopyFolderJobResult;
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
      const responseResult = request.post(
        {
          gdrive_item_type: gdriveItemType,
          parent_folder_id: parentFolderId,
          gdrive_access_token: token,
          gdrive_next_page_token: gdriveNextPageToken,
          page_size: pageSize.toString(),
          query_limit: queryLimit.toString(),
        },
        API_PATHS.getGdriveItems
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

  /**
   * @param copyDestinationFolderName - Pass the name of the folder to copy the content to. This folder will be either created on the server or has been created
   * by the user.
   * @param copyToFolderId - If the folder was created already, then pass its id.
   * @param nameOfFolderToCreate - Only pass a value if the user hasn't created the copy destination folder.
   */
  function sendCopyFolderReq(
    folderToCopyId: string,
    folderToCopyName: string,
    copyDestinationFolderName: string,
    nameOfFolderToCreate: string,
    copyToFolderId?: string
  ): ISendCopyFolderReqReturnVal {
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
        "/start-copy-folder-job"
      );

      if (responseResult.errMsg) {
        throw new Error(`Error message from server: ${responseResult.errMsg}`);
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
        copyFolderJobStatus:
          | "attemptingToSendCopyFolderJobReq"
          | "failedToSendCopyFolderReq";
      };

      return {
        copyFolderJobId,
        copyFolderJobStatus: responseBody.copyFolderJobStatus,
      };
    } catch (error) {
      return {
        copyFolderJobStatus: "failedToSendCopyFolderReq",
        errMsg:
          error.message ??
          "Failed to start the copy job for the target folder.",
      };
    }
  }

  return {
    getGdriveItems,
    sendCopyFolderReq,
    getCopyFolderJobResult,
    API_PATHS,
  };
})();
