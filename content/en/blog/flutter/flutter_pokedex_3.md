---
title: "[PT.3] - Flutter Pokédex <> FIREBASE"
date: 2025-03-15T18:54:33+08:00
draft: false
author: "Luizera do taticão"
categories: "flutter"
tags: ["flutter", "code", "pokedex"]
thumbnail: "/image/default/pokedex.jpg"
headline: true
---
Novos módulos adicionados no projeto, seguindo a saga!!
<!--more-->

Um salve a todos, voltamos com a saga da Pokédex, que começou como um projeto bobinho e agora já está tomando forma!!

Dessa vez venho trazer algumas novidades que foram adicionadas: os novos módulos de reigstro e autenticação de usuário, e também um adicional no final do post!

## Alterações feitas no projeto

Nesta etapa, o objetivo era implementar o registro e a autenticação de usuário, para que fosse feito um login único para cada um, para que futuramente, o usuário possa criar suas equipes de Pokémon (ainda não tem uma função definida pra essas equipes, mas vai ter).

Com isso, optei pela implementação do Firebase, para que fosse possível fazer um controle e uma implementação mais simplificada do processo - e mesmo assim achei um pouco confuso em alguns pontos - mas no final, foi uma implementação tranquila e sem muitas emoções.

Então a tela inicial e o fluxo de cadastro ficaram da seguinte forma:

{{< figure src="/image/default/pokedex_firebase.png" title="Tela de login / Tela de Registro de usuário" >}}

A ideia foi criar algo simples, mas ao mesmo tempo elegante, então o cadastro necessita apenas de um e-mail e uma senha (com algumas validações, claro), e a confirmação da senha para finalizar o fluxo. Depois do cadastro, já é possível se conectar ao App, porém a parte de dentro dele não teve muita mudança, então está bem semelhante ao que estava na versão anterior.

## Próximo passo

A ideia para o próximo passo será talvez a criação das equipes Pokémon individuais de cada usuário, limitando-se a um total de 5 Pokémons por equipe, pra também não virar bagunça. Depois disso, não tenho mais ideias, mas ainda tenho interesse em colocar mais algumas coisas pra treinar mais, porém, sem perder a essência do App.


## Links úteis

Nos links úteis, vou colocar os mesmos de antes, e adicionar também a documentação do Firebase, que me ajudou demais na implementação no projeto:

- [Flutter Architecture](https://docs.flutter.dev/app-architecture)
- [Repo Pokedex Github](https://github.com/silva-luiz/pokedex)
- [Poke API](https://pokeapi.co/)
- [Documentação Flutter Firebase](https://firebase.google.com/docs/flutter?hl=pt-br)

E como disse lá em cima que teria um adicional aqui no final do post, segue abaixo o Link para download do APK da versão v1.1.0+1:

- [FLUTTER POKÉDEX v1.1.0+1](https://drive.google.com/drive/folders/1IOeDbGWjqre_tcr45Er1YTs3HCxNEeIb?usp=sharing)

É isso feras, até o próximo capítulo!!!