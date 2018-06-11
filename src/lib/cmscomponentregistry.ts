class ComponentRegistry  {
    components: Map<string, React.ComponentType<any>> = new Map()

    register(name: string, component: React.ComponentType<any>) {
        this.components.set(name,component)
    }

    get(name: string) {
        return this.components.get(name)
    }
}
export var componentRegistry = new ComponentRegistry();
