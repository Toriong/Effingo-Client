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

type TFolderCopyStatus = Uppercase<
  "ongoing" | "success" | "failure" | "UNABLE TO RETRIEVE STATUS"
>;
type TSetParametersArg = Partial<
  Record<keyof TUserProperties | TParameterKeys, string>
>;
type TTargetSelectableFolder = {
  displayedSelectableFoldersAll: TGdriveItemsFromServer[][];
  currentIndex: number;
};
interface TSelectableCopyFolderDestinations {
  [key: string]: TTargetSelectableFolder;
}
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
  selectableCopyFolderDestinations: TSelectableCopyFolderDestinations;
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
  newSelectableFolderIndexPage: number;
  hasReachedMaxSelectableFoldersForCard: boolean;
  willNotDisplaySeeMoreFoldersBtn: boolean;
  indexOfSelectableCopyFolderDestinationsPg: number;
  cardUpdateMethod: "push" | "update" | "popAndUpdate";
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
  | "parentFolderId"
  | "gdriveNextPageToken"
  | "selectedParentFolderId"
  | "willUpdateCard"
  | "folderToCopyErrMsg"
  | keyof TAvailableParametersForHandlerFn
  | keyof ICopyDestinationFolder;
type TStrValTypeParmetersKeyNames =
  | "headerTxt"
  | "gdriveItemNamesParsable"
  | "copyDestinationFolderName"
  | "parentFolderId"
  | "gdriveNextPageToken"
  | "selectedParentFolderId"
  | "willUpdateCard"
  | "copyFolderJobTimeCompletionMs"
  | "folderToCopyErrMsg";
type TStrValTypeParameters = Record<TStrValTypeParmetersKeyNames, string>;
interface TParametersMerged
  extends TAvailableParametersForHandlerFn,
    ICopyDestinationFolder,
    TStrValTypeParameters {}
type TMakeTypeValsIntoStr<TData extends object> = {
  [key in keyof TData]: TData[key] extends string ? TData[key] : string;
};
type TParameters = TMakeTypeValsIntoStr<TParametersMerged>;
interface IGScriptAppEvent extends IUserLocaleAndHostApp {
  clientPlatform: string;
  commonEventObject: ICommonEventObject;
  userTimezone: ITimeZone;
  userCountry: string;
  drive: IDrive;
  parameters?: Partial<TMakeTypeValsIntoStr<TParametersMerged>>;
}
