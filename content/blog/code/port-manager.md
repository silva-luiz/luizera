---
title: "Port Manager"
date: 2026-11-23T22:00:00+08:00
draft: false
author: "Luizera do taticão"
categories: ["Code"]
tags: ["code", "rust", "react", "tauri"]
thumbnail: "/image/posts/port-manager-painel.png"
headline: true
---

**Port Manager**: quem tá usando a porta 3000?

<!--more-->

Se você é dev, com certeza já passou por isso: vai subir o projeto, roda o `npm run dev` e aparece aquele lindo `Error: listen EADDRINUSE: address already in use :::3000`. Aí começa a caçada: abre o terminal, roda `netstat -ano | findstr 3000`, pega o PID, abre o Gerenciador de Tarefas, procura o PID na lista, descobre que é um `node.exe`... mas qual deles? Porque sempre tem uns cinco `node.exe` rodando ao mesmo tempo ksksks.

Depois de fazer esse ritual pela milésima vez, resolvi criar uma ferramentinha pra resolver isso de uma vez: o **Port Manager**.

## O que é

O Port Manager é um app desktop bem leve que mostra quais portas TCP e UDP estão em uso na sua máquina, qual processo é dono de cada uma, e deixa você encerrar esse processo com um clique (com confirmação, claro, ninguém quer matar o processo errado sem querer).

Logo de cara você cai no **Painel**, que dá um resumo geral: quantas portas estão ativas, quantas estão escutando, quantas conexões estão estabelecidas e quais processos estão segurando quais portas.

{{< figure src="/image/posts/port-manager-painel.png" title="O painel com o resumo das portas" >}}

Olhando essa tela já dá pra ver uns clássicos: o MySQL na 3306, o Postgres na 5432, o VS Code segurando umas portas aleatórias e o Spotify e a Steam fazendo sabe-se lá o quê.

## A tabela de portas

A parte principal é a página de **Portas**, que lista todos os sockets da máquina. Dá pra buscar por porta, endereço, nome do processo, PID e até pela linha de comando. Esse último resolve justamente o problema dos vários `node.exe`, porque agora dá pra ver os argumentos de cada um e saber qual é qual.

Também tem filtro por processo, protocolo e estado, as colunas são ordenáveis, e as conexões já encerradas (aquelas `TIME_WAIT` que só poluem a lista) ficam escondidas por padrão.

Clicando numa linha abre o painel de detalhes do processo, com o caminho do executável, a linha de comando, o processo pai, os processos filhos e um botão de "Abrir pasta" pra ir direto no executável no Explorer.

{{< figure src="/image/posts/port-manager-detalhes.png" title="Tabela de portas filtrada, com o painel de detalhes aberto" >}}

E se for pra encerrar o processo, o app pede confirmação, dá a opção de encerrar junto os processos filhos e se recusa a matar processos críticos do Windows. Então pode clicar sem medo de derrubar o sistema hehe.

## Outras coisinhas legais

- **Portas favoritas**: dá pra marcar portas com estrela (tipo a 3000, 5173, 8080 que a gente vive usando) e ver rapidinho se estão livres ou ocupadas. Também dá pra receber uma notificação do Windows quando uma porta favorita fica ocupada ou livre, mesmo com o app minimizado.
- **Atualização automática** da lista, de 2 em 2 até 30 em 30 segundos.
- **Copiar com um clique** o PID, a porta, os endereços, o caminho e a linha de comando.
- **Atalhos de teclado**: `Ctrl+F` pra buscar, `F5` pra atualizar e `Esc` pra fechar o painel de detalhes.
- **Português ou inglês**, escolhido nas configurações.
- Pode ficar rodando na **bandeja do sistema** quando você fecha a janela.

{{< figure src="/image/posts/port-manager-configuracoes.png" title="Configurações, agora em português" >}}

## Por baixo do capô

O app foi feito com **Tauri 2**, com o backend em **Rust** e o frontend em **React + TypeScript**, estilizado com Tailwind. Pra quem não conhece, o Tauri é tipo um Electron, só que em vez de empacotar um Chrome inteiro junto com o app, ele usa o WebView do próprio sistema. Resultado: o instalador ficou com uns 2 MB, enquanto um app Electron simples já passa fácil dos 80 MB.

O Rust fica responsável pela parte pesada: ler as tabelas de conexão do sistema operacional, descobrir de qual processo é cada socket, pegar os detalhes do processo e encerrar quando necessário. As portas favoritas e as configurações ficam salvas num SQLite local.

Ele começou só pra Windows, mas na versão 0.2.0 ganhou suporte a **Linux** também, lendo as informações direto do `/proc`. E tem CI no GitHub Actions rodando nos dois sistemas.

O projeto está sendo feito com Cláudio Códigos em sua maior parte e surgiu à partir de uma necessidade de facilitar um processo chato.

## Quero testar!

O código tá no GitHub: [silva-luiz/port-manager](https://github.com/silva-luiz/port-manager). Se quiser buildar na sua máquina, é só clonar, instalar as dependências e rodar os comandos:

```bash
npm install
npm run tauri build
```

Os instaladores vão aparecer em `src-tauri/target/release/bundle/`.

O projeto ainda tá em desenvolvimento, então sugestões e issues são muito bem-vindas. E nunca mais `netstat -ano | findstr` na minha vida (pelo menos é o que eu espero).
