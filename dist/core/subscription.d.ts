import Naver from '@repandrip/naver-scraper';
import PollingCore from '@repandrip/polling-core';
import { EventInterface } from '@rizzzigit/eventemitter';
import { PollingWorker } from './worker';
export interface SubscriptionEvents extends EventInterface {
    post: [post: Naver.Post];
}
export declare class BaseSubscription extends PollingCore.Subscription<SubscriptionEvents> {
    constructor(worker: PollingWorker);
    readonly context: PollingCore.Context;
}
export declare class TagSubscription extends BaseSubscription {
    constructor(worker: PollingWorker, tag: Naver.Tag);
    readonly tag: Naver.Tag;
    getLatestPostId(): Promise<number | undefined>;
    setLatestPostId(id: number): Promise<void>;
    update(): Promise<void>;
}
export declare class MemberSubscription extends BaseSubscription {
    constructor(worker: PollingWorker, member: Naver.Member);
    readonly member: Naver.Member;
    getLatestPostId(): Promise<number | undefined>;
    setLatestPostId(id: number): Promise<void>;
    update(): Promise<void>;
}
export declare class SeriesSubscription extends BaseSubscription {
    constructor(worker: PollingWorker, series: Naver.Series);
    readonly series: Naver.Series;
    getLatestPostId(): Promise<number | undefined>;
    setLatestPostId(id: number): Promise<void>;
    update(): Promise<void>;
}
