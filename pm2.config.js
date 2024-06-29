module.exports = {
    apps: [
        {
            name: "super_fastify_backend",
            script: "./index.mjs",
            cwd: ".",
            watch: false
        },
        {
            name: "super_worker_testWorker",
            script: "./app/workers/testWorker.mjs",
            cwd: ".",
            watch: false
        },
        {
            name: "super_worker_registrationWorker",
            script: "./app/workers/registrationWorker.mjs",
            cwd: ".",
            watch: false
        },
        {
            name: "super_worker_emailVerificationWorker",
            script: "./app/workers/emailVerification.mjs",
            cwd: ".",
            watch: false
        }
    ]
}

