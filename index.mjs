import Plugin from '../../lib/Plugin'
import Log from '../../lib/Log.mjs';

export const VERSION = 1;

export default class ExamplePlugin extends Plugin {
    constructor() {
        super();
        this.fetchTimeout;
        this.fetchClientInfo = this.fetchClientInfo.bind(this);
    }
    connected(connection) {
        super.connected(connection);
        Promise.all([
            this.connection.send('use', [1], {mustReturnOK: true, noOutput: true}),
            this.connection.send('whoami', undefined, {mustReturnOK: true, noOutput: true})
        ]).then(data => {
            Log(`ExamplePlugin - ${JSON.stringify(data)}`);
        }).catch(data => {
            Log(`ExamplePlugin - Catch: ${data}`);
        });
    }
    init() {
        Log("We in there bois!");
        // get clientlist and info every 5 second
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    async fetchClientInfo() {
        const clientList = await this.connection.store.fetchList('clientlist');
        Log(`Clients: ${clientList.length}`);
        for (let client of clientList) {
            const data = await this.connection.store.fetchInfo('clientinfo', 'clid', client.clid);
            Log(`\tExamplePlugin - client (${client.clid}): ${data.client_nickname}`);
        }
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    reload() {
        Log("ExamplePlugin - Already loaded!");
    }
    unload() {
        Log("ExamplePlugin - Unloading...");
        clearTimeout(this.fetchTimeout);
    }
}
