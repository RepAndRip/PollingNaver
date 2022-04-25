import PollingCore from '@repandrip/polling-core';
import { MemberSubscription, SeriesSubscription, TagSubscription } from './subscription';
export declare class PollingWorker extends PollingCore.PollingWorker {
    constructor(polling: PollingCore.Polling);
    readonly map: {
        tags: {
            [key: string]: TagSubscription;
        };
        members: {
            [key: string]: MemberSubscription;
        };
        series: {
            [key: string]: SeriesSubscription;
        };
    };
    init(): Promise<void>;
    update(): Promise<void>;
}
