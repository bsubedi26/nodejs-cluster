const app = require('express')();
const cluster = require('cluster');
const os = require('os');

// Returns true if the process is a master. This is determined by the process.env.NODE_UNIQUE_ID. If process.env.NODE_UNIQUE_ID is undefined, then isMaster is true.
if (cluster.isMaster) {
    // os.cpus() method returns an array of objects containing information about each CPU/core installed.
    const workers = os.cpus().length;
    console.log('Master cluster setting up ' + workers + ' workers...');
    // spawns new worker processes, it can only be called from the master process.
    for (var i = 0; i < workers; i++) {
        cluster.fork();
    }
    // cluster event listeners
    cluster.on('online', (worker) => {
        console.log('Worker ' + worker.process.pid + ' is online');
    })
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starter a new worker');
        cluster.fork();
    })
}
else {
    // express server
    app.all('/*', (req, res) => {
        res.send('process pid number: ' + process.pid).end();
    })
    // express listen port
    app.listen(3000, () => {
        console.log('Process ' + process.pid + ' is listening to all incoming requests');
    })    
}
