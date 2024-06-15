type TImageStyle =
	| typeof CardService.ImageStyle.CIRCLE
	| typeof CardService.ImageStyle.SQUARE;
type TParameters = { [key: string]: string };
type TCardPgs = "home" | "folderCopyOptions" | "selectedFoldersToCopy";
type TUserPropertyKeys = "currentCardPg";
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
interface ISelectedItems {
	title: string;
	id: string;
	mimeType: string;
	iconUrl: string;
}
interface IDrive {
	selectedItems: ISelectedItems[];
	activeCursorItem: ISelectedItems;
}
type TParameterKeys =
	| "headerTxt"
	| "gdriveItemNamesParsable"
	| TUserPropertyKeys;
interface IGScriptAppEvent extends IUserLocaleAndHostApp {
	clientPlatform: string;
	commonEventObject: ICommonEventObject;
	userTimezone: ITimeZone;
	userCountry: string;
	drive: IDrive;
	parameters?: { [key in TParameterKeys]: string };
}
