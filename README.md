# Aplicação de Teste Shopper

## Visão Geral

Este projeto é uma aplicação Node.js construída com Express.js, TypeScript e MongoDB. A aplicação integra-se com a IA Gemini para ler dados de uma imagem enviada por um usuário (em formato base64). A medida extraída, em metros cúbicos, é então salva em um banco de dados MongoDB.

## Funcionalidades

- **Upload de Imagem e Extração de Dados**: 
  - **Endpoint**: `/upload`
  - Os usuários podem fazer o upload de uma imagem codificada em base64. A aplicação utiliza a IA Gemini para ler e extrair as medidas da imagem, que são então armazenadas no banco de dados MongoDB.

- **Atualizar Medida**:
  - **Endpoint**: `/confirm`
  - Permite que os usuários atualizem a medida extraída anteriormente no banco de dados.

- **Listar Medidas**:
  - **Endpoint**: `/{customer_id}/list`
  - Os usuários podem recuperar uma lista de medidas associadas a um ID específico de cliente.

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-repositorio/shopper-test.git
   ```
2. Navegue ate a pasta do projeto:
   ```bash
   cd shopper-test
   ```
3. Execute o Docker Compose:
   ```bash
   docker-compose up -d
   ```
## Testes

Para facilitar o teste da aplicação, um arquivo de importação para o Postman está disponível na raiz do projeto. Este arquivo contém todos os endpoints configurados e prontos para uso, permitindo que você teste facilmente as funcionalidades da aplicação.

- **Passo 1**: Importe o arquivo 'Teste_Shopper.postman_collection.json' no Postman.
- **Passo 2**: Execute os endpoints conforme necessário para validar o comportamento da aplicação.

Isso garantirá que você possa interagir com os endpoints de forma eficiente e verificar se a aplicação está funcionando corretamente.

## Uso
- Para fazer upload de uma imagem e extrair medidas, faça uma requisição POST para /upload com os dados da imagem em formato base64.
- Para atualizar uma medida, faça uma requisição PATCH para /confirm com os dados da atualização.
- Para listar medidas por ID de cliente, faça um requidição GET para o endpoint /{customer_id}/list.
