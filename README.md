
```html
<!DOCTYPE html>

<html>
  <head>
    <title>Calculadora inútil</title>
  </head>
  <body>
    <form action="http://localhost:30080/calcular" method="POST">
      <p>
        <label for="primeiro_operando">Primeiro operando</label>
        <input name="primeiro_operando">
      </p>
      <p>
        <label for="segundo_operando">Segundo operando</label>
        <input name="segundo_operando">
      </p>
      <p>
        <label for="operador">Operador</label>
        <select name="operador">
          <option value="add">+</option>
          <option value="minus">-</option>
          <option value="mult">*</option>
          <option value="div">/</option>
        </select>
      </p>
      <p>
        <input type="submit" value="Calcular">
      </p>
    </form>
  </body>
</html>
```

Se você perceber nós não temos nenhum tipo de programação aqui. Lembre-se que HTML é um formato de conteúdo (como o Word ou PDF). Sua função é tornar um conteúdo **bonito**. Neste caso específico, ele ainda tem algumas funções de formulário.

Lembra daqueles formulários no consultório médico, ou mesmo nas entrevistas de emprego. São apenas documentos com lacunas para que informações sejam preenchidas. O código HTML acima é apenas um formulário digital, mas sua função é a mesma dos formulários em papel, ou seja, um texto com lacunas para que outra pessoa complete os dados.

A única coisa que faz referência para uma fonte externa é o atributo *action*, que aponta para um endereço de um servidor (neste caso é o localhost, sua máquina, mas poderia ser qualquer endereço na Internet).

Vejamos então o backend para este código:

```perl
#!/usr/bin/perl
use strict;
use warnings;
use CGI;

$cgi = CGI->new;
$val1 = $cgi->param(`primeiro_operando`)
$val2 = $cgi->param(`segundo_operando`)
$op = $cgi->param(`operador`)
if ($op eq "add") {
  $val1+=$val2;
} elsif ($op eq "minus") {
  $val1-=$val2;
} elsif ($op eq "mult") {
  $val1*=$val2;
} elsif ($op eq "div") {
  $val1/=$val2;
}

# Saída
print "Content-Type: text/html\n\n";
print "<html><body>\n";
print "<b>Resultado:</b><br/>\n";
print "<p>$val1</p>\n"
print "</body>\n"
print "</html>\n"
```

Este backend está em Perl porque esta é uma das linguagens mais utilizadas naquela época. É uma linguagem difícil mas dá para entender mais ou menos o que está acontecendo.

O programa começa com uma série de *use* que servem para importar outras bibliotecas e para definir algumas opções de execução. Depois começa o código de verdade, com uma variável $cgi sendo inicializada com um CGI->new (não vamos entrar em detalhes mas basicamente isto é apenas para inicializar a biblioteca CGI).

Depois temos uma outra variavél que recebe o valor do parâmetro *primeiro_operando*, ou seja, que foi enviado do formulário HTML que mostramos antes. Depois tem uma série de *IFs* para identificar se devemos somar, subtrair, multiplicar ou dividir o primeiro operando com o segundo.

Por fim, vem uma parte estranha, uma série de comandos *print*, que mesmo não conhecendo a linguagem podemos entender o que faz. Os comandos de impressão estão escrevendo o que parece ser um outro documento HTML. Mas o *print* imprime onde ?

Se você conhece um pouco de Linux, vai reconhecer a primeira linha do programa que eu pulei deliberadamente. O *comentário* `#!/usr/bin/perl` serve para dizer ao Linux (ou qualquer sistema baseado no Unix) qual o interpretador que deve ser utilizado para um arquivo executável de script.

O que está acontecendo por trás dos panos é que um servidor Web (como o Apache) recebe uma requisição HTTP em um endereço e direciona os dados de entrada da requisição em um formato padrão (o tal do CGI) para um script executável. A saída do script que normalmente seria escrita na tela é desviada para o socket de saída da conexão HTTP. Ou seja, você faz um programa que escreve o HTML na *tela* mas na verdade este texto é enviado ao cliente que fez a requisição.

Você que já utilizou um monte de sites legais, vai olhar isto e dizer: "Mas que porcaria!. Eu fiz a conta e agora estou em outra página que só tem o resultado (que números eu coloquei mesmo? Era adição ou multiplicação? Se eu quiser que fazer outra conta o que eu faço? Clico em voltar?)"

