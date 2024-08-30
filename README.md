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
2. Execute o Docker Compose:
   ```bash
   docker-compose up -d
   ```
