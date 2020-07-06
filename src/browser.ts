/**
 * API Javascript Client
 */
import { factory, service, transporters } from './abstract';
import { ImplicitGrantClient, IOptions as IImplicitGrantClientOptions } from './auth/implicitGrantClient';

/**
 * factory
 */
export import factory = factory;
export import service = service;
export import transporters = transporters;

/**
 * create OAuth2 client instance using implicit grant
 */
// tslint:disable-next-line:no-single-line-block-comment
/* istanbul ignore next */
export function createAuthInstance(options: IImplicitGrantClientOptions) {
    return new ImplicitGrantClient(options);
}
