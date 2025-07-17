import app from './main.js'
import connectDB from './db/db.js'

connectDB()
    .then(()=> {
        app.on('error',(err)=>{
            console.log("Error in creating Express App: ",err);
        })

        app.listen(process.env.DEV_PORT || 3000 , () => {
            console.log("Express running on http://localhost:",process.env.DEV_PORT || 3000);
        })
    })
    .catch((err)=>{
        console.log('Error in Creating Express App Check Database: ', err);
        process.exit(1);
    })