# Desafio Concrete ⚙️👨‍💻 

Este desafio foi prosposto para uma possível vaga com desenvolvedor node em projetos na
Concrete. Utilizo a plataforma NodeJS com ferramentas como **expressjs** para o desenvolvimento da API em si, **sequelize** como ORM, **eslint** para padronizar o código, **jest** e **faker** para testar e gerar dados randomicos para esses testes respectivamente, o **yarn** para controle de depedências, **sentry** para gerência de erros em produção, **dotenv**
para variaveis de ambiente e **youch** para formatação de erros.

### Requisitos
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install)

### Clonagem do Projeto
Para clonar este desadio em seu reositorio local, você ira precisar do [Git](https://git-scm.com/ "Git"), uma vez instalado corretamente você pode executar o comando:
```bash
$ git clone https://github.com/victorfariasoliveira/dnode.git
```
por fim execute o comando para entrar na pasta que foi criada e instalar as dependencias do projeto
```bash
$ cd dnode
$ yarn install
```

### Comandos de inicialização

Para iniciar a aplicação basta executar o comando: `yarn start` mas existe alguns comandos que podem lhe ajudar a realizar outras tarefaas como testes de integração, reinicialização do servidor em caso de mudança em arquivos, etc. Uma lista completa sobre os comandos de inicialização pode ser vista abaixo:

Comandos  | Tarefa a ser realizada
------------- | -------------
`yarn start` | Inicializa o serviço em ambiente de produção
`yarn dev` | Inicializa o serviço em ambiente de desenvolvimento, este modo de inicialização permite que serviço seja reiniciado sempre  que houver uma mudança nos arquivo do projeto
`yarn test` | Realiza todos os testes localizados na pasta tests


Obs: Em caso de inicialização do ambiente de desenvolvimento, você precisará ter instalado em sua maquina o [PostgreSQL](https://www.postgresql.org/) e executar o comando em seu terminal:
```bash
$ yarn sequelize db:migrate
```

## Rotas

A api tem algumas rotas disponiveis, neste documento você encontrar quais rotas são essas e um breve exemplo de como utilizar-las
### Tabela de rotas

As rotas da aplicação estão listadas na tabela abaixo:

Rota  |  Descrição
--------------------  | --------------
`POST /signup`  | Está é uma rota para criar um usuario
`POST /signin`  | Está é a rota de authenticação de usuario
`GET /user/:id`  | Está rota busca o usuario com o id passado no query paraments, desde que seja o mesmo que está requerindo as informações


### Exemplos de uso

#### Criar usuario
---
```
POST /sessions
```

**Headers**
```
Content-Type     application/json
```

**Body**

```
{
	"nome": "Victor Farias",
	"email": "victorfarias70@gmail.com",
	"senha": "123456",
	"telefones":
    [
		{
            "numero": 12345678,
            "ddd": 81
        },
		{
            "numero": 12345679,
            "ddd": 85
        }
	]
}
```

**Response**
```
{
  "id": 4,
  "data_criacao": "2019-10-31T19:10:23.748Z",
  "data_atualizacao": "2019-10-31T19:10:23.748Z",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmZhcmlhczcwQGdtYWlsLmNvbSIsImlhdCI6MTU3MjU0OTAyMywiZXhwIjoxNTcyNTUyNjIzfQ.gWJYdz654AwI5TT4J7naUYnc2Fpd1sxzIpxC2zDbhnU"
}
```


#### Login usuario
---
```
POST /sessions
```

**Headers**
```
Content-Type     application/json
```

**Body**

```
{
	"email": "victorfarias70@gmail.com",
	"senha": "123456"
}
```

**Response**
```
{
  "id": 4,
  "data_criacao": "2019-10-31T19:10:23.000Z",
  "data_atualizacao": "2019-10-31T19:25:56.583Z",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmZhcmlhczcwQGdtYWlsLmNvbSIsImlhdCI6MTU3MjU0OTAyMywiZXhwIjoxNTcyNTUyNjIzfQ.gWJYdz654AwI5TT4J7naUYnc2Fpd1sxzIpxC2zDbhnU"
}
```


#### Buscar usuario
---
```
GET /user/4
```

**Headers**
```
Content-Type     application/json
Authentication    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmZhcmlhczcwQGdtYWlsLmNvbSIsImlhdCI6MTU3MjU0OTAyMywiZXhwIjoxNTcyNTUyNjIzfQ.gWJYdz654AwI5TT4J7naUYnc2Fpd1sxzIpxC2zDbhnU
```

**Response**
```
{
  "id": 4,
  "nome": "Victor Farias",
  "email": "victorfarias70@gmail.com",
  "senha_hash": "$2a$08$aKIqh.tFhSyMaAeyx38oMePeX.FmHE/OwUbChrGUb67FGbWczgCIi",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmZhcmlhczcwQGdtYWlsLmNvbSIsImlhdCI6MTU3MjU0OTAyMywiZXhwIjoxNTcyNTUyNjIzfQ.gWJYdz654AwI5TT4J7naUYnc2Fpd1sxzIpxC2zDbhnU",
  "ultimo_login": "2019-10-31T19:25:56.000Z",
  "telefones": [
    {
      "phone": "12345678",
      "ddd": "81"
    },
    {
      "phone": "12345679",
      "ddd": "85"
    }
  ],
  "data_criacao": "2019-10-31T19:10:23.000Z",
  "data_atualizacao": "2019-10-31T19:25:56.000Z"
}
```
