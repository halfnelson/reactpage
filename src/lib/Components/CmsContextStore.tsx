
export type ContextData = {[index: string]: any }

type IStoreChangeListener = (newState: ContextData) => void;

type IStoreSubscription = {
    callback: IStoreChangeListener;
};

export interface ICmsContextStore {
    setData: (partialData: ContextData) => void;
    subscribe(listener: IStoreChangeListener): () => void;
    getCurrentContext(): ContextData;
    createChildContextStore(uniqueName: string, initialContext: ContextData): ICmsContextStore;
}

interface ContextCache {
    data: ContextData,
    childCaches: {[index: string]: ContextCache}
}


export class CmsContextStore implements ICmsContextStore {
    subscriptions: IStoreSubscription[] = [];
    childStores: { [index: string]: ICmsContextStore } = {};
    currentContext: ContextData;
    cache: ContextCache;
    setData: (partialData: ContextData) => void;
    updateQueue: ContextData[] = [];
    isUpdating = false;
    constructor(initialContext: ContextData = {}, cache: ContextCache = null) {
        this.cache = cache;
        this.currentContext = (cache && cache.data) || initialContext;
        this.setData = (partialData: ContextData) => { this.updateData(partialData); };
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
    createChildContextStore(uniqueName: string, initialContext: ContextData = {}): ICmsContextStore {
        var cache = this.cache && this.cache.childCaches && this.cache.childCaches[uniqueName]
        var childStore = new CmsContextStore(initialContext, cache);
        this.childStores[uniqueName] = childStore;
        return childStore;
    }

    updateData(partialData: ContextData) {
        console.log("queueing partial update");
        this.updateQueue.push(partialData);
        if (this.isUpdating) {
            return;
        }
        console.log("processing partial updates",this.updateQueue.length);
        this.isUpdating = true;
        var updateLoops = 0;
        while (this.updateQueue.length > 0) {
            //perform all pending updates before notify
            for (var update = this.updateQueue.shift(); update; update = this.updateQueue.shift()) {
                this.currentContext = {
                    ...this.currentContext,
                    ...update
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