import { expect } from 'chai';
import SysTray from '../../src';
import menu from '../menu.json';

describe('Systray', () => {
  jest.setTimeout(10000);

  it('kill works', async () => {
    const systray = new SysTray({ menu, debug: true });

    systray.kill();

    expect(systray.killed).to.be.true;
  });

  it('onReady gets called', async () => {
    jest.setTimeout(5000);
    const systray = new SysTray({ menu, debug: true });

    await new Promise((resolve) => systray.onReady(() => resolve(undefined)));

    systray.kill();
  });

  it('onExit gets called', async () => {
    jest.setTimeout(5000);
    const systray = new SysTray({ menu, debug: true });

    await new Promise((resolve) => systray.onReady(() => resolve(undefined)));

    const onExitPromise = new Promise((resolve) =>
      systray.onExit(() => resolve(undefined)),
    );

    systray.kill();

    await onExitPromise;
  });
});
