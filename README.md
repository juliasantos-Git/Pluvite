# 🌧️ Pluvite

Pluvite é uma plataforma desenvolvida para monitoramento de riscos climáticos, comunicação de alertas e participação cidadã durante eventos relacionados a desastres naturais.
O sistema permite que cidadãos acompanhem condições meteorológicas, recebam alertas em tempo real e reportem problemas de infraestrutura urbana, enquanto órgãos públicos podem monitorar ocorrências e gerenciar ações de resposta.

---

## 📌 Objetivo

Facilitar a comunicação entre população e prefeitura durante situações de risco, offering informações climáticas, alertas preventivos e um canal para registro de ocorrências.

---

## 🚀 Como Rodar o Projeto 

### 🌐 Executando a Plataforma Web

1. Abra o terminal na pasta raiz do repositório e navegue até a pasta `web`:
   ```bash
   cd web

```


2. Instale as dependências necessárias:
```bash
npm install

```


3. Crie um arquivo `.env.local` na raiz da pasta `web` e adicione as suas credenciais do Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase_aqui

```


4. Inicie o servidor de desenvolvimento:
```bash
npm run dev

```


Acesse `http://localhost:3000` no seu navegador para visualizar.

---

### 📱 Executando o Aplicativo Mobile

1. Abra o terminal na pasta raiz do repositório e navegue até a pasta `mobile`:
```bash
cd mobile

```


2. Instale as dependências necessárias:
```bash
npm install

```


3. Inicie o servidor do Expo:
```bash
npx expo start

```


Instale o aplicativo **Expo Go** no seu celular (Android ou iOS) e use a câmera para escanear o **QR Code** gerado no terminal do seu computador.

---

## 🚀 Funcionalidades

### 👤 Autenticação (Web e Mobile)

* Cadastro de usuários
* Login seguro
* Controle de acesso por perfil

### 🗺️ Mapa Interativo (Web)

* Visualização dos municípios monitorados
* Seleção de cidades através de busca
* Exibição de alertas por região
* Monitoramento geográfico em tempo real

### 🌦️ Clima (Web e Mobile)

* Consulta de condições meteorológicas
* Temperatura atual
* Umidade
* Velocidade do vento
* Previsão do tempo

### 🚨 Alertas (Web e Mobile)

* Alertas climáticos em tempo real
* Notificações para regiões monitoradas
* Classificação de riscos

### 📸 Feed Comunitário e Participação (Web e Mobile)

* Visualização de publicações de ocorrências feitas pela população.
* No **Aplicativo Mobile**, os usuários podem enviar novas ocorrências direto do celular com:
* Registro de localização atual.
* **Upload de fotos tiradas na hora** para comprovar o incidente.


* Relato de:
* Alagamentos
* Buracos em vias públicas
* Deslizamentos
* Problemas de infraestrutura
* Outros incidentes urbanos



### 📱 Recursos Exclusivos do Aplicativo Mobile

* **Página de Perfil:** Gerenciamento dos dados pessoais e configurações de acessibilidade do cidadão.
* **Página de Rotas:** Traçado de caminhos e rotas para ajudar o usuário a desviar de ruas alagadas ou bloqueadas.
* **Página de Emergências e Contatos:** Lista de contatos rápidos e botões de discagem para socorro imediato (como Defesa Civil, Bombeiros e SAMU).

### 🏛️ Painel Administrativo (Web)

* Visualização das ocorrências reportadas
* Gestão de alertas
* Acompanhamento de indicadores
* Alteração de status das ocorrências:
* Pendente
* Em andamento
* Resolvido
* Remoção automática das ocorrências resolvidas do feed público

### 📊 Dashboard do Servidor Público (Web)

* Quantidade de alertas ativos
* Estatísticas por Município
* Quantidade de ocorrências registradas
* Indicadores de risco
* Monitoramento em tempo real

---

## 🛠️ Tecnologias Utilizadas

### Front-end

* Next.js
* React
* TypeScript
* Tailwind CSS

### Mobile (Aplicativo)

* React Native / Expo
* Lucide React Native (Ícones)

### Banco de Dados e Backend

* Supabase (Autenticação, Banco de Dados Relacional e Armazenamento de Fotos)

### APIs

* WeatherAPI

### Bibliotecas

* React Leaflet
* Leaflet
* Lucide React

---

## 🎯 Público-Alvo

* Cidadãos
* Defesa Civil
* Prefeituras

---

## 📷 Principais Módulos

### Plataforma Web

* Login e Cadastro
* Clima
* Mapa Interativo
* Feed Comunitário
* Alertas
* Dashboard Administrativo

### Aplicativo Mobile

* Login e Cadastro
* Clima
* Perfil do Usuário
* Feed Comunitário (com envio de fotos e localização)
* Rotas e Navegação
* Emergências e Contatos Úteis

---

## 👩‍💻 Equipe

Projeto acadêmico da matéria de Projeto Integrador I, desenvolvido para aplicação de:

* Desenvolvimento Web e Mobile
* Banco de Dados
* Geolocalização
* APIs
* Sistemas de Monitoramento
* Interface Responsiva
