import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {BoardState} from "../models/board-state";

@Injectable({
    providedIn: 'root',
})
export class WebSocketService{

    private stompClient: Client | undefined;
    private isConnected = false;

    init(){
        const socket = new SockJS('http://localhost:9090/request');
        console.log("WSS socket", socket);

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WSS Connected to WebSocket');
                this.isConnected = true;
            },
            onDisconnect: () => {
                console.log('WSS Disconnected from WebSocket');
                this.isConnected = false;
            },
        });

        console.log("WSS stompclient:" , this.stompClient);

        this.stompClient.activate();
    }

    destroy(){
        this.stompClient?.deactivate();
    }

    sendMessage(move: number) {
        if (!this.isConnected || !this.stompClient) {
            console.error('WSS Cannot send message. WebSocket is not connected or stompClient is undefined.', this.stompClient);
            return;
        }

        this.stompClient.publish({
            destination: '/request',
            body: JSON.stringify({ move })
        });
    }

    subscribeToBoardState(callback: (boardState: BoardState) => void) {
        this.stompClient?.subscribe('/answer', (message: Message) => {
            const boardState: BoardState = JSON.parse(message.body).boardState;

            console.log('subscribed WSS Received:', message.body);
            callback(boardState);
        });
    }


}
