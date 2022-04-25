"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesSubscription = exports.MemberSubscription = exports.TagSubscription = exports.BaseSubscription = void 0;
const tslib_1 = require("tslib");
const polling_core_1 = tslib_1.__importDefault(require("@repandrip/polling-core"));
class BaseSubscription extends polling_core_1.default.Subscription {
    constructor(worker) {
        super(worker);
        this.context = this.worker.polling.context;
    }
    context;
}
exports.BaseSubscription = BaseSubscription;
class TagSubscription extends BaseSubscription {
    constructor(worker, tag) {
        super(worker);
        this.tag = tag;
    }
    tag;
    async getLatestPostId() {
        return await this.context.get(`tag_${this.tag.name}_latestPostId`);
    }
    async setLatestPostId(id) {
        return await this.context.set(`tag_${this.tag.name}_latestPostId`, id);
    }
    async update() {
        const { tag, events } = this;
        const posts = (await tag.getPostList('recent')).reverse();
        const latestId = await this.getLatestPostId();
        if (typeof (latestId) !== 'number') {
            await this.setLatestPostId(posts?.at(-1)?.ID || 0);
            return;
        }
        let latestPostIndex;
        let page = 2;
        while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
            const result = await tag.getPostList('recent', page);
            posts.unshift(...result.reverse());
            page++;
        }
        for (const meta of posts.slice(latestPostIndex + 1)) {
            const post = await meta.get();
            await this.setLatestPostId(post.ID);
            await events.emit('post', post);
        }
    }
}
exports.TagSubscription = TagSubscription;
class MemberSubscription extends BaseSubscription {
    constructor(worker, member) {
        super(worker);
        this.member = member;
    }
    member;
    async getLatestPostId() {
        return await this.context.get(`member_${this.member.ID}_latestPostId`);
    }
    async setLatestPostId(id) {
        return await this.context.set(`member_${this.member.ID}_latestPostId`, id);
    }
    async update() {
        const { member, events } = this;
        const posts = (await member.posts.list()).reverse();
        const latestId = await this.getLatestPostId();
        if (typeof (latestId) !== 'number') {
            await this.setLatestPostId(posts?.at(-1)?.ID || 0);
            return;
        }
        let latestPostIndex;
        let page = 2;
        while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
            const result = await member.posts.list(page);
            posts.unshift(...result.reverse());
            page++;
        }
        for (const meta of posts.slice(latestPostIndex + 1)) {
            const post = await meta.get();
            await this.setLatestPostId(post.ID);
            await events.emit('post', post);
        }
    }
}
exports.MemberSubscription = MemberSubscription;
class SeriesSubscription extends BaseSubscription {
    constructor(worker, series) {
        super(worker);
        this.series = series;
    }
    series;
    async getLatestPostId() {
        return await this.context.get(`series_${this.series.ID}_latestPostId`);
    }
    async setLatestPostId(id) {
        return await this.context.set(`series_${this.series.ID}_latestPostId`, id);
    }
    async update() {
        const { series, events } = this;
        const posts = (await series.getPosts()).reverse();
        const latestId = await this.getLatestPostId();
        if (typeof (latestId) !== 'number') {
            await this.setLatestPostId(posts?.at(-1)?.ID || 0);
            return;
        }
        let latestPostIndex;
        let page = 2;
        while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
            const result = await series.getPosts(page);
            posts.unshift(...result.reverse());
            page++;
        }
        for (const meta of posts.slice(latestPostIndex + 1)) {
            const post = await meta.get();
            await this.setLatestPostId(post.ID);
            await events.emit('post', post);
        }
    }
}
exports.SeriesSubscription = SeriesSubscription;
