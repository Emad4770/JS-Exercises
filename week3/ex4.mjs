import dayjs from 'dayjs';
import sqlite from 'sqlite3'

const db = new sqlite.Database('questions.sqlite',
  (err) => { if (err) throw err })

function Answer(id, text, email, date, score = 0) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.score = score;
  this.date = dayjs(date);

  this.toString = () => {
    return `${this.email} replied '${this.text}' on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}\n`;
  }
}

function Question(id, text, email, date) {
  this.id = id;
  this.text = text;
  this.email = email;
  this.date = dayjs(date);

  this.toString = () => {
    return `Question '${this.text}' asked by ${this.email} on ${this.date.format('YYYY-MM-DD')}.\n`;
  }

  this.getAnswers = () => {
    const alist = []
    return new Promise((resolve, reject) => {
      const sql = `SELECT a.id, a."text",u.email , a.date, a.score
      from question q, answer a , "user" u 
      WHERE a.questionId = q.id and a.authorId = u.id 
      AND q.id = ?`
      db.each(sql, [this.id], (err, row) => {
        alist.push(new Answer(row.id, row.text, row.email, row.date, row.score))
        if (err)
          reject(err)
        else
          resolve(alist)
      })
    })
  }

  this.getTop = function (num = 1) {

    const topList = []

    const sql = `SELECT a.id, a."text",u.email , a.date, a.score
    FROM answer a , "user" u
    WHERE a.authorId = u.id
    ORDER by a.score DESC `

    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        rows.forEach(row => {
          topList.push(new Answer(row.id, row.text, row.email, row.date, row.score))
        });

        if (err)
          reject(err)
        else
          resolve(topList.slice(0, num))
      })
    })
  }

  this.getUserId = function (email) {
    return new Promise((resolve, reject) => {
      const sql = `select u.id 
        from "user" u 
        where u.email = ?`
      db.get(sql, [email], (err, row) => {
        if (err)
          reject(err)
        else
          resolve(Number(row.id))
      })
    })
  }

  this.addAnswer = function (answer) {

    const sql = `INSERT INTO answer (id,"text",authorId,date,score,questionId)
    Values (?,?, ?, ?, ?, ?)`

    const userIdPromise = this.getUserId(answer.email)

    return userIdPromise.then((userId) => {
      return new Promise((reslove, reject) => {

        db.run(sql, [answer.id, answer.text, userId, answer.date.format('YYYY-MM-DD'), answer.score, this.id], (err) => {

          if (err)
            reject(err)
          else
            reslove()
        })
      })
    })
  }


}

function QuestionList() {
  this.getQuestion = function (questionId) {
    return new Promise((resolve, reject) => {
      const sql = `select q.id, q.text, u.email, q.date
        from question q, "user" u
        where q.id = ?
        and q.authorId = u.id `

      db.get(sql, [questionId], (err, row) => {
        if (err) reject(err)
        else resolve(new Question(row.id, row.text, row.email, dayjs(row.date)))
      })

    })
  }

  this.getUserId = function (email) {
    return new Promise((resolve, reject) => {
      const sql = `select u.id 
        from "user" u 
        where u.email = ?`
      db.get(sql, [email], (err, row) => {
        if (err)
          reject(err)
        else
          resolve(Number(row.id))
      })
    })
  }

  this.addQuestion = function (q) {

    const userEmail = q.email

    const userIdPromise = this.getUserId(userEmail)

    return userIdPromise.then((userId) => {
      return new Promise((resolve, reject) => {
        const sql = `insert into question(id, text, authorId, date)
             values(?, ?, ?, ?)`

        db.run(sql, [q.id, q.text, userId, q.date.format('YYYY-MM-DD')],
          (err) => {
            if (err) reject(err)
            else resolve()
          })
      })
    })

  }

  this.afterDate = function (date) {

    const list = []
    const sql = `SELECT q.id ,q."text" ,u.email ,q.date  FROM question q , "user" u 
    WHERE q.date > ?
    and u.id = q.authorId `

    return new Promise((resolve, reject) => {
      db.all(sql, [date.format("YYYY-MM-DD")], (err, rows) => {
        rows.forEach(row => {
          list.push(new Question(row.id, row.text, row.email, row.date))
        });

        if (err)
          reject(err)
        else
          resolve(list)
      })

    })

  }
}






const ans1 = new Answer(8, 'Yessssss', 'luigi.derussis@polito.it', '2024-05-02', 19)

const qlist = new QuestionList()
const q1 = qlist.getQuestion(1)
q1.then((q) => { console.log(q.toString()) })

const q2 = new Question(5, 'Does it work?', 'luca.mannella@polito.it', dayjs())
// qlist.addQuestion(q2).then(() => { console.log("Question added") })

// q1.then((q) => { q.getAnswers().then((a) => { console.log(a.toString()); }) })
// q1.then((q) => { q.addAnswer(ans1).then(() => { console.log("Answer added") }) })
// q1.then((q) => { q.getTop(4).then((a) => { console.log(a) }) })

qlist.afterDate(dayjs("2024-02-08")).then((q) => { console.log(q.toString()); })
