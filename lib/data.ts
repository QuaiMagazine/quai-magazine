export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  short: string;
  description: string;
  category: string;
}

export interface NavChild {
  id: string;
  label: string;
  href: string;
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  badge?: string;
  children?: NavChild[];
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    year: "2008",
    title: "Bitcoin Whitepaper",
    short: "Satoshi publishes the foundational paper",
    description:
      "On October 31, 2008, Satoshi Nakamoto published 'Bitcoin: A Peer-to-Peer Electronic Cash System' — a nine-page document that permanently altered finance, cryptography, and decentralized systems. The paper introduced trustless consensus via proof-of-work, solving the double-spend problem without any central authority.",
    category: "Foundation",
  },
  {
    id: "2",
    year: "2009",
    title: "Genesis Block",
    short: "Bitcoin's first block is mined",
    description:
      "On January 3, 2009, Satoshi mined the genesis block — embedding the Times headline 'Chancellor on brink of second bailout for banks' as a timestamp. The 50 BTC reward is unspendable by design. This moment birthed the blockchain era.",
    category: "Milestone",
  },
  {
    id: "3",
    year: "2013",
    title: "Ethereum Proposed",
    short: "Vitalik proposes programmable blockchain",
    description:
      "In late 2013, 19-year-old Vitalik Buterin circulated the Ethereum whitepaper, envisioning a Turing-complete programming language on blockchain. Developers could build decentralized applications and smart contracts — the birth of programmable money.",
    category: "Innovation",
  },
  {
    id: "4",
    year: "2015",
    title: "Ethereum Mainnet",
    short: "Smart contracts go live on Frontier",
    description:
      "Ethereum's Frontier release launched July 30, 2015. The platform attracted global builders, leading to ICO mania, DeFi, NFTs, and the entire Web3 ecosystem. Solidity became the dominant smart contract language.",
    category: "Launch",
  },
  {
    id: "5",
    year: "2020",
    title: "DeFi Summer",
    short: "Billions flow into decentralized finance",
    description:
      "2020 saw an unprecedented explosion of DeFi activity. Compound, Uniswap, Aave, and Yearn attracted billions via yield farming. TVL grew from under $1B to over $10B in months, introducing financial primitives without banks.",
    category: "Ecosystem",
  },
  {
    id: "6",
    year: "2022",
    title: "The Merge",
    short: "Ethereum transitions to Proof-of-Stake",
    description:
      "On September 15, 2022, Ethereum executed 'The Merge' — moving from PoW to PoS. Energy consumption dropped ~99.95%. It was one of the most complex coordinated upgrades in blockchain history, setting the stage for future scalability.",
    category: "Upgrade",
  },
  {
    id: "7",
    year: "2023",
    title: "Quai Testnet",
    short: "Iron Age Testnet goes public",
    description:
      "The Quai Network Iron Age Testnet launched publicly in 2023, introducing multi-threaded blockchain architecture based on merged-mining across 13 interconnected chains simultaneously — demonstrating massive horizontal scaling without sacrificing decentralization.",
    category: "Quai",
  },
  {
    id: "8",
    year: "2024",
    title: "Quai Mainnet",
    short: "Decentralized money beyond Bitcoin",
    description:
      "Quai Network's mainnet alpha launched, bringing the world's first multi-threaded proof-of-work blockchain to production. With programmable Layer-1 chains and Qi token tied to energy costs, this represents the most significant PoW evolution since Bitcoin.",
    category: "Quai",
  },
  {
    id: "9",
    year: "2025",
    title: "Ecosystem Growth",
    short: "Bridges, dApps, and institutional adoption",
    description:
      "The Quai ecosystem expanded with cross-chain bridges connecting to major networks, native DEXs on zone chains, and growing institutional interest. The network's energy efficiency and massive throughput positioned it as a leading Web3 alternative.",
    category: "Quai",
  },
];

export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  {
    id: "about",
    label: "About",
    children: [
      { id: "magazine", label: "Quai Magazine", href: "/about?tab=magazine" },
      { id: "network", label: "Quai Network", href: "/about?tab=network" },
    ],
  },
  { id: "timeline", label: "Timeline", href: "/timeline" },
  {
    id: "transcript",
    label: "Quai Network AMA Archive",
    badge: "AMA",
    href: "/transcript",
  },
  {
    id: "articles",
    label: "Articles",
    children: [
      {
        id: "articles-internal",
        label: "Internal",
        href: "/articles?tab=internal",
      },
      {
        id: "articles-external",
        label: "External",
        href: "/articles?tab=external",
      },
    ],
  },
  {
    id: "media",
    label: "Media",
    children: [
      { id: "media-audio", label: "Audio", href: "/media?tab=audio" },
      { id: "media-video", label: "Video", href: "/media?tab=video" },
      { id: "media-external", label: "External", href: "/media?tab=external" },
    ],
  },
  { id: "community", label: "Community Contribution", href: "/community" },
];

