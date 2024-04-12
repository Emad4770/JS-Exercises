import express from 'express'
import morgan from 'morgan'
import { getQuestion, addQuestion } from './dao.mjs'
import { Question } from './QAModels.mjs'
import dayjs from 'dayjs'
// import dao from './dao.mjs'
//     dao.getQuestion

const app = express()
app.use(morgan('common'))
app.use(express.json())

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
    res.send("Not implemented yet")
})

// Add a new question
app.post('/questions', (req, res) => {
    const authorEmail = req.body.email
    const questionText = req.body.text
    const question = new Question(1, questionText, authorEmail, dayjs())
    addQuestion(question).then((id) => {
        res.json({ id: id, text: questionText, email: authorEmail, date: dayjs() })
    }).catch((err) => {
        res.sendStatus(500).send("Database error: " + err)
    })
})


app.listen(3000, () => { console.log("Running!") })