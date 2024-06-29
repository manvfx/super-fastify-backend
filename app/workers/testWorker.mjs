import { config } from "../../config.mjs";
import { default as Queue } from 'bull';

let queue = new Queue('jobQTest', config.redis_bull_url);

queue.process( 2, async (job) => {
    console.log('Worker Started.');
    console.log(job.data);
    console.log("------------------");
});