export const rawTranscript = `[QUAI NETWORK AMA SESSION — NOVEMBER 14, 2024]
[00:00:00] SESSION START

[00:00:12] [HOST]: Welcome everyone to the Quai Network AMA. Today we have core team members joining from San Francisco. Let's get started.

[00:00:45] [ALAN ORWICK]: Thanks for having us. Really excited to talk about what we've been building.

[00:02:14] [HOST]: Let's start with the basics. What makes Quai different from every other blockchain?

[00:02:28] [ALAN ORWICK]: The fundamental insight is that most blockchains trade scalability for security or decentralization. We refuse to make that trade. By using merged mining across a hierarchy of chains, we get horizontal scaling without sacrificing either.

[00:05:48] [HOST]: Can you explain merged mining for non-technical people?

[00:06:02] [ALAN ORWICK]: Sure. Imagine you're a miner. Instead of mining one chain, you're mining 13 chains at the same time with the same computation. Each chain gets the full security of all that hash power, but each chain can also process its own transactions independently. So you get massive throughput.

[00:11:22] [HOST]: And Qi? Tell us about that.

[00:11:35] [ALAN ORWICK]: Qi is our second token. Unlike QUAI which is governance, Qi is actually pegged to the difficulty of mining — to energy cost. So as energy costs change, Qi adjusts. It's the first truly hash-denominated currency. Satoshi talked about this kind of thing but never implemented it.

[00:18:09] [K. MCCAFFREY]: What Alan didn't mention is the elegance of it — the supply curve for Qi is completely algorithmic. There's no committee, no vote, no Fed. Just math and energy.

[00:24:05] [HOST]: What does the roadmap look like for 2025?

[00:24:18] [K. MCCAFFREY]: Three things: ecosystem tooling, cross-chain bridges to Ethereum and Bitcoin, and the Qi liquidity markets. We expect significant institutional interest in H2 as the energy-based tokenomics model gets more attention.

[00:34:20] [HOST]: That's all the time we have. Thank you Alan, thank you K. This has been the Quai Network AMA.

[00:34:45] SESSION END`;

export const qaData = [
  {
    q: "What makes Quai different from every other blockchain?",
    a: "Most blockchains trade scalability for security or decentralization. Quai refuses to make that trade. By using merged mining across a hierarchy of 13 chains, we get horizontal scaling without sacrificing either security or decentralization.",
    speaker: "Alan Orwick",
    ts: "00:02:14",
  },
  {
    q: "Can you explain merged mining for non-technical people?",
    a: "Imagine you're a miner — instead of mining one chain, you're mining 13 chains simultaneously with the same computation. Each chain gets full security of all that hash power, while processing its own transactions independently. Massive throughput at no security cost.",
    speaker: "Alan Orwick",
    ts: "00:05:48",
  },
  {
    q: "What is Qi and how does it relate to Bitcoin?",
    a: "Qi is our hash-denominated currency — the second token in the Quai ecosystem. Unlike QUAI which handles governance, Qi is pegged to mining difficulty and energy cost. Satoshi described this concept but never implemented it. We did.",
    speaker: "Alan Orwick",
    ts: "00:11:22",
  },
  {
    q: "What does the roadmap look like for 2025?",
    a: "We're focused on three things: ecosystem tooling, cross-chain bridges to Ethereum and Bitcoin, and the Qi liquidity markets. Significant institutional interest is expected in H2 as the energy-based tokenomics model gains attention.",
    speaker: "K. McCaffrey",
    ts: "00:24:05",
  },
  {
    q: "How does Quai handle transaction finality across chains?",
    a: "Transaction finality on Quai is hierarchical. Zone chains finalize quickly with zone-level confirmations in roughly 1–3 seconds. Cross-chain transactions require region or prime block confirmation for full settlement. This gives developers flexibility to choose finality level based on transaction value and security requirements.",
    speaker: "Alan Orwick",
    ts: "00:14:32",
  },
  {
    q: "What programming languages does Quai support for smart contracts?",
    a: "Quai is fully EVM-compatible, so Solidity and Vyper work out of the box. If you can build on Ethereum, you can deploy on Quai zone chains with minimal changes. We're also building a native Quai SDK that provides better multi-chain abstractions for dApps that span multiple zone chains simultaneously.",
    speaker: "K. McCaffrey",
    ts: "00:16:45",
  },
  {
    q: "How does the energy peg for Qi work in practice?",
    a: "Qi's supply algorithm observes the mining difficulty adjustment every block and adjusts supply to maintain a stable relationship to energy cost. When mining becomes more efficient, Qi supply contracts. When difficulty rises, it expands. The entire process is autonomous — no oracle, no governance vote, no committee. Just math and thermodynamics.",
    speaker: "Alan Orwick",
    ts: "00:19:53",
  },
  {
    q: "Are there validators in the Quai Network?",
    a: "There are no validators — that's the entire point. Quai is pure proof-of-work. Anyone with a GPU or ASIC can mine. There's no stake threshold, no KYC, no application process. The validator set is simply anyone with hash power, making it infinitely open and permissionless by design.",
    speaker: "Alan Orwick",
    ts: "00:21:10",
  },
  {
    q: "How are cross-chain bridges to Ethereum implemented?",
    a: "Cross-chain within Quai is native to the protocol — the hierarchical chain structure handles internal transfers. For external bridges to Ethereum or Bitcoin, we're using a combination of threshold signatures and zone-chain escrow contracts. The goal is fully trustless bridging without wrapped assets or centralized custodians.",
    speaker: "K. McCaffrey",
    ts: "00:26:38",
  },
  {
    q: "What is the block time on Quai zone chains?",
    a: "Zone chains target roughly 1–3 second block times under normal load. The difficulty adjustment algorithm is far more aggressive than Bitcoin's — it adjusts every block rather than every 2016 blocks, giving much faster response to hash rate changes and maintaining consistent throughput.",
    speaker: "Alan Orwick",
    ts: "00:29:15",
  },
  {
    q: "What happened during the Iron Age Testnet?",
    a: "Iron Age was a massive validation exercise. We had thousands of nodes online, real hash power from mining pools, and sustained TPS stress tests running for weeks. It validated the merged mining architecture at scale and uncovered latency issues in zone-to-region propagation that we've since optimized significantly.",
    speaker: "Alan Orwick",
    ts: "00:33:05",
  },
  {
    q: "How does Quai plan to attract developers from the Ethereum ecosystem?",
    a: "We're not positioning this as 'move away from Ethereum' — it's complementary. Most Ethereum dApps can deploy on Quai zone chains with minimal code changes. The pull is throughput and cost efficiency. When you can process 50x more transactions for a fraction of the fee, economics do the convincing for us.",
    speaker: "K. McCaffrey",
    ts: "00:31:40",
  },
];

