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
            script: "./workers/testWorker.mjs",
            cwd: ".",
            watch: false
        },
        {
            name: "super_worker_registrationWorker",
            script: "./workers/registrationWorker.mjs",
            cwd: ".",
            watch: false
        },
        {
            name: "super_worker_emailVerificationWorker",
            script: "./workers/emailVerification.mjs",
            cwd: ".",
            watch: false
        }
    ]
}
