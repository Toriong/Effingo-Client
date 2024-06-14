type TImageStyle =
	| typeof CardService.ImageStyle.CIRCLE
	| typeof CardService.ImageStyle.SQUARE;
type TParameters = { [key: string]: string };
type TCardPgs = "home" | "copyFiles" | "copyFolders";
type TCacheKeyName = "currentPgCard" 

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
interface IGdriveItemSelectedEvent extends IUserLocaleAndHostApp {
	clientPlatform: string;
	commonEventObject: ICommonEventObject;
	userTimezone: ITimeZone;
	userCountry: string;
	drive: IDrive;
}
