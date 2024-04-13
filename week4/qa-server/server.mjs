import express, { text } from 'express'
import morgan from 'morgan'
import { getQuestion, addQuestion, listQuestions, listAnswersOf, addAnswer } from './dao.mjs'
import { Answer, Question } from './QAModels.mjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const timestamp = "2014-06-01 12:00"
const tz = "America/New_York"
// import dao from './dao.mjs'
//     dao.getQuestion

const app = express()
app.use(morgan('common'))
app.use(express.json())

/** QUESTIONS **/

// Get a question by id
app.get('/questions/:id', (req, res) => {
    const questionId = req.params.id
    getQuestion(questionId).then((q) => {
        res.json(q)
    }).catch((err) => {
        res.sendStatus(500).send("Database error: " + err)
    }
    )
})
// Get a list of questions
app.get('/questions', (req, res) => {

    listQuestions().then((list) => {
        res.json(list)
    }).catch((err) => {
        res.sendStatus(500).send("Database error " + err)
    })

})
// Add a new question
app.post('/questions', (req, res) => {
    const authorEmail = req.body.email
    const questionText = req.body.text
    const question = new Question(1, questionText, authorEmail, dayjs())
    addQuestion(question).then((q) => {
        res.json(q)
    }).catch((err) => {
        res.sendStatus(500).send("Database error: " + err)
    })
})

/** ANSWERS **/

// Get all answers for a question
app.get('/questions/:id/answers', (req, res) => {
    const questionId = req.params.id
    listAnswersOf(questionId).then((answers) => {
        res.json(answers)
    }).catch((err) => {
        res.status(500).send("Database error: " + err)
    })
})

// Add an answer to a question

app.post('/questions/:id/answers', (req, res) => {
    const questionId = req.params.id
    const answerText = req.body.text
    const authorEmail = req.body.email
    addAnswer(new Answer(1, answerText, authorEmail, dayjs(), 0), questionId).then((a) => {
        res.json(a)
    }).catch((err) => {
        res.status(500).send("Database error: " + err)
    })

})

app.listen(3000, () => { console.log("Running!") })
