/**
 * Cadastra produtos de exemplo via POST /api/v1/products (para testar o scroll infinito).
 *
 * Uso (com o servidor rodando):
 *   bun scripts/seed-products.ts
 *
 * Variáveis de ambiente (o Bun já carrega o .env.local):
 *   ADMIN_API_KEY  obrigatória, enviada no header x-admin-key
 *   SEED_BASE_URL  opcional, padrão http://localhost:3000
 *
 * As imagens vêm de um serviço de placeholder (picsum.photos). Troque por fotos reais depois.
 */

type SeedProduct = { name: string; description?: string };

const products: SeedProduct[] = [
  {
    name: "Fone Bluetooth Aria 300",
    description:
      "Fone sem fio com cancelamento de ruído e até 30 horas de bateria.",
  },
  {
    name: "Cafeteira Italiana Moka 6 xícaras",
    description: "Alumínio fundido, para fogão a gás e elétrico.",
  },
  {
    name: "Mochila Urbana Trilho 22L",
    description:
      "Tecido impermeável, compartimento para notebook de 15 polegadas.",
  },
  {
    name: "Liquidificador Turbo 900W",
    description: "Copo de vidro de 2 litros e 12 velocidades.",
  },
  {
    name: "Tênis de Corrida Passo Leve",
    description: "Amortecimento para treinos diários de até 10 km.",
  },
  {
    name: "Luminária de Mesa Foco LED",
    description: "Três temperaturas de cor e braço articulado.",
  },
  {
    name: "Panela de Pressão Elétrica 5L",
    description: "Nove programas prontos e timer de até 24 horas.",
  },
  {
    name: "Teclado Mecânico Compacto 75%",
    description: "Switches marrons, conexão USB-C e Bluetooth.",
  },
  {
    name: "Garrafa Térmica Inox 1L",
    description: "Mantém bebidas quentes por 12 horas e frias por 24.",
  },
  {
    name: "Aspirador Vertical Sem Fio",
    description: "Bateria removível e filtro lavável.",
  },
  { name: "Câmera de Segurança Wi-Fi 2K" },
  {
    name: "Smartwatch Ritmo 2",
    description: "Monitor de frequência cardíaca, GPS e resistência à água.",
  },
  {
    name: "Air Fryer 4,2 Litros",
    description: "Cesto antiaderente e painel digital com oito funções.",
  },
  {
    name: "Cadeira de Escritório Apoio Total",
    description: "Encosto em tela, apoio lombar e braços reguláveis.",
  },
  {
    name: "Caixa de Som Portátil Onda",
    description: "À prova d'água, com 12 horas de reprodução.",
  },
  {
    name: "Escova de Dentes Elétrica Sônica",
    description: "Cinco modos de limpeza e estojo de viagem.",
  },
  {
    name: "Ferro de Passar a Vapor 2000W",
    description: "Base cerâmica e jato de vapor vertical.",
  },
  { name: "Kindle de Bolso 6 polegadas" },
  {
    name: "Chaleira Elétrica Inox 1,7L",
    description: "Desligamento automático e base giratória.",
  },
  {
    name: "Mouse Sem Fio Ergonômico",
    description: "Formato vertical para reduzir a tensão no punho.",
  },
  {
    name: "Jogo de Facas Chef 5 peças",
    description: "Aço inoxidável com cepo de madeira.",
  },
  {
    name: "Umidificador Ultrassônico 3L",
    description: "Silencioso, com névoa ajustável e desligamento automático.",
  },
  {
    name: "Bicicleta Ergométrica Compacta",
    description: "Oito níveis de carga e monitor de treino.",
  },
  {
    name: "Secador de Cabelo Íon 2100W",
    description: "Três temperaturas e jato frio.",
  },
  {
    name: "Carregador Portátil 20.000 mAh",
    description: "Carga rápida por USB-C para dois aparelhos ao mesmo tempo.",
  },
  { name: "Tapete de Yoga Antiderrapante 6mm" },
  {
    name: "Sanduicheira Grill Dupla",
    description: "Placas antiaderentes e abertura de 180 graus.",
  },
  {
    name: "Monitor 27 polegadas QHD",
    description: "Painel IPS, 75 Hz e ajuste de altura.",
  },
  {
    name: "Mala de Bordo Rígida 10kg",
    description: "Rodas 360 graus e cadeado com segredo.",
  },
  {
    name: "Fritadeira de Imersão Elétrica 3L",
    description: "Controle de temperatura e cesto com cabo frio.",
  },
];

const baseUrl = (process.env.SEED_BASE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);
const adminKey = process.env.ADMIN_API_KEY;

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  if (!adminKey) {
    console.error("Defina ADMIN_API_KEY no ambiente (ou no .env.local).");
    process.exit(1);
  }

  let created = 0;
  // Em sequência: cada produto ganha um created_at diferente, na ordem da lista.
  for (const product of products) {
    const slug = slugify(product.name);
    const response = await fetch(`${baseUrl}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        imageUrl: `https://picsum.photos/seed/prova-${slug}/1200/900`,
        externalLink: `https://example.com/produtos/${slug}`,
      }),
    });

    if (response.status === 201) {
      created += 1;
      console.log(`ok   ${product.name}`);
    } else {
      console.error(
        `erro ${response.status} ${product.name}: ${await response.text()}`,
      );
      if (response.status === 401) process.exit(1);
    }
  }

  console.log(
    `\n${created} de ${products.length} produtos cadastrados em ${baseUrl}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
