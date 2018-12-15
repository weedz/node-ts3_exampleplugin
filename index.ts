/// <reference path="../../lib/Types/TeamSpeak.d.ts" />
import Plugin from '../../lib/Plugin'
import Log from '../../lib/Log';
import Connection from '../../lib/Connection';
import Client from '../../lib/Client';

export const VERSION = 1;

export default class ExamplePlugin extends Plugin {
    fetchTimeout: NodeJS.Timeout|undefined;

    constructor(connection: Connection, client: Client) {
        super(connection, client);
        this.fetchTimeout;
        this.fetchClientInfo = this.fetchClientInfo.bind(this);
    }
    connected = () => {
        Promise.all([
            this.connection.send("use", 1, {mustReturnOK: true, noOutput: true}),
            this.connection.send("whoami", null, {mustReturnOK: true, noOutput: true})
        ]).then(data => {
            Log(`ExamplePlugin - ${JSON.stringify(data)}`, this.constructor.name);
        }).catch(data => {
            Log(`ExamplePlugin - Catch: ${data}`, this.constructor.name);
        });
    }
    init = () => {
        Log("We in there bois!", this.constructor.name, 3);
        // get clientlist and info every 5 second
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    async fetchClientInfo() {
        const clientList:TS_ClientList = await this.connection.store.fetchList("clientlist");
        Log(`Clients: ${clientList.length}`, this.constructor.name);
        for (let client of clientList) {
            const data:TS_ClientInfo = await this.connection.store.fetchItem("clientinfo", client.clid);
            process.stdout.write(`\tExamplePlugin - client (${client.clid}): ${data.client_nickname}\n`);
        }
        this.fetchTimeout = setTimeout(this.fetchClientInfo, 5000);
    }

    reload = () => {
        Log("ExamplePlugin - Already loaded!", this.constructor.name);
    }
    unload = () => {
        Log("ExamplePlugin - Unloading...", this.constructor.name);
        if (this.fetchTimeout) {
            clearTimeout(this.fetchTimeout);
        }
    }
}
