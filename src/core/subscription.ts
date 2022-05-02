import Naver from '@repandrip/naver-scraper'
import PollingCore from '@repandrip/polling-core'
import { EventInterface } from '@rizzzigit/eventemitter'

import { PollingWorker } from './worker'

export interface SubscriptionEvents extends EventInterface {
  post: [post: Naver.Post]
}

export class BaseSubscription extends PollingCore.Subscription<SubscriptionEvents> {
  public constructor (worker: PollingWorker) {
    super(worker)

    this.context = this.worker.polling.context
  }

  public readonly context: PollingCore.Context
}

export class TagSubscription extends BaseSubscription {
  public constructor (worker: PollingWorker, tag: Naver.Tag) {
    super(worker)

    this.tag = tag
  }

  public readonly tag: Naver.Tag

  public async getLatestPostId (): Promise<number | undefined> {
    return await this.context.get(`tag_${this.tag.name}_latestPostId`)
  }

  public async setLatestPostId (id: number) {
    return await this.context.set(`tag_${this.tag.name}_latestPostId`, id)
  }

  public async update () {
    const { tag, events } = this
    const posts = (await tag.getPostList('recent')).reverse()
    const latestId = await this.getLatestPostId()

    if (typeof (latestId) !== 'number') {
      await this.setLatestPostId(posts?.at(-1)?.ID || 0)
      return
    }

    let latestPostIndex
    let page = 2
    while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
      const result = await tag.getPostList('recent', page)

      posts.unshift(...result.reverse())
      page++
    }
    for (const meta of posts.slice(latestPostIndex + 1)) {
      const post = await meta.get().catch(() => {})
      if (!post) {
        continue
      }

      await this.setLatestPostId(post.ID)
      await events.emit('post', post)
    }
  }
}

export class MemberSubscription extends BaseSubscription {
  public constructor (worker: PollingWorker, member: Naver.Member) {
    super(worker)

    this.member = member
  }

  public readonly member: Naver.Member

  public async getLatestPostId (): Promise<number | undefined> {
    return await this.context.get(`member_${this.member.ID}_latestPostId`)
  }

  public async setLatestPostId (id: number) {
    return await this.context.set(`member_${this.member.ID}_latestPostId`, id)
  }

  public async update () {
    const { member, events } = this
    const posts = (await member.posts.list()).reverse()
    const latestId = await this.getLatestPostId()

    if (typeof (latestId) !== 'number') {
      await this.setLatestPostId(posts?.at(-1)?.ID || 0)
      return
    }

    let latestPostIndex
    let page = 2
    while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
      const result = await member.posts.list(page)

      posts.unshift(...result.reverse())
      page++
    }
    for (const meta of posts.slice(latestPostIndex + 1)) {
      const post = await meta.get().catch(() => {})
      if (!post) {
        continue
      }

      await this.setLatestPostId(post.ID)
      await events.emit('post', post)
    }
  }
}

export class SeriesSubscription extends BaseSubscription {
  public constructor (worker: PollingWorker, series: Naver.Series) {
    super(worker)

    this.series = series
  }

  public readonly series: Naver.Series

  public async getLatestPostId (): Promise<number | undefined> {
    return await this.context.get(`series_${this.series.ID}_latestPostId`)
  }

  public async setLatestPostId (id: number) {
    return await this.context.set(`series_${this.series.ID}_latestPostId`, id)
  }

  public async update () {
    const { series, events } = this
    const posts = (await series.getPosts()).reverse()
    const latestId = await this.getLatestPostId()

    if (typeof (latestId) !== 'number') {
      await this.setLatestPostId(posts?.at(-1)?.ID || 0)
      return
    }

    let latestPostIndex
    let page = 2
    while ((latestPostIndex = posts.findIndex((post) => post.ID === latestId)) < 0) {
      const result = await series.getPosts(page)

      posts.unshift(...result.reverse())
      page++
    }
    for (const meta of posts.slice(latestPostIndex + 1)) {
      const post = await meta.get().catch(() => {})
      if (!post) {
        continue
      }

      await this.setLatestPostId(post.ID)
      await events.emit('post', post)
    }
  }
}
