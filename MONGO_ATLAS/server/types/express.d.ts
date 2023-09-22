import { MongoClient } from 'mongodb'

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      client: MongoClient
      dockerClient: MongoClient
    }
  }
  namespace NodeJS {
    interface ProcessEnv {
      ATLAS_PASSWORD: string;
    }
  }
}