export const transcriptSummaries = [
  {
    title: "Core Architecture",
    text: "Quai Network solves the blockchain trilemma via merged mining across 13 hierarchical chains, achieving horizontal scaling without sacrificing security or decentralization. The Prime, Region, and Zone chain hierarchy allows parallel processing with native cross-chain settlement.",
    ts: "00:02:14 – 00:10:52",
  },
  {
    title: "Dual Token Model",
    text: "QUAI serves as governance; QI is a hash-denominated currency pegged to mining difficulty and energy cost — the first programmable proof-of-work unit of account. The supply is completely algorithmic with no governance intervention required.",
    ts: "00:11:22 – 00:21:38",
  },
  {
    title: "Transaction Finality Model",
    text: "Quai uses a hierarchical finality model where zone chain confirmations are fast (1–3 seconds) but cross-chain finality escalates through region to prime blocks. This allows developers to tune security versus speed tradeoffs based on transaction value.",
    ts: "00:14:32 – 00:18:20",
  },
  {
    title: "Developer Ecosystem",
    text: "Full EVM compatibility means Solidity and Vyper developers can deploy on Quai with minimal changes. Native SDK tooling is in active development to expose multi-chain abstractions and enable dApps that span multiple zone chains natively without manual bridging.",
    ts: "00:16:45 – 00:22:50",
  },
  {
    title: "2025 Priorities",
    text: "The team focuses on three pillars: ecosystem tooling for developers, cross-chain bridges to Bitcoin and Ethereum, and Qi liquidity markets targeting institutional adoption. Significant institutional interest is expected in H2 2025.",
    ts: "00:24:05 – 00:34:20",
  },
  {
    title: "External Bridge Architecture",
    text: "Quai-to-Quai chain transfers are native to the protocol. External bridges to Ethereum and Bitcoin use threshold signatures with zone-chain escrow contracts, targeting fully trustless cross-ecosystem bridging without wrapped tokens.",
    ts: "00:26:38 – 00:30:10",
  },
  {
    title: "Iron Age Testnet Results",
    text: "The public Iron Age Testnet validated merged mining at scale with thousands of nodes and real mining pool participation. Key learnings from sustained stress tests significantly improved zone-to-region propagation latency, making the mainnet considerably more efficient.",
    ts: "00:33:05 – 00:34:20",
  },
];

