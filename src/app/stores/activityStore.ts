import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  loading = false;
  loadingIinitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  get groupedActivities() {
    return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
      const date = format(activity.date, 'dd MMM yyyy');
      if (!activities[date]) {
        activities[date] = [activity];
      } else {
        activities[date].push(activity);
      }
      return activities;
    }, {} as { [key: string]: Activity[] }));
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
    this.activityRegistry.set(activity.id, { ...activity, date: new Date(activity.date) })
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
    } finally {
      this.setLoading(false);
    }
    return activity;
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
    } finally {
      this.setLoading(false);
    }
    return activity;
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
