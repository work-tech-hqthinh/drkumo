import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

const PASSWORD = '6NpuCIOU3sre6riO'

const uri = `mongodb+srv://myAtlasDBUser:${PASSWORD}@myatlasclusteredu.znzyn3f.mongodb.net/?retryWrites=true&w=majority`
const dockerMongoUri = `mongodb://db_mongo:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6`

dotenv.config()

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const dockerClient = new MongoClient(dockerMongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const app = express()
const port = process.env.PORT

import aggregationFramework from './modules/aggregation_framework'
import localDatabase from './modules/local/local.routes'

app.use(
  '/agg',
  (req, res, next) => {
    req.client = client

    next()
  },
  aggregationFramework
)

app.use(
  '/local',
  (req, res, next) => {
    req.dockerClient = dockerClient
    next()
  },
  localDatabase
)

app.get('/', async (req: Request, res: Response) => {
  try {
    await client.connect()

    const list = await client.db('admin').command({ ping: 1 })
    const printTo = JSON.stringify(list)

    res.send(`SUCCESS: ${printTo}`)
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
  } finally {
    await client.close()
  }
})

app.get('/create', async (req: Request, res: Response) => {
  try {
    const sampleAccount = {
      account_holder: 'Quoc Thinh',
      account_id: 'MONGODB123',
      account_type: 'Checking',
      balance: 123123.12,
      last_updated: new Date()
    }
    await client.connect()

    const myCollection = await client.db('bank').collection('accounts')
    const result = await myCollection.insertMany(
      new Array(3).fill(sampleAccount).map((doc, index) => ({
        ...doc,
        customId: index + 1
      }))
    )

    // const printTo = JSON.stringify(list)

    res.send(`SUCCESS: ${JSON.stringify(result)}`)
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
  } finally {
    await client.close()
  }
})

app.get('/find/:custom_id', async (req: Request, res: Response) => {
  try {
    const customId = req.params.custom_id

    await client.connect()
    const myCollection = await client.db('bank').collection('accounts')
    const myResult = await myCollection.findOne({ customId: '1' })
    res.send(JSON.stringify(myResult))
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
  } finally {
    await client.close()
  }
})

import { PULL, CONCAT } from './templates'

app.get('/update', async (req: Request, res: Response) => {
  try {
    // const customId = req.params.custom_id

    await client.connect()
    const myCollection = await client.db('bank').collection('accounts')
    const myResult = await myCollection.updateOne({ customId: 1 }, CONCAT)
    res.send(JSON.stringify(myResult))
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
  } finally {
    await client.close()
  }
})

app.get('/delete', async (req: Request, res: Response) => {
  try {
    // const customId = req.params.custom_id

    await client.connect()
    const myCollection = await client.db('bank').collection('accounts')
    const myResult = await myCollection.deleteOne({ customId: 2 })
    res.send(JSON.stringify(myResult))
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
  } finally {
    await client.close()
  }
})

app.get('/transaction', async (req: Request, res: Response) => {
  const session = client.startSession()
  try {
    const [senderId, receiverId, amount] = [1, 3, 150]

    await client.connect()

    const myCollection = client.db('bank').collection('accounts')

    const result = await session.withTransaction(async () => {
      await myCollection.updateOne(
        { customId: senderId },
        { $inc: { balance: -amount } },
        { session }
      )

      await myCollection.updateOne(
        { customId: receiverId },
        { $inc: { balance: amount } },
        { session }
      )
      return true
    })

    if (result) {
      res.send(JSON.stringify('TRANSACTION SUCCESSFUL'))
    } else {
      res.send(JSON.stringify(`TRANSACTION FAILED`))
    }
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
    process.exit(1) //Drop the server
  } finally {
    await session.endSession()
    await client.close()
  }
})

app.get('/aggregation', async (req: Request, res: Response) => {
  try {
    const myCollection = await client.db('bank').collection('accounts')
    const result = await myCollection.aggregate([
      {
        $match: {
          balance: -300
        }
      },
      {
        $group: {
          _id: '$account_holder',
          totalBalance: {
            $count: {}
          }
        }
      },
      {
        $project: {
          totalBalance: 1
        }
      }
    ])

    // console.log(await result.explain());

    res.send(result)
  } catch (e: any) {
    res.send(`FAILED: ${e.message}`)
    process.exit(1)
  } finally {
    await client.close()
  }
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
