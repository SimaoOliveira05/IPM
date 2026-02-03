export default {
  settings: {
    title: 'Definições',
    appearance: 'Aparência',
    language: 'Idioma',
    theme: {
      day: 'Dia',
      night: 'Noite'
    },
    lang: {
      pt: 'Português',
      en: 'Inglês'
    }
  },
  account: {
    welcome: 'Olá, {name}',
    visitor: 'Visitante',
    saved_cities: 'Cidades Guardadas',
    saved_hosts: 'Anfitriões Favoritos',
    saved_listings: 'Anúncios Guardados',
    empty_cities: 'Ainda não guardaste nenhuma cidade.',
    empty_hosts: 'Ainda não tens anfitriões favoritos.',
    empty_listings: 'Ainda não guardaste nenhum anúncio.'
  },
  auth: {
    signin: 'Entrar',
    register: 'Registo',
    login_btn: 'Entrar',
    create_account: 'Criar conta',
    have_account: 'já tens conta?',
    no_account: 'não tens conta?',
    action_enter: 'entra',
    action_register: 'regista',
    description: 'Acede para guardar dashboards e alertas personalizados.',
    name_label: 'Nome',
    name_placeholder: 'nome...',
    email_label: 'Email',
    email_placeholder: 'email...',
    password_label: 'Password',
    password_placeholder: 'palavra-passe...',
    error_credentials: 'Email ou palavra-passe incorretos',
    my_account: 'A minha conta',
    logout: 'Sair',
    toggle_password: 'Alternar visibilidade da palavra-passe'
  },
  hero: {
    title: 'Analisa tendências do Airbnb em segundos',
    subtitle: 'Pesquisa qualquer cidade, freguesia ou anfitrião com dados oficiais do Airbnb para revelar preços, ocupação e avaliações.',
    tag: 'bUMking'
  },
  search: {
    location_label: 'Localização',
    location_placeholder: 'Procura cidades, freguesias, anfitriões...',
    type_label: 'Tipo',
    type_placeholder: 'Selecionar tipo',
    type_title: 'Tipo de pesquisa',
    sort_title: 'Ordenar por',
    quick_actions: 'Ações rápidas',
    sort_placeholder: 'Ordenar',
    categories: {
      hosts: 'Anfitriões',
      listings: 'Anúncios',
      neighbourhoods: 'Freguesias'
    }
  },
  sort: {
    rating_best: 'Melhor avaliação',
    rating_worst: 'Pior avaliação',
    price_highest: 'Preço (mais alto)',
    price_lowest: 'Preço (mais baixo)',
    alphabetical: 'Ordem Alfabética'
  },
  stats: {
    monitored_cities: 'Cidades monitorizadas',
    active_listings: 'Anúncios ativos',
    analyzed_hosts: 'Anfitriões analisados'
  },
  insights: {
    benchmark: {
      title: 'Benchmark de preços',
      description: 'Compara o valor médio por noite e detecta picos sazonais em poucos cliques.'
    },
    availability: {
      title: 'Disponibilidade e ocupação',
      description: 'Analisa ocupação semanal, cancelamentos e estadias mínimas para cada mercado.'
    },
    reputation: {
      title: 'Avaliações e reputação',
      description: 'Identifica hosts com melhores classificações e o que os diferencia dos restantes.'
    },
    discover_title: 'O que podes descobrir',
    view_more_stats: 'Ver mais estatísticas →'
  },
  dashboard: {
    listings_title: 'Panorama dos Anúncios',
    hosts_title: 'Panorama dos Anfitriões',
    active_listings: 'Anúncios ativos',
    avg_price_night: 'Preço médio/noite',
    occupancy_rate: 'Taxa de ocupação',
    avg_rating: 'Avaliação média',
    total_hosts: 'Total de Anfitriões',
    avg_revenue: 'Receita média',
    distribution_type: 'Distribuição por tipo de alojamento',
    top_neighborhoods: 'Top Freguesias por Anúncios',
    market_distributions: 'Distribuições do Mercado',
    top_hosts_revenue: 'Top Anfitriões por Receita',
    top_hosts_listings: 'Top Anfitriões por Anúncios',
    listings_unit: 'anúncios',
    price: 'Preço',
    occupancy: 'Ocupação',
    revenue: 'Receita',
    price_eur: 'Preço (€)',
    occupancy_days: 'Ocupação (dias)',
    revenue_eur: 'Receita (€)',
    cdf_label: 'Distribuição Acumulada',
    mean: 'Média',
    median: 'Mediana',
    percentile: 'Percentil',
    cumulative_percentile: 'Percentil Acumulado',
    no_data_year: 'Sem dados para este ano.',
    year: 'Ano:',
    market_analysis_title: 'Análise de Mercado',
    calculating: 'A calcular estatísticas...',
    anomalies_title: 'Anomalias Detetadas',
    context_city: 'da Cidade',
    context_neighbourhood: 'da Freguesia',
    context_global: 'Global',
    est: '(Est.)',
    days: 'dias',
    // Analytics
    competitiveness: {
      dominant: 'Dominante',
      strong: 'Forte',
      medium: 'Médio',
      weak: 'Fraco'
    },
    alignment: {
      misaligned_low: 'Desalinhado',
      premium: 'Premium',
      undervalued: 'Subvalorizado',
      overvalued: 'Sobrevalorizado',
      balanced: 'Equilibrado',
      desc_misaligned_low: 'Baixo Preço, Baixa Ocupação',
      desc_premium: 'Alta Procura',
      desc_undervalued: 'Oportunidade de Aumento',
      desc_overvalued: 'Risco de Vacância',
      desc_balanced: 'Equilíbrio Ideal'
    },
    market_fit: {
      excellent: 'Excelente Ajuste',
      good: 'Bom Ajuste',
      needs_work: 'Necessita Ajuste',
      bad: 'Desalinhado do Mercado'
    },
    anomalies: {
      premium_price: 'Preço Premium (> P90)',
      low_cost: 'Baixo Custo (< P10)',
      critical_rating: 'Avaliação Crítica',
      low_rating: 'Rating Baixo (< 4.0)',
      top_revenue: 'Gerador de Receita Top',
      low_occupancy: 'Baixa Ocupação Crítica'
    },
    performance: {
      above_average: 'Acima da Média',
      below_average: 'Abaixo da Média'
    },
    summary_intro: 'Este anúncio está posicionado no percentil {price} de preço e {occupancy} de ocupação.',
    summary_pos: 'A análise indica um posicionamento {alignment}, resultando num score de competitividade de {score}/100 ({label}).',
    summary_anomalies: 'Foram detetadas anomalias como: {list}.',
    summary_recommendation_good: 'O imóvel apresenta um bom ajuste ao mercado, sugerindo manutenção da estratégia atual.',
    summary_recommendation_bad: 'Recomenda-se revisão da estratégia de preços ou melhoria nas comodidades para aumentar a competitividade.',
    alignment_desc: 'Baseado na relação entre o percentil de preço ({price}) e ocupação ({occupancy}) no contexto {context}.',
    revenue_expected: 'Receita Esperada vs Real',
    revenue_actual: 'Real',
    revenue_target: 'Esperada (P50-P75)',
    analysis_summary: 'Resumo da Análise ({context})',
    price_occupancy_alignment: 'Alinhamento Preço-Ocupação'
  },
  listing: {
    loading: 'A carregar informações...',
    error: 'Erro ao carregar dados',
    retry: 'Tentar novamente',
    back: 'Voltar',
    description: 'Descrição',
    per_night: 'por noite',
    view_airbnb: 'Ver no Airbnb'
  },
  results: {
    count_label: 'resultados',
    per_page: 'Resultados por página',
    empty_title: 'Sem resultados',
    empty_description: 'Tenta ajustar a pesquisa ou escolher outra dimensão.'
  },
  listing_details: {
    housing: 'Habitação',
    type: 'Tipo',
    bedrooms: 'Quartos',
    capacity: 'Capacidade',
    beds: 'Camas',
    bathrooms: 'Casas de banho'
  },
  host_profile: {
    about: 'Sobre',
    properties: 'Propriedades',
    superhost: 'Superhost',
    verified: 'Verificado',
    member_since: 'Membro desde',
    response_rate: 'Taxa de resposta',
    response_time: 'Tempo de resposta',
    acceptance_rate: 'Taxa de aceitação',
    view_profile: 'Ver perfil no Airbnb',
    no_listings: 'Este anfitrião não tem anúncios registados.',
    title_stats: 'Estatísticas do Anfitrião',
    host_label: 'Anfitrião',
    not_available: 'Informação do anfitrião não disponível',
    no_listings_year: 'Sem casas registadas para este ano.'
  },
  host_analytics: {
    room_type_dist: 'Tipos de Alojamento',
    rating_dist: 'Distribuição de Avaliações',
    price_dist: 'Distribuição de Preços',
    ratings: 'Avaliações',
    prices: 'Preços',
    num_listings: 'Número de Anúncios',
    range: 'Intervalo'
  },
  location: {
    title_stats: 'Estatísticas',
    market_analysis: 'Análise do Mercado',
    accom_type: 'Tipo de alojamento',
    neighbourhood: 'Freguesia',
    city: 'Cidade',
    comparison_city: 'Média da Cidade',
    comparison_global: 'Global',
    compare_with: 'Comparar com:',
    properties_map: 'Mapa de Propriedades',
    no_data: 'Sem dados disponíveis',
    room_types: {
      entire_home: 'Casa/Apt. completo',
      private_room: 'Quarto privado',
      shared_room: 'Quarto partilhado',
      hotel_room: 'Quarto de hotel'
    }
  },
  filters: {
    filter_btn: 'Filtrar',
    refine_results: 'Refinar resultados',
    house_type: 'Tipo de casa',
    anomalies_only: 'Apenas com anomalias',
    price_range: 'Intervalo de preço',
    rating: 'Avaliação',
    clear_filters: 'Limpar filtros',
    apply: 'Aplicar'
  },
  documentation: {
    title: 'Documentação',
    nav: {
      search: 'Como Pesquisar',
      data: 'Organização dos Dados',
      scoring: 'Sistema de Pontuação',
      revenue: 'Receita Esperada',
      anomalies: 'Guia de Anomalias'
    },
    general: {
      example: 'Exemplo'
    },
    sections: {
      data: {
        title: 'Organização dos Dados',
        content: 'A nossa plataforma organiza os dados do mercado cronologicamente, agrupados por anos (ex: 2023, 2024). Isto permite acompanhar tendências históricas e comparar o desempenho entre diferentes estações. Os anúncios são avaliados dentro do contexto do seu ano específico para garantir comparações justas.'
      },
      scoring: {
        title: 'Pontuação da Habitação (0-100)',
        description: 'O Score de Competitividade é uma avaliação composta (0-100) que mede a força de mercado de um anúncio. É calculado combinando três percentis chave de desempenho:',
        factors: {
          price: 'Percentil de Preço (40% peso)',
          occupancy: 'Percentil de Ocupação (40% peso)',
          revenue: 'Percentil de Receita (20% peso)'
        },
        example: 'Uma pontuação alta indica um anúncio "Dominante"—aquele que mantém preços altos garantindo alta ocupação. Por exemplo, estar no percentil 90 de preço e ocupação resultaria numa pontuação quase perfeita, sinalizando forte procura.'
      },
      revenue: {
        title: 'Receita Esperada',
        content: 'A receita esperada é uma projeção de mercado derivada do percentil 50-75 de anúncios semelhantes na sua área. Ao contrário dos dados históricos, este é um benchmark prospectivo para ajudar a avaliar os ganhos potenciais se a sua propriedade tiver um desempenho entre os melhores concorrentes. Não é um valor garantido, mas um objetivo baseado nas condições atuais do mercado.',
        example: 'Por exemplo, se anúncios semelhantes de 2 quartos na sua freguesia ganham entre 1.500€ e 2.000€, a sua meta de receita esperada pode ser 1.800€. Isto ajuda a identificar se está a ter um desempenho inferior ao potencial do mercado.'
      },
      anomalies: {
        title: 'Compreender as Anomalias',
        intro: 'Detetamos automaticamente anomalias estatísticas para destacar outliers no mercado. Eis o que significam:',
        list: {
          premium_price: { 
            label: 'Preço Premium (> P90)', 
            desc: 'O preço está no top 10% do mercado. Indica uma propriedade de luxo ou topo de gama.' 
          },
          low_cost: { 
            label: 'Baixo Custo (< P10)', 
            desc: 'O preço está nos 10% mais baixos do mercado. Competitivo ou potencialmente subavaliado.' 
          },
          critical_rating: { 
            label: 'Avaliação Crítica (Percentil < 20)', 
            desc: 'A avaliação está nos 20% inferiores comparado aos pares, indicando problemas de desempenho.' 
          },
          low_rating: { 
            label: 'Avaliação Baixa (< 4.0)', 
            desc: 'A média absoluta é inferior a 4.0 estrelas. Isto é considerado um aviso de qualidade.' 
          },
          top_revenue: { 
            label: 'Gerador de Receita Top (> P90)', 
            desc: 'Gera mais receita que 90% dos competidores, marcando-o como um dos melhores desempenhos.' 
          },
          low_occupancy: { 
            label: 'Ocupação Crítica Baixa (< P10)', 
            desc: 'Ocupação inferior a 90% do mercado, sinalizando problemas potenciais de visibilidade ou preço.' 
          }
        }
      },
      alignment: {
        title: 'Alinhamento Preço-Ocupação',
        intro: 'O alinhamento preço-ocupação avalia a relação entre o percentil de preço e o percentil de ocupação de um anúncio. Esta métrica identifica se a estratégia de preços está otimizada para o mercado.',
        matrix: 'A análise cruza dois eixos: Preço (baixo/alto) vs Ocupação (baixa/alta).',
        categories: {
          premium: {
            label: 'Premium (Alta Procura)',
            desc: 'Preço alto com ocupação alta. Indica forte procura e propriedade bem posicionada no mercado de luxo.'
          },
          balanced: {
            label: 'Equilibrado (Equilíbrio Ideal)',
            desc: 'Preço e ocupação alinhados com o mercado. A estratégia atual está a funcionar bem.'
          },
          undervalued: {
            label: 'Subvalorizado (Oportunidade de Aumento)',
            desc: 'Preço baixo mas ocupação alta. Há potencial para aumentar preços sem perder reservas.'
          },
          overvalued: {
            label: 'Sobrevalorizado (Risco de Vacância)',
            desc: 'Preço alto mas ocupação baixa. Considere reduzir preços ou melhorar as comodidades.'
          },
          misaligned: {
            label: 'Desalinhado',
            desc: 'Preço baixo e ocupação baixa. Pode indicar problemas de visibilidade, localização ou qualidade percebida.'
          }
        },
        example: 'Por exemplo, se o seu anúncio está no percentil 80 de preço mas apenas no percentil 30 de ocupação, está "Sobrevalorizado" - o preço está a afastar potenciais hóspedes.'
      },
      search: {
        title: 'Como Utilizar a Pesquisa',
        intro: 'A barra de pesquisa é a forma mais rápida de encontrar informações sobre alojamentos, anfitriões e freguesias no dataset do Airbnb.',
        what_title: 'O Que Pode Pesquisar?',
        what_desc: 'Pode pesquisar por localização (cidade, freguesia), nome do anúncio, ou nome do anfitrião e depois filtrar por categoria:',
        categories: {
          listings: {
            title: 'Anúncios',
            desc: 'Lista de todos os alojamentos disponíveis na localização pesquisada.',
            examples: ['Porto → Todos os anúncios no Porto', 'Ribeira → Anúncios na zona da Ribeira', 'Apartamento Centro → Anúncios com esse nome']
          },
          hosts: {
            title: 'Anfitriões',
            desc: 'Lista de anfitriões registados na plataforma, com as suas propriedades.',
            examples: ['Porto → Anfitriões com propriedades no Porto', 'Foz → Anfitriões na zona da Foz']
          },
          neighbourhoods: {
            title: 'Freguesias',
            desc: 'Estatísticas agregadas por freguesia: preço médio, ocupação, ratings.',
            examples: ['Porto → Todas as freguesias do Porto', 'Paranhos → Estatísticas de Paranhos']
          }
        },
        steps_title: 'Passo a Passo',
        steps: {
          choose: { title: 'Escolha a categoria', desc: 'Use o dropdown "Anúncios" para selecionar o que quer pesquisar: Anúncios, Anfitriões ou Freguesias.' },
          type: { title: 'Digite o que procura', desc: 'Escreva o nome da cidade, freguesia, nome do anúncio ou nome do anfitrião. A pesquisa procura em todas as localizações e nomes do dataset.' },
          click: { title: 'Clique no botão de pesquisa', desc: 'Prima o ícone de lupa ou a tecla Enter para ver os resultados.' },
          filter: { title: 'Use os filtros (opcional)', desc: 'Na página de resultados, pode refinar com filtros de preço, tipo de alojamento, avaliação e muito mais.' }
        },
        tips_title: 'Dicas Úteis',
        tips: {
          partial: { title: 'Pesquisa parcial:', desc: 'Não precisa de escrever o nome completo. "Rib" encontra "Ribeira".' },
          switch: { title: 'Mudar categoria:', desc: 'Pode trocar entre Anúncios/Anfitriões/Freguesias nos resultados sem perder a pesquisa.' },
          filters: { title: 'Filtros avançados:', desc: 'Use "Filtrar" para refinar por preço, rating, tipo de casa e anomalias.' },
          sort: { title: 'Ordenar resultados:', desc: 'Use "Ordenar" para ver por preço, rating, ocupação ou receita.' }
        },
        example_label: 'Exemplo Prático:',
        example_text: 'Para encontrar apartamentos baratos na Ribeira: Pesquise "Ribeira" → Categoria "Anúncios" → Clique em "Filtrar" → Defina preço máximo € 50 → Clique "Aplicar".'
      }
    }
  },
  metrics: {
    total_listings: 'Anúncios',
    total_hosts: 'Anfitriões',
    avg_price: 'Preço médio',
    avg_rating: 'Avaliação média',
    avg_occupancy: 'Ocupação média',
    avg_revenue: 'Receita média',
    total_revenue_est: 'Receita Total (Est.)'
  }
}
