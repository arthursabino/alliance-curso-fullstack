<template>
  <div class="carteira">
    <h1>Carteira</h1>
    <hr />
    <b-button v-b-modal.criaCarteira>
      <font-awesome-icon icon="plus" /> <span>Adicionar</span>
    </b-button>
     <b-table striped hover :items="carteira" :fields="fields">
        <template slot="cell(codigo)" slot-scope="{ item: { codigo} }">
          <font-awesome-icon :icon="codigo === 'Y' ? 'check' : 'times'"/>
        </template>

        <template slot="cell(actionDelete)" slot-scope="{ item: { codigo } }">
         
           <b-button  v-on:click="excluirBicicleta(codigo)">
          <font-awesome-icon icon="trash"/>
          </b-button>
        </template>

           <template slot="cell(actionConfig)" slot-scope="{ item }">

           <b-button  v-b-modal.editaBicicleta v-on:click="beforeNovaBicicleta(item)">
          <font-awesome-icon icon="pen"/>
           </b-button>
        </template>
  </b-table>
  <b-modal id="criaBicicleta"
   title="Nova Bicicleta"
   ok-title="Salvar"
   cancel-title="Cancelar"
   @show="beforeNovaBicicleta"
   @ok="saveNovaBicicleta">
   
    <FormBicicleta v-model="bicicletaAtual"/>
  </b-modal>
   <b-modal id="editaBicicleta"
   :title="'Alterar a bicicleta -' + bicicletaAtual.codigo"
   ok-title="Alterar"
   cancel-title="Cancelar"
   @ok="saveNovaBicicleta">
   
    <FormBicicleta v-model="bicicletaAtual"/>
  </b-modal>
  
  </div> 
</template>


<script>
import FormBicicleta from '../components/FormBicicleta';
import axios from 'axios';

export default {
  components: {FormBicicleta},
  data: () => {
    return {
            bicicletaAtual: {
                codigo: '',
                ativo: '',
                isNew: true
            },

            bicicletas: [],
               
            
            fields: [
              {
                key: 'ativo',
                label: 'Ativo',
                },
                {
                key: 'codigo',
                label: 'Codigo',
              },
              {
                key: 'actionDelete',
                label: ''
              },
              {
                key: 'actionConfig',
                label: ''
              }
            ]
        }
  },
   methods: {
     excluirBicicleta(codigo) {

        return codigo;
     },

     beforeEditaBicicleta(bicicleta) {

       this.bicicletaAtual = {
          codigo: bicicleta.codigo,
          ativo: bicicleta.ativo,
          isNew: false
       }
       this.$root.$emit('bv::show::modal', 'editaBicicleta');
     },

     async configurarBicicleta(){
       let payload = {
         codigo: this.bicicletaAtual.codigo,
         ativo: this.bicicletaAtual.ativo
       };

       try{
     await axios.put(`http://localhost:3000/bicicletas/${this.bicicletaAtual.codigo}`, payload);
    //esta proxima linha recarrega o codigo da lista
    await this.carregaBicicletas();
      }catch(err){
        alert('erro ao editar a bicicleta');
      }
     },
     async carregaBicicletas() {
       this.bicicletas.splice(0, this.bicicletas.length);
       let dados = await axios.get('http://localhost:3000/bicicletas/');
       this.bicicletas.push(...dados.data);

     },
     beforeNovaBicicleta () {
        this.bicicletaAtual.codigo = '';
        this.bicicletaAtual.ativo = 'Y';
        this.bicicletaAtual.isNew = true;
     },
    async saveNovaBicicleta() {
      let payload = {
        codigo: this.bicicletaAtual.codigo,
        ativo: this.bicicletaAtual.ativo
      };


      try{
      axios.post('http://localhost:3000/bicicletas', payload);
      await this.carregaBicicletas();
      }catch(err){
        alert('erro ao inserir a bicicleta');

      }

     }
   },
   async mounted () {
     await this.carregaBicicletas();
   }
  
  }

</script>
