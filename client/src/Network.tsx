import Blockchain from './Blockchain';

import { Socket, Channel } from 'phoenix';
import Block from './models/Block';

export enum Messages {
  QUERY_LATEST = 'QUERY_LATEST',
  BLOCKCHAIN_RESPONSE = 'BLOCKCHAIN_RESPONSE',
  QUERY_ALL = 'QUERY_ALL'
}

export default class Network {
  callback: (currentBlockchain: Block[]) => void;
  blockchain: Blockchain;
  socket: Socket;
  channel: Channel;

  constructor() {
    this.blockchain = new Blockchain();
    this.socket = new Socket('ws://localhost:4000/socket');
  }

  initiate(callback: (currentBlockchain: Block[]) => void): void {
    this.callback = callback;

    this.socket.connect();

    this.channel = this.socket.channel('peers');
    this.channel.on(Messages.QUERY_LATEST, () => this.pushLatestBlock());
    this.channel.on(Messages.QUERY_ALL, () =>
      this.channel.push(Messages.BLOCKCHAIN_RESPONSE, this.blockchain.blocks)
    );
    this.channel.on(Messages.BLOCKCHAIN_RESPONSE, response => {
      this.handleBlockchainResponse(response);
    });

    this.channel
      .join()
      .receive('ok', () => {
        console.log('successfully connected to peers channel');
        this.channel.push(Messages.QUERY_LATEST, {});
      })
      .receive('error', ({ reason }) =>
        console.log('failed to join peers channel', reason)
      )
      .receive('timeout', () =>
        console.log('Networking issue. Still waiting...')
      );
  }

  runBlockMine(data: string): void {
    this.blockchain.addBlockFromData(data);
    this.pushLatestBlock();
  }

  private pushLatestBlock(): void {
    this.channel.push(Messages.BLOCKCHAIN_RESPONSE, {
      data: [this.blockchain.getLatestBlock()]
    });
    this.callback(this.blockchain.blocks);
  }

  private handleBlockchainResponse(message: { data: Block[] }): void {
    var receivedBlocks = message.data.sort((b1, b2) => b1.index - b2.index);
    var latestBlockReceived = receivedBlocks[receivedBlocks.length - 1];
    var latestBlockHeld = this.blockchain.getLatestBlock();
    if (latestBlockReceived.index > latestBlockHeld.index) {
      console.log(
        'blockchain possibly behind. We got: ' +
          latestBlockHeld.index +
          ' Peer got: ' +
          latestBlockReceived.index
      );
      if (latestBlockHeld.hash === latestBlockReceived.previousHash) {
        console.log('We can append the received block to our chain');
        this.blockchain.add(latestBlockReceived);
        this.pushLatestBlock();
      } else if (receivedBlocks.length === 1) {
        console.log('We have to query the chain from our peer');
        this.channel.push(Messages.QUERY_ALL, {});
      } else {
        console.log('Received blockchain is longer than current blockchain');
        this.blockchain.replaceChain(receivedBlocks);
        this.pushLatestBlock();
      }
    }
    this.callback(this.blockchain.blocks);
  }
}