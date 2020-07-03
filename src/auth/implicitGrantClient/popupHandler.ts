// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */

import * as createDebug from 'debug';

const debug = createDebug('cinerino-api:auth:popupHandler');

/**
 * PopupHandler
 */
export default class PopupHandler {
    public url: string;
    public callback: any;
    public timeout: any;
    public timeoutCallback: any;
    public eventListenerType: any;
    public popupWindow: any;
    public timeoutHandle: any;
    public destroyTimeout: any;
    public proxyEventListener: any;
    // If no event identifier specified, set default
    public eventValidator: any;
    public eventSourceObject: any;

    constructor(options: any) {
        this.url = options.url;
        this.callback = options.callback;
        // tslint:disable-next-line:no-magic-numbers
        this.timeout = (options.timeout !== undefined) ? options.timeout : 60 * 1000;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutCallback = (options.timeoutCallback !== undefined) ? options.timeoutCallback : null;
        this.eventListenerType = (options.eventListenerType !== undefined) ? options.eventListenerType : 'message';
        // tslint:disable-next-line:no-null-keyword
        this.popupWindow = null;
        // tslint:disable-next-line:no-null-keyword
        this.timeoutHandle = null;
        // tslint:disable-next-line:no-null-keyword
        this.destroyTimeout = null;
        // tslint:disable-next-line:no-null-keyword
        this.proxyEventListener = null;
        // If no event identifier specified, set default
        this.eventValidator = (options.eventValidator !== undefined) ? options.eventValidator : {
            isValid: () => {
                return true;
            }
        };

        if (typeof this.callback !== 'function') {
            throw new Error('options.callback must be a function');
        }
    }

    public init() {
        debug('opening popup...', this.eventListenerType);

        this.popupWindow = window.open(this.url, 'authorizeWindow');

        // Workaround to avoid using bind that does not work in IE8
        this.proxyEventListener = (e: any) => {
            this.eventListener(e);
        };

        switch (this.eventListenerType) {
            case 'message':
                this.eventSourceObject = window;
                break;
            case 'load':
                this.eventSourceObject = this.popupWindow;
                break;
            default:
                throw new Error(`Unsupported event listener type: ${this.eventListenerType}`);
        }

        debug('this.eventSourceObject:', this.eventSourceObject);
        this.eventSourceObject.addEventListener(this.eventListenerType, this.proxyEventListener, false);

        this.timeoutHandle = setTimeout(
            () => {
                this.timeoutHandler();
            },
            this.timeout
        );
    }

    public eventListener(event: any) {
        debug('PopupHandler.eventListener...event:', event);
        const eventData = { event: event, sourceObject: this.eventSourceObject };

        this.destroy();
        // 呼び出し元へコールバック
        this.callback(eventData);
    }

    public timeoutHandler() {
        if (this.timeoutCallback) {
            this.timeoutCallback();
        }
    }

    public destroy() {
        clearTimeout(this.timeoutHandle);

        this.destroyTimeout = setTimeout(
            () => {
                this.eventSourceObject.removeEventListener(
                    this.eventListenerType,
                    this.proxyEventListener,
                    false
                );

                // ポップアップを閉じる
                this.popupWindow.close();
            },
            0
        );
    }
}
