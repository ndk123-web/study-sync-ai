import express from 'express';

const app = express();

app.get('/', (req, res) => {
    return res.status(200).json({
        value: "Hello This is Home Page"
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    return res.status(500).json({
        value: "Error Page"
    });
});

app.listen(3000, () => {
    console.log("Express Listening on port 3000");
});
