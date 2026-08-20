export const TBK = {
  ID: (process.env.TBK_API_KEY_ID || process.env.TRANSBANK_COMMERCE_CODE || '597055555532').trim(),
  SECRET: (process.env.TBK_API_KEY_SECRET || process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB36B38C77FB7D7179E317BD139F').trim(),
  URL: 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions'
}