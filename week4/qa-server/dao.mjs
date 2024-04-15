/* Data Access Object (DAO) module for accessing Q&A */
/* Initial version taken from exercise 4 (week 03) */

import sqlite from 'sqlite3';
import { Question, Answer } from './QAModels.mjs';
import dayjs from 'dayjs';

// open the database
const db = new sqlite.Database('questions.sqlite', (err) => {
  if (err) throw err;
});

/** QUESTIONS **/
// get all the questions
export const listQuestions = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, text FROM question`
    db.all(sql, (err, rows) => {
      if (err)
        reject(err)
      else if (rows === undefined)
        resolve({ error: "There are no Questions in the Database, Try later!" })
      else {
        const qList = rows.map((row) => { return new Question(row.id, row.text) })
        resolve(qList)
      }
    })
  })
}

// get a question given its id
export const getQuestion = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT question.*, user.email FROM question JOIN user ON question.authorId = user.id WHERE question.id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: "Question not available, check the inserted id." });
      else {
        resolve(new Question(row.id, row.text, row.email, row.date));
      }
    });
  });
}

// add a new question
export const addQuestion = (question) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT id from user WHERE email = ?';
    db.get(sql, [question.email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: "Author not available, check the inserted email." });
      else {
        sql = 'INSERT INTO question(text, authorId, date) VALUES(?,?,DATE(?))';
        db.run(sql, [question.text, row.id, question.date.toISOString()], function (err) {
          if (err)
            reject(err);
          else
            resolve(new Question(this.lastID, question.text, question.email, dayjs()));
        });
      }
    });
  });
}

/** ANSWERS **/

// get all the answer of a given question
export const listAnswersOf = (questionId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT answer.*, user.email FROM answer JOIN user ON answer.authorId=user.id
    WHERE answer.questionId = ?`;
    db.all(sql, [questionId], (err, rows) => {
      if (err)
        reject(err)
      else if (rows.length == 0) {
        resolve({ error: "There are no answers for this question" })
      }
      else {
        const answers = rows.map((ans) => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));
        resolve(answers);
      }
    });
  });
}

// add a new answer
export const addAnswer = (answer, questionId) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT id from user WHERE email = ?';
    db.get(sql, [answer.email], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: "Author not available, check the inserted email." });
      else {
        let sql = 'SELECT id from question WHERE id = ?';
        db.get(sql, [questionId], (err, row) => {
          if (err)
            reject(err)
          else if (row === undefined)
            resolve({ error: "This question is not available, check the inserted id." })
          else {
            let sql = "INSERT INTO answer(text, authorId, date, score, questionId) VALUES (?, ?, DATE(?), ?, ?)";
            db.run(sql, [answer.text, row.id, answer.date.toISOString(), answer.score, questionId], function (err) {
              if (err)
                reject(err);
              else
                resolve(new Answer(this.lastID, answer.text, answer.email, answer.date, 0));
            });

          }
        })
      }
    });
  });
}

// update an existing answer
export const updateAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id FROM answer
    WHERE id = ?`
    db.get(sql, [answer.id], (err, row) => {
      if (err)
        reject(err)
      else if (row === undefined) {
        resolve({ error: "There is no answer with this id, please check the answer id!" })
      }
      else {
        const sql = `UPDATE answer
        SET "text" = ?, date = DATE(?)
        WHERE id = ?`;
        db.run(sql, [answer.text, answer.date.toISOString(), answer.id], function (err) {
          if (err)
            reject(err)
          else
            resolve(new Answer(answer.id, answer.text, answer.email, dayjs(), this.score))
        })
      }
    })
  })
}

// vote for an answer
export const voteAnswer = (answerId, vote) => {
  // write something clever
}