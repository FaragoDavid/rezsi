export const utilityTableTemplate = (strings) => `
<div class="card">
  <div class="data-section">
    <h2>${strings.dashboard.heading}</h2>
    <table id="utility-table">
      <thead>
        <tr>
          <th>${strings.table.headers.date}</th>
          <th>${strings.table.headers.water}</th>
          <th>${strings.table.headers.gas}</th>
          <th>${strings.table.headers.electricity}</th>
          <th>${strings.table.headers.electricityMain}</th>
        </tr>
      </thead>
      <tbody id="utility-data">
        <tr>
          <td colspan="5">${strings.dashboard.loadingMessage}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
`;
