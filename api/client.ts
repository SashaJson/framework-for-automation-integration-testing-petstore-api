import { PetController } from './controller/pet.controller';
import { StoreController } from './controller/store.controller';
import { UserController } from './controller/user.controller';
import { CookieJar } from 'tough-cookie';

export class ApiClient {
    public readonly pet: PetController;
    public readonly store: StoreController;
    public readonly user: UserController;

    constructor(params?: { token?: string, cookies?: CookieJar }) {
        const defaultParams = {
            cookies: new CookieJar()
        };
        const mergeParams = {
            ...defaultParams,
            ...params
        };

        this.pet = new PetController(mergeParams);
        this.store = new StoreController(mergeParams);
        this.user = new UserController(mergeParams);
    }

    static unauthorized() {
        return new ApiClient();
    }

    static async loginAs(credentials: { username: string, password: string }) {
        return new ApiClient({
           token: await ApiClient.unauthorized().user.login(credentials);
        });
    }

}
