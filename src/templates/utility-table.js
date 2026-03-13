export const utilityTableTemplate = (strings) => `
<div class="card">
  <h2>${strings.dashboard.heading}</h2>
  <div class="table-container">
    <table id="utility-table">
        <thead>
          <tr>
            <th>${strings.tableDateHeader}</th>
            <th>${strings.utilities.water}</th>
            <th>${strings.utilities.gas}</th>
            <th>${strings.utilities.electricity}</th>
            <th>${strings.utilities.electricityMain}</th>
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
