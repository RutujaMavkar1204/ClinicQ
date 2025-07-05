import {app} from './app.js'
import connectDB from './db/index.js'
import dotenv from 'dotenv'


dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("Error in database connection", error)
})

import userRouter from './routes/user.routes.js'
app.use('/api/v1/users',userRouter)

import queueRouter from './routes/queue.routes.js'
app.use('/api/v1/queues', queueRouter)

app.use((err, req, res, next) => {
  console.error(err.stack);  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
