class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

export class PeopleService {
    constructor() {
        this.people = [new Person("Micky", 26), new Person("Paula", 57), new Person ("Jimmy", 23)];
    }

    getPeople() {
        return this.people;
    }

    setPeople(people) {
        this.people = people;
    }
}