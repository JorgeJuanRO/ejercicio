// imports
const express = require('express');
const app = express();
const port = 3000;

// Static Files - Para cargar imagenes o estilos css
app.use(express.static('public'));
app.use('/css',express.static(__dirname+ 'public/css'));
app.use('/js',express.static(__dirname+ 'public/js'));
app.use('/img',express.static(__dirname+ 'public/img'));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');
//app.set('gini', './views'); //Esta línea añade la ruta para acceder a gini.ejs y mostrar el resultado de la función gini ()

// Set Views
// index
app.get('', (req,res) => {
    res.render('index', {text: 'This is EJS',temp: 'Página principal index'});
});

// archivo salary.ejs
app.get('/salary', (req,res) => {
    
    // Requiere
    var fetch=require('node-fetch');

    // async function
    async function fetchAsync(){
        // await response of fetch call 
        let response=await fetch("https://pollysnips.s3.amazonaws.com/bostonEmployeeSalaries.json"); 
        // only proceed once promise is resolved
        let data=await response.json();
        // only proceed once second promise is resolved 
        return data;
    }
    // Función para encontrar el salario máximo y otras variables como nombre y posición laboral.
    function findMaxSalary(data){
        // Crear variables para la función
        let nombre = "";
        let posicion = "";
        let maxSalary = 0;
        let indexOfMax = 0;
        let salary = 0;
        let media = 0;
        // Bucle for para buscar y guardar las variables del array
        for (var i = 0; i < data.data.length; i++) {
            salary = salary + Number(data.data[i][11]);
            if (Number(data.data[i][11]) > maxSalary) {
                maxSalary = Number(data.data[i][11]);
                nombre = String(data.data[i][8]);    
                posicion = String(data.data[i][9]);  
                indexOfMax = i;
            }
            media = salary / data.data.length; // Calcular la media de todos los salarios del documento.
        }
        
        // Enviar datos al navegador web (etiquetas html)
        res.render('salary', {text0: maxSalary,text1: indexOfMax,text2: data.data.length,text3: nombre,text4: posicion,text5: media, text6: ''});


        // Enviar datos a la consola
        console.log('Maximum Salary Found:',maxSalary,indexOfMax); 
        console.log('Máximo salario encontrado:', maxSalary, 'Número:', indexOfMax, 'Muestra total:', data.data.length);
        console.log('Nombre:', nombre);
        console.log('Posicion:', posicion);
        console.log('Salario:', salary, media);  
}

// Ruta gini no funciona a veces. ¿Por qué?
app.get('/gini', (req,res) => {
    // Contenido ruta archivo para cálcular coeficiente de Gini
});

// node-fetch para el archivo externo.
fetchAsync()
.then(data=> findMaxSalary(data)) 
.catch(reason=>console.log(reason.message));
});

// Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));

//saludos de HSM

