# Currency Converter 


Esta aplicação é uma ferramenta para mostrar a conversão de três moedas para Real Brasileiro (BRL). As moedas convertidas são:

- Dólar Canadense (CAD)
- Peso Argentino (ARS)
- Libra Esterlina (GBP)

A aplicação exibe a quantia equivalente de uma unidade de cada moeda em BRL, a variação em porcentagem, a hora da última atualização e formata os valores conforme as seguintes regras:
- Valores menores ou iguais a R$1,00 são exibidos em vermelho;
- Valores maiores que R$1,00 e menores ou iguais a R$5,00 são exibidos em verde;
- Valores maiores que R$5,00 são exibidos em azul.

As informações são cacheadas no front-end por 3 minutos e atualizadas automaticamente a cada 3 minutos.

A aplicação está hospedada no Firebase e pode ser acessada por este link: https://freterapido-currencyconverter.web.app/

## Tecnologias Utilizadas

- Angular 18.0.0
- Node v20.11.0
- HTML5
- CSS3
- TypeScript
- RxJS
- Jasmine (para testes unitários)
- Karma

## Como Rodar o Projeto

### Pré-requisitos

- Node.js (v20.11.0)
- Angular CLI

### Passos para Rodar o Projeto Localmente

1. Clone o repositório:

    ```bash
    git clone https://github.com/asfuture/currencyconverter.git
    cd currencyconverter
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Rode a aplicação:

    ```bash
    ng serve
    ```

4. Acesse a aplicação no navegador:

    ```
    http://localhost:4200
    ```

### Executando Testes

Para executar os testes unitários, utilize o comando:

```bash
ng test
```
## Utilizando Firebase
### Passos para Hospedar Projeto no Firebase
### Pré-requisitos
- Conta no Firebase
- Firebase CLI

1. Para instalar o Firebase CLI, utilize o comando:
  
  ```bash
  npm install -g firebase-tools
  ```

2. Faça login no Firebase CLI:

  ```bash
  firebase login
  ```

3. Inicialize o projeto Firebase no diretório do projeto: 

  ```bash
  firebase init
  ```

- Selecione "Hosting"
- Escolha o projeto no Firebase
- Configure o diretório público como "dist/nome-do-seu-projeto"
- Configure como um aplicativo de página única (single-page app)

3. Construa a aplicação para produção:

```bash
ng build --prod
```

4. Faça o deploy da aplicação:

```bash
firebase deploy
```

## Utilizando Docker
### Passos para Baixar a imagem Docker

1. Para baixar a imagem Docker da aplicação, utilize o comando:

```bash
docker pull asfuture/currencyconverter:latest
```

2. Para rodar a aplicação usando Docker, utilize o comando:

```bash
docker run -p 8080:80 asfuture/currencyconverter:latest
```

3. Acesse a aplicação no navegador:
   
http://localhost:8080

#### Autor: Alex Ferreira
