import {Router} from 'express';
import { Client } from 'pg';

const router = Router();

router.get('/', async (req, res) => {
    let resultado = [];
    const client = criaClient();

    await client.connect()
    let queryResult = await client.query("select CODIGO, ATIVO from BICICLETAS")
    for (let row of queryResult.rows) {
        resultado.push({
            codigo: row.codigo,
            ativo: row.ativo

        });
    }
    await client.end();

    res.send(JSON.stringify(resultado));
});



router.post('/', async (req, res) => {
let payload = req.body;
let sql = `insert into BICICLETAS(CODIGO, ATIVO) VALUES ('${payload.codigo}', '${payload.ativo}')`;
  
    const client = criaClient();
    await client.connect();
   await client.query(sql);
   await client.end();

   res.status(204);
   res.send();

  
    let codigo = req.params.codigo;
    let ativo = req.params.ativo;





});

router.put('/:codigo', async(req, res) => {
    let codigo = req.params.codigo;
    let payload = req.body;
    let sql = `update BICICLETAS set
        ATIVO = '${payload.ativo}'
    where 
        CODIGO = '${codigo}'
    `;

    const client = criaClient();
    await client.connect();
    await client.query(sql);
    client.end();

    res.status(201);
    res.send();
});

router.delete('/:codigo', async(req, res) => {
    let codigo = req.params.codigo;
    let sql = `delete from BICICLETAS 
    where 
        CODIGO = '${codigo}'
    `;

    const client = criaClient();
    await client.connect();
    await client.query(sql);
    client.end();

    res.status(201);
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
