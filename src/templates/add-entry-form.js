export const addEntryDialogTemplate = (strings) => `
<dialog id="add-entry-dialog">
  <h2>${strings.addEntry.heading}</h2>
  <form id="add-entry-form" method="dialog">
    <div class="form-grid">
      <div class="form-group">
        <label for="entry-year">${strings.addEntry.year}</label>
        <input type="number" id="entry-year" name="year" required min="2000" max="2100" />
      </div>
      <div class="form-group">
        <label for="entry-month">${strings.addEntry.month}</label>
        <select id="entry-month" name="month" required>
          ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${strings.months[i]}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label for="entry-water">${strings.utilities.water} (${strings.units.water})</label>
        <input type="number" id="entry-water" name="water" step="0.01" />
      </div>
      <div class="form-group">
        <label for="entry-gas">${strings.utilities.gas} (${strings.units.gas})</label>
        <input type="number" id="entry-gas" name="gas" step="1" />
      </div>
      <div class="form-group">
        <label for="entry-electricity">${strings.utilities.electricity} (${strings.units.electricity})</label>
        <input type="number" id="entry-electricity" name="electricity" step="1" />
      </div>
      <div class="form-group">
        <label for="entry-electricity-main">${strings.utilities.electricityMain} (${strings.units.electricityMain})</label>
        <input type="number" id="entry-electricity-main" name="electricity_main" step="1" />
      </div>
    </div>
    <div class="form-actions">
      <button type="button" id="add-entry-cancel">${strings.addEntry.cancel}</button>
      <button type="submit" id="add-entry-submit">${strings.addEntry.save}</button>
      <span id="add-entry-status" class="form-status"></span>
    </div>
  </form>
</dialog>
`;
