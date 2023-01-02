const urlApi = "https://mindicador.cl/api/";
const currenciesList = ['uf', 'dolar', 'euro', 'bitcoin'];
const select = document.querySelector("#select_currency");

var myLineChart = new Chart();

const getCurrencies = async () =>{
    try{
        const res = await fetch(urlApi);
        const data = await res.json();

        const currencies = currenciesList.map((currency) =>{
            return{
                code: data[currency].codigo,
                value: data[currency].valor,
            }
        });

        currencies.forEach((currency) =>{
            const option = document.createElement("option");
            option.value = [currency.code, currency.value];
            option.setAttribute('id', currency.code);             
            option.textContent = currency.code.toUpperCase();
            select.appendChild(option);
        });
    } catch(error){        
        console.log(error);
        alert("Ha ocurrido un error");
    }
    
}

getCurrencies();

const setSerialChart = (currency, date, currency_name) =>{
    const graph = document.querySelector("#chart");
    const dolar = Number(document.querySelector("#dolar").value.split(",")[1]);
    var dataset = currency;
    var axix ="CLP"
    if(currency_name == 'bitcoin'){
        dataset = currency.map((money) =>{
            return money*dolar/1000000;
        })
        axix = "Millones CLP"
    }
    const data_graph = {
        labels: date.reverse(),
        datasets: [
            {
                label: currency_name.toUpperCase(),
                backgroundColor: 'rgb(3,160,98)',
                borderColor: 'rgb(3, 160, 98)',
                data: dataset.reverse(),
            },            
        ]
    };
    const config_line = {
        type: 'line',
        data: data_graph,
        options: {            
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: false,
                    text: "PRECIO ULTIMOS 10 DIAS "+ currency_name.toUpperCase()
                }
            },
            scales: {
                y: {
                    title: {
                        display: false,
                        text: axix
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                }
            }      
        }
        
    };

    if (myLineChart) {
        myLineChart.destroy();
    }         
    
    myLineChart = new Chart(graph, config_line);  
}

const getSerialCurrency = async (currency_name) =>{
    try{
        const res = await fetch(urlApi+currency_name);
        const data = await res.json();
        const currency = [];
        const date = [];      
    
        const serial = 
        {
            code: data.codigo,
            serie: data.serie,
        };    
    
        for (let i = 0; i < 10; i++) {
            date.push(serial.serie[i]['fecha'].substr(0,10));
            currency.push(serial.serie[i]['valor']);
        } 
        setSerialChart(currency, date, currency_name, myLineChart)
    }catch(error){
        console.log(error);
        alert("Ha ocurrido un error");
    }   
}

const setConversion = () =>{
    const input = document.querySelector("#input_currency").value;
    const dolar = Number(document.querySelector("#dolar").value.split(",")[1]);
    const result = document.querySelector("#result");
    const dollarUSLocale = Intl.NumberFormat('en-US');
    
    if(input){
        let currency_data = select.value.split(",");
        let conversion = input*Number(currency_data[1]);
        if(currency_data[0] == "bitcoin"){
            result.innerHTML = "$ "+ dollarUSLocale.format(conversion*dolar);
            getSerialCurrency(currency_data[0]);
        }
        else{
            result.innerHTML = "$ " + dollarUSLocale.format(conversion);       
            getSerialCurrency(currency_data[0]);
        }
    } else{
        alert("Ingrese un monto en CLP");
    }
}
