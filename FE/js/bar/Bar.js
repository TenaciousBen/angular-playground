import FooModule from "../foo/Foo";

class Bar extends FooModule.Foo {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
}