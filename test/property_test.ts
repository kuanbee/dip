import chai = require("chai");
const should = chai.should();

import * as dip from "../lib/dip"

@dip.providerOf("base")
class Base {
    private m_Material:string;
    public set material(value:string){
        this.m_Material = value;
    }

    constructor() {
        this.m_Material = "plain flour";
    }

    public bakeWith():string {
        return this.m_Material;
    }
}

@dip.providerOf("top")
class Top {
    private m_Material:string;
    public set material(value:string){
        this.m_Material = value;
    }

    constructor() {
        this.m_Material = "vanilla cream";
    }

    public bakeWith():string {
        return this.m_Material;
    }
}

@dip.providerOf("decor")
class Decor {
    private m_Material:string;
    public set material(value:string){
        this.m_Material = value;
    }

    constructor() {
        this.m_Material = "biscult bits";
    }

    public bakeWith():string {
        return this.m_Material;
    }
}

@dip.hasDependant
class BakerHouse {
    @dip.dependsOn('base')
    private m_Base:Base;

    @dip.dependsOn('top')
    private m_Top:Top;

    @dip.dependsOn('decor')
    private m_Decor:Decor;

    constructor() {}

    public BakeMeACake():string {
        let theCake:string = "";
        theCake += "Base is made of " + this.m_Base.bakeWith();
        theCake += "\nTop layer is made of " + this.m_Top.bakeWith();
        theCake += "\nDecor is made of " + this.m_Decor.bakeWith();
        return theCake;
    }
}

describe('Property DI: baker', () => {
    it('bake a default cake', () => {
        let boringBakerHouse = new BakerHouse();
        boringBakerHouse.BakeMeACake().should.equal(
`Base is made of plain flour
Top layer is made of vanilla cream
Decor is made of biscult bits`
        );
    });
    it('bake a delicious cake', () => {
        let cheese:Base = new Base();
        cheese.material = "cheezy cheese";
        let choco:Top = new Top();
        choco.material = "dark rich chocalate";
        let cheery:Decor = new Decor();
        cheery.material = "fresh cheery";

        dip.registerInstance('base', cheese);
        dip.registerInstance('top', choco);
        dip.registerInstance('decor', cheery);

        let fancyBakerHouse = new BakerHouse();
        fancyBakerHouse.BakeMeACake().should.equal(
`Base is made of cheezy cheese
Top layer is made of dark rich chocalate
Decor is made of fresh cheery`);        
    })
})