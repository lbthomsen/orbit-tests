This folder contains node.js test code I used to dig into the function and limitation of database replication in OrbitDB. Three folders contain code for three classes of nodes. Each one is based on [this event log example](https://github.com/orbitdb/orbit-db/blob/master/examples/eventlog.js).

## Test 1 - Replication Behind a Firewall

- The master-node is considered the 'first' node. The one that initially creates the database and sets write access to it. It is assumed this node is running on an un-firewalled server, like a Digital Ocean Droplet.

- The peer-node is assumed to also be an un-firewalled server. It is also assumed that the peer has some way to explicitly retrieve the IPFS peer ID hash of the *master node* and the OrbitDB address needed to replicate the database. In this example, these are saved as constants at the top of the file.

- The firewalled node is assumed to be run on a computer behind a firewall, so it doesn't have open ports to the internet. It depends on Circuit Relay settings of the peer-node and master-node to communicate with other nodes in the network.

## Test 2 - Circuit Relay Between Two Firewalled Peers

- The Circuit Relay node (cr-node) is similar to the firewalled node, as it is expected to be behind a firewall. The circuit-relay features of the master node are used to connect to the firewalled node.