export const internalArticles = [
  {
    id: "protocol-upgrade-v14",
    title: "Quai Protocol Upgrade v1.4: What Changed and Why",
    date: "Dec 18, 2024",
    category: "Protocol",
    read: "10 min",
    featured: true,
    body: `Version 1.4 represents the most significant protocol-layer change since Quai's testnet launch. The upgrade targets three areas: block propagation latency, merged-mining coordination efficiency, and Prime chain finality guarantees. Each was identified through six months of on-chain telemetry collected across the Iron Age testnet.

Block propagation previously required a full header broadcast from Zone to Region before Regions acknowledged the new tip. Under v1.4, Zones optimistically extend their tip and emit a compact "tip hint" to adjacent regions. Regions validate only the proof-of-work commitment before relaying upward. Full header reconciliation still happens, but off the critical path. In bench tests this cut median cross-zone propagation from 380 ms to 140 ms.

Merged-mining coordination changes address the case where a miner's solution satisfies multiple chain difficulties simultaneously. Prior to v1.4, nodes accepted the highest-difficulty chain result and discarded the rest. The upgrade adds a multi-claim window: within 2 seconds of a solution, a miner can submit difficulty proofs for every chain the solution satisfies. Network modeling suggests this increases total miner revenue by 8–14% under typical hash-rate conditions, without any change to each chain's target block time.

Finality on the Prime chain now requires three consecutive Prime blocks that each reference the same Region tip set. Previously, a single Prime confirmation was considered sufficient for cross-chain settlement. The stricter rule adds roughly 4 minutes to cross-chain finality under normal conditions, but eliminates a class of reorg vectors that academic reviewers flagged in the 1.3 audit. Economic contracts and bridge relays should migrate to the new finality signal by Q1 2025.`,
  },
  {
    id: "dapp-developer-guide",
    title: "Building Your First dApp on Quai: A Developer's Guide",
    date: "Dec 5, 2024",
    category: "Dev Guide",
    read: "15 min",
    body: `Quai's multi-shard architecture introduces concepts that don't exist on single-chain EVMs, but the programming model is deliberately close to what Ethereum developers already know. This guide walks through scaffolding a simple token contract, deploying it to a Zone chain, and building a frontend that can track balances across multiple zones.

Start with the Quai SDK: \`npm install @quai/sdk quais\`. The \`quais\` package is a Quai-aware fork of ethers.js that understands the multi-chain address space. Every Quai address encodes the zone it belongs to in its prefix bytes, so the SDK can automatically route transactions to the correct RPC endpoint without developer intervention.

Contract deployment follows the same pattern as Hardhat on Ethereum. Add the Quai plugin (\`@quai/hardhat-plugin\`) to your config, specify a \`zone\` target (e.g., \`"cyprus-1"\`), and run \`npx hardhat deploy --network quai-testnet\`. The plugin handles nonce management across the zone's shard and returns a canonical address scoped to that zone.

For cross-zone reads, use the \`CrossZoneProvider\` helper. It accepts an array of zone identifiers and automatically fans out \`eth_call\` requests in parallel. Response aggregation is handled for you — you get back a map of zone → result. Cross-zone writes are more complex and require understanding Quai's External Transaction (ETX) format, which is covered in the advanced guide. For most dApps, keeping state within a single zone is the right starting architecture.`,
  },
  {
    id: "qi-halving-model",
    title: "The Qi Halving Model: How Supply Meets Energy Reality",
    date: "Nov 22, 2024",
    category: "Tokenomics",
    read: "8 min",
    body: `Qi is not a fixed-supply token. Its issuance rate adjusts continuously based on network-wide mining difficulty — a design that ties Qi's monetary policy directly to the cost of energy, rather than to an arbitrary time schedule.

The mechanism works as follows: each Zone chain maintains an exponentially weighted moving average of the past 8,640 block difficulties (roughly one week). When difficulty rises — meaning more hash power is competing — the Qi emission per block increases proportionally, up to a protocol-defined ceiling. When difficulty falls, emission decreases. The result is that the total Qi in circulation tracks global energy expenditure on the network, not the passage of calendar time.

This contrasts sharply with Bitcoin's halvings, which cut issuance on a fixed four-year cadence regardless of mining economics. Bitcoin halvings create predictable supply shocks, but they also create predictable miner revenue cliffs. Quai's model smooths revenue: as Qi price rises relative to energy costs, new miners enter, difficulty increases, and emission expands — absorbing the additional hash power without a discrete shock. As miners exit, the reverse happens. The equilibrium state is a Qi price that closely tracks the marginal cost of producing one unit.

Critics note this creates inflation during mining booms. The counter-argument embedded in the protocol is that Qi issued during a mining boom represents real economic work — the network genuinely processed more transactions, secured more value, and consumed more energy. Inflation in this context is backed by physical expenditure, not monetary expansion from central authority.`,
  },
  {
    id: "zone-chain-performance-q4",
    title: "Zone Chain Performance Report: Q4 2024",
    date: "Nov 10, 2024",
    category: "Research",
    read: "12 min",
    body: `The Q4 2024 performance report covers October through December across all nine Zone chains active on the Iron Age testnet. Aggregate throughput, latency distribution, reorg rates, and miner participation are the four primary metrics tracked.

Aggregate throughput reached a sustained peak of 41,200 TPS across all zone chains on November 3rd during the stress test event. Under normal conditions, throughput averaged 8,400 TPS, well within the protocol's design envelope. Block times across all zones held within ±6% of the 10-second target, a significant improvement over Q3's ±14% variance. The improvement is attributed to the propagation changes shipped in v1.3.2.

Reorg rates tell a more nuanced story. Zone-level reorgs (depth ≤ 2 blocks) occurred at 0.4% of blocks — expected and acceptable. Cross-zone reorgs that required Region coordination happened in 0.03% of blocks. No Prime-level reorgs were observed. The one incident of note was a 4-block Zone reorg on Cyprus-3 on October 19th, traced to a BGP routing issue between two mining pools that temporarily isolated their nodes from the rest of the network.

Miner participation grew from 312 unique mining addresses in Q3 to 847 in Q4. Geographic distribution broadened: North America accounted for 38% of hash rate in Q4 versus 61% in Q3. Europe and Southeast Asia each grew by roughly 10 percentage points. Concentration risk — measured as the Herfindahl index of hash rate — fell from 0.18 to 0.09, indicating meaningfully more competitive mining conditions entering 2025.`,
  },
  {
    id: "governance-proposal-zone",
    title: "Community Governance Proposal: Zone Incentive Rebalancing",
    date: "Oct 28, 2024",
    category: "Governance",
    read: "6 min",
    body: `This proposal, submitted by community member 0x4f2a…c891, requests a rebalancing of the block reward split between Zone, Region, and Prime miners. The current split allocates 70% to Zone miners, 20% to Region coordinators, and 10% to Prime. The proposal suggests 75 / 17 / 8.

The motivation is empirical: Zone chains produce 90% of user-facing transactions and carry the majority of fee revenue. Region and Prime blocks are infrequent and their miners already benefit disproportionately from the merged-mining relationship — they receive rewards from multiple Zone chains simultaneously. Rebalancing toward Zone miners would improve the economics for the participants doing the most transaction-processing work.

Opposition centers on the security model. Region and Prime miners provide the hierarchical coordination that makes Quai's cross-chain settlement trustworthy. Reducing their nominal reward percentage may cause some to redirect hash to pure Zone mining, weakening the upper layers of the hierarchy. The counter-argument is that merged-mining keeps Region and Prime participation economically attractive regardless of the split, because their hash power earns across all subordinate chains.

The proposal is currently in the comment period, which closes November 15th. If it clears the comment period without a veto from the core team (reserved for protocol-safety issues only), it will move to an on-chain vote among QUAI holders. Implementation, if approved, would target the v1.5 upgrade window in Q1 2025.`,
  },
];

