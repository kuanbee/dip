# dip

Decorator only DI for typescript.

Leveraging on typescript and its experimental features: *decorators* & *metadata*. Dependency injection is made possible with just using decorator on property, class and accesors.

# example

```typescript
import * as dip from "../lib/dip"

@dip.providerOf('father')
class Father {
    public say():string {
        return 'I am your father.';
    }
}

@dip.providerOf('son')
class Son {
    public say():string {
        return 'NOOOoooooooo!!!111';
    }
}

@dip.hasDependant
class Family {
    @dip.dependsOn('father')
    public father:Father;
    
    @dip.relayOf('son')
    public get son():Son {
        return undefined;
    };

    public issue():string {
        return 'Father: ' + this.father.say() + '\nSon: ' + this.son.say();
    }
}
```

Rest assured that if you ask what's the family issue here, it will output
```
Father: I am your father.
Son: NOOOoooooooo!!!111
```

# Then?

That's it. If you like it, feel free to use it and modify the way you like. You may contribute back to this repro, I will try my best to keep it up.
