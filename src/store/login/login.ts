import { defineStore } from 'pinia'
import type { IAccount } from '@/types'
import { sessionCache } from '@/utils/cache'
const LOGIN_TOKEN = 'LOGIN_TOKEN'
const useLoginStore = defineStore('login', {
  state: () => ({
    id: '',
    name: '',
    username: '',
    token: sessionCache.getCache(LOGIN_TOKEN) ?? ''
  }),
  getters: {},
  actions: {
    loginAccountActions(data: IAccount) {
      this.id = String(data.id)
      this.name = data.name
      this.username = data.username
      this.token = data.token

      sessionCache.setCache(LOGIN_TOKEN, this.token)
    }
  }
})

export default useLoginStore

// 注释：store > TS counter.ts > useCounterStore > actions > changeCounterAction
