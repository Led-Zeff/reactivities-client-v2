import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { ChatComment } from '../models/comment';
import { store } from './store';

export default class CommentStore {
  comments: ChatComment[] = [];
  hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  createHubConnection = (activityId: string) => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_CHAT_URL + '?activityId=' + activityId, {
          accessTokenFactory: () => store.userStore.user?.token!
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection.start().catch(console.log);
      this.hubConnection.on('LoadComments', (comments: ChatComment[]) => {
        runInAction(() => this.comments = comments.map(comment => {
          comment.createdAt = new Date(comment.createdAt + 'Z');
          return comment;
        }));
      });

      this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
        runInAction(() => this.comments.unshift({...comment, createdAt: new Date(comment.createdAt)}));
      })
    }
  };

  stopHubConnection = () => {
    this.hubConnection?.stop().catch(console.log);
  };

  clearComments = () => {
    this.comments = [];
    this.stopHubConnection();
  }

  addComment = async (body: string) => {
    const activityId = store.activityStore.selectedActivity?.id;
    try {
      await this.hubConnection?.invoke('SendComment', { body, activityId });
    } catch (error) {
      console.log(error);
    }
  };
}
