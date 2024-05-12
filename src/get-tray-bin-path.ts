import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

export function getTrayBinPath(
  debug = false,
  copyDir: boolean | string = false,
): string {
  const binName = (
    {
      win32: `tray_windows${debug ? '' : '_release'}.exe`,
      darwin: `tray_darwin${debug ? '' : '_release'}`,
      linux: `tray_linux${debug ? '' : '_release'}`,
    } as Record<string, string>
  )[process.platform];

  if (!binName) {
    throw new Error(
      `node-systray-v2: unsupported platform ${process.platform}.`,
    );
  }

  const binPath = path.resolve(`${__dirname}/../traybin/${binName}`);

  if (copyDir) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../package.json');

    copyDir = path.join(
      typeof copyDir === 'string'
        ? copyDir
        : `${os.homedir()}/.cache/node-systray/`,
      pkg.version,
    );

    const copyDistPath = path.join(copyDir, binName);
    if (!fs.existsSync(copyDistPath)) {
      fs.ensureDirSync(copyDir);
      fs.copySync(binPath, copyDistPath);
    }

    return copyDistPath;
  }

  return binPath;
}