A primeira coisa que o usuário percebe é que ele foi levado para uma nova página. Muitas vezes nós não queremos isto, queremos que haja continuidade nas interações do usuário. Então como era feito para parecer que só o resultado tinha sido calculado: nós roubávamos. Veja uma versão "melhorada" do backend:

```perl
#!/usr/bin/perl
use strict;
use warnings;
use CGI;

$cgi = CGI->new;
$val1 = $cgi->param(`primeiro_operando`)
$res = $val1
$val2 = $cgi->param(`segundo_operando`)
$op = $cgi->param(`operador`)
if ($op eq "add") {
  $res+=$val2;
} elsif ($op eq "minus") {
  $res-=$val2;
} elsif ($op eq "mult") {
  $res*=$val2;
} elsif ($op eq "div") {
  $res/=$val2;
}

# Saída
print "Content-Type: text/html\n\n";
print "<!DOCTYPE html>\n"
print "<html>\n"
print "<head>\n"
print "<title>Calculadora inútil</title>\n"
print "</head>\n"
print "<body>\n"
print "<form action='http://localhost:30080/calcular' method="POST">\n"
print "<p>\n"
print "<label for='primeiro_operando'>Primeiro operando</label>\n"
print "<input name='primeiro_operando' value='$val1'>\n"
print "</p>\n"
print "<p>\n"
print "<label for='segundo_operando' value='$val2'>Segundo operando</label>\n"
print "<input name='segundo_operando'>\n"
print "</p>\n"
print "<p>\n"
print "<label for='operador'>Operador</label>\n"
print "<select name='operador'>\n"
print "<option value='add'>+</option>\n"
print "<option value='minus'>-</option>\n"
print "<option value='mult'>*</option>\n"
print "<option value='div'>/</option>\n"
print "</select>\n"
print "</p>\n"
print "<p>\n"
print "<input type='submit' value='Calcular'>\n"
print "</p>\n"
print "</form>\n"
print "<p>Resultado: $res</p>"
print "</body>\n"
print "</html>\n"
```

A saída agora é bem diferente da primeira versão. Basicamente o resultado é o mesmo HTML original, mas com alguns valores já preenchidos e com uma nova seção  (abaixo do botão calcular) com o resultado da conta.

Para o usuário, a página pisca mas a única diferença é que ele consegue perceber é que agora há uma nova informação no final da página, que é o resultado do cálculo.

Esta abordagem funciona mas tem seus problemas. Primeiro, a cada comunicação com o servidor a página inteira é recarregada. Quando há uma barra de rolagem, por exemplo, a posição da tela é perdida (a menos que o programador faça tratamentos para impedir isto). A coisa fica pouco fluída e a experiência do usuário fica muito prejudicada.

Para quem já conhece um pouco do Javascript pensa: "Mas um programa assim não existe no mundo real, quer fazer uma calculadora faz no Javascript no Browser não precisa mandar uma requisição para o servidor". É verdade, mas este é apenas um exemplo, substitua esta interação por uma busca pelo CEP, por exemplo, e você verá que não tem como fugir de fazer uma requisção ao servidor.

Durante vários anos todas as páginas funcionavam desta forma (ou parecida). Esta é a forma original para qual o PHP ou ASP foram feitas para tratar. Alguns até evoluiram para tratar melhor esta questão como o famigerado [viewstate](https://www.devmedia.com.br/desvendando-asp-net-postback/29197) do ASP.NET.

### Backend vs. Frontend

### Preparando o ambiente

### Backend

#### Chega de papo: primeiro programa

#### Non-blocking IO

#### Callbacks, Promises e async/await

#### Requisições HTTP: verbos, return codes, mime types, etc

#### Organização REST

### Frontend

#### O velho e bom (pelo menos era) AJAX

#### AngularJS vs. React vs. Vue.Js

#### Transformando nosso pobre frontend em uma Vue.js SPA

#### Data biding

#### Rotas de frontend

### Fullstack

#### Meu primeiro CRUD

##### Modelo de dados

##### SQL (select, insert, update e delete)

##### Servidor stateless

##### Juntando tudo
