"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollingWorker = void 0;
const tslib_1 = require("tslib");
const polling_core_1 = tslib_1.__importDefault(require("@repandrip/polling-core"));
class PollingWorker extends polling_core_1.default.PollingWorker {
    constructor(polling) {
        super(polling);
        this.map = {
            tags: {},
            members: {},
            series: {}
        };
    }
    map;
    async init() { }
    async update() {
        const { map: { tags, members, series } } = this;
        await Promise.all([
            await Promise.all(Object.keys(tags).map((tagName) => tags[tagName].update())),
            await Promise.all(Object.keys(members).map((memberId) => members[memberId].update())),
            await Promise.all(Object.keys(series).map((seriesId) => series[seriesId].update()))
        ]);
    }
}
exports.PollingWorker = PollingWorker;
