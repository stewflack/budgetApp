const strings = {
    editBtn: document.querySelector('.btn-settings-edit'),
    deleteBtn: document.querySelector('.btn-settings-delete'),
    addBtn: document.querySelector('.btn-settings-add'),
    saveBtn: document.querySelector('.btn-settings-save'),
    saveTypeInput: document.getElementById('settings_budget_name'),
    tableBody: document.getElementById('tbl-budget-body'),
    inputError: document.querySelector('.helper-text')
}

const settingController = () => {
    const outputTypesTable = (obj) => {
        /**
         * id, type_name, colour
         */
        let html = '';
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
        return html;
    };

    const setUpSettingsDisplay = async () => {
        const types = await request('/types', 'GET', {'Content-Type': 'application/json'});
        const typesObj = await types.json();
        // console.log(typesObj);
        const output = strings.tableBody;
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
    /**
     * Colour Picker from third party library 
     */
    const pickr = Pickr.create({
        el: '.color-picker',
        theme: 'nano', // or 'monolith', or 'nano'
    
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],
    
        components: {
            // Main components
            preview: true,
            opacity: true,
            hue: true,
    
            // Input / output Options
            interaction: {
                hex: true,
                input: true,
                clear: true,
                save: true
            }
        }
    });  

    // As colour picker stores in rgb we need to covert it to hex which these functions do 
    function componentToHex(c) {
         var hex = c.toString(16); 
         return hex.length == 1 ? "0" + hex : hex; 
    } 
    
    function rgbToHex(r, g, b) { 
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b); 
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
        });
        let addCounter = 0;
        
        strings.addBtn.addEventListener('click', (e) => {
            const row = document.getElementById('add-row');
            if(row.style.display != 'none') {
                row.style.display = 'none';
                strings.inputError.dataset.error = '';
                strings.saveTypeInput.classList.remove('invalid');
            } else {
                row.style.display = 'table-row';
            }
        });

        let colour;
        pickr.on('save',(color, instance) => {
            colour = color.toHEXA().toString();
        })
        
        strings.saveBtn.addEventListener('click', async () => {
            strings.inputError.dataset.error = '';
            const obj = {
                type_name: strings.saveTypeInput.value,
                colour
            }

            const data = await postData('/types','POST', obj);
            const r = await data.json()
            console.log(r);
            if (r.error) {
                // output error
                strings.saveTypeInput.classList.add('invalid');
                strings.inputError.dataset.error = r.error;
                return;
            }
            // add to ui 
            

        });

    }

    return {
        init: async () => {
            const row = document.getElementById('add-row');
            row.style.display = 'none';
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