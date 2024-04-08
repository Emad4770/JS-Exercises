import express from 'express'
import morgan from 'morgan'

const app = express();
app.use(morgan('dev'))
app.use(express.static('./express/public'))

app.get('/', (req, res) => {
    res.send('Hello There!')
})


app.listen(3000, () => {
    console.log("Application is running!!");
})