export const externalArticles = [
  {
    id: "pow-case-2025",
    title: "The Case for Proof-of-Work in 2025",
    source: "CoinDesk",
    date: "Dec 14, 2024",
    category: "Opinion",
    read: "7 min",
    body: `In the years since Ethereum's Merge, the crypto industry has broadly concluded that proof-of-stake is the future. The environmental argument proved decisive in public discourse, and capital followed. Yet a quieter set of engineers and economists have been building the counter-case: that proof-of-work's energy expenditure is not a bug, but the only known mechanism for producing objective, physically-anchored consensus.

The argument, in its strongest form, goes like this: any consensus that can be overturned by an economic majority — of validators, of stake — is ultimately secured by social agreement about who holds legitimate authority. Proof-of-stake systems require you to trust that the validator set is correctly constituted and uncorrupted. That trust assumption is less visible than it was under delegated-proof-of-stake, but it has not disappeared. Proof-of-work replaces the social assumption with a physical one: producing a valid block costs real energy, and no social consensus can conjure energy from nothing.

Projects like Quai Network are attempting to carry proof-of-work forward while addressing its historically acknowledged weakness — throughput. If they succeed, the narrative around consensus mechanism may be more contested in 2026 than it appears today.`,
  },
  {
    id: "quai-trilemma",
    title: "Quai Network: Can It Actually Solve the Trilemma?",
    source: "The Block",
    date: "Dec 2, 2024",
    category: "Analysis",
    read: "11 min",
    body: `The blockchain trilemma — the claim that no network can simultaneously achieve decentralization, security, and scalability — has defined design trade-offs for a decade. Quai Network's answer is hierarchical sharding with merged proof-of-work, a combination it argues escapes the trilemma's constraints by adding horizontal capacity without sacrificing the other two properties.

The architecture consists of 13 chains: one Prime, three Regions, and nine Zones. Each Zone processes transactions independently. Security is shared downward: a miner solving a Prime block simultaneously contributes valid work to all subordinate chains. This merged-mining relationship means there is no "thin chain" security problem — every Zone chain benefits from the full network hash rate, appropriately weighted by difficulty.

The skeptical read is that cross-zone latency reintroduces coordination costs that other sharding schemes have struggled to manage. Quai's cross-chain settlement requires waiting for Region and Prime confirmations, which can take several minutes for high-value transactions. That latency is acceptable for settlement, but it creates UX friction for applications that need real-time cross-shard composability. The technical team acknowledges this and points to an asynchronous composability model as the long-term solution. Whether that model reaches the sophistication of Ethereum's synchronous EVM is the open question.`,
  },
  {
    id: "hash-denominated-currencies",
    title: "Hash-Denominated Currencies: A New Frontier",
    source: "Decrypt",
    date: "Nov 19, 2024",
    category: "Research",
    read: "9 min",
    body: `Most digital assets derive their unit of account from market price discovery — they are worth what buyers will pay. Qi, the secondary token of Quai Network, is designed differently: its supply expands and contracts based on the mining difficulty of the underlying proof-of-work network, anchoring its value to the cost of hash computation rather than speculative demand.

The concept has antecedents in commodity money. Gold's value historically tracked the marginal cost of extraction. Hash-denominated currency applies the same logic to computation: one unit of Qi represents a stable claim on a defined quantity of hash work. As energy prices and hardware efficiency shift the real cost of producing a hash, the token's supply adjusts to maintain that peg.

In practice, the peg is soft, not hard. Qi cannot be redeemed for hash computation in the way a gold certificate once could be redeemed for metal. The mechanism is algorithmic: the network monitors difficulty and adjusts block emission accordingly. Whether markets will price Qi closer to its difficulty-anchored fair value or to speculative premium remains an empirical question that mainnet launch will begin to answer.`,
  },
  {
    id: "blockchain-throughput-wars",
    title: "Blockchain Throughput Wars: Who Wins in 2025?",
    source: "Unchained",
    date: "Nov 7, 2024",
    category: "Market",
    read: "13 min",
    body: `Every bull cycle produces a new round of throughput claims: higher TPS numbers, shorter finality times, lower fees. 2025 appears to be shaping up as a particularly contested moment. Solana has stabilized after its outage reputation. Ethereum's L2 ecosystem has matured. And several newer chains — Monad, MegaETH, and Quai among them — are entering mainnet with architectures designed specifically around the throughput constraint.

The honest framing is that raw TPS numbers are marketing, not engineering. What matters is sustained throughput under adversarial conditions, fee predictability during congestion, and the trust model under which those numbers are achieved. A chain that hits 100,000 TPS by centralizing block production is not the same product as one that hits 10,000 TPS with globally distributed validators.

Quai's claim of 50,000+ TPS is conditional on all nine Zone chains running at capacity simultaneously, with merged-mining coordination overhead excluded from the measurement. That is a reasonable way to benchmark peak capacity, but it is different from the sustained, single-application throughput a developer should plan around. Independent benchmarks from Q4 testnet suggest consistent 8,000–12,000 TPS across the active zone set, which is competitive with the current Ethereum L2 landscape while maintaining a layer-1 security model.`,
  },
];

