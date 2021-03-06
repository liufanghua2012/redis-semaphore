import { expect } from 'chai'

import refresh from '../../../src/fair-semaphore/refresh'
import client from '../../redisClient'

describe('fair-semaphore refresh', () => {
  it('should return false if resource is not acquired', async () => {
    const result = await refresh(client, 'key', '111', 50)
    expect(result).to.be.false
  })
  it('should return true for success refresh', async () => {
    const oldNow = Date.now() - 10000
    await client.zadd('key', '' + oldNow, '111')
    expect(await client.zrange('key', 0, -1)).to.be.eql(['111'])
    const result = await refresh(client, 'key', '111', 50)
    expect(await client.zrange('key', 0, -1)).to.be.eql(['111'])
    expect(result).to.be.true
  })
})
