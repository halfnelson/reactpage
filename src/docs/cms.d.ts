/// <reference types="react" />
declare module "Components/CmsComponentRegistry" {
    import * as React from "react";
    class ComponentRegistry {
        components: Map<string, React.ComponentType<any>>;
        register(name: string, component: React.ComponentType<any>): void;
        get(name: string): React.ComponentType<any>;
    }
    export var componentRegistry: ComponentRegistry;
}
declare module "Helpers/PropBindingHelper" {
    export enum PropBindingType {
        Dynamic = 0,
        Static = 1
    }
    export interface PropBindingConfig {
        type: PropBindingType;
        propertyName: string;
        bindingExpression: string;
    }
    export function resolveBindingExpression(bindingExpression: string, context: any): any;
    export function resolvePropBindings(propBindings: PropBindingConfig[], context: any): any;
}
declare module "Components/CmsComponent" {
    import * as React from 'react';
    import { PropBindingConfig } from "Helpers/PropBindingHelper";
    export interface ICmsComponentConfig {
        className: string;
        propBindings: PropBindingConfig[];
    }
    export function ReactComponent({ componentClass, props, children }: {
        componentClass: React.ComponentType<any>;
        props: {
            [index: string]: any;
        };
        children?: React.ReactNode;
    }): React.ReactElement<any>;
    export function BoundReactComponent({ componentClass, propBindings, bindingContext, children, key }: {
        componentClass: React.ComponentType<any>;
        propBindings?: PropBindingConfig[];
        bindingContext?: any;
        children?: React.ReactNode;
        key?: any;
    }): React.ReactElement<any>;
    export const CmsComponent: ({ componentClassName, ...props }: {
        [index: string]: any;
    }) => React.ReactElement<any>;
    export const CmsStaticComponent: ({ componentClassName, ...props }: {
        [index: string]: any;
    }) => React.ReactElement<any>;
    export function CmsComponentFromConfig({ config, bindingContext, ...props }: {
        config: ICmsComponentConfig;
        bindingContext: any;
    }): React.ReactElement<any>;
}
declare module "Components/CmsComponentContext" {
    import * as React from "react";
    import { ICmsComponentConfig } from "Components/CmsComponent";
    export type ContextData = {
        [index: string]: any;
    };
    export interface ICmsComponentContext {
        data: ContextData;
        componentConfig: {
            [index: string]: ICmsComponentConfig;
        };
        setData(name: string, newData: any): void;
    }
    export const CmsComponentContext: React.Context<ICmsComponentContext>;
    export class CmsComponentContextContainer extends React.Component<{
        baseContext: ICmsComponentContext;
    }, ICmsComponentContext> {
        updateData: (name: string, newData: any) => void;
        constructor(props: {
            baseContext: ICmsComponentContext;
        });
        render(): JSX.Element;
    }
    export function CmsComponentFromContext({ componentId, componentContext, ...props }: {
        componentId: string;
        componentContext: ICmsComponentContext;
    }): React.ReactElement<any>;
    export function CmsComponentFromId(props: {
        componentId: string;
    }): JSX.Element;
    export function CmsComponentList({ childComponentIds, ...props }: {
        childComponentIds: string[];
    }): JSX.Element;
}
declare module "Components/CmsComponentSlot" {
    import { ICmsComponentContext } from "Components/CmsComponentContext";
    export function CmsComponentFromSlot({ slotId, componentContext, ...props }: {
        slotId: string;
        componentContext: ICmsComponentContext;
    }): JSX.Element;
    export function CmsComponentSlot({ slotId, ...props }: {
        slotId: string;
    }): JSX.Element;
}
declare module "Components/index" {
    export * from "Components/CmsComponentRegistry";
    export * from "Components/CmsComponentContext";
    export * from "Components/CmsComponent";
    export * from "Components/CmsComponentSlot";
}
declare module "Datasources/IndexedDatasource" {
    import * as React from "react";
    interface IIndexedDatasourceProps {
        setData(name: string, newData: any): void;
        data: any;
        index: any;
        name: string;
    }
    export class IndexedDatasource extends React.Component<IIndexedDatasourceProps> {
        constructor(props: IIndexedDatasourceProps);
        componentDidUpdate(prevProps: IIndexedDatasourceProps): void;
        updateContext(): void;
        componentDidMount(): Promise<void>;
        render(): JSX.Element;
    }
}
declare module "Datasources/StaticDatasource" {
    import * as React from "react";
    interface IStaticDatasourceProps {
        setData(name: string, newData: any): void;
        data: any;
        name: string;
    }
    export class StaticDatasource extends React.Component<IStaticDatasourceProps> {
        componentDidMount(): Promise<void>;
        render(): JSX.Element;
    }
}
declare module "Datasources/index" {
    export * from "Datasources/IndexedDatasource";
    export * from "Datasources/StaticDatasource";
}
declare module "cms" {
    export * from "Components/index";
    export * from "Datasources/index";
    export * from "Helpers/PropBindingHelper";
}
