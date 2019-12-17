import { Router } from 'express';
import path from 'path';

const router = Router();

router.get('/', (req,res) => {// o '/' se refere a url de onde deve-se receber requisição para enviar resposta
    /*(req,res){} são parâmetros de uma função anonima, ou seja, 
    basicamente chama uma função sem ter que nomea-la, apenas dizer o que ela faz 
    */
   // return res.send("Ola");
   res.sendFile(path.join(__dirname,'index.html'));
   
});

router.post('/', (req,res)=>{
    let operando1 = req.body.operando1;
    let operando2 = req.body.operando2;
    let operador = req.body.operador;

    let resultado;
    if(operador == '+') resultado = Number(operando1) + Number(operando2);
    else if(operador == '-') resultado = operando1 - operando2;
    else if(operador =='*') resultado = operando1 * operando2;
    else if(operador == '/') resultado = operando1 / operando2;

    res.status = 200;
    res.send(JSON.stringify({resultado}));
});

export default router;