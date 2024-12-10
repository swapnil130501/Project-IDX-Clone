import util from 'util';
import child_process, { exec } from 'child_process';

export const execPromisified = util.promisify(child_process.exec);