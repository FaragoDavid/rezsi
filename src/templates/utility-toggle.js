export const utilityToggleTemplate = (strings, btnClass = 'utility-btn') => `
  <div class="utility-toggle">
    <button class="${btnClass}" data-utility="water">${strings.utilities.water}</button>
    <button class="${btnClass}" data-utility="gas">${strings.utilities.gas}</button>
    <button class="${btnClass}" data-utility="electricity">${strings.utilities.electricity}</button>
  </div>`;
