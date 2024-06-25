type TImageStyle =
  | typeof CardService.ImageStyle.CIRCLE
  | typeof CardService.ImageStyle.SQUARE;
type TCardPgs = "home" | "folderCopyOptions" | "selectedFoldersToCopy";
type TSelectedGdriveItemsKeyNames = "selectedFolders" | "selectedGdriveItems";
type TSelectedItemsProperty = Record<
  TSelectedGdriveItemsKeyNames,
  ISelectedItem[]
>;
type TUserPropertiesBoolKeys =
  | "isOnItemSelectedResultPg"
  | "hasIsOnItemSelectedResultPgBeenSet"
  | "isChangingTheCopyFolderDestination";
type TUserPropertiesBoolProperties = Record<TUserPropertiesBoolKeys, boolean>;
interface ICopyDestinationFolder {
  copyDestinationFolderId: string;
  copyDestinationFolderName: string;
  willCopyStructureOnly: boolean;
  willCopyPermissions: boolean;
}
type TMakeRequire<
  TObj extends object,
  TKeyName extends string | symbol
> = TKeyName extends keyof TObj
  ? TObj & { [key in TKeyName]-?: TObj[TKeyName] }
  : never;
type TGdriveItemTypes = "application/vnd.google-apps.folder";
type TFoldersToCopyInfo = Record<string, ICopyDestinationFolder>;
type TGdriveItemsFromServer = {
  id: string;
  name: string;
  mime_type: string;
  parents: string[];
};
type TFolderCopyStatus =
  | "ongoing"
  | "success"
  | "failure"
  | "UNABLE TO RETRIEVE STATUS";
type TSetParametersArg = Partial<
  Record<keyof TUserProperties | TParameterKeys, string>
>;
/** What can be stored in the google app script property service object. */
interface TUserProperties
  extends TSelectedItemsProperty,
    TUserPropertiesBoolProperties {
  headerTxtForGdriveSelectedResultsPg: string;
  selectedFolderToCopyParsable: ISelectedItem | null;
  displayedSelectableFolders: TGdriveItemsFromServer[];
  /** The string can be parse into TFoldersToCopyInfo. */
  foldersToCopyInfo: TFoldersToCopyInfo;
  txtIsCopyingOnlyFolders: string;
  txtIsCopyingTheSamePermissions: TYesOrNo;
}
type TYesOrNo = "Yes" | "No";
/**
 * All data type values must be a string.
 */
interface IParameters {
  itemSelectedResultPgHeaderTxt: string;
  folderCopyStatus: TFolderCopyStatus;
  lastRefresh: string;
  folderToCopyId: string;
  folderNameToCopy: string;
  txtIsCopyingOnlyFolders: TYesOrNo;
  copyFolderJobId: string;
  cardUpdateMethod: "push" | "update";
}
type TAvailableParametersForHandlerFn = IParameters & TUserProperties;
type TDynamicCacheVal<TData> = TData extends TUserPropertyKeys
  ? TAvailableParametersForHandlerFn[TData]
  : never;
type TUserPropertyKeys = keyof TUserProperties;
type TSelectedUserPropertyKey<T extends TUserPropertyKeys> =
  T extends TUserPropertyKeys ? Extract<TUserPropertyKeys, T> : never;

interface ITimeZone {
  offset: number;
  id: string;
}
interface IUserLocaleAndHostApp {
  hostApp: string;
  userLocale: string;
}
interface ICommonEventObject extends IUserLocaleAndHostApp {
  platform: string;
  timeZone: ITimeZone;
}
interface ISelectedItem {
  title: string;
  id: string;
  mimeType: string;
  iconUrl: string;
}
interface IDrive {
  selectedItems: ISelectedItem[];
  activeCursorItem: ISelectedItem | null;
}
type TParameterKeys =
  | "headerTxt"
  | "gdriveItemNamesParsable"
  | "copyDestinationFolderName"
  | "hasIsOnItemSelectedResultPgBeenSet"
  | "parentFolderId"
  | "gdriveNextPageToken"
  | "selectedParentFolderId"
  | "willUpdateCard"
  | "folderToCopyErrMsg"
  | keyof TAvailableParametersForHandlerFn
  | keyof ICopyDestinationFolder;

// create a typescript type that will make all of the non-string types into a string
// for the keys in TParameterKeys if they are in TAvailableParametersForHandlerFn, then gets its data type value
// -if its date type value is a string type then return that type, else, return string
type TMakeValsIntoString<TData extends object> = {
  [key in keyof TData]: TData[key] extends string ? TData[key] : string;
};
type TParameters = Partial<{ [key in TParameterKeys]: string }>;
interface IGScriptAppEvent extends IUserLocaleAndHostApp {
  clientPlatform: string;
  commonEventObject: ICommonEventObject;
  userTimezone: ITimeZone;
  userCountry: string;
  drive: IDrive;
  parameters?: TParameters;
}
