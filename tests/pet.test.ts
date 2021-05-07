import { strict as assert } from 'assert';
import { ApiClient } from '../api/client';
import { definitions } from '../.temp/types';

describe('Pet', function () {

    it('can be received by his id', async function () {

        const body = await ApiClient.unauthorized().pet.getById(1);
        assert(body.id == 1);

    });

    it('can be received by status', async function () {

        const client = ApiClient.unauthorized();

        let body = await client.pet.findByStatus('available');
        assert(body.length > 0);

        body = await client.pet.findByStatus('pending');
        assert(body.length > 0);

        body = await client.pet.findByStatus('sold');
        assert(body.length > 0);

        body = await client.pet.findByStatus(['pending', 'available']);
        assert(body.length > 0);
        assert(body.some(pet => pet.status == 'available'));
        assert(body.some(pet => pet.status == 'pending'));
        assert(!body.some(pet => pet.status == 'sold'));

    });

    it('can be received by tag', async function () {

        const client = ApiClient.unauthorized();

        const body = await client.pet.findByTags('tag1');
        assert(body.length > 0);
        assert(body.every(pet => pet.tags.some(tag => tag.name == 'tag1')));

    });

    it('can be added, updated and deleted', async function () {

        const adminClient = await ApiClient.loginAs({ username: 'admin', password: 'admin'});

        const petToCreate: Omit<definitions['Pet'], 'id'> = {
            "category": {
                "id": 0,
                "name": "string"
            },
            "name": "Cat",
            "photoUrls": [
                "http:test.com/image.jpg"
            ],
            "tags": [
                {
                    "id": 0,
                    "name": "string",
                }
            ],
            "status": "available",
        };

        const addedPet = await adminClient.pet.addNew(petToCreate);
        assert.deepEqual(addedPet, {
            ...petToCreate,
            id: addedPet.id
        });

        const foundAddPet = await adminClient.pet.getById(addedPet.id);
        assert.deepEqual(foundAddPet, {
            ...petToCreate,
            id: addedPet.id
        });

        const newerPet: definitions['Pet'] = {
            id: addedPet.id,
            category: {
                id: 1,
                name: "string2"
            },
            name: "Dog",
            photoUrls: [
                "http:test.com/image2.jpg"
            ],
            tags: [
                {
                    id: 1,
                    name: "string2",
                }
            ],
            status: "pending",
        };

        const updatePet = await adminClient.pet.update(newerPet);
        assert.deepEqual(updatePet, newerPet);

        // TODO: assert 404 error
        await adminClient.pet.delete(addedPet.id);

    });

});
