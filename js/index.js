let editando = false;
let productos = {}
let copy = null;

function $(attr){
    return document.querySelector(attr);
}


$('form').onsubmit = function(evt){
    evt.preventDefault();

    const [ code, description, amount, price ] = [
        $('input[name="code"]').value.trim(),
        $('input[name="description"]').value.trim(),
        $('input[name="amount"]').valueAsNumber,
        $('input[name="price"]').valueAsNumber
    ]

    if(!(code.length && description.length && amount >= 0 && price >= 0)){
        return alert('Los datos ingresados son insuficientes o incorrectos.');
    } else if(productos[code] && !editando){
        return alert('El codigo de producto ya existe');
    }

    productos[code] = { description, amount, price };
    onUpdateTable();
    onClean();
}

$('#cancel').onclick = function(evt){
    if(copy){
        productos[copy.code] = copy;
        copy = null
    }
    onClean();
}

function onClean(){
    $('input[name="code"]').value = "";
    $('input[name="description"]').value = "";
    $('input[name="amount"]').value = "";
    $('input[name="price"]').value = "";
}

function onDestroyProduct(code){
    console.log(`#trow${code}`)
    const row = $(`#trow${code}`)
    
    if(row) row.remove();
    else alert('No fue posible conseguir el articulo');
}

function onUpdateProduct(code){
    const producto = productos[code];
    if(producto){
        editando = true;
        copy = {...producto, code};
        delete productos[code];
        $('#cancel').style.display = "block"
        $('input[name="code"]').value = ""+code;
        $('input[name="description"]').value = ""+producto.description;
        $('input[name="amount"]').value = ""+producto.amount;
        $('input[name="price"]').value = ""+producto.price;
    } else {
        alert('No fue posible conseguir el articulo');
    }
}


// Draw
function onUpdateTable(){
    editando = false;
    const keys = Object.keys(productos).sort((a, b) => a - b);

    $('#cancel').style.display = "none"
    $('tbody').innerHTML = keys.map(code => {
        const producto = productos[code];
        return `
            <tr id="trow${code}">
                <td>${code}</td>
                <td>${producto.description}</td>
                <td>${producto.amount}</td>
                <td>$${producto.price}</td>
                <td>
                    <div class="flex column">
                        <button class="bg-secondary" onclick="onUpdateProduct(${code})">Editar</button>
                        <button class="bg-danger" onclick="onDestroyProduct(${code})">Eliminar</button>
                    </div>
                </td>
            </tr>
        `
    }).join('')
    
    $('#totalPro').innerHTML = keys.length;
    $('#valorInv').innerHTML = keys.reduce((acc, key) => acc + (productos[key].amount * productos[key].price), 0) + " $"
    $('#cantidadPro').innerHTML = keys.reduce((acc, key) => acc + productos[key].amount, 0);
}

window.addEventListener('load', onUpdateTable);