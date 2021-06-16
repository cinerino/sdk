/**
 * API Node.js Client
 */
import { chevre, factory, service, transporters } from './abstract';
import ClientCredentialsClient from './auth/clientCredentialsClient';
import { ImplicitGrantClient, IOptions as IImplicitGrantClientOptions } from './auth/implicitGrantClient';
import OAuth2client from './auth/oAuth2client';

export import chevre = chevre;
/**
 * factory
 */
export import factory = factory;
export import service = service;
export import transporters = transporters;

/**
 * each OAuth2 clients
 */
export namespace auth {
    /**
     * OAuth2 client using grant type 'client_credentials'
     */
    export class ClientCredentials extends ClientCredentialsClient { }
    /**
     * OAuth2 client using grant type 'authorization_code'
     */
    export class OAuth2 extends OAuth2client { }
}

/**
 * create OAuth2 client instance using implicit grant
 */
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore next */
export function createAuthInstance(options: IImplicitGrantClientOptions) {
    return new ImplicitGrantClient(options);
}
