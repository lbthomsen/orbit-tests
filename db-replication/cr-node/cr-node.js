'use strict'

// CUSTOMIZE THESE VARIABLES
const FIREWALL_PEER_HASH = "QmUrGqa9ZFjg1rYcqpnxHdkPFn2e1GKmkV1F9s5vFrVB5V"
const FIREWALL_PEER_MULTIADDR = `/p2p-circuit/ipfs/${FIREWALL_PEER_HASH}`
const MASTER_MULTIADDR = "/ip4/162.243.158.213/tcp/4002/ipfs/QmQWgBQWpJkf93NW7rgVvycmot6arDxtuJGnArbyuznC6b"
const DB_ADDRESS = "/orbitdb/QmdSeUenVxgwsgbo3ZidV2oxW1RFr5XxGNfVtSRN4p4Eda/example5343234"

const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')

const creatures = ['🐙', '🐷', '🐬', '🐞', '🐈', '🙉', '🐸', '🐓']

console.log("Starting...")

const ipfs = new IPFS({
  repo: './orbitdb/examples/ipfs',
  start: true,
  EXPERIMENTAL: {
    pubsub: true,
  },
  relay: {
    enabled: true, // enable circuit relay dialer and listener
    hop: {
      enabled: true // enable circuit relay HOP (make this node a relay)
    }
  },
  pubsub: true
})

ipfs.on('error', (err) => console.error(err))

ipfs.on("replicated", () => {
      console.log(`replication event fired`);
})

ipfs.on('ready', async () => {
  let db

  await ipfs.swarm.connect(MASTER_MULTIADDR)
  console.log(`Connected to Master node`)

  await sleep(10000)

  console.log(`Attempting to connect to firewalled peer ${FIREWALL_PEER_MULTIADDR}`)
  await ipfs.swarm.connect(FIREWALL_PEER_MULTIADDR)
  console.log(`Connected to firewalled peer node`)


  try {
    const orbitdb = new OrbitDB(ipfs, './orbitdb/examples/eventlog')
    db = await orbitdb.eventlog(DB_ADDRESS)
    await db.load()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  const query = async () => {
    const index = Math.floor(Math.random() * creatures.length)
    const userId = Math.floor(Math.random() * 900 + 100)

    try {
      const entry = { avatar: creatures[index], userId: userId }
      console.log(`Adding ${entry.avatar} ${entry.userId} to DB.`)
      await db.add(entry)
      const latest = db.iterator({ limit: 5 }).collect()
      let output = ``
      output += `[Latest Visitors]\n`
      output += `--------------------\n`
      output += `ID  | Visitor\n`
      output += `--------------------\n`
      output += latest.reverse().map((e) => e.payload.value.userId + ' | ' + e.payload.value.avatar + ')').join('\n') + `\n`
      console.log(output)
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }

  setInterval(query, 1000*30)
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
