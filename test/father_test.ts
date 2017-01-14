import chai = require("chai");
const should = chai.should();
import sinon = require('sinon');

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
    @dip.dependsOn('son')
    public son:Son;

    public issue():string {
        return 'Father: ' + this.father.say() + '\nSon: ' + this.son.say();
    }
}

describe('Family issue', () => {
    it('Skywalkers', () => {
        let skywalkers = new Family();
        skywalkers.issue().should.equal(
`Father: I am your father.
Son: NOOOoooooooo!!!111`
        );
    });
    it('Lannisters', () => {
        let father = new Father();
        sinon.stub(father, "say", () => {
            return 'You are no son of mine!';
        });
        let son = new Son();
        sinon.stub(son, "say", () => {
            return 'I am your son. I have always been your son.'
        });

        dip.registerInstance('father', father);
        dip.registerInstance('son', son);

        let lannisters = new Family();
        lannisters.issue().should.equal(
`Father: You are no son of mine!
Son: I am your son. I have always been your son.`
        );
    });
})