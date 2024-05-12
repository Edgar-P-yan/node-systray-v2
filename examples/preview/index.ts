import SysTray, { ClickEvent } from './../../src/index';
import { icoIconBase64 } from './../ico-icon';
import { pngIconBase64 } from './../png-icon';

const systray = new SysTray({
  menu: {
    // you should using .png icon in macOS/Linux, but .ico format in windows
    icon:
      process.platform === 'win32' || process.platform === 'cygwin'
        ? icoIconBase64
        : pngIconBase64,
    title: 'Systray Test',
    tooltip: 'Tips',
    items: [
      {
        title: 'Systray Test: Running 00:00:00',
        tooltip: 'Systray Test is running...',
        // checked is implement by plain text in linux
        checked: false,
        enabled: false,
      },
      {
        title: 'Simple checkbox: checked',
        tooltip: 'A tooltip for the checkbox.',
        // checked is implement by plain text in linux
        checked: true,
        enabled: true,
      },
      {
        title: 'Click counter: 0',
        tooltip: 'A tooltip for the click counter.',
        checked: false,
        enabled: true,
      },
      {
        title: 'A quote by a wise man to test the unicode: 屁股比奶好 🚬',
        tooltip: 'A tooltip for the unicode text.',
        checked: false,
        enabled: true,
      },
      {
        title: 'Exit',
        tooltip: 'Exit from the app.',
        checked: false,
        enabled: true,
      },
    ],
  },
  debug: true,
  copyDir: true, // copy go tray binary to outside directory, useful for packing tool like pkg.
});

systray.onError((err) => {
  console.error(err);
});

systray.onReady(() => {
  const startTime = new Date();
  const updateTimerInterval = setInterval(() => updateRunningDuration(), 1000);

  systray.onClick((event) => {
    if (event.seq_id === 1) {
      onCheckboxClick(event);
    } else if (event.seq_id === 2) {
      onCounterClick(event);
    } else if (event.seq_id === 4) {
      console.log(`Clicked the Exit button: ${JSON.stringify(event)}`);
      console.log('Killing the systray...');
      clearInterval(updateTimerInterval);
      systray.kill();
    }
  });

  function onCheckboxClick(event: ClickEvent): void {
    console.log(`Clicked the checkbox: ${JSON.stringify(event)}`);

    systray.sendAction({
      type: 'update-item',
      item: {
        ...event.item,
        title: `Simple checkbox: ${
          !event.item.checked ? 'checked' : 'unchecked'
        }`,
        checked: !event.item.checked,
      },
      seq_id: event.seq_id,
    });
  }

  let clickCounter = 0;
  function onCounterClick(event: ClickEvent): void {
    console.log(`Clicked the counter: ${JSON.stringify(event)}`);

    clickCounter++;
    systray.sendAction({
      type: 'update-item',
      item: {
        ...event.item,
        title: `Click counter: ${clickCounter}`,
      },
      seq_id: event.seq_id,
    });
  }

  function updateRunningDuration(): void {
    const currentTime = new Date();

    const secondsElapsed = Math.floor(
      (currentTime.valueOf() - startTime.valueOf()) / 1000,
    );

    const displayedSeconds = secondsElapsed % 60;
    const displayedMinutes = Math.floor(secondsElapsed / 60) % 60;
    const displayedHours = Math.floor(secondsElapsed / 60 / 60) % 24;

    systray.sendAction({
      type: 'update-item',
      item: {
        title: `Systray Test: Running ${displayedHours
          .toString()
          .padStart(2, '0')}:${displayedMinutes
          .toString()
          .padStart(2, '0')}:${displayedSeconds.toString().padStart(2, '0')}`,
        tooltip: 'Systray Test is running...',
        // checked is implement by plain text in linux
        checked: false,
        enabled: false,
      },
      seq_id: 0,
    });
  }
});
