const strings = {
    editBtn: 'btn-settings-edit',
    deleteBtn: 'btn-settings-delete',
    addBtn: document.querySelector('.btn-settings-add'),
    saveBtn: document.querySelector('.btn-settings-save'),
    saveTypeInput: document.getElementById('settings_budget_name'),
    tableBody: document.getElementById('tbl-budget-body'),
    inputError: document.querySelector('.helper-text'),
    saveEdit: 'btn-settings-save-edit',
}

const settingController = () => {
    const setUpSettingsDisplay = async () => {
        const types = await request('/types', 'GET', {'Content-Type': 'application/json'});
        const typesObj = await types.json();
        // console.log(typesObj);
        const output = strings.tableBody;
        output.innerHTML = outputTypesTable(typesObj);
    };
    /** Multiple rows returned function */
    const outputTypesTable = (obj) => {
        /**
         * id, type_name, colour
         */
        let html = '';
        obj.forEach(el => {
            html += outputSingleType(el);
        });
        return html;
    };

    /**
     * Single row function 
     */
    const outputSingleType = (obj) => {
        /**
         * id, type_name, colour
         */
        let html = `<tr>
                      <td id="${obj.short_hand}-${obj.id}" class="name-field name-${obj.id}">${obj.type_name}</td>
                      <td class="colour-cell colour-${obj.id}">
                          <div class="type-colour" style="background: ${obj.colour}"></div>
                      </td>
                      <td class="icon-cell">
                          <a class="waves-effect waves-light btn-small btn-flat btn-settings-edit" data-id="${obj.id}"><i class="small fas fa-edit"></i></a>
                          <a class="waves-effect waves-light btn-small btn-flat btn-settings-delete" data-id="${obj.id}"><i class="small fas fa-trash-alt"></i></a>
                      </td>
                  </tr>`;

        return html;
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
    const pickrOptions = {
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
    }
    const pickr = Pickr.create(pickrOptions);

    function RGBToHex(rgb) {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;

        return "#" + r + g + b;
    }

    const saveBudget = async (saveObject, callback, type = 'POST', url = '/types') => {
        const data = await postData(url,type, saveObject);
        const r = await data.json()
        callback(r);
    }

    const renderColourHTML = (type, colour = "") => {
        // type can either be pallet or saved
        switch (type) {
            case 'pallet' :
                return '<div class="color-picker"></div>';
            case 'saved':
                return `<div class="type-colour" style="background: ${colour}"></div>`;
            default:
                break;
        }
    }
    
    const setUpEventListeners = () => {
        /** Edit and Delete types */
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains(strings.editBtn)) {
                if(!e.target.classList.contains(strings.saveEdit)) {
                    // add save class & remove edit class
                    e.target.classList.add(strings.saveEdit);
                    e.target.classList.remove(strings.editBtn);

                    e.target.firstElementChild.classList.remove('fa-edit');
                    e.target.firstElementChild.classList.add('fa-save');

                    // Organise object to send back
                    const id = e.target.dataset.id;

                    // For now can only edit the name and not the colour
                    const name = e.target.parentElement.parentElement.children[0];
                    // ability to change the colour
                    const colourClass = document.querySelector(`.colour-${id} > .type-colour`);
                    // get the colour to pass into Pickr
                    const colourBackground = colourClass.style.background;
                    const hex = RGBToHex(colourBackground);
                    // Set picker options and put default colour
                    colourClass.parentElement.innerHTML = renderColourHTML('pallet');
                    pickrOptions.default = hex;
                    // Initalise it
                    Pickr.create(pickrOptions);
                    name.contentEditable = true;
                } else {
                    // add edit class and remove save
                    e.target.classList.add(strings.editBtn);
                    e.target.classList.remove(strings.saveEdit);

                    e.target.firstElementChild.classList.add('fa-edit');
                    e.target.firstElementChild.classList.remove('fa-save');
                }

            }
            // Delete a budget type
            else if (e.target.classList.contains(strings.deleteBtn)) {
                const id = e.target.dataset.id;
                await deleteBudgetType(id, e.target);
            }
            // Save an edit and post to the server
            else if(e.target.classList.contains(strings.saveEdit)) {
                var id = e.target.dataset.id;
                const name = document.querySelector(`.name-${id}`);
                const colourClass = document.querySelector(`.colour-${id} > .type-colour`);
                const picker = document.querySelector(`.colour-${id} > .pickr > .pcr-button`);
                let hex = RGBToHex(picker.style.color);
                const obj = {
                    type_name: name.innerText,
                    colour:hex // TODO: Bug if no colour is selected
                }
                // needs to be the update endpoint
                await saveBudget(obj, (result) => {
                    if (result.error) {
                        console.log(result.error);
                    }

                    // Update UI
                    document.querySelector(`.colour-${id}`).innerHTML = renderColourHTML('saved', hex);
                    name.contentEditable = false;
                    // Change button Icon back
                    e.target.classList.remove(strings.saveEdit);
                    e.target.classList.add(strings.editBtn);
                    e.target.firstElementChild.classList.add('fa-edit');
                    e.target.firstElementChild.classList.remove('fa-save');
                }, 'PATCH', '/types/'+id);
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
                colour // TODO: Bug if no colour is selected
            }
            await saveBudget(obj, (result) => {
                if (result.error) {
                    // output error
                    strings.saveTypeInput.classList.add('invalid');
                    strings.inputError.dataset.error = result.error;
                    return;
                }
                // add to ui
                strings.tableBody.insertAdjacentHTML('beforeend', outputSingleType(result));
                strings.saveTypeInput.value = '';
            });
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