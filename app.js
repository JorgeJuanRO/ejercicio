// IMPORTS
const express = require('express'); //MÓDULO EXPRESS
const fetch = require('node-fetch'); //MÓDULO NODE-FETCH
const app = express();
const port = 3000;


// ARCHIVOS ESTÁTICOS. PERMITE CARGAR IMAGENES Y ESTILOS CSS.
app.use(express.static('public'));
app.use('/css',express.static(__dirname+ 'public/css'));
app.use('/js',express.static(__dirname+ 'public/js'));
app.use('/img',express.static(__dirname+ 'public/img'));


// SET VIEWS
app.set('views', './views');
app.set('view engine', 'ejs');

// PÁGINA PRINCIPAL (INDEX)
app.get('', (req,res) => {
    res.render('index', {text: 'This is EJS'});
});


//INICIO APP.GET.SALARY // PÁGINA PARA CALCULAR EL SALARIO MÁXIMO Y RESTO DE OPERACIONES
app.get('/salary', (req,res) => {

    // FUNCIÓN ASINCRONA PARA CAPTAR TODA LA INFORMACIÓN DEL FICHERO ONLINE JSON
    async function fetchAsync(){
        let response=await fetch("https://pollysnips.s3.amazonaws.com/bostonEmployeeSalaries.json"); 
        let data=await response.json();
        return data;
    }
   
    // FUNCION PARA REALIZAR LOS CÁLCULOS A MOSTRAR
    function findMaxSalary(data){
        // CREAR VARIABLES PARA LA FUNCION ENCONTRAR SALARIO MÁXIMO
        let nombre = "";
        let posicion = "";
        let maxSalary = 0;
        let indexOfMax = 0;
        let indexOfMax1 = 0;
        let salary = 0;
        let media = 0;
        let Puestos_cantidad = 0;
        // BUCLE PARA BUSCAR Y GUARDAR LAS VARIABLES DEL ARRAY
        for (var i = 0; i < data.data.length; i++) {
            salary = salary + Number(data.data[i][18]);
            if (Number(data.data[i][18]) > maxSalary) {
                maxSalary = Number(data.data[i][18]);
                nombre = String(data.data[i][8]);    
                posicion = String(data.data[i][9]);  
                indexOfMax = i+1;
                indexOfMax1 = i+1;
            }
            media = salary / data.data.length;
        }
        // BUSCAR PUESTOS DE TRABAJO CON EL MISMO NOMBRE QUE TIENE LA PERSONA DEL SALARIO MÁS ALTO.
        let array_datos_ejs = [];
        let puestos = [''];
        let nombres_posiciones =[''];
        let indexOfMax_posiciones = [''];
        let salary_puestos = 0;
        let a=0;
        for (var x = 0; x < data.data.length; x++) {
            if (String(data.data[x][9]) == posicion) {
                salary_puestos = salary_puestos + Number(data.data[x][18]);
                nombres_posiciones[a] = String(data.data[x][8]);
                puestos[a]= Number(data.data[x][18]);
                indexOfMax_posiciones[x]=indexOfMax = i+1;
                Puestos_cantidad++;    
                a++;
                // ARRAY CON OBJETOS PARA MANDARLOS AL NAVEGADOR CON UNA TABLA EN CÓDIGO EJS. GUARDAMOS ESTOS DATOS EN "ARRAY_DATOS_EJS"
                array_datos_ejs.push({
                    array_key:a,
                    array_id:(data.data[x][0])-1,
                    array_nombre:(data.data[x][8]),
                    array_puesto:(data.data[x][9]),
                    array_salario_base:(data.data[x][11]),
                    array_salario:(data.data[x][18])
                });
            }
        }
        
        // ORDENA EL ARRAY DE DATOS "ARRAY_DATOS_EJS" DE MAYOR A MENOR
        var array_datos_ejs_ordenado = (array_datos_ejs.sort(function(prev, next){ return next.array_salario - prev.array_salario; }));
        for(i = 0; i < array_datos_ejs_ordenado.length; i++){
            array_datos_ejs_ordenado[i].array_key = i+1;
          }
 
        // CALCULAR EL PORCENTAJE DE GASTO EN SALARIOS PARA EL PUESTO DE TRABAJO CON EL SALARIO MÁS ALTO
        let porcentaje_salario_posicion = salary_puestos*100/salary.toFixed(2);

        // ENVIAR DATOS AL NAVEGADOR WEB (etiquetas html -> .ejs)
        res.render('salary', {
            text0: maxSalary,
            text1: indexOfMax1,
            text2: data.data.length,
            text3: nombre,
            text4: posicion,
            text5: media.toFixed(2),
            nombres_posiciones:nombres_posiciones,
            indexOfMax_posiciones:indexOfMax_posiciones,
            Puestos_cantidad:Puestos_cantidad,
            porcentaje_salario_posicion:porcentaje_salario_posicion.toFixed(2),
            array_datos_ejs:array_datos_ejs,
            array_datos_ejs_ordenado:array_datos_ejs_ordenado
        });
        
}

// NODE-FETCH PARA EL ARCHIVO EXTERNO JSON. PRIMERO OBTIENE LOS DATOS DE LA FUNCIÓN. DESPUES REALIZA LA FUNCIÓN "FINDMAXSALARY"
fetchAsync()
.then(data=> findMaxSalary(data)) 
.catch(reason=>console.log(reason.message));
});
//FINAL APP.GET.SALARY

// RUTA GINI. CREAR RUTA PARA CALCULAR EL COEFICIENTE DE GINI SOBRE LOS DATOS DEL ARCHIVO JSON. (NO ESTÁ CALCULADO)
app.get('/gini', (req,res) => {
    res.render('gini', {gini: 'Calculo de coeficiente de Gini'});
    // AQUÍ TIENE QUE IR EL CÓDIGO PARA CÁLCULAR EL COEFICIENTE DE GINI
});


// LISTEN ON PORT 3000
app.listen(port, () => console.info(`Listening on port ${port}`));


