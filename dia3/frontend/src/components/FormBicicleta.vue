<template>
    <b-form>
        <b-form-group
            id="input-codigo"
            label="Código"
            label-for="txtCodigo"
            description="Informe o código único da bicicleta"
            :disabled="!content.isNew"
        >
            <b-form-input
                id="txtCodigo"
                v-model="content.codigo"
                type="text"
                required
                placeholder="código da bicicleta"
                @input="handleInput"
                :disabled="!content.isNew"/>
        </b-form-group>
        <b-form-group
            id="input-ativo"
            label="Ativo"
            label-for="chkAtivo"
            description="Selecione se a bicicleta está disponível"
        >
            <b-form-checkbox
                id="chkAtivo"
                v-model="content.ativo"
                required
                switch
                @input="handleInput"/>
        </b-form-group>
    </b-form>
</template>

<script>
export default {
    props: ['value'],
    data () {
        return {
            content: {
                codigo: this.value.codigo,
                ativo: (this.value.ativo ==='Y'),
                isNew: this.value.isNew
            }

        }
    },
    methods: {
        handleInput () {
            let retorno = {
                codigo: this.content.codigo,
                ativo: this.content.ativo ? 'Y' : 'N',
                isNew: this.content.isNew
            };
            this.$emit('input', retorno);
        }
    }
}
</script>