export const aboutArticles = [
  {
    id: "energy-thesis-pow",
    title: "The Energy Thesis Behind Proof-of-Work",
    date: "Dec 12, 2024",
    category: "Analysis",
    read: "8 min",
    body: `Energy expenditure is the only known mechanism for producing consensus that requires no prior social agreement. Every other consensus model — proof-of-stake, delegated authority, trusted third parties — ultimately rests on social agreement about who has legitimate power. Proof-of-work replaces that agreement with a physical constraint: producing a valid block costs real energy, and energy cannot be conjured from social consensus alone.

This is not merely a technical observation. It has implications for monetary policy. If a token's issuance is tied to the cost of energy — as Qi's is, through its difficulty-adjusted emission model — then its supply is anchored to a real-world constraint. Monetary expansion requires real expenditure. Contraction follows naturally as mining becomes uneconomic. The result is a currency whose supply curve is governed by thermodynamics rather than committee decision.

Critics of proof-of-work focus on the energy consumption itself, arguing it is wasteful if the only output is a ledger entry. The counter-argument is that security is the output. Every joule expended on mining is a joule that a would-be attacker must also expend to rewrite history. The energy is not wasted — it is converted into immutability. Whether that trade-off is worth making is ultimately a question about what kind of guarantees you want from a monetary system.

Quai Network's bet is that as global energy grids shift toward renewables, the objection to proof-of-work's energy use weakens while its security properties remain intact. A mining network that runs predominantly on stranded renewable energy — hydroelectric surplus, curtailed wind — imposes a near-zero carbon cost while still providing the physical security anchor that no stake-weighted system can replicate.`,
  },
  {
    id: "multi-shard-architecture",
    title: "Understanding the Quai Multi-Shard Architecture",
    date: "Nov 28, 2024",
    category: "Technical",
    read: "12 min",
    body: `Quai's architecture consists of thirteen simultaneously running blockchains organized in a three-level hierarchy: one Prime chain, three Region chains (Cyprus, Paxos, Hydra), and nine Zone chains (three per Region). Each level has distinct responsibilities. Zone chains process user transactions. Region chains coordinate cross-zone communication and provide an intermediate finality layer. Prime provides global finality and coordinates the entire network.

The key innovation is merged mining across all thirteen chains simultaneously. A miner submits a single block header that contains proof-of-work commitments valid for every chain whose difficulty threshold the solution satisfies. A very lucky hash might satisfy all thirteen simultaneously; a typical hash satisfies one or two. This means every Zone chain benefits from the full network hash rate — there is no "thin chain" attack surface where a minority of hash power secures any single chain.

Cross-zone transactions work through a mechanism called External Transactions (ETXs). When a contract on Cyprus-1 wants to send tokens to an address on Paxos-1, it emits an ETX. That ETX is included in a Region block, propagated to the destination Zone, and there converted into a standard internal transaction. The latency for this process depends on how quickly Region and Prime blocks confirm — typically 30 seconds to a few minutes for full cross-zone settlement.

For most application developers, the multi-shard architecture is mostly invisible. Smart contracts deployed on a single Zone behave identically to Ethereum contracts. The multi-chain surface area is only relevant when building applications that need to span zones — for example, a cross-zone DEX or a bridge. The SDK handles routing automatically; developers declare which zones their application touches and the tooling manages the rest.`,
  },
  {
    id: "qi-token-hash-denominated",
    title: "Qi Token: The First Hash-Denominated Currency",
    date: "Nov 14, 2024",
    category: "Economics",
    read: "6 min",
    body: `Qi is Quai Network's secondary token, and its supply mechanism is unlike any previous cryptocurrency. Where Bitcoin halves its issuance on a fixed schedule and Ethereum adjusts fees through EIP-1559 burns, Qi's emission rate tracks the network's mining difficulty in real time. When difficulty rises, more Qi is issued per block. When difficulty falls, less is issued. The goal is a token whose purchasing power in terms of hash computation remains stable over time.

This creates a natural peg to energy cost. The marginal cost of mining one block — and thus earning one unit of Qi — equals the electricity cost of producing the block's required hash rate. If Qi's price falls below that cost, rational miners reduce participation, difficulty drops, and emission decreases. If Qi's price rises above mining cost, new miners enter, difficulty increases, and emission expands. The equilibrium is a Qi price that tracks the energy cost of computation.

The practical implications for users are significant. Qi is intended as a medium of exchange, not a speculative asset. Its value should be more predictable than QUAI, the governance token, whose price is driven by protocol expectations and speculation. Merchants and smart contracts that need a stable unit of account can denominate in Qi without relying on an external oracle or an overcollateralized stablecoin mechanism.`,
  },
  {
    id: "decentralization-2025",
    title: "Why Decentralization Still Matters in 2025",
    date: "Oct 30, 2024",
    category: "Opinion",
    read: "5 min",
    body: `The word "decentralization" has been so thoroughly co-opted by marketing copy that it has lost much of its meaning. Projects with seventeen validators call themselves decentralized. Chains where three entities control 60% of stake call themselves permissionless. The term needs rehabilitation — and the clearest way to rehabilitate it is to ask what decentralization is actually for.

Decentralization exists to make censorship and confiscation expensive. A network controlled by a single entity can be compelled by legal, political, or economic pressure to censor transactions, freeze accounts, or reverse history. A network controlled by thousands of independent participants across dozens of jurisdictions cannot be so compelled without coordinating against all of them simultaneously — which becomes progressively harder as participation grows and diversifies geographically.

By this functional definition, proof-of-work networks with geographically distributed mining remain the most genuinely decentralized systems in production. The capital cost of acquiring majority hash rate is orders of magnitude higher than acquiring majority stake in most PoS networks. That cost is what provides censorship resistance. Quai's 2025 goal is not just to scale throughput, but to ensure that as the network grows, geographic and economic diversity of miners grows with it — preserving the property that actually matters.`,
  },
  {
    id: "developer-ecosystem-review",
    title: "Quai Developer Ecosystem: Year in Review",
    date: "Oct 15, 2024",
    category: "Community",
    read: "9 min",
    body: `2024 was the year Quai's developer tooling went from proof-of-concept to production-ready. The Pelagus wallet shipped its first stable release. The quais.js SDK reached feature parity with ethers.js for single-zone development and added its first cross-zone primitives. Hardhat and Foundry plugins reached v1.0. Twelve external teams shipped projects on Iron Age testnet, up from two in 2023.

The hackathon program produced notable results. The Q2 BuildQuai event attracted 340 registrants and 47 completed submissions. Top projects included a cross-zone NFT marketplace, a multi-shard yield optimizer, and a decentralized DNS that leverages Quai's hierarchical address space for human-readable names scoped to individual zone chains. Prize pool disbursements totaled $180,000 in QUAI and USDC.

Documentation quality improved significantly. The developer portal, launched in March, aggregates SDK references, architecture guides, and tutorial content in one place. Monthly active visitors reached 28,000 by Q4, up from 3,200 at launch. GitHub activity on the core SDK repositories shows 140 external contributors merged PRs in 2024, versus 11 in 2023 — a 12× increase. The ratio of community PRs to core-team PRs reached 0.6 in Q4, a meaningful indicator of ecosystem maturity.

Looking into 2025, the highest priority is the MetaMask Snap integration, which will allow developers to reach existing MetaMask users without requiring wallet migration. A grant program for protocol-layer tooling — indexers, analytics, RPC infrastructure — is planned for Q1. The goal is a developer experience that requires no prior knowledge of Quai's multi-chain architecture to build a first application.`,
  },
  {
    id: "cross-chain-ux",
    title: "Cross-Chain UX: The Invisible Bridge Problem",
    date: "Sep 28, 2024",
    category: "UX Research",
    read: "7 min",
    body: `Cross-chain UX is one of the most consistently underestimated problems in blockchain development. On paper, bridges and cross-chain messaging protocols solve the technical problem of moving assets between networks. In practice, they introduce a new class of user-facing complexity: the need to understand which network you're on, whether your assets are "native" or "wrapped," which bridge to trust, and what the latency profile of a cross-chain transaction is.

The cognitive load is significant even for experienced users. Studies of crypto wallet session recordings show that users abandon bridge transactions at a rate 3× higher than single-chain swaps. The primary failure modes are: selecting the wrong destination network, not holding the native gas token on the destination chain, and failing to wait for cross-chain confirmation before attempting to use the bridged asset.

Quai's architecture attempts to make cross-zone operations invisible rather than explicit. Because all zone chains are part of the same protocol, there is no "bridge" in the traditional sense — cross-zone transfers are native transactions, not third-party relay operations. The wallet handles zone routing automatically based on the destination address prefix. Users see a single "send" flow regardless of whether the recipient is on the same zone or a different one. Latency differences are communicated through a progress indicator rather than a separate bridging UI. The goal is to make "which chain am I on?" a question users never have to ask.`,
  },
];

