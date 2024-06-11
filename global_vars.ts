const IMGS = (() => {
    const COPY_ICON = "https://effingo.s3.us-east-2.amazonaws.com/copy-icon.png";
    const SHARE_ICON = "https://effingo.s3.us-east-2.amazonaws.com/share-icon.png";
    const PERMISSIONS_ICON = "https://effingo.s3.us-east-2.amazonaws.com/permissions-icon.png";
    const LOGO_200_X_200 = "https://effingo.s3.us-east-2.amazonaws.com/logo-nobackground-200.png";
    const LOGO_500_X_500 = "https://effingo.s3.us-east-2.amazonaws.com/logo-original-500.png";

    return { 
        COPY_ICON,
        PERMISSIONS_ICON,
        SHARE_ICON,
        LOGO_200_X_200,
        LOGO_500_X_500
    }
})();
const CARDSERVICE_VARS = (() => {
    const { CIRCLE, SQUARE } = CardService.ImageStyle;

    return { CIRCLE, SQUARE }
})();