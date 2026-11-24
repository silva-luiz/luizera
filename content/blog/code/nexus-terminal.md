---
title: "Nexus Terminal"
date: 2026-11-24T20:00:00+08:00
draft: false
author: "Luizera do taticão"
categories: ["Code"]
tags: ["code", "rust", "react", "tauri", "terminal"]
thumbnail: "/image/posts/nexus-terminal-grade.png"
headline: true
---

**Nexus Terminal**: chega de dez janelas chamadas "Windows PowerShell".

<!--more-->

Todo dev que trabalha no Windows conhece essa cena: um terminal com o backend rodando, outro com o front, outro pro git, mais um pros logs e aquele que você abriu pra testar uma coisa rapidinho e esqueceu. Resultado: a barra de tarefas cheia de ícones iguais, todos chamados "Windows PowerShell" ou "MINGW64", e você clicando um por um até achar o certo. E claro que o que você queria é sempre o último ksksks.

O Warp resolve parte disso, mas eu queria algo mais simples, leve e com a minha cara. Então nasceu o **Nexus Terminal**.

## O que é

O Nexus Terminal é um gerenciador de terminais pra Windows: vários terminais numa janela só, cada um com o nome que você quiser. Dá pra misturar PowerShell, Prompt de Comando, Git Bash e WSL lado a lado, e ele já detecta sozinho quais desses você tem instalados.

A ideia principal é você **bater o olho e saber qual terminal é qual**. Duplo clique na aba (ou `F2`), digita "API", "Testes", "Servidor" e pronto, acabou a caça ao tesouro.

{{< figure src="/image/posts/nexus-terminal-abas.png" title="Cada terminal com um nome que faz sentido" >}}

Cada aba também mostra o ícone do shell (PS, Git, C:, Linux), e se você tentar fechar um terminal que tá rodando alguma coisa (um servidor, um `ssh`, um `vim` aberto), ele pergunta antes. Já perdi a conta de quantas vezes matei um servidor sem querer fechando a janela errada.

## Modo grade

Essa é a minha parte favorita. Apertando `Ctrl+Shift+G` (ou o botão de quadradinhos na barra), todos os terminais aparecem **ao mesmo tempo**, organizados numa grade automática: dois ficam lado a lado, quatro viram um 2x2, e por aí vai. Dá pra ver o servidor cuspindo log enquanto os testes rodam e o git fica ali esperando.

{{< figure src="/image/posts/nexus-terminal-grade.png" title="Todo mundo na tela ao mesmo tempo" >}}

Clicando numa célula ela ganha o foco, e um duplo clique no nome volta pro modo de abas já naquele terminal. E o melhor: trocar de modo não reinicia nada, os terminais só mudam de lugar.

## Abas do lado

Se você é do time que prefere as abas na lateral (tipo o VS Code), também tem: nas configurações dá pra escolher se as abas ficam em cima, na esquerda ou na direita. Na lateral, é só arrastar a borda pra ajustar a largura.

{{< figure src="/image/posts/nexus-terminal-lateral.png" title="Abas na lateral, modo grade e tema Dracula" >}}

## Deixando com a sua cara

A tela de configurações (`Ctrl+,`) deixa mexer em praticamente tudo:

- **Temas**: vem com 8 temas (Nexus Dark e Light, Dracula, One Half, Solarized e Nord) e dá pra importar outros, inclusive os esquemas de cores do Windows Terminal.
- **Fonte e cursor**: fonte, tamanho, altura da linha e o estilo do cursor, tudo aplicado na hora.
- **Shells**: dá pra criar perfis próprios, escolher o shell padrão, a pasta inicial e até variáveis de ambiente.
- **Atalhos**: todos os atalhos podem ser trocados. Clica no atalho, aperta a combinação nova e, se ela já for usada por outra ação, o app avisa.
- **Idioma**: português, inglês ou espanhol.

{{< figure src="/image/posts/nexus-terminal-temas.png" title="Escolhendo o tema" >}}

{{< figure src="/image/posts/nexus-terminal-layout.png" title="Posição das abas e modo de visualização" >}}

## Outras coisinhas legais

- **Busca no terminal** com `Ctrl+Shift+F`, com opção de diferenciar maiúsculas, palavra inteira e expressão regular.
- **Zoom** com `Ctrl+roda do mouse` (ou `Ctrl+=` e `Ctrl+-`).
- **Confirmação ao colar várias linhas**, pra ninguém rodar um script inteiro sem querer.
- **`Ctrl+C` inteligente**: com texto selecionado ele copia, sem seleção ele interrompe o comando como sempre.
- **Instância única**: abrir o app de novo só cria uma aba nova na janela que já tá aberta. E dá pra abrir direto numa pasta com `nexus-terminal.exe -d C:\meu\projeto`.

## Por baixo do capô

Assim como o Port Manager, ele foi feito com **Tauri 2**, com o backend em **Rust** e o frontend em **React + TypeScript**. O terminal em si é o **xterm.js** (o mesmo do terminal do VS Code), e a ligação com os shells de verdade é feita pelo **ConPTY**, a API do Windows pra hospedar terminais. É ele que faz `vim`, `htop`, cores e barras de progresso funcionarem direitinho.

O instalador ficou com **1,8 MB**. Um app Electron fazendo a mesma coisa passaria fácil dos 80 MB.

E teve umas pegadinhas no caminho. A melhor: o ConPTY, assim que abre o shell, pergunta "em que posição tá o cursor?" e **trava tudo até alguém responder**. Se a resposta se perder, o terminal abre em branco e fica lá, parado, olhando pra você. Outra: a biblioteca que usei pra encerrar processos devolvia "erro" justamente quando conseguia encerrar, e "sucesso" quando falhava. Coisas lindas da programação hehe.

Assim como o Port Manager, esse projeto foi feito com o Cláudio Códigos na maior parte, e saiu do zero até instalador funcionando, com testes, documentação e tudo.

## Quero testar!

**[⬇️ Baixar o Nexus Terminal para Windows (1,8 MB)](/downloads/nexus-terminal_1.0.0_x64-setup.exe)**

Funciona no Windows 10 (1809 ou mais novo) e no Windows 11. Como o instalador ainda não é assinado digitalmente, o Windows vai mostrar aquele aviso "O Windows protegeu o computador". É só clicar em **Mais informações** e depois em **Executar assim mesmo**. Ele instala só pro seu usuário, sem pedir senha de administrador.

O código tá no GitHub: [silva-luiz/nexus-terminal](https://github.com/silva-luiz/nexus-terminal). Se quiser buildar na sua máquina, precisa de Rust, Node e pnpm, e aí é só clonar e rodar:

```bash
pnpm install
pnpm build
```

O instalador aparece em `src-tauri/target/release/bundle/`.

Sugestões e issues são muito bem-vindas. Façam bom uso.
