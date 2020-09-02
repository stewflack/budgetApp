const strings = {
    editBtn: document.querySelector('.btn-settings-edit'),
    deleteBtn: document.querySelector('.btn-settings-delete')
}

const settingController = () => {
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
    };

    const setUpSettingsDisplay = async () => {
        const types = await request('/types', 'GET', {'Content-Type': 'application/json'});
        const typesObj = await types.json();
        // console.log(typesObj);
        const output = document.getElementById('settingsTypeOutput');
        output.innerHTML = outputTypesTable(typesObj);
    };

    const removeParentFromUI = (child) => {
        const parent = child.parentNode.parentNode.remove();
    }

    const editBudgetType = async (id) => {
        const editResponse = await request('/types', "POST",{'Content-Type': 'application/json'} ,JSON.stringify(data))
    }

    const deleteBudgetType = async (id, element) => {
        // todo, change to param
        const body = {id};
        const editResponse = await request('types', "DELETE",{'Content-Type': 'application/json'} ,JSON.stringify(body));
        const data = await editResponse.json();
        if(data.success) {
            // Remove from UI
            removeParentFromUI(element);
        }
    }

    const setUpEventListeners = () => {
        /** Edit and Delete types */
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-settings-edit')) {
                const id = e.target.dataset.id;
                
            } else if (e.target.classList.contains('btn-settings-delete')) {
                const id = e.target.dataset.id;
                await deleteBudgetType(id, e.target);
            }
        })
    }

    return {
        init: async () => {
            /** Collapseable table  */
            document.addEventListener('DOMContentLoaded', function() {
                var elems = document.querySelectorAll('.collapsible');
                var instances = M.Collapsible.init(elems);
            });
            await setUpSettingsDisplay();
            setUpEventListeners();
            
        }
    };
}

(async ()=> {
    await settingController().init();
})();