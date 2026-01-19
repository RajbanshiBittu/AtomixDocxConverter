import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";

const BASE = "storage";

export async function createJobWorkspace(filename) {
    const jobId = uuid();

    const workingDir = path.join(BASE, "working", jobId);
    const outputDir = path.join(BASE, "outputs", jobId);

    await fs.mkdir(workingDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    return { jobId, workingDir, outputDir };
}
