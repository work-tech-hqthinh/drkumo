// import Ajv, { AsyncSchema } from 'ajv';

import Ajv from 'ajv'

const schema = {
  $async: true,
  type: 'object',
  properties: {
    token: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    data: {
      type: 'object'
    }
  },
  required: ['data']
}

const validationSchema = new Ajv({
  allowUnionTypes: true,
  allErrors: true
}).compile({
  ...schema
})

console.log(validationSchema);
