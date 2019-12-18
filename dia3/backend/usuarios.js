import {Router} from 'express';
import { Client } from 'pg';



const router = Router();

router.get('/', async (req, res) => {
    let resultado = [];
    const client = criaClient();

    await client.connect()
    let queryResult = await client.query("select CODIGO, NOME, TELEFONE, EMAIL, SALDO_CREDITOS from USUARIOS")
    for (let row of queryResult.rows) {
        resultado.push({
            codigo: row.CODIGO,
            nome: row.NOME,
            telefone: row.TELEFONE,
            email: row.EMAIL,
            saldoCreditos: row.SALDO_CREDITOS
        });
    }

    await client.end();

     res.send(JSON.stringify(resultado));

});



router.post('/', async (req, res) => {
    let payload = req.body;
let sql = `insert into USUARIOS(CODIGO, NOME, TELEFONE, EMAIL, SALDO_CREDITOS) VALUES
    (nextval('usuarios_sequence'),'${payload.nome}', '${payload.telefone}', '${payload.email}', ${payload.saldoCreditos})`;
  
    const client = criaClient();
    await client.connect();
   await client.query(sql);
   await client.end();

   res.status(204);
   res.send();


});

    router.put('/:codigo', async (req, res) => {
        let codigo = req.params.codigo;
        let payload = req.body;

        let  sql = `update USUARIOS SET
            NOME = '${payload.nome}',
            TELEFONE = '${payload.telefone}',
            EMAIL = '${payload.email}',
            SALDO_CREDITOS = ${payload.saldoCreditos}

        where 
            CODIGO = ${codigo}
            `;
    const client = criaClient();
    await client.connect();
   await client.query(sql);
   await client.end();

   res.status(204);
   res.send();
   

    })

    router.delete('/:codigo', async (req,res) =>{

        let codigo = req.params.codigo;

        let sql = `delete from USUARIOS
        where 
        CODIGO = ${codigo}
        `;

        const client = criaClient();
    await client.connect();
   await client.query(sql);
   await client.end();

   res.status(204);
   res.send();
   

    });

function criaClient() {
    return new Client({
        user: 'dia3',
        host: 'localhost',
        database: 'db_dia3',
        password: ' ',
        port: 5432
    });
}
    export default router;
