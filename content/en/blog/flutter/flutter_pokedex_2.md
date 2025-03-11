---
title: "Flutter Pokédex - Continuação"
date: 2025-03-10T18:54:33+08:00
draft: false
author: "Luizera do taticão"
categories: "flutter"
tags: ["flutter", "code"]
thumbnail: "/image/default/pokedex.jpg"
headline: true
---
A continuação do nosso projetinho pra entender a arquitetura
<!--more-->

Primeiramente um salve a todos

Segundamente, esse post é de atualização sobre a nossa Pokedex, que está quase se encaminhando pra próxima etapa. Tá ficando bem legal, e estou começando a entender melhor as reponsabilidades de cada parte do projeto. Aproveito pra deixar aqui também um grande agradecimento ao meu amigo e colega de trabalho [Abnera](https://github.com/AbnerRibeirodaSilva), que tem sido bastante paciente tirando minhas dúvidas e me ajudando com as partes que estou tendo dificuldades.

## Alterações feitas no projeto

A maioria das alterações feitas no App desde a última postagem foram alterações visuais, como Badges de identificação dos tipos de cada Pokemón, assim como um degradê no background baseado nas cores de seu tipo (ou tipos).

{{< figure src="/image/default/pokedex_2.png" title="Tá ficando bonito o negócio" >}}

Mas o principal ponto de mudança no App foi a adição das **viewmodels** (ou controllers), que antes estavam juntos da view (ou pages), o que não é o ideal de acordo com o primeiro conceito do **[SOLID](https://medium.com/desenvolvendo-com-paixao/o-que-%C3%A9-solid-o-guia-completo-para-voc%C3%AA-entender-os-5-princ%C3%ADpios-da-poo-2b937b3fc530)**, que é o Single Responsiblity Principle ou Princípio da responsabilidade única, onde cada classe deve ter apenas uma responsabilidade ou motivo para mudar. Neste formato atual:

- A view tem a responsabilidade de apenas exibir a interface gráfica e reagir a interações do usuário.
- A viewmodel tem a responsabilidade de gerenciar dados, estados e ações sem se preocupar com como esses dados são exibidos.

{{< figure src="/image/default/pokedex_pastas.png" title="Aqui vcs podem ver como ficou a distribuição dos arquivos" >}}

O segundo ponto importante do SOLID abordado aqui é o Princípio da Inversão de Dependência (DIP). O DIP sugere que módulos de alto nível não devem depender de módulos de baixo nível diretamente, mas de abstrações. No caso de separar views e viewmodels, a view não depende diretamente de como os dados são gerenciados ou de como a lógica é implementada. A view apenas interage com uma abstração (geralmente a viewmodel ou um controlador) para buscar dados e responder a mudanças de estado.

- A viewmodel não sabe nada sobre a view específica, mantendo a lógica de negócio desacoplada da interface.
- A view depende de interfaces ou abstrações para acessar a viewmodel, promovendo uma arquitetura flexível e de fácil manutenção.


## Próximos passos

Os próximos passos incluem a adição de um ícone para o App, uma Splash art pra inicializar tudo bonitinho, e a criação de mais módulos que ainda não pensei (até tenho algumas ideias, mas ainda preciso validar pra ver se realmente faz sentido). Se tudo correr bem, quem sabe não vem uma publicação na PlayStore...não é o objetivo, mas pode acontecer.

## Links úteis

Ctrl + C, Ctrl + V do outro post, os links úteis, caso interesse:

- [Flutter Architecture](https://docs.flutter.dev/app-architecture)
- [Repo Pokedex Github](https://github.com/silva-luiz/pokedex)
- [Poke API](https://pokeapi.co/)

E caso alguém se interesse e queira uma versão do App, pode entrar em contato comigo, que envio um APK pra vcs brincarem aí hehehe - lembrando que só para dispositivos **Android**.

Valeu guys, e até a próxima!!