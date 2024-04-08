import express from 'express'
import morgan from 'morgan'

const app = express();
app.use(morgan('dev'))
app.use(express.static('./express/public'))

app.get('/', (req, res) => {
    res.send('Hello There!')
})

app.get('/about', (req, res) => {
    res.send('About Us')
}
)



app.listen(3000, () => {
    console.log("Application is running!!");
})

