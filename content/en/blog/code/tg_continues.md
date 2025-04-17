---
title: "TG - Atualizações"
date: 2025-04-17T22:00:00+08:00
draft: false
author: "Luizera do taticão"
categories: "me"
tags: ["code", "react", "next"]
thumbnail: "/image/default/girafales.jpeg"
headline: true
---
Trazendo um pouco mais de atualizações sobre o TG, agora em """reta final""" (com muitas aspas mesmo).
<!--more-->

Sumido, mas nunca parado! Voltamos com atualizações do TG2, trazendo um pouco das mudanças que ocorreram nesse meio período de sumiço, e também pra falar um pouco das implementações que foram inseridas no projeto.

## Mudança de framework (de novo)

Durante a construção do nosso projeto, comentei com um amigo (salve Kainã), sobre o TG, e ele sugeriu que fizéssemos o projeto utilizando NextJS... ele comentou sobre algumas vantagens do Next, e disse que nos ajudaria a entender e fazer a migração do projeto. No começo, ficamos com um pouco de pé atrás, porque seria muito trabalho refazer tudo do zero, mas acabamos aceitando, e muita coisa foi reaproveitada no processo de migração. Agora então, estamos utilizando **NextJS** no frontend.

## Sobre o NextJS

{{< figure src="/image/default/nextjs.jpeg" title="Vamo de Next" >}}

O Next.js é um framework de desenvolvimento fullstack para aplicações React. Criado pela Vercel, ele traz recursos como renderização híbrida (estática e servidor), roteamento automático e integração fácil com APIs, tudo com foco em performance e SEO. Atualmente, ele é um dos frameworks mais utilizados quando se trata de frontend. Devido a isso, existe uma grande comunidade e muito conteúdo pra se consultar na internet (além é claro, das IAs pra auxiliar no desenvolvimento).

Ainda separei algumas vantagens do NextJs, que ajudaram na decisão da migração do framework:

1. Renderização Híbrida (SSR, SSG, ISR)

    - SSR (Server-Side Rendering): Gera as páginas no servidor a cada requisição.

    - SSG (Static Site Generation): Gera páginas estáticas em tempo de build.

    - ISR (Incremental Static Regeneration): Permite atualizar páginas estáticas depois do build, sem rebuild total.

    - Ideal para escolher a melhor estratégia de renderização dependendo da página.

2. Roteamento Automático

    - Basta criar arquivos dentro da pasta pages e o Next cria as rotas automaticamente.

    - Suporte a rotas dinâmicas (/produto/[id].js) e rotas aninhadas.

3. Excelente para SEO

    - Por suportar SSR e SSG, o conteúdo é renderizado no servidor, o que ajuda os mecanismos de busca a indexar melhor.

4. API Routes

    - Você pode criar endpoints de API diretamente no projeto Next, sem precisar de um backend separado.

5. Performance Otimizada

    - Pré-carregamento automático de páginas com o next/link.

    - Divisão de código inteligente.

    - Otimização automática de imagens com next/image.

6. Integração com Vercel

    - Deploy ultra simples com a plataforma Vercel.

    - CI/CD integrado, pré-visualizações e escaneamento de performance.

7. Experiência de Desenvolvedor

    - Hot Reloading.

    - Suporte a TypeScript nativo.

    - Middleware, Layouts e novas features com App Router (desde a versão 13).

8. Escalabilidade

    - Suporta tanto sites pequenos quanto grandes aplicações enterprise.

Após a migração, foi um pouco difícil entender o sistema de divisão de pastas, e tudo que era necessário pra funcionar do jeito certo, mas depois de bastante teste e ficar mexendo em tudo, o projeto voltou a caminhar (e até que bem rápido).


## E agora, o que falta?

Referente aos módulos que estão sendo implementados no sistema, acredito que agora, falte apenas um pra finalizarmos. Depois, será necessário fazer algumas refatorações pra melhorar alguns aspectos visuais, e de organização.

Porém a pior parte, na minha opinião, ainda é a próxima: Escrever a monografia. 

{{< figure src="/image/default/spongebob.gif" title="Vamo de Next" >}}


Escrever nunca foi meu forte, e estamos finalmente chegando nesta parte que acredito que vai ser a mais desafiadora do TG. Escrever aqui me ajuda a pensar um pouco mais em como organizar as ideias e fazer com que na hora de escrever o documeno, as coisas comecem a fluir melhor.

Por enquanto é isso, mas em breve trago mais atualizações de como está sendo encerrado mais esse ciclo. E o post não vai ter spoilers de como o sistema está ficando...agora só vai aparecer depois de pronto. Aguardem!

## Links úteis (ou nem tanto)

- [NextJS Docs](https://nextjs.org/docs)
