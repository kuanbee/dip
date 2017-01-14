import "reflect-metadata";

// Instance registration
export function registerInstance(relationship:string, instance:any){
    dip.registerInstance(relationship, instance);
}

// Decorator: Use on property that require dependency injection
export function dependsOn(relationship:string) {
    return function (target:any, propertyKey:string){
        Reflect.defineMetadata(propertyKey, relationship, target);
    }
}

// Decorator: Use on class that contains property required dependency injection
export function hasDependant(ctor:Function) {
    let newCtor : any = function (...args) {
        dip.assignProviderToClass(this);
        return ctor.apply(this, args);
    }

    newCtor.prototype = ctor.prototype;
    return newCtor;
}

// Decorator: Use on get() accesor to relay the get to get actual instance
export function relayOf(relationship:string) {
    return function (target:any, propertyKey:string, descriptor:PropertyDescriptor){
        dip.assignProviderToAccessor(descriptor, relationship);
    }
}

// Decorator: Use on class whose instance will be injected to other class
export function providerOf(relationship:string) {
    return function(ctor:Function) {
        dip.registerClass(relationship, ctor);
    }
}

class dip {
    private static instances:any[] = [];
    private static classes:any[] = [];

    public static assignProviderToClass(target:any) {
        let keys = Reflect.getMetadataKeys(target);
        for (let k of keys) {
            let metadata = Reflect.getMetadata(k, target);
            let instance = dip.getInstance(metadata);
            if (instance == undefined)
                console.warn(k + " depending on " + metadata + " but no instance nor class defined for it.");                
            else
                target[k] = instance;
        }
    }

    public static assignProviderToAccessor(descriptor:PropertyDescriptor, relationship:string){
        descriptor.get = function() {
            return dip.getInstance(relationship);
        }
    }

    public static registerInstance(relationship:string, instance:any, force:boolean = true){
        if (dip.instances[relationship] != undefined && !force)
            console.warn(relationship + " was already has a instance registered. Replacing the old one now.");
        dip.instances[relationship] = instance;
    }

    public static registerClass(relationship:string, klass:any){
        if (dip.classes[relationship] != undefined)
            console.warn(relationship + " was already has a provider registered. Replacing the old one now.");
        dip.classes[relationship] = klass;        
    }

    private static getInstance(relationship:string):any{
        let instance = dip.instances[relationship];
        if (instance == undefined && dip.classes[relationship] != undefined) {
            instance = new dip.classes[relationship]();
            if (instance != undefined)
                dip.registerInstance(relationship, instance);
        }
        return instance;
    }
}
