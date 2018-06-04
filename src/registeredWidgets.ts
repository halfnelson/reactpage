class RegisteredWidgets  {
    widgets: Map<string, React.ComponentType<any>> = new Map()

    add(name: string, widget: React.ComponentType<any>) {
        this.widgets.set(name,widget)
    }

    get(name: string) {
        return this.widgets.get(name)
    }
}
export var widgets = new RegisteredWidgets();

