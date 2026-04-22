import { workerData, parentPort } from 'worker_threads';
import { runSolver } from './solver.js';

const result = runSolver(workerData);
parentPort.postMessage(result);
