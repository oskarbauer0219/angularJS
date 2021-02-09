import {test} from '../../../../playwright.conf';
import {expectFocused, Key, openUrl, sendKey} from '../../tools.pw-po';
import {
  openDatepicker,
  SELECTOR_DATEPICKER,
  SELECTOR_DATEPICKER_INPUT,
  SELECTOR_DAY,
  SELECTOR_FIRST_WEEKDAY,
  SELECTOR_MONTH_SELECT,
  SELECTOR_NEXT_MONTH,
  SELECTOR_PREV_MONTH,
  SELECTOR_TOGGLE,
  SELECTOR_YEAR_SELECT
} from '../datepicker';

const getFirstOfMonth = (date: Date) => {
  const first = new Date(date);
  first.setDate(1);
  return first;
};

const getLastOfMonth = (date: Date) => {
  const last = getFirstOfMonth(date);
  last.setMonth(last.getMonth() + 1);
  last.setDate(0);
  return last;
};

const preSelectDate = async() => await test.page.click('#selectDate');

const selectStartDate = async(type: string) => {
  await test.page.click('#start-date-dropdown');
  await test.page.click(`#start-date-${type}`);
};

const disableDatepicker = async() => await test.page.click('#disable');

describe('Datepicker', () => {

  beforeEach(async() => await openUrl('datepicker/focus', 'h3:text("Datepicker focus")'));

  it(`should not be present on the page initially`,
     async() => await test.page.waitForSelector(SELECTOR_DATEPICKER, {state: 'detached'}));

  it(`should focus today when opened`, async() => {
    await openDatepicker();
    await expectFocused(SELECTOR_DAY(new Date()), `Today's date should be focused`);
  });

  it(`should focus selected day when opened`, async() => {
    await preSelectDate();  // 10 AUG 2018
    await openDatepicker();
    await expectFocused(SELECTOR_DAY(new Date(2018, 7, 10)), `Selected date should be focused`);
  });

  it(`should focus 1st day of {year, month} startDate day when opened`, async() => {
    await selectStartDate('month-only');  // startDate = AUG 2018
    await openDatepicker();
    await expectFocused(SELECTOR_DAY(new Date(2018, 7, 1)), `First day of startDate should be focused`);
  });

  it(`should focus {year, month, day} startDate day when opened`, async() => {
    await selectStartDate('month-and-day');  // startDate = 10 AUG 2018
    await openDatepicker();
    await expectFocused(SELECTOR_DAY(new Date(2018, 7, 10)), `First day of startDate should be focused`);
  });

  it(`should be closed on toggle element click and focus it`, async() => {
    await openDatepicker();

    // close
    await test.page.click(SELECTOR_TOGGLE);
    await test.page.waitForSelector(SELECTOR_DATEPICKER, {state: 'detached'});

    // check toggle is focused
    await expectFocused(SELECTOR_TOGGLE, `Toggle element should stay focused after datepicker is closed`);
  });

  it(`should be closed on Escape and re-focus toggle element`, async() => {
    await openDatepicker();

    // close
    await sendKey(Key.ESC);
    await test.page.waitForSelector(SELECTOR_DATEPICKER, {state: 'detached'});

    // check toggle is focused
    await expectFocused(SELECTOR_TOGGLE, `Toggle element become re-focused after datepicker is closed`);
  });

  it(`should be closed on date selection and re-focus toggle element`, async() => {
    await openDatepicker();

    // close
    await test.page.click(SELECTOR_DAY(new Date()));
    await test.page.waitForSelector(SELECTOR_DATEPICKER, {state: 'detached'});

    // check toggle is focused
    await expectFocused(SELECTOR_TOGGLE, `Toggle element become re-focused after datepicker is closed`);
  });

  if (process.env.BROWSER !== 'webkit') {
    it(`should trap focus inside opened popup (Tab)`, async() => {
      await openDatepicker();

      // today -> prev. month -> month -> year -> next month -> today -> ...
      await expectFocused(SELECTOR_DAY(new Date()), `Today's date should be focused`);

      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_PREV_MONTH, `Previous Month arrow should be focused`);

      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_MONTH_SELECT, `Month select box should be focused`);

      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_YEAR_SELECT, `Year select box should be focused`);

      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_NEXT_MONTH, `Next Month arrow should be focused`);

      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_DAY(new Date()), `Today's date should be focused`);
    });

    it(`should trap focus inside opened popup with (Shift+Tab)`, async() => {
      await openDatepicker();

      // today -> next month -> year -> month -> prev. month -> today -> ...
      await expectFocused(SELECTOR_DAY(new Date()), `Today's date should be focused`);

      await sendKey('Shift+Tab');
      await expectFocused(SELECTOR_NEXT_MONTH, `Next Month arrow should be focused`);

      await sendKey('Shift+Tab');
      await expectFocused(SELECTOR_YEAR_SELECT, `Year select box should be focused`);

      await sendKey('Shift+Tab');
      await expectFocused(SELECTOR_MONTH_SELECT, `Month select box should be focused`);

      await sendKey('Shift+Tab');
      await expectFocused(SELECTOR_PREV_MONTH, `Previous Month arrow should be focused`);

      await sendKey('Shift+Tab');
      await expectFocused(SELECTOR_DAY(new Date()), `Today's date should be focused`);
    });
  }

  it(`should change month on click and keep 'next' arrow focused`, async() => {
    await openDatepicker();

    // first date of current month
    const firstDate = getFirstOfMonth(new Date());
    await test.page.waitForSelector(SELECTOR_DAY(firstDate));

    // skipping one months
    await test.page.click(SELECTOR_NEXT_MONTH);
    await expectFocused(SELECTOR_NEXT_MONTH, `Next month arrow should be focused`);

    // make sure we changed month
    await test.page.waitForSelector(SELECTOR_DAY(firstDate), {state: 'detached'});
  });

  it(`should change month on click and keep 'prev' arrow focused`, async() => {
    await openDatepicker();

    // last date of current month
    const lastDate = getLastOfMonth(new Date());
    await test.page.waitForSelector(SELECTOR_DAY(lastDate));

    // focus next month
    await test.page.click(SELECTOR_PREV_MONTH);
    await expectFocused(SELECTOR_PREV_MONTH, `Previous month arrow should be focused`);

    await test.page.waitForSelector(SELECTOR_DAY(lastDate), {state: 'detached'});
  });

  it(`should re-focus current element after inside click`, async() => {
    await openDatepicker();

    // click on weekday header
    await test.page.click(SELECTOR_FIRST_WEEKDAY);
    await expectFocused(SELECTOR_DAY(new Date()), `Today's date should stay focused`);
  });

  if (process.env.BROWSER !== 'webkit') {
    it(`should allow focusing datepicker input`, async() => {
      await openDatepicker();

      // focus input
      await test.page.click(SELECTOR_DATEPICKER_INPUT);
      await expectFocused(SELECTOR_DATEPICKER_INPUT, `Datepicker input should be focused`);

      // tab should go back to datepicker
      await sendKey(Key.Tab);
      await expectFocused(SELECTOR_PREV_MONTH, `Previous Month arrow should be focused`);
    });
  }

  it(`should be closed on Escape from input and keep focus`, async() => {
    await openDatepicker();

    // focus input
    await test.page.click(SELECTOR_DATEPICKER_INPUT);
    await expectFocused(SELECTOR_DATEPICKER_INPUT, `Datepicker input should be focused`);

    // close
    await sendKey(Key.ESC);
    await test.page.waitForSelector(SELECTOR_DATEPICKER, {state: 'detached'});

    // check input is still focused
    await expectFocused(SELECTOR_DATEPICKER_INPUT, `Input element should stay focused after datepicker is closed`);
  });

  it(`should not allow any interactions when disabled`, async() => {
    await disableDatepicker();
    await preSelectDate();  // 10 AUG 2018
    await openDatepicker();

    await expectFocused(SELECTOR_TOGGLE, `Toggling element should stay focused`);

    const dayElement = SELECTOR_DAY(new Date(2018, 7, 10));
    await test.page.waitForSelector(dayElement);
    let message = '';
    try {
      await test.page.click(dayElement, {timeout: 200});
    } catch (e) {
      message = e.message;
    }
    expect(message).toContain('checking that element receives pointer events');
  });

  describe('Keyboard', () => {

    it(`should handle focus correctly when months are changed with keyboard`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await expectFocused(SELECTOR_DAY(new Date(2018, 7, 10)), `10 AUG should be focused`);

      await sendKey(Key.ArrowUp);
      await expectFocused(SELECTOR_DAY(new Date(2018, 7, 3)), `03 AUG should be focused`);

      await sendKey(Key.ArrowUp);
      await expectFocused(SELECTOR_DAY(new Date(2018, 6, 27)), `27 JUL should be focused`);

      await sendKey(Key.ArrowDown);
      await expectFocused(SELECTOR_DAY(new Date(2018, 7, 3)), `03 AUG should be focused`);
    });

    it(`should focus previous day with 'ArrowLeft'`, async() => {
      await openDatepicker();

      const yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);

      await sendKey(Key.ArrowLeft);
      await expectFocused(SELECTOR_DAY(yesterday), `Yesterday should be focused`);
    });

    it(`should focus next day with 'ArrowRight'`, async() => {
      await openDatepicker();

      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      await sendKey(Key.ArrowRight);
      await expectFocused(SELECTOR_DAY(tomorrow), `Tomorrow should be focused`);
    });

    it(`should focus previous week with 'ArrowUp'`, async() => {
      await openDatepicker();

      const previousWeek = new Date();
      previousWeek.setDate(new Date().getDate() - 7);

      await sendKey(Key.ArrowUp);
      await expectFocused(SELECTOR_DAY(previousWeek), `Today-7 days should be focused`);
    });

    it(`should focus next week with 'ArrowDown'`, async() => {
      await openDatepicker();

      const nextWeek = new Date();
      nextWeek.setDate(new Date().getDate() + 7);

      await sendKey(Key.ArrowDown);
      await expectFocused(SELECTOR_DAY(nextWeek), `Today+7 days should be focused`);
    });

    it(`should focus first day of month with 'Home'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey(Key.Home);
      await expectFocused(SELECTOR_DAY(new Date(2018, 7, 1)), `First day of month should be focused`);
    });

    it(`should focus last day of month with 'End'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey(Key.End);
      await expectFocused(SELECTOR_DAY(new Date(2018, 7, 31)), `Last day of month should be focused`);
    });

    it(`should focus same day of previous month with 'PageUp'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey(Key.PageUp);
      await expectFocused(SELECTOR_DAY(new Date(2018, 6, 10)), `Same day of previous month should be focused`);
    });

    it(`should focus same day of next month with 'PageDown'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey(Key.PageDown);
      await expectFocused(SELECTOR_DAY(new Date(2018, 8, 10)), `Same day of next month should be focused`);
    });

    it(`should focus same day of previous year with 'Shift+PageUp'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey('Shift+PageUp');
      await expectFocused(SELECTOR_DAY(new Date(2017, 7, 10)), `Same day of previous year should be focused`);
    });

    it(`should focus same day of next year with 'Shift+PageDown'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey('Shift+PageDown');
      await expectFocused(SELECTOR_DAY(new Date(2019, 7, 10)), `Same day of next year should be focused`);
    });

    it(`should focus min available day with 'Shift+Home'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey('Shift+Home');
      await expectFocused(SELECTOR_DAY(new Date(2000, 0, 1)), `Min available day should be focused`);
    });

    it(`should focus max available day with 'Shift+End'`, async() => {
      await preSelectDate();  // 10 AUG 2018
      await openDatepicker();

      await sendKey('Shift+End');
      await expectFocused(SELECTOR_DAY(new Date(2100, 0, 1)), `Max available day should be focused`);
    });
  });
});
