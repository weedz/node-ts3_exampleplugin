import Plugin from '../../lib/Plugin'

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
            console.log("ExamplePlugin - ", data);
        }).catch(data => {
            console.log("ExamplePlugin - Catch: ", data);
        });
    }
    init() {
        console.log("We in there bois!");
        // get clientlist and info every 5 second
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    async fetchClientInfo() {
        const clientList = await this.connection.store.fetchList('clientlist');
        console.log(`Clients: ${clientList.length}`);
        for (let client of clientList) {
            const data = await this.connection.store.fetchInfo('clientinfo', 'clid', client.clid);
            console.log(`\tExamplePlugin - client (${client.clid}): ${data.client_nickname}`);
        }
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    reload() {
        console.log("ExamplePlugin - Already loaded!");
    }
    unload() {
        console.log("ExamplePlugin - Unloading...");
        clearTimeout(this.fetchTimeout);
    }
}
