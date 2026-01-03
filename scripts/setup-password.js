const bcrypt = require('bcryptjs')

const password = '@Dangminhtrung123'

bcrypt.hash(password, 10).then((hash) => {
  console.log('\n✅ Password hash generated!')
  console.log('\nAdd this to your .env.local file:')
  console.log(`\nADMIN_PASSWORD_HASH=${hash}`)
  console.log(`JWT_SECRET=${require('crypto').randomBytes(32).toString('hex')}\n`)
})

