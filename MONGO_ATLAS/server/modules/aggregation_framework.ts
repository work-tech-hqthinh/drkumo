import express, { Express, Request, Response, Router } from 'express'
import { WithId, Document } from 'mongodb'

const aggregationFramework = Router()

aggregationFramework.get('/', async (req: Request, res: Response) => {
  try {
    await req.client.connect()

    const myCollection = await req.client.db('bank').collection('accounts')

    const query = {
      $or: [{ balance: -300 }, { customId: 3 }]
    }

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      // Include only the `title` and `imdb` fields in each returned document
      //   projection: { _id: 0, account_id: 1, account_holder: 1 }
    }

    const cursor = myCollection.find(query, options)

    const result: any = []

    for await (const doc of cursor) {
      result.push(doc._id)
    }

    return res.send(JSON.stringify(result))
  } catch (e: any) {
    return res.send(`ERROR ${e.message}`)
  } finally {
    await req.client.close()
  }
  // console.log(req.client);
})

aggregationFramework.get(
  '/match_group',
  async (req: Request, res: Response) => {
    try {
      await req.client.connect()

      const myCollection = await req.client.db('bank').collection('accounts')

      const stages: Document[] = [
        {
          $match: { balance: { $gt: -600 } }
        },
        {
          $group: {
            _id: '$account_holder',
            total_balance: { $sum: '$balance' },
            total_average: { $avg: '$balance' }
          }
        }
      ]

      const aggregateResult = await myCollection.aggregate(stages)

      let result: Document[] = []
      for await (const doc of aggregateResult) {
        result.push(doc)
      }

      return res.send(result)
    } catch (e: any) {
      res.send(`ERROR: ${e.message}`)
    } finally {
      await req.client.close()
    }
  }
)

aggregationFramework.get(
  '/project_sort',
  async (req: Request, res: Response) => {
    try {
      await req.client.connect()

      const myCollection = await req.client.db('bank').collection('accounts')

      let exchangeRate = 1.3

      const stages: Document[] = [
        {
          $match: { balance: { $gt: -500 } }
        },
        {
          $sort: {
            balance: -1 //Descending
          }
        },
        {
          $project: {
            gbp_balance: { $round: { $divide: [ '$balance', exchangeRate] } },
            balance: 1,
            account_holder: 1
          }
        },
        {
          $addFields: {
            usd_to_pound_exchange_rate: exchangeRate
          }
        }
      ]

      const aggregateResult = await myCollection.aggregate(stages)

      let result: Document[] = []
      for await (const doc of aggregateResult) {
        result.push(doc)
      }

      return res.send(result)
    } catch (e: any) {
      res.send(`ERROR: ${e.message}`)
    } finally {
      await req.client.close()
    }
  }
)

export default aggregationFramework
