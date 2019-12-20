<template>
  <div class="ativos">
    <h1>Ativos Cadastrados</h1>
    <hr />
    <b-button v-b-modal.criaAtivo>
      <font-awesome-icon icon="plus" /> <span>Adicionar Ativo</span>
    </b-button>
     <b-table striped hover :items="ativos" :fields="fields">
        <template slot="cell(código)" slot-scope="{ item: { codigo} }">
          <font-awesome-icon :icon="codigo === '1' ? 'check' : 'times'"/>
        </template>

        <template slot="cell(actionDelete)" slot-scope="{ item }">
         
           <b-button  v-on:click="beforeExcluirAtivo(item)">
          <font-awesome-icon icon="trash"/>
          </b-button>
        </template>

           <template slot="cell(actionConfig)" slot-scope="{ item }">

           <b-button  v-b-modal.editaAtivo v-on:click="beforeNovoAtivo(item)">
          <font-awesome-icon icon="pen"/>
           </b-button>
        </template>
  </b-table>
  <b-modal id="criaAtivo"
   title="Novo Ativo"
   ok-title="Salvar"
   cancel-title="Cancelar"
   @show="beforeNovoAtivo"
   @ok="saveNovoAtivo">
   
    <FormAtivos v-model="ativoAtual"/>
  </b-modal>
   <b-modal id="editaAtivo"
   :title="'Alterar o Ativo -' + ativoAtual.codigo"
   ok-title="Alterar"
   cancel-title="Cancelar"
   @ok="saveNovoAtivo">
   
    <FormAtivos v-model="ativoAtual"/>
  </b-modal>

   <b-modal id="excluirAtivo"
   :title="'excluir o ativo? -' + ativoAtual.codigo"
   ok-title="Excluir"
   cancel-title="Cancelar"
   @ok="excluirAtivo">
   
    <FormAtivos v-model="ativoAtual"/>
  </b-modal>
  
  
  </div> 
</template>


<script>
import FormAtivos from '../components/FormAtivos';
import axios from 'axios';

export default {
  components: {FormAtivos},
  data: () => {
    return {
            ativoAtual: {
                codigo: '',
                descricao: '',
                isNew: true
            },

            ativos: [],
               
            
            fields: [
              {
                key: 'codigo',
                label: 'Codigo',
                },
                {
                key: 'descricao',
                label: 'Descricao',
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

  beforeExcluirAtivo(ativo){
          this.ativoAtual = {
            codigo: ativo.codigo,
            descricao: ativo.descricao,
            isNew: false
          }
          this.$root.$emit('bv::show::modal','excluirAtivo');
      },
      async excluirAtivo() {
        let payload = {
            codigo: this.ativoAtual.codigo,
            descricao: this.ativoAtual.descricao
        };
        try{
          await axios.delete(`http://localhost:3000/ativos/${this.ativoAtual.codigo}`, payload);
          await this.carregaAtivos();
        }catch(err) {
          alert(this.ativoAtual.codigo)
        }
      },

     beforeEditaAtivo(ativo) {

       this.ativoAtual = {
          codigo: ativo.codigo,
          descricao: ativo.descricao,
          isNew: false
       }
       this.$root.$emit('bv::show::modal', 'editaAtivo');
     },

     async configurarAtivo(){
       let payload = {
          codigo: this.ativoAtual.codigo,
          descricao: this.ativoAtual.descricao
       };

       try{
     await axios.put(`http://localhost:3000/ativos/${this.ativoAtual.codigo}`, payload);
    //esta proxima linha recarrega o codigo da lista
    await this.carregaAtivo();
      }catch(err){
        alert('erro ao editar a bicicleta');
      }
     },
     async carregaAtivo() {
       this.ativos.splice(0, this.ativos.length);
       let dados = await axios.get('http://localhost:3000/ativos/');
       this.ativos.push(...dados.data);

     },
     beforeNovoAtivo () {
        this.ativoAtual.codigo = '';
        this.ativoAtual.descricao = 'Y';
        this.ativoAtual.isNew = true;
     },
    async saveNovoAtivo() {
      let payload = {
        codigo: this.ativoAtual.codigo,
        descricao: this.ativoAtual.descricao
      };


      try{
      axios.post('http://localhost:3000/ativos', payload);
      await this.carregaAtivo();
      }catch(err){
        alert('erro ao inserir o ativo');

      }

     }
   },
   async mounted () {
     await this.carregaAtivo();
   }
  
  }

</script>
