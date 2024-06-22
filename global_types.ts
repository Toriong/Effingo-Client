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
type TGdriveItemTypes = "application/vnd.google-apps.folder";
type TFoldersToCopyInfo = Record<string, ICopyDestinationFolder>;
type TGdriveItemsFromServer = {
  id: string;
  name: string;
  mime_type: string;
  parents: string[];
};
/** Used the property service object of google app script. */
interface TUserProperties
  extends TSelectedItemsProperty,
    TUserPropertiesBoolProperties {
  itemSelectedResultPgHeaderTxt: string;
  headerTxtForGdriveSelectedResultsPg: string;
  selectedFolderToCopyParsable: ISelectedItem | null;
  /** The string can be parse into TFoldersToCopyInfo. */
  foldersToCopyInfo: TFoldersToCopyInfo;
}

type TDynamicCacheVal<TData> = TData extends TUserPropertyKeys
  ? TUserProperties[TData]
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
  | "isResetting"
  | "parentFolderId"
  | "currentDisplaySelectableFolders"
  | "gdriveNextPageToken"
  | "selectedParentFolderId"
  | TUserPropertyKeys
  | keyof ICopyDestinationFolder;
type TParameters = Partial<{ [key in TParameterKeys]: string }>;
interface IGScriptAppEvent extends IUserLocaleAndHostApp {
  clientPlatform: string;
  commonEventObject: ICommonEventObject;
  userTimezone: ITimeZone;
  userCountry: string;
  drive: IDrive;
  parameters?: TParameters;
}
