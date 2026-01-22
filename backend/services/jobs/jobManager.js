import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import { STORAGE_PATHS, resolveStoragePath } from '../../config/constants.js';


const BASE = resolveStoragePath(STORAGE_PATHS.BASE);

const createJobWorkspace = async (filename) => {
    const jobId = uuid();

    const workingDir = path.join(BASE, "working", jobId);
    const outputDir = path.join(BASE, "outputs", jobId);

    await fs.mkdir(workingDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    return { jobId, workingDir, outputDir };
}

export default createJobWorkspace;