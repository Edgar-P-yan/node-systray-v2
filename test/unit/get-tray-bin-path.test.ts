import { expect } from 'chai';
import { getTrayBinPath } from '../../src/get-tray-bin-path';

describe('getTrayBinPath', () => {
  it('works', () => {
    const expectedBinName = (
      {
        win32: `tray_windows_release.exe`,
        darwin: `tray_darwin_release`,
        linux: `tray_linux_release`,
      } as Record<string, string>
    )[process.platform];

    const binPath = getTrayBinPath(false, false);

    expect(binPath.endsWith(expectedBinName!)).to.be.true;
  });
});
