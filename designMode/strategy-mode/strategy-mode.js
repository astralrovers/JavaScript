class Bonus {
    constructor(strategy = null) {
        this.strategy = strategy;
    }
    
    getBonus() {
        return this.strategy.calculate();
    }
}

class StrategyVir {
    constructor(salary) {
        this.salary = salary;
    }
    
    calculate() {
        return this.salary;
    }
}

class performanceS extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 4;
    }
}

class performanceA extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 3;
    }
}

class performanceB extends StrategyVir{
    constructor(salary) {
        super(salary);
    }
    calculate() {
        return this.salary * 2;
    }
}

let bonus = new Bonus(new performanceS(15000));
console.log("S : ", bonus.getBonus());

bonus.strategy = new performanceA(15000);
console.log("A : ", bonus.getBonus());

bonus.strategy = new performanceB(15000);
console.log("B : ", bonus.getBonus());


let strategies = {
    'S' : (salary) => {
        return salary * 4;
    },
    'A' : (salary) => {
        return salary * 3;
    },
    'B' : (salary) => {
        return salary * 2;
    },
};

function calculateBonus(level, salary) {
    return strategies[level](salary);
}

console.log(calculateBonus('S', 15000));
