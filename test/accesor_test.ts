import chai = require("chai");
const should = chai.should();

import * as dip from "../lib/dip"

class Database {
    private m_TimeTaken:number;
    public set timetaken(value:number) {
        this.m_TimeTaken = value;
    }

    public doSomeOperationAndReturnTimeTaken():number {
        return this.m_TimeTaken;
    }
}

class WebService {
    @dip.relayOf('db')
    private static get db():Database {
        return undefined;
    }

    public static servicing():number {
        return WebService.db.doSomeOperationAndReturnTimeTaken();
    }
}

describe('Accesor DI: web service', () => {
    it('slow full fedge database is time consuming.', () => {
        let slowDB:Database = new Database();
        slowDB.timetaken = 999999;

        dip.registerInstance('db', slowDB);

        WebService.servicing().should.equal(999999);
    });
    it('fake light database is faster.', () => {
        let fastDB:Database = new Database();
        fastDB.timetaken = 1;

        dip.registerInstance('db', fastDB);

        WebService.servicing().should.equal(1);
    });
})