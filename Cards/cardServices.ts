const CardServices = (() => {
	type TImageStyle =
		| typeof CardService.ImageStyle.CIRCLE
		| typeof CardService.ImageStyle.SQUARE;

	function createHeader(
		title: string,
		imgUrl: string,
		imgAlt: string,
		imgStyle: TImageStyle = CardService.ImageStyle.SQUARE,
		subTitle = "",
	) {
		const header = CardService.newCardHeader()
			.setTitle(title)
			.setSubtitle(subTitle)
			.setImageUrl(imgUrl)
			.setImageAltText(imgAlt)
			.setImageStyle(imgStyle);

		return header;
	}

	return {
		createHeader,
	};
})();
