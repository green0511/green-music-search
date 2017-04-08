import * as http from 'http'
import { Router, Request, Response, NextFunction, Application } from 'express'
import axios from 'axios'
import * as JSONP from 'node-jsonp'

import * as debug from 'debug'
let serverDebugger = debug('ts-express:server')

export class QqRouter {
  router: Router = Router()

  constructor(app: Application) {
    this.registerRoutes()
    app.use('/qq', this.router)
  }

  registerRoutes(): void {
    this.router.get('/singers/:sid', this.getSingerInfo)
    this.router.get('/singers/:sid/songs', this.getSingerAllSongs)
    this.router.get('/singers/:sid/albums', this.getSingerAllAlbums)

    this.router.get('/singers/:sid/similar', this.getSimilarSinger)

    this.router.get('/albums/:aid', this.getAlbumInfo)

    this.router.get('/songs/:mid', this.getSongInfo)

    this.router.get('/search', this.search)
  }
  
  // 搜索一个歌手的所有歌曲
  // /singers/音乐id/songs?start=0&length=10
  private getSingerAllSongs(req: Request, res: Response, next: NextFunction) {
    serverDebugger('function call: getSingerAllSongs()')
    let { sid } = req.params
    let { start, length, order } = req.query
    serverDebugger('searching song(mid): ', sid)
    JSONP('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', {
      singermid: sid,
      format:'jsonp',
      bigin: start,
      num: length,
      order
    }, 'jsonpCallback', songInfoData => {
      serverDebugger('getSingerAllSongs result: ', songInfoData)
      return res.json(songInfoData)
    })
  }

    // 搜索一个歌手的所有歌曲
  // /singers/音乐id/songs?start=0&length=10
  private getSingerAllAlbums(req: Request, res: Response, next: NextFunction) {
    serverDebugger('function call: getSingerAllAlbums()')
    let { sid } = req.params
    let { start, length, order } = req.query
    serverDebugger('searching singer(sid): ', sid)
    JSONP('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_album.fcg', {
      singermid: sid,
      format:'jsonp',
      bigin: start,
      num: length,
      order
    }, 'jsonpCallback', songInfoData => {
      serverDebugger('getSingerAllAlbums result: ', songInfoData)
      return res.json(songInfoData)
    })
  }

  
  
  // 搜索歌手详情
  private getSingerInfo(req: Request, res: Response, next: NextFunction) {

  }
  
  // 获取相似歌手
  private getSimilarSinger(req: Request, res: Response, next: NextFunction) {
    serverDebugger('function call: getSimilarSinger()')
    let { sid } = req.params
    let { start, length } = req.query
    serverDebugger('searching similar singer(sid): ', sid)
    JSONP('https://c.y.qq.com/v8/fcg-bin/fcg_v8_simsinger.fcg', {
      singer_mid: sid,
      format:'jsonp',
      start,
      num: length
    }, 'jsonpCallback', data => {
      serverDebugger('search similar singer result: ', data)
      return res.json(data)
    })
  }

  public getAlbumInfo(req: Request, res: Response, next: NextFunction) {
    
    serverDebugger('function call: getAlbumInfo()')
    let { aid } = req.params
    serverDebugger('searching album(aid): ', aid)
    JSONP('https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg', {
      albummid: aid,
      format:'jsonp'
    }, 'jsonpCallback', albumInfoData => {
      serverDebugger('search album result: ', albumInfoData)
      return res.json(albumInfoData)
    })
  }

  // https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg
  // 搜索一首歌的详情
  public getSongInfo(req: Request, res: Response, next: NextFunction) {
    serverDebugger('function call: getSongInfo()')
    let { mid } = req.params
    serverDebugger('searching song(mid): ', mid)
    JSONP('https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg', {
      songmid: mid,
      format:'jsonp'
    }, 'callback', songInfoData => {
      serverDebugger('search song result: ', songInfoData)
      return res.json(songInfoData)
    })
  }

  private search(req: Request, res: Response, next: NextFunction) {
    serverDebugger('function call: search()')
    let { type, keyword, page, length } = req.query
    let typeMap = {
      'song': 0,
      'album': 8
    }
    // type: 
    // 0 => 单曲
    // 8 => 专辑
    serverDebugger(`searching ${type} with ${keyword}`)
    JSONP('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
      w: keyword,
      p: page,
      n: length,
      t: typeMap[type],
      format:'jsonp'
    }, 'jsonpCallback', data => {
      serverDebugger('search result: ', data)
      return res.json(data)
    })
  }

}

