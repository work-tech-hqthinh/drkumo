import express, { Express, Request, Response, Router } from 'express'
import { WithId, Document } from 'mongodb'

const localDatabase = Router()

localDatabase.get('/', async (req: Request, res: Response) => {
  try {
    await req.dockerClient.connect()

    const myCollection = await req.dockerClient.db('local').collection('startup_log')

    const query = {
      pid: 1
    }

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      // Include only the `title` and `imdb` fields in each returned document
      //   projection: { _id: 0, account_id: 1, account_holder: 1 }
    }

    const cursor = myCollection.find(query, options)

    const result: any = []

    for await (const doc of cursor) {
      result.push(doc)
    }

    return res.send(result)
  } catch (e: any) {
    return res.send(`ERROR ${e.message}`)
  } finally {
    await req.dockerClient.close();
  }
  // console.log(req.client);
})

export default localDatabase
