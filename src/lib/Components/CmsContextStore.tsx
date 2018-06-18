
export type ContextData = {[index: string]: any }

type IStoreChangeListener = (newState: ContextData) => void;

type IStoreSubscription = {
    callback: IStoreChangeListener;
};

type IQueuedUpdate = {
    name: string;
    newData: any;
};

export interface ICmsContextStore {
    setData: (name: string, newData: any) => void;
    subscribe(listener: IStoreChangeListener): () => void;
    getCurrentContext(): ContextData;
}

export class CmsContextStore implements ICmsContextStore {
    subscriptions: IStoreSubscription[] = [];
    currentContext: ContextData;
    setData: (name: string, newData: any) => void;
    updateQueue: IQueuedUpdate[] = [];
    isUpdating = false;
    constructor(initialContext: ContextData = {}) {
        this.currentContext = initialContext;
        //a bound version of updateData
        this.setData = (name: string, newData: any) => { this.updateData(name, newData); };
    }
    unsubscribe(subscription: IStoreSubscription) {
        var idx = this.subscriptions.indexOf(subscription);
        if (idx < 0)
            return;
        this.subscriptions.splice(idx, 1);
    }
    subscribe(listener: IStoreChangeListener): () => void {
        var subscription = { callback: listener };
        this.subscriptions.push(subscription);
        return () => this.unsubscribe(subscription);
    }
    getCurrentContext(): ContextData {
        return this.currentContext;
    }
    notifyListeners() {
        var state = this.currentContext;
        var callbacks = this.subscriptions.slice();
        callbacks.forEach((subscription: IStoreSubscription) => subscription.callback(state));
    }
    updateData(name: string, newData: any) {
        this.updateQueue.push({ name: name, newData: newData });
        if (this.isUpdating)
            return;
        this.isUpdating = true;
        var updateLoops = 0;
        while (this.updateQueue.length > 0) {
            //perform all pending updates before notify
            for (var update = this.updateQueue.shift(); update; update = this.updateQueue.shift()) {
                this.currentContext = {
                    ...this.currentContext,
                    [update.name]: update.newData
                };
                console.log("updated context:", update);
            }
            //notify listeners may result in more updates
            this.notifyListeners();
            //break any infinite loops
            updateLoops = updateLoops + 1;
            if (updateLoops > 10) {
                console.error("Encountered more than 1000 updates in a row so bailing. current update queue:", this.updateQueue);
                return;
            }
        }
        this.isUpdating = false;
    }
}