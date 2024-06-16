type TImageStyle =
	| typeof CardService.ImageStyle.CIRCLE
	| typeof CardService.ImageStyle.SQUARE;
type TParameters = { [key: string]: string };
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

interface TUserProperties
	extends TSelectedItemsProperty,
		TUserPropertiesBoolProperties {
	itemSelectedResultPgHeaderTxt: string;
	headerTxtForGdriveSelectedResultsPg: string;
	selectedFolderToCopyParsable: ISelectedItem | null;
	copyDestinationFolder: string;
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
	| "hasIsOnItemSelectedResultPgBeenSet"
	| TUserPropertyKeys;
interface IGScriptAppEvent extends IUserLocaleAndHostApp {
	clientPlatform: string;
	commonEventObject: ICommonEventObject;
	userTimezone: ITimeZone;
	userCountry: string;
	drive: IDrive;
	parameters?: Partial<{ [key in TParameterKeys]: string }>;
}