export const networkStats = [
  {
    icon: "⬡",
    label: "Multi-Threaded PoW",
    value: "13 Chains",
    desc: "Prime, Region, and Zone chains processing transactions in parallel across a hierarchical network.",
  },
  {
    icon: "⚡",
    label: "Peak Throughput",
    value: "50,000+ TPS",
    desc: "Horizontal scaling via merged mining allows near-unlimited capacity without compromising security.",
  },
  {
    icon: "🔒",
    label: "Consensus",
    value: "Proof-of-Work",
    desc: "True Nakamoto consensus — no validators, no stake, no delegated authority. Pure hash-based truth.",
  },
  {
    icon: "💱",
    label: "Native Tokens",
    value: "QUAI + QI",
    desc: "QUAI is the governance token; QI is the hash-denominated unit of account tied to energy cost.",
  },
];

export interface RawTurn {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
}

export function parseRawTranscript(text: string): RawTurn[] {
  const turns: RawTurn[] = [];
  let current: { timestamp: string; speaker: string; text: string } | null = null;
  let counter = 0;
  for (const line of text.split("\n")) {
    const m = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s+\[([^\]]+)\]:\s+(.+)$/);
    if (m) {
      if (current) turns.push({ id: `r${counter++}`, ...current });
      current = { timestamp: m[1], speaker: m[2], text: m[3] };
    } else if (line.trim() && current && !line.match(/^\[/)) {
      current.text += " " + line.trim();
    }
  }
  if (current) turns.push({ id: `r${counter}`, ...current });
  return turns;
}

export interface RawSession {
  id: string;
  episodeNumber: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  participants: string[];
  description: string;
  image: string;
  youtubeUrl: string;
  spotifyUrl: string;
  tags: { label: string; transcriptTerm: string }[];
  rawText: string;
}

