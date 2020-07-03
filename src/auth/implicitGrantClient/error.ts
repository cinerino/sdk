// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore file */

/**
 * クライアント認可エラー
 */
export class AuthorizeError extends Error {
    public error: string;
    public errorDescription: string;
    public state: string;
}
