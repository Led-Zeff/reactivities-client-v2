import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  editMode = false;
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
      activities.forEach(a => this.activityRegistry.set(a.id, { ...a, date: a.date.split('T')[0] }));
    } catch (e) {
      console.error(e);
    }
    this.setLoadingInitial(false);
  }
  
  setLoadingInitial = (state: boolean) => this.loadingIinitial = state;

  selectActivity = (id: string) => this.selectedActivity = this.activityRegistry.get(id);

  cancelSelectedActivity = () => this.selectedActivity = undefined;

  openForm = (id?: string) => {
    id ? this.selectActivity(id) : this.cancelSelectedActivity();
    this.editMode = true;
  };

  closeForm = () => this.editMode = false;

  setLoading = (state: boolean) => this.loading = state;

  createActivity = async (activity: Activity) => {
    this.setLoading(true);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
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
        this.selectedActivity = activity;
        this.editMode = false;
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
        if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
      });
    } catch (error) {
      console.log(error);
    }
    this.setLoading(false);
  };
}
