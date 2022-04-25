import PollingCore from '@repandrip/polling-core'

import { MemberSubscription, SeriesSubscription, TagSubscription } from './subscription'

export class PollingWorker extends PollingCore.PollingWorker {
  public constructor (polling: PollingCore.Polling) {
    super(polling)

    this.map = {
      tags: {},
      members: {},
      series: {}
    }
  }

  public readonly map: {
    tags: { [key: string]: TagSubscription }
    members: { [key: string]: MemberSubscription }
    series: { [key: string]: SeriesSubscription }
  }

  public async init () {}

  public async update () {
    const { map: { tags, members, series } } = this

    await Promise.all([
      await Promise.all(Object.keys(tags).map((tagName) => tags[tagName].update())),
      await Promise.all(Object.keys(members).map((memberId: any) => members[memberId].update())),
      await Promise.all(Object.keys(series).map((seriesId: any) => series[seriesId].update()))
    ])
  }
}
