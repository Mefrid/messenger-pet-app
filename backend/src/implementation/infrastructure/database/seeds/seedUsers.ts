import { pool } from '../db.ts'

await pool.query(`
  INSERT INTO users (login, name, surname, avatar_url, birth_date, password_hash)
  VALUES
    (
      'bobrov',
      'Sergey',
      'Bobrov',
      'https://unsplash.com/photos/C8Ta0gwPbQg/download?force=true&w=640',
      '1999-04-16',
      '$argon2id$v=19$m=65536,p=4,t=3$pIh8iHsYcrvUAj62jLgGtw$PzLjZCSm1lbswHCCr9wr9uqx+YMChM0Zwcwoe2Oet3o'
    ),
    (
      'reed',
      'Megan',
      'Reed',
      'https://unsplash.com/photos/J6sR0-mrJo4/download?force=true&w=640',
      '2001-11-24',
      '$argon2id$v=19$m=65536,p=4,t=3$W3BmYRxQy81oX16dIJQ2yA$G3MYI2+aHj0VySXMWlSQnBf/Ytj2JJ703oI9uZVLjv0'
    ),
    (
      'connelly',
      'Jennifer',
      'Connelly',
      'https://fastly.picsum.photos/id/64/200',
      '1992-01-05',
      '$argon2id$v=19$m=65536,p=4,t=3$ad2YkDa6CaGByK694uhCWw$XSllkg+0CMxg0Uxi4z3mfX2+8rV3UuB/gvIVGLF061o'
    )
`)

console.log('Test users seed completed')
