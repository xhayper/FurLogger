import fs, { PathLike } from "node:fs";
import path from "node:path";

export const WalkPath = (
    directoryPath: PathLike,
    options?:
        | {
              encoding: BufferEncoding | null;
              withFileTypes?: false | undefined;
          }
        | BufferEncoding
        | null
): string[] => {
    const pathList = [];

    const files = fs.readdirSync(directoryPath, options);
    for (const file of files) {
        const fullPath = path.resolve(directoryPath.toString(), file);

        if (fs.statSync(fullPath).isDirectory()) {
            WalkPath(fullPath, options);
        } else {
            pathList.push(fullPath);
        }
    }

    return pathList;
};
