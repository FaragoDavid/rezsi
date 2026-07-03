import { fetchUtilityData, serializeCSV } from '../data/csv-loader.js';
import { writeData } from '../services/github.js';
import { strings } from '../i18n/strings.js';

export function initializeAddEntryForm(onSaved) {
  const dialog = document.getElementById('add-entry-dialog');
  const form = document.getElementById('add-entry-form');
  const openBtn = document.getElementById('add-entry-open');
  const cancelBtn = document.getElementById('add-entry-cancel');
  if (!dialog || !form || !openBtn) return;

  openBtn.addEventListener('click', () => {
    prefillNextEntry();
    document.getElementById('add-entry-status').textContent = '';
    document.getElementById('add-entry-status').className = 'form-status';
    dialog.showModal();
  });

  cancelBtn.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('add-entry-submit');
    const status = document.getElementById('add-entry-status');

    submitBtn.disabled = true;
    status.textContent = strings.addEntry.saving;
    status.className = 'form-status';

    try {
      const data = new FormData(form);
      const newRecord = {
        year: parseInt(data.get('year'), 10),
        month: parseInt(data.get('month'), 10),
        water: data.get('water') !== '' ? parseFloat(data.get('water')) : '',
        gas: data.get('gas') !== '' ? parseFloat(data.get('gas')) : '',
        electricity: data.get('electricity') !== '' ? parseFloat(data.get('electricity')) : '',
        electricity_main: data.get('electricity_main') !== '' ? parseFloat(data.get('electricity_main')) : '',
      };

      const existing = await fetchUtilityData();
      const idx = existing.findIndex((r) => r.year === newRecord.year && r.month === newRecord.month);

      let updated;
      if (idx >= 0) {
        updated = [...existing];
        updated[idx] = newRecord;
      } else {
        updated = [...existing, newRecord].sort((a, b) => a.year - b.year || a.month - b.month);
      }

      await writeData(serializeCSV(updated));

      dialog.close();
      onSaved();
    } catch (err) {
      console.error('Failed to save entry:', err);
      status.textContent = strings.addEntry.error;
      status.className = 'form-status error';
      submitBtn.disabled = false;
    }
  });
}

async function prefillNextEntry() {
  try {
    const existing = await fetchUtilityData();
    if (existing.length === 0) return;

    const last = [...existing].sort((a, b) => a.year - b.year || a.month - b.month).at(-1);
    let year = last.year;
    let month = last.month + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }

    document.getElementById('entry-year').value = year;
    document.getElementById('entry-month').value = month;
  } catch {
    // leave blank
  }
}
