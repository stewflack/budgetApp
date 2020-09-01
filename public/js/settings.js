document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
});


const outputTypesTable = (obj) => {
    /**
     * id, type_name, colour
     */
    let html = '';
    html += `
                      <table style="table-layout: auto; width: 100%;">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Colour</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    obj.forEach(el => {
      html += `<tr>
                  <td class="name-field">${el.type_name}</td>
                  <td class="colour-cell">
                      <div class="type-colour" style="background: ${el.colour}"></div>
                  </td>
                  <td class="icon-cell">
                      <a class="waves-effect waves-light btn-small btn-flat btn-settings-edit" data-id="${el.id}"><i class="small fas fa-edit"></i></a>
                      <a class="waves-effect waves-light btn-small btn-flat btn-settings-delete" data-id="${el.id}"><i class="small fas fa-trash-alt"></i></a>
                  </td>
              </tr>`;
    });
    html += `</tbody></table>`;
    return html;
}

(async ()=> {

  const request = await fetch('/types')
  const typesObj = await request.json();
  console.log(typesObj);
  const output = document.getElementById('settingsTypeOutput');
  output.innerHTML = outputTypesTable(typesObj);
})();