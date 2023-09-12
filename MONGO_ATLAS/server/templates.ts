import { UpdateFilter, Document } from 'mongodb'

export const SET_INC_PUSH = {
  $set: {
    balance: 100
  },
  $inc: {
    balance: 50
  },
  $push: {
    spendings: { $each: ['?', '??'] }
  }
}

export const PULL = {
  $pull: {
    spendings: { $in: ['?', '??'] }
  }
}

export const CONCAT: UpdateFilter<Document> = {
  $set: {
    accountFullInfo: {
      $concat: ['$account_holder', '$account_type']
    }
  }
}
