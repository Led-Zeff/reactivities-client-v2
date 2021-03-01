import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  loading = false;
  loadingIinitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  loadActivites = async () => {
    try {
      const activities = await agent.Activities.list();
      activities.forEach(this.addToRegistry);
    } catch (e) {
      console.error(e);
    }
    this.setLoadingInitial(false);
  }

  loadActivity =  async (id: string) =>
    this.activityRegistry.get(id)
      ?? await this.getActivity(id);

  private getActivity = async (id: string) => {
    this.setLoading(true);
    try {
      const activity = await agent.Activities.detail(id);
      this.addToRegistry(activity);
      return this.activityRegistry.get(id);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  };

  private addToRegistry = (activity: Activity) => {
    this.activityRegistry.set(activity.id, { ...activity, date: activity.date.split('T')[0] })
  }
  
  setLoadingInitial = (state: boolean) => this.loadingIinitial = state;

  setLoading = (state: boolean) => this.loading = state;

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (e) {
      console.error(e);
    }
    this.setLoading(false);
  };

  updateActivity = async (activity: Activity) => {
    this.setLoading(true);
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
      });
    } catch (error) {
      console.error(error);
    }
    this.setLoading(false);
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => { 
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    this.setLoading(false);
  };
}