export const rawSessions: RawSession[] = [
  {
    id: "ama-nov-2024",
    episodeNumber: "Episode 01",
    title: "Tech AMA with Dr. K: Monero 51% Attack",
    date: "August 13, 2025",
    time: "Tech AMA · X Space",
    duration: "~68 min",
    participants: ["Matt", "Dr. K", "Jonathan"],
    description: "Dr. K explains Qubic's sub-51% liveness and reorg behavior on Monero, why Workshares change the attack economics, and what this means for Proof-of-Work security.",
    image: "/assets/tech-ama-monero-51-attack.png",
    youtubeUrl: "https://www.youtube.com/@QuaiNetwork",
    spotifyUrl: "https://open.spotify.com/",
    tags: [
      { label: "Quai Network", transcriptTerm: "Quai" },
      { label: "Monero", transcriptTerm: "Monero" },
      { label: "WorkShares", transcriptTerm: "work shares" },
      { label: "PoW", transcriptTerm: "proof of work" },
      { label: "Mining Security", transcriptTerm: "liveness attack" },
      { label: "Blockchain Reorg", transcriptTerm: "reorg" },
      { label: "Smart Contracts", transcriptTerm: "smart contracts" },
      { label: "MiCA", transcriptTerm: "Micah" },
    ],
    rawText: rawTranscript,
  },
  {
    id: "dev-call-oct-2024",
    episodeNumber: "Episode 23",
    title: "Developer Office Hours",
    date: "October 8, 2024",
    time: "5:30 PM UTC",
    duration: "48:30",
    participants: ["Host", "Alan Orwick", "Jake Malone"],
    description: "Deep-dive session on EVM compatibility, SDK tooling, zone-chain deployment workflows, and live Q&A from community builders.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85",
    youtubeUrl: "https://www.youtube.com/@QuaiNetwork",
    spotifyUrl: "https://open.spotify.com/",
    tags: [
      { label: "EVM", transcriptTerm: "EVM compatibility" },
      { label: "SDK", transcriptTerm: "SDK look like" },
      { label: "Latency", transcriptTerm: "latency differences" },
      { label: "Wallets", transcriptTerm: "Wallet integration" },
    ],
    rawText: `[QUAI DEVELOPER OFFICE HOURS — OCTOBER 8, 2024]
[00:00:00] SESSION START

[00:00:18] [HOST]: Welcome to the October developer office hours. We have Alan and Jake from the engineering team today.

[00:00:34] [ALAN ORWICK]: Good to be here. October has been a big month — lots of tooling updates shipped.

[00:01:45] [HOST]: Let's start with EVM compatibility. How complete is it?

[00:02:01] [JAKE MALONE]: Fully compatible at the opcode level. If your contract compiles on Ethereum, it compiles on Quai. We've tested Uniswap V2, Compound, Aave — all deploy cleanly. The only delta is the multi-chain address space.

[00:08:32] [HOST]: What does the SDK look like for multi-chain apps?

[00:08:48] [ALAN ORWICK]: We ship pelagus-provider which wraps ethers.js and handles cross-chain awareness. You declare which zone chains your dApp touches, and the SDK routes transactions and reads to the right shard automatically.

[00:14:10] [HOST]: Any latency differences between zone and region calls?

[00:14:24] [JAKE MALONE]: Zone reads are sub-10ms. Cross-zone reads go through region and add 40-80ms depending on network conditions. Prime calls are slower — you use those for finality checks, not hot-path reads.

[00:22:55] [HOST]: What's the hardest part of porting Ethereum projects?

[00:23:11] [ALAN ORWICK]: Wallet integration. MetaMask doesn't natively support Quai's multi-shard address scheme. Teams have to integrate Pelagus wallet or use our wallet connector. We're working on a MetaMask snap for Q1 next year.

[00:34:40] [HOST]: Thanks for the deep-dive. This has been incredibly useful for the community.

[00:34:55] SESSION END`,
  },
  {
    id: "community-ama-sep-2024",
    episodeNumber: "Episode 22",
    title: "Community AMA",
    date: "September 20, 2024",
    time: "7:00 PM UTC",
    duration: "55:15",
    participants: ["Host", "K. McCaffrey"],
    description: "Open community session on tokenomics, mining economics, governance, and long-term decentralization strategy with live attendee questions.",
    image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=85",
    youtubeUrl: "https://www.youtube.com/@QuaiNetwork",
    spotifyUrl: "https://open.spotify.com/",
    tags: [
      { label: "Mining", transcriptTerm: "early miners" },
      { label: "Governance", transcriptTerm: "governance work" },
      { label: "Standards", transcriptTerm: "ERC-404" },
      { label: "Adoption", transcriptTerm: "biggest risk" },
    ],
    rawText: `[QUAI COMMUNITY AMA — SEPTEMBER 20, 2024]
[00:00:00] SESSION START

[00:00:22] [HOST]: Welcome everyone to the September community AMA. K. McCaffrey is joining us directly from the Quai Foundation.

[00:00:41] [K. MCCAFFREY]: Great to be here. We've had a huge month — lots of community questions came in, so let's get into them.

[00:02:05] [HOST]: First question from the community: will there be a Qi allocation for early miners?

[00:02:18] [K. MCCAFFREY]: We don't comment on specific tokenomics events before they're confirmed. What I can say is that early mining participation matters. The network rewards those who contribute real hash power. Allocation mechanics will be clear before mainnet.

[00:10:30] [HOST]: How does governance work on Quai?

[00:10:44] [K. MCCAFFREY]: QUAI holders participate in governance. For now, major protocol parameters still require core team involvement. The goal is to progressively decentralize — similar to how Ethereum has evolved. We expect meaningful on-chain governance within 18 months of mainnet stability.

[00:19:15] [HOST]: Will Quai support ERC-404 or hybrid token standards?

[00:19:28] [K. MCCAFFREY]: EVM compatibility means anything that runs on Ethereum can run on a Quai zone chain. ERC-404 implementations would work technically. Whether it makes sense economically — that's a community discussion. We're standard-agnostic at the protocol level.

[00:31:05] [HOST]: Last question: what's the biggest risk to the project?

[00:31:20] [K. MCCAFFREY]: Honest answer: developer adoption speed. The technology works. The economics work. The challenge is tooling maturity and developer experience. Every month we ship better SDK docs, better RPC infrastructure, better debugging tools. That's what matters most right now.

[00:55:00] [HOST]: Thank you K. Incredible session from start to finish.

[00:55:10] SESSION END`,
  },
];

export const podcastEpisodes = [
  {
    ep: "EP 24",
    title: "The Hash Economy: Understanding Qi Tokenomics",
    duration: "54:22",
    date: "Dec 10, 2024",
    desc: "Deep dive into how Qi token supply is algorithmically adjusted based on mining difficulty and energy markets.",
    imgSeed: "podcast-qi-economy",
  },
  {
    ep: "EP 23",
    title: "Building on Quai: Developer Experience in 2025",
    duration: "41:08",
    date: "Nov 26, 2024",
    desc: "Lead engineers discuss tooling, SDK improvements, and what's coming in the next developer update.",
    imgSeed: "podcast-dev-exp",
  },
  {
    ep: "EP 22",
    title: "Merged Mining Explained: The Technical Deep Dive",
    duration: "1:02:45",
    date: "Nov 12, 2024",
    desc: "A technical breakdown of how merged mining enables 13 parallel chains without duplicating security spend.",
    imgSeed: "podcast-merged-mining",
  },
  {
    ep: "EP 21",
    title: "Cross-Chain Bridges: Trustless Interoperability",
    duration: "38:55",
    date: "Oct 29, 2024",
    desc: "Exploring threshold signatures, zone-chain escrow, and the path to fully trustless external bridging without wrapped assets.",
    imgSeed: "podcast-cross-chain",
  },
  {
    ep: "EP 20",
    title: "Decentralization Benchmarks: How We Measure It",
    duration: "47:30",
    date: "Oct 15, 2024",
    desc: "Herfindahl index, geographic hash distribution, and the concrete metrics that determine if a network is actually decentralized.",
    imgSeed: "podcast-decentralize",
  },
  {
    ep: "EP 19",
    title: "Zone Chain Performance: Q3 2024 Results",
    duration: "33:20",
    date: "Sep 30, 2024",
    desc: "Full walkthrough of Q3 testnet metrics: throughput peaks, reorg rates, and miner participation across all nine zone chains.",
    imgSeed: "podcast-q3-results",
  },
];
