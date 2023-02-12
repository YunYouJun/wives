export interface Girl {
  name: string
  avatar: string
  /**
   * anilist use int as character id
   */
  anilist_id: number
  /**
   * 立绘
   */
  tachie: string
  from: string
  douban_id: string
  moegirl?: string
}
