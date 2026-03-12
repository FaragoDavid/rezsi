import { getSelectedUtility, setSelectedUtility } from './storage.js';

let chartCreators = {};

export function registerChartCreator(name, createFn) {
  chartCreators[name] = createFn;
}

export function initializeUtilityToggle() {
  const buttons = document.querySelectorAll('.utility-btn');
  const selectedUtility = getSelectedUtility();

  buttons.forEach((button) => {
    if (button.dataset.utility === selectedUtility) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const selectedUtility = button.dataset.utility;
      setSelectedUtility(selectedUtility);

      Object.values(chartCreators).forEach((createFn) => createFn(selectedUtility));
    });
  });
}
