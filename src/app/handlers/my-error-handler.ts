import {ErrorHandler} from "@angular/core";

export class MyErrorHandler implements ErrorHandler{

    handleError(error: Error): void {
        const audioErrorMsg = "The play method is not allowed by the user agent or the platform in the " +
                "current context, possibly because the user denied permission.";

        if (error.name === "NotAllowedError" && error.message === audioErrorMsg) {
            const audioErrorResponse = "You are getting this error because your browser does not allow me to " +
                    "play audio. In Firefox, you can enable it by clicking on the play icon in the address bar " +
                    "left from the URL.\n";
            console.error(audioErrorResponse, error);

        } else {
            console.error(error);
        }
    }
}
