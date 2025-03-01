---
title: "Flutter Pokédex"
date: 2025-02-28T18:54:33+08:00
draft: false
author: "Luizera do taticão"
categories: "flutter"
tags: ["flutter", "code"]
thumbnail: "/image/default/pokedex.jpg"
headline: true
---
A opção que encontrei para estudar a nova arquitetura do Flutter proposta pela Google.
<!--more-->

Fala guys, cês tão bem?

Seguindo na trilha dos estudos, estou estudando agora sobre a nova arquitetura que a Google recomendou para os próximos projetos em Flutter. Com isso, também teremos algumas mudanças no trabalho, e precisamos nos adaptar à nova arquitetura, e uma forma que encontrei pra entender melhor alguns pontos que ainda não estão tão claros pra mim, é criando um projeto do zero, tentando me adequar ao que foi proposto.

{{< figure src="/image/default/arch_flutter.png" title="Flutter Architecture" >}}

Dito isso, resolvi criar um projetinho simples, que muitos já devem ter feito, mas eu ainda não havia tentado, que é a **Pokédex**, porém, seguindo o modelo de arquitetura recomendado pela Google.

## Sobre o projeto

O projeto foi pensado basicamente em ter poucas funcionalidades: Listar todos os pokémons e mostrar as características individuais de cada um. Os dados podem ser acessados em uma API pública que deixarei o link no fim do post. A API é extremamente rica em detalhes, contendo literalmente **TODAS** as informações sobre **TODOS** os Pokémons, desde os atributos de luta (attack, defense, HP, etc..), até descrição dos ataques, onde podem ser localizados...enfim, tudo que vc pensar aí sobre Pokémon, vai ter nessa API.

### Como o App está no momento?

Até o momento, o App está com a aparência das fotos abaixo, sem muita firula, apenas com o básico e com o foco em melhorar e aprender mais sobre a **Arquitetura**, e principalmente sobre as suas camadas, que ainda me parece um pouco confuso de entender. A ideia aqui é entender bem como tudo funciona, e em seguida melhorar visualmente, colocando mais personalidade e até mesmo novas funcionalidades no App (que ainda não pensei em nenhuma hehe).

{{< figure src="/image/default/pokedex-app.png" title="A cara do App ai pra vcs" >}}

### Próximos passos

A princípio, o que temos pra hoje é isso aí, mas conforme o projeto for avançando, estarei postando sobre as alterações, novas implementações, sobre o que foi aprendido e as dificuldades encontradas pelo caminho. Quando sentir que o App está minimamente utilizável, vou disponibilizar um link para download do APK para ser utilizado por quem quiser dar uma brincada no App hehe (apenas pra Android infelizmente).


## Links úteis

A seguir, deixo pra quem se interessar alguns links úteis sobre o assunto:

- [Flutter Architecture](https://docs.flutter.dev/app-architecture)
- [Repo Pokedex Github](https://github.com/silva-luiz/pokedex)
- [Poke API](https://pokeapi.co/)